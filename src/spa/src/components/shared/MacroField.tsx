import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

interface MacroFieldProps {
  label: string;
  value: number | null;
  unit: string;
  accent?: boolean;
  editable?: boolean;
  onChange?: (value: number) => void;
}

export function MacroField({ label, value, unit, accent, editable, onChange }: MacroFieldProps) {
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
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
        {editable ? (
          <Box sx={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <Box
              component="input"
              type="number"
              value={value ?? ""}
              onChange={(e) => onChange?.(Number(e.target.value))}
              sx={{
                font: "700 19px Inter",
                color: accent ? "primary.main" : "text.primary",
                bgcolor: "transparent",
                border: "none",
                outline: "none",
                width: 60,
                p: 0,
                MozAppearance: "textfield",
                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                },
              }}
            />
            <Box component="span" sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}>
              {unit}
            </Box>
          </Box>
        ) : (
          <Box component="span" sx={{ font: "700 19px Inter", color: accent ? "primary.main" : "text.primary" }}>
            {value ?? 0}{" "}
            <Box component="span" sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}>
              {unit}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
