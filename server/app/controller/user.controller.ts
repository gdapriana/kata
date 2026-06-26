import { type Request, type Response, type NextFunction } from "express";
import type { UserGetOneResponseType } from "../helpers/responses/user.response.js";
import { UserService } from "../services/user.service.js";
import { SuccessResponse } from "../helpers/responses/success.response.js";

export class UserController {
  static GetOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: UserGetOneResponseType = await UserService.GetOne(
        req.query as any,
      );
      const response = SuccessResponse.QUERY("user", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  static GetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await UserService.GetAll(req.query as any);
      const response = SuccessResponse.QUERY("user", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };
}
