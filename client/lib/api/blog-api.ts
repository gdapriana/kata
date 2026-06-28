const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"

export interface GetBlogsParams {
  page?: number
  limit?: number
  search?: string
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  categoryId?: string
  categorySlug?: string
  authorId?: string
  tagSlugs?: string | string[]
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "publishedAt"
    | "title"
    | "views"
    | "likedCount"
    | "favoriteCount"
  sortOrder?: "asc" | "desc"
  startDate?: string
  endDate?: string
}

export async function getAllBlogs(params: GetBlogsParams = {}) {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((val) => queryParams.append(key, val))
      } else {
        queryParams.append(key, String(value))
      }
    }
  })

  const url = `${SERVER_URL}/api/blogs/query?${queryParams.toString()}`
  const res = await fetch(url)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch blogs")
  }
  return res.json()
}

export async function getBlog(by: "id" | "slug", value: string) {
  const url = `${SERVER_URL}/api/blogs/get?by=${by}&value=${value}`
  const res = await fetch(url, {
    credentials: "include",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch blog")
  }
  return res.json()
}

export async function toggleLikeBlog(blogId: string) {
  const url = `${SERVER_URL}/api/blogs/like`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blogId }),
    credentials: "include",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to toggle like")
  }
  return res.json()
}

export async function toggleBookmarkBlog(blogId: string) {
  const url = `${SERVER_URL}/api/blogs/bookmark`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blogId }),
    credentials: "include",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to toggle bookmark")
  }
  return res.json()
}

export async function getSavedBlogs(params: GetBlogsParams = {}) {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((val) => queryParams.append(key, val))
      } else {
        queryParams.append(key, String(value))
      }
    }
  })

  const url = `${SERVER_URL}/api/blogs/saved?${queryParams.toString()}`
  const res = await fetch(url, {
    credentials: "include",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch saved blogs")
  }
  return res.json()
}

export async function getLikedBlogs(params: GetBlogsParams = {}) {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((val) => queryParams.append(key, val))
      } else {
        queryParams.append(key, String(value))
      }
    }
  })

  const url = `${SERVER_URL}/api/blogs/liked?${queryParams.toString()}`
  const res = await fetch(url, {
    credentials: "include",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch liked blogs")
  }
  return res.json()
}

export interface CreateBlogData {
  title: string
  slug: string
  content: string
  excerpt?: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  categoryId: string
  featuredImageId?: string
  galleryImageIds?: string[]
  tags?: string[]
}

export async function createBlog(data: CreateBlogData) {
  const url = `${SERVER_URL}/api/blogs/create`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to create post")
  }
  return res.json()
}

export type UpdateBlogData = Partial<CreateBlogData>

export async function updateBlog({ id, data }: { id: string; data: UpdateBlogData }) {
  const url = `${SERVER_URL}/api/blogs/${id}`
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to update post")
  }
  return res.json()
}
