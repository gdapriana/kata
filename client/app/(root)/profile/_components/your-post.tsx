import EmptyState from "@/app/(root)/_components/empty"
import BlogCard from "@/components/custom/card/blog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useBlogs } from "@/hooks/queries/use-blogs"

export default function YourPost({ authorId }: { authorId: string }) {
  const {
    data: blogs,
    isLoading,
    isError,
    error,
    refetch,
  } = useBlogs({
    authorId,
  })

  if (isLoading) {
    return (
      <div className="flex aspect-video items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (isError) {
    return (
      <div className="space-y-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        <p className="font-semibold">Error fetching blogs</p>
        <p className="text-sm">
          {(error as any)?.message || "An unexpected error occurred."}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    )
  }
  if (!isLoading && !isError && blogs?.result?.query?.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="mt-8 mb-12 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {!isLoading &&
        !isError &&
        blogs?.result?.query?.length !== 0 &&
        blogs.result.query.map((blog: any, idx: number) => (
          <BlogCard blog={blog} key={idx} />
        ))}
    </div>
  )
}
