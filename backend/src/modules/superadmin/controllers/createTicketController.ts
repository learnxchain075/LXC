import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";
import {
  ticketSchema,
  ticketUpdateSchema,
  ticketIdParamSchema,
  schoolIdParamSchema,
  userIdParamSchema,
} from "../../../validations/Module/SuperadminDashboard/ticketValidation";

// Create Ticket

export const createTicket = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const result = ticketSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Validation error", errors: result.error.errors });
    }

    // const { title, description, priority, status, schoolId } = req.body;

    const ticket = await prisma.ticket.create({
      data: {
        ...result.data,
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Tickets

export const getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await prisma.ticket.findMany();

    res.status(200).json(tickets);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Ticket by ID
export const getTicketById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const params = ticketIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const { ticketId } = params.data;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get ALl  Ticket of a  School
export const getTicketsBySchool = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const params = schoolIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid school id", errors: params.error.errors });
    }

    const { schoolId } = params.data;

    const tickets = await prisma.ticket.findMany({
      where: { schoolId },
    });

    res.status(200).json(tickets);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Ticket
export const updateTicket = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const params = ticketIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const body = ticketUpdateSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ message: "Validation failed", errors: body.error.errors });
    }

    const { ticketId } = params.data;
    const { title, description, priority, status } = body.data;

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        title,
        description,
        priority,
        status,
      },
    });

    res.status(200).json(updatedTicket);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Ticket

export const deleteTicket = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const params = ticketIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const { ticketId } = params.data;

    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Tickets of a User

export const getTicketsByUser = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const params = userIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid user id", errors: params.error.errors });
    }

    const { userId } = params.data;

    const tickets = await prisma.ticket.findMany({
      where: { userId },
    });

    res.status(200).json(tickets);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
