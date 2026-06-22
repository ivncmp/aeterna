# Aeterna

Fasting tracker app — sovereign clone of Zero Fasting. Personal tool for Ivan, family, and friends.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite + TailwindCSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| Infra | Docker Compose (fully self-contained) |
| LLM | Claude Vision API (meal recognition) |

## Architecture

Everything runs with a single `docker compose up`:
- **nginx** — reverse proxy, serves static frontend and proxies `/api/*` to the backend
- **frontend** — React SPA built with Vite
- **backend** — REST API in Node.js/Express
- **db** — PostgreSQL with persistent volume

## Principles

- **$0 fixed cost** — no cloud servers, runs on own web server
- **Offline-first mentality** — timer runs in frontend, DB is local
- **Mobile-first** — designed for mobile use via browser (PWA)
- **Dark mode** — by default, like Zero
- **Non-commercial** — personal use, no telemetry, no ads

## Features

1. **Fasting Timer** — circular ring with metabolic zones (Anabolic → Catabolic → Fat Burning → Autophagy)
2. **Protein Score** — gauge calculated from age, weight, activity, and protein consumed
3. **Meal Logging** — free text or photo → Claude Vision extracts calories and macros
4. **Daily Metrics** — water, weight, sleep, mood, exercise
5. **Profile & Stats** — streaks, monthly calendar, totals
6. **Progression Charts** — weight, fasting, calories, sleep, mood over time
7. **PWA** — installable on mobile as a native-like app

## Documentation

Detailed specs for each feature live in [docs/](docs/index.md).

## Quick Start

```bash
docker compose up
```

Frontend: http://localhost
API: http://localhost/api/health
