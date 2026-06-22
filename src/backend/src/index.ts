import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { runMigrations } from "./db/migrate";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", healthRouter);
app.use("/api", authRouter);

const PORT = 3001;

async function start() {
  await runMigrations();
  app.listen(PORT, () => console.log(`Backend listening on :${PORT}`));
}

start().catch(console.error);
