import { useState, useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router";
import { PhoneFrame } from "./PhoneFrame";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { FABMenu } from "../sheets/FABMenu";
import { LogMealSheet } from "../sheets/LogMealSheet";
import { LogMetricsSheet } from "../sheets/LogMetricsSheet";
import { EditProfileSheet } from "../sheets/EditProfileSheet";
import { useDragScroll } from "../hooks/useDragScroll";

export function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:640px)");
  const dragScroll = useDragScroll();
  const location = useLocation();
  const visitedRef = useRef(new Set<string>());
  const [showSplash, setShowSplash] = useState(() => {
    if (sessionStorage.getItem("aeterna-skip-splash")) {
      sessionStorage.removeItem("aeterna-skip-splash");
      visitedRef.current.add(location.pathname);
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (!visitedRef.current.has(location.pathname)) {
      setShowSplash(true);
    }
  }, [location.pathname]);

  const handleSplashDone = useCallback(() => {
    visitedRef.current.add(location.pathname);
    setShowSplash(false);
  }, [location.pathname]);

  return (
    <PhoneFrame>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <TopBar />
      <Box
        ref={isDesktop ? dragScroll.ref : undefined}
        onMouseDown={isDesktop ? dragScroll.onMouseDown : undefined}
        onMouseMove={isDesktop ? dragScroll.onMouseMove : undefined}
        onMouseUp={isDesktop ? dragScroll.onMouseUp : undefined}
        onMouseLeave={isDesktop ? dragScroll.onMouseLeave : undefined}
        sx={{
          flex: 1,
          pb: 1,
          overflow: "auto",
          overscrollBehaviorY: "contain",
          WebkitOverflowScrolling: "touch",
          position: "relative",
          bgcolor: "background.default",
          "&::-webkit-scrollbar": { width: 4, height: 4 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: theme.tokens.track,
            borderRadius: "9px",
          },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.tokens.track} transparent`,
          ...(isDesktop && { userSelect: "none" }),
        }}
      >
        <Outlet />
      </Box>
      <BottomNav />
      <FABMenu />
      <LogMealSheet />
      <LogMetricsSheet />
      <EditProfileSheet />
    </PhoneFrame>
  );
}
