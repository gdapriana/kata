import { z } from "zod";
import { atLeastOneField, limitSchema, lookupQuerySchema, orderSchema, pageSchema, uriSchema, uuidSchema } from "./common.validation";

export const imageCreateSchema = z.strictObject({
  name: z.string().optional(),
  alt: z.string().optional(),
  url: uriSchema,
  mimeType: z.string().min(1),
  size: z.number().int().min(0),
  width: z.number().int().min(0).optional(),
  height: z.number().int().min(0).optional(),
  uploaderId: uuidSchema,
});

export const imageUpdateSchema = atLeastOneField(
  z.strictObject({
    name: z.string().optional(),
    alt: z.string().optional(),
  }),
);

export const imageGetQuerySchema = lookupQuerySchema;

export const imageMutationQuerySchema = lookupQuerySchema;

export const imageQuerySchema = z.strictObject({
  sort: z.enum(["name", "createdAt", "updatedAt"]).optional(),
  order: orderSchema,
  page: pageSchema,
  limit: limitSchema,
  search: z.string().optional(),
  uploaderId: uuidSchema.optional(),
  mimeType: z.string().optional(),
});

export type ImageCreateInput = z.infer<typeof imageCreateSchema>;
export type ImageUpdateInput = z.infer<typeof imageUpdateSchema>;
export type ImageQueryInput = z.infer<typeof imageQuerySchema>;
