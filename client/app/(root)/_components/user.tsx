"use client"
import { useUsers } from "@/hooks/queries/use-users"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

import { motion } from "framer-motion"

export default function TopUsers() {
  const { data: users, isLoading } = useUsers({
    sortBy: "blogsCount",
    limit: 20,
  })

  return (
    <main className="p-6">
      <div className="container">
        <div className="relative overflow-hidden border-t bg-background py-20">
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-20 bg-linear-to-r from-background via-background/70 to-transparent md:w-40" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-20 bg-linear-to-l from-background via-background/70 to-transparent md:w-40" />

          <header className="mb-10 flex items-center justify-center">
            <h2 className="text-center font-serif text-xl font-bold">
              Top Creator <br /> of the Month
            </h2>
          </header>

          {isLoading && (
            <div className="flex aspect-video items-center justify-center">
              <Spinner />
            </div>
          )}

          {!isLoading && users && users.result?.query && (
            <div className="flex w-full overflow-hidden">
              <motion.div
                className="flex shrink-0 gap-8"
                animate={{ x: ["-50%", "0%"] }}
                transition={{
                  ease: "linear",
                  duration: 25,
                  repeat: Infinity,
                }}
                style={{ width: "max-content" }}
              >
                {[...users.result.query, ...users.result.query].map(
                  (user: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex w-28 shrink-0 flex-col items-center justify-start gap-2 select-none"
                    >
                      <Avatar className="h-20 w-20 border border-primary/10">
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                        <AvatarImage
                          src={user?.image || ""}
                          className="object-cover grayscale"
                        />
                      </Avatar>
                      <div className="text-center">
                        <h4 className="max-w-27.5 truncate font-serif text-sm font-bold">
                          {user.name}
                        </h4>
                        <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
                          {user?._count.blogs}{" "}
                          {user?._count.blogs === 1 ? "Post" : "Posts"}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
