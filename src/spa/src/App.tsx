import { useState, useCallback, useMemo, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { darkTheme, lightTheme } from "./theme";
import type { ThemeMode } from "./theme";
import { queryClient } from "./lib/queryClient";
import { SheetContext } from "./hooks/useSheet";
import { ThemeModeContext } from "./hooks/useThemeMode";
import { AppLayout } from "./layouts/AppLayout";
import { Today } from "./pages/Today";
import { History } from "./pages/History";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { SplashScreen } from "./components/layout/SplashScreen";
import type { SheetState } from "./types";

function getInitialMode(): ThemeMode {
  try {
    const stored = localStorage.getItem("aeterna-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* noop */
  }
  return "dark";
}

export function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [splashDone, setSplashDone] = useState(!token);
  const [sheetState, setSheetState] = useState<SheetState>({ sheet: null });
  const openSheet = useCallback((s: SheetState) => setSheetState(s), []);
  const closeSheet = useCallback(() => setSheetState({ sheet: null }), []);

  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const themeCtx = useMemo(
    () => ({
      mode,
      toggle: () =>
        setMode((prev) => {
          const next = prev === "dark" ? "light" : "dark";
          try {
            localStorage.setItem("aeterna-theme", next);
          } catch {
            /* noop */
          }
          return next;
        }),
    }),
    [mode],
  );

  const theme = mode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    const isDark = mode === "dark";
    document.documentElement.style.background = isDark
      ? "linear-gradient(to bottom, #000 50%, #1C1C1E 50%)"
      : "linear-gradient(to bottom, #F5F5F7 50%, #F5F5F7 50%)";
    document.body.style.backgroundColor = isDark ? "#09090B" : "#F5F5F7";
    const meta = document.getElementById("theme-color-meta");
    if (meta) meta.setAttribute("content", isDark ? "#000000" : "#F5F5F7");
  }, [mode]);

  const handleLogin = useCallback((t: string) => {
    setToken(t);
    setSplashDone(true);
    queryClient.invalidateQueries({ queryKey: ["user"] });
  }, []);

  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeContext.Provider value={themeCtx}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {!splashDone && token && <SplashScreen onDone={handleSplashDone} />}
          {!token ? (
            <Login onLogin={handleLogin} />
          ) : (
            <SheetContext.Provider value={{ sheetState, openSheet, closeSheet }}>
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route index element={<Today />} />
                    <Route path="history" element={<History />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </SheetContext.Provider>
          )}
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </QueryClientProvider>
  );
}
