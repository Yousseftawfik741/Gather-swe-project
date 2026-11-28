
import { z } from "zod";

export const createProviderSchema = z.object({
  businessName: z.string().trim().min(2).max(150),
  description: z.string().trim().max(2000).optional(),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(500).optional(),
});

export const updateProviderSchema = createProviderSchema.partial();

export const updateProviderStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "SUSPENDED", "PENDING"]),
});

export type CreateProviderInput = z.infer<typeof createProviderSchema>;
