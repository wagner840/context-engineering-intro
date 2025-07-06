import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { WordPressService } from "@/lib/services/wordpress-service";
import { N8nService } from "@/lib/services/n8n-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();

    console.log("📨 WordPress webhook received:", webhookData);

    const supabase = createSupabaseServiceClient();
    const wpService = new WordPressService();
    const n8nService = new N8nService();

    // Extract information from webhook
    const { post_id, post_type, site_url, action } = webhookData;

    if (post_type !== "post") {
      return NextResponse.json({ message: "Only post webhooks are processed" });
    }

    // Determine blog from site URL
    const blogType = site_url.includes("einsof7.com")
      ? "einsof7"
      : site_url.includes("Optemil.com")
        ? "Optemil"
        : null;

    if (!blogType) {
      return NextResponse.json(
        { error: "Unsupported site URL" },
        { status: 400 }
      );
    }

    // Get blog info from Supabase
    const domain = blogType === "einsof7" ? "einsof7.com" : "Optemil.com";
    const { data: blog, error: blogError } = await supabase
      .from("blogs")
      .select("*")
      .eq("domain", domain)
      .single();

    if (blogError || !blog) {
      console.error("❌ Blog not found:", domain);
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (action === "post_published" || action === "post_updated") {
      // Fetch the post from WordPress
      const wpPost = await wpService.getPost(blogType, post_id);

      // Check if post exists in Supabase
      const { data: existingPost } = await supabase
        .from("content_posts")
        .select("id")
        .eq("wordpress_post_id", post_id)
        .eq("blog_id", blog.id)
        .single();

      const postData = {
        blog_id: blog.id,
        title: wpPost.title.rendered,
        content: wpPost.content.rendered,
        excerpt: wpPost.excerpt.rendered,
        status: wpPost.status === "publish" ? "published" : wpPost.status,
        wordpress_post_id: wpPost.id,
        wordpress_slug: wpPost.slug,
        wordpress_link: wpPost.link,
        published_at: wpPost.status === "publish" ? wpPost.date : null,
        created_at: wpPost.date,
        updated_at: wpPost.modified,
        word_count: wpPost.content.rendered.replace(/<[^>]*>/g, "").split(/\s+/)
          .length,
        reading_time: Math.ceil(
          wpPost.content.rendered.replace(/<[^>]*>/g, "").split(/\s+/).length /
            200
        ),
      };

      if (existingPost) {
        // Update existing post
        const { error: updateError } = await supabase
          .from("content_posts")
          .update(postData)
          .eq("id", existingPost.id);

        if (updateError) {
          console.error("❌ Error updating post:", updateError);
          return NextResponse.json(
            { error: "Failed to update post" },
            { status: 500 }
          );
        }

        console.log("✅ Post updated via webhook:", wpPost.title.rendered);
      } else {
        // Create new post
        const { error: insertError } = await supabase
          .from("content_posts")
          .insert(postData);

        if (insertError) {
          console.error("❌ Error creating post:", insertError);
          return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
          );
        }

        console.log("✅ Post created via webhook:", wpPost.title.rendered);
      }

      // Trigger n8n workflow for additional processing
      await n8nService.triggerBlogSync(blog.id, domain);

      // Log webhook processing
      await supabase.from("sync_logs").insert({
        blog_id: blog.id,
        sync_type: "webhook_wp_to_supabase",
        status: "completed",
        details: {
          action,
          post_id,
          post_title: wpPost.title.rendered,
          webhook_data: webhookData,
        },
        created_at: new Date().toISOString(),
      });
    } else if (action === "post_deleted") {
      // Mark post as deleted in Supabase
      const { error: deleteError } = await supabase
        .from("content_posts")
        .update({
          status: "deleted",
          updated_at: new Date().toISOString(),
        })
        .eq("wordpress_post_id", post_id)
        .eq("blog_id", blog.id);

      if (deleteError) {
        console.error("❌ Error marking post as deleted:", deleteError);
        return NextResponse.json(
          { error: "Failed to mark post as deleted" },
          { status: 500 }
        );
      }

      console.log("✅ Post marked as deleted via webhook:", post_id);

      // Log webhook processing
      await supabase.from("sync_logs").insert({
        blog_id: blog.id,
        sync_type: "webhook_wp_to_supabase",
        status: "completed",
        details: {
          action,
          post_id,
          webhook_data: webhookData,
        },
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Webhook processed successfully for ${action}`,
    });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get("challenge");

  if (challenge) {
    return NextResponse.json({ challenge });
  }

  return NextResponse.json({
    status: "WordPress webhook endpoint active",
    timestamp: new Date().toISOString(),
  });
}
