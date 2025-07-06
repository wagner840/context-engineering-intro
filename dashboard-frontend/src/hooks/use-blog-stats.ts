"use client";

import { useCallback, useEffect, useState } from "react";
import { BlogService } from "@/lib/services/blog-service";
import keywordsService, { KeywordStats } from "@/lib/services/keywords-service";

type BlogStats = {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_keywords: number;
  total_opportunities: number;
  last_post_date?: string | null;
};

export const useBlogStats = (blogId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<BlogStats | null>(null);
  const [keywords, setKeywords] = useState<KeywordStats | null>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [seo, setSEO] = useState<any[]>([]);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [wordPress, setWordPress] = useState<any[]>([]);

  const loadStats = useCallback(async () => {
    if (!blogId) return;

    try {
      setIsLoading(true);
      const [postsResult, keywordsResult] = await Promise.all([
        BlogService.getBlogStats(blogId),
        keywordsService.getKeywordStats(blogId),
      ]);

      setPosts(postsResult as BlogStats);
      setKeywords(keywordsResult);
      // Inicialmente, definimos arrays vazios para as outras estatísticas
      // que serão implementadas posteriormente
      setAnalytics([]);
      setSEO([]);
      setTraffic([]);
      setWordPress([]);
    } catch (error) {
      console.error("Error loading blog stats:", error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    isLoading,
    error,
    posts,
    keywords,
    analytics,
    seo,
    traffic,
    wordPress,
  };
};
