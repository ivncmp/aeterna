import { createContext, useContext } from "react";
import type { SheetState } from "@/types";

export interface SheetContextValue {
  sheetState: SheetState;
  openSheet: (state: SheetState) => void;
  closeSheet: () => void;
}

export const SheetContext = createContext<SheetContextValue>({
  sheetState: { sheet: null },
  openSheet: () => {},
  closeSheet: () => {},
});

export function useSheet() {
  return useContext(SheetContext);
}
