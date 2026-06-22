# Visual Design & UX

Dark mode by default, mobile-first responsive.

## Color Palette

| Use | Color | Hex |
|-----|-------|-----|
| Background | Ultra dark | #09090B |
| Surface / Cards | Dark grey | #1C1C1E |
| Primary accent | Energetic orange | #F0932C |
| Primary text | White | #FFFFFF |
| Secondary text | Zinc 400 | #A1A1AA |
| Success | Green | #8ADE88 |
| Warning | Amber | #F8BF24 |
| Danger | Coral red | #F87171 |

## Metabolic zone colors (timer)

| Zone | Hex |
|------|-----|
| Anabolic | #8ADE88 |
| Catabolic | #F8BF24 |
| Fat Burning | #F0932C |
| Autophagy | #F87171 |

## Navigation

Bottom tab bar with 3 tabs (identical to Zero):

1. **Today** — Timer + Protein Score + Quick daily metrics
2. **History** — Charts + Monthly calendar
3. **Me** — Profile, settings, statistics

Floating "+" button (FAB) to add:
- Meal (text/photo/manual)
- Quick metrics

## Typography

- Headings: Inter/System font, bold
- Timer: Monospace tabular nums (to prevent layout shifts)
- Body: Inter/System font, regular

## Key Components

### TimerRing
- Circular SVG, ~280px diameter
- Grey background track + colored progress arc
- Centered text: HH:MM:SS in large mono font

### ProteinGauge
- Semicircular SVG (180°)
- Orange gradient
- Large centered number (0-100)

### WeekDots
- 7 small circles (MON-SUN)
- Green = completed, grey = no fast, yellow = partial

### MetricCard
- Dark surface card with icon + value + label
- Expandable to edit

## Responsive

- **Mobile** (<640px): full width, stacked, bottom tabs
- **Tablet** (640-1024px): max-width container, 2 columns where appropriate
- **Desktop** (>1024px): centered, max-width 480px (simulates mobile app)

The app will primarily be used from mobile via browser.

## Visual Reference

See Zero screenshots in `docs/reference/` — main screen with circular timer, weekly calendar, protein score gauge, Start Fasting button.
