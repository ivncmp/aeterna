# Aeterna — Design Handoff

## Overview

**Aeterna** is a personal fasting tracker app — a sovereign clone of [Zero Fasting](https://zerolongevity.com/). It's built for Iván, family, and friends. Not commercial, not public.

The app tracks intermittent fasting cycles, meal nutrition (via AI photo recognition), daily health metrics, and shows progression over time.

### Target Users
- Iván (developer, 30s, tech-savvy)
- Family and close friends (varying tech levels, 25-65 years old)
- All access from mobile browsers (iOS Safari, Android Chrome)
- Occasional desktop use

### Key Flows
1. **Start/stop fasting** — the primary daily interaction
2. **Log a meal** — text description or photo → AI extracts macros → user confirms
3. **Check daily metrics** — water, weight, sleep, mood, exercise
4. **Review progress** — charts and statistics over time

---

## Brand & Assets

### Logo
- **Full logo**: `assets/aeterna-logo.png` — infinity symbol + "AETERNA" text, dark grey on white
- **Symbol only**: `assets/aeterna-only.png` — infinity symbol alone
- **Favicon**: `assets/favicon/` — includes SVG, ICO, Apple Touch Icon, PWA manifests (192px, 512px)

The infinity symbol represents the cyclical nature of fasting — an eternal loop of feeding and fasting.

### App Name
"Aeterna" — Latin for "eternal". Display in uppercase tracking when used as a header: **AETERNA**.

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#09090B` | Main background, ultra dark |
| `surface` | `#1C1C1E` | Cards, bottom nav, elevated surfaces |
| `accent` / primary | `#F0932C` | Primary actions, FAB, active states, links |
| `text.primary` | `#FFFFFF` | Headings, important text |
| `text.secondary` | `#A1A1AA` | Labels, descriptions, inactive tabs |
| `success` | `#8ADE88` | Completed fasts, positive deltas |
| `warning` | `#F8BF24` | Partial fasts, caution states |
| `error` | `#F87171` | Abandoned fasts, negative states |

#### Metabolic Zone Colors
Used exclusively for the fasting timer ring:

| Zone | Hours | Color | Hex |
|------|-------|-------|-----|
| Anabolic | 0–4h | Emerald green | `#8ADE88` |
| Catabolic | 4–12h | Warm amber | `#F8BF24` |
| Fat Burning | 12–18h | Intense orange | `#F0932C` |
| Autophagy | 18h+ | Coral red | `#F87171` |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Timer display | `"JetBrains Mono", monospace` | 600 | 48px |
| Page headings | `"Inter", system-ui, sans-serif` | 700 | 24px |
| Section headings | Inter | 600 | 18px |
| Body text | Inter | 400 | 16px |
| Labels / captions | Inter | 400 | 14px |
| Small text | Inter | 400 | 12px |

Timer digits MUST use `font-variant-numeric: tabular-nums` to prevent layout shift.

### Spacing & Radius
- Card border radius: 16px
- Button border radius: 12px
- Standard padding: 16px (cards), 20px (page)
- Gap between cards: 12px

### Dark Mode
Dark mode is the **only** mode. There is no light mode toggle. Background `#09090B` everywhere.

---

## App Shell & Navigation

### Desktop Wrapper (PhoneFrame)
On screens **≥640px wide**, the entire app renders inside a fake iPhone frame:
- **Dimensions**: 390 × 844px (iPhone 14/15 proportions)
- **Frame**: 3px solid `#3F3F46` (zinc-700), border-radius 3rem
- **Shadow**: large drop shadow, `rgba(0,0,0,0.5)`
- **Notch**: cosmetic black pill (120 × 28px, rounded-full) centered at top
- **Backdrop**: solid `#050507` filling the entire viewport behind the phone
- **Content**: clips to the frame (`overflow: hidden`)

On screens **<640px** (actual mobile): no frame, full-screen, `100dvh` height.

### Bottom Navigation
3 tabs, always visible at the bottom:

| Tab | Label | Icon | Route |
|-----|-------|------|-------|
| 1 | Today | Timer/clock icon | `/` |
| 2 | History | Bar chart icon | `/history` |
| 3 | Me | Person icon | `/profile` |

- Background: `#1C1C1E` (surface)
- Active tab: icon + label in `#F0932C` (accent)
- Inactive tabs: icon + label in `#A1A1AA` (text.secondary)
- Height: ~56px + safe area padding for iOS
- The nav is NOT `position: fixed` — it sits at the bottom of a flex column, inside the PhoneFrame on desktop

### FAB (Floating Action Button)
- Circular, 56px diameter
- Background: `#F0932C` (accent)
- Icon: white "+" (Add)
- Position: above the bottom nav, right-aligned (bottom: 72px, right: 16px)
- Shadow: medium elevation
- Opens an action sheet / bottom drawer to choose: Log Meal, Log Metrics

---

## Screen 1: Today (Main Screen)

The primary screen. Dominates with the fasting timer.

### Layout (top to bottom)

#### 1. Header Bar
- Left: Aeterna infinity logo (small, ~24px) + streak badge (green circle with number)
- Center: "AETERNA" text (caps, tracking wide, text.secondary)
- Right: settings gear icon (text.secondary)

#### 2. Week Calendar Strip
- Horizontal row of 7 days: MON TUE WED THU FRI SAT SUN
- Day labels in text.secondary, 12px caps
- Below each label: a small circle (10px)
  - **Green filled** (`#8ADE88`): fast completed that day
  - **Yellow filled** (`#F8BF24`): partial fast
  - **Empty/grey** (`#3F3F46`): no fast
- Today's day label is highlighted in text.primary (white)

#### 3. Timer Card
The centerpiece. A card (`#1C1C1E` background, 16px radius) containing:

- **Circular SVG Ring** (~280px diameter)
  - Grey background track (`#3F3F46`)
  - Colored progress arc (color = current metabolic zone)
  - Arc thickness: ~8px
  - Progress: `elapsed / target × 100%`

- **Inside the ring** (centered vertically):
  - Top label: "SINCE LAST FAST" (12px, text.secondary, uppercase) — when idle
  - Top label: zone name (e.g., "FAT BURNING") — when active
  - **Timer**: `HH:MM:SS` (48px, monospace, tabular nums, white)
  - Bottom link: "EDIT 16H GOAL" (14px, accent color, tappable)

- **Action Button** (below the ring, inside the card):
  - Full-width, 48px height, border-radius 12px
  - Idle state: "Start Fasting" — accent background, white text
  - Active state: "Stop Fasting" — outlined, accent border + text

#### 4. Metabolic Zone Indicator (when fasting)
- Small horizontal bar or chip below the timer card
- Shows current zone name + color dot + description
- Example: 🟢 Anabolic — "Nutrient absorption"

#### 5. Protein Score Card
- Card (`#1C1C1E`, 16px radius)
- **Semicircular gauge** (~180° arc, ~200px wide)
  - Grey background track
  - Orange gradient fill (from left to right, `#F0932C`)
  - Progress: consumed protein / target × 100
- **Score number**: large (36px, white, bold) centered below the arc
- **Label**: "Protein Score" (14px, text.secondary)
- **Detail**: "64g / 128g" (14px, text.secondary)

#### 6. Quick Metrics Row
- Horizontal scrollable row of small metric chips:
  - 💧 Water: "1.5L / 2L"
  - ⚖️ Weight: "78.2 kg (−0.3)"
  - 😊 Mood: emoji
  - 🏃 Exercise: "45 min"
- Each chip: surface background, 12px radius, tappable to edit
- "Not logged" in grey for empty metrics

---

## Screen 2: History (Charts)

### Layout

#### 1. Time Range Selector
- Horizontal pill group at the top: **1W** | 1M | 3M | 6M | 1Y | ALL
- Active pill: accent background, white text
- Inactive: surface background, text.secondary

#### 2. Charts (scrollable, stacked vertically)

Each chart is in a card (`#1C1C1E`, 16px radius):

**Weight Chart** (line)
- Title: "Weight" + total delta badge ("+2.3 kg" green or "−1.5 kg" red)
- Line chart: white line on dark background
- Y axis: kg values
- Smoothed trend line overlay (accent color, dashed)

**Fasting Chart** (bars)
- Title: "Fasting"
- Vertical bars per day, colored by max zone reached
- Dotted horizontal line at goal (e.g., 16h)
- Y axis: hours

**Calories & Protein Chart** (dual line)
- Title: "Nutrition"
- Two lines: calories (white) and protein (accent)
- Horizontal reference lines for targets

**Sleep Chart** (bars + line)
- Title: "Sleep"
- Bars: hours per night (color coded: red <6h, yellow 6-7h, green 7-9h)
- Overlaid line: quality (1-5)

**Mood Chart** (line with dots)
- Title: "Mood"
- Line with emoji-colored dots (1-5 scale)

Chart library: **Recharts** (React-native, responsive).

---

## Screen 3: Me (Profile)

### Layout

#### 1. Profile Header
- Avatar circle (initials or photo, 64px, surface background)
- Name (20px, bold, white)
- Email (14px, text.secondary)
- "Edit Profile" button (text, accent color)

#### 2. Fasting Statistics Card
Grid of stats (2 columns):

| Stat | Example |
|------|---------|
| Current Streak | 🔥 12 days |
| Best Streak | ⭐ 28 days |
| Total Fasts | 156 completed |
| Avg Duration | 16.4h |
| Total Time | 2,340h |
| Completion Rate | 87% |

#### 3. Monthly Calendar
- Month header with < > navigation arrows
- 7-column grid (Mon–Sun)
- Each day cell: small square or circle
  - Green (`#8ADE88`): completed fast
  - Yellow (`#F8BF24`): partial
  - Grey (`#3F3F46`): none
- Current day: white border ring

#### 4. Nutrition Summary Card
- Avg daily calories (this week / this month)
- Avg daily protein (this week / this month)
- Bar comparison vs target

#### 5. Settings Section
- List items: Fasting Goal, Notifications, About, Logout
- Each item: label + chevron right icon
- Dividers between items

---

## Modal / Bottom Sheet: Log Meal

Triggered from the FAB → "Log Meal".

### Layout
- Slides up from bottom (drawer/bottom sheet)
- Handle bar at top (grey pill, 40 × 4px)
- **Tab selector**: Text | Photo | Manual (3 horizontal tabs)

#### Text Tab
- Large text input: "What did you eat?" placeholder
- Submit button below

#### Photo Tab
- Camera preview or gallery picker
- Large upload area with camera icon
- "Take Photo" and "Choose from Gallery" buttons

#### Manual Tab
- Form fields: Description, Calories, Protein (g), Carbs (g), Fat (g)
- All numeric inputs

#### Results View (after AI analysis)
- Shows estimated macros in editable fields:
  - Description (text)
  - Calories (number)
  - Protein (number)
  - Carbs (number)
  - Fat (number)
- "Powered by AI" disclaimer
- Two buttons: "Save" (accent, primary) and "Cancel" (ghost)

---

## Modal / Bottom Sheet: Log Metrics

Triggered from the FAB → "Log Metrics" or tapping a quick metric chip.

### Sections (expandable accordion)

**Water**: +/− buttons around a glass count display. Progress bar below. Goal label.

**Weight**: Single numeric input (kg, 1 decimal). Shows delta vs yesterday.

**Sleep**: Duration slider (0–14h, 0.5 steps) + quality stars (1–5).

**Mood**: 5 emoji buttons in a row: 😞 😕 😐 😊 😄. One-tap select.

**Exercise**: Type text input + duration in minutes.

Auto-saves on change (debounced).

---

## Design Reference

### Based on: Zero Fasting (iOS)
See `documentation/reference/zero-screenshots.md` for detailed visual reference.

Key differences from Zero:
- **Dark mode** (Zero uses light mode) — inverted palette
- **Aeterna branding** (infinity logo, orange accent instead of burgundy)
- **MUI components** (Material Design language, not custom iOS widgets)
- **PhoneFrame on desktop** (Zero is mobile-only)

### Visual Priorities
1. The timer dominates ~60% of the Today screen
2. Protein score is visible without scrolling
3. Clean typography, generous whitespace
4. High-contrast primary action button
5. Cards with subtle elevation (shadow or border)
6. Smooth transitions between metabolic zone colors

---

## Component Catalog

| Component | MUI Base | Customization |
|-----------|----------|---------------|
| Timer Ring | Custom SVG | Circular progress with zone colors |
| Protein Gauge | Custom SVG | Semicircular arc with gradient |
| Bottom Nav | `BottomNavigation` | Dark surface, accent active state |
| FAB | `Fab` | Accent color, Add icon |
| Metric Card | `Card` | Surface bg, expandable |
| Week Dots | Custom | 7 circles with status colors |
| Action Button | `Button` | Full-width, large, accent |
| Chart Cards | `Card` + Recharts | Surface bg, responsive charts |
| Bottom Sheet | `Drawer` (anchor=bottom) | Rounded top corners |
| Stats Grid | `Grid2` | 2-column stat layout |
| Calendar | Custom | Month grid with colored cells |
| Time Range Pills | `ToggleButtonGroup` | Accent active state |
| Profile Header | `Avatar` + `Typography` | Initials, centered |
| Settings List | `List` + `ListItem` | With chevron, dividers |

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| < 640px | Full-screen app, no phone frame, bottom nav with safe-area padding |
| ≥ 640px | App inside 390×844px phone frame, dark backdrop, cosmetic notch |

No tablet-specific layout. Desktop shows the phone frame — the app always looks and feels like a mobile app.

---

## Animations & Transitions

- **Timer ring**: smooth arc growth (CSS transition on stroke-dashoffset)
- **Zone transitions**: color fade when entering a new metabolic zone (~0.5s ease)
- **Page transitions**: subtle slide or fade between tabs (~200ms)
- **Bottom sheet**: slide up with backdrop fade
- **FAB press**: scale pulse (0.95 → 1.0)
- **Metric chips**: expand/collapse with height animation
