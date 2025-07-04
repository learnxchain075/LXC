import { UserSex, EmployeeType } from "@prisma/client";
import { z } from "zod";

export const registerStaffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  pincode: z.string().min(1),
  bloodType: z.string(),
  sex: z.nativeEnum(UserSex),
  employeeType: z.nativeEnum(EmployeeType).optional(),
  company: z.string().optional(),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateStaffSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  bloodType: z.string().optional(),
  sex: z.nativeEnum(UserSex),
  employeeType: z.nativeEnum(EmployeeType).optional(),
  company: z.string().optional(),
});
