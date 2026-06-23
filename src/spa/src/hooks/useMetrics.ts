import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DailyMetrics } from "@/types";
import { api } from "@/lib/api";

export function useDailyMetrics(date?: string) {
  const d = date ?? new Date().toISOString().slice(0, 10);
  return useQuery({
    queryKey: ["metrics", d],
    queryFn: () => api.get<DailyMetrics | null>(`/metrics?date=${d}`),
  });
}

export function useUpsertMetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DailyMetrics> & { date: string }) =>
      api.put<DailyMetrics>("/metrics", data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["metrics", vars.date] });
    },
  });
}
