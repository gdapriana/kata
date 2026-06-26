import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getComments, 
  createComment, 
  deleteComment, 
  type GetCommentsParams 
} from "@/lib/api/comment-api"
import { commentKeys } from "./query-keys"

export function useComments(params: Omit<GetCommentsParams, "page">) {
  return useInfiniteQuery({
    queryKey: commentKeys.list(params),
    queryFn: ({ pageParam = 1 }) => getComments({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.result?.pagination || lastPage?.pagination
      if (pagination && pagination.hasNext) {
        return pagination.page + 1
      }
      return undefined
    },
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      })
    },
  })
}
