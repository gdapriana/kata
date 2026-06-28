import { LucideIcon } from "lucide-react"

export type NavType = {
  name: string
  url: string
  logo?: LucideIcon
}

export const NAV: NavType[] = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Stories",
    url: "/stories",
  },
  {
    name: "Activity",
    url: "/activity",
  },
]
