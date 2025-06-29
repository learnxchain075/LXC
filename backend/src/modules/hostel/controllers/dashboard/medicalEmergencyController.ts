import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../../db/prisma';
import { handlePrismaError } from '../../../../utils/prismaErrorHandler';
import {
  createMedicalEmergencySchema,
  updateMedicalEmergencySchema,
  medicalEmergencyIdParamSchema,
} from '../../../../validations/Module/HostelDashboard/medicalEmergencyValidation';

export const getMedicalEmergencies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emergencies = await prisma.medicalEmergency.findMany();
    res.json(emergencies);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getMedicalEmergencyById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const paramsResult = medicalEmergencyIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    const emergency = await prisma.medicalEmergency.findUnique({ where: { id } });
    if (!emergency) return res.status(404).json({ message: 'Medical emergency not found' });
    res.json(emergency);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createMedicalEmergency = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const bodyResult = createMedicalEmergencySchema.safeParse(req.body);
  try {
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }

    const { description, date, studentId, hostelId } = bodyResult.data;
    const emergency = await prisma.medicalEmergency.create({
      data: { description, date, studentId, hostelId },
    });
    res.status(201).json(emergency);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateMedicalEmergency = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = medicalEmergencyIdParamSchema.safeParse(req.params);
  const bodyResult = updateMedicalEmergencySchema.safeParse(req.body);
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
    const { description, date, studentId, hostelId } = bodyResult.data;
    const emergency = await prisma.medicalEmergency.update({
      where: { id },
      data: { description, date, studentId, hostelId },
    });
    res.json(emergency);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteMedicalEmergency = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = medicalEmergencyIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.medicalEmergency.delete({ where: { id } });
    res.json({ message: 'Medical emergency deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

