import { z } from "zod";
import { atLeastOneField, limitSchema, lookupQuerySchema, orderSchema, pageSchema, slugSchema } from "./common.validation.js";

export const tagCreateSchema = z.strictObject({
  name: z.string().min(1).max(50),
  slug: slugSchema.optional(),
});

export const tagUpdateSchema = atLeastOneField(
  z.strictObject({
    name: z.string().min(1).max(50).optional(),
    slug: slugSchema.optional(),
  }),
);

export const tagGetQuerySchema = lookupQuerySchema;

export const tagMutationQuerySchema = lookupQuerySchema;

export const tagQuerySchema = z.strictObject({
  sort: z.enum(["name", "createdAt", "updatedAt", "blogCount"]).optional(),
  order: orderSchema,
  page: pageSchema,
  limit: limitSchema,
  search: z.string().optional(),
});

export type TagCreateInput = z.infer<typeof tagCreateSchema>;
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>;
export type TagQueryInput = z.infer<typeof tagQuerySchema>;
