import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

export const authRouter = Router();

authRouter.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password required" });
    return;
  }

  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (rows.length === 0) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});

authRouter.post("/auth/register", async (req, res) => {
  const { email, password, name, age, weight_kg, height_cm, sex, activity_level, fasting_goal_hours } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: "Email, password, and name are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, password_hash, name, age, weight_kg, height_cm, sex, activity_level, fasting_goal_hours)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [email, hash, name, age ?? null, weight_kg ?? null, height_cm ?? null, sex ?? null, activity_level ?? "moderate", fasting_goal_hours ?? 16],
    );

    const user = rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "23505") {
      res.status(409).json({ message: "Email already registered" });
      return;
    }
    throw err;
  }
});

authRouter.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  const { rows } = await pool.query(
    "SELECT id, email, name, age, weight_kg, height_cm, sex, activity_level, fasting_goal_hours, created_at FROM users WHERE id = $1",
    [req.userId],
  );
  if (rows.length === 0) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(rows[0]);
});

authRouter.put("/auth/profile", requireAuth, async (req: AuthRequest, res) => {
  const { name, age, weight_kg, height_cm, sex, activity_level, fasting_goal_hours } = req.body;
  const { rows } = await pool.query(
    `UPDATE users SET
      name = COALESCE($1, name),
      age = COALESCE($2, age),
      weight_kg = COALESCE($3, weight_kg),
      height_cm = COALESCE($4, height_cm),
      sex = COALESCE($5, sex),
      activity_level = COALESCE($6, activity_level),
      fasting_goal_hours = COALESCE($7, fasting_goal_hours),
      updated_at = now()
    WHERE id = $8
    RETURNING id, email, name, age, weight_kg, height_cm, sex, activity_level, fasting_goal_hours`,
    [name, age, weight_kg, height_cm, sex, activity_level, fasting_goal_hours, req.userId],
  );
  res.json(rows[0]);
});
