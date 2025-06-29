import { z } from "zod";

export const updateGuardianSchema = z.object({
  guardianName: z.string().min(1),
  guardianRelation: z.string().min(1),
  guardianEmail: z.string().email(),
  guardianPhone: z.string().min(1),
  guardianOccupation: z.string().min(1),
  guardianAddress: z.string().min(1),
});
