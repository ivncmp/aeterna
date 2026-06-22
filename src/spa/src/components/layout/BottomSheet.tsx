import { type ReactNode, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import CloseOutlined from "@mui/icons-material/CloseOutlined";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 1300,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Box
        onClick={onClose}
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.55)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.default",
          borderRadius: "28px 28px 0 0",
          boxShadow: "0 -12px 44px rgba(0,0,0,0.45)",
          maxHeight: "90%",
          display: "flex",
          flexDirection: "column",
          p: "12px 20px 26px",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: "9999px",
            bgcolor: theme.tokens.track,
            mx: "auto",
            mb: "14px",
            flexShrink: 0,
          }}
        />

        {title && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              flexShrink: 0,
            }}
          >
            <Box component="span" sx={{ font: "700 18px Inter", color: "text.primary" }}>
              {title}
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                width: 30,
                height: 30,
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <CloseOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
            </IconButton>
          </Box>
        )}

        {children}
      </Box>
    </Box>
  );
}
