import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database, SerpResult } from "@/types/database";

type ExecutiveDashboard =
  Database["public"]["Views"]["executive_dashboard"]["Row"];

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  executive: () => [...DASHBOARD_QUERY_KEYS.all, "executive"] as const,
  executiveBlog: (blogName: string) =>
    [...DASHBOARD_QUERY_KEYS.executive(), blogName] as const,
} as const;

export function useExecutiveDashboard(blogName?: string) {
  return useQuery({
    queryKey: blogName
      ? DASHBOARD_QUERY_KEYS.executiveBlog(blogName)
      : DASHBOARD_QUERY_KEYS.executive(),
    queryFn: async (): Promise<ExecutiveDashboard[]> => {
      let query = supabase.from("executive_dashboard").select("*");

      if (blogName) {
        query = query.eq("blog_name", blogName);
      }

      const { data, error } = await query.order("blog_name", {
        ascending: true,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useExecutiveDashboardSingle(blogName: string) {
  const { data, ...rest } = useExecutiveDashboard(blogName);

  return {
    data: data?.[0] || null,
    ...rest,
  };
}

export function useAnalyticsMetrics(
  blogId: string,
  dateRange?: { start: string; end: string }
) {
  return useQuery({
    queryKey: ["analytics-metrics", blogId, dateRange],
    queryFn: async () => {
      let query = supabase
        .from("analytics_metrics")
        .select("*")
        .eq("blog_id", blogId);

      if (dateRange) {
        query = query
          .gte("metric_date", dateRange.start)
          .lte("metric_date", dateRange.end);
      }

      const { data, error } = await query
        .order("metric_date", { ascending: false })
        .limit(1000);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSerpResults(blogId: string) {
  return useQuery({
    queryKey: ["serp-results", blogId],
    queryFn: async () => {
      // Get SERP results for keywords belonging to this blog
      const { data, error } = await supabase
        .from("serp_results")
        .select(
          `
          *,
          main_keywords!inner (
            id,
            keyword,
            blog_id
          )
        `
        )
        .eq("main_keywords.blog_id", blogId)
        .order("position", { ascending: true })
        .limit(100);

      if (error) {
        throw new Error(error.message);
      }

      return data as SerpResult[];
    },
    enabled: !!blogId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useDashboardStats(blogId?: string) {
  const { data: executiveDashboard } = useExecutiveDashboard();
  const { data: analytics } = useAnalyticsMetrics(blogId || "", {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const stats = {
    totalBlogs: executiveDashboard?.length || 0,
    totalKeywords:
      executiveDashboard?.reduce(
        (sum, blog) => sum + (blog.total_keywords || 0),
        0
      ) || 0,
    totalPosts:
      executiveDashboard?.reduce(
        (sum, blog) => sum + (blog.total_posts || 0),
        0
      ) || 0,
    publishedPosts:
      executiveDashboard?.reduce(
        (sum, blog) => sum + (blog.published_posts || 0),
        0
      ) || 0,
    totalOpportunities:
      executiveDashboard?.reduce(
        (sum, blog) => sum + (blog.total_opportunities || 0),
        0
      ) || 0,
    avgMsv:
      (executiveDashboard?.reduce(
        (sum, blog) => sum + (blog.avg_msv || 0),
        0
      ) || 0) / (executiveDashboard?.length || 1),
    avgDifficulty:
      (executiveDashboard?.reduce(
        (sum, blog) => sum + (blog.avg_difficulty || 0),
        0
      ) || 0) / (executiveDashboard?.length || 1),
    avgCpc:
      (executiveDashboard?.reduce(
        (sum, blog) => sum + (blog.avg_cpc || 0),
        0
      ) || 0) / (executiveDashboard?.length || 1),
    recentMetrics: analytics?.slice(0, 7) || [], // Last 7 metrics
  };

  return stats;
}

export function useBlogNiches() {
  const { data: executiveDashboard } = useExecutiveDashboard();

  const niches =
    executiveDashboard?.reduce((acc, blog) => {
      if (blog.niche && !acc.includes(blog.niche)) {
        acc.push(blog.niche);
      }
      return acc;
    }, [] as string[]) || [];

  return niches;
}

export function useDashboardRealtime() {
  const queryClient = useQueryClient();

  return {
    subscribe: () => {
      const channel = supabase
        .channel("dashboard_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "main_keywords",
          },
          () => {
            queryClient.invalidateQueries({
              queryKey: DASHBOARD_QUERY_KEYS.executive(),
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "content_posts",
          },
          () => {
            queryClient.invalidateQueries({
              queryKey: DASHBOARD_QUERY_KEYS.executive(),
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "analytics_metrics",
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ["analytics-metrics"] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
  };
}
