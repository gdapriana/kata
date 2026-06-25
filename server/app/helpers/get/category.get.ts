import {
  CategoryValidation,
  type CategoryValidationGetOne,
} from "../../validation/category.validation.js";
import { prismaClient } from "../../database/db.js";
import { Validation } from "../../validation/validation.js";
import {
  ErrorResponseMessage,
  ResponseError,
} from "../responses/error.response.js";
import {
  type CategoryGetOneResponseType,
  CategoryResponse,
} from "../responses/category.response.js";

export const categoryGetOne = (data: CategoryValidationGetOne): Promise<CategoryGetOneResponseType> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(CategoryValidation.GetOne, data)
    const category = await tx.category.findUnique({
      where: {
        ...(validatedData.by === "id"
          ? {
            id: data.value,
          }
          : { slug: data.value }),
      },
      select: CategoryResponse.GetOne,
    });

    if (!category)
      throw new ResponseError(ErrorResponseMessage.NOT_FOUND("category"));
    return category;
  })
}
