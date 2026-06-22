import Box from "@mui/material/Box";
import { TimerRing } from "@/components/timer/TimerRing";
import { WeekStrip } from "@/components/shared/WeekStrip";
import { ZoneChip } from "@/components/timer/ZoneChip";
import { ActionButton } from "@/components/timer/ActionButton";
import { IdleChip } from "@/components/timer/IdleChip";
import { ProteinCard } from "@/components/metrics/ProteinCard";
import { useTheme } from "@mui/material/styles";
import { MetricsGrid } from "@/components/metrics/MetricsGrid";
import {
  useActiveFast,
  useFastingTimer,
  useWeekDays,
  useToggleFast,
} from "@/hooks/useFasting";

export function Today() {
  const { tokens } = useTheme();
  const { fast } = useActiveFast();
  const timer = useFastingTimer(fast);
  const { data: weekDays } = useWeekDays();
  const { toggle } = useToggleFast(timer.isActive, fast?.id);

  const todayIdx = weekDays
    ? weekDays.findIndex(
        (d) => d.date === new Date().toISOString().slice(0, 10)
      )
    : -1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
     
      {weekDays && (
        <WeekStrip days={weekDays} todayIndex={todayIdx >= 0 ? todayIdx : 3} />
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pt: "4px",
          px: "18px",
          pb: "6px",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "16px",
            p: "14px 16px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            boxShadow: tokens.cardShadow,
          }}
        >
          <TimerRing
            progress={timer.progress}
            elapsed={timer.elapsedFormatted}
            zone={timer.zone.zone}
            zoneLabel={timer.zone.label}
            goalHours={timer.goalHours}
            isActive={timer.isActive}
          />
          <ActionButton isActive={timer.isActive} onClick={toggle} />
        </Box>

        {timer.isActive ? (
          <ZoneChip
            zone={timer.zone}
            nextZone={timer.nextZone}
            timeToNext={timer.timeToNext}
          />
        ) : (
          <IdleChip />
        )}

        <ProteinCard />
        <MetricsGrid />
        <MetricsGrid />
        <MetricsGrid />
      </Box>
    </Box>
  );
}
