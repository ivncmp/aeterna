import Box from "@mui/material/Box";
import WaterDropOutlined from "@mui/icons-material/WaterDropOutlined";
import MonitorWeightOutlined from "@mui/icons-material/MonitorWeightOutlined";
import SentimentSatisfiedOutlined from "@mui/icons-material/SentimentSatisfiedOutlined";
import DirectionsRunOutlined from "@mui/icons-material/DirectionsRunOutlined";
import { MetricChip } from "@/components/metrics/MetricChip";
import { useDailyMetrics } from "@/hooks/useMetrics";

export function MetricsGrid() {
  const { data: metrics } = useDailyMetrics();

  const waterL = metrics ? (metrics.water_ml / 1000).toFixed(1) : "–";
  const waterTarget = "2L";
  const weight = metrics?.weight_kg?.toFixed(1) ?? "–";
  const moodLabels = ["", "Bad", "Meh", "OK", "Good", "Great"];
  const mood = metrics?.mood ? (moodLabels[metrics.mood] ?? "–") : "–";
  const exercise = metrics?.exercise_minutes?.toString() ?? "–";

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
      <MetricChip
        icon={<WaterDropOutlined sx={{ fontSize: 18 }} />}
        iconColor="#60A5FA"
        label="WATER"
        value={`${waterL}L`}
        subtitle={`/${waterTarget}`}
      />
      <MetricChip
        icon={<MonitorWeightOutlined sx={{ fontSize: 18 }} />}
        iconColor="#A78BFA"
        label="WEIGHT"
        value={`${weight} kg`}
        subtitle="−0.3"
        subtitleColor="#8ADE88"
      />
      <MetricChip
        icon={<SentimentSatisfiedOutlined sx={{ fontSize: 18 }} />}
        iconColor="#FBBF24"
        label="MOOD"
        value={mood}
      />
      <MetricChip
        icon={<DirectionsRunOutlined sx={{ fontSize: 18 }} />}
        iconColor="#34D399"
        label="MOVE"
        value={`${exercise} min`}
      />
    </Box>
  );
}
