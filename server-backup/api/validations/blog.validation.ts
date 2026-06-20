import { z } from "zod";
import {
  atLeastOneField,
  dateTimeSchema,
  limitSchema,
  lookupQuerySchema,
  orderSchema,
  pageSchema,
  slugSchema,
  uuidSchema,
} from "./common.validation.js";

export const blogStatusSchema = z.enum(["draft", "published", "archived"]);

const imageIdArraySchema = z.array(uuidSchema);
const tagIdArraySchema = z.array(uuidSchema);

export const blogCreateSchema = z.strictObject({
  title: z.string().min(1).max(200),
  slug: slugSchema.optional(),
  content: z.string(),
  excerpt: z.string().max(500).optional(),
  status: blogStatusSchema.optional(),
  authorId: uuidSchema,
  categoryId: uuidSchema,
  featuredImageId: uuidSchema.optional(),
  galleryImageIds: imageIdArraySchema.optional(),
  tagIds: tagIdArraySchema.optional(),
  publishedAt: dateTimeSchema.optional(),
});

export const blogUpdateSchema = atLeastOneField(
  z.strictObject({
    title: z.string().min(1).max(200).optional(),
    slug: slugSchema.optional(),
    content: z.string().optional(),
    excerpt: z.string().max(500).optional(),
    status: blogStatusSchema.optional(),
    categoryId: uuidSchema.optional(),
    featuredImageId: uuidSchema.optional(),
    galleryImageIds: imageIdArraySchema.optional(),
    tagIds: tagIdArraySchema.optional(),
    publishedAt: dateTimeSchema.optional(),
  }),
);

export const blogGetQuerySchema = lookupQuerySchema;

export const blogMutationQuerySchema = lookupQuerySchema;

export const blogQuerySchema = z.strictObject({
  sort: z.enum(["name", "createdAt", "updatedAt", "publishedAt", "likedCount", "favoriteCount"]).optional(),
  order: orderSchema,
  page: pageSchema,
  limit: limitSchema,
  search: z.string().optional(),
  status: blogStatusSchema.optional(),
  authorId: uuidSchema.optional(),
  categoryId: uuidSchema.optional(),
  tag: slugSchema.optional(),
  featuredImageId: uuidSchema.optional(),
});

export type BlogCreateInput = z.infer<typeof blogCreateSchema>;
export type BlogUpdateInput = z.infer<typeof blogUpdateSchema>;
export type BlogQueryInput = z.infer<typeof blogQuerySchema>;
