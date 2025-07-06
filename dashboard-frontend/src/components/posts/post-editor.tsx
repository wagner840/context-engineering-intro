"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  X,
  Eye,
  ImageIcon,
  Code,
  Wand2,
  FileText,
  Upload,
} from "lucide-react";
import { usePost, useCreatePost, useUpdatePost } from "@/hooks/use-posts";
import { MediaUploader } from "@/components/media/media-uploader";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { CodeEditor } from "@/components/editor/code-editor";
import { PostPreview } from "@/components/posts/post-preview";
import { SEOSettings } from "@/components/posts/seo-settings";
import { Loading } from "@/components/ui/loading";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import Image from "next/image";

interface PostEditorProps {
  blogId: string;
  postId?: string | null;
  onSave?: (data: Record<string, unknown>) => void;
  onPreview?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

interface PostData {
  title: string;
  content: string;
  excerpt: string;
  status: "draft" | "pending" | "publish" | "private";
  featured_image?: string;
  author?: string;
  categories: string[];
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  custom_fields?: Record<string, unknown>;
  publish_date?: string;
  wordpress_sync: boolean;
}

export function PostEditor({
  blogId,
  postId,
  onSave,
  onCancel,
}: PostEditorProps) {
  const [postData, setPostData] = useState<PostData>({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    categories: [],
    tags: [],
    wordpress_sync: true,
  });

  const [activeTab, setActiveTab] = useState("content");
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: post, isLoading } = usePost(postId || "");
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const debouncedPostData = useDebounce(postData, 1000);

