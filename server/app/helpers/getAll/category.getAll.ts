import { prismaClient } from "../../database/db.js";
import {
  CategoryValidation,
  type CategoryValidationGetAll,
} from "../../validation/category.validation.js";
import { Validation } from "../../validation/validation.js";
import {
  type CategoryGetAllResponseType,
  CategoryResponse,
} from "../responses/category.response.js";
import type { Pagination } from "../types/pagination.type.js";
import { Prisma } from "../../generated/prisma/client.js";

export const categoryGetAll = (
  data: CategoryValidationGetAll,
): Promise<{ query: CategoryGetAllResponseType[]; pagination: Pagination }> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(CategoryValidation.GetAll, data);

    const where: Prisma.CategoryWhereInput = {};

    if (validatedData.search) {
      where.OR = [
        { name: { contains: validatedData.search, mode: "insensitive" } },
        {
          description: { contains: validatedData.search, mode: "insensitive" },
        },
      ];
    }

    if (validatedData.parentId) {
      where.parentId = validatedData.parentId;
    }

    const orderBy =
      validatedData.sortBy === "blogsCount"
        ? { blogs: { _count: validatedData.sortOrder } }
        : { [validatedData.sortBy]: validatedData.sortOrder };

    const skip = (validatedData.page - 1) * validatedData.limit;
    const take = validatedData.limit;

    const totalItems = await tx.category.count();
    const totalFilters = await tx.category.count({ where });
    const categories = await tx.category.findMany({
      where,
      orderBy,
      skip,
      take,
      select: CategoryResponse.GetAll,
    });

    const totalPages = Math.ceil(totalFilters / take);
    const hasNext = validatedData.page < totalPages;
    const hasPrev = validatedData.page > 1;

    return {
      query: categories,
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
