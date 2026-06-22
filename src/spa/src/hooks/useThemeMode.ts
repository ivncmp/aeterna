import { createContext, useContext } from "react";
import type { ThemeMode } from "@/theme";

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: "dark",
  toggle: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
