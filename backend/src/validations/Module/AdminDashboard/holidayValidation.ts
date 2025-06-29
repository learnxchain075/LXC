import { z } from "zod";

export const createHolidaySchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.coerce.date(),
  fromday: z.coerce.date().optional(),
  toDay: z.coerce.date().optional(),
  description: z.string().optional(),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateHolidaySchema = createHolidaySchema.partial();
