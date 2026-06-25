import { useQuery } from "@tanstack/react-query"
import {
  getAllUsers,
  getUser,
  type GetUsersParams,
} from "../../lib/api/user-api"
import { userKeys } from "./query-keys"

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getAllUsers(params),
  })
}

export function useUser(by: "id" | "email", value: string) {
  return useQuery({
    queryKey: userKeys.detail(by, value),
    queryFn: () => getUser(by, value),
    enabled: !!value,
  })
}
