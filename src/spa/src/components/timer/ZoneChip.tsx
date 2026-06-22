import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import type { ZoneInfo } from "@/types";

interface ZoneChipProps {
  zone: ZoneInfo;
  nextZone: ZoneInfo | null;
  timeToNext: string | null;
}

export function ZoneChip({ zone, nextZone, timeToNext }: ZoneChipProps) {
  const { tokens } = useTheme();
  const rangeLabel = zone.maxHours
    ? `${zone.minHours}–${zone.maxHours}h`
    : `${zone.minHours}h+`;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "background.paper",
        borderRadius: "12px",
        py: "7px",
        px: "14px",
        boxShadow: tokens.cardShadow,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: zone.color,
          flexShrink: 0,
        }}
      />
      <Box
        component="span"
        sx={{ font: "600 13px Inter", color: "text.primary" }}
      >
        {zone.label}
      </Box>
      <Box
        component="span"
        sx={{ font: "500 12px Inter", color: "text.secondary" }}
      >
        {rangeLabel}
      </Box>
      {nextZone && timeToNext && (
        <Box
          component="span"
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            font: "500 12px Inter",
            color: "text.secondary",
            whiteSpace: "nowrap",
          }}
        >
          Next: {nextZone.label}{" "}
          <Box
            component="span"
            sx={{ color: "primary.main", fontWeight: 600 }}
          >
            {timeToNext}
          </Box>
        </Box>
      )}
    </Box>
  );
}
