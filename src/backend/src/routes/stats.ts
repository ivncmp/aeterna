import { Router } from "express";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { calculateTargetProtein } from "../services/nutrition";

const router = Router();
router.use(requireAuth);

router.get("/stats/fasting", async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const { rows: userRows } = await pool.query(
    "SELECT fasting_goal_hours FROM users WHERE id = $1",
    [userId],
  );
  const goalHours = userRows[0]?.fasting_goal_hours ?? 16;

  const { rows: fasts } = await pool.query(
    `SELECT status, start_time, end_time,
            EXTRACT(EPOCH FROM (end_time - start_time)) / 3600 AS duration_hours
     FROM fasts WHERE user_id = $1 AND status IN ('COMPLETED', 'ABANDONED') ORDER BY start_time`,
    [userId],
  );

  const completed = fasts.filter((f: { status: string }) => f.status === "COMPLETED");
  const total_fasts = completed.length;

  if (total_fasts === 0) {
    res.json({ current_streak: 0, best_streak: 0, total_fasts: 0, avg_duration_hours: 0, total_hours: 0, completion_rate: 0 });
    return;
  }

  const total_hours = Math.round(completed.reduce((sum: number, f: { duration_hours: number }) => sum + f.duration_hours, 0) * 10) / 10;
  const avg_duration_hours = Math.round((total_hours / total_fasts) * 10) / 10;
  const completion_rate = Math.round((total_fasts / fasts.length) * 1000) / 10;

  const dateSet = new Set<string>();
  for (const f of completed) {
    if (f.duration_hours >= goalHours) {
      dateSet.add(new Date(f.start_time).toISOString().slice(0, 10));
    }
  }
  const dates = Array.from(dateSet).sort().reverse();

  let current_streak = 0;
  const today = new Date();
  const checkDate = new Date(today);
  for (let i = 0; i < 1000; i++) {
    const iso = checkDate.toISOString().slice(0, 10);
    if (dates.includes(iso)) {
      current_streak++;
    } else if (i > 0) {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  let best_streak = 0;
  let streak = 0;
  const allDates = Array.from(dateSet).sort();
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const prev = new Date(allDates[i - 1]!);
      const curr = new Date(allDates[i]!);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      streak = diff === 1 ? streak + 1 : 1;
    }
    best_streak = Math.max(best_streak, streak);
  }

  res.json({ current_streak, best_streak, total_fasts, avg_duration_hours, total_hours, completion_rate });
});

router.get("/stats/calendar", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const month = req.query.month as string;
  if (!month) {
    res.status(400).json({ message: "month query param required (YYYY-MM)" });
    return;
  }

  const { rows: userRows } = await pool.query(
    "SELECT fasting_goal_hours FROM users WHERE id = $1",
    [userId],
  );
  const goalHours = userRows[0]?.fasting_goal_hours ?? 16;

  const [year, mon] = month.split("-").map(Number);
  const monthStart = new Date(year!, mon! - 1, 1);
  const nextMonth = new Date(year!, mon!, 1);
  const daysInMonth = new Date(year!, mon!, 0).getDate();

  const { rows: fasts } = await pool.query(
    `SELECT start_time, status,
            EXTRACT(EPOCH FROM (COALESCE(end_time, NOW()) - start_time)) / 3600 AS duration_hours
     FROM fasts WHERE user_id = $1 AND start_time >= $2 AND start_time < $3`,
    [userId, monthStart.toISOString(), nextMonth.toISOString()],
  );

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const iso = `${month}-${String(day).padStart(2, "0")}`;
    const dayFasts = fasts.filter(
      (f: { start_time: string }) => new Date(f.start_time).toISOString().slice(0, 10) === iso,
    );

    let status: "completed" | "partial" | "none" = "none";
    if (dayFasts.some((f: { status: string; duration_hours: number }) => f.status === "COMPLETED" && f.duration_hours >= goalHours)) {
      status = "completed";
    } else if (dayFasts.length > 0) {
      status = "partial";
    }

    return { date: iso, day, status };
  });

  res.json(days);
});

router.get("/stats/nutrition", async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const { rows: userRows } = await pool.query(
    "SELECT weight_kg, activity_level, age FROM users WHERE id = $1",
    [userId],
  );
  const user = userRows[0];
  const target_protein = user?.weight_kg ? calculateTargetProtein(user.weight_kg, user.activity_level, user.age) : 128;

  const { rows: avg7 } = await pool.query(
    `SELECT COALESCE(AVG(daily_cal), 0) AS avg_cal, COALESCE(AVG(daily_prot), 0) AS avg_prot
     FROM (
       SELECT logged_at::date, SUM(calories) AS daily_cal, SUM(protein_g) AS daily_prot
       FROM meals WHERE user_id = $1 AND logged_at >= CURRENT_DATE - 7
       GROUP BY logged_at::date
     ) t`,
    [userId],
  );

  const { rows: avg30 } = await pool.query(
    `SELECT COALESCE(AVG(daily_cal), 0) AS avg_cal, COALESCE(AVG(daily_prot), 0) AS avg_prot
     FROM (
       SELECT logged_at::date, SUM(calories) AS daily_cal, SUM(protein_g) AS daily_prot
       FROM meals WHERE user_id = $1 AND logged_at >= CURRENT_DATE - 30
       GROUP BY logged_at::date
     ) t`,
    [userId],
  );

  res.json({
    avg_calories_7d: Math.round(Number(avg7[0].avg_cal)),
    avg_calories_30d: Math.round(Number(avg30[0].avg_cal)),
    avg_protein_7d: Math.round(Number(avg7[0].avg_prot)),
    avg_protein_30d: Math.round(Number(avg30[0].avg_prot)),
    target_calories: 2000,
    target_protein,
  });
});

export { router as statsRouter };
