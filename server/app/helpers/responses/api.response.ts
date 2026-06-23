import type { Schema } from "../types/schema.type.js";

export class SuccessResponseApi {
  static QUERY(schema: Schema) {
    return {
      success: true,
      status: 200,
      message: `get ${schema}'s successfully`,
    };
  }
  static GET(schema: Schema) {
    return {
      success: true,
      status: 200,
      message: `get ${schema} successfully`,
    };
  }
  static POST(schema: Schema) {
    return {
      status: 201,
      success: true,
      message: `${schema} created successfully`,
    };
  }
  static PATCH(schema: Schema) {
    return {
      status: 200,
      success: true,
      message: `update ${schema} successfully`,
    };
  }
  static DELETE(schema: Schema) {
    return {
      success: true,
      status: 200,
      message: `delete ${schema} successfully`,
    };
  }
  static REGISTER() {
    return {
      success: true,
      status: 200,
      message: `register successfully`,
    };
  }
  static LOGIN() {
    return {
      success: true,
      status: 200,
      message: `login successfully`,
    };
  }
  static LOGOUT() {
    return {
      success: true,
      status: 200,
      message: `logout successfully`,
    };
  }
  static REFRESH_TOKEN() {
    return {
      success: true,
      status: 200,
      message: `refresh successfully`,
    };
  }
}
