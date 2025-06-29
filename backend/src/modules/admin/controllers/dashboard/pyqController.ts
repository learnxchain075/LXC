import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import { uploadFile } from "../../../../config/upload";
import { createPYQSchema, updatePYQSchema } from "../../../../validations/Module/AdminDashboard/pyqValidation";
import { cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";

// Create a new PYQ
export const createPYQ = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const bodyCheck = createPYQSchema.safeParse(req.body);
  if (!bodyCheck.success) {
    return res.status(400).json({ errors: bodyCheck.error.errors });
  }
  const { subjectId, classId, uploaderId } = bodyCheck.data;
  console.log("Creating PYQ with data:", req.body);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const question = files?.question?.[0];
  const solution = files?.solution?.[0];

  if (!question || !solution) {
    return res.status(400).json({ error: "Question and solution files are required" });
  }

  // **Step 3: Upload files to Cloudinary in parallel**
  const [questionUpload, solutionUpload] = await Promise.all([
    uploadFile(question.buffer, "questions", "raw", question.originalname),
    uploadFile(solution.buffer, "solutions", "raw", solution.originalname),
  ]);

  try {
    const pyq = await prisma.pYQ.create({
      data: { question: questionUpload.url, solution: solutionUpload.url, subjectId, classId, uploaderId },
    });
    res.status(201).json(pyq);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all PYQs
export const getAllPYQs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pyqs = await prisma.pYQ.findMany();
    res.status(200).json(pyqs);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single PYQ by ID
export const getPYQById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    const pyq = await prisma.pYQ.findUnique({
      where: { id },
    });
    if (!pyq) {
      return res.status(404).json({ error: "PYQ not found" });
    }
    res.status(200).json(pyq);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update a PYQ
export const updatePYQ = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updatePYQSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res
      .status(400)
      .json({ errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)] });
  }
  const { id } = params.data;
  const { question, solution, subjectId, classId } = body.data;
  try {
    const pyq = await prisma.pYQ.update({
      where: { id },
      data: { question, solution, subjectId, classId },
    });
    res.status(200).json(pyq);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a PYQ
export const deletePYQ = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    await prisma.pYQ.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
