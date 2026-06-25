"use client"

import { Spinner } from "@/components/ui/spinner"
import { useBlogs } from "@/hooks/queries/use-blogs"
import Link from "next/link"

export default function Trending() {
  const { data: blogs, isLoading } = useBlogs({
    limit: 5,
  })
  return (
    <div className="flex flex-col items-stretch justify-start">
      <header className="border-b py-4">
        <h3 className="font-serif text-lg font-black">Trending this Month</h3>
      </header>

      {isLoading && (
        <div className="flex aspect-video items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="my-4 flex flex-col items-stretch justify-start gap-4">
        {!isLoading &&
          blogs &&
          blogs?.result?.query?.map((blog: any, idx: number) => (
            <Link
              href={`/blogs/${blog.slug}`}
              className="flex items-center justify-start gap-2 rounded-lg p-2 hover:bg-primary/5"
              key={idx}
            >
              <span className="font-serif text-2xl font-bold opacity-25">
                0{idx + 1}
              </span>
              <div className="flex flex-col items-start justify-center">
                <h3 className="line-clamp-1 text-sm font-bold">{blog.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {blog?.author?.name} • {blog?.readTime} minutes read
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}
