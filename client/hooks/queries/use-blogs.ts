import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAllBlogs,
  getBlog,
  toggleLikeBlog,
  toggleBookmarkBlog,
  getSavedBlogs,
  getLikedBlogs,
  createBlog,
  updateBlog,
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

export function useLikeBlog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleLikeBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: blogKeys.all,
      })
    },
  })
}

export function useBookmarkBlog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleBookmarkBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: blogKeys.all,
      })
    },
  })
}

export function useSavedBlogs(params: GetBlogsParams = {}) {
  return useQuery({
    queryKey: blogKeys.savedList(params),
    queryFn: () => getSavedBlogs(params),
  })
}

export function useLikedBlogs(params: GetBlogsParams = {}) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: blogKeys.likedList(params),
    queryFn: () => getLikedBlogs(params),
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: blogKeys.all,
      })
    },
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBlog,
    onSuccess: (data) => {
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: blogKeys.all,
      })
      // Invalidate specific detail queries
      if (data?.result?.slug) {
        queryClient.invalidateQueries({
          queryKey: blogKeys.detail("slug", data.result.slug),
        })
      }
      if (data?.result?.id) {
        queryClient.invalidateQueries({
          queryKey: blogKeys.detail("id", data.result.id),
        })
      }
    },
  })
}
