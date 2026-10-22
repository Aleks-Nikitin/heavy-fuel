import { z } from "zod";

export const aiResponseSchema = z.object({
  reply: z.string().trim().min(1),

  recommendedProductIds: z.array(z.string()).max(5).default([]),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;
