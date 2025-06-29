import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { uploadFile } from "../../../../config/upload";
import {
  createHomeworkSchema,
  updateHomeworkSchema,
  submitHomeworkSchema,
} from "../../../../validations/Module/TeacherDashboard/homeWorkValidation";

// Create homework
export const createHomework = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const result = createHomeworkSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Validation failed", errors: result.error.errors });
    }
    const { title, description, dueDate, classId, subjectId } = result.data;
    const attachment = req.file as Express.Multer.File | undefined;

    let uploadedAttachmentUrl: string | undefined;

    if (attachment) {
      const fileType = attachment.mimetype.startsWith("image/") ? "image" : "raw";
      const uploadedAttachment = await uploadFile(
        attachment.buffer,
        "homework_attachments",
        fileType,
        attachment.originalname
      );
      uploadedAttachmentUrl = uploadedAttachment.url;
    }

    const homework = await prisma.homeWork.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        classId,
        subjectId,
        ...(uploadedAttachmentUrl && { attachment: uploadedAttachmentUrl }),
      },
    });

    res.status(201).json(homework);
  } catch (error) {
    next(error);
  }
};

// Get all homework
export const getAllHomework = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const homeworks = await prisma.homeWork.findMany();
    res.json(homeworks);
  } catch (error) {
    next(error);
  }
};

// Get homework by ID
export const getHomeworkById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const homework = await prisma.homeWork.findUnique({ where: { id } });

    if (!homework) return res.status(404).json({ message: "Homework not found" });

    res.json(homework);
  } catch (error) {
    next(error);
  }
};

// Update homework
export const updateHomework = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const result = updateHomeworkSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Validation failed", errors: result.error.errors });
    }
    const { title, description, dueDate, attachment, status } = result.data;

    const updatedHomework = await prisma.homeWork.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        attachment,
        status,
      },
    });

    res.json(updatedHomework);
  } catch (error) {
    next(error);
  }
};

// Delete homework
export const deleteHomework = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.homeWork.delete({ where: { id } });
    res.json({ message: "Homework deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all homework by class ID
export const getHomeworkByClassId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params;

    const homework = await prisma.homeWork.findMany({
      where: { classId },
    });

    res.json(homework);
  } catch (error) {
    next(error);
  }
};

// Submit homework
export const submitHomework = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const upload = req.file as Express.Multer.File | undefined;
    let fileUrl: string | undefined;

    if (upload) {
      const fileType = upload.mimetype.startsWith("image/") ? "image" : "raw";
      const uploaded = await uploadFile(
        upload.buffer,
        "homework_submissions",
        fileType
        // Todo: send file to with .Original name argument name
      );
      fileUrl = uploaded.url;
    }

    const result = submitHomeworkSchema.safeParse({
      ...req.body,
      file: fileUrl,
    });

    if (!result.success) {
      return res.status(400).json({ message: "Validation failed", errors: result.error.errors });
    }

    const { studentId, homeworkId } = result.data;

    if (!fileUrl) {
      return res.status(400).json({ message: "File is required for submission" });
    }

    const submission = await prisma.homeworkSubmission.create({
      data: {
        studentId,
        homeworkId,
        file: fileUrl,
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

// Get all submitted homework by student ID
export const getSubmittedHomeworkByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;

    const submissions = await prisma.homeworkSubmission.findMany({
      where: { studentId },
      include: { homework: true },
    });

    res.json(submissions);
  } catch (error) {
    next(error);
  }
};
