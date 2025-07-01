import { z } from "zod";

// Ticket priorities and statuses can be enum-based if you have strict values
export const ticketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  status: z.string().min(1, "Status is required"),
  schoolId: z.string().cuid("Invalid School ID").optional(),
  userId: z.string().cuid("Invalid User ID"),
  assignedToId: z.string().cuid("Invalid User ID").optional(),
});



export const ticketUpdateSchema = ticketSchema.partial(
    {
        title: true,
        description: true,
        category: true,
        priority: true,
        status: true,
        assignedToId: true,
    },
);


export const ticketIdParamSchema = z.object({
  ticketId: z.string().cuid("Invalid Ticket ID"),
});

export const schoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid School ID"),
});

export const userIdParamSchema = z.object({
  userId: z.string().cuid("Invalid User ID"),
});