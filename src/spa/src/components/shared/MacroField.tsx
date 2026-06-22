import Box from "@mui/material/Box";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { useTheme } from "@mui/material/styles";

export function MacroField({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: number;
  unit: string;
  accent?: boolean;
}) {
  const { tokens } = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "12px",
        p: "11px 14px",
        boxShadow: tokens.cardShadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
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
        <Box component="span" sx={{ font: "700 19px Inter", color: accent ? "primary.main" : "text.primary" }}>
          {value}{" "}
          <Box component="span" sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}>
            {unit}
          </Box>
        </Box>
      </Box>
      <EditOutlined sx={{ fontSize: 15, color: tokens.textTertiary }} />
    </Box>
  );
}
