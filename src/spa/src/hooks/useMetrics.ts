import { useQuery } from "@tanstack/react-query";
import type { DailyMetrics } from "@/types";
import { mockMetrics } from "@/lib/mock";

export function useDailyMetrics(date?: string) {
  const d = date ?? new Date().toISOString().slice(0, 10);
  return useQuery({
    queryKey: ["metrics", d],
    queryFn: async (): Promise<DailyMetrics> => mockMetrics(),
  });
}
