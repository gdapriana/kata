import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  uploadSingleImage,
  uploadBulkImages,
  deleteImage,
} from "../../lib/api/image-api"
import { imageKeys } from "./query-keys"

export function useUploadSingleImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: uploadSingleImage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: imageKeys.all,
      })
    },
  })
}

export function useUploadBulkImages() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: uploadBulkImages,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: imageKeys.all,
      })
    },
  })
}

export function useDeleteImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: imageKeys.all,
      })
    },
  })
}
