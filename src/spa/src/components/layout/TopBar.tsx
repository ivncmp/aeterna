import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { useFastingStats } from "@/hooks/useFasting";
import { useSheet } from "@/hooks/useSheet";

export function TopBar() {
  const theme = useTheme();
  const { data: stats } = useFastingStats();
  const { openSheet } = useSheet();
  const streak = stats?.current_streak ?? 0;
  const isDark = theme.palette.mode === "dark";

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: "2px 20px 10px",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={isDark ? "/assets/aeterna-logo-white.png" : "/assets/aeterna-logo.png"}
            alt="AETERNA"
            style={{ height: 22, width: "auto", display: "block" }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {streak > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                bgcolor: "rgba(138,222,136,0.13)",
                border: "1px solid rgba(138,222,136,0.32)",
                borderRadius: "9999px",
                padding: "4px 11px 4px 8px",
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#8ADE88",
                }}
              />
              <Box
                component="span"
                sx={{ font: "600 14px Inter", color: "#5BB45A" }}
              >
                {streak}
              </Box>
            </Box>
          )}
          <IconButton
            onClick={() => openSheet({ sheet: "fab-menu" })}
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              width: 32,
              height: 32,
              "&:hover": { bgcolor: "primary.main" },
            }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
