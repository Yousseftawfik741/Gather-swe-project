
import { z } from "zod";

export const venueTypes = [
  "HOTEL",
  "WEDDING_HALL",
  "GARDEN",
  "CONFERENCE_HALL",
  "RESTAURANT",
  "OTHER",
] as const;

export const createVenueSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(1).max(3000),
  type: z.enum(venueTypes),
  address: z.string().trim().min(3).max(500),
  city: z.string().trim().min(2).max(100),
  capacity: z.number().int().positive(),
  price: z.number().finite().nonnegative(),
  currency: z.string().length(3).default("EGP"),
});

export const updateVenueSchema = createVenueSchema.partial();

export const createVenueImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().trim().max(300).optional(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});
