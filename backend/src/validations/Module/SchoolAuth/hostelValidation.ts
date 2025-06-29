import { UserSex } from "@prisma/client";
import { z } from "zod";

export const registerHostelSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  hostelName: z.string().min(1),
  capacity: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  pincode: z.string().min(1),
  schoolId: z.string().cuid("Invalid school id"),
   sex: z.nativeEnum(UserSex),
  bloodType: z.string().min(1),
});

export const updateHostelSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
});
