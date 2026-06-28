import { type Request, type Response, type NextFunction } from "express";
import type { UserGetOneResponseType } from "../helpers/responses/user.response.js";
import { UserService } from "../services/user.service.js";
import { SuccessResponse } from "../helpers/responses/success.response.js";
import { ResponseError, ErrorResponseMessage } from "../helpers/responses/error.response.js";
import { Validation } from "../validation/validation.js";
import { UserValidation } from "../validation/user.validation.js";

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

  static Update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED());
      }

      const validatedData = Validation.validate(UserValidation.Update, req.body);

      const result = await UserService.Update(userId, validatedData);
      const response = SuccessResponse.PATCH("user", result);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };
}
