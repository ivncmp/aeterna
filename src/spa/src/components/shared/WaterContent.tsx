import Box from "@mui/material/Box";
import RemoveOutlined from "@mui/icons-material/RemoveOutlined";
import AddOutlined from "@mui/icons-material/AddOutlined";
import { useTheme } from "@mui/material/styles";

interface WaterContentProps {
  waterMl: number;
  onChange: (ml: number) => void;
}

export function WaterContent({ waterMl, onChange }: WaterContentProps) {
  const { tokens } = useTheme();
  const glasses = Math.round(waterMl / 250);
  const liters = (waterMl / 1000).toFixed(1);
  const progress = Math.min((waterMl / 2000) * 100, 100);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "26px",
          my: "16px",
        }}
      >
        <Box
          component="button"
          onClick={() => onChange(Math.max(0, waterMl - 250))}
          sx={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            bgcolor: "transparent",
            border: `1.5px solid ${tokens.track}`,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <RemoveOutlined sx={{ fontSize: 20 }} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <Box component="span" sx={{ font: "700 30px Inter", color: "text.primary", lineHeight: 1 }}>
            {liters}{" "}
            <Box component="span" sx={{ fontSize: 16, fontWeight: 600, color: "text.secondary" }}>
              L
            </Box>
          </Box>
          <Box component="span" sx={{ font: "500 12px Inter", color: "text.secondary" }}>
            {glasses} of 8 glasses
          </Box>
        </Box>
        <Box
          component="button"
          onClick={() => onChange(waterMl + 250)}
          sx={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            bgcolor: "primary.main",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 5px 14px color-mix(in srgb, #F0932C 40%, transparent)",
          }}
        >
          <AddOutlined sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      <Box
        sx={{
          height: 8,
          borderRadius: "9999px",
          bgcolor: tokens.track,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: "9999px",
            bgcolor: "primary.main",
            transition: "width 0.3s ease",
          }}
        />
      </Box>
      <Box
        sx={{
          textAlign: "center",
          font: "500 12px Inter",
          color: "text.secondary",
          mt: "9px",
        }}
      >
        Goal · 2 L per day
      </Box>
    </Box>
  );
}
