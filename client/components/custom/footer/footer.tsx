"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  Check,
  Activity,
  Clock,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NAV, NavType } from "@/lib/constant"

export default function Footer() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  )
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`
    }
    return `${secs}s`
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) return

    setSubStatus("loading")
    setTimeout(() => {
      setSubStatus("success")
      setEmail("")
    }, 1200)
  }

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const getThemeIcon = () => {
    if (!mounted) return <Laptop size={16} />
    if (theme === "light") return <Sun size={16} className="text-amber-500" />
    if (theme === "dark") return <Moon size={16} className="text-violet-400" />
    return <Laptop size={16} />
  }

  return (
    <footer className="w-full border-t bg-muted/20 pt-16 pb-12 transition-colors duration-300">
      <div className="container px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col items-start gap-4 md:col-span-5">
            <Link href="/" className="group flex items-center gap-1">
              <motion.h2
                className="font-serif text-2xl font-black tracking-tight"
                whileHover={{ letterSpacing: "0.08em" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                kata.
              </motion.h2>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              In an age of digital noise, we curate space for clarity, focus,
              and profound writing. Rebuild your connection to deep thoughts.
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1.5 backdrop-blur-xs">
                <Clock size={13} className="animate-pulse text-primary/60" />
                <span>
                  Session focus:{" "}
                  <span className="font-mono font-medium text-foreground">
                    {formatTime(seconds)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border bg-background/50 px-3 py-1.5 backdrop-blur-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>Systems active</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:col-span-4 md:col-span-2">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground/75 uppercase">
              Explore
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {NAV.map((item: NavType, idx: number) => (
                <li key={idx}>
                  <Link
                    href={item.url}
                    className="inline-block text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:col-span-4 md:col-span-2">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground/75 uppercase">
              Community
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/write"
                  className="inline-block text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
                >
                  Write a Story
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="inline-block text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="inline-block text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Interactive Newsletter / Subscribe */}
          <div className="flex flex-col gap-4 sm:col-span-4 md:col-span-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground/75 uppercase">
                Newsletter
              </h3>
              <p className="text-xs text-muted-foreground">
                Weekly digests on mindfulness, stories, and slow reading.
              </p>
            </div>

            <div className="min-h-12.5 w-full">
              <AnimatePresence mode="wait">
                {subStatus !== "success" ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubscribe}
                    className="flex flex-col gap-2"
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative flex w-full items-center">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10 text-xs focus-visible:ring-1"
                        required
                        disabled={subStatus === "loading"}
                      />
                      <button
                        type="submit"
                        disabled={subStatus === "loading"}
                        className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-200 hover:bg-muted"
                      >
                        {subStatus === "loading" ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <ArrowRight size={14} />
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-600 dark:text-emerald-400"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check size={12} className="text-emerald-500" />
                    </div>
                    <span>
                      Welcome to the circle. 🌿 Check your inbox soon!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} kata. All rights reserved. Build
            by <Link href={"https://gedeapriana.vercel.app"}>@gedeapriana</Link>
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                aria-label="GitHub"
              >
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                aria-label="Twitter"
              >
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                aria-label="Instagram"
              >
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.01 3.752.054 2.502.114 3.793 1.412 3.907 3.907.043.968.054 1.32.054 3.752 0 2.43-.01 2.784-.054 3.752-.114 2.502-1.412 3.793-3.907 3.907-.968.043-1.32.054-3.752.054-2.43 0-2.784-.01-3.752-.054-2.502-.114-3.793-1.412-3.907-3.907-.043-.968-.054-1.32-.054-3.752 0-2.43.01-2.784.054-3.752.114-2.502 1.412-3.793 3.907-3.907.968-.043 1.32-.054 3.752-.054L12.315 2zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 0 000-2.881z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-2 border-l pl-6">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 rounded-full"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </Button>
              <div className="hidden flex-col text-[10px] text-muted-foreground sm:flex">
                <span className="font-semibold tracking-wider uppercase">
                  Theme
                </span>
                <span className="font-mono opacity-80">Press D to cycle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
