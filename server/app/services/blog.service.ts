import type { BlogValidationGetOne } from "../validation/blog.validation.ts";
import type {
  BlogGetOneResponseType,
  BlogResponse,
} from "../helpers/responses/blog.response.ts";
import { blogGetOne } from "../helpers/get/blog.get.ts";

export class BlogService {
  static GetOne = async (data: BlogValidationGetOne): Promise<BlogGetOneResponseType> => {
    return blogGetOne(data);
  }
}