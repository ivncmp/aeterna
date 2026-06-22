import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import KeyboardArrowUpOutlined from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useTheme } from "@mui/material/styles";
import { IconTile } from "@/components/metrics/IconTile";

interface CollapsibleItemProps {
  icon: ReactNode;
  label: string;
  value?: string;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

export function CollapsibleItem({
  icon,
  label,
  value,
  expanded,
  onToggle,
  children,
}: CollapsibleItemProps) {
  const { tokens } = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "14px",
        boxShadow: tokens.cardShadow,
        overflow: "hidden",
      }}
    >
      <Box
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: expanded ? "14px 16px" : "13px 16px",
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <IconTile>{icon}</IconTile>
          <Box component="span" sx={{ font: "600 15px Inter", color: "text.primary" }}>
            {label}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!expanded && value && (
            <Box component="span" sx={{ font: "600 14px Inter", color: "text.secondary" }}>
              {value}
            </Box>
          )}
          {expanded ? (
            <KeyboardArrowUpOutlined sx={{ color: "text.secondary", fontSize: 18 }} />
          ) : (
            <KeyboardArrowDownOutlined sx={{ color: tokens.textTertiary, fontSize: 18 }} />
          )}
        </Box>
      </Box>
      {expanded && (
        <Box sx={{ px: "16px", pb: "14px" }}>{children}</Box>
      )}
    </Box>
  );
}
