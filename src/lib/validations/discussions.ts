import { z } from "zod";

export const createDiscussionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  bodyText: z.string().min(1, "Body is required").max(5000),
  category: z.string().min(1, "Category is required"),
  rulesetId: z.string().optional(),
});

export const createReplySchema = z.object({
  bodyText: z.string().min(1, "Body is required").max(5000),
  parentReplyId: z.string().optional(),
});
