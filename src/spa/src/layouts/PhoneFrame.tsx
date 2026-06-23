import { ReactNode } from "react";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { StatusBar } from "@/components/layout/StatusBar";

const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;

export function PhoneFrame({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:640px)");

  if (!isDesktop) {
    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "#E5E5EA",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: PHONE_WIDTH,
          height: `min(${PHONE_HEIGHT}px, calc(100dvh - 48px))`,
          aspectRatio: `${PHONE_WIDTH} / ${PHONE_HEIGHT}`,
          borderRadius: "52px",
          border: `3px solid ${theme.tokens.bezel}`,
          boxShadow: "0 50px 90px -20px rgba(0,0,0,0.7)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "11px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 118,
            height: 30,
            bgcolor: "#000",
            borderRadius: "9999px",
            zIndex: 30,
          }}
        />
        <StatusBar />
        {children}
      </Box>
    </Box>
  );
}
