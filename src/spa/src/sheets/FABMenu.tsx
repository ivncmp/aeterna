import Box from "@mui/material/Box";
import RestaurantOutlined from "@mui/icons-material/RestaurantOutlined";
import StraightenOutlined from "@mui/icons-material/StraightenOutlined";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { SheetMenuItem } from "@/components/shared/SheetMenuItem";
import { useSheet } from "@/hooks/useSheet";

export function FABMenu() {
  const { sheetState, openSheet, closeSheet } = useSheet();
  const isOpen = sheetState.sheet === "fab-menu";

  return (
    <BottomSheet open={isOpen} onClose={closeSheet} title="Quick Add">
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <SheetMenuItem
          icon={<RestaurantOutlined />}
          label="Log Meal"
          subtitle="Track food via text, photo or manual entry"
          onClick={() => openSheet({ sheet: "log-meal" })}
        />
        <SheetMenuItem
          icon={<StraightenOutlined />}
          label="Log Metrics"
          subtitle="Water, weight, sleep, mood, exercise"
          onClick={() => openSheet({ sheet: "log-metrics" })}
        />
      </Box>
    </BottomSheet>
  );
}
