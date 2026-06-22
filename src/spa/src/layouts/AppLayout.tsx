import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router";
import { PhoneFrame } from "./PhoneFrame";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { FABMenu } from "../sheets/FABMenu";
import { LogMealSheet } from "../sheets/LogMealSheet";
import { LogMetricsSheet } from "../sheets/LogMetricsSheet";
import { useDragScroll } from "../hooks/useDragScroll";

export function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:640px)");
  const dragScroll = useDragScroll();

  return (
    <PhoneFrame>
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
    </PhoneFrame>
  );
}
