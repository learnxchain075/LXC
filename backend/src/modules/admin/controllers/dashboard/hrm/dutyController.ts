import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../../db/prisma";
import { handlePrismaError } from "../../../../../utils/prismaErrorHandler";
import { createDutySchema, updateDutySchema } from "../../../../../validations/Module/AdminDashboard/dutyValidation";
import { schoolIdParamSchema, cuidSchema } from "../../../../../validations/common/commonValidation";
import { z } from "zod";

// Get all duties for a school
export const getDuties = async (req: Request, res: Response, next: NextFunction) => {
  const params = schoolIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return next({ status: 400, errors: params.error.errors });
  }
  const { schoolId } = params.data;
  try {
    const duties = await prisma.duty.findMany({
      where: { schoolId },
      // include: { assignedTo: { select: { id: true, name: true } } },
    });
    res.json(duties);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single duty by ID
export const getDutyById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return next({ status: 400, errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    const duty = await prisma.duty.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } }, // Corrected relation
        hostel: { select: { id: true, hostelName: true } }, // Including hostel details
        school: { select: { id: true, schoolName: true } }, // Including school details
      },
    });

    if (!duty) return res.status(404).json({ error: "Duty not found" });

    res.json(duty);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Create a new duty
export const createDuty = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = schoolIdParamSchema.safeParse(req.params);
  const body = createDutySchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }
  const { schoolId } = params.data;
  const { name, description, hostelId, assignedTo } = body.data;

  try {
    const duty = await prisma.duty.create({
      data: {
        name,
        description,
        schoolId,
        hostelId,
        assignedTo: assignedTo || null,
      },
    });
    res.status(201).json(duty);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
// Update duty
export const updateDuty = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updateDutySchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }
  const { id } = params.data;
  const { name, description } = body.data;
  try {
    const duty = await prisma.duty.update({
      where: { id },
      data: { name, description },
    });
    res.json(duty);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete duty
export const deleteDuty = async (req: Request, res: Response, next: NextFunction) => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return next({ status: 400, errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    await prisma.duty.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Assign a duty to a user
export const assignDutyToUser = async (req: Request, res: Response, next: NextFunction) => {
  const params = z.object({ userId: cuidSchema, dutyId: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return next({ status: 400, errors: params.error.errors });
  }
  const { userId, dutyId } = params.data;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { duties: { connect: { id: dutyId } } },
    });
    res.json(updatedUser);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Remove a duty from a user
export const removeDutyFromUser = async (req: Request, res: Response, next: NextFunction) => {
  const params = z.object({ userId: cuidSchema, dutyId: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return next({ status: 400, errors: params.error.errors });
  }
  const { userId, dutyId } = params.data;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { duties: { disconnect: { id: dutyId } } },
    });
    res.json(updatedUser);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
