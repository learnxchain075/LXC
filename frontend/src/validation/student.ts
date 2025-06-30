import { z } from "zod";

export const UserSex = z.enum(["MALE", "FEMALE", "OTHERS"]);
export const ActiveStatus = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

export const registerStudentSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  name: z.string().min(1),
  sex: UserSex,
  bloodType: z.string().min(1),
  primaryContact: z.string().min(1),
  academicYear: z.string().min(1),
  admissionNo: z.string().min(1),
  admissionDate: z.string().min(1),
  rollNo: z.string().min(1),
  status: ActiveStatus.optional(),
  dateOfBirth: z.string().min(1),
  Religion: z.string().min(1),
  category: z.string().min(1),
  caste: z.string().min(1),
  motherTongue: z.string().min(1),
  languagesKnown: z.string().min(1),

  fatherName: z.string().min(1),
  fatheremail: z.string().optional(),
  fatherPhone: z.string().min(1),
  fatherOccupation: z.string().min(1),

  motherName: z.string().min(1),
  motherOccupation: z.string().min(1),
  motherEmail: z.string().optional(),
  motherPhone: z.string().min(1),

  guardianName: z.string().min(1),
  guardianRelation: z.string().min(1),
  guardianEmail: z.string().email(),
  guardianPhone: z.string().min(1),
  guardianOccupation: z.string().min(1),
  guardianAddress: z.string().min(1),

  areSiblingStudying: z.string().min(1),
  siblingName: z.string().min(1),
  siblingClass: z.string().min(1),
  siblingRollNo: z.string().min(1),
  siblingAdmissionNo: z.string().min(1),

  currentAddress: z.string().min(1),
  permanentAddress: z.string().min(1),

  vehicleNumber: z.string().optional(),

  hostelName: z.string().optional(),
  roomNumber: z.string().optional(),

  medicalCondition: z.string().min(1),
  allergies: z.string().min(1),
  medicationName: z.string().min(1),

  schoolName: z.string().optional(),
  schoolId: z.string().min(1),
  classId: z.string().min(1),

  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  pincode: z.string().min(1),

  routeId: z.string().optional(),
  busStopId: z.string().optional(),
  busPickupId: z.string().optional(),
});
