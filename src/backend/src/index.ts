import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { fastsRouter } from "./routes/fasts";
import { mealsRouter } from "./routes/meals";
import { metricsRouter } from "./routes/metrics";
import { nutritionRouter } from "./routes/nutrition";
import { statsRouter } from "./routes/stats";
import { runMigrations } from "./db/migrate";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", healthRouter);
app.use("/api", authRouter);
app.use("/api", fastsRouter);
app.use("/api", mealsRouter);
app.use("/api", metricsRouter);
app.use("/api", nutritionRouter);
app.use("/api", statsRouter);

const PORT = 3001;

async function start() {
  await runMigrations();
  app.listen(PORT, () => console.log(`Backend listening on :${PORT}`));
}

start().catch(console.error);
