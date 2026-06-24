import z from "zod";

export class BlogValidation {
  static GetOne = z.object({
    by: z.enum(['id', 'slug']),
    value: z.string()
  }).strict()

  static GetAll = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).max(200).optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    categoryId: z.string().optional(),
    categorySlug: z.string().trim().min(1).optional(),
    authorId: z.string().min(1).optional(),
    tagSlugs: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .optional(),
    sortBy: z
      .enum([
        "createdAt",
        "updatedAt",
        "publishedAt",
        "title",
        "views",
        "likedCount",
        "favoriteCount",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })

  static Create = z.object({
    title: z.string().trim().min(1).max(255),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    content: z.string().trim().min(1),
    excerpt: z.string().trim().max(500).optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    categoryId: z.string(),
    featuredImageId: z.string().optional(),
    galleryImageIds: z.array(z.string()).optional(),
    tagIds: z.array(z.string()).optional(),
    publishedAt: z.coerce.date().optional(),
  })

  static Update = this.Create.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })

  static Delete = this.GetOne
  static ToggleLiked = z.object({
    userId: z.string(),
    blogId: z.string()
  }).strict

  static ToggleBookmarked = this.ToggleLiked
}

export type BlogValidationGetOne = z.infer<typeof BlogValidation.GetOne>
export type BlogValidationGetAll = z.infer<typeof BlogValidation.GetAll>
export type BlogValidationCreate = z.infer<typeof BlogValidation.Create>
export type BlogValidationUpdate = z.infer<typeof BlogValidation.Update>
export type BlogValidationDelete = z.infer<typeof BlogValidation.Delete>
export type BlogValidationToggleLiked = z.infer<typeof BlogValidation.ToggleLiked>
export type BlogValidationToggleBookmarked = z.infer<typeof BlogValidation.ToggleBookmarked>
