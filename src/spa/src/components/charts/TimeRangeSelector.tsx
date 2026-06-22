import Box from "@mui/material/Box";
import type { TimeRange } from "@/types";

const RANGES: TimeRange[] = ["1W", "1M", "3M", "6M", "1Y", "ALL"];

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "6px",
        px: "20px",
        pb: "12px",
        flexShrink: 0,
      }}
    >
      {RANGES.map((range) => {
        const isActive = range === value;
        return (
          <Box
            key={range}
            component="button"
            onClick={() => onChange(range)}
            sx={{
              flex: 1,
              textAlign: "center",
              font: "600 12px Inter",
              py: "8px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              bgcolor: isActive ? "primary.main" : "background.paper",
              color: isActive ? "#fff" : "text.secondary",
              transition: "all 0.2s ease",
            }}
          >
            {range}
          </Box>
        );
      })}
    </Box>
  );
}
