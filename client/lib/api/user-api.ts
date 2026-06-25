const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"

export interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: "USER" | "ADMIN"
  sortBy?: "createdAt" | "updatedAt" | "name" | "email" | "blogsCount"
  sortOrder?: "asc" | "desc"
}

export async function getAllUsers(params: GetUsersParams = {}) {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value))
    }
  })

  const url = `${SERVER_URL}/api/users/query?${queryParams.toString()}`
  const res = await fetch(url)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch users")
  }
  return res.json()
}

export async function getUser(by: "id" | "email", value: string) {
  const url = `${SERVER_URL}/api/users/get?by=${by}&value=${value}`
  const res = await fetch(url)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch user")
  }
  return res.json()
}
