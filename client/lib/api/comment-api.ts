const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"

export interface GetCommentsParams {
  blogId: string
  page?: number
  limit?: number
  parentId?: string | null
}

export async function getComments(params: GetCommentsParams) {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value))
    }
  })

  const url = `${SERVER_URL}/api/comments/query?${queryParams.toString()}`
  const res = await fetch(url, {
    credentials: "include",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch comments")
  }
  return res.json()
}

export interface CreateCommentParams {
  userId: string
  blogId: string
  parentId?: string | null
  content: string
}

export async function createComment(data: CreateCommentParams) {
  const url = `${SERVER_URL}/api/comments/create`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to create comment")
  }
  return res.json()
}

export async function deleteComment(commentId: string) {
  const url = `${SERVER_URL}/api/comments/delete/${commentId}`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to delete comment")
  }
  return res.json()
}
