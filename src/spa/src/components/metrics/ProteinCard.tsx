import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { ProgressGauge } from "@/components/metrics/ProgressGauge";
import { useProteinScore } from "@/hooks/useFasting";
import { useSheet } from "@/hooks/useSheet";

export function ProteinCard() {
  const { tokens } = useTheme();
  const { openSheet } = useSheet();
  const { data: protein } = useProteinScore();
  if (!protein) return null;

  return (
    <Box
      onClick={() => openSheet({ sheet: "log-meal", tab: "text" })}
      sx={{
        bgcolor: "background.paper",
        borderRadius: "16px",
        p: "13px 16px",
        display: "flex",
        alignItems: "center",
        gap: 2,
        boxShadow: tokens.cardShadow,
        cursor: "pointer",
      }}
    >
      <ProgressGauge
        value={protein.consumed_g}
        unit="g"
        progress={protein.score}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{ font: "600 14px Inter", color: "text.primary" }}
          >
            Protein Score
          </Box>
          <Box
            component="span"
            sx={{
              font: "600 11px Inter",
              color: "primary.main",
              bgcolor: "color-mix(in srgb, #F0932C 14%, transparent)",
              borderRadius: "9999px",
              padding: "3px 9px",
            }}
          >
            {protein.score}%
          </Box>
        </Box>
        <Box component="span" sx={{ font: "400 13px Inter", color: "text.secondary" }}>
          {protein.consumed_g} g of {protein.target_g} g daily goal
        </Box>
        <Box component="span" sx={{ font: "600 12px Inter", color: "primary.main" }}>
          {protein.target_g - protein.consumed_g} g left to hit your target
        </Box>
      </Box>
    </Box>
  );
}
