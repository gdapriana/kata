import z from "zod";

export class CommentValidation {
    static GetAll = z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
        search: z.string().trim().min(1).max(200).optional(),
        sortBy: z
            .enum([
                "createdAt",
                "updatedAt",
                "publishedAt",
                "likedCount",
                "repllyCount"
            ]),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
    })

    static Create = z.object({
        userId: z.string(),
        blogId: z.string(),
        parentId: z.string().optional(),
        content: z.string()
    }).strict()

    static Delete = z.object({
        commentId: z.string()
    }).strict()
}