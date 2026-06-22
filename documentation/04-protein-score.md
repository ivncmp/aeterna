# Protein Score

Semicircular gauge (like Zero) showing the day's protein score.

## Daily Target Calculation

Base formula: `weight_kg × activity_factor`

| Activity Level | Factor (g/kg) |
|----------------|---------------|
| Sedentary | 0.8 |
| Moderate | 1.2 |
| Active | 1.6 |
| Very active | 2.0 |

Age adjustments:
- Over 50 years old: +10%
- Over 65 years old: +20%

Example: 80kg user, active, 35 years old → 80 × 1.6 = 128g target

## Score (0-100)

```
score = min(100, (protein_consumed_today / daily_target) × 100)
```

Fed by the sum of `protein_g` from all meals of the day.

## UI

- Semicircular gauge with orange gradient (like Zero)
- Large number in the center (0-100)
- "Protein Score" label below
- Below the gauge: "Xg / Yg" (consumed / target)
- Shown on the main screen below the timer

## API

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/nutrition/protein-score | Score, consumed_g, target_g for today |

The calculation runs on the backend to ensure consistency.