  // Carregar dados do post existente
  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        status:
          (post.status as "draft" | "pending" | "publish" | "private") ||
          "draft",
        featured_image: post.featured_image || undefined,
        author: post.author || undefined,
        categories: post.categories || [],
        tags: post.tags || [],
        seo_title: post.seo_title || undefined,
        seo_description: post.seo_description || undefined,
        seo_keywords: post.seo_keywords || [],
        custom_fields: post.custom_fields || {},
        publish_date: post.publish_date || undefined,
        wordpress_sync: post.wordpress_sync ?? true,
      });
    }
  }, [post]);

  // Auto-save (rascunho)
  useEffect(() => {
    if (hasUnsavedChanges && postId && debouncedPostData.title.trim()) {
      handleAutoSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPostData, hasUnsavedChanges, postId]);

  const handleAutoSave = async () => {
    if (!postId) return;

    try {
      await updatePost.mutateAsync({
        id: postId,
        ...debouncedPostData,
        blog_id: blogId,
        status: "draft", // Auto-save sempre como rascunho
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Erro no auto-save:", error);
    }
  };

  const updatePostData = useCallback((updates: Partial<PostData>) => {
    setPostData((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = async () => {
    if (!postData.title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    setIsSaving(true);
    try {
      const postPayload = {
        ...postData,
        blog_id: blogId,
      };

      if (postId) {
        await updatePost.mutateAsync({ id: postId, ...postPayload });
        toast.success("Post atualizado com sucesso");
      } else {
        await createPost.mutateAsync(postPayload);
        toast.success("Post criado com sucesso");
      }

      setHasUnsavedChanges(false);
      onSave?.(postData as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      toast.error("Erro ao salvar post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = useCallback(
    (imageUrl: string) => {
      if (editorMode === "visual") {
        // Inserir imagem no editor visual
        updatePostData({
          content: postData.content + `\n<img src="${imageUrl}" alt="" />`,
        });
      } else {
        // Inserir HTML da imagem
        updatePostData({
          content:
            postData.content +
            `\n<img src="${imageUrl}" alt="" class="wp-image" />`,
        });
      }
    },
    [editorMode, postData.content, updatePostData]
  );

  const handleFeaturedImageUpload = useCallback(
    (imageUrl: string) => {
      updatePostData({ featured_image: imageUrl });
    },
    [updatePostData]
  );

  const generateExcerpt = useCallback(() => {
    const plainText = postData.content.replace(/<[^>]*>/g, "");
    const excerpt =
      plainText.substring(0, 160) + (plainText.length > 160 ? "..." : "");
    updatePostData({ excerpt });
  }, [postData.content, updatePostData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading text="Carregando post..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {postId ? "Editar Post" : "Novo Post"}
          </h2>
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-600">
              Alterações não salvas
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>

          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Editor Principal */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={postData.title}
                  onChange={(e) => updatePostData({ title: e.target.value })}
                  placeholder="Digite o título do post..."
                  className="text-lg"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="media">Mídia</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={
                          editorMode === "visual" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setEditorMode("visual")}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Visual
                      </Button>
                      <Button
                        variant={editorMode === "html" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditorMode("html")}
                      >
                        <Code className="h-4 w-4 mr-1" />
                        HTML
                      </Button>
                    </div>

                    <MediaUploader
                      onUpload={handleImageUpload}
                      accept="image/*"
                      maxSize={10 * 1024 * 1024}
                    >
                      <Button variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Inserir Imagem
                      </Button>
                    </MediaUploader>
                  </div>

                  {editorMode === "visual" ? (
                    <RichTextEditor
                      content={postData.content}
                      onChange={(content) => updatePostData({ content })}
                      placeholder="Escreva o conteúdo do seu post..."
                      className="min-h-[400px]"
                    />
                  ) : (
                    <CodeEditor
                      value={postData.content}
                      onChange={(content) => updatePostData({ content })}
                      language="html"
                      placeholder="<p>Escreva o HTML do seu post...</p>"
                    />
                  )}
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Imagem Destacada</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {postData.featured_image ? (
                        <div className="space-y-4">
                          <Image
                            src={postData.featured_image}
                            alt={`Imagem destacada para ${postData.title}`}
                            width={400}
                            height={300}
                            className="w-full max-w-sm h-auto rounded-lg object-cover"
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              updatePostData({ featured_image: undefined })
                            }
                          >
                            Remover imagem
                          </Button>
                        </div>
                      ) : (
                        <MediaUploader
                          onUpload={handleFeaturedImageUpload}
                          accept="image/*"
                          maxSize={10 * 1024 * 1024}
                        >
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">
                              Adicionar imagem destacada
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Clique para selecionar ou arraste uma imagem
                            </p>
                          </div>
                        </MediaUploader>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <SEOSettings
                    title={postData.seo_title || postData.title}
                    description={postData.seo_description || postData.excerpt}
                    keywords={postData.seo_keywords || []}
                    onUpdate={(seoData) =>
                      updatePostData({
                        seo_title: seoData.title,
                        seo_description: seoData.description,
                        seo_keywords: seoData.keywords,
                      })
                    }
                  />
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações do Post</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={postData.status}
                            onValueChange={(value) =>
                              updatePostData({
                                status: value as
                                  | "draft"
                                  | "pending"
                                  | "publish"
                                  | "private",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Rascunho</SelectItem>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="publish">Publicado</SelectItem>
                              <SelectItem value="private">Privado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="author">Autor</Label>
                          <Input
                            id="author"
                            value={postData.author || ""}
                            onChange={(e) =>
                              updatePostData({ author: e.target.value })
                            }
                            placeholder="Nome do autor"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="categories">Categorias</Label>
                        <Input
                          id="categories"
                          value={postData.categories.join(", ")}
                          onChange={(e) =>
                            updatePostData({
                              categories: e.target.value
                                .split(",")
                                .map((cat) => cat.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="Categoria1, Categoria2, ..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                          id="tags"
                          value={postData.tags.join(", ")}
                          onChange={(e) =>
                            updatePostData({
                              tags: e.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="tag1, tag2, ..."
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="wordpress-sync">
                          Sincronizar com WordPress
                        </Label>
                        <Switch
                          id="wordpress-sync"
                          checked={postData.wordpress_sync}
                          onCheckedChange={(checked) =>
                            updatePostData({ wordpress_sync: checked })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="excerpt">Resumo do Post</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateExcerpt}
                    className="text-xs"
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    Gerar
                  </Button>
                </div>
                <Textarea
                  id="excerpt"
                  value={postData.excerpt}
                  onChange={(e) => updatePostData({ excerpt: e.target.value })}
                  placeholder="Escreva um resumo do post..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Palavras:</span>
                <span className="text-sm font-medium">
                  {
                    postData.content
                      .replace(/<[^>]*>/g, "")
                      .split(/\s+/)
                      .filter(Boolean).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Caracteres:</span>
                <span className="text-sm font-medium">
                  {postData.content.replace(/<[^>]*>/g, "").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tempo de leitura:</span>
                <span className="text-sm font-medium">
                  {Math.ceil(
                    postData.content
                      .replace(/<[^>]*>/g, "")
                      .split(/\s+/)
                      .filter(Boolean).length / 200
                  )}{" "}
                  min
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <PostPreview post={postData} onClose={() => setIsPreviewOpen(false)} />
      )}
    </div>
  );
}
