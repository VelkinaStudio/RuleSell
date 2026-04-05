import { z } from "zod";

export const voteSchema = z.object({
  rulesetId: z.string().min(1, "rulesetId is required"),
});

export const followSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const saveSchema = z.object({
  rulesetId: z.string().min(1, "rulesetId is required"),
});

export const reportSchema = z.object({
  rulesetId: z.string().min(1, "rulesetId is required"),
  reason: z.enum(["SPAM", "MALWARE", "COPYRIGHT", "INAPPROPRIATE", "OTHER"]),
  details: z.string().max(1000).optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, "Comment is required").max(2000),
});
