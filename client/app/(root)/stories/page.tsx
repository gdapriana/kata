"use client"
import EmptyState from "@/app/(root)/_components/empty"
import BlogCard from "@/components/custom/card/blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useBlogs } from "@/hooks/queries/use-blogs"
import { GetBlogsParams } from "@/lib/api/blog-api"
import { useState } from "react"

export default function Page() {
  const [blogParams, setBlogParams] = useState<GetBlogsParams>({
    limit: 8,
    status: "PUBLISHED",
    page: 1,
  })

  const { data: blogs, isLoading } = useBlogs(blogParams)

  return (
    <main className="p-6 pt-44">
      <div className="container mb-8 flex flex-col gap-12">
        <header className="flex flex-col items-center justify-center gap-4">
          <h1 className="font-serif text-lg font-bold">
            Explore the <i>Unseen</i>
          </h1>
          <Input
            onChange={(e) =>
              setBlogParams((prev) => ({
                ...prev,
                search: e.target.value === "" ? undefined : e.target.value,
              }))
            }
            className="max-w-sm"
            autoFocus
            placeholder="Type anything"
          />
        </header>

        {isLoading && (
          <div className="flex aspect-video items-center justify-center">
            <Spinner />
          </div>
        )}

        {!isLoading &&
          blogs &&
          blogs?.result?.query &&
          blogs.result.query.length === 0 && <EmptyState />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {!isLoading &&
            blogs &&
            blogs?.result?.query?.map((blog: any, idx: number) => (
              <BlogCard blog={blog} key={idx} />
            ))}
        </div>

        {!isLoading &&
          blogs &&
          blogs?.result &&
          blogs.result?.pagination &&
          blogs.result.pagination.hasNext && (
            <div className="flex items-center justify-center py-4">
              <Button
                onClick={() =>
                  setBlogParams((prev) => ({ ...prev, limit: prev.limit! + 4 }))
                }
                variant="outline"
              >
                Load more stories...
              </Button>
            </div>
          )}
      </div>
    </main>
  )
}
