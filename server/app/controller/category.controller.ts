import { type Request, type Response, type NextFunction } from "express";
import type { CategoryGetOneResponseType } from "../helpers/responses/category.response.js";
import { CategoryService } from "../services/category.service.js";
import { SuccessResponse } from "../helpers/responses/success.response.js";

export class CategoryController {
  static GetOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: CategoryGetOneResponseType = await CategoryService.GetOne(
        req.query as any,
      );
      const response = SuccessResponse.QUERY("category", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static GetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CategoryService.GetAll(req.query as any);
      const response = SuccessResponse.QUERY("category", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };
}
