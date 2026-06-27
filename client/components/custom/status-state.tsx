"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, Search, Inbox, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StatusStateProps {
  type: "error" | "not-found" | "empty"
  title?: string
  message?: string
  actionLabel?: string
  actionHref?: string
  onRetry?: () => void
}

export default function StatusState({
  type,
  title,
  message,
  actionLabel,
  actionHref,
  onRetry,
}: StatusStateProps) {
  // Custom styling and icons depending on type
  const config = {
    error: {
      icon: <AlertCircle className="h-8 w-8 text-destructive" />,
      title: title || "An error occurred",
      message:
        message ||
        "We had trouble loading this content. Please check your connection and try again.",
      colorClass: "bg-destructive/10 border-destructive/20 text-destructive",
      iconBg: "bg-destructive/10 border-destructive/20",
    },
    "not-found": {
      icon: <Search className="h-8 w-8 text-amber-600 dark:text-amber-400" />,
      title: title || "Content not found",
      message:
        message ||
        "The item you are looking for doesn't exist, was deleted, or has been moved.",
      colorClass:
        "bg-amber-500/5 border-amber-500/10 text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
    empty: {
      icon: <Inbox className="h-8 w-8 text-muted-foreground/80" />,
      title: title || "No items found",
      message: message || "There is no content available in this section yet.",
      colorClass: "bg-muted/10 border-muted/20 text-muted-foreground",
      iconBg: "bg-muted/20 border-muted/30",
    },
  }[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center shadow-lg backdrop-blur-xs"
    >
      {/* Icon Container */}
      <div
        className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border ${config.iconBg}`}
      >
        {config.icon}
      </div>

      {/* Typography */}
      <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">
        {config.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        {config.message}
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="default"
            className="group flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
            Try Again
          </Button>
        )}

        {actionHref && actionLabel && (
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href={actionHref}>
              <ArrowLeft className="h-3.5 w-3.5" />
              {actionLabel}
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  )
}
