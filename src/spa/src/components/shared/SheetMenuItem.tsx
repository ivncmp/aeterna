import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

interface SheetMenuItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  onClick: () => void;
}

export function SheetMenuItem({ icon, label, subtitle, onClick }: SheetMenuItemProps) {
  const { tokens } = useTheme();

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        bgcolor: "background.paper",
        borderRadius: "14px",
        p: "14px 16px",
        border: "none",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        boxShadow: tokens.cardShadow,
        "&:active": { opacity: 0.8 },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: "color-mix(in srgb, #F0932C 13%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <Box component="span" sx={{ font: "600 15px Inter", color: "text.primary" }}>
          {label}
        </Box>
        <Box component="span" sx={{ font: "400 12px Inter", color: "text.secondary" }}>
          {subtitle}
        </Box>
      </Box>
    </Box>
  );
}
