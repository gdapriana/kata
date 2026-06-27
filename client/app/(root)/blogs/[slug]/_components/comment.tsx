"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trash2,
  CornerDownRight,
  Loader2,
  MessageSquare,
  Lock,
  ArrowDown,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import {
  useComments,
  useCreateComment,
  useDeleteComment,
} from "@/hooks/queries/use-comments"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Comment({ blogId }: { blogId: string }) {
  const router = useRouter()
  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession()
  const sessionUser = sessionData?.user

  // Queries
  const {
    data: commentPages,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useComments({ blogId, limit: 3 })

  // Mutations
  const createMutation = useCreateComment()
  const deleteMutation = useDeleteComment()

  // Local Form state for root comments
  const [rootContent, setRootContent] = useState("")

  const handleAuthCheck = () => {
    if (!sessionUser) {
      router.push("/sign-in")
      return false
    }
    return true
  }

  const handleRootSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!handleAuthCheck()) return
    if (!rootContent.trim()) return

    try {
      await createMutation.mutateAsync({
        userId: sessionUser!.id,
        blogId,
        parentId: null,
        content: rootContent.trim(),
      })
      setRootContent("")
    } catch (err) {
      console.error("Failed to post comment:", err)
    }
  }

  const handleReplySubmit = async (content: string, parentId: string) => {
    if (!handleAuthCheck()) return
    if (!content.trim()) return

    await createMutation.mutateAsync({
      userId: sessionUser!.id,
      blogId,
      parentId,
      content: content.trim(),
    })
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!handleAuthCheck()) return
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteMutation.mutateAsync(commentId)
      } catch (err) {
        console.error("Failed to delete comment:", err)
      }
    }
  }

  const allComments =
    commentPages?.pages.flatMap((page) => page?.result?.query || []) || []
  const totalComments =
    commentPages?.pages[0]?.result?.pagination?.totalItems || 0

  return (
    <div className="mt-16 border-t pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-serif text-xl font-bold">
          <MessageSquare className="h-5 w-5 text-primary" />
          Responses ({totalComments})
        </h3>
      </div>

      {/* Root Comment Form */}
      <div className="mb-10 flex gap-4 rounded-xl border bg-muted/10 p-4">
        <Avatar className="h-9 w-9 shrink-0 border">
          <AvatarImage
            src={sessionUser?.image || ""}
            alt={sessionUser?.name || "avatar"}
          />
          <AvatarFallback className="bg-muted text-xs">U</AvatarFallback>
        </Avatar>

        <form onSubmit={handleRootSubmit} className="flex-1 space-y-3">
          <textarea
            placeholder={
              sessionUser
                ? "What are your thoughts?"
                : "Sign in to join the conversation..."
            }
            value={rootContent}
            onChange={(e) => setRootContent(e.target.value)}
            onClick={handleAuthCheck}
            rows={3}
            className="w-full resize-none border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
            disabled={createMutation.isPending}
          />
          <div className="flex items-center justify-between border-t pt-2.5">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              {!sessionUser && <Lock className="h-3 w-3" />}
              {!sessionUser ? "Sign in required" : "Markdown not supported"}
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending || !rootContent.trim()}
              className="rounded-full px-4 text-xs font-semibold"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  Responding
                </>
              ) : (
                "Respond"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="mb-2 h-8 w-8 animate-spin" />
          <p className="text-xs">Loading responses...</p>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/10 bg-destructive/5 p-4 text-center text-sm text-destructive">
          Failed to load responses. Please try again.
        </div>
      ) : allComments.length === 0 ? (
        <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
          No responses yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {allComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                sessionUserId={sessionUser?.id}
                onDelete={handleDeleteComment}
                isDeleting={deleteMutation.isPending}
                onReplySubmit={handleReplySubmit}
              />
            ))}
          </AnimatePresence>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center gap-1.5 rounded-full text-xs"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <ArrowDown className="h-3.5 w-3.5" />
                    Load more responses
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Recursive Comment Item Component
interface CommentItemProps {
  comment: any
  sessionUserId?: string
  onDelete: (id: string) => void
  isDeleting: boolean
  onReplySubmit: (content: string, parentId: string) => void
  depth?: number
}

function CommentItem({
  comment,
  sessionUserId,
  onDelete,
  isDeleting,
  onReplySubmit,
  depth = 0,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [replySubmitting, setReplySubmitting] = useState(false)

  const isOwner = sessionUserId === comment.authorId
  const canReply = depth < 3

  const handleReplySubmitLocal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    setReplySubmitting(true)
    try {
      await onReplySubmit(replyContent.trim(), comment.id)
      setReplyContent("")
      setIsReplying(false)
    } catch (err) {
      console.error(err)
    } finally {
      setReplySubmitting(false)
    }
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHrs = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHrs / 24)

    if (diffSecs < 60) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHrs < 24) return `${diffHrs}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative ${depth > 0 ? "mt-4 ml-6 border-l pl-4" : ""}`}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0 border">
          <AvatarImage
            src={comment.author?.image || ""}
            alt={comment.author?.name}
          />
          <AvatarFallback className="bg-muted text-xs">U</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">
                {comment.author?.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>

            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="h-7 w-7 shrink-0 rounded-full text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
                aria-label="Delete comment"
              >
                <Trash2 size={13} />
              </Button>
            )}
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
            {comment.content}
          </p>

          {canReply && (
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <CornerDownRight size={12} />
                Reply
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isReplying && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleReplySubmitLocal}
            className="mt-3 ml-11 flex items-start gap-3 rounded-lg border bg-muted/5 p-3"
          >
            <textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              className="w-full resize-none border-0 bg-transparent p-0 text-xs placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
              disabled={replySubmitting}
            />
            <div className="flex shrink-0 flex-col gap-1.5 self-end">
              <Button
                type="submit"
                size="sm"
                disabled={replySubmitting || !replyContent.trim()}
                className="h-7 rounded-md px-3 text-[10px] font-semibold"
              >
                {replySubmitting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Reply"
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setIsReplying(false)}
                className="h-7 rounded-md px-3 text-[10px] font-semibold"
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Child replies list */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              sessionUserId={sessionUserId}
              onDelete={onDelete}
              isDeleting={isDeleting}
              onReplySubmit={onReplySubmit}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
