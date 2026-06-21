import {
  BlogValidation,
  type BlogValidationGetOne,
} from "../../validation/blog.validation.ts";
import { prismaClient } from "../../database/db.ts";
import { Validation } from "../../validation/validation.ts";
import {
  ErrorResponseMessage,
  ResponseError,
} from "../responses/error.response.ts";
import {
  type BlogGetOneResponseType,
  BlogResponse,
} from "../responses/blog.response.ts";

export const blogGetOne = (data: BlogValidationGetOne): Promise<BlogGetOneResponseType> => {
  return prismaClient.$transaction(async (tx) => {
    const validatedData = Validation.validate(BlogValidation.GetOne, data)
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
  })
}