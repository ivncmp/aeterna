import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export function IdleChip() {
  const { tokens } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "background.paper",
        borderRadius: "12px",
        py: "8px",
        px: "14px",
        boxShadow: tokens.cardShadow,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: "#8ADE88",
          flexShrink: 0,
        }}
      />
      <Box component="span" sx={{ font: "600 13px Inter", color: "text.primary" }}>
        Last fast
      </Box>
      <Box component="span" sx={{ font: "500 12px Inter", color: "text.secondary" }}>
        16h 04m
      </Box>
      <Box
        component="span"
        sx={{ ml: "auto", font: "600 12px Inter", color: "#5BB45A" }}
      >
        Completed
      </Box>
    </Box>
  );
}
