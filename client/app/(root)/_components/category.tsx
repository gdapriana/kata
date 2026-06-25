'use client'
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { useCategories } from "@/hooks/queries/use-categories"
import { Button } from "@/components/ui/button"

export default function TopCategories() {
  const {data: categories, isLoading} = useCategories({
    limit: 10,
    sortBy: "blogsCount"
  })
  return (
    <div className="flex flex-col items-stretch justify-start">
      <header className="border-b py-4">
        <h3 className="font-serif text-lg font-black">Top pick category</h3>
      </header>

      {isLoading && (
        <div className="flex aspect-video items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="my-4 mt-4 flex flex-wrap gap-2">
        {!isLoading &&
          categories &&
          categories?.result?.query?.map((category: any, idx: number) => (
            <Button variant="secondary" asChild key={idx}>
              <Link
                href={`/categories/${category.slug}`}
              >{category.name}</Link>
            </Button>
          ))}
      </div>
    </div>
  )
}