import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";

export async function createFeeGroup(req: Request, res: Response, next: NextFunction):Promise<any> {
  try {
    const { name, description, schoolId } = req.body;
    if (!name || !schoolId) {
      return res.status(400).json({ message: "name and schoolId are required" });
    }
    const group = await prisma.feeGroup.create({ data: { name, description, schoolId } });
    res.status(201).json(group);
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function getFeeGroups(req: Request, res: Response, next: NextFunction) {
  try {
    const schoolId = (req.user?.schoolId as string) || (req.query.schoolId as string | undefined);
    const groups = await prisma.feeGroup.findMany({ where: schoolId ? { schoolId } : {} });
    res.json(groups);
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function updateFeeGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const group = await prisma.feeGroup.update({ where: { id }, data: { name, description } });
    res.json(group);
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function deleteFeeGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.feeGroup.delete({ where: { id } });
    res.json({ message: "deleted" });
  } catch (error) {
    next(handlePrismaError(error));
  }
}
