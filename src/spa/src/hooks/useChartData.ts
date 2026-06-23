import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Fast, DailyMetrics, Meal, WeightPoint, FastingPoint, NutritionPoint, SleepPoint, WaterPoint, MoodPoint, MetabolicZone } from "@/types";

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function getZoneForHours(hours: number): MetabolicZone {
  if (hours < 4) return "anabolic";
  if (hours < 12) return "catabolic";
  if (hours < 18) return "fat_burning";
  return "autophagy";
}

function ema(data: number[], span: number): number[] {
  const k = 2 / (span + 1);
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    result.push(i === 0 ? data[0]! : data[i]! * k + result[i - 1]! * (1 - k));
  }
  return result;
}

export function useWeightSeries(days: number) {
  const from = daysAgoISO(days);
  const to = daysAgoISO(0);
  return useQuery({
    queryKey: ["charts", "weight", days],
    queryFn: async (): Promise<WeightPoint[]> => {
      const metrics = await api.get<DailyMetrics[]>(`/metrics/range?from=${from}&to=${to}`);
      const filtered = metrics.filter((m) => m.weight_kg !== null);
      if (filtered.length === 0) return [];
      const weights = filtered.map((m) => m.weight_kg!);
      const trends = ema(weights, 7);
      return filtered.map((m, i) => ({
        date: m.date.slice(0, 10),
        weight: Math.round(m.weight_kg! * 10) / 10,
        trend: Math.round(trends[i]! * 10) / 10,
      }));
    },
  });
}

export function useFastingSeries(days: number) {
  const from = daysAgoISO(days);
  const to = daysAgoISO(0);
  return useQuery({
    queryKey: ["charts", "fasting", days],
    queryFn: async (): Promise<FastingPoint[]> => {
      const fasts = await api.get<(Fast & { duration_hours?: number })[]>(`/fasts?from=${from}&to=${to}`);
      const byDay = new Map<string, number>();
      for (const f of fasts) {
        if (f.status !== "COMPLETED" && f.status !== "ACTIVE") continue;
        const end = f.end_time ? new Date(f.end_time).getTime() : Date.now();
        const hours = (end - new Date(f.start_time).getTime()) / 3600000;
        const day = f.end_time ? f.end_time.slice(0, 10) : new Date().toISOString().slice(0, 10);
        const prev = byDay.get(day) ?? 0;
        if (hours > prev) byDay.set(day, hours);
      }
      return Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, hours]) => ({
          date,
          hours: Math.round(hours * 10) / 10,
          zone: getZoneForHours(hours),
        }));
    },
  });
}

export function useNutritionSeries(days: number) {
  const from = daysAgoISO(days);
  const to = daysAgoISO(0);
  return useQuery({
    queryKey: ["charts", "nutrition", days],
    queryFn: async (): Promise<NutritionPoint[]> => {
      const meals = await api.get<Meal[]>(`/meals?from=${from}&to=${to}`);
      const byDay = new Map<string, { calories: number; protein: number }>();
      for (const m of meals) {
        const d = m.logged_at.slice(0, 10);
        const prev = byDay.get(d) ?? { calories: 0, protein: 0 };
        byDay.set(d, {
          calories: prev.calories + (m.calories ?? 0),
          protein: prev.protein + (m.protein_g ?? 0),
        });
      }
      return Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, v]) => ({ date, calories: Math.round(v.calories), protein: Math.round(v.protein) }));
    },
  });
}

export function useSleepSeries(days: number) {
  const from = daysAgoISO(days);
  const to = daysAgoISO(0);
  return useQuery({
    queryKey: ["charts", "sleep", days],
    queryFn: async (): Promise<SleepPoint[]> => {
      const metrics = await api.get<DailyMetrics[]>(`/metrics/range?from=${from}&to=${to}`);
      return metrics
        .filter((m) => m.sleep_hours !== null)
        .map((m) => ({ date: m.date.slice(0, 10), hours: m.sleep_hours!, quality: m.sleep_quality ?? 0 }));
    },
  });
}

export function useWaterSeries(days: number) {
  const from = daysAgoISO(days);
  const to = daysAgoISO(0);
  return useQuery({
    queryKey: ["charts", "water", days],
    queryFn: async (): Promise<WaterPoint[]> => {
      const metrics = await api.get<DailyMetrics[]>(`/metrics/range?from=${from}&to=${to}`);
      return metrics
        .filter((m) => m.water_ml > 0)
        .map((m) => ({ date: m.date.slice(0, 10), ml: m.water_ml }));
    },
  });
}

export function useMoodSeries(days: number) {
  const from = daysAgoISO(days);
  const to = daysAgoISO(0);
  return useQuery({
    queryKey: ["charts", "mood", days],
    queryFn: async (): Promise<MoodPoint[]> => {
      const metrics = await api.get<DailyMetrics[]>(`/metrics/range?from=${from}&to=${to}`);
      return metrics
        .filter((m) => m.mood !== null)
        .map((m) => ({ date: m.date.slice(0, 10), mood: m.mood! }));
    },
  });
}
