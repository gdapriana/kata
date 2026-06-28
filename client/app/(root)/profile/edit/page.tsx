"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User, Upload, ArrowLeft, Camera } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUploadSingleImage } from "@/hooks/queries/use-images"
import { useUpdateProfile } from "@/hooks/queries/use-users"
import Link from "next/link"

export default function EditProfilePage() {
  const router = useRouter()
  const { data: sessionData, isPending: isSessionPending } = authClient.useSession()

  // Form States
  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // API Hooks
  const uploadImageMutation = useUploadSingleImage()
  const updateProfileMutation = useUpdateProfile()

  // Check auth
  useEffect(() => {
    if (!isSessionPending && !sessionData) {
      router.push("/sign-up")
    }
  }, [isSessionPending, sessionData, router])

  // Populate states once on initial session load
  useEffect(() => {
    if (sessionData && !hasInitialized) {
      setName(sessionData.user.name)
      setImageUrl(sessionData.user.image || null)
      setHasInitialized(true)
    }
  }, [sessionData, hasInitialized])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImageMutation.mutate(file, {
        onSuccess: (data) => {
          setImageUrl(data.result.url)
        },
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert("Name cannot be empty.")
      return
    }

    updateProfileMutation.mutate(
      {
        name: name.trim(),
        image: imageUrl,
      },
      {
        onSuccess: async () => {
          // Force better-auth session update and redirect back
          router.refresh()
          router.push("/profile")
        },
        onError: (err: any) => {
          alert(err.message || "Failed to update profile.")
        },
      }
    )
  }

  if (isSessionPending) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </main>
    )
  }

  if (!sessionData) {
    return null
  }

  const user = sessionData.user

  return (
    <main className="p-6 pt-36 pb-24 min-h-svh bg-linear-to-b from-background via-muted/5 to-muted/20">
      <div className="container max-w-2xl">
        <div className="flex flex-col gap-6">
          {/* Back button */}
          <div className="flex items-center">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Link href="/profile">
                <ArrowLeft size={14} /> Back to Profile
              </Link>
            </Button>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 md:p-8">
            <div className="border-b pb-4 mb-6">
              <h1 className="text-2xl font-serif font-black tracking-tight">Edit Profile</h1>
              <p className="text-xs text-muted-foreground mt-1">Manage your public display settings and details.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative group cursor-pointer overflow-hidden rounded-full border shadow-xs h-28 w-28">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={imageUrl || ""} alt={name} className="object-cover" />
                    <AvatarFallback className="bg-muted">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Hover Upload Trigger */}
                  <label 
                    htmlFor="avatar-input"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer select-none"
                  >
                    <Camera size={20} className="mb-1" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Change</span>
                  </label>
                  <input 
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploadImageMutation.isPending}
                  />
                </div>

                {uploadImageMutation.isPending ? (
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 animate-pulse">
                    <Loader2 size={12} className="animate-spin text-primary" /> Uploading image...
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Click the photo to edit</span>
                )}
              </div>

              {/* Input Fields */}
              <div className="flex flex-col gap-5">
                {/* Email (Read Only) */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-muted/50 cursor-not-allowed select-none text-muted-foreground"
                  />
                  <p className="text-[10px] text-muted-foreground/80">Your registered email address cannot be changed.</p>
                </div>

                {/* Display Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold">Display Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  disabled={updateProfileMutation.isPending}
                >
                  <Link href="/profile">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateProfileMutation.isPending || uploadImageMutation.isPending}
                >
                  {updateProfileMutation.isPending && (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
