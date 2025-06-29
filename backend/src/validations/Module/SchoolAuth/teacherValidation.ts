import { z } from "zod";
import { MaritalStatus, UserSex } from "@prisma/client";

export const registerTeacherSchema = z.object({
  // User Info
  name: z.string().min(1),
  sex: z.nativeEnum(UserSex),
  email: z.string().email(),
  phone: z.string().min(1),
  bloodType: z.string().min(1),

  // Core Teacher Fields
  teacherSchoolId: z.string().min(1),
  dateofJoin: z.coerce.date(),
  fatherName: z.string().min(1),
  motherName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  maritalStatus: z.nativeEnum(MaritalStatus),
  languagesKnown: z.string().min(1),
  qualification: z.string().min(1),
  workExperience: z.string().min(1),
  previousSchool: z.string().min(1),
  previousSchoolAddress: z.string().min(1),
  previousSchoolPhone: z.string().min(1),
  panNumber: z.string().min(5).optional(),

  // Employment & Status
  status: z.enum(["Active", "Inactive", "Suspended"]).optional(), // stored as string
  salary: z.preprocess((val) => Number(val), z.number()),

  contractType: z.string().min(1).optional(),
  dateOfPayment: z.coerce.date().optional(),

  // Leaves (Optional)
  medicalLeave: z.string().optional(),
  casualLeave: z.string().optional(),
  maternityLeave: z.string().optional(),
  sickLeave: z.string().optional(),

  // Bank Info
  accountNumber: z.string().min(1),
  bankName: z.string().min(1),
  ifscCode: z.string().min(1),
  branchName: z.string().min(1),

  // Hostel / Route (Optional)
  route: z.string().optional(),
  hostelName: z.string().optional(),
  roomNumber: z.string().optional(),

  // Social Links (Optional)
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  instagram: z.string().url().optional(),
  youtube: z.string().url().optional(),

  // Uploads
  // Resume: z.string().url().min(1), 
  // joiningLetter: z.string().url().min(1),

  // School Reference
  schoolId: z.string().cuid("Invalid school ID"),

  // Address Info
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  pincode: z.string().min(1),

  // userId is not needed on frontend (auto-generated or passed from session/admin), so not included
});

export const updateTeacherSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
});
