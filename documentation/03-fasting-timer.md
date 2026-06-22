# Fasting Timer

Main screen of the app. Replicates the Zero experience.

## UI

- Circular SVG progress ring with elapsed time (HH:MM:SS) in the center
- "SINCE LAST FAST" label when no active fast
- Configurable goal: 13h, 16h, 18h, 20h, 24h, custom
- "EDIT Xh GOAL" link below the timer
- Large "Start Fasting" / "Stop Fasting" toggle button
- Weekly calendar above (WED THU FRI SAT SUN MON TUE) with completion dots

## Metabolic Zones

The ring color changes based on elapsed hours:

| Zone | Range | Color | Hex | State |
|------|-------|-------|-----|-------|
| Anabolic | 0-4h | Emerald green | #8ADE88 | Nutrient absorption, elevated glucose |
| Catabolic | 4-12h | Warm amber | #F8BF24 | Hepatic glycogen depletion |
| Fat Burning | 12-18h | Intense orange | #F0932C | Beta-oxidation, ketone production |
| Autophagy | 18h+ | Coral red | #F87171 | Cellular recycling, molecular cleanup |

## Timer Logic

```
T_elapsed = now() - start_time

If T_elapsed < 4h  → Anabolic
If T_elapsed < 12h → Catabolic
If T_elapsed < 18h → Fat Burning
If T_elapsed >= 18h → Autophagy

progress% = min((T_elapsed / target_hours) * 100, 100)
```

- Timer runs in frontend (setInterval every 1s)
- On page reload, the ACTIVE fast is recovered from the backend and recalculated
- The SVG ring uses `stroke-dasharray` and `stroke-dashoffset` for progress

## Features

- **Start**: POST /api/fasts → creates fast with start_time = now
- **Stop**: Confirmation alert → PUT /api/fasts/:id with end_time = now, status = COMPLETED
- **Abandon**: If the user didn't reach the goal → status = ABANDONED
- **Edit start**: Retroactive ("I started yesterday at 8pm") → PUT /api/fasts/:id with adjusted start_time
- **Restore**: If there's an ACTIVE fast on load → restore timer automatically

## API

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/fasts | Create new fast |
| PUT | /api/fasts/:id | Complete/abandon/edit fast |
| GET | /api/fasts/active | Get active fast (if any) |
| GET | /api/fasts/week | Weekly summary for calendar dots |
| GET | /api/fasts?from=&to= | History with date range |
