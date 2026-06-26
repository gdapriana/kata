import { prismaClient } from "../../database/db.js";
import {
  UserValidation,
  type UserValidationGetAll,
} from "../../validation/user.validation.js";
import { Validation } from "../../validation/validation.js";
import {
  type UserGetAllResponseType,
  UserResponse,
} from "../responses/user.response.js";
import type { Pagination } from "../types/pagination.type.js";
import { Prisma } from "../../generated/prisma/client.js";

export const userGetAll = (
  data: UserValidationGetAll,
): Promise<{ query: UserGetAllResponseType[]; pagination: Pagination }> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(UserValidation.GetAll, data);

    const where: Prisma.UserWhereInput = {};

    if (validatedData.search) {
      where.OR = [
        { name: { contains: validatedData.search, mode: "insensitive" } },
        { email: { contains: validatedData.search, mode: "insensitive" } },
      ];
    }

    if (validatedData.role) {
      where.role = validatedData.role;
    }

    const orderBy =
      validatedData.sortBy === "blogsCount"
        ? { blogs: { _count: validatedData.sortOrder } }
        : { [validatedData.sortBy]: validatedData.sortOrder };

    const skip = (validatedData.page - 1) * validatedData.limit;
    const take = validatedData.limit;

    const totalItems = await tx.user.count();
    const totalFilters = await tx.user.count({ where });
    const users = await tx.user.findMany({
      where,
      orderBy,
      skip,
      take,
      select: UserResponse.GetAll,
    });

    const totalPages = Math.ceil(totalFilters / take);
    const hasNext = validatedData.page < totalPages;
    const hasPrev = validatedData.page > 1;

    return {
      query: users,
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
