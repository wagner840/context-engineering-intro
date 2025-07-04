import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { WordPressAPI } from '@/lib/wordpress'
import { z } from 'zod'

const postSchema = z.object({
  blog_id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string(),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'publish', 'private']).default('draft'),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured_image_url: z.string().url().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  target_keywords: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blog_id')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    if (!blogId) {
      return NextResponse.json(
        { error: 'blog_id is required' },
        { status: 400 }
      )
    }
    
    const supabase = createSupabaseServiceClient()
    
    // Get blog configuration
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('wordpress_config')
      .eq('id', blogId)
      .single()
    
    if (blogError || !blog?.wordpress_config) {
      return NextResponse.json(
        { error: 'Blog or WordPress configuration not found' },
        { status: 404 }
      )
    }
    
    const wp = new WordPressAPI(blog.wordpress_config)
    
    try {
      const posts = await wp.getPosts({
        status,
        per_page: limit,
        offset,
      })
      
      return NextResponse.json({ data: posts })
    } catch (wpError) {
      return NextResponse.json(
        { error: 'Failed to fetch WordPress posts', details: wpError },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = postSchema.parse(body)
    
    const supabase = createSupabaseServiceClient()
    
    // Get blog configuration
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('wordpress_config')
      .eq('id', validatedData.blog_id)
      .single()
    
    if (blogError || !blog?.wordpress_config) {
      return NextResponse.json(
        { error: 'Blog or WordPress configuration not found' },
        { status: 404 }
      )
    }
    
    const wp = new WordPressAPI(blog.wordpress_config)
    
    try {
      // Create post in WordPress
      const wpPost = await wp.createPost({
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        status: validatedData.status,
        categories: validatedData.categories,
        tags: validatedData.tags,
        featured_media: validatedData.featured_image_url,
        yoast_head_title: validatedData.meta_title,
        yoast_head_description: validatedData.meta_description,
      })
      
      // Save to database
      const { data: dbPost, error: dbError } = await supabase
        .from('content_posts')
        .insert({
          blog_id: validatedData.blog_id,
          title: validatedData.title,
          content: validatedData.content,
          excerpt: validatedData.excerpt,
          status: validatedData.status,
          wordpress_id: wpPost.id,
          wordpress_url: wpPost.link,
          target_keywords: validatedData.target_keywords,
          meta_title: validatedData.meta_title,
          meta_description: validatedData.meta_description,
          published_at: validatedData.status === 'publish' ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (dbError) {
        // Rollback WordPress post if database save fails
        await wp.deletePost(wpPost.id)
        return NextResponse.json(
          { error: 'Failed to save post to database' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ data: { ...dbPost, wordpress_data: wpPost } }, { status: 201 })
    } catch (wpError) {
      return NextResponse.json(
        { error: 'Failed to create WordPress post', details: wpError },
        { status: 500 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}