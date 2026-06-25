'use client'
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
        <div className="relative overflow-hidden border-y py-20 bg-background">
          <div className="absolute top-0 bottom-0 left-0 w-20 md:w-40 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background via-background/70 to-transparent pointer-events-none z-10" />

          <header className="flex items-center justify-center mb-10">
            <h2 className="font-serif text-center text-xl font-bold">
              Top Creator <br/> of the Month
            </h2>
          </header>

          {isLoading && (
            <div className="flex aspect-video items-center justify-center">
              <Spinner />
            </div>
          )}

          {!isLoading && users && users.result?.query && (
            <div className="flex overflow-hidden w-full">
              <motion.div
                className="flex gap-8 shrink-0"
                animate={{ x: ["-50%", "0%"] }}
                transition={{
                  ease: "linear",
                  duration: 25,
                  repeat: Infinity,
                }}
                style={{ width: "max-content" }}
              >
                {[...users.result.query, ...users.result.query].map((user: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 justify-start items-center w-28 shrink-0 select-none"
                  >
                    <Avatar className="w-20 h-20 border border-primary/10">
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                      <AvatarImage src={user?.image || ""} className="object-cover grayscale" />
                    </Avatar>
                    <div className="text-center">
                      <h4 className="font-serif font-bold text-sm truncate max-w-[110px]">
                        {user.name}
                      </h4>
                      <span className="text-[11px] text-muted-foreground block font-medium mt-0.5">
                        {user?._count.blogs} {user?._count.blogs === 1 ? "Post" : "Posts"}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}