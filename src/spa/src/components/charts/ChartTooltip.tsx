import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { formatDate } from "@/lib/chart-utils";

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  const theme = useTheme();

  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "8px",
        p: "8px 12px",
        font: "400 12px Inter",
      }}
    >
      <Typography
        sx={{
          font: "500 11px Inter",
          color: theme.palette.text.secondary,
          mb: "4px",
        }}
      >
        {label ? formatDate(label) : ""}
      </Typography>
      {payload.map((p, i) => (
        <Typography key={i} sx={{ font: "500 12px Inter", color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </Typography>
      ))}
    </Box>
  );
}
