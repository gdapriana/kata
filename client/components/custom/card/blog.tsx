import Link from "next/link"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BlogCard({ blog }: { blog: any }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group mb-4 flex flex-col items-stretch justify-start gap-4 relative"
    >
      {blog.status === "DRAFT" && <Badge className="absolute top-3 right-3" variant="destructive">Drafted</Badge>}
      {blog?.featuredImage?.url ? (
        <Image
          src={blog.featuredImage.url}
          alt={blog.featuredImage.alt || "cover"}
          width={200}
          height={200}
          className="aspect-video w-full rounded-lg object-cover grayscale transition duration-500 group-hover:grayscale-0"
          loading="lazy"
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-primary/5">
          <ImageOff className="text-muted-foreground/10" />
        </div>
      )}

      <div className="flex flex-col items-start justify-start gap-1">
        {blog.category && (
          <span className="text-xs text-muted-foreground uppercase">
            {blog.category.name}
          </span>
        )}
        <h3 className="line-clamp-1 font-serif font-bold">{blog.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground/50">
          {blog.excerpt}
        </p>
      </div>
    </Link>
  )
}
