"use client";

import { useState } from "react";
import { useBlogs } from "@/hooks/queries/use-blogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, User, Eye, Search } from "lucide-react";

export default function BlogsExamplePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // Using our custom TanStack Query hook
  const { data, isLoading, isError, error, refetch } = useBlogs({
    search: activeSearch || undefined,
    sortBy: "views",
    sortOrder: "desc",
    limit: 10,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Seeded Blogs Demo</h1>
        <p className="text-muted-foreground">
          This example page demonstrates how to use the custom TanStack Query hooks.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading blogs...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 space-y-2">
          <p className="font-semibold">Error fetching blogs</p>
          <p className="text-sm">{(error as any)?.message || "An unexpected error occurred."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      {/* Blogs list */}
      {!isLoading && !isError && (
        <div className="space-y-4">
          {data?.result?.query?.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No blogs found matching your search.</p>
            </div>
          ) : (
            data?.result?.query?.map((blog: any) => (
              <Card key={blog.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-heading font-semibold hover:text-primary transition-colors cursor-pointer">
                    {blog.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1.5">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {blog.author?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {blog.views} views
                    </span>
                    {blog.category && (
                      <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium uppercase tracking-wider">
                        {blog.category.name}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {blog.excerpt || blog.content?.substring(0, 150) + "..."}
                  </p>
                  
                  {/* Tags list */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4">
                      {blog.tags.map((tag: any) => (
                        <span key={tag.id} className="text-[10px] bg-primary/5 text-primary px-1.5 py-0.5 rounded font-medium">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </main>
  );
}
