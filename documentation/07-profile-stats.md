# Profile & Statistics

"Me" screen — user profile with history and statistics.

## Profile Data

- Name, email
- Age, current weight, height, sex
- Activity level (sedentary / moderate / active / very active)
- Current fasting goal (Xh)
- All fields are editable

## Fasting Statistics

| Metric | Description |
|--------|-------------|
| Current streak | Consecutive days completing the goal |
| Best streak | All-time record |
| Total fasts | Completed vs abandoned |
| Average hours | Weekly and monthly average duration |
| Total time | Accumulated hours fasting |

### Streak Calculation
A day "counts" if there's a COMPLETED fast whose duration >= the user's fasting_goal_hours.
Consecutive days counted backwards from today.

## Monthly Calendar

Month view with each day color-coded:
- **Green** (#8ADE88): fast completed (reached the goal)
- **Yellow** (#F8BF24): partial fast (started but didn't reach the goal)
- **Grey**: no fast that day

Navigation between months with < > arrows.

## Calorie History

- Daily calorie average for the week/month
- Days above/below estimated TDEE

## API

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/stats/fasting | Streaks, totals, averages |
| GET | /api/stats/calendar?month=YYYY-MM | Monthly calendar data |
| GET | /api/stats/nutrition | Calorie/protein averages |
