import { useQuery } from "@tanstack/react-query"
import {
  getAllCategories,
  getCategory,
  type GetCategoriesParams,
} from "../../lib/api/category-api"
import { categoryKeys } from "./query-keys"

export function useCategories(params: GetCategoriesParams = {}) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getAllCategories(params),
  })
}

export function useCategory(by: "id" | "slug", value: string) {
  return useQuery({
    queryKey: categoryKeys.detail(by, value),
    queryFn: () => getCategory(by, value),
    enabled: !!value,
  })
}
