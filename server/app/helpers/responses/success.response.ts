import { SuccessResponseApi } from "./api.response.js";
import type { Schema } from "../types/schema.type.js";
import type { ApiResponse } from "../types/api.type.js";

export class SuccessResponse {
  static QUERY = (schema: Schema, result: any): ApiResponse => {
    const { message, status, success } = SuccessResponseApi.QUERY(schema);
    return { message, statusCode: status, success, result };
  };
  static GET = (schema: Schema, result: any): ApiResponse => {
    const { message, status, success } = SuccessResponseApi.GET(schema);
    return { message, statusCode: status, success, result };
  };
  static POST = (schema: Schema, result: any): ApiResponse => {
    const { message, status, success } = SuccessResponseApi.POST(schema);
    return { message, statusCode: status, success, result };
  };
  static DELETE = (schema: Schema, result: any): ApiResponse => {
    const { message, status, success } = SuccessResponseApi.DELETE(schema);
    return { message, statusCode: status, success, result };
  };
  static PATCH = (schema: Schema, result: any): ApiResponse => {
    const { message, status, success } = SuccessResponseApi.PATCH(schema);
    return { message, statusCode: status, success, result };
  };
}
