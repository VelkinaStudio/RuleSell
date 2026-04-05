import { z } from "zod";

const rulesetTypes = [
  "RULESET",
  "PROMPT",
  "WORKFLOW",
  "AGENT",
  "BUNDLE",
  "DATASET",
] as const;

const platforms = [
  "CURSOR",
  "VSCODE",
  "OBSIDIAN",
  "N8N",
  "MAKE",
  "GEMINI",
  "CLAUDE",
  "CHATGPT",
  "OTHER",
] as const;

export const createRulesetSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  previewContent: z.string().min(1, "Preview content is required"),
  type: z.enum(rulesetTypes),
  platform: z.enum(platforms),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0).default(0),
  content: z.string().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const updateRulesetSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  previewContent: z.string().min(1).optional(),
  type: z.enum(rulesetTypes).optional(),
  platform: z.enum(platforms).optional(),
  category: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export type CreateRulesetInput = z.infer<typeof createRulesetSchema>;
export type UpdateRulesetInput = z.infer<typeof updateRulesetSchema>;
