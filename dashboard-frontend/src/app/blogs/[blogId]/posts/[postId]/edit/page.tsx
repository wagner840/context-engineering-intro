"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";

const WordPressEditor = dynamic(
  () =>
    import("@/components/content/wordpress-editor").then(
      (m) => m.WordPressEditor
    ),
  { ssr: false }
);

interface PageProps {
  params: { blogId: string; postId: string };
}

async function fetchPost(blogId: string, postId: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("blog_id", blogId)
    .eq("id", postId)
    .single();
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}

export default async function EditPostPage({ params }: PageProps) {
  const post = await fetchPost(params.blogId, params.postId);
  if (!post) {
    return <div className="container mx-auto p-8">Post não encontrado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Card className="glass-card gradient-border">
        <CardHeader>
          <CardTitle>Editar Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Loading text="Carregando editor..." />}>
            <WordPressEditor
              postId={params.postId}
              blogId={params.blogId}
              initialData={{
                title: post.title,
                content: post.content,
                excerpt: post.excerpt,
                status: post.status,
                target_keywords: post.target_keywords,
              }}
              onSave={() => {
                // após salvar voltar para lista
              }}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
