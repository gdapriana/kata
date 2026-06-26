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
): Promise<{ query: BlogGetAllResponseType[]; pagination: Pagination }> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(BlogValidation.GetAll, data);

    const where: Prisma.BlogWhereInput = {};

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

    return {
      query: blogs,
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
