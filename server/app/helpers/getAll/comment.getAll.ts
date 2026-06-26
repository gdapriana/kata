import { prismaClient } from "../../database/db.js";
import type { Prisma } from "../../generated/prisma/client.js";
import {
  CommentValidation,
  type CommentValidationGetAll,
} from "../../validation/comment.validation.js";
import { Validation } from "../../validation/validation.js";
import {
  CommentResponse,
  type CommentGetAllResponseType,
} from "../responses/comment.response.js";
import type { Pagination } from "../types/pagination.type.js";

export const commentGetAll = (
  data: CommentValidationGetAll,
): Promise<{ query: CommentGetAllResponseType[]; pagination: Pagination }> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(CommentValidation.GetAll, data);
    const where: Prisma.CommentWhereInput = {};
    where.blogId = validatedData.blogId;
    if (validatedData.parentId !== undefined) {
      where.parentId = validatedData.parentId;
    } else {
      where.parentId = null;
    }
    if (validatedData.search) {
      where.content = {
        contains: validatedData.search,
        mode: "insensitive",
      };
    }

    const skip = (validatedData.page - 1) * validatedData.limit;
    const take = validatedData.limit;

    const totalFilters = await tx.comment.count({ where });

    const totalItems = await tx.comment.count({
      where: {
        blogId: where.blogId,
      },
    });

    const comments = await tx.comment.findMany({
      where,
      orderBy: {
        [validatedData.sortBy]: validatedData.sortOrder,
      },
      skip,
      take,
      select: CommentResponse.GetAll,
    });

    const totalPages = Math.ceil(totalFilters / take);
    const hasNext = validatedData.page < totalPages;
    const hasPrev = validatedData.page > 1;

    return {
      query: comments,
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
