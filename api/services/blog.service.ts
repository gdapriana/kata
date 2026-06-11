import { prisma } from "../db/db";
import type { BlogCreateInput, BlogQueryInput, BlogUpdateInput } from "../validations";
import type { Prisma } from "../../generated/prisma/client";

type BlogLookup = {
  by: "id" | "slug";
  value: string;
};

type BlogWithRelations = Prisma.BlogGetPayload<{
  include: typeof blogInclude;
}>;

export class BlogServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

const blogInclude = {
  author: {
    select: {
      name: true,
    },
  },
  tags: true,
  galleryImages: {
    select: {
      id: true,
    },
  },
  likedByUsers: {
    select: {
      id: true,
    },
  },
  favoritedByUsers: {
    select: {
      id: true,
    },
  },
} satisfies Prisma.BlogInclude;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function lookupWhere(lookup: BlogLookup): Prisma.BlogWhereUniqueInput {
  return lookup.by === "id" ? { id: lookup.value } : { slug: lookup.value };
}

function connectIds(ids: string[] | undefined) {
  if (!ids) {
    return undefined;
  }

  return {
    connect: ids.map((id) => ({ id })),
  };
}

function setIds(ids: string[] | undefined) {
  if (!ids) {
    return undefined;
  }

  return {
    set: ids.map((id) => ({ id })),
  };
}

function toBlogResponse(blog: BlogWithRelations) {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    content: blog.content,
    excerpt: blog.excerpt,
    status: blog.status,
    authorId: blog.authorId,
    authorName: blog.author.name,
    categoryId: blog.categoryId,
    featuredImageId: blog.featuredImageId,
    galleryImageIds: blog.galleryImages.map((image) => image.id),
    tagIds: blog.tags.map((tag) => tag.id),
    tags: blog.tags,
    likedByUserIds: blog.likedByUsers.map((user) => user.id),
    favoritedByUserIds: blog.favoritedByUsers.map((user) => user.id),
    likedCount: blog.likedByUsers.length,
    favoriteCount: blog.favoritedByUsers.length,
    publishedAt: blog.publishedAt,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
}

function isUniqueConflict(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

function isMissingRelation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2025";
}

function createBlogWhere(query: BlogQueryInput): Prisma.BlogWhereInput {
  return {
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { content: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.authorId ? { authorId: query.authorId } : {}),
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.featuredImageId ? { featuredImageId: query.featuredImageId } : {}),
    ...(query.tag ? { tags: { some: { slug: query.tag } } } : {}),
  };
}

function createBlogOrderBy(query: BlogQueryInput): Prisma.BlogOrderByWithRelationInput {
  const sort = query.sort ?? "createdAt";

  if (sort === "likedCount") {
    return { likedByUsers: { _count: query.order } };
  }

  if (sort === "favoriteCount") {
    return { favoritedByUsers: { _count: query.order } };
  }

  if (sort === "name") {
    return { title: query.order };
  }

  return { [sort]: query.order };
}

export async function getBlog(lookup: BlogLookup) {
  const blog = await prisma.blog.findUnique({
    where: lookupWhere(lookup),
    include: blogInclude,
  });

  if (!blog) {
    throw new BlogServiceError(404, "BLOG_NOT_FOUND", "Blog not found");
  }

  return toBlogResponse(blog);
}

export async function listBlogs(query: BlogQueryInput) {
  const where = createBlogWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [blogs, total] = await prisma.$transaction([
    prisma.blog.findMany({
      where,
      orderBy: createBlogOrderBy(query),
      skip,
      take: query.limit,
      include: blogInclude,
    }),
    prisma.blog.count({ where }),
  ]);

  return {
    data: blogs.map(toBlogResponse),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function createBlog(input: BlogCreateInput) {
  try {
    const blog = await prisma.blog.create({
      data: {
        title: input.title,
        slug: input.slug ?? slugify(input.title),
        content: input.content,
        excerpt: input.excerpt,
        status: input.status,
        publishedAt: input.publishedAt,
        author: {
          connect: { id: input.authorId },
        },
        category: {
          connect: { id: input.categoryId },
        },
        featuredImage: input.featuredImageId
          ? {
              connect: { id: input.featuredImageId },
            }
          : undefined,
        galleryImages: connectIds(input.galleryImageIds),
        tags: connectIds(input.tagIds),
      },
      include: blogInclude,
    });

    return toBlogResponse(blog);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new BlogServiceError(409, "BLOG_SLUG_CONFLICT", "Slug already in use");
    }

    if (isMissingRelation(error)) {
      throw new BlogServiceError(400, "BLOG_RELATION_NOT_FOUND", "One or more related records do not exist");
    }

    throw error;
  }
}

export async function updateBlog(lookup: BlogLookup, input: BlogUpdateInput) {
  try {
    const blog = await prisma.blog.update({
      where: lookupWhere(lookup),
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt: input.excerpt,
        status: input.status,
        category: input.categoryId
          ? {
              connect: { id: input.categoryId },
            }
          : undefined,
        featuredImage: input.featuredImageId
          ? {
              connect: { id: input.featuredImageId },
            }
          : undefined,
        galleryImages: setIds(input.galleryImageIds),
        tags: setIds(input.tagIds),
        publishedAt: input.publishedAt,
      },
      include: blogInclude,
    });

    return toBlogResponse(blog);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new BlogServiceError(409, "BLOG_SLUG_CONFLICT", "Slug already in use");
    }

    if (isMissingRelation(error)) {
      throw new BlogServiceError(404, "BLOG_NOT_FOUND", "Blog not found");
    }

    throw error;
  }
}

export async function deleteBlog(lookup: BlogLookup) {
  try {
    await prisma.blog.delete({
      where: lookupWhere(lookup),
    });
  } catch (error) {
    if (isMissingRelation(error)) {
      throw new BlogServiceError(404, "BLOG_NOT_FOUND", "Blog not found");
    }

    throw error;
  }
}
