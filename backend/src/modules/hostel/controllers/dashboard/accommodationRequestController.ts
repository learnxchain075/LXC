import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createAccommodationRequestSchema,
  updateAccommodationRequestSchema,
  accommodationRequestIdParamSchema,
} from "../../../../validations/Module/HostelDashboard/accommodationRequestValidation";

// Get all accommodation requests (Students get only their requests)
export const getAccommodationRequests = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  try {
    const requests = user.role === 'student'
      ? await prisma.accommodationRequest.findMany({ where: { studentId: user.studentId } })
      : await prisma.accommodationRequest.findMany();
      
    res.json(requests);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single accommodation request by ID
export const getAccommodationRequestById = async (req: Request, res: Response, next: NextFunction) :Promise<any>=> {
  const paramsResult = accommodationRequestIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    const request = await prisma.accommodationRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ message: "Accommodation request not found" });
    }
    res.json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Create a new accommodation request
export const createAccommodationRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const bodyResult = createAccommodationRequestSchema.safeParse(req.body);
  try {
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }

    const { studentId, hostelId } = bodyResult.data;
    const request = await prisma.accommodationRequest.create({
      data: { studentId, hostelId },
    });
    res.status(201).json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update an accommodation request (e.g., change status)
export const updateAccommodationRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = accommodationRequestIdParamSchema.safeParse(req.params);
  const bodyResult = updateAccommodationRequestSchema.safeParse(req.body);
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
    const { status } = bodyResult.data;
    const request = await prisma.accommodationRequest.update({
      where: { id },
      data: { status },
    });
    res.json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete an accommodation request
export const deleteAccommodationRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = accommodationRequestIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.accommodationRequest.delete({ where: { id } });
    res.json({ message: "Accommodation request deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
