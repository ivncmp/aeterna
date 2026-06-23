import { Router } from "express";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.get("/metrics", async (req: AuthRequest, res) => {
  const { date } = req.query;
  if (!date) {
    res.status(400).json({ message: "date query param required" });
    return;
  }
  const { rows } = await pool.query(
    "SELECT * FROM daily_metrics WHERE user_id = $1 AND date = $2",
    [req.userId, date],
  );
  res.json(rows[0] ?? null);
});

router.put("/metrics", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { date, weight_kg, water_ml, sleep_hours, sleep_quality, mood, exercise_type, exercise_minutes, notes } = req.body;

  if (!date) {
    res.status(400).json({ message: "date is required" });
    return;
  }

  const { rows } = await pool.query(
    `INSERT INTO daily_metrics (id, user_id, date, weight_kg, water_ml, sleep_hours, sleep_quality, mood, exercise_type, exercise_minutes, notes)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (user_id, date) DO UPDATE SET
       weight_kg = COALESCE($3, daily_metrics.weight_kg),
       water_ml = COALESCE($4, daily_metrics.water_ml),
       sleep_hours = COALESCE($5, daily_metrics.sleep_hours),
       sleep_quality = COALESCE($6, daily_metrics.sleep_quality),
       mood = COALESCE($7, daily_metrics.mood),
       exercise_type = COALESCE($8, daily_metrics.exercise_type),
       exercise_minutes = COALESCE($9, daily_metrics.exercise_minutes),
       notes = COALESCE($10, daily_metrics.notes),
       updated_at = NOW()
     RETURNING *`,
    [userId, date, weight_kg ?? null, water_ml ?? null, sleep_hours ?? null, sleep_quality ?? null, mood ?? null, exercise_type ?? null, exercise_minutes ?? null, notes ?? null],
  );
  res.json(rows[0]);
});

router.get("/metrics/range", async (req: AuthRequest, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    res.status(400).json({ message: "from and to query params required" });
    return;
  }
  const { rows } = await pool.query(
    "SELECT * FROM daily_metrics WHERE user_id = $1 AND date >= $2 AND date <= $3 ORDER BY date",
    [req.userId, from, to],
  );
  res.json(rows);
});

export { router as metricsRouter };
