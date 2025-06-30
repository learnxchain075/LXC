import { UserSex } from "@prisma/client";
import { z } from "zod";

export const registerSchoolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().min(1, "Pincode is required"),
  bloodType: z.string().min(1, "Blood type is required"),
  sex: z.nativeEnum(UserSex),
  schoolName: z.string().min(1, "School name is required"),
  password: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export const updateSchoolSchema = z.object({
  schoolName: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  pincode: z.string().min(1).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export const schoolIdParamSchema = z.object({
  id: z.string().cuid("Invalid school ID"),
});
