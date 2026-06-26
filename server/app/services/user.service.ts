import type {
  UserValidationGetOne,
  UserValidationGetAll,
} from "../validation/user.validation.js";
import type {
  UserGetOneResponseType,
  UserGetAllResponseType,
} from "../helpers/responses/user.response.js";
import { userGetOne } from "../helpers/get/user.get.js";
import { userGetAll } from "../helpers/getAll/user.getAll.js";
import type { Pagination } from "../helpers/types/pagination.type.js";

export class UserService {
  static GetOne = async (
    data: UserValidationGetOne,
  ): Promise<UserGetOneResponseType> => {
    return userGetOne(data);
  };

  static GetAll = async (
    data: UserValidationGetAll,
  ): Promise<{ query: UserGetAllResponseType[]; pagination: Pagination }> => {
    return userGetAll(data);
  };
}
