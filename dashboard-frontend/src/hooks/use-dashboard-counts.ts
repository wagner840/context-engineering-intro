import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface DashboardCounts {
  total_blogs: number | null;
  total_keywords: number | null;
  total_posts: number | null;
  total_opportunities: number | null;
  avg_msv: number | null;
  avg_difficulty: number | null;
  avg_cpc: number | null;
  conversion_rate: number | null;
}

export const DASHBOARD_COUNTS_QUERY_KEY = ["dashboard-counts"] as const;

export function useDashboardCounts() {
  return useQuery({
    queryKey: DASHBOARD_COUNTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboard_counts")
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as DashboardCounts;
    },
    staleTime: 5 * 60 * 1000,
  });
}
