import { prismaClient } from "../../database/db";
import {
  CommentValidation,
  type CommentValidationCreate,
} from "../../validation/comment.validation";
import { Validation } from "../../validation/validation.js";
import {
  CommentResponse,
  type CommentCreateResponseType,
} from "../responses/comment.response.js";
import {
  ErrorResponseMessage,
  ResponseError,
} from "../responses/error.response.js";

export const commentCreate = (
  data: CommentValidationCreate,
): Promise<CommentCreateResponseType> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(CommentValidation.Create, data);
    const { userId, parentId, ...rest } = validatedData;
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new ResponseError(ErrorResponseMessage.FORBIDDEN());

    if (parentId) {
      const parent = await tx.comment.findUnique({
        where: { id: parentId },
        select: { id: true },
      });
      if (!parent)
        throw new ResponseError(ErrorResponseMessage.NOT_FOUND("comment"));
    }

    return prismaClient.comment.create({
      data: {
        ...rest,
        parentId,
        authorId: userId,
      },
      select: CommentResponse.Create,
    });
  });
};
