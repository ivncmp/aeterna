import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Fast, WeekDay, ProteinScore } from "@/types";
import { getZone, getNextZone, formatElapsed } from "@/lib/zones";
import {
  mockActiveFast,
  mockWeekDays,
  mockProteinScore,
  mockStats,
} from "@/lib/mock";
import type { FastingStats } from "@/types";

export function useActiveFast() {
  const { data: fast, ...rest } = useQuery({
    queryKey: ["fasts", "active"],
    queryFn: async () => mockActiveFast() as Fast | null,
    refetchInterval: 60_000,
  });

  return { fast, ...rest };
}

export function useFastingTimer(fast: Fast | null | undefined) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!fast?.start_time) {
      setElapsed(0);
      return;
    }

    const calcElapsed = () => {
      const start = new Date(fast.start_time).getTime();
      return Math.floor((Date.now() - start) / 1000);
    };

    setElapsed(calcElapsed());
    const interval = setInterval(() => setElapsed(calcElapsed()), 1000);
    return () => clearInterval(interval);
  }, [fast?.start_time]);

  const elapsedHours = elapsed / 3600;
  const goalHours = fast ? fast.target_duration_minutes / 60 : 16;
  const progress = fast ? Math.min((elapsedHours / goalHours) * 100, 100) : 0;
  const zone = getZone(elapsedHours);
  const nextZone = getNextZone(zone.zone);

  let timeToNext: string | null = null;
  if (nextZone) {
    const secsToNext = Math.max(0, (nextZone.minHours - elapsedHours) * 3600);
    const h = Math.floor(secsToNext / 3600);
    const m = Math.floor((secsToNext % 3600) / 60);
    timeToNext = h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return {
    elapsed,
    elapsedFormatted: formatElapsed(elapsed),
    elapsedHours,
    progress,
    zone,
    nextZone,
    timeToNext,
    goalHours,
    isActive: !!fast && fast.status === "ACTIVE",
  };
}

export function useStartFast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return mockActiveFast();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fasts"] }),
  });
}

export function useStopFast() {
  const qc = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (id: string) => {
      return null;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fasts"] }),
  });
}

export function useWeekDays() {
  return useQuery({
    queryKey: ["fasts", "week"],
    queryFn: async (): Promise<WeekDay[]> => mockWeekDays(),
  });
}

export function useProteinScore() {
  return useQuery({
    queryKey: ["nutrition", "protein-score"],
    queryFn: async (): Promise<ProteinScore> => mockProteinScore(),
  });
}

export function useFastingStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async (): Promise<FastingStats> => mockStats(),
  });
}

export function useToggleFast(
  isActive: boolean,
  fastId: string | undefined
) {
  const startFast = useStartFast();
  const stopFast = useStopFast();

  const toggle = useCallback(() => {
    if (isActive && fastId) {
      stopFast.mutate(fastId);
    } else {
      startFast.mutate();
    }
  }, [isActive, fastId, startFast, stopFast]);

  return { toggle, isPending: startFast.isPending || stopFast.isPending };
}
