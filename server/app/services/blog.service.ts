import type { BlogValidationGetOne, BlogValidationGetAll } from "../validation/blog.validation.js";
import type { BlogGetOneResponseType, BlogGetAllResponseType } from "../helpers/responses/blog.response.js";
import { blogGetOne } from "../helpers/get/blog.get.js";
import { blogGetAll } from "../helpers/getAll/blog.getAll.js";
import type { Pagination } from "../helpers/types/pagination.type.js";

export class BlogService {
  static GetOne = async (data: BlogValidationGetOne): Promise<BlogGetOneResponseType> => {
    return blogGetOne(data);
  }

  static GetAll = async (data: BlogValidationGetAll): Promise<{ query: BlogGetAllResponseType[]; pagination: Pagination }> => {
    return blogGetAll(data);
  }
}