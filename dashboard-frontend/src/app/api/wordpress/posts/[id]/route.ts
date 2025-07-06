import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { WordPressAPI } from '@/lib/wordpress'
import { z } from 'zod'

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'publish', 'private']).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured_image_url: z.string().url().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  target_keywords: z.array(z.string()).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServiceClient()
    
    // Get post from database
    const { data: post, error: postError } = await supabase
      .from('content_posts')
      .select(`
        *,
        blogs!inner (
          settings
        )
      `)
      .eq('id', params.id)
      .single()
    
    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    // Get WordPress data if available
    if (post.wordpress_post_id && post.blogs.settings) {
      const wp = new WordPressAPI(post.blogs.settings as any)
      
      try {
        const wpPost = await wp.getPost(post.wordpress_post_id)
        return NextResponse.json({ 
          data: { 
            ...post, 
            wordpress_data: wpPost 
          } 
        })
      } catch (wpError) {
        // Return database data even if WordPress fetch fails
        return NextResponse.json({ 
          data: post,
          warning: 'WordPress data unavailable'
        })
      }
    }
    
    return NextResponse.json({ data: post })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)
    
    const supabase = createSupabaseServiceClient()
    
    // Get current post data
    const { data: currentPost, error: getCurrentError } = await supabase
      .from('content_posts')
      .select(`
        *,
        blogs!inner (
          settings
        )
      `)
      .eq('id', params.id)
      .single()
    
    if (getCurrentError || !currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    // Update WordPress post if it exists
    if (currentPost.wordpress_post_id && currentPost.blogs.settings) {
      const wp = new WordPressAPI(currentPost.blogs.settings as any)
      
      try {
        await wp.updatePost(currentPost.wordpress_post_id, {
          title: validatedData.title,
          content: validatedData.content,
          excerpt: validatedData.excerpt,
          status: validatedData.status,
          categories: validatedData.categories,
          tags: validatedData.tags,
          featured_media: validatedData.featured_image_url,
          meta: {
            yoast_head_title: validatedData.meta_title,
            yoast_head_description: validatedData.meta_description,
          }
        } as Record<string, unknown>)
      } catch (wpError) {
        return NextResponse.json(
          { error: 'Failed to update WordPress post', details: wpError as Error },
          { status: 500 }
        )
      }
    }
    
    // Update database
    const updateData: Record<string, unknown> = {
      ...validatedData,
      updated_at: new Date().toISOString(),
    }
    
    // Set published_at if status changed to publish
    if (validatedData.status === 'publish' && currentPost.status !== 'publish') {
      updateData.published_at = new Date().toISOString()
    }
    
    const { data: updatedPost, error: updateError } = await supabase
      .from('content_posts')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data: updatedPost })
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServiceClient()
    
    // Get post data first
    const { data: post, error: getError } = await supabase
      .from('content_posts')
      .select(`
        *,
        blogs!inner (
          settings
        )
      `)
      .eq('id', params.id)
      .single()
    
    if (getError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    // Delete from WordPress if exists
    if (post.wordpress_post_id && post.blogs.settings) {
      const wp = new WordPressAPI(post.blogs.settings as any)
      
      try {
        await wp.deletePost(post.wordpress_post_id)
      } catch (wpError) {
        // Continue with database deletion even if WordPress deletion fails
        console.error('WordPress deletion failed:', wpError)
      }
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('content_posts')
      .delete()
      .eq('id', params.id)
    
    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}