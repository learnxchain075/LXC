import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createOutpassRequestSchema,
  updateOutpassRequestSchema,
  outpassRequestIdParamSchema,
} from "../../../../validations/Module/HostelDashboard/outpassRequestValidation";

export const getOutpassRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await prisma.outpassRequest.findMany();
    res.json(requests);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getOutpassRequestById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = outpassRequestIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    const request = await prisma.outpassRequest.findUnique({
      where: { id },
    });
    if (!request) {
      return res.status(404).json({ message: "Outpass request not found" });
    }
    res.json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createOutpassRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const bodyResult = createOutpassRequestSchema.safeParse(req.body);
  try {
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }

    const { studentId, reason, fromDate, toDate } = bodyResult.data;
    const request = await prisma.outpassRequest.create({
      data: { studentId, reason, fromDate, toDate },
    });
    res.status(201).json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateOutpassRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = outpassRequestIdParamSchema.safeParse(req.params);
  const bodyResult = updateOutpassRequestSchema.safeParse(req.body);
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
    const { studentId, reason, fromDate, toDate, status } = bodyResult.data;
    const request = await prisma.outpassRequest.update({
      where: { id },
      data: { studentId, reason, fromDate, toDate, status },
    });
    res.json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteOutpassRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = outpassRequestIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.outpassRequest.delete({
      where: { id },
    });
    res.json({ message: "Outpass request deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getOutpassRequestsByStudentId = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId } = req.params;
  try {
    const requests = await prisma.outpassRequest.findMany({
      where: { studentId },
    });
    res.json(requests);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
