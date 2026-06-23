import { pool } from "../db/client";

const ACTIVITY_FACTORS: Record<string, number> = {
  sedentary: 0.8,
  moderate: 1.2,
  active: 1.6,
  very_active: 2.0,
};

interface ProteinScoreResult {
  score: number;
  consumed_g: number;
  target_g: number;
}

export function calculateTargetProtein(weightKg: number, activityLevel: string, age: number | null): number {
  const factor = ACTIVITY_FACTORS[activityLevel] ?? 1.2;
  let target = weightKg * factor;

  if (age !== null) {
    if (age >= 65) target *= 1.2;
    else if (age >= 50) target *= 1.1;
  }

  return Math.round(target);
}

export async function getProteinScore(userId: string): Promise<ProteinScoreResult> {
  const { rows: userRows } = await pool.query(
    "SELECT weight_kg, activity_level, age FROM users WHERE id = $1",
    [userId],
  );

  const user = userRows[0];
  if (!user?.weight_kg) {
    return { score: 0, consumed_g: 0, target_g: 0 };
  }

  const target_g = calculateTargetProtein(user.weight_kg, user.activity_level, user.age);

  const { rows } = await pool.query(
    "SELECT COALESCE(SUM(protein_g), 0) AS total FROM meals WHERE user_id = $1 AND logged_at::date = CURRENT_DATE",
    [userId],
  );

  const consumed_g = Math.round(Number(rows[0].total));
  const score = Math.min(100, Math.round((consumed_g / target_g) * 100));

  return { score, consumed_g, target_g };
}
