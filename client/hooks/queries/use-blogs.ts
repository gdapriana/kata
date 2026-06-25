import { useQuery } from "@tanstack/react-query"
import {
  getAllBlogs,
  getBlog,
  type GetBlogsParams,
} from "../../lib/api/blog-api"
import { blogKeys } from "./query-keys"

export function useBlogs(params: GetBlogsParams = {}) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => getAllBlogs(params),
  })
}

export function useBlog(by: "id" | "slug", value: string) {
  return useQuery({
    queryKey: blogKeys.detail(by, value),
    queryFn: () => getBlog(by, value),
    enabled: !!value,
  })
}
