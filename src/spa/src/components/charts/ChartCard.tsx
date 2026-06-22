import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ChartCardProps {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, badge, children }: ChartCardProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "16px",
        p: "16px",
        mb: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "12px",
        }}
      >
        <Typography sx={{ font: "600 16px Inter", color: "text.primary" }}>
          {title}
        </Typography>
        {badge}
      </Box>
      {children}
    </Box>
  );
}
