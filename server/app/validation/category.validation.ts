import z from "zod";

export class CategoryValidation {
  static GetOne = z
    .object({
      by: z.enum(["id", "slug"]),
      value: z.string(),
    })
    .strict();

  static GetAll = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).max(200).optional(),
    parentId: z.string().optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "name", "blogsCount"])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  });
}

export type CategoryValidationGetOne = z.infer<
  typeof CategoryValidation.GetOne
>;
export type CategoryValidationGetAll = z.infer<
  typeof CategoryValidation.GetAll
>;
