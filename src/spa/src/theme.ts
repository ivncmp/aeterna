import { createTheme, type Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    tokens: {
      textTertiary: string;
      track: string;
      surface: string;
      bezel: string;
      accentTint: string;
      cardShadow: string;
      fabGlow: string;
      navBorder: string;
    };
  }
  interface ThemeOptions {
    tokens?: Theme["tokens"];
  }
}

const shared = {
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
} as const;

export const darkTheme: Theme = createTheme({
  ...shared,
  palette: {
    mode: "dark",
    background: { default: "#09090B", paper: "#1C1C1E" },
    primary: { main: "#F0932C" },
    secondary: { main: "#A1A1AA" },
    success: { main: "#8ADE88" },
    warning: { main: "#F8BF24" },
    error: { main: "#F87171" },
    text: { primary: "#FFFFFF", secondary: "#A1A1AA" },
    divider: "rgba(255,255,255,0.06)",
  },
  tokens: {
    textTertiary: "#71717A",
    track: "#3F3F46",
    surface: "#1C1C1E",
    bezel: "#3F3F46",
    accentTint: "color-mix(in srgb, #F0932C 13%, transparent)",
    cardShadow: "0 3px 14px rgba(0,0,0,0.4)",
    fabGlow: "0 8px 22px color-mix(in srgb, #F0932C 38%, transparent)",
    navBorder: "rgba(255,255,255,0.06)",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#09090B" } },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#1C1C1E",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: "#A1A1AA",
          "&.Mui-selected": { color: "#F0932C" },
        },
      },
    },
  },
});

export const lightTheme: Theme = createTheme({
  ...shared,
  palette: {
    mode: "light",
    background: { default: "#F5F5F7", paper: "#FFFFFF" },
    primary: { main: "#E07D1A" },
    secondary: { main: "#6B7280" },
    success: { main: "#22C55E" },
    warning: { main: "#EAB308" },
    error: { main: "#EF4444" },
    text: { primary: "#1C1C1E", secondary: "#6B7280" },
    divider: "rgba(0,0,0,0.08)",
  },
  tokens: {
    textTertiary: "#9CA3AF",
    track: "#D1D5DB",
    surface: "#FFFFFF",
    bezel: "#D1D5DB",
    accentTint: "color-mix(in srgb, #E07D1A 10%, transparent)",
    cardShadow: "0 2px 10px rgba(0,0,0,0.08)",
    fabGlow: "0 4px 14px color-mix(in srgb, #E07D1A 25%, transparent)",
    navBorder: "rgba(0,0,0,0.08)",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#F5F5F7" } },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid rgba(0,0,0,0.08)",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: "#6B7280",
          "&.Mui-selected": { color: "#E07D1A" },
        },
      },
    },
  },
});

export type ThemeMode = "light" | "dark";
