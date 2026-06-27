import { Spinner } from "@/components/ui/spinner"
import { useBlogs } from "@/hooks/queries/use-blogs"
import BlogCard from "@/components/custom/card/blog"

export default function RelatedPost({ categoryId }: { categoryId: string }) {
  const { data: blogs, isLoading } = useBlogs({
    limit: 2,
    categoryId: categoryId,
    status: "PUBLISHED"
  })
  return (
    <div className="flex flex-col items-stretch justify-start">
      <header className="border-b py-4">
        <h3 className="font-serif text-lg font-black">Related post</h3>
      </header>

      {isLoading && (
        <div className="flex aspect-video items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="my-6 flex flex-col items-stretch justify-start gap-4">
        {!isLoading &&
          blogs &&
          blogs?.result?.query?.map((blog: any, idx: number) => (
            <BlogCard blog={blog} key={idx} />
          ))}
      </div>
    </div>
  )
}
