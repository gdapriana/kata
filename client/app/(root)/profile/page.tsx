"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut, User, Mail, Shield, Plus } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Saved from "@/app/(root)/profile/_components/saved"
import Liked from "@/app/(root)/profile/_components/liked"
import YourPost from "@/app/(root)/profile/_components/your-post"

export default function Page() {
  const router = useRouter()
  const { data: sessionData, isPending } = authClient.useSession()
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (!isPending && !sessionData) {
      router.push("/sign-up")
    }
  }, [isPending, sessionData, router])

  const handleSignOut = async () => {
    try {
      setLoggingOut(true)
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

  if (isPending) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </main>
    )
  }

  if (!sessionData) {
    return null
  }

  const user = sessionData.user

  return (
    <main className="p-6 pt-36">
      <div className="container">
        <div className="flex flex-col items-stretch justify-start gap-8">
          <div className="flex items-center justify-start gap-8">
            <Avatar className="h-20 w-20">
              <AvatarFallback>
                <User />
              </AvatarFallback>
              <AvatarImage src={user.image || ""} />
            </Avatar>
            <div className="flex flex-col items-start justify-start gap-1">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <h1 className="font-serif text-lg font-bold">{user.name}</h1>
              <div className="mt-4 flex items-center justify-start gap-2">
                <Button size="sm">
                  New Story <Plus />
                </Button>
                <Button size="sm" variant="outline">
                  Setting <User />
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="post">
            <TabsList variant="line">
              <TabsTrigger value="post">Your post</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="liked">Liked</TabsTrigger>
            </TabsList>
            <TabsContent value="post">
              <YourPost authorId={sessionData.user.id} />
            </TabsContent>
            <TabsContent value="saved">
              <Saved />
            </TabsContent>
            <TabsContent value="liked">
              <Liked />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
