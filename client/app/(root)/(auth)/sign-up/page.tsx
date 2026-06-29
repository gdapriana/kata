"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
} from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function Page() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name.trim()) {
      setError("Name is required")
      return
    }
    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    try {
      setLoading(true)
      const res = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      })

      if (res?.error) {
        setError(
          res.error.message || "An unexpected error occurred during sign up."
        )
      } else {
        setSuccess("Account created successfully! Redirecting...")
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1500)
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    setSuccess(null)
    try {
      setGoogleLoading(true)
      await authClient.signIn.social({
        provider: "google",
        callbackURL: typeof window !== "undefined" ? `${window.location.origin}/` : "/",
      })
    } catch (err: any) {
      setError(err?.message || "Failed to sign up with Google.")
      setGoogleLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="relative w-full max-w-md">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-12 -bottom-12 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <Card className="border border-border/80 bg-card/60 shadow-2xl backdrop-blur-md">
          <CardHeader className="space-y-1.5 pb-6 text-center">
            <CardTitle className="font-heading text-3xl font-semibold tracking-tight text-foreground">
              Create an account
            </CardTitle>
            <CardDescription className="text-muted-foreground/90">
              Enter your details below to create your account or sign up with
              Google
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div
                className="animate-in rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive duration-200 fade-in slide-in-from-top-2"
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="animate-in rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600 duration-200 fade-in slide-in-from-top-2 dark:text-emerald-400"
                role="alert"
              >
                {success}
              </div>
            )}

            <Button
              variant="outline"
              type="button"
              disabled={loading || googleLoading}
              onClick={handleGoogleSignUp}
              className="flex w-full items-center justify-center gap-2 transition-colors hover:bg-muted/80"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.29 2.691 1.258 6.612l3.992 3.153z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.04 15.345c-1.077.732-2.436 1.164-4.04 1.164-2.91 0-5.382-1.964-6.264-4.59L1.722 15.04C3.778 19.123 8.01 22 13 22c3.545 0 6.545-1.182 8.727-3.218l-5.687-3.437z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.275c0-.827-.073-1.627-.21-2.4H12v4.545h6.482c-.282 1.482-1.118 2.736-2.373 3.582l5.687 3.437c3.327-3.073 5.7-7.6 5.7-12.875z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.736 11.918A7.01 7.01 0 0 1 5.736 10.1l-3.992-3.153A11.914 11.914 0 0 0 1 12c0 1.83.41 3.564 1.127 5.127l3.609-2.79a7.078 7.078 0 0 1 0-2.419z"
                  />
                </svg>
              )}
              {googleLoading ? "Signing up..." : "Sign up with Google"}
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-xs tracking-wider text-muted-foreground uppercase">
                Or continue with
              </span>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground/70" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                    disabled={loading || googleLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/50 pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground/70" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    disabled={loading || googleLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground/70" />
                  <Input
                    id="new-password"
                    name="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    required
                    disabled={loading || googleLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 pr-9 pl-9"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={loading || googleLoading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1.5 right-1.5 h-6 w-6 text-muted-foreground hover:text-foreground"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 font-medium shadow-lg transition-all duration-200 hover:shadow-primary/10"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 border-t border-border/50 pt-6 pb-6 text-center text-xs text-muted-foreground">
            <div>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary transition-colors hover:text-primary/95 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
