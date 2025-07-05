'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PostEditor } from '@/components/posts/post-editor'
import { PostsList } from '@/components/posts/posts-list'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, List, Edit3 } from 'lucide-react'
import { useBlog } from '@/hooks/use-blogs'
import { Loading } from '@/components/ui/loading'

interface BlogPostsPageProps {
  params: {
    id: string
  }
}

export default function BlogPostsPage({ params }: BlogPostsPageProps) {
  const { id: blogId } = params
  const searchParams = useSearchParams()
  const editPostId = searchParams.get('edit')
  const [activeTab, setActiveTab] = useState(editPostId ? 'editor' : 'list')
  const [selectedPostId, setSelectedPostId] = useState<string | null>(editPostId)
  
  const { data: blog, isLoading } = useBlog(blogId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading text="Carregando blog..." />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog não encontrado</h2>
          <p className="text-gray-600">O blog solicitado não foi encontrado.</p>
        </div>
      </div>
    )
  }

  const handleNewPost = () => {
    setSelectedPostId(null)
    setActiveTab('editor')
  }

  const handleEditPost = (postId: string) => {
    setSelectedPostId(postId)
    setActiveTab('editor')
  }

  const handleBackToList = () => {
    setSelectedPostId(null)
    setActiveTab('list')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Posts - {blog.name}
        </h1>
        <p className="text-gray-600">
          Gerencie e edite os posts do seu blog
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Lista de Posts
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Editor
            </TabsTrigger>
          </TabsList>

          <Button onClick={handleNewPost} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Post
          </Button>
        </div>

        <TabsContent value="list" className="space-y-6">
          <PostsList blogId={blogId} onEditPost={handleEditPost} />
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <PostEditor
            blogId={blogId}
            postId={selectedPostId}
            onSave={handleBackToList}
            onCancel={handleBackToList}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}