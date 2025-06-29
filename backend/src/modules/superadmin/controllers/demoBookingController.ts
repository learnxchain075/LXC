import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { demoBookingSchema } from "../../../validations/Module/SuperadminDashboard/demoBookingValidation";

const prisma = new PrismaClient();

export const createDemoBooking = async (req: Request, res: Response) :Promise<any> => {
  try {
    const validatedData = demoBookingSchema.parse(req.body);

    const existing = await prisma.demoBooking.findUnique({
      where: { email: validatedData.email },
    });

    if (existing) {
      return res.status(409).json({ message: "Email already registered for a demo." });
    }

    const booking = await prisma.demoBooking.create({
      data: {
        ...validatedData,
        dateTime: new Date(validatedData.dateTime),
      },
    });

    return res.status(201).json({ message: "Demo booked successfully", booking });
  } catch (error) {
    if (error instanceof Error && "errors" in error) {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }

    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


// Get all Demo Booking 

export const getAllDemoBookings = async (req: Request, res: Response) :Promise<any> => {
  try {
    const bookings = await prisma.demoBooking.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch demo bookings" });
  }
};