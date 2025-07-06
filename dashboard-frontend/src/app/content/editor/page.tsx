"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Edit3,
  Save,
  Eye,
  Upload,
  Zap,
  BarChart3,
  Clock,
  Hash,
  Image as ImageIcon,
  Type,
  Settings,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";

export default function ContentEditorPage() {
  const [editorData, setEditorData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    categories: [] as string[],
    tags: [] as string[],
    publishDate: "",
    status: "draft",
    blog: "",
    featuredImage: "",
  });

  const [seoAnalysis, setSeoAnalysis] = useState({
    score: 0,
    title: { score: 0, issues: [] as string[] },
    meta: { score: 0, issues: [] as string[] },
    content: { score: 0, issues: [] as string[] },
    keywords: { score: 0, issues: [] as string[] },
    readability: { score: 0, issues: [] as string[] },
  });

  const [editorMode, setEditorMode] = useState<
    "visual" | "markdown" | "preview"
  >("visual");
  const [autoSave, setAutoSave] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const handleContentChange = (content: string) => {
    setEditorData((prev) => ({ ...prev, content }));

    // Calculate word count and reading time
    const words = content.trim().split(/\s+/).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // Average reading speed

    // Auto-generate slug from title
    if (editorData.title && !editorData.slug) {
      const slug = editorData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setEditorData((prev) => ({ ...prev, slug }));
    }
  };

  const generateAIContent = async () => {
    // TODO: Implement AI content generation
    console.log("Generating AI content...");
  };

  const runSeoAnalysis = () => {
    // Simplified SEO analysis
    let totalScore = 0;
    const analysis = {
      score: 0,
      title: { score: 0, issues: [] as string[] },
      meta: { score: 0, issues: [] as string[] },
      content: { score: 0, issues: [] as string[] },
      keywords: { score: 0, issues: [] as string[] },
      readability: { score: 0, issues: [] as string[] },
    };

    // Title analysis
    if (editorData.title.length > 0) {
      if (editorData.title.length >= 30 && editorData.title.length <= 60) {
        analysis.title.score = 100;
      } else {
        analysis.title.score = 60;
        analysis.title.issues.push("Título deve ter entre 30-60 caracteres");
      }
    } else {
      analysis.title.issues.push("Título é obrigatório");
    }

    // Meta description analysis
    if (editorData.metaDescription.length > 0) {
      if (
        editorData.metaDescription.length >= 120 &&
        editorData.metaDescription.length <= 160
      ) {
        analysis.meta.score = 100;
      } else {
        analysis.meta.score = 60;
        analysis.meta.issues.push(
          "Meta description deve ter entre 120-160 caracteres"
        );
      }
    } else {
      analysis.meta.issues.push("Meta description é obrigatória");
    }

    // Content analysis
    if (wordCount > 300) {
      analysis.content.score = 80;
      if (wordCount < 1000) {
        analysis.content.issues.push(
          "Conteúdo pode ser mais detalhado (recomendado: 1000+ palavras)"
        );
      }
    } else {
      analysis.content.score = 40;
      analysis.content.issues.push(
        "Conteúdo muito curto (mínimo: 300 palavras)"
      );
    }

    // Keywords analysis
    if (editorData.keywords.length > 0) {
      analysis.keywords.score = 80;
      if (editorData.keywords.length > 10) {
        analysis.keywords.issues.push("Muitas keywords (recomendado: 3-8)");
      }
    } else {
      analysis.keywords.issues.push("Adicione palavras-chave relevantes");
    }

    // Readability analysis
    analysis.readability.score = 75; // Simplified score

    // Calculate total score
    totalScore = Math.round(
      (analysis.title.score +
        analysis.meta.score +
        analysis.content.score +
        analysis.keywords.score +
        analysis.readability.score) /
        5
    );

    analysis.score = totalScore;
    setSeoAnalysis(analysis);
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeoScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editor de Conteúdo
              </h1>
              <p className="text-gray-600">
                Crie e edite conteúdo otimizado para SEO
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Publicar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={editorData.title}
                  onChange={(e) =>
                    setEditorData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Digite o título do seu post..."
                  className="text-lg"
                />
                <div className="text-xs text-gray-500">
                  {editorData.title.length}/60 caracteres recomendados
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={editorData.slug}
                  onChange={(e) =>
                    setEditorData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="url-amigavel-do-post"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={editorData.excerpt}
                  onChange={(e) =>
                    setEditorData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder="Breve descrição do conteúdo..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conteúdo</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateAIContent}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Gerar com IA
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={editorMode === "visual" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditorMode("visual")}
                    >
                      <Type className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        editorMode === "markdown" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setEditorMode("markdown")}
                    >
                      <Hash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={editorMode === "preview" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditorMode("preview")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editorData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Comece a escrever seu conteúdo aqui..."
                rows={20}
                className="font-mono text-sm"
              />

              <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {wordCount} palavras
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readingTime} min de leitura
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  <span>Auto-save</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Título</Label>
                <Input
                  id="metaTitle"
                  value={editorData.metaTitle}
                  onChange={(e) =>
                    setEditorData((prev) => ({
                      ...prev,
                      metaTitle: e.target.value,
                    }))
                  }
                  placeholder="Título para mecanismos de busca..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Descrição</Label>
                <Textarea
                  id="metaDescription"
                  value={editorData.metaDescription}
                  onChange={(e) =>
                    setEditorData((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  placeholder="Descrição para mecanismos de busca..."
                  rows={3}
                />
                <div className="text-xs text-gray-500">
                  {editorData.metaDescription.length}/160 caracteres
                  recomendados
                </div>
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input
                  placeholder="Adicione palavras-chave separadas por vírgula..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value && !editorData.keywords.includes(value)) {
                        setEditorData((prev) => ({
                          ...prev,
                          keywords: [...prev.keywords, value],
                        }));
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {editorData.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                    >
                      {keyword}
                      <button
                        onClick={() =>
                          setEditorData((prev) => ({
                            ...prev,
                            keywords: prev.keywords.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Publicação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={editorData.status}
                  onChange={(e) =>
                    setEditorData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Rascunho</option>
                  <option value="review">Em Revisão</option>
                  <option value="scheduled">Agendado</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Blog</Label>
                <select
                  value={editorData.blog}
                  onChange={(e) =>
                    setEditorData((prev) => ({ ...prev, blog: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecionar blog...</option>
                  <option value="einsof7">Einsof7</option>
                  <option value="Optemil">Optemil</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Data de Publicação</Label>
                <Input
                  type="datetime-local"
                  value={editorData.publishDate}
                  onChange={(e) =>
                    setEditorData((prev) => ({
                      ...prev,
                      publishDate: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Análise SEO
                </CardTitle>
                <Button variant="outline" size="sm" onClick={runSeoAnalysis}>
                  Analisar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Score */}
              <div
                className={`p-4 rounded-lg ${getSeoScoreBg(seoAnalysis.score)}`}
              >
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${getSeoScoreColor(seoAnalysis.score)}`}
                  >
                    {seoAnalysis.score}
                  </div>
                  <div className="text-sm text-gray-600">Score SEO</div>
                </div>
                <Progress value={seoAnalysis.score} className="mt-2" />
              </div>

              {/* Detailed Analysis */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Título</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${getSeoScoreColor(seoAnalysis.title.score)}`}
                    >
                      {seoAnalysis.title.score}%
                    </span>
                    {seoAnalysis.title.score >= 80 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Meta Description</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${getSeoScoreColor(seoAnalysis.meta.score)}`}
                    >
                      {seoAnalysis.meta.score}%
                    </span>
                    {seoAnalysis.meta.score >= 80 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Conteúdo</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${getSeoScoreColor(seoAnalysis.content.score)}`}
                    >
                      {seoAnalysis.content.score}%
                    </span>
                    {seoAnalysis.content.score >= 80 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Keywords</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${getSeoScoreColor(seoAnalysis.keywords.score)}`}
                    >
                      {seoAnalysis.keywords.score}%
                    </span>
                    {seoAnalysis.keywords.score >= 80 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* SEO Issues */}
              {(seoAnalysis.title.issues.length > 0 ||
                seoAnalysis.meta.issues.length > 0 ||
                seoAnalysis.content.issues.length > 0 ||
                seoAnalysis.keywords.issues.length > 0) && (
                <div className="space-y-2">
                  <Separator />
                  <h4 className="font-medium text-sm">
                    Sugestões de Melhoria:
                  </h4>
                  <div className="space-y-1">
                    {[
                      ...seoAnalysis.title.issues,
                      ...seoAnalysis.meta.issues,
                      ...seoAnalysis.content.issues,
                      ...seoAnalysis.keywords.issues,
                    ].map((issue, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imagem Destacada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {editorData.featuredImage ? (
                  <Image
                    src={editorData.featuredImage}
                    alt={`Imagem destacada do post ${editorData.title}`}
                    width={400}
                    height={300}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Arraste uma imagem ou clique para fazer upload
                    </p>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Escolher Arquivo
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Categories & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Categorias e Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Categorias</Label>
                <Input
                  placeholder="Adicionar categoria..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value && !editorData.categories.includes(value)) {
                        setEditorData((prev) => ({
                          ...prev,
                          categories: [...prev.categories, value],
                        }));
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-1">
                  {editorData.categories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category}
                      <button
                        onClick={() =>
                          setEditorData((prev) => ({
                            ...prev,
                            categories: prev.categories.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  placeholder="Adicionar tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value && !editorData.tags.includes(value)) {
                        setEditorData((prev) => ({
                          ...prev,
                          tags: [...prev.tags, value],
                        }));
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-1">
                  {editorData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                      <button
                        onClick={() =>
                          setEditorData((prev) => ({
                            ...prev,
                            tags: prev.tags.filter((_, i) => i !== index),
                          }))
                        }
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
