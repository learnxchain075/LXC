import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createHostelSchema,
  updateHostelSchema,
  hostelIdParamSchema,
} from "../../../../validations/Module/HostelDashboard/hostelValidation";

// Get all hostels with optional filters and pagination
export const getHostels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, schoolId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filters: any = {};
    if (schoolId) filters.schoolId = schoolId;

    const hostels = await prisma.hostel.findMany({
      where: filters,
      skip,
      take: Number(limit),
    });

    const totalHostels = await prisma.hostel.count({ where: filters });

    res.json({ data: hostels, total: totalHostels, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Create a new hostel
export const createHostel = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const bodyResult = createHostelSchema.safeParse(req.body);
  try {
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }

    const { hostelName, location, capacity, schoolId } = bodyResult.data;
    const hostel = await prisma.hostel.create({
      data: { hostelName, location, capacity, schoolId },
    });
    res.status(201).json(hostel);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a hostel by ID
export const getHostelById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const paramsResult = hostelIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    const hostel = await prisma.hostel.findUnique({ where: { id } });
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });
    res.json(hostel);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update a hostel
export const updateHostel = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = hostelIdParamSchema.safeParse(req.params);
  const bodyResult = updateHostelSchema.safeParse(req.body);
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
    const { hostelName, location, capacity } = bodyResult.data;
    const hostel = await prisma.hostel.update({
      where: { id },
      data: { hostelName, location, capacity },
    });
    res.json(hostel);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a hostel
export const deleteHostel = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  const paramsResult = hostelIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.hostel.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get hostels by school ID
export const getHostelsBySchoolId = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  try {
    const hostels = await prisma.hostel.findMany({ where: { schoolId } });
    res.json(hostels);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Search hostels by name
export const searchHostels = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.query;
  try {
    const hostels = await prisma.hostel.findMany({
      where: { hostelName: { contains: query as string, mode: "insensitive" } },
    });
    res.json(hostels);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
