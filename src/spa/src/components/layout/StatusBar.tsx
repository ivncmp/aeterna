import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export function StatusBar() {
  const theme = useTheme();
  const iconColor = theme.palette.text.primary;

  return (
    <Box
      sx={{
        height: 46,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        px: "28px",
        pb: "6px",
        flexShrink: 0,
      }}
    >
      <Box component="span" sx={{ font: "600 14px Inter", color: "text.primary" }}>
        9:41
      </Box>
      <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill={iconColor}>
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="5" y="4" width="3" height="7" rx="1" />
          <rect x="10" y="1.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="11" rx="1" fillOpacity="0.4" />
        </svg>
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          stroke={iconColor}
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          <path d="M1 4.4a10 10 0 0 1 14 0" />
          <path d="M3.6 7a6 6 0 0 1 8.8 0" />
          <path d="M6.2 9.4a2.4 2.4 0 0 1 3.6 0" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="21"
            height="11"
            rx="3"
            stroke={iconColor}
            strokeOpacity="0.5"
          />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill={iconColor} />
          <rect
            x="23"
            y="3.5"
            width="2"
            height="5"
            rx="1"
            fill={iconColor}
            fillOpacity="0.5"
          />
        </svg>
      </Box>
    </Box>
  );
}
