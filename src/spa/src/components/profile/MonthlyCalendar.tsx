import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { mockCalendarDays } from "@/lib/mock";
import type { CalendarDay } from "@/types";

const DAY_HEADERS = ["M", "T", "W", "T", "F", "S", "S"];

export function MonthlyCalendar() {
  const theme = useTheme();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);

  const STATUS_COLORS: Record<CalendarDay["status"], string> = {
    completed: "#8ADE88",
    partial: "#F8BF24",
    none: theme.tokens.track,
  };

  const days = useMemo(() => mockCalendarDays(year, month), [year, month]);

  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const today = "2026-06-17";

  function prev() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function next() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: "16px", p: "16px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "12px",
        }}
      >
        <IconButton onClick={prev} size="small" sx={{ color: "text.secondary" }}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ font: "600 15px Inter", color: "text.primary" }}>
          {monthLabel}
        </Typography>
        <IconButton onClick={next} size="small" sx={{ color: "text.secondary" }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          textAlign: "center",
          mb: "6px",
        }}
      >
        {DAY_HEADERS.map((d, i) => (
          <Typography
            key={i}
            sx={{ font: "500 11px Inter", color: "text.secondary" }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
        }}
      >
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <Box key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const isToday = day.date === today;
          return (
            <Box
              key={day.date}
              sx={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  bgcolor: STATUS_COLORS[day.status],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: isToday ? "2px solid #fff" : "none",
                  opacity: day.status === "none" ? 0.3 : 1,
                }}
              >
                <Typography
                  sx={{
                    font: "500 11px Inter",
                    color:
                      day.status === "none"
                        ? theme.palette.text.secondary
                        : "#09090B",
                  }}
                >
                  {day.day}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
