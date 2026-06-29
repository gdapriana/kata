"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Clock,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Share2,
  Check,
  Bookmark,
  Edit,
} from "lucide-react"

import {
  useBlog,
  useLikeBlog,
  useBookmarkBlog,
} from "@/hooks/queries/use-blogs"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StatusState from "@/components/custom/status-state"
import { Spinner } from "@/components/ui/spinner"
import Trending from "@/app/(root)/_components/trending"
import RelatedPost from "@/app/(root)/stories/[slug]/_components/related"
import Comment from "@/app/(root)/stories/[slug]/_components/comment"

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const { data: sessionData } = authClient.useSession()
  const sessionUser = sessionData?.user
  const [loadingLike, setLoadingLike] = useState<boolean>(false)
  const [loadingBookmark, setLoadingBookmark] = useState<boolean>(false)

  const { data, isLoading, isError, error, refetch } = useBlog("slug", slug)
  const blog = data?.result

  const likeMutation = useLikeBlog()
  const bookmarkMutation = useBookmarkBlog()

  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLikeToggle = async () => {
    if (!sessionUser) {
      router.push("/sign-in")
      return
    }
    setLoadingLike(true)
    if (!blog) return
    try {
      await likeMutation.mutateAsync(blog.id)
    } catch (err) {
      console.error("Failed to toggle like:", err)
    } finally {
      setLoadingLike(false)
    }
  }

  const handleBookmarkToggle = async () => {
    if (!sessionUser) {
      router.push("/sign-in")
      return
    }
    if (!blog) return
    setLoadingBookmark(true)
    try {
      await bookmarkMutation.mutateAsync(blog.id)
    } catch (err) {
      console.error("Failed to toggle bookmark:", err)
    } finally {
      setLoadingBookmark(false)
    }
  }

  if (isLoading) {
    return (
      <main>
        <div className="container flex aspect-video items-center justify-center">
          <Spinner />
        </div>
      </main>
    )
  }

  if (isError) {
    const is404 = error?.message?.toLowerCase().includes("not found")

    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6 pt-32 pb-24">
        {is404 ? (
          <StatusState
            type="not-found"
            title="Blog Post Not Found"
            message={`We couldn't find a blog post with the address "${slug}". It may have been deleted or moved.`}
            actionHref="/"
            actionLabel="Back to Home"
          />
        ) : (
          <StatusState
            type="error"
            title="Failed to Load Blog"
            message={
              error?.message ||
              "An unexpected error occurred while fetching the story."
            }
            onRetry={refetch}
            actionHref="/"
            actionLabel="Back to Home"
          />
        )}
      </main>
    )
  }

  if (!blog) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6 pt-32 pb-24">
        <StatusState
          type="not-found"
          title="Blog Post Not Found"
          message={`The blog post you requested could not be found.`}
          actionHref="/"
          actionLabel="Back to Home"
        />
      </main>
    )
  }

  const publishedDate = blog.publishedAt || blog.createdAt
  const liked = !!blog.liked
  const bookmarked = !!blog.bookmarked
  const likesCount = blog.likedCount || 0
  const bookmarksCount = blog.favoriteCount || 0

  return (
    <main className="px-6 pt-32 pb-24">
      <div className="container">
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {blog.category && (
            <Link
              href={`/blogs-example?categorySlug=${blog.category.slug}`}
              className="mb-4 inline-block text-xs font-semibold tracking-wider text-primary uppercase hover:underline"
            >
              {blog.category.name}
            </Link>
          )}

          <h1 className="mb-6 font-serif text-3xl leading-tight font-black tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {blog.title}
          </h1>

          <div className="mb-8 flex flex-col gap-4 border-y py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={blog.author?.image || ""}
                  alt={blog.author?.name}
                />
                <AvatarFallback>
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-foreground">
                  {blog.author?.name}
                </span>
                <div className="mt-0.5 flex items-center gap-2 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(publishedDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {blog.readTime || 5} min read
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="ghost"
                size="sm"
                disabled={loadingLike}
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 rounded-full text-xs transition-colors duration-300 ${
                  liked ? "" : "text-muted-foreground"
                }`}
              >
                <Heart size={14} className={liked ? "fill-current" : ""} />
                <span>{likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmarkToggle}
                disabled={loadingBookmark}
                className={`flex items-center gap-1.5 rounded-full text-xs transition-colors duration-300 ${
                  bookmarked ? "" : "text-muted-foreground"
                }`}
                aria-label="Bookmark story"
              >
                <Bookmark
                  size={14}
                  className={bookmarked ? "fill-current" : ""}
                />
                <span>{bookmarksCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 rounded-full text-xs text-muted-foreground"
              >
                <MessageCircle size={14} />
                <span>{blog._count.comments || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="relative h-8 w-8 rounded-full text-muted-foreground"
                aria-label="Share story"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Share2 size={14} />
                )}
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-0.5 text-[10px] text-background shadow-md">
                    Copied!
                  </span>
                )}
              </Button>

              {sessionData && sessionData.user.id === blog.authorId && (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full text-muted-foreground"
                  aria-label="Edit"
                >
                  <Link href={`/blogs/${blog.slug}/edit`}>
                    <Edit />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-start gap-8 md:flex-row md:items-start md:justify-center">
            <div className="flex flex-col items-stretch justify-start md:w-2/3">
              {blog.featuredImage?.url && (
                <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl shadow-md">
                  <Image
                    src={blog.featuredImage.url}
                    alt={blog.featuredImage.alt || blog.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    priority
                  />
                </div>
              )}

              {blog.excerpt && (
                <div className="mb-4 border-b py-4">
                  <p className="text-sm">{blog.excerpt}</p>
                </div>
              )}

              <article
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="prose space-y-6 text-justify text-sm leading-relaxed whitespace-pre-wrap text-foreground/70 dark:prose-invert"
              ></article>

              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2 border-t pt-10">
                  {blog.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="rounded-full border bg-secondary/80 px-3.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
              <Comment blogId={blog.id} />
            </div>
            <div className="relative flex flex-col items-stretch justify-start gap-2 md:w-1/3">
              <div className="sticky top-0 flex-col items-stretch justify-start">
                <RelatedPost
                  categoryId={blog.category.id}
                  currentBlogId={blog.id}
                />
                <Trending />
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </main>
  )
}
