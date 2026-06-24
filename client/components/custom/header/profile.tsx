"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { LogIn, LogOut, Plus, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Profile() {
  const { data: sessionData, isPending } = authClient.useSession()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in")
            router.refresh()
          },
        },
      })
    } catch (err) {
      console.error("Sign out failed:", err)
    } finally {
      setLoggingOut(false)
    }
  }

  if (isPending) return <Spinner className="md:ml-4" />

  if (!sessionData) {
    return (
      <Button asChild>
        <Link href="/sign-in" className="md:ml-4">
          Sign in <LogIn />
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="md:ml-4 cursor-pointer">
          <AvatarFallback>
            <User size={16} />
          </AvatarFallback>
          <AvatarImage src={sessionData.user.image || ""} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem className="justify-between">
            Create Story
            <Plus />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem className="justify-between cursor-pointer">
            Profile
            <User />
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-between cursor-pointer">
            Setting
            <Settings />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSignOut} variant="destructive" className="justify-between cursor-pointer">
            Sign Out
            <LogOut />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
