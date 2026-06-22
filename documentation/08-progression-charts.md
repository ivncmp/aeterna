# Progression Charts

"History" screen — temporal visualization of all metrics.

## Charts

### Weight (line)
- X axis: time, Y axis: kg
- Selectable ranges: 1 week, 1 month, 3 months, 6 months, 1 year
- Smoothed trend line
- Total delta for selected period ("+2.3kg" or "−4.1kg")

### Fasting (bars)
- Vertical bars per day with fasting duration in hours
- Dotted horizontal line = current goal
- Each bar colored by the maximum zone reached that day

### Calories / Protein (dual line)
- Two lines: calories (left Y axis) and protein (right Y axis)
- Target lines as horizontal reference

### Sleep (bars + line)
- Bars: hours per night
- Overlaid line: quality (1-5)
- Bar color by hours (red <6h, yellow 6-7h, green 7-9h)

### Mood (line with emojis)
- Emotional trend with colored dots
- Visual correlation with completed fasting days

## Time Ranges

Shared selector for all charts:
- 1W (week)
- 1M (month)
- 3M
- 6M
- 1Y (year)
- ALL

## Library

**Recharts** — more idiomatic in React, good documentation, responsive.
Alternative: Chart.js with react-chartjs-2.

## API

Reuses existing endpoints:
- GET /api/metrics/range?from=&to= — weight, sleep, mood, water, exercise
- GET /api/fasts?from=&to= — fasting history
- GET /api/meals?from=&to= — to aggregate calories/protein per day

The frontend calculates aggregations (sum, avg per day/week).
