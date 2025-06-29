import { z } from "zod";


export const planSchema = z.object({
  name: z.string().min(5, "Name is required"),
  price: z.number().min(1, "Price must be at least 1"),
  userLimit: z.number().int().min(3, "please Enter at least 3 digit user Limit" ),
  durationDays: z.number().int().min(1, "Duration must be at least 1 day"),
  discountedPrice: z.number().min(0, "Discounted price must be non-negative").optional(),
});


export const planIdParamSchema = z.object({
  id: z.string().cuid("Invalid plan ID"),
});
