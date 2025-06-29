import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { uploadFile } from "../../../../config/upload";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from "../../../../validations/Module/TeacherDashboard/assignmentValidation";

// create assignment

export const createAssignment = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = createAssignmentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Validation failed", details: parseResult.error.errors });
    }

    const { title, description, status, startDate, dueDate, lessonId, classId, sectionId, subjectId } =
      parseResult.data;

    const attachmentFile = req.file;
    // Upload attachment to Cloudinary
    let url: string | undefined = undefined;
    if (attachmentFile && attachmentFile.buffer) {
      const uploadResult = await uploadFile(
        attachmentFile.buffer,
        "School_Assignments",
        "raw",
        attachmentFile.originalname
      );
      url = uploadResult.url;
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        attachment: url,
        status,
        startDate,
        dueDate,
        lessonId,
        classId,
        sectionId,
        subjectId,
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// get assignments

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        lesson: true,
        class: true,
        section: true,
        subject: true,
        results: true,
      },
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// get assignment by ID

export const getAssignmentById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        lesson: true,
        class: true,
        section: true,
        subject: true,
        results: true,
      },
    });

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// update assignment
export const updateAssignment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const parseResult = updateAssignmentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Validation failed", details: parseResult.error.errors });
    }
    const { title, description, attachment, status, startDate, dueDate, lessonId, classId, sectionId, subjectId } =
      parseResult.data;

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title,
        description,
        attachment,
        status,
        startDate,
        dueDate,
        lessonId,
        classId,
        sectionId,
        subjectId,
      },
    });

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// delete assignment

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.assignment.delete({ where: { id } });

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
