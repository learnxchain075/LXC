import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { handlePrismaError } from '../../../../utils/prismaErrorHandler';
import {
  createComplaintSchema,
  updateComplaintSchema,
  complaintIdParamSchema,
} from '../../../../validations/Module/HostelDashboard/complaintValidation';

export const getComplaints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const complaints = await prisma.complaint.findMany();
    res.json(complaints);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getComplaintById = async (req: Request, res: Response, next: NextFunction) :Promise<any>=> {
  const paramsResult = complaintIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    const complaint = await prisma.complaint.findUnique({
      where: { id },
    });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createComplaint = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const bodyResult = createComplaintSchema.safeParse(req.body);
  try {
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }

    const { description, studentId, hostelId } = bodyResult.data;
    const complaint = await prisma.complaint.create({
      data: { description, studentId, hostelId },
    });
    res.status(201).json(complaint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateComplaint = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = complaintIdParamSchema.safeParse(req.params);
  const bodyResult = updateComplaintSchema.safeParse(req.body);
  try {
    if (!paramsResult.success || !bodyResult.success) {
      return res.status(400).json({
        error: [
          ...(paramsResult.success ? [] : paramsResult.error.errors),
          ...(bodyResult.success ? [] : bodyResult.error.errors),
        ],
      });
    }

    const { id } = paramsResult.data;
    const { status, description } = bodyResult.data;
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status, description },
    });
    res.json(complaint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteComplaint = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = complaintIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.complaint.delete({
      where: { id },
    });
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteAllComplaints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.complaint.deleteMany();
    res.json({ message: 'All complaints deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
