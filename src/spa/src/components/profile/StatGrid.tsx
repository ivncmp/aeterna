import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

interface StatGridProps {
  items: StatItem[];
}

export function StatGrid({ items }: StatGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1px",
        bgcolor: "divider",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            bgcolor: "background.paper",
            p: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <Typography
            sx={{
              font: "700 20px Inter",
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {item.icon && <span>{item.icon}</span>}
            {item.value}
          </Typography>
          <Typography sx={{ font: "400 12px Inter", color: "text.secondary" }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
