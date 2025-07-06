import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];
type BlogInsert = Database["public"]["Tables"]["blogs"]["Insert"];
type BlogUpdate = Database["public"]["Tables"]["blogs"]["Update"];

export interface BlogWithStats extends Blog {
  stats?: {
    total_posts: number;
    published_posts: number;
    draft_posts: number;
    total_keywords: number;
    total_opportunities: number;
    last_post_date?: string;
  };
}

export interface BlogSettings {
  wordpress_url?: string;
  wordpress_username?: string;
  wordpress_app_password?: string;
  auto_sync?: boolean;
  seo_enabled?: boolean;
  realtime_sync?: boolean;
}

export class BlogService {
  // Buscar todos os blogs ativos
  static async getActiveBlogs(): Promise<BlogWithStats[]> {
    try {
      const { data: blogs, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Buscar estatísticas para cada blog
      const blogsWithStats = await Promise.all(
        (blogs || []).map(async (blog) => {
          const stats = await this.getBlogStats(blog.id);
          return { ...blog, stats };
        })
      );

      return blogsWithStats;
    } catch (error) {
      console.error("Error fetching active blogs:", error);
      throw error;
    }
  }

  // Buscar blog por ID
  static async getBlogById(id: string): Promise<BlogWithStats | null> {
    try {
      const { data: blog, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!blog) return null;

      const stats = await this.getBlogStats(blog.id);
      return { ...blog, stats };
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      throw error;
    }
  }

  // Buscar estatísticas do blog
  static async getBlogStats(blogId: string) {
    try {
      // Buscar total de posts
      const { count: totalPosts } = await supabase
        .from("content_posts")
        .select("*", { count: "exact", head: true })
        .eq("blog_id", blogId);

      // Buscar posts publicados
      const { count: publishedPosts } = await supabase
        .from("content_posts")
        .select("*", { count: "exact", head: true })
        .eq("blog_id", blogId)
        .eq("status", "published");

      // Buscar posts em rascunho
      const { count: draftPosts } = await supabase
        .from("content_posts")
        .select("*", { count: "exact", head: true })
        .eq("blog_id", blogId)
        .eq("status", "draft");

      // Buscar total de keywords
      const { count: totalKeywords } = await supabase
        .from("main_keywords")
        .select("*", { count: "exact", head: true })
        .eq("blog_id", blogId);

      // Buscar total de oportunidades
      // TODO: Atualizar quando os tipos do database forem corrigidos
      /*
      const { count: totalOpportunitiesClusters } = await supabase
        .from("content_opportunities_clusters")
        .select("*", { count: "exact", head: true })
        .eq("blog_id", blogId)
        .eq("status", "identified");

      const { count: totalOpportunitiesCategories } = await supabase
        .from("content_opportunities_categories")
        .select("*", { count: "exact", head: true })
        .eq("blog_id", blogId)
        .eq("status", "identified");
      */
      const totalOpportunitiesClusters = 0;
      const totalOpportunitiesCategories = 0;

      // Buscar data do último post
      const { data: lastPost } = await supabase
        .from("content_posts")
        .select("published_at")
        .eq("blog_id", blogId)
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(1)
        .single();

      return {
        total_posts: totalPosts || 0,
        published_posts: publishedPosts || 0,
        draft_posts: draftPosts || 0,
        total_keywords: totalKeywords || 0,
        total_opportunities:
          (totalOpportunitiesClusters || 0) +
          (totalOpportunitiesCategories || 0),
        last_post_date: lastPost?.published_at || undefined,
      };
    } catch (error) {
      console.error("Error fetching blog stats:", error);
      return {
        total_posts: 0,
        published_posts: 0,
        draft_posts: 0,
        total_keywords: 0,
        total_opportunities: 0,
        last_post_date: undefined,
      };
    }
  }

  // Criar novo blog
  static async createBlog(blog: BlogInsert): Promise<Blog> {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .insert(blog)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  }

  // Atualizar blog
  static async updateBlog(id: string, updates: BlogUpdate): Promise<Blog> {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  }

  // Atualizar configurações do blog
  static async updateBlogSettings(
    id: string,
    settings: BlogSettings
  ): Promise<Blog> {
    try {
      const { data: currentBlog, error: fetchError } = await supabase
        .from("blogs")
        .select("settings")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const updatedSettings = {
        ...(typeof currentBlog.settings === "object" &&
        currentBlog.settings !== null
          ? currentBlog.settings
          : {}),
        ...settings,
      };

      const { data, error } = await supabase
        .from("blogs")
        .update({
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating blog settings:", error);
      throw error;
    }
  }

  // Desativar blog
  static async deactivateBlog(id: string): Promise<Blog> {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deactivating blog:", error);
      throw error;
    }
  }

  // Ativar blog
  static async activateBlog(id: string): Promise<Blog> {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .update({
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error activating blog:", error);
      throw error;
    }
  }

  // Buscar posts recentes do blog
  static async getBlogRecentPosts(blogId: string, limit = 10) {
    try {
      const { data, error } = await supabase
        .from("content_posts")
        .select(
          `
          *,
          author:authors(name, email)
        `
        )
        .eq("blog_id", blogId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching blog recent posts:", error);
      throw error;
    }
  }

  // Buscar keywords do blog
  static async getBlogKeywords(blogId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from("main_keywords")
        .select("*")
        .eq("blog_id", blogId)
        .order("msv", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching blog keywords:", error);
      throw error;
    }
  }

  // Buscar oportunidades do blog
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getBlogOpportunities(blogId: string, limit = 20) {
    try {
      // TODO: Atualizar quando os tipos do database forem corrigidos
      /*
      // Buscar oportunidades de clusters
      const { data: clusterOpportunities, error: clusterError } = await supabase
        .from("content_opportunities_clusters")
        .select(
          `
          *,
          cluster:keyword_clusters(cluster_name, description)
        `
        )
        .eq("blog_id", blogId)
        .eq("status", "identified")
        .order("priority_score", { ascending: false })
        .limit(limit / 2);

      if (clusterError) throw clusterError;

      // Buscar oportunidades de categorias
      const { data: categoryOpportunities, error: categoryError } =
        await supabase
          .from("content_opportunities_categories")
          .select(
            `
          *,
          category:keyword_categories(name, description)
        `
          )
          .eq("blog_id", blogId)
          .eq("status", "identified")
          .order("priority_score", { ascending: false })
          .limit(limit / 2);

      if (categoryError) throw categoryError;

      // Combinar e ordenar por priority_score
      const allOpportunities = [
        ...(clusterOpportunities || []).map((op) => ({
          ...op,
          type: "cluster",
        })),
        ...(categoryOpportunities || []).map((op) => ({
          ...op,
          type: "category",
        })),
      ].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));

      return allOpportunities.slice(0, limit);
      */

      // Retornar array vazio por enquanto
      return [];
    } catch (error) {
      console.error("Error fetching blog opportunities:", error);
      throw error;
    }
  }
}
