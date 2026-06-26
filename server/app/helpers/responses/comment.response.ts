import { Prisma } from "../../generated/prisma/client.js";

export class CommentResponse {
  static GetAll: Prisma.CommentSelect = {
    id: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    parentId: true,
    authorId: true,
    author: {
      select: {
        id: true,
        name: true,
        image: true,
      },
    },
    replies: {
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    },
  } as const satisfies Prisma.CommentSelect;

  static Create: Prisma.CommentSelect = {
    id: true,
  } as const satisfies Prisma.CommentSelect;

  static Delete: Prisma.CommentSelect = {
    id: true,
  } as const satisfies Prisma.CommentSelect;
}

export type CommentGetAllResponseType = Prisma.CommentGetPayload<{
  select: typeof CommentResponse.GetAll;
}>;

export type CommentCreateResponseType = Prisma.CommentGetPayload<{
  select: typeof CommentResponse.Create;
}>;

export type CommentDeleteResponseType = Prisma.CommentGetPayload<{
  select: typeof CommentResponse.Delete;
}>;
