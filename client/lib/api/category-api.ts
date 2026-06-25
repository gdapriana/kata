const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"

export interface GetCategoriesParams {
  page?: number
  limit?: number
  search?: string
  parentId?: string
  sortBy?: "createdAt" | "updatedAt" | "name" | "blogsCount"
  sortOrder?: "asc" | "desc"
}

export async function getAllCategories(params: GetCategoriesParams = {}) {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value))
    }
  })

  const url = `${SERVER_URL}/api/categories/query?${queryParams.toString()}`
  const res = await fetch(url)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch categories")
  }
  return res.json()
}

export async function getCategory(by: "id" | "slug", value: string) {
  const url = `${SERVER_URL}/api/categories/get?by=${by}&value=${value}`
  const res = await fetch(url)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch category")
  }
  return res.json()
}
