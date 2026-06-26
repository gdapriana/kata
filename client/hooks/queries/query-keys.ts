export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters: any) => [...blogKeys.lists(), { filters }] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (by: "id" | "slug", value: string) =>
    [...blogKeys.details(), { by, value }] as const,
}

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: any) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (by: "id" | "slug", value: string) =>
    [...categoryKeys.details(), { by, value }] as const,
}

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: any) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (by: "id" | "email", value: string) =>
    [...userKeys.details(), { by, value }] as const,
}

export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (filters: any) => [...commentKeys.lists(), { filters }] as const,
}
