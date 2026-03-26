import { z } from "zod";

export const updateSiteContentSchema = z.object({
  section: z.string().min(1),
  key: z.string().min(1),
  value_zh: z.string().nullable(),
  value_en: z.string().nullable(),
  type: z.enum(["text", "number", "image", "url"]),
});

export type UpdateSiteContentInput = z.infer<typeof updateSiteContentSchema>;
