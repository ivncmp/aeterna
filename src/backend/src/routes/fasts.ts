import { Router } from "express";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.post("/fasts", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { target_duration_minutes } = req.body;

  const { rows: active } = await pool.query(
    "SELECT id FROM fasts WHERE user_id = $1 AND status = 'ACTIVE' LIMIT 1",
    [userId],
  );
  if (active.length > 0) {
    res.status(409).json({ message: "Already have an active fast" });
    return;
  }

  let target = target_duration_minutes;
  if (!target) {
    const { rows: userRows } = await pool.query(
      "SELECT fasting_goal_hours FROM users WHERE id = $1",
      [userId],
    );
    target = (userRows[0]?.fasting_goal_hours ?? 16) * 60;
  }

  const { rows } = await pool.query(
    `INSERT INTO fasts (id, user_id, start_time, target_duration_minutes, status)
     VALUES (gen_random_uuid(), $1, NOW(), $2, 'ACTIVE')
     RETURNING *`,
    [userId, target],
  );
  res.status(201).json(rows[0]);
});

router.put("/fasts/:id", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { end_time, status, start_time, mood_rating, notes } = req.body;

  const { rows: existing } = await pool.query(
    "SELECT * FROM fasts WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
  if (existing.length === 0) {
    res.status(404).json({ message: "Fast not found" });
    return;
  }

  const sets: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (start_time !== undefined) {
    sets.push(`start_time = $${idx++}`);
    params.push(start_time);
  }
  if (status !== undefined) {
    sets.push(`status = $${idx++}`);
    params.push(status);
  }
  if (mood_rating !== undefined) {
    sets.push(`mood_rating = $${idx++}`);
    params.push(mood_rating);
  }
  if (notes !== undefined) {
    sets.push(`notes = $${idx++}`);
    params.push(notes);
  }

  if (status === "COMPLETED" || status === "ABANDONED") {
    sets.push(`end_time = $${idx++}`);
    params.push(end_time ?? new Date().toISOString());
  } else if (end_time !== undefined) {
    sets.push(`end_time = $${idx++}`);
    params.push(end_time);
  }

  if (sets.length === 0) {
    res.json(existing[0]);
    return;
  }

  params.push(id, userId);
  const { rows } = await pool.query(
    `UPDATE fasts SET ${sets.join(", ")} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
    params,
  );
  res.json(rows[0]);
});

router.get("/fasts/active", async (req: AuthRequest, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM fasts WHERE user_id = $1 AND status = 'ACTIVE' ORDER BY start_time DESC LIMIT 1",
    [req.userId],
  );
  res.json(rows[0] ?? null);
});

router.get("/fasts/week", async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const { rows: userRows } = await pool.query(
    "SELECT fasting_goal_hours FROM users WHERE id = $1",
    [userId],
  );
  const goalHours = userRows[0]?.fasting_goal_hours ?? 16;

  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const { rows: fasts } = await pool.query(
    `SELECT start_time, end_time, status,
            EXTRACT(EPOCH FROM (COALESCE(end_time, NOW()) - start_time)) / 3600 AS duration_hours
     FROM fasts
     WHERE user_id = $1 AND start_time >= $2 AND start_time <= $3`,
    [userId, monday.toISOString(), sunday.toISOString()],
  );

  const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayFasts = fasts.filter(
      (f: { start_time: string }) => new Date(f.start_time).toISOString().slice(0, 10) === iso,
    );

    let status: "completed" | "partial" | "none" = "none";
    if (dayFasts.some((f: { status: string; duration_hours: number }) => f.status === "COMPLETED" && f.duration_hours >= goalHours)) {
      status = "completed";
    } else if (dayFasts.length > 0) {
      status = "partial";
    }

    return { date: iso, label: DAY_LABELS[d.getDay()]!, status };
  });

  res.json(days);
});

router.get("/fasts", async (req: AuthRequest, res) => {
  const { from, to } = req.query;
  const params: unknown[] = [req.userId];
  let where = "user_id = $1";

  if (from) {
    params.push(from);
    where += ` AND start_time >= $${params.length}`;
  }
  if (to) {
    const toEnd = String(to).length === 10 ? `${to}T23:59:59.999Z` : to;
    params.push(toEnd);
    where += ` AND start_time <= $${params.length}`;
  }

  const { rows } = await pool.query(
    `SELECT * FROM fasts WHERE ${where} ORDER BY start_time DESC`,
    params,
  );
  res.json(rows);
});

export { router as fastsRouter };
