import { type Request, type Response, type NextFunction } from "express"
import type { BlogGetOneResponseType } from "../helpers/responses/blog.response.js";
import { BlogService } from "../services/blog.service.js";
import { SuccessResponse } from "../helpers/responses/success.response.js";

export class BlogController {
  static GetOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: BlogGetOneResponseType = await BlogService.GetOne(req.query as any);
      const response = SuccessResponse.QUERY("blog", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e)
    }
  }
}