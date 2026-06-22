import { useState } from "react";
import Box from "@mui/material/Box";
import WaterDropOutlined from "@mui/icons-material/WaterDropOutlined";
import MonitorWeightOutlined from "@mui/icons-material/MonitorWeightOutlined";
import BedtimeOutlined from "@mui/icons-material/BedtimeOutlined";
import SentimentSatisfiedOutlined from "@mui/icons-material/SentimentSatisfiedOutlined";
import FitnessCenterOutlined from "@mui/icons-material/FitnessCenterOutlined";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { CollapsibleItem } from "@/components/shared/CollapsibleItem";
import { WaterContent } from "@/components/shared/WaterContent";
import { useTheme } from "@mui/material/styles";
import { useSheet } from "@/hooks/useSheet";

export function LogMetricsSheet() {
  const { tokens } = useTheme();
  const { sheetState, closeSheet } = useSheet();
  const isOpen = sheetState.sheet === "log-metrics";
  const [expanded, setExpanded] = useState("water");

  const toggle = (key: string) =>
    setExpanded((prev) => (prev === key ? "" : key));

  return (
    <BottomSheet open={isOpen} onClose={closeSheet} title="Log Metrics">
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <CollapsibleItem
          icon={<WaterDropOutlined sx={{ fontSize: 18 }} />}
          label="Water"
          value="1.5 L"
          expanded={expanded === "water"}
          onToggle={() => toggle("water")}
        >
          <WaterContent />
        </CollapsibleItem>

        <CollapsibleItem
          icon={<MonitorWeightOutlined sx={{ fontSize: 18 }} />}
          label="Weight"
          value="78.2 kg"
          expanded={expanded === "weight"}
          onToggle={() => toggle("weight")}
        >
          <Box sx={{ font: "400 13px Inter", color: "text.secondary", py: 1 }}>
            Weight input coming soon
          </Box>
        </CollapsibleItem>

        <CollapsibleItem
          icon={<BedtimeOutlined sx={{ fontSize: 18 }} />}
          label="Sleep"
          value="7h 20m"
          expanded={expanded === "sleep"}
          onToggle={() => toggle("sleep")}
        >
          <Box sx={{ font: "400 13px Inter", color: "text.secondary", py: 1 }}>
            Sleep input coming soon
          </Box>
        </CollapsibleItem>

        <CollapsibleItem
          icon={<SentimentSatisfiedOutlined sx={{ fontSize: 18 }} />}
          label="Mood"
          value="Good"
          expanded={expanded === "mood"}
          onToggle={() => toggle("mood")}
        >
          <Box sx={{ font: "400 13px Inter", color: "text.secondary", py: 1 }}>
            Mood selector coming soon
          </Box>
        </CollapsibleItem>

        <CollapsibleItem
          icon={<FitnessCenterOutlined sx={{ fontSize: 18 }} />}
          label="Exercise"
          value="45 min"
          expanded={expanded === "exercise"}
          onToggle={() => toggle("exercise")}
        >
          <Box sx={{ font: "400 13px Inter", color: "text.secondary", py: 1 }}>
            Exercise input coming soon
          </Box>
        </CollapsibleItem>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
          color: tokens.textTertiary,
          font: "500 11px Inter",
          mt: "auto",
          pt: 2,
        }}
      >
        <CheckOutlined sx={{ fontSize: 14 }} />
        <span>Se guarda automáticamente al cambiar</span>
      </Box>
    </BottomSheet>
  );
}
