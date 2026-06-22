import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

interface ProgressGaugeProps {
  value: number;
  unit: string;
  progress: number;
  size?: number;
}

const DEFAULT_SIZE = 94;

export function ProgressGauge({
  value,
  unit,
  progress,
  size = DEFAULT_SIZE,
}: ProgressGaugeProps) {
  const { tokens } = useTheme();
  const r = (size / 2) - 8;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(progress, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="protGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#F0932C" stopOpacity={0.5} />
            <stop offset="1" stopColor="#F0932C" />
          </linearGradient>
          <filter
            id="protGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="2.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tokens.track}
          strokeWidth={9}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#protGrad)"
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter="url(#protGlow)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: 25,
            color: "text.primary",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {value}
          <Box
            component="span"
            sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}
          >
            {unit}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
