import {
  UserValidation,
  type UserValidationGetOne,
} from "../../validation/user.validation.js";
import { prismaClient } from "../../database/db.js";
import { Validation } from "../../validation/validation.js";
import {
  ErrorResponseMessage,
  ResponseError,
} from "../responses/error.response.js";
import {
  type UserGetOneResponseType,
  UserResponse,
} from "../responses/user.response.js";

export const userGetOne = (
  data: UserValidationGetOne,
): Promise<UserGetOneResponseType> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(UserValidation.GetOne, data);
    const user = await tx.user.findUnique({
      where: {
        ...(validatedData.by === "id"
          ? {
              id: data.value,
            }
          : { email: data.value }),
      },
      select: UserResponse.GetOne,
    });

    if (!user) throw new ResponseError(ErrorResponseMessage.NOT_FOUND("user"));
    return user;
  });
};
