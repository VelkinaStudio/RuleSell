import { z } from "zod";

export const createBundleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  price: z.number().min(0, "Price must be positive"),
  rulesetIds: z.array(z.string()).min(2, "A bundle must contain at least 2 items"),
});

export type CreateBundleInput = z.infer<typeof createBundleSchema>;
