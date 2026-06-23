import { Router } from "express";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { analyzeMeal } from "../services/claude";

const router = Router();
router.use(requireAuth);

router.post("/meals/analyze", async (req: AuthRequest, res) => {
  const { text, image_base64, media_type } = req.body;

  if (!text && !image_base64) {
    res.status(400).json({ message: "text or image_base64 required" });
    return;
  }

  try {
    const analysis = await analyzeMeal({
      text,
      imageBase64: image_base64,
      mediaType: media_type,
    });
    res.json(analysis);
  } catch (err) {
    console.error("Claude analysis error:", err);
    res.status(502).json({ message: "Failed to analyze meal" });
  }
});

router.post("/meals", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { description, calories, protein_g, carbs_g, fat_g, source, photo_url, logged_at, llm_raw_response } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO meals (id, user_id, description, calories, protein_g, carbs_g, fat_g, source, photo_url, logged_at, llm_raw_response)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, NOW()), $10)
     RETURNING *`,
    [userId, description, calories, protein_g, carbs_g, fat_g, source ?? "MANUAL", photo_url ?? null, logged_at ?? null, llm_raw_response ? JSON.stringify(llm_raw_response) : null],
  );
  res.status(201).json(rows[0]);
});

router.get("/meals", async (req: AuthRequest, res) => {
  const { date, from, to } = req.query;
  const params: unknown[] = [req.userId];
  let where = "user_id = $1";

  if (date) {
    params.push(date);
    where += ` AND logged_at::date = $${params.length}`;
  } else {
    if (from) {
      params.push(from);
      where += ` AND logged_at::date >= $${params.length}`;
    }
    if (to) {
      params.push(to);
      where += ` AND logged_at::date <= $${params.length}`;
    }
  }

  const { rows } = await pool.query(
    `SELECT * FROM meals WHERE ${where} ORDER BY logged_at`,
    params,
  );
  res.json(rows);
});

router.get("/meals/favorites", async (req: AuthRequest, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM meals WHERE user_id = $1 AND is_favorite = true ORDER BY logged_at DESC LIMIT 20",
    [req.userId],
  );
  res.json(rows);
});

router.put("/meals/:id/favorite", async (req: AuthRequest, res) => {
  const { rows } = await pool.query(
    "UPDATE meals SET is_favorite = NOT is_favorite WHERE id = $1 AND user_id = $2 RETURNING *",
    [req.params.id, req.userId],
  );
  if (rows.length === 0) {
    res.status(404).json({ message: "Meal not found" });
    return;
  }
  res.json(rows[0]);
});

router.delete("/meals/:id", async (req: AuthRequest, res) => {
  const { rowCount } = await pool.query(
    "DELETE FROM meals WHERE id = $1 AND user_id = $2",
    [req.params.id, req.userId],
  );
  if (rowCount === 0) {
    res.status(404).json({ message: "Meal not found" });
    return;
  }
  res.status(204).send();
});

export { router as mealsRouter };
