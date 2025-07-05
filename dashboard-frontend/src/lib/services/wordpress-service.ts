interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
}

interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: Record<string, any>;
  };
  source_url: string;
}

export class WordPressService {
  private blogConfig: {
    einsof7: {
      url: string;
      username: string;
      password: string;
    };
    opetmil: {
      url: string;
      username: string;
      password: string;
    };
  };

  constructor() {
    this.blogConfig = {
      einsof7: {
        url: process.env.EINSOF7_WORDPRESS_URL!,
        username: process.env.EINSOF7_WORDPRESS_USERNAME!,
        password: process.env.EINSOF7_WORDPRESS_PASSWORD!,
      },
      opetmil: {
        url: process.env.OPETMIL_WORDPRESS_URL!,
        username: process.env.OPETMIL_WORDPRESS_USERNAME!,
        password: process.env.OPETMIL_WORDPRESS_PASSWORD!,
      },
    };
  }

  private getAuthHeader(blog: "einsof7" | "opetmil"): string {
    const config = this.blogConfig[blog];
    const credentials = `${config.username}:${config.password}`;
    return `Basic ${Buffer.from(credentials).toString("base64")}`;
  }

  private async fetchWordPress(
    blog: "einsof7" | "opetmil",
    endpoint: string,
    options: RequestInit = {}
  ) {
    const config = this.blogConfig[blog];
    const url = `${config.url}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: this.getAuthHeader(blog),
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WordPress API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Posts
  async getPosts(
    blog: "einsof7" | "opetmil",
    params?: {
      per_page?: number;
      page?: number;
      status?: string;
      categories?: number[];
      tags?: number[];
      search?: string;
      orderby?: string;
      order?: "asc" | "desc";
    }
  ): Promise<WordPressPost[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(","));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const endpoint = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.fetchWordPress(blog, endpoint);
  }

  async getPost(
    blog: "einsof7" | "opetmil",
    id: number
  ): Promise<WordPressPost> {
    return this.fetchWordPress(blog, `/posts/${id}`);
  }

  async createPost(
    blog: "einsof7" | "opetmil",
    post: {
      title: string;
      content: string;
      status?: "publish" | "future" | "draft" | "pending" | "private";
      excerpt?: string;
      categories?: number[];
      tags?: number[];
      featured_media?: number;
      meta?: any;
    }
  ): Promise<WordPressPost> {
    return this.fetchWordPress(blog, "/posts", {
      method: "POST",
      body: JSON.stringify(post),
    });
  }

  async updatePost(
    blog: "einsof7" | "opetmil",
    id: number,
    updates: Partial<{
      title: string;
      content: string;
      status: "publish" | "future" | "draft" | "pending" | "private";
      excerpt: string;
      categories: number[];
      tags: number[];
      featured_media: number;
      meta: any;
    }>
  ): Promise<WordPressPost> {
    return this.fetchWordPress(blog, `/posts/${id}`, {
      method: "POST",
      body: JSON.stringify(updates),
    });
  }

  async deletePost(
    blog: "einsof7" | "opetmil",
    id: number,
    force = false
  ): Promise<any> {
    const endpoint = `/posts/${id}${force ? "?force=true" : ""}`;
    return this.fetchWordPress(blog, endpoint, {
      method: "DELETE",
    });
  }

  // Categories
  async getCategories(
    blog: "einsof7" | "opetmil",
    params?: {
      per_page?: number;
      page?: number;
      search?: string;
      parent?: number;
    }
  ): Promise<WordPressCategory[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/categories${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.fetchWordPress(blog, endpoint);
  }

  async createCategory(
    blog: "einsof7" | "opetmil",
    category: {
      name: string;
      description?: string;
      parent?: number;
      slug?: string;
    }
  ): Promise<WordPressCategory> {
    return this.fetchWordPress(blog, "/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
  }

  // Tags
  async getTags(
    blog: "einsof7" | "opetmil",
    params?: {
      per_page?: number;
      page?: number;
      search?: string;
    }
  ): Promise<WordPressTag[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/tags${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.fetchWordPress(blog, endpoint);
  }

  async createTag(
    blog: "einsof7" | "opetmil",
    tag: {
      name: string;
      description?: string;
      slug?: string;
    }
  ): Promise<WordPressTag> {
    return this.fetchWordPress(blog, "/tags", {
      method: "POST",
      body: JSON.stringify(tag),
    });
  }

  // Media
  async getMedia(
    blog: "einsof7" | "opetmil",
    params?: {
      per_page?: number;
      page?: number;
      media_type?: "image" | "video" | "audio" | "application";
      mime_type?: string;
    }
  ): Promise<WordPressMedia[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/media${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.fetchWordPress(blog, endpoint);
  }

  async uploadMedia(
    blog: "einsof7" | "opetmil",
    file: File,
    data?: {
      title?: string;
      caption?: string;
      alt_text?: string;
      description?: string;
    }
  ): Promise<WordPressMedia> {
    const formData = new FormData();
    formData.append("file", file);

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
    }

    const config = this.blogConfig[blog];
    const url = `${config.url}/media`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: this.getAuthHeader(blog),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WordPress API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Helper to get blog type from domain
  static getBlogTypeFromDomain(domain: string): "einsof7" | "opetmil" | null {
    if (domain.includes("einsof7.com")) return "einsof7";
    if (domain.includes("opetmil.com")) return "opetmil";
    return null;
  }

  // Helper to sync post with Supabase
  async syncPostWithSupabase(
    blog: "einsof7" | "opetmil",
    wordpressPostId: number,
    supabasePostId: string
  ) {
    try {
      const wpPost = await this.getPost(blog, wordpressPostId);

      // Update Supabase with WordPress data
      const { supabase } = await import("@/lib/supabase");

      await supabase
        .from("content_posts")
        .update({
          wordpress_post_id: wpPost.id,
          status: wpPost.status === "publish" ? "published" : wpPost.status,
          published_at: wpPost.status === "publish" ? wpPost.date : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", supabasePostId);

      return wpPost;
    } catch (error) {
      console.error("Error syncing post with Supabase:", error);
      throw error;
    }
  }
}
