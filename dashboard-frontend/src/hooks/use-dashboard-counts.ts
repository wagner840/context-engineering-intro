import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useNotifications } from "@/store/ui-store";

export interface DashboardCounts {
  total_blogs: number | null;
  total_keywords: number | null;
  total_posts: number | null;
  total_opportunities: number | null;
}

export const DASHBOARD_COUNTS_QUERY_KEY = ["dashboard-counts"] as const;

export function useDashboardCounts() {
  const { addNotification } = useNotifications();

  // @ts-expect-error - tipos compatíveis com versão do react-query utilizada
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
    onError: (error: Error) => {
      addNotification({
        type: "error",
        title: "Erro ao carregar métricas",
        message: error.message,
      });
    },
  });
}
