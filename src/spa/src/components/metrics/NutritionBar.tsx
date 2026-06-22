import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

interface NutritionBarProps {
  label: string;
  value: number;
  target: number;
  unit: string;
}

export function NutritionBar({ label, value, target, unit }: NutritionBarProps) {
  const theme = useTheme();
  const pct = Math.min(100, (value / target) * 100);
  return (
    <Box sx={{ mb: "14px", "&:last-child": { mb: 0 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: "6px",
        }}
      >
        <Typography sx={{ font: "400 13px Inter", color: "text.secondary" }}>
          {label}
        </Typography>
        <Typography sx={{ font: "500 13px Inter", color: "text.primary" }}>
          {value} / {target} {unit}
        </Typography>
      </Box>
      <Box
        sx={{
          height: 6,
          bgcolor: theme.tokens.track,
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${pct}%`,
            height: "100%",
            bgcolor: "primary.main",
            borderRadius: "3px",
            transition: "width 0.3s ease",
          }}
        />
      </Box>
    </Box>
  );
}
