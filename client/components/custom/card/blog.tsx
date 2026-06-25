import Link from "next/link"
import Image from "next/image"
import { ImageOff } from "lucide-react"

export default function BlogCard({blog}: {blog: any}) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="flex flex-col group mb-4 items-stretch justify-start gap-4"
    >
      {blog?.featuredImage?.url ? (
        <Image
          src={blog.featuredImage.url}
          alt={blog.featuredImage.alt || "cover"}
          width={200}
          height={200}
          className="aspect-video grayscale group-hover:grayscale-0 transition duration-500 w-full rounded-lg object-cover"
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
        <h3 className="font-serif font-bold line-clamp-1">{blog.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground/50">{blog.excerpt}</p>
      </div>
    </Link>
  )
}
