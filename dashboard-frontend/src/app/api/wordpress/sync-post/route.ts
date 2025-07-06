import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// Validação com Zod
const syncPostSchema = z.object({
  postId: z.string().uuid("ID do post deve ser um UUID válido"),
  blogId: z.string().uuid("ID do blog deve ser um UUID válido"),
});

// Configurações WordPress
const getWordPressConfig = (domain: string) => {
  const configs = {
    "einsof7.com": {
      url: "https://einsof7.com",
      username: process.env.EINSOF7_WORDPRESS_USERNAME || "",
      password: process.env.EINSOF7_WORDPRESS_PASSWORD || "",
    },
    "optemil.com": {
      url: "https://optemil.com",
      username: process.env.OPTEMIL_WORDPRESS_USERNAME || "",
      password: process.env.OPTEMIL_WORDPRESS_PASSWORD || "",
    },
  };

  return configs[domain as keyof typeof configs] || null;
};

// Cliente WordPress
class WordPressApiClient {
  private baseUrl: string;
  private credentials: string;

  constructor(config: { url: string; username: string; password: string }) {
    this.baseUrl = `${config.url}/wp-json/wp/v2`;
    this.credentials = btoa(`${config.username}:${config.password}`);
  }

  async createPost(postData: any) {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${this.credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WordPress API Error ${response.status}: ${error}`);
    }

    return response.json();
  }

  async updatePost(id: number, postData: any) {
    const response = await fetch(`${this.baseUrl}/posts/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${this.credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WordPress API Error ${response.status}: ${error}`);
    }

    return response.json();
  }

  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/posts?per_page=1`, {
        headers: {
          Authorization: `Basic ${this.credentials}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse e validação dos dados
    const body = await request.json();
    const { postId, blogId } = syncPostSchema.parse(body);

    // Buscar dados do post
    const { data: post, error: postError } = await supabase
      .from("content_posts")
      .select("*")
      .eq("id", postId)
      .eq("blog_id", blogId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        {
          success: false,
          error: "Post não encontrado",
        },
        { status: 404 }
      );
    }

    // Buscar dados do blog
    const { data: blog, error: blogError } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", blogId)
      .single();

    if (blogError || !blog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog não encontrado",
        },
        { status: 404 }
      );
    }

    // Configuração do WordPress
    const wpConfig = getWordPressConfig(blog.domain);
    if (!wpConfig) {
      return NextResponse.json(
        {
          success: false,
          error: `Configuração WordPress não encontrada para ${blog.domain}`,
        },
        { status: 400 }
      );
    }

    // Cliente WordPress
    const wpClient = new WordPressApiClient(wpConfig);

    // Testar conexão primeiro
    const isConnected = await wpClient.testConnection();
    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          error: "Não foi possível conectar ao WordPress",
        },
        { status: 500 }
      );
    }

    // Preparar dados do post para o WordPress
    const wpPostData = {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      status: post.status,
      meta: {
        _yoast_wpseo_title: post.meta_title || "",
        _yoast_wpseo_metadesc: post.meta_description || "",
      },
    };

    let wpResponse;

    // Criar ou atualizar post no WordPress
    if (post.wordpress_post_id) {
      // Atualizar post existente
      wpResponse = await wpClient.updatePost(
        post.wordpress_post_id,
        wpPostData
      );
    } else {
      // Criar novo post
      wpResponse = await wpClient.createPost(wpPostData);
    }

    // Atualizar dados no Supabase
    const { error: updateError } = await supabase
      .from("content_posts")
      .update({
        wordpress_post_id: wpResponse.id,
        wordpress_link: wpResponse.link,
        wordpress_slug: wpResponse.slug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId);

    if (updateError) {
      console.error("Erro ao atualizar post no Supabase:", updateError);
      // Não falha a operação, apenas loga o erro
    }

    // Log da sincronização
    await supabase.from("sync_logs").insert({
      blog_id: blogId,
      sync_type: "supabase_to_wp",
      status: "completed",
      details: {
        post_id: postId,
        wordpress_id: wpResponse.id,
        wordpress_link: wpResponse.link,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        wordpress_id: wpResponse.id,
        wordpress_link: wpResponse.link,
        wordpress_slug: wpResponse.slug,
      },
      message: "Post sincronizado com sucesso",
    });
  } catch (error) {
    console.error("Erro na sincronização:", error);

    // Log do erro
    const body = await request.json().catch(() => ({}));
    if (body.blogId) {
      await supabase.from("sync_logs").insert({
        blog_id: body.blogId,
        sync_type: "supabase_to_wp",
        status: "failed",
        details: {
          error: error instanceof Error ? error.message : "Erro desconhecido",
          post_id: body.postId,
        },
      });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Método não permitido",
    },
    { status: 405 }
  );
}
