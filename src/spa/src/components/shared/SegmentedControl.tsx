import Box from "@mui/material/Box";

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.paper",
        borderRadius: "12px",
        p: "4px",
        gap: "4px",
        mb: 2,
        flexShrink: 0,
      }}
    >
      {options.map((opt) => {
        const isActive = opt === value;
        return (
          <Box
            key={opt}
            component="button"
            onClick={() => onChange(opt)}
            sx={{
              flex: 1,
              textAlign: "center",
              font: "600 13px Inter",
              py: "9px",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              bgcolor: isActive ? "primary.main" : "transparent",
              color: isActive ? "#fff" : "text.secondary",
              transition: "all 0.2s ease",
            }}
          >
            {opt}
          </Box>
        );
      })}
    </Box>
  );
}
