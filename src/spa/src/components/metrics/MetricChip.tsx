import Box from "@mui/material/Box";
import { type ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import { IconTile } from "@/components/metrics/IconTile";

interface MetricChipProps {
  icon: ReactNode;
  iconColor: string;
  label: string;
  value: string;
  subtitle?: string;
  subtitleColor?: string;
}

export function MetricChip({
  icon,
  iconColor,
  label,
  value,
  subtitle,
  subtitleColor,
}: MetricChipProps) {
  const { tokens } = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "14px",
        p: "9px 12px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: 0,
        boxShadow: tokens.cardShadow,
      }}
    >
      <IconTile color={iconColor}>{icon}</IconTile>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          minWidth: 0,
        }}
      >
        <Box
          component="span"
          sx={{
            font: "500 10px Inter",
            letterSpacing: "0.05em",
            color: tokens.textTertiary,
          }}
        >
          {label}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
          }}
        >
          <Box
            component="span"
            sx={{ fontWeight: 700, fontSize: 18, color: "text.primary" }}
          >
            {value}
          </Box>
          {subtitle && (
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: subtitleColor || tokens.textTertiary,
              }}
            >
              {subtitle}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
