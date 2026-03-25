import { z } from "zod";

export const createQuoteSchema = z.object({
  order_id: z.string().uuid(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("CNY"),
  breakdown: z.record(z.string(), z.unknown()).optional(),
  valid_until: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
