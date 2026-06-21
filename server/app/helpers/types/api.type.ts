import type { Pagination } from "./pagination.type.js";

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  details?: string | string[];
  result?: {
    query?: {}[];
    item?: any;
    pagination?: Pagination;
  };
}
