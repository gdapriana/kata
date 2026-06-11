import type { NextFunction, Request, RequestHandler, Response } from "express";
import { z, type ZodType } from "zod";

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Expected a lowercase URL slug");

export const uuidSchema = z.uuid();
export const uriSchema = z.url();
export const dateTimeSchema = z.iso.datetime();

export const orderSchema = z.enum(["asc", "desc"]).default("desc");

export const pageSchema = z.coerce.number().int().min(1).default(1);
export const limitSchema = z.coerce.number().int().min(1).max(100).default(20);
export const booleanQuerySchema = z.preprocess((value) => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}, z.boolean());

export const paginationQuerySchema = z.strictObject({
  page: pageSchema,
  limit: limitSchema,
});

export const bySchema = z.enum(["id", "slug"]);

export const lookupQuerySchema = z.strictObject({
  by: bySchema,
  value: z.string().min(1),
});

export const idLookupQuerySchema = z.strictObject({
  by: z.literal("id"),
  value: uuidSchema,
});

export function optionalNullable<T extends ZodType>(schema: T) {
  return schema.optional().nullable();
}

export function atLeastOneField<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });
}

type RequestSchemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

function validationError(res: Response, error: z.ZodError) {
  return res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message: "Request failed validation",
      details: z.flattenError(error),
    },
  });
}

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const [key, schema] of Object.entries(schemas) as [keyof RequestSchemas, ZodType][]) {
      const result = schema.safeParse(req[key]);

      if (!result.success) {
        return validationError(res, result.error);
      }

      req[key] = result.data;
    }

    return next();
  };
}
