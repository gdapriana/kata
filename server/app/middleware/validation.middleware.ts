import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";

type RequestSource = "body" | "query" | "params";

export function validate(schema: ZodType, source: RequestSource = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: result.error.flatten(),
        },
      });
    }

    req[source] = result.data;
    return next();
  };
}

export function handleError(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: error.flatten(),
      },
    });
  }

  const appError = error as {
    status?: number;
    code?: string;
    message?: string;
    details?: unknown;
  };

  return res.status(appError.status ?? 500).json({
    error: {
      code: appError.code ?? "INTERNAL_SERVER_ERROR",
      message: appError.message ?? "Internal server error",
      details: appError.details,
    },
  });
}
