import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@mui/material/styles";
import { MacroField } from "@/components/shared/MacroField";
import type { MealAnalysis } from "@/types";

interface MealResultViewProps {
  data: MealAnalysis;
  editable?: boolean;
  onChange?: (data: MealAnalysis) => void;
}

export function MealResultView({ data, editable, onChange }: MealResultViewProps) {
  const { tokens } = useTheme();

  const update = (field: keyof MealAnalysis, value: string | number) => {
    onChange?.({ ...data, [field]: value });
  };

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
        {editable ? (
          <TextField
            fullWidth
            multiline
            minRows={2}
            variant="standard"
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            slotProps={{ input: { disableUnderline: true, sx: { font: "500 15px Inter", color: "text.primary", mt: "4px", p: 0 } } }}
          />
        ) : (
          <Box sx={{ font: "500 15px Inter", color: "text.primary", mt: "6px", lineHeight: 1.45 }}>
            {data.description || "—"}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", mb: "14px" }}>
        <MacroField label="CALORIES" value={data.calories} unit="kcal" editable={editable} onChange={(v) => update("calories", v)} />
        <MacroField label="PROTEIN" value={data.protein_g} unit="g" accent editable={editable} onChange={(v) => update("protein_g", v)} />
        <MacroField label="CARBS" value={data.carbs_g} unit="g" editable={editable} onChange={(v) => update("carbs_g", v)} />
        <MacroField label="FAT" value={data.fat_g} unit="g" editable={editable} onChange={(v) => update("fat_g", v)} />
      </Box>

      {editable && (
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
          <span>Puedes editar los valores antes de guardar</span>
        </Box>
      )}
    </>
  );
}
