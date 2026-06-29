"use client"
import Trending from "@/app/(root)/_components/trending"
import { useBlogs } from "@/hooks/queries/use-blogs"
import { Spinner } from "@/components/ui/spinner"
import BlogCard from "@/components/custom/card/blog"
import TopCategories from "@/app/(root)/_components/category"

export default function LatestStories() {
  const { data: blogs, isLoading } = useBlogs({
    sortBy: "createdAt",
    limit: 6,
    status: "PUBLISHED",
  })

  return (
    <main className="p-6">
      <div className="container my-4 flex flex-col items-stretch justify-start gap-8 md:flex-row md:items-start md:justify-center">
        <div className="md:w-2/3">
          <header className="border-b py-4">
            <h3 className="font-serif text-lg font-black">Latest stories</h3>
          </header>

          {isLoading && (
            <div className="flex aspect-video items-center justify-center">
              <Spinner />
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-2">
            {!isLoading &&
              blogs &&
              blogs?.result?.query?.map((blog: any, idx: number) => (
                <BlogCard blog={blog} key={idx} />
              ))}
          </div>
        </div>
        <div className="md:w-1/3">
          <Trending />
          <TopCategories />
        </div>
      </div>
    </main>
  )
}
