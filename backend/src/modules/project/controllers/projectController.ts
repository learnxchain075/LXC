import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";
import { uploadFile } from "../../../config/upload";
import {
  projectSchema,
  taskSchema,
  taskStatusSchema,
  commentSchema,
  commentIdParamSchema,
  updateCommentSchema,
  updateProjectSchema,
  updateTaskSchema,
  projectIdParamSchema,
  taskIdParamSchema,
  githubRepoSchema,
  githubBranchSchema,
  workflowSchema,
  labelSchema,
  updateLabelSchema,
  labelIdParamSchema,
  githubTokenSchema,
} from "../../../validations/Module/ProjectManagement/projectValidation";

import { notifyWatchers } from "../helpers/notificationHelper";
import { TaskNotificationType, TaskStatus } from "@prisma/client";
import fetch from "node-fetch";
import { encrypt, decrypt } from "../../../utils/encryption";

const slugify = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.errors });
    }
    const { workflow, ...projData } = parsed.data;
    const project = await prisma.project.create({ data: projData });
    if (workflow && workflow.length > 0) {
      const wf = await prisma.workflow.create({
        data: {
          projectId: project.id,
          stages: {
            create: workflow.map((s) => ({ name: s.name, order: s.order })),
          },
        },
        include: { stages: true },
      });
      return res.status(201).json({ ...project, workflow: wf });
    }
    res.status(201).json(project);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const [projects, total] = await prisma.$transaction([
      prisma.project.findMany({
        skip,
        take: pageSize,
        include: {
          tasks: { include: { stage: true } },
          githubRepos: true,
          workflow: { include: { stages: true } },
        },
      }),
      prisma.project.count(),
    ]);

    if (req.query.page) {
      res.json({ data: projects, total });
    } else {
      res.json(projects);
    }
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = taskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.errors });
    }

    // Ensure no undefined values are sent to Prisma
    const { labelIds, ...rest } = parsed.data;

    const taskData: any = {
      ...rest,
      description: parsed.data.description ?? "",
      labels: labelIds ? { create: labelIds.map((id) => ({ labelId: id })) } : undefined,
    };
    if (typeof rest.checklist !== "undefined") {
      taskData.checklist = rest.checklist;
    }

    const task = await prisma.task.create({
      data: taskData,
      include: { stage: true, parent: true, epic: true, labels: { include: { label: true } } },
    });
    res.status(201).json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const sprintParam = req.query.sprintId as string | undefined;
    const assigneeId = req.query.assigneeId as string | undefined;
    const status = req.query.status as string | undefined;
    const issueType = req.query.issueType as string | undefined;
    const priority = req.query.priority as string | undefined;
    const label = req.query.label as string | undefined;
    const search = req.query.search as string | undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (typeof sprintParam !== "undefined") {
      where.sprintId = sprintParam === "null" ? null : sprintParam;
    }
    if (assigneeId) where.assignedToId = assigneeId;
    if (status) where.status = status;
    if (issueType) where.issueType = issueType;
    if (priority) where.priority = priority;
    if (label) {
      where.labels = { some: { labelId: label } };
    }
    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { id: search },
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      ];
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          comments: true,
          sprint: true,
          stage: true,
          subtasks: true,
          parent: true,
          epic: true,
          githubBranches: true,
          labels: { include: { label: true } },
        },
      }),
      prisma.task.count({ where }),
    ]);

    if (req.query.page) {
      res.json({ data: tasks, total });
    } else {
      res.json(tasks);
    }
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTaskCalendar = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const userId = req.query.userId as string | undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (userId) where.assignedToId = userId;

    const tasks = await prisma.task.findMany({
      where,
      select: { id: true, title: true, startDate: true, endDate: true, deadline: true },
    });

    const now = new Date();
    const soon = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const result = tasks.map((t) => {
      const end = t.endDate || t.deadline || undefined;
      return {
        id: t.id,
        title: t.title,
        startDate: t.startDate,
        endDate: end,
        dueSoon: end ? end > now && end <= soon : false,
        overdue: end ? end < now : false,
      };
    });
    res.json(result);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const task = await prisma.task.findUnique({
      where: { id: params.data.id },
      include: {
        stage: true,
        subtasks: true,
        parent: true,
        epic: true,
        timelineLogs: true,
        comments: true,
        attachments: true,
        githubBranches: true,
        labels: { include: { label: true } },
      },
    });
    res.json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTimelineLogs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const logs = await prisma.timelineLog.findMany({
      where: { taskId: params.data.id },
      orderBy: { timestamp: "asc" },
    });
    res.json(logs);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = taskStatusSchema.safeParse({ ...req.params, ...req.body });
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.errors });
    }
    const { id, stageId } = parsed.data;
    const task = await prisma.task.update({ where: { id }, data: { stageId }, include: { stage: true } });
    await prisma.timelineLog.create({
      data: {
        taskId: id,
        action: "STATUS_CHANGE",
        details: `Moved to ${task.stage?.name ?? ""}`,
      },
    });
    await notifyWatchers(id, TaskNotificationType.UPDATED, `Task moved to ${task.stage?.name ?? ""}`);
    res.json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = commentSchema.safeParse({ ...req.params, ...req.body });
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.errors });
    }
    const { id, authorId, content } = parsed.data;
    const comment = await prisma.comment.create({ data: { taskId: id, authorId, content } });
    await notifyWatchers(id, TaskNotificationType.COMMENTED, "New comment added");
    res.status(201).json(comment);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = commentIdParamSchema.safeParse(req.params);
    const body = updateCommentSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const comment = await prisma.comment.update({
      where: { id: params.data.id },
      data: { content: body.data.content },
    });
    res.json(comment);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = commentIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    await prisma.comment.delete({ where: { id: params.data.id } });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const addAttachment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }
    const uploaded = await uploadFile(file.buffer, "Task_Attachments", "raw", file.originalname);
    const attachment = await prisma.attachment.create({
      data: {
        taskId: params.data.id,
        fileName: file.originalname,
        url: uploaded.url,
      },
    });
    res.status(201).json(attachment);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const paramsResult = projectIdParamSchema.safeParse(req.params);
    const bodyResult = updateProjectSchema.safeParse(req.body);

    if (!paramsResult.success || !bodyResult.success) {
      return res.status(400).json({
        error: [
          ...(paramsResult.success ? [] : paramsResult.error.errors),
          ...(bodyResult.success ? [] : bodyResult.error.errors),
        ],
      });
    }

    const { id } = paramsResult.data;
    const project = await prisma.project.update({ where: { id }, data: bodyResult.data });
    res.json(project);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const paramsResult = projectIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.project.delete({ where: { id } });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const paramsResult = taskIdParamSchema.safeParse(req.params);
    const bodyResult = updateTaskSchema.safeParse(req.body);

    if (!paramsResult.success || !bodyResult.success) {
      return res.status(400).json({
        error: [
          ...(paramsResult.success ? [] : paramsResult.error.errors),
          ...(bodyResult.success ? [] : bodyResult.error.errors),
        ],
      });
    }

    const { id } = paramsResult.data;
    const existing = await prisma.task.findUnique({ where: { id } });
    const { labelIds, ...data } = bodyResult.data;
    const updateData: any = {
      ...data,
      labels: labelIds
        ? {
            deleteMany: {},
            create: labelIds.map((lid) => ({ labelId: lid })),
          }
        : undefined,
    };
    if (typeof data.checklist !== "undefined") {
      updateData.checklist = data.checklist;
    }
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: { stage: true, parent: true, epic: true, labels: { include: { label: true } } },
    });
    if (bodyResult.data.assignedToId && bodyResult.data.assignedToId !== existing?.assignedToId) {
      await prisma.timelineLog.create({
        data: {
          taskId: id,
          action: "ASSIGNEE_CHANGE",
          details: `Assigned to ${bodyResult.data.assignedToId}`,
        },
      });
    } else {
      await prisma.timelineLog.create({
        data: { taskId: id, action: "EDIT", details: "Task updated" },
      });
    }
    await notifyWatchers(id, TaskNotificationType.UPDATED, "Task updated");
    res.json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const paramsResult = taskIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const addGitHubRepo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    const body = githubRepoSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const [owner, repo] = body.data.repoName.split("/");
    if (!owner || !repo) {
      return res.status(400).json({ message: "Invalid repository name" });
    }
    const headers: any = {
      "User-Agent": "LXC-App",
      Authorization: `token ${body.data.token}`,
    };
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      return res.status(400).json({ message: "Unable to access repository" });
    }
    const repoJson: any = await repoRes.json();
    const branchesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, { headers });
    const branches = branchesRes.ok ? await branchesRes.json() : [];

    const encryptedToken = encrypt(body.data.token);

    const repoRecord = await prisma.gitHubRepo.upsert({
      where: { projectId: params.data.id },
      update: {
        repoName: body.data.repoName,
        repoUrl: repoJson.html_url,
        defaultBranch: repoJson.default_branch,
        token: encryptedToken,
      },
      create: {
        projectId: params.data.id,
        repoName: body.data.repoName,
        repoUrl: repoJson.html_url,
        defaultBranch: repoJson.default_branch,
        token: encryptedToken,
      },
    });
    res.status(201).json({ repo: repoRecord, branches });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createGitHubBranch = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    const body = githubBranchSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const task = await prisma.task.findUnique({
      where: { id: params.data.id },
      include: { project: { include: { githubRepos: true } } },
    });
    if (!task || !task.project.githubRepos[0]) {
      return res.status(400).json({ message: "GitHub repository not linked" });
    }
    const repo = task.project.githubRepos[0];
    const [owner, repoName] = repo.repoName.split("/");
    const base = body.data.base || repo.defaultBranch;
    const branchName = body.data.name || `feature/${task.id}-${slugify(task.title)}`;

    const headers: any = {
      "User-Agent": "LXC-App",
      Authorization: `token ${decrypt(repo.token)}`,
      Accept: "application/vnd.github+json",
    };

    // Get base branch commit sha
    const baseRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/ref/heads/${base}`, { headers });
    if (!baseRes.ok) {
      return res.status(400).json({ message: "Invalid base branch" });
    }
    const baseJson: any = await baseRes.json();
    const createRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/refs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseJson.object.sha }),
    });
    if (!createRes.ok) {
      const err = await createRes.text();
      return res.status(400).json({ message: "GitHub branch creation failed", error: err });
    }

    const url = `https://github.com/${owner}/${repoName}/tree/${branchName}`;
    const branch = await prisma.gitHubBranch.create({
      data: { taskId: params.data.id, name: branchName, url, prUrl: body.data.prUrl || null, status: body.data.status || null },
    });
    res.status(201).json(branch);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getWorkflow = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const workflow = await prisma.workflow.findUnique({
      where: { projectId: params.data.id },
      include: { stages: true },
    });
    res.json(workflow);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateWorkflow = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    const body = workflowSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res
        .status(400)
        .json({ errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)] });
    }
    await prisma.workflow.deleteMany({ where: { projectId: params.data.id } });
    const wf = await prisma.workflow.create({
      data: {
        projectId: params.data.id,
        stages: { create: body.data.map((s) => ({ name: s.name, order: s.order })) },
      },
      include: { stages: true },
    });
    res.json(wf);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const addProjectMember = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { userId, role } = req.body as { userId: string; role: string };
    const member = await prisma.projectMember.create({ data: { projectId: params.data.id, userId, role } });
    res.status(201).json(member);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const removeProjectMember = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse({ id: req.params.id });
    const userId = req.params.userId;
    if (!params.success || !userId) {
      return res.status(400).json({ errors: params.success ? [{ message: "userId required" }] : params.error.errors });
    }
    await prisma.projectMember.delete({ where: { projectId_userId: { projectId: params.data.id, userId } } });
    res.json({ message: "Removed" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getCurrentProjectRole = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(403).json({ message: "Forbidden" });
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: params.data.id, userId } },
    });
    res.json({ role: member?.role || null });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createLabel = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const body = labelSchema.safeParse({ ...req.body, projectId: req.params.id });
    const params = projectIdParamSchema.safeParse(req.params);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const label = await prisma.label.create({ data: body.data });
    res.status(201).json(label);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getLabels = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.errors });
    const labels = await prisma.label.findMany({ where: { projectId: params.data.id } });
    res.json(labels);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateLabel = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = labelIdParamSchema.safeParse(req.params);
    const body = updateLabelSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const label = await prisma.label.update({ where: { id: params.data.id }, data: body.data });
    res.json(label);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteLabel = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = labelIdParamSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.errors });
    await prisma.label.delete({ where: { id: params.data.id } });
    res.json({ message: "Label deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const watchTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    const userId = req.body.userId as string;
    if (!params.success || !userId) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const watcher = await prisma.taskWatcher.upsert({
      where: { taskId_userId: { taskId: params.data.id, userId } },
      update: {},
      create: { taskId: params.data.id, userId },
    });
    res.status(201).json(watcher);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const unwatchTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    const userId = req.body.userId as string;
    if (!params.success || !userId) {
      return res.status(400).json({ message: "Invalid request" });
    }
    await prisma.taskWatcher.delete({ where: { taskId_userId: { taskId: params.data.id, userId } } });
    res.json({ message: "Unwatched" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const notes = await prisma.taskNotification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { task: { select: { id: true, title: true } } },
    });
    res.json(notes);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const handleGitHubWebhook = async (req: Request, res: Response): Promise<any> => {
  const event = req.headers["x-github-event"];
  const payload = req.body;
  if (event === "pull_request") {
    const branchName = payload.pull_request.head.ref;
    const action = payload.action;
    const merged = payload.pull_request.merged;
    const prUrl = payload.pull_request.html_url;
    const gh = await prisma.gitHubBranch.findFirst({ where: { name: branchName } });
    if (gh) {
      await prisma.gitHubBranch.update({ where: { id: gh.id }, data: { prUrl, status: merged ? "merged" : action } });
      let status: TaskStatus | null = null;
      if (action === "opened") status = TaskStatus.REVIEW;
      else if (merged) status = TaskStatus.DONE;
      else if (action === "closed") status = TaskStatus.IN_PROGRESS;
      if (status) {
        await prisma.task.update({ where: { id: gh.taskId }, data: { status } });
        await prisma.timelineLog.create({
          data: { taskId: gh.taskId, action: "STATUS_CHANGE", details: `Status set to ${status}` },
        });
      }
    }
  } else if (event === "check_suite" || event === "check_run") {
    const branchName = payload.check_suite?.head_branch || payload.check_run?.check_suite?.head_branch;
    const conclusion = payload.check_suite?.conclusion || payload.check_run?.conclusion;
    if (branchName && conclusion) {
      const gh = await prisma.gitHubBranch.findFirst({ where: { name: branchName } });
      if (gh) {
        const status = conclusion === "success" ? "success" : "failed";
        await prisma.gitHubBranch.update({ where: { id: gh.id }, data: { status } });
      }
    }
  }
  res.json({ ok: true });
};

export const setGitHubToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const body = githubTokenSchema.safeParse(req.body);
    const userId = req.user?.id;
    if (!userId || !body.success) {
      return res.status(400).json({
        errors: body.success ? [] : body.error.errors,
      });
    }
    const encrypted = encrypt(body.data.token);
    await prisma.gitHubToken.upsert({
      where: { userId },
      update: { token: encrypted },
      create: { userId, token: encrypted },
    });
    res.status(201).json({ message: "Token saved" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getGitHubToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const record = await prisma.gitHubToken.findUnique({ where: { userId } });
    res.json({ hasToken: !!record });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const fetchTaskCIStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const task = await prisma.task.findUnique({
      where: { id: params.data.id },
      include: {
        githubBranches: true,
        project: { include: { githubRepos: true } },
      },
    });
    if (!task || !task.project.githubRepos[0]) {
      return res.status(404).json({ message: "GitHub data not found" });
    }
    const repo = task.project.githubRepos[0];
    const tokenRec = await prisma.gitHubToken.findUnique({ where: { userId: req.user?.id || "" } });
    const token = tokenRec ? decrypt(tokenRec.token) : decrypt(repo.token);
    const [owner, repoName] = repo.repoName.split("/");
    const headers: any = {
      "User-Agent": "LXC-App",
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
    };
    const statuses: any[] = [];
    for (const b of task.githubBranches) {
      const commitRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/commits/${b.name}`,
        { headers },
      );
      if (!commitRes.ok) continue;
      const commitJson: any = await commitRes.json();
      const sha = commitJson.sha;
      const statusRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/commits/${sha}/status`,
        { headers },
      );
      if (statusRes.ok) {
        const statusJson: any = await statusRes.json();
        const state = statusJson.state;
        statuses.push({ branchId: b.id, state });
        await prisma.gitHubBranch.update({ where: { id: b.id }, data: { status: state } });
      }
    }
    res.json(statuses);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
