import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createInchargeSchema,
  updateInchargeSchema,
  inchargeIdParamSchema,
} from "../../../../validations/Module/TransportDashboard/inchargeValidation";

// Create Incharge
export const createIncharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) :Promise<any>=> {
  const result = createInchargeSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { name, schoolId } = result.data;
  try {
    const incharge = await prisma.incharge.create({
      data: { name, schoolId },
    });
    res.status(201).json(incharge);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Incharges
export const getIncharges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const incharges = await prisma.incharge.findMany({ include: { school: true } });
    res.json(incharges);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Incharge by ID
export const getIncharge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const paramsResult = inchargeIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    const incharge = await prisma.incharge.findUnique({
      where: { id },
      include: { school: true },
    });
    if (!incharge) return res.status(404).json({ error: "Incharge not found" });
    res.json(incharge);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Incharge
export const updateIncharge = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = inchargeIdParamSchema.safeParse(req.params);
  const bodyResult = updateInchargeSchema.safeParse(req.body);

  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramsResult.success ? [] : paramsResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }

  const { id } = paramsResult.data;
  const { name, schoolId } = bodyResult.data;
  try {
    const incharge = await prisma.incharge.update({
      where: { id },
      data: { name, schoolId },
    });
    res.json(incharge);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Incharge
export const deleteIncharge = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = inchargeIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    await prisma.incharge.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
