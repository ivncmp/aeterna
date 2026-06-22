# Daily Metrics Logging

Logging screen where the user adds daily metrics. Everything is saved in `daily_metrics` (1 row per day per user, upsert).

## Metrics

### Water
- Glass counter (250ml each) with +/− buttons
- Configurable daily goal (default 2000ml)
- Visual progress bar
- Quick tap: each tap = +250ml

### Weight
- Numeric input in kg (1 decimal)
- Only 1 entry per day
- Shows delta vs previous day: "+0.3kg" or "−0.5kg"
- Used to recalculate protein score target

### Sleep
- Hours slept: slider or input (0-14h in 0.5 intervals)
- Quality: 1-5 stars

### Mood
- Scale 1-5 with emojis: 😞 😕 😐 😊 😄
- One tap to select

### Exercise
- Type: free text ("running", "gym", "yoga", "walking")
- Duration in minutes

## UI

- Cards/sections in a scrollable screen
- Each section shows the current day's value or "Not logged" in grey
- Tapping expands to edit
- Auto-save on value change (debounced)
- Accessible from the "+" button or from the Today screen

## API

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/metrics?date=YYYY-MM-DD | Metrics for the day |
| PUT | /api/metrics | Upsert (creates or updates the day) |
| GET | /api/metrics/range?from=&to= | Range for charts |
