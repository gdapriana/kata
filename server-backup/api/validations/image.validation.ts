import { z } from "zod";
import { atLeastOneField, idLookupQuerySchema, limitSchema, orderSchema, pageSchema, uuidSchema } from "./common.validation.js";

export const imageUploadSchema = z.strictObject({
  name: z.string().optional(),
  alt: z.string().optional(),
});

export const imageUpdateSchema = atLeastOneField(
  z.strictObject({
    name: z.string().optional(),
    alt: z.string().optional(),
  }),
);

export const imageGetQuerySchema = idLookupQuerySchema;

export const imageMutationQuerySchema = idLookupQuerySchema;

export const imageQuerySchema = z.strictObject({
  sort: z.enum(["name", "createdAt", "updatedAt"]).optional(),
  order: orderSchema,
  page: pageSchema,
  limit: limitSchema,
  search: z.string().optional(),
  uploaderId: uuidSchema.optional(),
  mimeType: z.string().optional(),
});

export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
export type ImageUpdateInput = z.infer<typeof imageUpdateSchema>;
export type ImageQueryInput = z.infer<typeof imageQuerySchema>;
