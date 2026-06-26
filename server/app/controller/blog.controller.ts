import { type Request, type Response, type NextFunction } from "express"
import { BlogService } from "../services/blog.service.js"
import { SuccessResponse } from "../helpers/responses/success.response.js"
import { auth } from "../lib/auth.js"
import { ResponseError, ErrorResponseMessage } from "../helpers/responses/error.response.js"

export class BlogController {
  static GetOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: new Headers(req.headers as Record<string, string>),
      })
      const userId = session?.user?.id

      const result = await BlogService.GetOne(
        req.query as any,
        userId
      )
      const response = SuccessResponse.QUERY("blog", result)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  static GetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await BlogService.GetAll(req.query as any)
      const response = SuccessResponse.QUERY("blog", result)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  static Like = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED())
      }
      const { blogId } = req.body
      if (!blogId) {
        throw new ResponseError(ErrorResponseMessage.BAD_REQUEST("blogId is required"))
      }

      const result = await BlogService.Like(blogId, userId)
      const response = SuccessResponse.POST("blog" as any, result)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  static Bookmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED())
      }
      const { blogId } = req.body
      if (!blogId) {
        throw new ResponseError(ErrorResponseMessage.BAD_REQUEST("blogId is required"))
      }

      const result = await BlogService.Bookmark(blogId, userId)
      const response = SuccessResponse.POST("blog" as any, result)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
