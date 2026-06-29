import { prismaClient } from "../../database/db.js";
import {
  BlogValidation,
  type BlogValidationGetAll,
} from "../../validation/blog.validation.js";
import { Validation } from "../../validation/validation.js";
import {
  type BlogGetAllResponseType,
  BlogResponse,
} from "../responses/blog.response.js";
import type { Pagination } from "../types/pagination.type.js";
import { Prisma } from "../../generated/prisma/client.js";

export const blogGetAll = (
  data: BlogValidationGetAll,
  userId?: string,
  extraWhere?: Prisma.BlogWhereInput,
): Promise<{
  query: (BlogGetAllResponseType & { liked?: boolean; bookmarked?: boolean })[];
  pagination: Pagination;
}> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(BlogValidation.GetAll, data);

    const where: Prisma.BlogWhereInput = {
      ...extraWhere,
    };

    if (validatedData.search) {
      where.OR = [
        { title: { contains: validatedData.search, mode: "insensitive" } },
        { content: { contains: validatedData.search, mode: "insensitive" } },
        { excerpt: { contains: validatedData.search, mode: "insensitive" } },
      ];
    }

    if (validatedData.status) {
      where.status = validatedData.status;
    }

    if (validatedData.categoryId) {
      where.categoryId = validatedData.categoryId;
    }

    if (validatedData.categorySlug) {
      where.category = {
        slug: validatedData.categorySlug,
      };
    }

    if (validatedData.authorId) {
      where.authorId = validatedData.authorId;
    }

    if (validatedData.tagSlugs && validatedData.tagSlugs.length > 0) {
      where.tags = {
        some: {
          slug: {
            in: validatedData.tagSlugs,
          },
        },
      };
    }

    if (validatedData.startDate || validatedData.endDate) {
      where.createdAt = {
        ...(validatedData.startDate ? { gte: validatedData.startDate } : {}),
        ...(validatedData.endDate ? { lte: validatedData.endDate } : {}),
      };
    }

    const orderBy = {
      [validatedData.sortBy]: validatedData.sortOrder,
    };

    const skip = (validatedData.page - 1) * validatedData.limit;
    const take = validatedData.limit;

    const totalItems = await tx.blog.count();
    const totalFilters = await tx.blog.count({ where });
    const blogs = await tx.blog.findMany({
      where,
      orderBy,
      skip,
      take,
      select: BlogResponse.GetAll,
    });

    const totalPages = Math.ceil(totalFilters / take);
    const hasNext = validatedData.page < totalPages;
    const hasPrev = validatedData.page > 1;

    let queryResult = blogs as (BlogGetAllResponseType & {
      liked?: boolean;
      bookmarked?: boolean;
    })[];

    if (userId && blogs.length > 0) {
      const likedBlogs = await tx.blog.findMany({
        where: {
          id: { in: blogs.map((b) => b.id) },
          likedByUsers: { some: { id: userId } },
        },
        select: { id: true },
      });
      const likedIds = new Set(likedBlogs.map((b) => b.id));

      const bookmarkedBlogs = await tx.blog.findMany({
        where: {
          id: { in: blogs.map((b) => b.id) },
          favoritedByUsers: { some: { id: userId } },
        },
        select: { id: true },
      });
      const bookmarkedIds = new Set(bookmarkedBlogs.map((b) => b.id));

      queryResult = blogs.map((blog) => ({
        ...blog,
        liked: likedIds.has(blog.id),
        bookmarked: bookmarkedIds.has(blog.id),
      }));
    }

    return {
      query: queryResult,
      pagination: {
        page: validatedData.page,
        take,
        totalItems,
        totalFilters,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  });
};
