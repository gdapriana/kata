import type {
  CategoryValidationGetOne,
  CategoryValidationGetAll,
} from "../validation/category.validation.js";
import type {
  CategoryGetOneResponseType,
  CategoryGetAllResponseType,
} from "../helpers/responses/category.response.js";
import { categoryGetOne } from "../helpers/get/category.get.js";
import { categoryGetAll } from "../helpers/getAll/category.getAll.js";
import type { Pagination } from "../helpers/types/pagination.type.js";

export class CategoryService {
  static GetOne = async (
    data: CategoryValidationGetOne,
  ): Promise<CategoryGetOneResponseType> => {
    return categoryGetOne(data);
  };

  static GetAll = async (
    data: CategoryValidationGetAll,
  ): Promise<{
    query: CategoryGetAllResponseType[];
    pagination: Pagination;
  }> => {
    return categoryGetAll(data);
  };
}
