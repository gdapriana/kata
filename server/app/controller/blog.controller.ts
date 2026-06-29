import { type Request, type Response, type NextFunction } from "express";
import { BlogService } from "../services/blog.service.js";
import { SuccessResponse } from "../helpers/responses/success.response.js";
import { auth } from "../lib/auth.js";
import {
  ResponseError,
  ErrorResponseMessage,
} from "../helpers/responses/error.response.js";
import { Validation } from "../validation/validation.js";
import { BlogValidation } from "../validation/blog.validation.js";

export class BlogController {
  static GetOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: new Headers(req.headers as Record<string, string>),
      });
      const userId = session?.user?.id;

      const result = await BlogService.GetOne(req.query as any, userId);
      const response = SuccessResponse.QUERY("blog", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static GetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await BlogService.GetAll(req.query as any);
      const response = SuccessResponse.QUERY("blog", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static Like = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED());
      }
      const { blogId } = req.body;
      if (!blogId) {
        throw new ResponseError(
          ErrorResponseMessage.BAD_REQUEST("blogId is required"),
        );
      }

      const result = await BlogService.Like(blogId, userId);
      const response = SuccessResponse.POST("blog" as any, result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static Bookmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED());
      }
      const { blogId } = req.body;
      if (!blogId) {
        throw new ResponseError(
          ErrorResponseMessage.BAD_REQUEST("blogId is required"),
        );
      }

      const result = await BlogService.Bookmark(blogId, userId);
      const response = SuccessResponse.POST("blog" as any, result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static GetSaved = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED());
      }
      const result = await BlogService.GetSaved(req.query as any, userId);
      const response = SuccessResponse.QUERY("blog", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static GetLiked = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED());
      }
      const result = await BlogService.GetLiked(req.query as any, userId);
      const response = SuccessResponse.QUERY("blog", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static Create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.user?.id;
      if (!authorId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED());
      }

      const validatedData = Validation.validate(
        BlogValidation.Create,
        req.body,
      );

      const result = await BlogService.Create(validatedData, authorId);
      const response = SuccessResponse.POST("blog", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static Delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      if (!userId || !userRole) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED());
      }

      const id = req.params.id as string;
      if (!id) {
        throw new ResponseError(
          ErrorResponseMessage.BAD_REQUEST("Blog ID is required"),
        );
      }

      const result = await BlogService.Delete(id, userId, userRole);
      const response = SuccessResponse.DELETE("blog" as any, result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static Update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      if (!userId || !userRole) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED());
      }

      const id = req.params.id as string;
      if (!id) {
        throw new ResponseError(
          ErrorResponseMessage.BAD_REQUEST("Blog ID is required"),
        );
      }

      const validatedData = Validation.validate(
        BlogValidation.Update,
        req.body,
      );

      const result = await BlogService.Update(
        id,
        validatedData,
        userId,
        userRole,
      );
      const response = SuccessResponse.PATCH("blog", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };
}
