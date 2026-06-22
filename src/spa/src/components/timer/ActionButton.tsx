import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export function ActionButton({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  const { tokens } = useTheme();

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        width: "100%",
        height: 48,
        borderRadius: "12px",
        border: isActive ? `1.5px solid ${tokens.track}` : "none",
        bgcolor: isActive ? "transparent" : "primary.main",
        color: isActive ? "text.secondary" : "#fff",
        font: "600 15px Inter",
        cursor: "pointer",
        ...(isActive
          ? {}
          : { boxShadow: tokens.fabGlow }),
      }}
    >
      {isActive ? "Stop Fasting" : "Start Fasting"}
    </Box>
  );
}
