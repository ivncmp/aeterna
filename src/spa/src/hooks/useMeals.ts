import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Meal, MealAnalysis } from "@/types";
import { api } from "@/lib/api";

export function useAnalyzeMeal() {
  return useMutation({
    mutationFn: (data: { text?: string; image_base64?: string; media_type?: string }) =>
      api.post<MealAnalysis>("/meals/analyze", data),
  });
}

export function useSaveMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Meal> & { source: string }) =>
      api.post<Meal>("/meals", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["nutrition", "protein-score"] });
    },
  });
}

export function useMeals(date?: string) {
  const d = date ?? new Date().toISOString().slice(0, 10);
  return useQuery({
    queryKey: ["meals", d],
    queryFn: () => api.get<Meal[]>(`/meals?date=${d}`),
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ["meals", "favorites"],
    queryFn: () => api.get<Meal[]>("/meals/favorites"),
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put<Meal>(`/meals/${id}/favorite`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meals"] }),
  });
}

export function useDeleteMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/meals/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["nutrition", "protein-score"] });
    },
  });
}
