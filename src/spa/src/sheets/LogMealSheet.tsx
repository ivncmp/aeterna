import { useState } from "react";
import Box from "@mui/material/Box";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { MealPhotoView } from "@/components/shared/MealPhotoView";
import { MealResultView } from "@/components/shared/MealResultView";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { useTheme } from "@mui/material/styles";
import { useSheet } from "@/hooks/useSheet";

type Tab = "Text" | "Photo" | "Manual";

export function LogMealSheet() {
  const { tokens } = useTheme();
  const { sheetState, closeSheet } = useSheet();
  const isOpen = sheetState.sheet === "log-meal";
  const [tab, setTab] = useState<Tab>("Manual");

  return (
    <BottomSheet open={isOpen} onClose={closeSheet} title="Log Meal">
      <SegmentedControl
        options={["Text", "Photo", "Manual"]}
        value={tab}
        onChange={(v) => setTab(v as Tab)}
      />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {tab === "Photo" ? <MealPhotoView /> : <MealResultView />}
      </Box>

      {tab !== "Photo" && (
        <Box sx={{ display: "flex", gap: "10px", mt: "auto", pt: 2 }}>
          <Box
            component="button"
            onClick={closeSheet}
            sx={{
              flex: 1,
              height: 50,
              borderRadius: "12px",
              bgcolor: "background.paper",
              border: "none",
              color: "text.primary",
              font: "600 15px Inter",
              cursor: "pointer",
            }}
          >
            Cancel
          </Box>
          <Box
            component="button"
            sx={{
              flex: 2,
              height: 50,
              borderRadius: "12px",
              bgcolor: "primary.main",
              border: "none",
              color: "#fff",
              font: "600 15px Inter",
              cursor: "pointer",
              boxShadow: tokens.fabGlow,
            }}
          >
            Save Meal
          </Box>
        </Box>
      )}
    </BottomSheet>
  );
}
