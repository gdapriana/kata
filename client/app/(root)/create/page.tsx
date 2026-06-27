"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { Calendar, Loader2, User, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import TiptapEditor from "@/components/custom/editor/tiptap-editor"
import { useUploadSingleImage } from "@/hooks/queries/use-images"
import { useCategories } from "@/hooks/queries/use-categories"
import { useCreateBlog } from "@/hooks/queries/use-blogs"

export default function Page() {
  const router = useRouter()
  const { data: sessionData, isPending } = authClient.useSession()

  // Form States
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isSlugCustom, setIsSlugCustom] = useState(false)
  const [content, setContent] = useState("<p>Write something beautiful...</p>")
  const [excerpt, setExcerpt] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT")
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null)
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null)

  const categorySelectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categorySelectRef.current && !categorySelectRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // API Hooks
  const uploadImageMutation = useUploadSingleImage()
  const createBlogMutation = useCreateBlog()
  const { data: categoriesData } = useCategories({ limit: 100 })
  const categories = categoriesData?.result?.query || []

  const selectedCategory = categories.find((c: any) => c.id === categoryId)
  const filteredCategories = categories
    .filter((c: any) => c.name.toLowerCase().includes(categorySearch.toLowerCase()))
    .slice(0, 5)

  useEffect(() => {
    if (!isPending && !sessionData) {
      router.push("/sign-up")
    }
  }, [isPending, sessionData, router])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-word characters
      .replace(/[\s_]+/g, "-") // replace spaces with dashes
      .replace(/-+/g, "-") // collapse multiple dashes
      .replace(/^-+/, "") // trim leading dashes
      .replace(/-+$/, "") // trim trailing dashes
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!isSlugCustom) {
      setSlug(generateSlug(val))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugCustom(true)
    setSlug(generateSlug(e.target.value))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImageMutation.mutate(file, {
        onSuccess: (data) => {
          setFeaturedImageId(data.result.id)
          setFeaturedImageUrl(data.result.url)
        },
      })
    }
  }

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      alert("Title is required.")
      return
    }
    if (!slug) {
      alert("Slug is required.")
      return
    }
    if (!categoryId) {
      alert("Please select a category.")
      return
    }

    const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean)

    createBlogMutation.mutate(
      {
        title,
        slug,
        content,
        excerpt: excerpt || undefined,
        status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        categoryId,
        featuredImageId: featuredImageId || undefined,
        tags: tags.length > 0 ? tags : undefined,
      },
      {
        onSuccess: (data) => {
          // Redirect to the newly created blog post page
          router.push(`/blogs/${data.result.slug}`)
        },
        onError: (err: any) => {
          alert(err.message || "Failed to create blog post. Check your slug and try again.")
        },
      }
    )
  }

  if (isPending) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your credentials...
          </p>
        </div>
      </main>
    )
  }
  if (!sessionData) {
    return null
  }

  return (
    <main className="p-6 pt-32">
      <div className="container">
        <form
          onSubmit={handleCreateBlog}
          className="grid grid-cols-1 gap-8 md:grid-cols-[68%_32%]"
        >
          {/* Header Section */}
          <header className="md:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col items-start justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Create New Post</span>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full border-0 rounded-none focus:outline-0 px-0 py-3 bg-transparent text-3xl font-serif font-black focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/60"
                placeholder="Your post title here"
              />
            </div>
            
            <div className="flex items-center gap-3 border-y py-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={sessionData.user.image || ""}
                  alt={sessionData.user.name}
                />
                <AvatarFallback>
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-foreground">
                  {sessionData.user.name}
                </span>
                <div className="mt-0.5 flex items-center gap-2 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Column */}
          <section className="flex flex-col gap-8">
            {/* Image Upload Area */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-muted-foreground">Featured Cover Image</span>
              
              {featuredImageUrl ? (
                <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden border shadow-xs group">
                  <img src={featuredImageUrl} alt="Cover image preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setFeaturedImageId(null)
                      setFeaturedImageUrl(null)
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 bg-muted/10 hover:bg-muted/20 transition-all duration-300 cursor-pointer relative aspect-[21/9]">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    disabled={uploadImageMutation.isPending}
                  />
                  {uploadImageMutation.isPending ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                      <p className="text-sm text-muted-foreground">Uploading cover image...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload featured cover image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rich Text Editor */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-muted-foreground">Article Body</span>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </section>

          {/* Sidebar Panel */}
          <aside className="flex flex-col gap-6 rounded-lg border bg-muted/10 p-5 h-fit shadow-xs">
            <h3 className="font-semibold text-lg border-b pb-2 mb-2">Post Settings</h3>

            {/* Category Select */}
            <div className="flex flex-col gap-2 relative" ref={categorySelectRef}>
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <button
                type="button"
                id="category"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full rounded-md border border-input bg-background p-2 text-sm text-left shadow-xs flex items-center justify-between hover:bg-muted/10 transition-colors"
              >
                <span className={selectedCategory ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {selectedCategory ? selectedCategory.name : "Select a category..."}
                </span>
                <span className="text-xs text-muted-foreground select-none">▼</span>
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-[100%] left-0 z-50 w-full mt-1.5 rounded-md border bg-popover text-popover-foreground shadow-md p-2 flex flex-col gap-1.5">
                  <Input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories..."
                    className="h-8 text-xs w-full bg-background"
                    autoFocus
                  />
                  <div className="flex flex-col max-h-[180px] overflow-y-auto">
                    {filteredCategories.length === 0 ? (
                      <span className="text-xs text-muted-foreground p-2 text-center select-none">No categories found.</span>
                    ) : (
                      filteredCategories.map((c: any) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCategoryId(c.id)
                            setCategorySearch("")
                            setIsCategoryDropdownOpen(false)
                          }}
                          className={`w-full text-left text-xs p-2 rounded-md transition-colors hover:bg-muted ${
                            c.id === categoryId ? "bg-muted font-semibold text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {c.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="excerpt" className="text-sm font-medium">Excerpt (Summary)</Label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Provide a brief summary of this article..."
                rows={4}
                className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none leading-relaxed"
              />
            </div>

            {/* Tags Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</Label>
              <Input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="tech, writing, focus"
                className="w-full text-sm"
              />
            </div>

            {/* Status Select */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            {/* Submit Actions */}
            <div className="mt-4 flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full py-5 text-sm font-semibold tracking-wide"
                disabled={createBlogMutation.isPending || uploadImageMutation.isPending}
              >
                {createBlogMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {status === "PUBLISHED" ? "Publish Article" : "Save Draft"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs"
                onClick={() => router.push("/")}
                disabled={createBlogMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  )
}
