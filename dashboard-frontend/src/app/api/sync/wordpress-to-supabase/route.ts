import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'
import { WordPressService } from '@/lib/services/wordpress-service'
import { N8nService } from '@/lib/services/n8n-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { blogId, direction = 'wp_to_supabase' } = await request.json()
    
    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const supabase = createSupabaseServiceClient()
    const wpService = new WordPressService()
    const n8nService = new N8nService()

    // Get blog information
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', blogId)
      .single()

    if (blogError || !blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const blogType = WordPressService.getBlogTypeFromDomain(blog.domain)
    if (!blogType) {
      return NextResponse.json({ error: 'Unsupported blog domain' }, { status: 400 })
    }

    const syncedPosts = []
    const syncedMedia = []

    if (direction === 'wp_to_supabase') {
      // Sync WordPress posts to Supabase
      const wpPosts = await wpService.getPosts(blogType, {
        per_page: 100,
        status: 'publish,draft,future'
      })

      console.log(`📥 Syncing ${wpPosts.length} WordPress posts to Supabase...`)

      for (const wpPost of wpPosts) {
        try {
          // Check if post already exists in Supabase
          const { data: existingPost } = await supabase
            .from('content_posts')
            .select('id')
            .eq('wordpress_post_id', wpPost.id)
            .eq('blog_id', blogId)
            .single()

          const postData = {
            blog_id: blogId,
            title: wpPost.title.rendered,
            content: wpPost.content.rendered,
            excerpt: wpPost.excerpt.rendered,
            status: wpPost.status === 'publish' ? 'published' : wpPost.status,
            wordpress_post_id: wpPost.id,
            wordpress_slug: wpPost.slug,
            wordpress_link: wpPost.link,
            published_at: wpPost.status === 'publish' ? wpPost.date : null,
            created_at: wpPost.date,
            updated_at: wpPost.modified,
            word_count: wpPost.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length,
            reading_time: Math.ceil(wpPost.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)
          }

          if (existingPost) {
            // Update existing post
            const { error: updateError } = await supabase
              .from('content_posts')
              .update(postData)
              .eq('id', existingPost.id)

            if (updateError) {
              console.error(`❌ Error updating post ${wpPost.id}:`, updateError)
            } else {
              console.log(`✅ Updated post: ${wpPost.title.rendered}`)
              syncedPosts.push({ action: 'updated', wordpress_id: wpPost.id, title: wpPost.title.rendered })
            }
          } else {
            // Create new post
            const { error: insertError } = await supabase
              .from('content_posts')
              .insert(postData)

            if (insertError) {
              console.error(`❌ Error creating post ${wpPost.id}:`, insertError)
            } else {
              console.log(`✅ Created post: ${wpPost.title.rendered}`)
              syncedPosts.push({ action: 'created', wordpress_id: wpPost.id, title: wpPost.title.rendered })
            }
          }
        } catch (error) {
          console.error(`❌ Error syncing post ${wpPost.id}:`, error)
        }
      }

      // Sync media files
      const wpMedia = await wpService.getMedia(blogType, {
        per_page: 100,
        media_type: 'image'
      })

      console.log(`📥 Syncing ${wpMedia.length} WordPress media files to Supabase...`)

      for (const media of wpMedia) {
        try {
          // Check if media already exists in Supabase
          const { data: existingMedia } = await supabase
            .from('media_assets')
            .select('id')
            .eq('wordpress_media_id', media.id)
            .eq('blog_id', blogId)
            .single()

          const mediaData = {
            blog_id: blogId,
            filename: media.media_details.file.split('/').pop() || media.slug,
            url: media.source_url,
            type: media.mime_type,
            size: media.media_details.width && media.media_details.height 
              ? media.media_details.width * media.media_details.height 
              : 0,
            alt_text: media.alt_text,
            caption: media.caption.rendered,
            wordpress_media_id: media.id,
            created_at: media.date,
            updated_at: media.date
          }

          if (existingMedia) {
            // Update existing media
            const { error: updateError } = await supabase
              .from('media_assets')
              .update(mediaData)
              .eq('id', existingMedia.id)

            if (updateError) {
              console.error(`❌ Error updating media ${media.id}:`, updateError)
            } else {
              console.log(`✅ Updated media: ${media.title.rendered}`)
              syncedMedia.push({ action: 'updated', wordpress_id: media.id, title: media.title.rendered })
            }
          } else {
            // Create new media
            const { error: insertError } = await supabase
              .from('media_assets')
              .insert(mediaData)

            if (insertError) {
              console.error(`❌ Error creating media ${media.id}:`, insertError)
            } else {
              console.log(`✅ Created media: ${media.title.rendered}`)
              syncedMedia.push({ action: 'created', wordpress_id: media.id, title: media.title.rendered })
            }
          }
        } catch (error) {
          console.error(`❌ Error syncing media ${media.id}:`, error)
        }
      }

      // Trigger n8n workflow for additional processing
      await n8nService.triggerBlogSync(blogId, blog.domain)

    } else if (direction === 'supabase_to_wp') {
      // Sync Supabase posts to WordPress
      const { data: supabasePosts, error: postsError } = await supabase
        .from('content_posts')
        .select('*')
        .eq('blog_id', blogId)
        .is('wordpress_post_id', null) // Only sync posts that don't exist in WordPress yet

      if (postsError) {
        return NextResponse.json({ error: 'Error fetching Supabase posts' }, { status: 500 })
      }

      console.log(`📤 Syncing ${supabasePosts.length} Supabase posts to WordPress...`)

      for (const post of supabasePosts) {
        try {
          const wpPost = await wpService.createPost(blogType, {
            title: post.title,
            content: post.content,
            status: post.status === 'published' ? 'publish' : (post.status as 'draft' | 'private' | 'pending' | 'future'),
            excerpt: post.excerpt || ''
          })

          // Update Supabase post with WordPress ID
          const { error: updateError } = await supabase
            .from('content_posts')
            .update({
              wordpress_post_id: wpPost.id,
              wordpress_slug: wpPost.slug,
              wordpress_link: wpPost.link,
              updated_at: new Date().toISOString()
            })
            .eq('id', post.id)

          if (updateError) {
            console.error(`❌ Error updating Supabase post ${post.id}:`, updateError)
          } else {
            console.log(`✅ Synced post to WordPress: ${post.title}`)
            syncedPosts.push({ 
              action: 'created', 
              supabase_id: post.id, 
              wordpress_id: wpPost.id,
              title: post.title 
            })
          }
        } catch (error) {
          console.error(`❌ Error syncing post ${post.id} to WordPress:`, error)
        }
      }
    }

    // Log sync operation
    await supabase.from('sync_logs').insert({
      blog_id: blogId,
      sync_type: direction,
      status: 'completed',
      details: {
        posts_synced: syncedPosts.length,
        media_synced: syncedMedia.length,
        posts: syncedPosts,
        media: syncedMedia
      },
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: `Synchronization completed successfully`,
      results: {
        direction,
        posts_synced: syncedPosts.length,
        media_synced: syncedMedia.length,
        posts: syncedPosts,
        media: syncedMedia
      }
    })

  } catch (error) {
    console.error('❌ Sync error:', error)
    return NextResponse.json({
      error: 'Synchronization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}