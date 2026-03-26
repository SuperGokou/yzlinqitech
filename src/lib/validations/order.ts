import { z } from "zod";

export const createOrderSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  service_id: z.string().uuid().optional(),
  budget_range: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "quoted", "confirmed", "in_progress", "delivered", "completed", "cancelled"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
