export * from "./blog.validation.js";
export * from "./category.validation.js";
export * from "./common.validation.js";
export * from "./image.validation.js";
export * from "./tag.validation.js";
export * from "./user.validation.js";

import {
  blogCreateSchema,
  blogGetQuerySchema,
  blogMutationQuerySchema,
  blogQuerySchema,
  blogUpdateSchema,
} from "./blog.validation";
import {
  categoryCreateSchema,
  categoryGetQuerySchema,
  categoryMutationQuerySchema,
  categoryQuerySchema,
  categoryUpdateSchema,
} from "./category.validation";
import {
  imageGetQuerySchema,
  imageMutationQuerySchema,
  imageQuerySchema,
  imageUpdateSchema,
  imageUploadSchema,
} from "./image.validation";
import { tagCreateSchema, tagGetQuerySchema, tagMutationQuerySchema, tagQuerySchema, tagUpdateSchema } from "./tag.validation";
import {
  userCreateSchema,
  userGetQuerySchema,
  userMutationQuerySchema,
  userQuerySchema,
  userUpdateSchema,
} from "./user.validation.js";

export const userValidations = {
  get: { query: userGetQuerySchema },
  query: { query: userQuerySchema },
  create: { body: userCreateSchema },
  update: { query: userMutationQuerySchema, body: userUpdateSchema },
  delete: { query: userMutationQuerySchema },
} as const;

export const blogValidations = {
  get: { query: blogGetQuerySchema },
  query: { query: blogQuerySchema },
  create: { body: blogCreateSchema },
  update: { query: blogMutationQuerySchema, body: blogUpdateSchema },
  delete: { query: blogMutationQuerySchema },
} as const;

export const categoryValidations = {
  get: { query: categoryGetQuerySchema },
  query: { query: categoryQuerySchema },
  create: { body: categoryCreateSchema },
  update: { query: categoryMutationQuerySchema, body: categoryUpdateSchema },
  delete: { query: categoryMutationQuerySchema },
} as const;

export const tagValidations = {
  get: { query: tagGetQuerySchema },
  query: { query: tagQuerySchema },
  create: { body: tagCreateSchema },
  update: { query: tagMutationQuerySchema, body: tagUpdateSchema },
  delete: { query: tagMutationQuerySchema },
} as const;

export const imageValidations = {
  get: { query: imageGetQuerySchema },
  query: { query: imageQuerySchema },
  upload: { body: imageUploadSchema },
  update: { query: imageMutationQuerySchema, body: imageUpdateSchema },
  delete: { query: imageMutationQuerySchema },
} as const;
