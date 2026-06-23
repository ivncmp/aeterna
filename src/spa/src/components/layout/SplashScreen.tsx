import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setExiting(true), 1600);
    const doneTimer = setTimeout(onDone, 2000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(doneTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#09090B",
        animation: exiting
          ? `${fadeOut} 400ms ease-out forwards`
          : undefined,
      }}
    >
      <Box
        component="img"
        src="/assets/aeterna-logo-white.png"
        alt="Aeterna"
        sx={{
          width: 200,
          animation: `${fadeIn} 800ms ease-out both`,
        }}
      />
    </Box>
  );
}
