import Box from "@mui/material/Box";
import { type ReactNode } from "react";

interface IconTileProps {
  children: ReactNode;
  color?: string;
  size?: number;
}

export function IconTile({
  children,
  color = "#F0932C",
  size = 36,
}: IconTileProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "11px",
        bgcolor: `color-mix(in srgb, ${color} 13%, transparent)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}
