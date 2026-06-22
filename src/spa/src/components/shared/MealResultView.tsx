import Box from "@mui/material/Box";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@mui/material/styles";
import { MacroField } from "@/components/shared/MacroField";

export function MealResultView() {
  const { tokens } = useTheme();

  return (
    <>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "12px",
          p: "12px 14px",
          boxShadow: tokens.cardShadow,
          mb: "12px",
          minHeight: 92,
        }}
      >
        <Box
          component="span"
          sx={{ font: "500 10px Inter", letterSpacing: "0.05em", color: tokens.textTertiary }}
        >
          DESCRIPTION
        </Box>
        <Box sx={{ font: "500 15px Inter", color: "text.primary", mt: "6px", lineHeight: 1.45 }}>
          Grilled chicken &amp; avocado salad
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", mb: "14px" }}>
        <MacroField label="CALORIES" value={420} unit="kcal" />
        <MacroField label="PROTEIN" value={38} unit="g" accent />
        <MacroField label="CARBS" value={22} unit="g" />
        <MacroField label="FAT" value={19} unit="g" />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          color: tokens.textTertiary,
          font: "500 11px Inter",
        }}
      >
        <InfoOutlined sx={{ fontSize: 14 }} />
        <span>Introduce los macros de tu comida manualmente</span>
      </Box>
    </>
  );
}
