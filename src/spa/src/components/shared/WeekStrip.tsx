import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import type { WeekDay } from "@/types";

interface WeekStripProps {
  days: WeekDay[];
  todayIndex: number;
}

export function WeekStrip({ days, todayIndex }: WeekStripProps) {
  const { tokens } = useTheme();

  const STATUS_COLORS: Record<WeekDay["status"], string> = {
    completed: "#8ADE88",
    partial: "#F8BF24",
    none: tokens.track,
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        px: "22px",
        pb: "12px",
      }}
    >
      {days.map((day, i) => {
        const isToday = i === todayIndex;
        const isActive = isToday && day.status === "none";

        return (
          <Box
            key={day.date}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isToday ? "7px" : "8px",
            }}
          >
            <Box
              component="span"
              sx={{
                font: `${isToday ? 700 : 600} 11px Inter`,
                color: isToday
                  ? "text.primary"
                  : i > todayIndex
                    ? tokens.textTertiary
                    : "text.secondary",
              }}
            >
              {day.label}
            </Box>
            <Box
              component="span"
              sx={{
                width: isToday ? 11 : 10,
                height: isToday ? 11 : 10,
                borderRadius: "50%",
                ...(isActive
                  ? {
                      background: "transparent",
                      border: `2px solid ${tokens.track}`,
                      boxSizing: "border-box",
                    }
                  : isToday
                    ? {
                        background: "primary.main",
                        boxShadow:
                          "0 0 0 3px color-mix(in srgb, #F0932C 28%, transparent)",
                      }
                    : {
                        background: STATUS_COLORS[day.status],
                      }),
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
