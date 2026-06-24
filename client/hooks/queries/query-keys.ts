export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters: any) => [...blogKeys.lists(), { filters }] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (by: "id" | "slug", value: string) => [...blogKeys.details(), { by, value }] as const,
};
