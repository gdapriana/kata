import { z } from "zod";
import {
  booleanQuerySchema,
  idLookupQuerySchema,
  limitSchema,
  orderSchema,
  pageSchema,
  uriSchema,
} from "./common.validation";

export const userRoleSchema = z.enum(["user", "author", "editor", "admin"]);

export const userCreateSchema = z.strictObject({
  email: z.email(),
  name: z.string().min(1).max(100),
  image: uriSchema.optional(),
  role: userRoleSchema.optional(),
});

export const userUpdateSchema = z
  .strictObject({
    name: z.string().min(1).max(100).optional(),
    image: uriSchema.optional(),
    role: userRoleSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const userGetQuerySchema = z.strictObject({
  by: z.enum(["id", "slug"]),
  value: z.string().min(1),
});

export const userMutationQuerySchema = idLookupQuerySchema;

export const userQuerySchema = z.strictObject({
  sort: z.string().optional(),
  order: orderSchema,
  page: pageSchema,
  limit: limitSchema,
  search: z.string().optional(),
  role: userRoleSchema.optional(),
  emailVerified: booleanQuerySchema.optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
