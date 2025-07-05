'use client'

import { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlogs } from '@/hooks/use-blogs'
import { useBlogStore } from '@/store/blog-store'

export function BlogSelector() {
  const { data: blogs, isLoading, error } = useBlogs()
  const { selectedBlog, selectBlog } = useBlogStore()
  // const { subscribe } = useBlogRealtime() // Temporarily disabled

  // useEffect(() => {
  //   const unsubscribe = subscribe()
  //   return unsubscribe
  // }, [subscribe])

  useEffect(() => {
    // Auto-select first blog if none selected and blogs are available
    if (!selectedBlog && blogs && blogs.length > 0) {
      selectBlog({
        ...blogs[0], 
        niche: blogs[0].niche || null,
        description: blogs[0].description || null,
        settings: blogs[0].settings || {},
        is_active: blogs[0].is_active || true,
        created_at: blogs[0].created_at || new Date().toISOString(),
        updated_at: blogs[0].updated_at || new Date().toISOString()
      })
    }
  }, [blogs, selectedBlog, selectBlog])

  const handleBlogChange = (blogId: string) => {
    if (blogId === 'all') {
      selectBlog(undefined)
      return
    }
    const blog = blogs?.find(b => b.id === blogId)
    if (blog) {
      selectBlog({
        ...blog, 
        niche: blog.niche || null,
        description: blog.description || null,
        settings: blog.settings || {},
        is_active: blog.is_active || true,
        created_at: blog.created_at || new Date().toISOString(),
        updated_at: blog.updated_at || new Date().toISOString()
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-end min-w-[180px]">
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-end min-w-[180px]">
        <span className="text-xs text-destructive">Erro ao carregar blogs</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end min-w-[180px]">
      <Select
        value={selectedBlog?.id || 'all'}
        onValueChange={handleBlogChange}
      >
        <SelectTrigger className="w-[180px] h-8 text-xs border-none shadow-none bg-transparent focus:ring-0 focus:outline-none">
          <SelectValue placeholder="Selecione o blog">
            {selectedBlog ? (
              <span className="truncate">{selectedBlog.name}</span>
            ) : (
              <span>Todos os blogs</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="all" value="all">
            <span>Todos os blogs</span>
          </SelectItem>
          {Array.isArray(blogs) && blogs.map((blog) => (
            <SelectItem key={blog.id} value={blog.id}>
              <span className="truncate">{blog.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}