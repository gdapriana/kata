import { Prisma } from "../../generated/prisma/client.js";

export class CategoryResponse {
  static GetOne = {
    id: true,
    slug: true,
    name: true,
    description: true,
    parentId: true,
    parent: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    children: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    _count: {
      select: {
        blogs: true,
        children: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  } as const satisfies Prisma.CategorySelect;

  static GetAll: Prisma.CategorySelect = {
    id: true,
    slug: true,
    name: true,
    description: true,
    parentId: true,
    _count: {
      select: {
        blogs: true,
        children: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  };
}

export type CategoryGetOneResponseType = Prisma.CategoryGetPayload<{
  select: typeof CategoryResponse.GetOne;
}>;
export type CategoryGetAllResponseType = Prisma.CategoryGetPayload<{
  select: typeof CategoryResponse.GetAll;
}>;
