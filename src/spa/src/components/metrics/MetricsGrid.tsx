import Box from "@mui/material/Box";
import WaterDropOutlined from "@mui/icons-material/WaterDropOutlined";
import MonitorWeightOutlined from "@mui/icons-material/MonitorWeightOutlined";
import SentimentSatisfiedOutlined from "@mui/icons-material/SentimentSatisfiedOutlined";
import BedtimeOutlined from "@mui/icons-material/BedtimeOutlined";
import { MetricChip } from "@/components/metrics/MetricChip";
import { useDailyMetrics } from "@/hooks/useMetrics";
import { useSheet } from "@/hooks/useSheet";

function formatSleep(hours: number | null): string {
  if (!hours) return "–";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function MetricsGrid() {
  const { openSheet } = useSheet();
  const { data: metrics } = useDailyMetrics();
  const { data: yesterday } = useDailyMetrics(yesterdayISO());

  const waterL = metrics ? (metrics.water_ml / 1000).toFixed(1) : "–";
  const waterTarget = "2L";
  const weight = metrics?.weight_kg?.toFixed(1) ?? "–";
  const weightDelta = metrics?.weight_kg != null && yesterday?.weight_kg != null
    ? Math.round((metrics.weight_kg - yesterday.weight_kg) * 10) / 10
    : null;
  const moodLabels = ["", "Bad", "Meh", "OK", "Good", "Great"];
  const mood = metrics?.mood ? (moodLabels[metrics.mood] ?? "–") : "–";
  const sleep = formatSleep(metrics?.sleep_hours ?? null);
  const qualityLabels = ["", "★", "★★", "★★★", "★★★★", "★★★★★"];
  const sleepSubtitle = metrics?.sleep_quality ? qualityLabels[metrics.sleep_quality] : undefined;

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
      <MetricChip
        icon={<WaterDropOutlined sx={{ fontSize: 18 }} />}
        iconColor="#60A5FA"
        label="WATER"
        value={`${waterL}L`}
        subtitle={`/${waterTarget}`}
        onClick={() => openSheet({ sheet: "log-metrics", section: "water" })}
      />
      <MetricChip
        icon={<MonitorWeightOutlined sx={{ fontSize: 18 }} />}
        iconColor="#A78BFA"
        label="WEIGHT"
        value={`${weight} kg`}
        subtitle={weightDelta != null && weightDelta !== 0 ? `${weightDelta > 0 ? "+" : ""}${weightDelta}` : undefined}
        subtitleColor={weightDelta != null && weightDelta < 0 ? "#8ADE88" : weightDelta != null && weightDelta > 0 ? "#EF4444" : undefined}
        onClick={() => openSheet({ sheet: "log-metrics", section: "weight" })}
      />
      <MetricChip
        icon={<SentimentSatisfiedOutlined sx={{ fontSize: 18 }} />}
        iconColor="#FBBF24"
        label="MOOD"
        value={mood}
        onClick={() => openSheet({ sheet: "log-metrics", section: "mood" })}
      />
      <MetricChip
        icon={<BedtimeOutlined sx={{ fontSize: 18 }} />}
        iconColor="#A78BFA"
        label="SLEEP"
        value={sleep}
        subtitle={sleepSubtitle}
        onClick={() => openSheet({ sheet: "log-metrics", section: "sleep" })}
      />
    </Box>
  );
}
