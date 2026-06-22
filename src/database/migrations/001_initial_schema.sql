-- Aeterna initial schema

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  age INTEGER,
  weight_kg REAL,
  height_cm REAL,
  sex TEXT CHECK (sex IN ('M', 'F')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'moderate', 'active', 'very_active')) DEFAULT 'moderate',
  fasting_goal_hours INTEGER DEFAULT 16,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE fasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  target_duration_minutes INTEGER NOT NULL,
  status TEXT CHECK (status IN ('ACTIVE', 'COMPLETED', 'ABANDONED')) NOT NULL DEFAULT 'ACTIVE',
  mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_fasts_user_start ON fasts (user_id, start_time DESC);

CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  description TEXT,
  photo_url TEXT,
  calories REAL,
  protein_g REAL,
  carbs_g REAL,
  fat_g REAL,
  is_favorite BOOLEAN DEFAULT false,
  source TEXT CHECK (source IN ('MANUAL', 'LLM_TEXT', 'LLM_PHOTO')) DEFAULT 'MANUAL',
  llm_raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_meals_user_date ON meals (user_id, logged_at DESC);

CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  weight_kg REAL,
  water_ml INTEGER DEFAULT 0,
  sleep_hours REAL,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  exercise_type TEXT,
  exercise_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, date)
);

CREATE INDEX idx_metrics_user_date ON daily_metrics (user_id, date DESC);
