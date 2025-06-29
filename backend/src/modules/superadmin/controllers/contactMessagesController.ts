import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";
import {
  contactMessageSchema,
  updateContactMessageSchema,
  contactMessageIdParamSchema,
} from "../../../validations/Module/SuperadminDashboard/contactMessagesValidation";

// CREATE
export const createContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const parsed = contactMessageSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }

  const { name, email, phone, message, date, userId } = parsed.data;

  try {
    const newMessage = await prisma.contactMessage.create({
      data: { name, email, phone, message, date, userId },
    });
    res.status(201).json(newMessage);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// GET ALL
export const getAllContactMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            profilePic: true,
          },
        },
      },
    });
    res.json(messages);
  } catch (error) {
    next(handlePrismaError(error));
  }
};


// GET BY ID
export const getContactMessageById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = contactMessageIdParamSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const { id } = params.data;

  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ error: "Contact message not found" });
    }

    res.json(message);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// UPDATE
export const updateContactMessage = async (req: Request, res: Response, next: NextFunction) :Promise<any> => {
  const params = contactMessageIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const body = updateContactMessageSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ message: "Validation failed", errors: body.error.errors });
  }

  const { id } = params.data;
  const { name, email, phone, message } = body.data;

  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { name, email, phone, message },
    });
    res.json(updated);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// DELETE
export const deleteContactMessage = async (req: Request, res: Response, next: NextFunction) :Promise<any> => {
  const params = contactMessageIdParamSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const { id } = params.data;

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    res.json({ message: "Contact message deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
