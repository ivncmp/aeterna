import fs from "fs";
import path from "path";
import { pool } from "./client";

const MIGRATIONS_DIR =
  process.env.MIGRATIONS_PATH || path.join(__dirname, "../../../database/migrations");

export async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT now()
    )
  `);

  const dir = path.resolve(MIGRATIONS_DIR);
  if (!fs.existsSync(dir)) {
    console.log(`Migrations dir not found: ${dir}`);
    return;
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const { rows } = await pool.query("SELECT 1 FROM _migrations WHERE name = $1", [file]);
    if (rows.length > 0) continue;

    const sql = fs.readFileSync(path.join(dir, file), "utf-8");
    await pool.query(sql);
    await pool.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
    console.log(`Migration applied: ${file}`);
  }
}
