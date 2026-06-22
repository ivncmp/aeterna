# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Aeterna is a fasting tracker web app (personal Zero Fasting clone) for Ivan, family, and friends. Fully Dockerized, self-hosted, $0 infrastructure cost. The entire stack runs with `docker compose up`.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + MUI (PWA, mobile-first, dark mode)
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 16
- **Infra**: Docker Compose with nginx reverse proxy
- **AI**: Claude Vision API for meal photo recognition
- **Code quality**: ESLint + Prettier

## Commands

```bash
# Start everything (dev, Docker)
docker compose up
# or
./scripts/dev.sh

# Start locally (without Docker)
npm run dev:spa       # Frontend on :5173
npm run dev:back      # Backend on :3001

# Lint & format
npm run lint          # ESLint check (both spa + backend)
npm run lint:fix      # ESLint autofix
npm run format        # Prettier check
npm run format:fix    # Prettier write

# Build
npm run build:spa     # Frontend production build
npm run build:back    # Backend TypeScript compile

# DB migrations
npm run migrate       # Run migrations (backend)

# Production
docker compose -f docker-compose.prod.yml up -d

# Reset DB (destroys data)
./scripts/reset-db.sh
```

## Architecture

```
Browser → nginx :80
  ├── /*      → frontend static (React SPA)
  └── /api/*  → proxy_pass → backend :3001
                                └── PostgreSQL :5432
                                └── Claude API (external, meals only)
```

Four Docker services: `nginx` (reverse proxy), `spa` (Vite dev server), `backend` (Express API, port 3001), `db` (PostgreSQL, port 5432).

### Project Structure

```
aeterna/
├── docker-compose.yml          # Dev compose
├── docker-compose.prod.yml     # Production compose
├── package.json                # Root scripts (orchestration)
├── .env.example
├── assets/                     # Logo, favicons
├── documentation/              # Feature specs, design handoff
├── scripts/                    # Shell helpers (dev.sh, reset-db.sh)
└── src/
    ├── spa/                    # React + Vite + MUI frontend
    │   └── src/
    │       ├── layouts/        # PhoneFrame, AppLayout
    │       ├── components/     # BottomNav, FAB
    │       ├── pages/          # Today, History, Profile
    │       └── lib/            # api.ts HTTP client
    ├── backend/                # Node.js + Express API
    │   └── src/
    │       ├── routes/         # auth, fasts, meals, metrics, stats
    │       ├── services/       # claude.ts, nutrition.ts
    │       ├── middleware/     # JWT auth
    │       └── db/             # Pool + migration runner
    ├── database/               # SQL migrations and seeds
    │   └── migrations/
    └── infrastructure/         # Docker + nginx configs
        ├── docker/
        └── nginx/
```

### Frontend structure

- `layouts/`: PhoneFrame (fake iPhone wrapper on desktop), AppLayout (frame + nav + FAB)
- `pages/`: Today (timer + protein + metrics), History (charts + calendar), Profile (stats + settings)
- `components/`: BottomNav (MUI BottomNavigation), FAB (MUI Fab)
- `lib/`: api.ts (HTTP client with JWT)

Bottom tab navigation (3 tabs). FAB "+" button for adding meals and metrics.

### Backend structure

- `routes/`: auth (login only), fasts, meals, metrics, stats
- `services/`: claude.ts (Vision API), nutrition.ts (protein score calc)
- `middleware/`: JWT auth (protects all `/api/*` except login)
- `db/`: connection pool + migration runner (reads from `src/database/migrations/`)

### Database

4 tables: `users`, `fasts`, `meals`, `daily_metrics`. All keyed by UUID. `daily_metrics` uses upsert on `(user_id, date)`. Users are added directly via SQL — no registration endpoint.

## Auth

Simple JWT auth — no OAuth, no refresh tokens, no registration. 30-day expiration. bcrypt for passwords. Token in `Authorization: Bearer <token>` header, stored in localStorage. Users added to DB manually.

## Design

Dark mode only. Background `#09090B`, surface `#1C1C1E`, accent orange `#F0932C`. Timer uses metabolic zone colors: green (anabolic) → amber (catabolic) → orange (fat burning) → red (autophagy). Mobile-first — on desktop (≥640px) the app renders inside a fake iPhone frame (390×844px). Timer text uses monospace tabular nums.

UI library: MUI with custom dark theme. No TailwindCSS.

## Environment Variables

```
DATABASE_URL=postgresql://aeterna:secret@db:5432/aeterna
JWT_SECRET=<random-string>
CLAUDE_API_KEY=<anthropic-api-key>
POSTGRES_USER=aeterna
POSTGRES_PASSWORD=secret
POSTGRES_DB=aeterna
```

## Documentation

Detailed specs for each feature live in [`documentation/index.md`](documentation/index.md). Consult them before implementing a feature — they contain exact endpoints, calculations, and UI specs.

| Doc | Topic |
|-----|-------|
| [00-architecture](documentation/00-architecture.md) | Project structure, Docker services, data flow |
| [01-db-schema](documentation/01-db-schema.md) | PostgreSQL tables and relationships |
| [02-auth](documentation/02-auth.md) | JWT auth endpoints and flow |
| [03-fasting-timer](documentation/03-fasting-timer.md) | Timer UI, metabolic zones, API |
| [04-protein-score](documentation/04-protein-score.md) | Target calculation, gauge UI |
| [05-meal-logging](documentation/05-meal-logging.md) | Claude Vision integration, favorites |
| [06-daily-metrics](documentation/06-daily-metrics.md) | Water, weight, sleep, mood, exercise |
| [07-profile-stats](documentation/07-profile-stats.md) | Streaks, calendar, statistics |
| [08-progression-charts](documentation/08-progression-charts.md) | Recharts visualizations |
| [09-ui-design](documentation/09-ui-design.md) | Colors, typography, components, responsive |
| [10-pwa-deploy](documentation/10-pwa-deploy.md) | PWA, Docker production, SSL |
| [design-handoff](documentation/design-handoff.md) | Comprehensive design brief for Figma |
| [backlog](documentation/backlog.md) | Prioritized task list (P0/P1/P2) |
