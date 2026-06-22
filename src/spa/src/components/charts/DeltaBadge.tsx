import Box from "@mui/material/Box";

export function DeltaBadge({ value, unit }: { value: number; unit: string }) {
  const isPositive = value >= 0;
  return (
    <Box
      sx={{
        bgcolor: isPositive
          ? "rgba(248,191,36,0.15)"
          : "rgba(138,222,136,0.15)",
        color: isPositive ? "#F8BF24" : "#8ADE88",
        font: "600 12px Inter",
        px: "8px",
        py: "3px",
        borderRadius: "8px",
      }}
    >
      {isPositive ? "+" : ""}
      {value.toFixed(1)} {unit}
    </Box>
  );
}
