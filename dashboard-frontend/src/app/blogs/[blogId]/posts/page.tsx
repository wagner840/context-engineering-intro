import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { BlogPostsList } from '@/components/content/blog-posts-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Eye, Edit } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { blogId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getBlogData(blogId: string) {
  const supabase = createSupabaseServiceClient()
  
  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', blogId)
    .single()
  
  if (blogError || !blog) {
    return null
  }
  
  return blog
}

async function getBlogPosts(blogId: string, status?: string) {
  const supabase = createSupabaseServiceClient()
  
  let query = supabase
    .from('content_posts')
    .select(`
      *,
      blogs (
        name,
        url
      )
    `)
    .eq('blog_id', blogId)
  
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  
  const { data: posts, error } = await query
    .order('updated_at', { ascending: false })
    .limit(50)
  
  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  
  return posts || []
}

async function getBlogStats(blogId: string) {
  const supabase = createSupabaseServiceClient()
  
  const { data: stats } = await supabase
    .from('content_posts')
    .select('status')
    .eq('blog_id', blogId)
  
  const totalPosts = stats?.length || 0
  const publishedPosts = stats?.filter(p => p.status === 'publish').length || 0
  const draftPosts = stats?.filter(p => p.status === 'draft').length || 0
  
  return {
    total: totalPosts,
    published: publishedPosts,
    drafts: draftPosts,
  }
}

export default async function BlogPostsPage({ params, searchParams }: PageProps) {
  const blog = await getBlogData(params.blogId)
  
  if (!blog) {
    notFound()
  }
  
  const status = typeof searchParams.status === 'string' ? searchParams.status : 'all'
  const posts = await getBlogPosts(params.blogId, status)
  const stats = await getBlogStats(params.blogId)
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Manage content for {blog.name}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link href={`/blogs/${params.blogId}/posts/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All content posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <p className="text-xs text-muted-foreground">
              Live on website
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground">
              Work in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Content Posts</CardTitle>
          <CardDescription>
            Manage and edit your blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <BlogPostsList 
              blogId={params.blogId}
              initialPosts={posts}
              currentStatus={status}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 300 // Revalidate every 5 minutes

// Generate static params for known blogs
export async function generateStaticParams() {
  const supabase = createSupabaseServiceClient()
  
  const { data: blogs } = await supabase
    .from('blogs')
    .select('id')
    .eq('status', 'active')
  
  return (blogs || []).map((blog) => ({
    blogId: blog.id,
  }))
}

// Metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const blog = await getBlogData(params.blogId)
  
  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }
  
  return {
    title: `Posts - ${blog.name} | Dashboard`,
    description: `Manage content posts for ${blog.name}. Create, edit, and publish blog content.`,
  }
}