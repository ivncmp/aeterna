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
