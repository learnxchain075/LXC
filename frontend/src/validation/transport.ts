import { z } from "zod";

export const UserSexEnum = z.enum(["MALE", "FEMALE", "OTHERS"]);

export const registerTransportSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  pincode: z.string().min(1),
  schoolId: z.string().min(1),
  sex: UserSexEnum,
  bloodType: z.string().min(1),
});
