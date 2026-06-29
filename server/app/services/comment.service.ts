import { prismaClient } from "../database/db.js";
import {
  CommentValidation,
  type CommentValidationCreate,
  type CommentValidationDelete,
  type CommentValidationGetAll,
} from "../validation/comment.validation.js";
import type { Pagination } from "../helpers/types/pagination.type.js";
import {
  CommentResponse,
  type CommentCreateResponseType,
  type CommentDeleteResponseType,
  type CommentGetAllResponseType,
} from "../helpers/responses/comment.response.js";
import { commentGetAll } from "../helpers/getAll/comment.getAll.js";
import { commentCreate } from "../helpers/create/comment.create.js";
import { commentDelete } from "../helpers/delete/comment.delete.js";

export class CommentService {
  static GetAll = async (
    data: CommentValidationGetAll,
  ): Promise<{
    query: CommentGetAllResponseType[];
    pagination: Pagination;
  }> => {
    return commentGetAll(data);
  };

  static Create = async (
    data: CommentValidationCreate,
  ): Promise<CommentCreateResponseType> => {
    return commentCreate(data);
  };

  static Delete = async (
    data: CommentValidationDelete,
  ): Promise<CommentDeleteResponseType> => {
    return commentDelete(data);
  };
}
