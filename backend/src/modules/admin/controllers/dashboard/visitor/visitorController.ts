import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../../db/prisma";
import * as QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { handlePrismaError } from "../../../../../utils/prismaErrorHandler";
import { createVisitorSchema, verifySchema } from "../../../../../validations/Module/AdminDashboard/visitorValidation";

// Create a new visitor and issue a QR code
export const createVisitor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const parsed = createVisitorSchema.safeParse(req.body);
  console.log(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }
  const { name, phone, email, purpose, validFrom, validUntil, schoolId } = parsed.data;

  console.log(parsed.data);

  // Validate school existence
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    return res.status(404).json({ error: "School not found" });
  }

  // Generate unique token for QR code
  const token = uuidv4();

  try {
    // Create visitor record
    const visitor = await prisma.visitor.create({
      data: {
        name,
        phone,
        email,
        purpose,
        token: token,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        schoolId,
      },
    });

    // Generate QR code with the token
    const qrCodeData = await QRCode.toDataURL(token);

    return res.status(201).json({
      visitorId: visitor.id,
      token,
      qrCodeData, // QR code as a data URL
    });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Verify visitor entry
export const verifyEntry = async (req: Request, res: Response): Promise<any> => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }
  const { token } = parsed.data;

  const now = new Date();

  // Find visitor by token
  const visitor = await prisma.visitor.findUnique({ where: { token } });
  if (!visitor) {
    res.status(404).json({ error: "Visitor not found" });
    return;
  }

  // Check if the QR code is within the valid time period
  if (now < visitor.validFrom || now > visitor.validUntil) {
    res.status(403).json({ error: "Visitor pass is not valid at this time" });
    return;
  }

  // Check if entry has already been recorded
  if (visitor.entryTime) {
    res.status(400).json({ error: "Visitor has already entered" });
    return;
  }

  // Record entry time
  await prisma.visitor.update({
    where: { id: visitor.id },
    data: { entryTime: now },
  });

  res.json({ success: true, message: "Entry recorded successfully" });
  return;
};

// Verify visitor exit
export const verifyExit = async (req: Request, res: Response): Promise<any> => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }
  const { token } = parsed.data;

  const now = new Date();

  // Find visitor by token
  const visitor = await prisma.visitor.findUnique({ where: { token } });
  if (!visitor) {
    return res.status(404).json({ error: "Visitor not found" });
  }

  // Check if visitor has entered
  if (!visitor.entryTime) {
    return res.status(400).json({ error: "Visitor has not entered yet" });
  }

  // Check if exit has already been recorded
  if (visitor.exitTime) {
    return res.status(400).json({ error: "Visitor has already exited" });
  }

  // Record exit time
  await prisma.visitor.update({
    where: { id: visitor.id },
    data: { exitTime: now },
  });

  return res.json({ success: true, message: "Exit recorded successfully" });
};

// Get visitor details
export const getVisitor = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const visitor = await prisma.visitor.findUnique({ where: { id } });
  if (!visitor) {
    return res.status(404).json({ error: "Visitor not found" });
  }

  return res.json(visitor);
};

// Update visitor details
export const updateVisitor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params;
  const { name, phone, email, purpose, validFrom, validUntil } = req.body;

  try {
    const updatedVisitor = await prisma.visitor.update({
      where: { id },
      data: { name, phone, email, purpose, validFrom: new Date(validFrom), validUntil: new Date(validUntil) },
    });
    return res.json(updatedVisitor);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete visitor
export const deleteVisitor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params;
  try {
    await prisma.visitor.delete({ where: { id } });
    return res.json({ success: true, message: "Visitor deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Visitor Of a School

export const getVisitorOfSchool = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { schoolId } = req.params;
  try {
    const visitors = await prisma.visitor.findMany({ where: { schoolId } });
    return res.json(visitors);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
