import { z } from "zod";

export const issueIdParamSchema = z.object({
  issueId: z.string().cuid("Invalid issue id"),
});

export const disputeIdParamSchema = z.object({
  disputeId: z.string().cuid("Invalid dispute id"),
});

export const createDisputeSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

export const disputeMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const resolveDisputeSchema = z.object({
  resolution: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
});
