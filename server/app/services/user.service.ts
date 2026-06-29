import type {
  UserValidationGetOne,
  UserValidationGetAll,
  UserValidationUpdate,
} from "../validation/user.validation.js";
import { prismaClient } from "../database/db.js";
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

  static Update = async (id: string, data: UserValidationUpdate) => {
    const user = await prismaClient.user.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image,
      },
    });
    return user;
  };
}
