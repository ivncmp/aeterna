import { useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import MuiBottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useTheme } from "@mui/material/styles";
import TimerOutlined from "@mui/icons-material/TimerOutlined";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";

const tabs = [
  { label: "Today", icon: <TimerOutlined />, path: "/" },
  { label: "History", icon: <BarChartOutlined />, path: "/history" },
  { label: "Me", icon: <PersonOutlined />, path: "/profile" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const current = tabs.findIndex((t) => t.path === location.pathname);

  return (
    <Box
      sx={{
        flexShrink: 0,
        pb: "calc(env(safe-area-inset-bottom, 0px) - 24px)",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <MuiBottomNavigation
        showLabels
        value={current === -1 ? 0 : current}
        onChange={(_, idx) => navigate(tabs[idx]!.path)}
        sx={{ height: 62 }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction key={tab.path} label={tab.label} icon={tab.icon} />
        ))}
      </MuiBottomNavigation>
    </Box>
  );
}
