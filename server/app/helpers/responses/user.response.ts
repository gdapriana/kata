import { Prisma } from "../../generated/prisma/client.js";

export class UserResponse {
  static GetOne = {
    id: true,
    name: true,
    email: true,
    emailVerified: true,
    image: true,
    role: true,
    _count: {
      select: {
        blogs: true,
        comments: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  } as const satisfies Prisma.UserSelect;

  static GetAll: Prisma.UserSelect = {
    id: true,
    name: true,
    email: true,
    emailVerified: true,
    image: true,
    role: true,
    _count: {
      select: {
        blogs: true,
        comments: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  };
}

export type UserGetOneResponseType = Prisma.UserGetPayload<{
  select: typeof UserResponse.GetOne;
}>;
export type UserGetAllResponseType = Prisma.UserGetPayload<{
  select: typeof UserResponse.GetAll;
}>;
