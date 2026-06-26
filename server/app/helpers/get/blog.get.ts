import {
  BlogValidation,
  type BlogValidationGetOne,
} from "../../validation/blog.validation.js";
import { prismaClient } from "../../database/db.js";
import { Validation } from "../../validation/validation.js";
import {
  ErrorResponseMessage,
  ResponseError,
} from "../responses/error.response.js";
import {
  type BlogGetOneResponseType,
  BlogResponse,
} from "../responses/blog.response.js";

export const blogGetOne = (
  data: BlogValidationGetOne,
): Promise<BlogGetOneResponseType> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(BlogValidation.GetOne, data);
    const product = await tx.blog.findUnique({
      where: {
        ...(validatedData.by === "id"
          ? {
              id: data.value,
            }
          : { slug: data.value }),
      },
      select: BlogResponse.GetOne,
    });

    if (!product)
      throw new ResponseError(ErrorResponseMessage.NOT_FOUND("blog"));
    return product;
  });
};
