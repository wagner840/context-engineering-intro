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

const WORDPRESS_CONFIGS = {
  einsof7: {
    url: process.env.EINSOF7_WORDPRESS_URL,
    username: process.env.EINSOF7_WORDPRESS_USERNAME,
    password: process.env.EINSOF7_WORDPRESS_PASSWORD,
  },
  optemil: {
    url: process.env.OPTEMIL_WORDPRESS_URL,
    username: process.env.OPTEMIL_WORDPRESS_USERNAME,
    password: process.env.OPTEMIL_WORDPRESS_PASSWORD,
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'draft';
    const blog = searchParams.get('blog') as keyof typeof WORDPRESS_CONFIGS;
    
    if (!blog || !WORDPRESS_CONFIGS[blog]) {
      return NextResponse.json({ error: 'Blog inválido' }, { status: 400 });
    }

    const config = WORDPRESS_CONFIGS[blog];
    if (!config.url || !config.username || !config.password) {
      return NextResponse.json({ error: 'Configuração WordPress incompleta' }, { status: 500 });
    }

    // Criar Basic Auth
    const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');
    
    // Buscar posts do WordPress
    const wpResponse = await fetch(`${config.url}/posts?status=${status}&per_page=100`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!wpResponse.ok) {
      throw new Error(`WordPress API error: ${wpResponse.status}`);
    }

    const posts = await wpResponse.json();
    const totalPosts = wpResponse.headers.get('X-WP-Total') || '0';
    
    return NextResponse.json(
      { 
        posts, 
        total: parseInt(totalPosts),
        blog,
        status 
      },
      {
        headers: {
          'X-WP-Total': totalPosts,
        }
      }
    );

  } catch (error) {
    console.error('Erro ao buscar posts WordPress:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com WordPress' },
      { status: 500 }
    );
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
      .select('settings')
      .eq('id', validatedData.blog_id)
      .single()
    
    if (blogError || !blog?.settings) {
      return NextResponse.json(
        { error: 'Blog or WordPress configuration not found' },
        { status: 404 }
      )
    }
    
    const wp = new WordPressAPI(blog.settings as any)
    
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
        meta: {
          yoast_head_title: validatedData.meta_title,
          yoast_head_description: validatedData.meta_description,
        }
      } as Record<string, unknown>)
      
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
        { error: 'Failed to create WordPress post', details: wpError as Error },
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