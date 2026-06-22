# Roadmap: Aeterna — Backend API + Wiring Frontend

## Context

Aeterna tiene el frontend ~90% construido (timer, charts, sheets, profile) pero todo con **mock data**. El backend solo tiene auth (login/me/profile) y health check. Falta construir toda la API (fasts, meals, metrics, stats, nutrition) y conectar los hooks del frontend a endpoints reales. El schema de BD ya existe con las 4 tablas correctas.

**Estrategia**: vertical slices feature-by-feature (no "backend primero"). Cada fase produce un incremento funcional testeable.

---

## Fase 0: Auth Bootstrap (Login Page + Register)

**Objetivo**: Tener un usuario real autenticado para que todas las fases siguientes funcionen.

### Backend
- Añadir `POST /api/auth/register` en `src/backend/src/routes/auth.ts` (mismo patrón que login: bcrypt + JWT 30d)
  - Body: `{ email, password, name, age?, weight_kg?, height_cm?, sex?, activity_level? }`
  - Validar email único (catch pg error 23505), password >= 6 chars
- Añadir `CLAUDE_API_KEY` al bloque environment de backend en `docker-compose.yml`

### Frontend
- Crear `src/spa/src/pages/Login.tsx` — formulario email + password con MUI
- Auth guard en `App.tsx` — si no hay token en localStorage, mostrar Login
- Conectar `useUser()` hook: reemplazar `mockUser()` por `api.get<User>('/auth/me')`
- Refactorizar `Profile.tsx`: mover `mockUser()` de nivel de módulo a dentro del componente usando el hook

### Test
- `docker compose up`, registrar usuario via curl o UI, login, ver datos reales en Profile

---

## Fase 1: Temporizador de Ayuno

**Objetivo**: La pantalla principal funciona end-to-end — start/stop fast, timer real, week strip.

### Backend
- Crear `src/backend/src/routes/fasts.ts`:
  - `POST /api/fasts` — crear ayuno (check no hay otro ACTIVE)
  - `PUT /api/fasts/:id` — completar/abandonar/editar
  - `GET /api/fasts/active` — ayuno activo o null
  - `GET /api/fasts/week` — 7 WeekDay objects con status
  - `GET /api/fasts?from=&to=` — historial con rango
- Registrar router en `src/backend/src/index.ts`

### Frontend
- Conectar hooks en `src/spa/src/hooks/useFasting.ts`:
  - `useActiveFast()` → `api.get('/fasts/active')`
  - `useStartFast()` → `api.post('/fasts', ...)`
  - `useStopFast()` → `api.put('/fasts/' + id, ...)`
  - `useWeekDays()` → `api.get('/fasts/week')`

### Test
- Start fast, timer cuenta desde start_time real en PostgreSQL. Refresh — timer se restaura. Stop. Week strip refleja el día completado.

---

## Fase 2: Métricas Diarias

**Objetivo**: Registrar agua, peso, sueño, mood, ejercicio. MetricsGrid en Today con datos reales.

### Backend
- Crear `src/backend/src/routes/metrics.ts`:
  - `GET /api/metrics?date=YYYY-MM-DD` — métricas del día o null
  - `PUT /api/metrics` — upsert con `ON CONFLICT (user_id, date) DO UPDATE`
  - `GET /api/metrics/range?from=&to=` — rango para charts

### Frontend
- Conectar `useDailyMetrics(date)` → `api.get('/metrics?date=' + d)`
- Crear `useUpsertMetrics()` mutation → `api.put('/metrics', data)`
- Conectar `LogMetricsSheet.tsx` — cada sección (water, weight, sleep, mood, exercise) llama upsert en onChange
- MetricsGrid en Today se actualiza automáticamente (ya consume el hook)

### Test
- Abrir LogMetricsSheet, tap +water, se guarda. Refresh — MetricsGrid muestra valor real.

---

## Fase 3: Registro de Comidas + Claude Vision

**Objetivo**: Registrar comidas por texto, foto o manual. Claude analiza la comida.

### Backend
- Instalar `@anthropic-ai/sdk` en backend
- Crear `src/backend/src/services/claude.ts` — función `analyzeMeal()` con Claude Vision
- Crear `src/backend/src/routes/meals.ts`:
  - `POST /api/meals/analyze` — texto/imagen → macros estimados (no guarda)
  - `POST /api/meals` — guardar comida confirmada
  - `GET /api/meals?date=YYYY-MM-DD` — comidas del día
  - `GET /api/meals?from=&to=` — rango para charts
  - `GET /api/meals/favorites` — favoritos
  - `PUT /api/meals/:id/favorite` — toggle favorito
  - `DELETE /api/meals/:id` — eliminar

