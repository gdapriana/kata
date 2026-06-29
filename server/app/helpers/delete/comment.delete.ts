import { prismaClient } from "../../database/db.js";
import {
  CommentValidation,
  type CommentValidationDelete,
} from "../../validation/comment.validation.js";
import { Validation } from "../../validation/validation.js";
import {
  CommentResponse,
  type CommentDeleteResponseType,
} from "../responses/comment.response.js";
import {
  ErrorResponseMessage,
  ResponseError,
} from "../responses/error.response.js";

export const commentDelete = (
  data: CommentValidationDelete,
): Promise<CommentDeleteResponseType> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(CommentValidation.Delete, data);
    const { userId, commentId } = validatedData;
    const comment = await tx.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        authorId: true,
      },
    });

    if (!comment)
      throw new ResponseError(ErrorResponseMessage.NOT_FOUND("comment"));
    if (comment.authorId !== userId)
      throw new ResponseError(ErrorResponseMessage.FORBIDDEN());

    return tx.comment.delete({
      where: {
        id: validatedData.commentId,
      },
      select: CommentResponse.Delete,
    });
  });
};
