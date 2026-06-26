import type {
  BlogValidationGetOne,
  BlogValidationGetAll,
} from "../validation/blog.validation.js"
import type {
  BlogGetOneResponseType,
  BlogGetAllResponseType,
} from "../helpers/responses/blog.response.js"
import { blogGetOne } from "../helpers/get/blog.get.js"
import { blogGetAll } from "../helpers/getAll/blog.getAll.js"
import type { Pagination } from "../helpers/types/pagination.type.js"
import { prismaClient } from "../database/db.js"
import { ResponseError, ErrorResponseMessage } from "../helpers/responses/error.response.js"

export class BlogService {
  static GetOne = async (
    data: BlogValidationGetOne,
    userId?: string
  ): Promise<BlogGetOneResponseType & { liked?: boolean; bookmarked?: boolean }> => {
    const blog = await blogGetOne(data)
    if (!blog) return blog

    let liked = false
    let bookmarked = false

    if (userId) {
      const likeCount = await prismaClient.blog.count({
        where: {
          id: blog.id,
          likedByUsers: {
            some: { id: userId },
          },
        },
      })
      liked = likeCount > 0

      const favCount = await prismaClient.blog.count({
        where: {
          id: blog.id,
          favoritedByUsers: {
            some: { id: userId },
          },
        },
      })
      bookmarked = favCount > 0
    }

    return {
      ...blog,
      liked,
      bookmarked,
    }
  }

  static GetAll = async (
    data: BlogValidationGetAll,
  ): Promise<{ query: BlogGetAllResponseType[]; pagination: Pagination }> => {
    return blogGetAll(data)
  }

  static Like = async (blogId: string, userId: string) => {
    const blog = await prismaClient.blog.findUnique({
      where: { id: blogId },
      select: { id: true },
    })
    if (!blog) {
      throw new ResponseError(ErrorResponseMessage.NOT_FOUND("blog"))
    }

    return prismaClient.$transaction(async (tx) => {
      const isLiked = await tx.blog.findFirst({
        where: {
          id: blogId,
          likedByUsers: {
            some: { id: userId },
          },
        },
      })

      if (isLiked) {
        const updated = await tx.blog.update({
          where: { id: blogId },
          data: {
            likedByUsers: {
              disconnect: { id: userId },
            },
            likedCount: {
              decrement: 1,
            },
          },
          select: { likedCount: true },
        })
        return { liked: false, likedCount: updated.likedCount }
      } else {
        const updated = await tx.blog.update({
          where: { id: blogId },
          data: {
            likedByUsers: {
              connect: { id: userId },
            },
            likedCount: {
              increment: 1,
            },
          },
          select: { likedCount: true },
        })
        return { liked: true, likedCount: updated.likedCount }
      }
    })
  }

  static Bookmark = async (blogId: string, userId: string) => {
    const blog = await prismaClient.blog.findUnique({
      where: { id: blogId },
      select: { id: true },
    })
    if (!blog) {
      throw new ResponseError(ErrorResponseMessage.NOT_FOUND("blog"))
    }

    return prismaClient.$transaction(async (tx) => {
      const isFavorited = await tx.blog.findFirst({
        where: {
          id: blogId,
          favoritedByUsers: {
            some: { id: userId },
          },
        },
      })

      if (isFavorited) {
        const updated = await tx.blog.update({
          where: { id: blogId },
          data: {
            favoritedByUsers: {
              disconnect: { id: userId },
            },
            favoriteCount: {
              decrement: 1,
            },
          },
          select: { favoriteCount: true },
        })
        return { bookmarked: false, favoriteCount: updated.favoriteCount }
      } else {
        const updated = await tx.blog.update({
          where: { id: blogId },
          data: {
            favoritedByUsers: {
              connect: { id: userId },
            },
            favoriteCount: {
              increment: 1,
            },
          },
          select: { favoriteCount: true },
        })
        return { bookmarked: true, favoriteCount: updated.favoriteCount }
      }
    })
  }
}