### Frontend
- Crear `src/spa/src/hooks/useMeals.ts` con useAnalyzeMeal, useSaveMeal, useMeals, useFavorites, useToggleFavorite, useDeleteMeal
- Conectar `LogMealSheet.tsx` — tab texto/foto/manual con submit real
- Hacer `MealResultView.tsx` editable (recibir props, campos editables)
- Conectar `MealPhotoView.tsx` — cámara/galería via input file

### Test
- Escribir "2 huevos con tostada", ver macros de Claude, editar si quieres, guardar. Foto de comida funciona.

---

## Fase 4: Protein Score

**Objetivo**: ProteinCard en Today muestra score real calculado de meals + perfil.

### Backend
- Crear `src/backend/src/services/nutrition.ts` — `calculateProteinScore()`:
  - target = weight_kg * factor (0.8/1.2/1.6/2.0) con ajuste edad
  - consumed = SUM(protein_g) de meals de hoy
  - score = min(100, consumed/target * 100)
- Crear ruta `GET /api/nutrition/protein-score` (en archivo propio o en meals.ts)

### Frontend
- Conectar `useProteinScore()` → `api.get('/nutrition/protein-score')`
- ProteinCard ya consume este hook — funciona automáticamente

### Test
- Registrar comida con proteína. Refresh Today. Protein Score sube.

---

## Fase 5: Estadísticas + Calendario

**Objetivo**: Profile muestra streaks, stats y calendario mensual con datos reales.

### Backend
- Crear `src/backend/src/routes/stats.ts`:
  - `GET /api/stats/fasting` — current_streak, best_streak, total_fasts, avg_duration_hours, total_hours, completion_rate
  - `GET /api/stats/calendar?month=YYYY-MM` — CalendarDay[] con status por día
  - `GET /api/stats/nutrition` — promedios de calorías/proteína

### Frontend
- Conectar `useFastingStats()` → `api.get('/stats/fasting')`
- Crear `useCalendar(year, month)` → `api.get('/stats/calendar?month=...')`
- Crear `useNutritionStats()` → `api.get('/stats/nutrition')`
- Conectar Profile.tsx y MonthlyCalendar.tsx

### Test
- Completar ayunos varios días. Profile muestra streaks reales. Calendario muestra colores correctos.

---

## Fase 6: Charts con Datos Reales

**Objetivo**: Los 6 charts de History muestran datos reales, no mocks.

### Frontend (endpoints ya existen de fases anteriores)
- Crear `src/spa/src/hooks/useChartData.ts` con hooks para cada serie:
  - useWeightSeries, useFastingSeries, useNutritionSeries, useSleepSeries, useWaterSeries, useMoodSeries
- Conectar History.tsx — reemplazar `mockXxxSeries()` por hooks reales
- Posible: añadir soporte `from/to` en meals endpoint si no existe

### Test
- Registrar métricas varios días. Abrir History, cambiar rangos temporales. Charts muestran datos reales.

---

## Fase 7: PWA + Deploy

### PWA
- Instalar `vite-plugin-pwa` en SPA
- Configurar service worker (network-first API, cache-first static)
- Manifest ya existe — verificar que funciona

### Deploy
- Finalizar docker-compose.prod.yml
- SSL con Let's Encrypt / certbot en nginx
- JWT_SECRET y CLAUDE_API_KEY reales en producción

---

## Grafo de Dependencias

```
Fase 0 (Auth) ──┬── Fase 1 (Fasting) ──┬── Fase 5 (Stats)
                ├── Fase 2 (Metrics) ───┼── Fase 6 (Charts)
                └── Fase 3 (Meals) ─────┤
                    Fase 4 (Protein) ────┘
                                         └── Fase 7 (PWA/Deploy)
```

Fases 1, 2, 3 son paralelas tras Fase 0. Orden recomendado: 1→2→3 porque fasting es la experiencia core.

## Archivos Clave

**Nuevos backend:**
- `src/backend/src/routes/fasts.ts`, `metrics.ts`, `meals.ts`, `stats.ts`
- `src/backend/src/services/claude.ts`, `nutrition.ts`

**Nuevos frontend:**
- `src/spa/src/pages/Login.tsx`
- `src/spa/src/hooks/useMeals.ts`, `useChartData.ts`

**Modificar:**
- `src/backend/src/routes/auth.ts` (register)
- `src/backend/src/index.ts` (registrar routers)
- `src/spa/src/hooks/useFasting.ts` (6 hooks mock→real)
- `src/spa/src/hooks/useMetrics.ts` (mock→real + upsert)
- `src/spa/src/pages/Profile.tsx` (module-level mocks → hooks)
- `src/spa/src/pages/History.tsx` (mock series → hooks)
- `src/spa/src/sheets/LogMealSheet.tsx`, `LogMetricsSheet.tsx` (submit handlers)
