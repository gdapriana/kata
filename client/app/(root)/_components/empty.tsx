import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, FileText, Heart, Inbox } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: "post" | "saved" | "liked" | "default"
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export default function EmptyState({
  title = "No items found",
  description = "There are no items to display at the moment.",
  icon = "default",
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const renderIcon = () => {
    const iconClass =
      "h-8 w-8 text-muted-foreground/80 transition-transform duration-300 group-hover:scale-110"
    switch (icon) {
      case "post":
        return <FileText className={iconClass} />
      case "saved":
        return <Bookmark className={iconClass} />
      case "liked":
        return <Heart className={iconClass} />
      default:
        return <Inbox className={iconClass} />
    }
  }

  return (
    <div className="group relative overflow-hidden bg-transparent py-20 transition-all duration-300">
      <div className="absolute top-1/2 left-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[50px] transition-all duration-500 group-hover:bg-indigo-500/10 dark:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20" />
      <CardContent className="flex flex-col items-center justify-center p-8 text-center md:p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-muted-foreground/20 bg-muted/40 transition-all duration-300 group-hover:border-muted-foreground/40 group-hover:bg-muted/60">
          {renderIcon()}
        </div>

        <h3 className="mt-5 font-serif font-semibold tracking-tight text-foreground md:text-xl">
          {title}
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>

        {actionLabel && (actionHref || onAction) && (
          <div className="mt-6">
            {actionHref ? (
              <Button
                asChild
                variant="outline"
                className="shadow-xs transition-transform active:scale-95"
              >
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button
                onClick={onAction}
                variant="outline"
                className="shadow-xs transition-transform active:scale-95"
              >
                {actionLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </div>
  )
}
