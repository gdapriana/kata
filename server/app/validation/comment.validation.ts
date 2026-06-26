import z from "zod";

export class CommentValidation {
  static GetAll = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).max(200).optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "likedCount"])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    blogId: z.string(),
    parentId: z.string().nullable().optional(),
  });

  static Create = z
    .object({
      userId: z.string(),
      blogId: z.string(),
      parentId: z.string().nullable().optional(),
      content: z.string(),
    })
    .strict();

  static Delete = z
    .object({
      userId: z.string(),
      commentId: z.string(),
    })
    .strict();
}

export type CommentValidationGetAll = z.infer<typeof CommentValidation.GetAll>;
export type CommentValidationCreate = z.infer<typeof CommentValidation.Create>;
export type CommentValidationDelete = z.infer<typeof CommentValidation.Delete>;
