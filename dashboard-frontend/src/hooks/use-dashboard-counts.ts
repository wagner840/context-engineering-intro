import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Views } from "@/types/database";

export type DashboardCounts = Views<"dashboard_counts">;

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
