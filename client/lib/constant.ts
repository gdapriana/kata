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
    name: "Library",
    url: "/library",
  },
  {
    name: "Stories",
    url: "/stories",
  },
  {
    name: "Stats",
    url: "/stats",
  },
]
