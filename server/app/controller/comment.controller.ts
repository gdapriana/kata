import { type Request, type Response, type NextFunction } from "express";
import { CommentService } from "../services/comment.service.js";
import { SuccessResponse } from "../helpers/responses/success.response.js";
import type { CommentCreateResponseType, CommentGetAllResponseType } from "../helpers/responses/comment.response.js";
import type { Pagination } from "../helpers/types/pagination.type.js";

export class CommentController {
  static GetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: {query: CommentGetAllResponseType[], pagination: Pagination} = await CommentService.GetAll(req.query as any);
      const response = SuccessResponse.QUERY("comment", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static Create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const result: CommentCreateResponseType = await CommentService.Create({ userId, ...req.body });
      const response = SuccessResponse.POST("comment" as any, result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static Delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id!;
      const commentId = req.params.commentId as string;
      const result = await CommentService.Delete({ userId, commentId });
      const response = SuccessResponse.DELETE("comment", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };
}
