import { useState, useCallback, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Rating from "@mui/material/Rating";
import RemoveOutlined from "@mui/icons-material/RemoveOutlined";
import AddOutlined from "@mui/icons-material/AddOutlined";
import WaterDropOutlined from "@mui/icons-material/WaterDropOutlined";
import MonitorWeightOutlined from "@mui/icons-material/MonitorWeightOutlined";
import BedtimeOutlined from "@mui/icons-material/BedtimeOutlined";
import SentimentSatisfiedOutlined from "@mui/icons-material/SentimentSatisfiedOutlined";
import FitnessCenterOutlined from "@mui/icons-material/FitnessCenterOutlined";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { CollapsibleItem } from "@/components/shared/CollapsibleItem";
import { WaterContent } from "@/components/shared/WaterContent";
import { useTheme } from "@mui/material/styles";
import { useSheet } from "@/hooks/useSheet";
import { useDailyMetrics, useUpsertMetrics } from "@/hooks/useMetrics";
import { useUser } from "@/hooks/useUser";

const MOOD_LABELS = ["", "\u{1F61E}", "\u{1F615}", "\u{1F610}", "\u{1F60A}", "\u{1F604}"];

function formatWater(ml: number | null): string {
  if (!ml) return "0 L";
  return `${(ml / 1000).toFixed(1)} L`;
}

function formatSleep(hours: number | null): string {
  if (!hours) return "—";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function LogMetricsSheet() {
  const { tokens } = useTheme();
  const { sheetState, closeSheet } = useSheet();
  const isOpen = sheetState.sheet === "log-metrics";
  const initialSection = sheetState.sheet === "log-metrics" ? sheetState.section ?? "water" : "water";
  const [expanded, setExpanded] = useState(initialSection);
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevOpenRef.current && sheetState.sheet === "log-metrics") {
      setExpanded(sheetState.section ?? "water");
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, sheetState]);

  const today = new Date().toISOString().slice(0, 10);
  const { data: metrics } = useDailyMetrics(today);
  const { data: user } = useUser();
  const upsert = useUpsertMetrics();

  const baseWeight = metrics?.weight_kg ?? user?.weight_kg ?? 75;
  const [localWeight, setLocalWeight] = useState(baseWeight);
  const weightInitRef = useRef(false);
  useEffect(() => {
    if (metrics?.weight_kg != null && !weightInitRef.current) {
      setLocalWeight(metrics.weight_kg);
      weightInitRef.current = true;
    }
  }, [metrics?.weight_kg]);

  const [localSleep, setLocalSleep] = useState(metrics?.sleep_hours ?? 0);
  const sleepInitRef = useRef(false);
  useEffect(() => {
    if (metrics?.sleep_hours != null && !sleepInitRef.current) {
      setLocalSleep(metrics.sleep_hours);
      sleepInitRef.current = true;
    }
  }, [metrics?.sleep_hours]);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const save = useCallback((fields: Record<string, unknown>) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      upsert.mutate({ date: today, ...fields });
    }, 500);
  }, [today, upsert]);

  const saveImmediate = useCallback((fields: Record<string, unknown>) => {
    upsert.mutate({ date: today, ...fields });
  }, [today, upsert]);

  const weightDebounceRef = useRef<ReturnType<typeof setTimeout>>();
  const saveWeight = useCallback((kg: number) => {
    const rounded = Math.round(kg * 10) / 10;
    setLocalWeight(rounded);
    clearTimeout(weightDebounceRef.current);
    weightDebounceRef.current = setTimeout(() => {
      upsert.mutate({ date: today, weight_kg: rounded });
    }, 400);
  }, [today, upsert]);

  const sleepDebounceRef = useRef<ReturnType<typeof setTimeout>>();
  const saveSleep = useCallback((hours: number) => {
    const rounded = Math.round(hours * 2) / 2;
    setLocalSleep(rounded);
    clearTimeout(sleepDebounceRef.current);
    sleepDebounceRef.current = setTimeout(() => {
      upsert.mutate({ date: today, sleep_hours: rounded || null });
    }, 400);
  }, [today, upsert]);

  const toggle = (key: string) =>
    setExpanded((prev) => (prev === key ? "" : key));

  return (
    <BottomSheet open={isOpen} onClose={closeSheet} title="Log Metrics">
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <CollapsibleItem
          icon={<WaterDropOutlined sx={{ fontSize: 18 }} />}
          label="Water"
          value={formatWater(metrics?.water_ml ?? 0)}
          expanded={expanded === "water"}
          onToggle={() => toggle("water")}
        >
          <WaterContent
            waterMl={metrics?.water_ml ?? 0}
            onChange={(ml) => saveImmediate({ water_ml: ml })}
          />
        </CollapsibleItem>

        <CollapsibleItem
          icon={<MonitorWeightOutlined sx={{ fontSize: 18 }} />}
          label="Weight"
          value={metrics?.weight_kg ? `${metrics.weight_kg} kg` : "—"}
          expanded={expanded === "weight"}
          onToggle={() => toggle("weight")}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "26px",
                my: "16px",
              }}
            >
              <Box
                component="button"
                onClick={() => saveWeight(Math.max(0, localWeight - 0.1))}
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  bgcolor: "transparent",
                  border: (t) => `1.5px solid ${t.tokens.track}`,
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <RemoveOutlined sx={{ fontSize: 20 }} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                <Box component="span" sx={{ font: "700 30px Inter", color: "text.primary", lineHeight: 1 }}>
                  {localWeight.toFixed(1)}{" "}
                  <Box component="span" sx={{ fontSize: 16, fontWeight: 600, color: "text.secondary" }}>
                    kg
                  </Box>
                </Box>
              </Box>
              <Box
                component="button"
                onClick={() => saveWeight(Math.min(120, localWeight + 0.1))}
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 5px 14px color-mix(in srgb, #F0932C 40%, transparent)",
                }}
              >
                <AddOutlined sx={{ fontSize: 20 }} />
              </Box>
            </Box>
            <Slider
              min={0}
              max={120}
              step={0.1}
              value={localWeight}
              onChange={(_, v) => saveWeight(v as number)}
              sx={{ color: "primary.main", mx: 1 }}
            />
          </Box>
        </CollapsibleItem>

        <CollapsibleItem
          icon={<BedtimeOutlined sx={{ fontSize: 18 }} />}
          label="Sleep"
          value={formatSleep(metrics?.sleep_hours ?? null)}
          expanded={expanded === "sleep"}
          onToggle={() => toggle("sleep")}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "26px",
                my: "16px",
              }}
            >
              <Box
                component="button"
                onClick={() => saveSleep(Math.max(0, localSleep - 0.5))}
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  bgcolor: "transparent",
                  border: (t) => `1.5px solid ${t.tokens.track}`,
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <RemoveOutlined sx={{ fontSize: 20 }} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                <Box component="span" sx={{ font: "700 30px Inter", color: "text.primary", lineHeight: 1 }}>
                  {localSleep.toFixed(1)}{" "}
                  <Box component="span" sx={{ fontSize: 16, fontWeight: 600, color: "text.secondary" }}>
                    h
                  </Box>
                </Box>
              </Box>
              <Box
                component="button"
                onClick={() => saveSleep(Math.min(14, localSleep + 0.5))}
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 5px 14px color-mix(in srgb, #F0932C 40%, transparent)",
                }}
              >
                <AddOutlined sx={{ fontSize: 20 }} />
              </Box>
            </Box>
            <Slider
              min={0}
              max={14}
              step={0.5}
              value={localSleep}
              onChange={(_, v) => saveSleep(v as number)}
              sx={{ color: "primary.main", mx: 1 }}
            />
            <Box sx={{ font: "500 13px Inter", color: "text.secondary", mt: 2, mb: 1, textAlign: "center" }}>
              Quality
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Rating
                value={metrics?.sleep_quality ?? 0}
                onChange={(_, v) => saveImmediate({ sleep_quality: v })}
                size="large"
              />
            </Box>
          </Box>
        </CollapsibleItem>

        <CollapsibleItem
          icon={<SentimentSatisfiedOutlined sx={{ fontSize: 18 }} />}
          label="Mood"
          value={metrics?.mood ? MOOD_LABELS[metrics.mood] ?? "—" : "—"}
          expanded={expanded === "mood"}
          onToggle={() => toggle("mood")}
        >
          <Box sx={{ display: "flex", justifyContent: "center", gap: "12px", py: 2 }}>
            {[1, 2, 3, 4, 5].map((v) => (
              <Box
                key={v}
                component="button"
                onClick={() => saveImmediate({ mood: v })}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "none",
                  bgcolor: metrics?.mood === v ? "primary.main" : "background.paper",
                  fontSize: 24,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  transform: metrics?.mood === v ? "scale(1.15)" : "scale(1)",
                }}
              >
                {MOOD_LABELS[v]}
              </Box>
            ))}
          </Box>
        </CollapsibleItem>

        <CollapsibleItem
          icon={<FitnessCenterOutlined sx={{ fontSize: 18 }} />}
          label="Exercise"
          value={metrics?.exercise_minutes ? `${metrics.exercise_minutes} min` : "—"}
          expanded={expanded === "exercise"}
          onToggle={() => toggle("exercise")}
          sx={{ display: "none" }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", py: 1 }}>
            <TextField
              fullWidth
              placeholder="Running, gym, yoga..."
              defaultValue={metrics?.exercise_type ?? ""}
              onChange={(e) => save({ exercise_type: e.target.value || null })}
              sx={{ "& .MuiInputBase-root": { borderRadius: "12px" } }}
            />
            <TextField
              type="number"
              fullWidth
              placeholder="Minutes"
              defaultValue={metrics?.exercise_minutes ?? ""}
              onChange={(e) => save({ exercise_minutes: e.target.value ? Number(e.target.value) : null })}
              sx={{ "& .MuiInputBase-root": { borderRadius: "12px" } }}
            />
          </Box>
        </CollapsibleItem>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
          color: tokens.textTertiary,
          font: "500 11px Inter",
          mt: "auto",
          pt: 2,
        }}
      >
        <CheckOutlined sx={{ fontSize: 14 }} />
        <span>Se guarda automáticamente al cambiar</span>
      </Box>
    </BottomSheet>
  );
}
