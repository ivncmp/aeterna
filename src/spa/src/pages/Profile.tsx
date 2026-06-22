import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import { useTheme } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { StatGrid } from "@/components/profile/StatGrid";
import { MonthlyCalendar } from "@/components/profile/MonthlyCalendar";
import { NutritionBar } from "@/components/metrics/NutritionBar";
import { useThemeMode } from "@/hooks/useThemeMode";
import { mockUser, mockStats } from "@/lib/mock";
import { initials } from "@/lib/utils";

const user = mockUser();
const stats = mockStats();

const STAT_ITEMS = [
  {
    label: "Current Streak",
    value: `${stats.current_streak} days`,
    icon: "\u{1F525}",
  },
  {
    label: "Best Streak",
    value: `${stats.best_streak} days`,
    icon: "\u{2B50}",
  },
  { label: "Total Fasts", value: `${stats.total_fasts}`, icon: "\u{2705}" },
  {
    label: "Avg Duration",
    value: `${stats.avg_duration_hours}h`,
    icon: "\u{23F1}\u{FE0F}",
  },
  {
    label: "Total Time",
    value: `${stats.total_hours.toLocaleString()}h`,
    icon: "\u{1F552}",
  },
  {
    label: "Completion",
    value: `${stats.completion_rate}%`,
    icon: "\u{1F4CA}",
  },
];

export function Profile() {
  const theme = useTheme();
  const { mode, toggle } = useThemeMode();

  const SETTINGS = [
    {
      label: "Fasting Goal",
      detail: `${user.fasting_goal_hours}h`,
      icon: <TimerOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Notifications",
      icon: <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "About",
      icon: <InfoOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Dark Mode",
      icon: <DarkModeOutlined sx={{ fontSize: 20 }} />,
      toggle: true,
    },
    {
      label: "Log out",
      icon: <LogoutIcon sx={{ fontSize: 20 }} />,
      danger: true,
    },
  ];
  return (
    <Box sx={{ px: "20px", pb: "24px" }}>
      {/* Profile Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: "12px",
          pb: "20px",
        }}
      >
        <Avatar
          src="https://i.pravatar.cc/160?u=ivan"
          sx={{
            width: 80,
            height: 80,
            bgcolor: "background.paper",
            color: "text.primary",
            font: "700 28px Inter",
            mb: "12px",
          }}
        >
          {initials(user.name)}
        </Avatar>
        <Typography sx={{ font: "700 20px Inter", color: "text.primary" }}>
          {user.name}
        </Typography>
        <Typography
          sx={{ font: "400 14px Inter", color: "text.secondary", mt: "2px" }}
        >
          {user.email}
        </Typography>
        <Typography
          component="button"
          onClick={() => {}}
          sx={{
            font: "600 14px Inter",
            color: "primary.main",
            mt: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            p: 0,
          }}
        >
          Edit Profile
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Typography
        sx={{ font: "600 16px Inter", color: "text.primary", mb: "10px" }}
      >
        Fasting Statistics
      </Typography>
      <StatGrid items={STAT_ITEMS} />

      {/* Monthly Calendar */}
      <Typography
        sx={{
          font: "600 16px Inter",
          color: "text.primary",
          mt: "20px",
          mb: "10px",
        }}
      >
        Monthly Overview
      </Typography>
      <MonthlyCalendar />

      {/* Nutrition Summary */}
      <Typography
        sx={{
          font: "600 16px Inter",
          color: "text.primary",
          mt: "20px",
          mb: "10px",
        }}
      >
        Nutrition
      </Typography>
      <Box
        sx={{ bgcolor: "background.paper", borderRadius: "16px", p: "16px" }}
      >
        <NutritionBar
          label="Avg Calories"
          value={1850}
          target={2000}
          unit="kcal"
        />
        <NutritionBar label="Avg Protein" value={92} target={128} unit="g" />
      </Box>

      {/* Settings */}
      <Typography
        sx={{
          font: "600 16px Inter",
          color: "text.primary",
          mt: "20px",
          mb: "10px",
        }}
      >
        Settings
      </Typography>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {SETTINGS.map((item, i) => (
          <Box
            key={item.label}
            component="button"
            onClick={() => {}}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              p: "14px 16px",
              background: "none",
              border: "none",
              borderTop:
                i > 0 ? `1px solid ${theme.palette.divider}` : "none",
              cursor: "pointer",
              gap: "12px",
              color: item.danger ? "error.main" : "text.primary",
            }}
          >
            <Box
              sx={{ color: item.danger ? "error.main" : "text.secondary" }}
            >
              {item.icon}
            </Box>
            <Typography
              sx={{
                font: "400 15px Inter",
                flex: 1,
                textAlign: "left",
                color: "inherit",
              }}
            >
              {item.label}
            </Typography>
            {item.detail && (
              <Typography
                sx={{ font: "400 14px Inter", color: "text.secondary" }}
              >
                {item.detail}
              </Typography>
            )}
            {item.toggle && (
              <Switch
                size="small"
                checked={mode === "dark"}
                onChange={toggle}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {!item.danger && !item.toggle && (
              <ChevronRightIcon
                sx={{ fontSize: 20, color: "text.secondary", ml: "4px" }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
