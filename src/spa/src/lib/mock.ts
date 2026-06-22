import type {
  User,
  Fast,
  Meal,
  DailyMetrics,
  WeekDay,
  FastingStats,
  ProteinScore,
  WeightPoint,
  FastingPoint,
  NutritionPoint,
  SleepPoint,
  MoodPoint,
  WaterPoint,
  CalendarDay,
  MetabolicZone,
} from "@/types";

const USER_ID = "00000000-0000-0000-0000-000000000001";

export function mockUser(): User {
  return {
    id: USER_ID,
    email: "ivan@aeterna.app",
    name: "Iván Martín",
    age: 35,
    weight_kg: 80,
    height_cm: 178,
    sex: "M",
    activity_level: "active",
    fasting_goal_hours: 16,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-06-17T00:00:00Z",
  };
}

export function mockActiveFast(): Fast {
  const now = Date.now();
  const hoursAgo = 14 * 3600 * 1000 + 23 * 60 * 1000 + 47 * 1000;
  return {
    id: "f0000000-0000-0000-0000-000000000001",
    user_id: USER_ID,
    start_time: new Date(now - hoursAgo).toISOString(),
    end_time: null,
    target_duration_minutes: 16 * 60,
    status: "ACTIVE",
    mood_rating: null,
    notes: null,
    created_at: new Date(now - hoursAgo).toISOString(),
  };
}

export function mockMeals(): Meal[] {
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      id: "m0000001",
      user_id: USER_ID,
      logged_at: `${today}T12:30:00Z`,
      description: "Grilled chicken & avocado salad",
      photo_url: null,
      calories: 420,
      protein_g: 38,
      carbs_g: 22,
      fat_g: 19,
      is_favorite: false,
      source: "LLM_TEXT",
      created_at: `${today}T12:30:00Z`,
    },
    {
      id: "m0000002",
      user_id: USER_ID,
      logged_at: `${today}T08:00:00Z`,
      description: "Greek yogurt with berries and granola",
      photo_url: null,
      calories: 280,
      protein_g: 26,
      carbs_g: 32,
      fat_g: 8,
      is_favorite: true,
      source: "MANUAL",
      created_at: `${today}T08:00:00Z`,
    },
  ];
}

export function mockMetrics(): DailyMetrics {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: "d0000001",
    user_id: USER_ID,
    date: today,
    weight_kg: 78.2,
    water_ml: 1500,
    sleep_hours: 7.33,
    sleep_quality: 4,
    mood: 4,
    exercise_type: "Running",
    exercise_minutes: 45,
    notes: null,
    created_at: `${today}T07:00:00Z`,
    updated_at: `${today}T12:00:00Z`,
  };
}

export function mockWeekDays(): WeekDay[] {
  const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const STATUSES: WeekDay["status"][] = [
    "completed",
    "completed",
    "partial",
    "completed",
    "none",
    "none",
    "none",
  ];
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const todayIdx = (dayOfWeek + 6) % 7;
    return {
      date: iso,
      label: DAY_LABELS[d.getDay()]!,
      status: i < todayIdx ? STATUSES[i] ?? "none" : "none",
    };
  });
}

export function mockStats(): FastingStats {
  return {
    current_streak: 12,
    best_streak: 28,
    total_fasts: 156,
    avg_duration_hours: 16.4,
    total_hours: 2340,
    completion_rate: 87,
  };
}

export function mockProteinScore(): ProteinScore {
  return {
    score: 50,
    consumed_g: 64,
    target_g: 128,
  };
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function daysAgo(n: number): string {
  const d = new Date(2026, 5, 17);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function mockWeightSeries(count = 30): WeightPoint[] {
  const rand = seededRandom(42);
  let weight = 81.5;
  const points: WeightPoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    weight += (rand() - 0.52) * 0.6;
    weight = Math.max(74, Math.min(85, weight));
    const trend = 81.5 - (count - 1 - (count - 1 - i)) * 0.08;
    points.push({
      date: daysAgo(i),
      weight: Math.round(weight * 10) / 10,
      trend: Math.round(Math.max(74, Math.min(85, trend)) * 10) / 10,
    });
  }
  return points;
}

export function mockFastingSeries(count = 14): FastingPoint[] {
  const rand = seededRandom(77);
  const zones: MetabolicZone[] = [
    "anabolic",
    "catabolic",
    "fat_burning",
    "autophagy",
  ];
  return Array.from({ length: count }, (_, i) => {
    const hours = 10 + rand() * 12;
    const zone =
      hours < 4
        ? zones[0]
        : hours < 12
          ? zones[1]
          : hours < 18
            ? zones[2]
            : zones[3];
    return {
      date: daysAgo(count - 1 - i),
      hours: Math.round(hours * 10) / 10,
      zone,
    };
  });
}

export function mockNutritionSeries(count = 14): NutritionPoint[] {
  const rand = seededRandom(99);
  return Array.from({ length: count }, (_, i) => ({
    date: daysAgo(count - 1 - i),
    calories: Math.round(1600 + rand() * 800),
    protein: Math.round(80 + rand() * 70),
  }));
}

export function mockSleepSeries(count = 14): SleepPoint[] {
  const rand = seededRandom(55);
  return Array.from({ length: count }, (_, i) => ({
    date: daysAgo(count - 1 - i),
    hours: Math.round((5 + rand() * 4.5) * 10) / 10,
    quality: Math.min(5, Math.max(1, Math.round(1 + rand() * 4))),
  }));
}

export function mockWaterSeries(count = 14): WaterPoint[] {
  const rand = seededRandom(88);
  return Array.from({ length: count }, (_, i) => ({
    date: daysAgo(count - 1 - i),
    ml: Math.round((800 + rand() * 1700) / 50) * 50,
  }));
}

export function mockMoodSeries(count = 14): MoodPoint[] {
  const rand = seededRandom(33);
  return Array.from({ length: count }, (_, i) => ({
    date: daysAgo(count - 1 - i),
    mood: Math.min(5, Math.max(1, Math.round(1 + rand() * 4))),
  }));
}

export function mockCalendarDays(year: number, month: number): CalendarDay[] {
  const rand = seededRandom(year * 100 + month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(2026, 5, 17);
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const isPast = d < today;
    const r = rand();
    const status: CalendarDay["status"] = !isPast
      ? "none"
      : r < 0.6
        ? "completed"
        : r < 0.8
          ? "partial"
          : "none";
    return {
      date: d.toISOString().slice(0, 10),
      day: i + 1,
      status,
    };
  });
}
