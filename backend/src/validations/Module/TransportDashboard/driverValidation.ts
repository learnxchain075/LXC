import { z } from "zod";

export const registerDriverSchema = z.object({
  // User fields
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(1, "Address is required"),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  pincode: z.string(),
  bloodType: z.string(),
  sex: z.enum(["MALE", "FEMALE", "OTHERS"]),

  // Driver fields
  license: z.string().min(1, "License is required"),
  busId: z.string().cuid("Invalid bus id"),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateDriverSchema = registerDriverSchema.partial();

export const assignDriverSchema = z.object({
  busId: z.string().cuid("Invalid bus id"),
  driverId: z.string().cuid("Invalid driver id"),
});

export const driverIdParamSchema = z.object({
  id: z.string().cuid("Invalid driver id"),
});

export const driverSchoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid school id"),
});
