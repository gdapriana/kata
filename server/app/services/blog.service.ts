import type { BlogValidationGetOne } from "../validation/blog.validation.js";
import type { BlogGetOneResponseType } from "../helpers/responses/blog.response.js";
import { blogGetOne } from "../helpers/get/blog.get.js";

export class BlogService {
  static GetOne = async (data: BlogValidationGetOne): Promise<BlogGetOneResponseType> => {
    return blogGetOne(data);
  }
}