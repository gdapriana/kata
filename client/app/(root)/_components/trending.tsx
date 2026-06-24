'use client'

import { Spinner } from "@/components/ui/spinner"
import { useBlogs } from "@/hooks/queries/use-blogs"
import Link from "next/link"

export default function Trending() {
    const {data: blogs, isLoading} = useBlogs({
        limit: 5
    })
  return (
    <div className="flex flex-col justify-start items-stretch">
        <header className="border-b py-4"><h3 className="font-serif font-black">Trending this Month</h3></header>

        {isLoading && (
            <div className="aspect-video flex justify-center items-center">
                <Spinner />
            </div>
        )}

        <div className="flex my-4 flex-col justify-start items-stretch gap-4">
            {!isLoading && blogs && blogs?.result?.query?.map((blog: any, idx: number) => (
                <Link href={`/blogs/${blog.slug}`} className="flex hover:bg-primary/5 rounded-lg p-2 justify-start gap-2 items-center" key={idx}>
                    <span className="font-serif text-2xl font-bold opacity-25">0{idx + 1}</span>
                    <div className="flex flex-col justify-center items-start">
                        <h3 className="font-bold text-sm line-clamp-1">{blog.title}</h3>
                        <p className="text-muted-foreground text-xs">{blog?.author?.name} • {blog?.readTime} minutes read</p>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}
 