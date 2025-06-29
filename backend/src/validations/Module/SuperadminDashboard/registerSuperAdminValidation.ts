import { UserSex } from "@prisma/client";
import { z } from "zod";

export const registerSuperAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().min(1, "Pincode is required"),
  sex: z.nativeEnum(UserSex),
  password: z.string().min(1, "Password is required"),
  bloodType: z.string().min(1, "Blood type is required"),
});

export const updateSuperAdminSchema = registerSuperAdminSchema.partial({
  name: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  country: true,
  pincode: true,
});

export const superAdminIdParamSchema = z.object({
  id: z.string().cuid("Invalid ID"),
});
