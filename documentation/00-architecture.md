# Architecture

## Overview

Aeterna is a fully Dockerized, self-contained web app. A single `docker compose up` starts the entire stack.

## Project Structure

```
aeterna/
├── docker-compose.yml
├── docker-compose.prod.yml
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── TimerRing.tsx   # Circular SVG ring
│   │   │   ├── ProteinGauge.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   └── WeekDots.tsx    # Weekly calendar dots
│   │   ├── pages/
│   │   │   ├── Today.tsx       # Timer + Protein Score + Quick metrics
│   │   │   ├── History.tsx     # Charts + Calendar
│   │   │   └── Profile.tsx     # Profile + Stats
│   │   ├── hooks/
│   │   │   ├── useTimer.ts     # Timer logic
│   │   │   ├── useAuth.ts
│   │   │   └── useFasts.ts
│   │   ├── lib/
│   │   │   ├── api.ts          # HTTP client
│   │   │   └── zones.ts        # Metabolic zone calculations
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── fasts.ts
│   │   │   ├── meals.ts
│   │   │   ├── metrics.ts
│   │   │   └── stats.ts
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT middleware
│   │   ├── services/
│   │   │   ├── claude.ts       # Claude Vision API
│   │   │   └── nutrition.ts    # Protein score calc
│   │   ├── db/
│   │   │   ├── client.ts       # Connection pool
│   │   │   └── migrations/     # SQL migrations
│   │   └── index.ts
│   └── package.json
└── nginx/
    └── nginx.conf
```

## Docker Services

| Service | Port | Description |
|---------|------|-------------|
| nginx | 80/443 | Reverse proxy, serves static frontend |
| backend | 3001 (internal) | REST API |
| db | 5432 (internal) | PostgreSQL |

## Data Flow

```
Browser → nginx :80
  ├── /* → static frontend (React SPA)
  └── /api/* → proxy_pass → backend :3001
                                └── PostgreSQL :5432
                                └── Claude API (external, meals only)
```

## Environment Variables

```env
# Backend
DATABASE_URL=postgresql://aeterna:secret@db:5432/aeterna
JWT_SECRET=<random-string>
CLAUDE_API_KEY=<anthropic-api-key>

# PostgreSQL
POSTGRES_USER=aeterna
POSTGRES_PASSWORD=secret
POSTGRES_DB=aeterna
```
