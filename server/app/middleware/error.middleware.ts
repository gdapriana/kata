import type { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";
import { ErrorResponseMessage, ResponseError } from "../helpers/responses/error.response.js";

export const errorMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ResponseError) {
    res
      .status(error.data.status)
      .json({
        success: false,
        message: error.data.message,
        statusCode: error.data.status,
      });
    return;
  }

  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map(
      (err) => `${err.path}: ${err.message}`,
    );
    const { message, status } =
      ErrorResponseMessage.BAD_REQUEST("format error");
    res
      .status(status)
      .json({ success: false, message, details: formattedErrors });
    return;
  }

  const { status, message } = ErrorResponseMessage.INTERNAL_SERVER_ERROR();
  res.status(status).json({ success: false, message });
};