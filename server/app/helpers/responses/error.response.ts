import { httpStatus } from "../constants/status.constant.js";
import type { ErrorResponse } from "../types/error.type.js";
import type { Schema } from "../types/schema.type.js";

export class ErrorResponseMessage {
  static BAD_REQUEST(reason: string): ErrorResponse {
    return {
      status: httpStatus.BAD_REQUEST,
      message: `bad request: ${reason}`,
    };
  }

  static UNAUTHORIZED(
    message: string = "authentication failed, please login.",
  ): ErrorResponse {
    return {
      status: httpStatus.UNAUTHORIZED,
      message,
    };
  }

  static FORBIDDEN(): ErrorResponse {
    return {
      status: httpStatus.FORBIDDEN,
      message: "you do not have permission to perform this action.",
    };
  }

  static NOT_FOUND(schema: Schema): ErrorResponse {
    return {
      status: httpStatus.NOT_FOUND,
      message: `${schema} not found.`,
    };
  }

  static ALREADY_EXISTS(schema: Schema): ErrorResponse {
    return {
      status: httpStatus.CONFLICT,
      message: `${schema} already taken`,
    };
  }

  static INTERNAL_SERVER_ERROR(): ErrorResponse {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "an unexpected error occurred on the server.",
    };
  }

  static ZOD_ERROR(errors: { form: string; message: string }[]) {
    return {
      status: httpStatus.BAD_REQUEST,
      message: errors,
    };
  }
}

export class ResponseError extends Error {
  constructor(public data: ErrorResponse) {
    super(data.message);
  }
}
