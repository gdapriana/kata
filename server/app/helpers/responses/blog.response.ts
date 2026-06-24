import { Prisma } from "../../generated/prisma/client.js";

export class BlogResponse {
    static GetOne = {
        id: true,
        slug: true,
        title: true,
        authorId: true,
        content: true,
        updatedAt: true,
        createdAt: true,
        likedCount: true,
        favoriteCount: true,
        tags: {
            select: {
                id: true,
                name: true,
                slug: true
            }
        },
        featuredImage: {
            select: {
                alt: true,
                id: true,
                url: true
            }
        },
        category: {
            select: {
                id: true,
                name: true,
                slug: true
            }
        },
        author: {
            select: {
                name: true,
                image: true,
                email: true,
                id: true
            }
        },
        _count: {
            select: {
                comments: true,
                favoritedByUsers: true,
                galleryImages: true,
                likedByUsers: true,
                tags: true
            }
        }
    } as const satisfies Prisma.BlogSelect

    static GetAll: Prisma.BlogSelect = {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        updatedAt: true,
        createdAt: true,
        likedCount: true,
        favoriteCount: true,
        tags: {
            select: {
                id: true,
                name: true,
                slug: true
            }
        },
        featuredImage: {
            select: {
                alt: true,
                id: true,
                url: true
            }
        },
        category: {
            select: {
                id: true,
                name: true,
                slug: true
            }
        },
        author: {
            select: {
                name: true,
                image: true,
                email: true,
                id: true
            }
        },
        _count: {
            select: {
                comments: true,
                favoritedByUsers: true,
                galleryImages: true,
                likedByUsers: true,
                tags: true
            }
        }
    }

    static Create: Prisma.BlogSelect = {
        id: true
    }
    static Update = this.Create
    static Delete = this.Create
}

export type BlogGetOneResponseType = Prisma.BlogGetPayload<{
    select: typeof BlogResponse.GetOne
}>
export type BlogGetAllResponseType = Prisma.BlogGetPayload<{
    select: typeof BlogResponse.GetAll
}>