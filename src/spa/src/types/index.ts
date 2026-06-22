export type ActivityLevel = "sedentary" | "moderate" | "active" | "very_active";
export type FastStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";
export type MealSource = "MANUAL" | "LLM_TEXT" | "LLM_PHOTO";
export type MetabolicZone = "anabolic" | "catabolic" | "fat_burning" | "autophagy";
export type TimeRange = "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";

export interface User {
  id: string;
  email: string;
  name: string;
  age: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  sex: "M" | "F" | null;
  activity_level: ActivityLevel;
  fasting_goal_hours: number;
  created_at: string;
  updated_at: string;
}

export interface Fast {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  target_duration_minutes: number;
  status: FastStatus;
  mood_rating: number | null;
  notes: string | null;
  created_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  logged_at: string;
  description: string | null;
  photo_url: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  is_favorite: boolean;
  source: MealSource;
  created_at: string;
}

export interface DailyMetrics {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number | null;
  water_ml: number;
  sleep_hours: number | null;
  sleep_quality: number | null;
  mood: number | null;
  exercise_type: string | null;
  exercise_minutes: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ZoneInfo {
  zone: MetabolicZone;
  label: string;
  color: string;
  minHours: number;
  maxHours: number | null;
}

export interface WeekDay {
  date: string;
  label: string;
  status: "completed" | "partial" | "none";
}

export interface FastingStats {
  current_streak: number;
  best_streak: number;
  total_fasts: number;
  avg_duration_hours: number;
  total_hours: number;
  completion_rate: number;
}

export interface ProteinScore {
  score: number;
  consumed_g: number;
  target_g: number;
}

export interface MealAnalysis {
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface WeightPoint {
  date: string;
  weight: number;
  trend: number;
}

export interface FastingPoint {
  date: string;
  hours: number;
  zone: MetabolicZone;
}

export interface NutritionPoint {
  date: string;
  calories: number;
  protein: number;
}

export interface SleepPoint {
  date: string;
  hours: number;
  quality: number;
}

export interface MoodPoint {
  date: string;
  mood: number;
}

export interface WaterPoint {
  date: string;
  ml: number;
}

export interface CalendarDay {
  date: string;
  day: number;
  status: "completed" | "partial" | "none";
}

export type SheetState =
  | { sheet: null }
  | { sheet: "fab-menu" }
  | { sheet: "log-meal"; tab?: "text" | "photo" | "manual" }
  | { sheet: "log-metrics"; section?: string };
