import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  createHolidaySchema,
  updateHolidaySchema,
} from "../../../../validations/Module/AdminDashboard/holidayValidation";
import { schoolIdParamSchema, cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";

// Create a new holiday
// Create a new holiday
export const createHoliday = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = createHolidaySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }

    const { name, date, fromday, toDay, description, schoolId } = parsed.data;

    const data: any = {
      name,
      date,
      description,
      schoolId,
    };

    if (fromday) data.fromday = fromday;
    if (toDay) data.toDay = toDay;

    const holiday = await prisma.holiday.create({ data });

    res.status(201).json({ success: true, data: holiday });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create holiday", message: error });
  }
};

// Get all holidays (optionally filtered by schoolId)
export const getAllHolidays = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;

    const holidays = await prisma.holiday.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { fromday: "asc" },
    });

    res.status(200).json({ success: true, data: holidays });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch holidays" });
  }
};

// Get a single holiday by ID
export const getHolidayById = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { id } = params.data;

    const holiday = await prisma.holiday.findUnique({ where: { id } });

    if (!holiday) {
      return res.status(404).json({ success: false, message: "Holiday not found" });
    }

    res.status(200).json({ success: true, data: holiday });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to get holiday" });
  }
};

// Update a holiday
export const updateHoliday = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    const body = updateHolidaySchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const { id } = params.data;
    const { name, date, fromday, toDay, description } = body.data;

    const updatedHoliday = await prisma.holiday.update({
      where: { id },
      data: {
        name,
        date: date ? new Date(date) : undefined,
        fromday: fromday ? new Date(fromday) : undefined,
        toDay: toDay ? new Date(toDay) : undefined,
        description,
      },
    });

    res.status(200).json({ success: true, data: updatedHoliday });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update holiday" });
  }
};

// Delete a holiday
export const deleteHoliday = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { id } = params.data;

    await prisma.holiday.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete holiday" });
  }
};

// Filter holidays by date range
export const filterHolidaysByDate = async (req: Request, res: Response) => {
  try {
    const { start, end, schoolId } = req.query;

    const holidays = await prisma.holiday.findMany({
      where: {
        AND: [
          { schoolId: schoolId as string },
          { fromday: { gte: new Date(start as string) } },
          { toDay: { lte: new Date(end as string) } },
        ],
      },
    });

    res.status(200).json({ success: true, data: holidays });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to filter holidays" });
  }
};
