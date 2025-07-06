export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt?: {
    rendered: string;
    protected: boolean;
  };
  status: "publish" | "future" | "draft" | "pending" | "private";
  featured_media?: number;
  categories?: number[];
  tags?: number[];
  meta?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
  link?: string;
  slug?: string;
  date?: string;
}

export interface WordPressResponse extends WordPressPost {
  // Campos adicionais específicos da resposta, se houver
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "category";
  parent: number;
  meta: any[];
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "post_tag";
  meta: any[];
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: any[];
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: "image" | "file";
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

export interface WordPressUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [size: string]: string;
  };
  meta: any[];
}

export interface WordPressApiError {
  code: string;
  message: string;
  data: {
    status: number;
  };
}

export interface WordPressCreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  status?: "publish" | "future" | "draft" | "pending" | "private";
  meta?: {
    [key: string]: any;
  };
}

export interface WordPressUpdatePostRequest
  extends Partial<WordPressCreatePostRequest> {
  id: number;
}

export interface SyncLog {
  id: string;
  blog_id: string;
  sync_type: "wp_to_supabase" | "supabase_to_wp";
  status: "pending" | "running" | "completed" | "failed";
  details?: {
    posts_synced?: number;
    media_synced?: number;
    errors?: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface WordPressPostMapping {
  id: string;
  blog_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  status: string;
  wordpress_post_id: number;
  wordpress_link: string | null;
  wordpress_slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
