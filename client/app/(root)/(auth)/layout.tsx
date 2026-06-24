"use client"

import { authClient } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: sessionData, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && sessionData) {
      router.push("/profile")
    }
  }, [isPending, sessionData, router])

  if (isPending) {
    return (
      <main className="fixed top-0 left-0 z-99 flex h-dvh w-full items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </main>
    )
  }

  if (sessionData) {
    return null
  }

  return <div className="fixed top-0 left-0 z-99 h-dvh w-full">{children}</div>
}
