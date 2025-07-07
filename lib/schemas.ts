import { z } from "zod";

export const generateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required."),
  model: z.string(),
  width: z.number().int().min(512).max(1536),
  height: z.number().int().min(512).max(1536),
  num_images: z.number().min(1).max(10),
  steps: z.number().int().min(10).max(50),
  cfg: z.number().min(0).max(15),
  seed: z.number().int().optional(),
  watermark: z.boolean().default(false),
  displayPublic: z.boolean().default(true),
}); 