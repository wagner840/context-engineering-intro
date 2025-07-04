"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Save,
  Eye,
  Upload,
  Image as ImageIcon,
  Link,
  Bold,
  Italic,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Settings,
} from "lucide-react";
import { useNotifications } from "@/store/ui-store";
import { useBlogStore } from "@/store/blog-store";
import { useUploadWordPressMedia } from "@/hooks/use-wordpress-integration";
import { createSupabaseClient } from "@/lib/supabase";

interface WordPressEditorProps {
  postId?: string;
  blogId: string;
  initialData?: {
    title?: string;
    content?: string;
    excerpt?: string;
    status?: "draft" | "publish" | "private";
    categories?: string[];
    tags?: string[];
    meta_title?: string;
    meta_description?: string;
    target_keywords?: string[];
  };
  onSave?: (data: any) => void;
  onPreview?: (data: any) => void;
}

export function WordPressEditor({
  postId,
  blogId,
  initialData,
  onSave,
  onPreview,
}: WordPressEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    status: initialData?.status || "draft",
    categories: initialData?.categories || [],
    tags: initialData?.tags || [],
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
    target_keywords: initialData?.target_keywords || [],
  });
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [seoScore, setSeoScore] = useState(0);

  const { addNotification } = useNotifications();
  const { selectedBlog } = useBlogStore();
  const uploadMedia = useUploadWordPressMedia();
  const supabase = createSupabaseClient();

  useEffect(() => {
    // Calculate word count and reading time
    const words = formData.content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // Average reading speed

    // Calculate basic SEO score
    calculateSEOScore();
  }, [
    formData.content,
    formData.title,
    formData.meta_title,
    formData.meta_description,
  ]);

  const calculateSEOScore = () => {
    let score = 0;
    const maxScore = 100;

    // Title checks
    if (formData.title.length >= 30 && formData.title.length <= 60) score += 20;

    // Meta description checks
    if (
      formData.meta_description.length >= 120 &&
      formData.meta_description.length <= 160
    )
      score += 20;

    // Content length checks
    if (wordCount >= 300) score += 20;

    // Target keywords usage
    if (formData.target_keywords.length > 0) {
      const keywordInTitle = formData.target_keywords.some((keyword) =>
        formData.title.toLowerCase().includes(keyword.toLowerCase())
      );
      if (keywordInTitle) score += 20;

      const keywordInContent = formData.target_keywords.some((keyword) =>
        formData.content.toLowerCase().includes(keyword.toLowerCase())
      );
      if (keywordInContent) score += 20;
    }

    setSeoScore(score);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const apiUrl = postId
        ? `/api/wordpress/posts/${postId}`
        : "/api/wordpress/posts";

      const method = postId ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          blog_id: blogId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      const result = await response.json();

      // ---------------- Supabase Sync ----------------
      const upsertResult = await supabase.from("content_posts").upsert({
        id: postId || result.data.id,
        blog_id: blogId,
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        status: formData.status,
        target_keywords: formData.target_keywords,
        updated_at: new Date().toISOString(),
      });
      if (upsertResult.error) {
        console.error("Supabase sync error:", upsertResult.error.message);
      }
      // ------------------------------------------------

      addNotification({
        type: "success",
        title: "Post saved successfully",
        message: postId ? "Post updated" : "New post created",
      });

      onSave?.(result.data);
    } catch (error) {
      addNotification({
        type: "error",
        title: "Failed to save post",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    onPreview?.(formData);
  };

  const insertAtCursor = (text: string) => {
    const textarea = document.getElementById(
      "content-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = formData.content.substring(0, start);
    const after = formData.content.substring(end);

    setFormData({
      ...formData,
      content: before + text + after,
    });

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const formatText = (type: string) => {
    switch (type) {
      case "bold":
        insertAtCursor("**bold text**");
        break;
      case "italic":
        insertAtCursor("*italic text*");
        break;
      case "link":
        insertAtCursor("[link text](https://example.com)");
        break;
      case "list":
        insertAtCursor("\n- List item\n- Another item\n");
        break;
      default:
        break;
    }
  };

  const getSEOScoreColor = () => {
    if (seoScore >= 80) return "bg-green-500";
    if (seoScore >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const result = (await uploadMedia.mutateAsync({ blogId, file })) as any;
        const url =
          result?.data?.url || result?.data?.source_url || result?.url;
        if (url) {
          insertAtCursor(`\n<img src="${url}" alt="${file.name}" />\n`);
        }
      } catch (err) {
        // erro já notificado pelo hook
      }
    }
  };

  const preventDefault = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {postId ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-muted-foreground">
            {selectedBlog?.name || "WordPress Editor"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePreview} disabled={isSaving}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Post Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter your post title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Content</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("bold")}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("italic")}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("link")}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                id="content-editor"
                placeholder="Write your content here..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                onDrop={handleDrop}
                onDragOver={preventDefault}
                className="w-full h-96 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>{wordCount} words</span>
                <span>{readingTime} min read</span>
              </div>
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
              <CardDescription>
                A brief summary of your post (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Enter post excerpt..."
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                className="w-full h-24 p-3 border rounded-md resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "publish" | "private") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="publish">Publish</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* SEO Score */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Score</span>
                  <Badge variant="secondary">{seoScore}/100</Badge>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getSEOScoreColor()}`}
                    style={{ width: `${seoScore}%` }}
                  />
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Title length</span>
                    <span
                      className={
                        formData.title.length >= 30 &&
                        formData.title.length <= 60
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formData.title.length >= 30 &&
                      formData.title.length <= 60
                        ? "✓"
                        : "✗"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Meta description</span>
                    <span
                      className={
                        formData.meta_description.length >= 120 &&
                        formData.meta_description.length <= 160
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formData.meta_description.length >= 120 &&
                      formData.meta_description.length <= 160
                        ? "✓"
                        : "✗"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Content length</span>
                    <span
                      className={
                        wordCount >= 300 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {wordCount >= 300 ? "✓" : "✗"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Categories & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="categories">Categories</Label>
                <Input
                  placeholder="Enter categories (comma-separated)"
                  value={formData.categories.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categories: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  placeholder="Enter tags (comma-separated)"
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Meta */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  placeholder="SEO title"
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_title: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <textarea
                  placeholder="SEO description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description: e.target.value,
                    })
                  }
                  className="w-full h-20 p-2 text-sm border rounded-md resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="target-keywords">Target Keywords</Label>
                <Input
                  placeholder="Enter keywords (comma-separated)"
                  value={formData.target_keywords.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target_keywords: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
