import { z } from "zod";
import {
  atLeastOneField,
  limitSchema,
  lookupQuerySchema,
  orderSchema,
  pageSchema,
  slugSchema,
  uuidSchema,
} from "./common.validation";

export const categoryCreateSchema = z.strictObject({
  name: z.string().min(1).max(100),
  slug: slugSchema.optional(),
  description: z.string().optional(),
  parentId: uuidSchema.optional(),
});

export const categoryUpdateSchema = atLeastOneField(
  z.strictObject({
    name: z.string().min(1).max(100).optional(),
    slug: slugSchema.optional(),
    description: z.string().optional(),
    parentId: uuidSchema.optional(),
  }),
);

export const categoryGetQuerySchema = lookupQuerySchema;

export const categoryMutationQuerySchema = lookupQuerySchema;

export const categoryQuerySchema = z.strictObject({
  sort: z.enum(["name", "createdAt", "updatedAt"]).optional(),
  order: orderSchema,
  page: pageSchema,
  limit: limitSchema,
  search: z.string().optional(),
  parentId: uuidSchema.optional(),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
