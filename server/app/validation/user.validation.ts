import z from "zod";

export class UserValidation {
  static GetOne = z
    .object({
      by: z.enum(["id", "email"]),
      value: z.string(),
    })
    .strict();

  static GetAll = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).max(200).optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "name", "email", "blogsCount"])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  });

  static Update = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    image: z.string().url().or(z.literal("")).optional().nullable(),
  }).strict();
}

export type UserValidationGetOne = z.infer<typeof UserValidation.GetOne>;
export type UserValidationGetAll = z.infer<typeof UserValidation.GetAll>;
export type UserValidationUpdate = z.infer<typeof UserValidation.Update>;
