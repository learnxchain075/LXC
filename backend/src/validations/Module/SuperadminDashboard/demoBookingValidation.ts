import { z } from "zod";

export const demoBookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  school: z.string().min(1, "School is required"),
  dateTime: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
});

export type DemoBookingInput = z.infer<typeof demoBookingSchema>;
