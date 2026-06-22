import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import type { MetabolicZone } from "@/types";

interface TimerRingProps {
  progress: number;
  elapsed: string;
  zone: MetabolicZone;
  zoneLabel: string;
  goalHours: number;
  isActive: boolean;
}

const SIZE = 220;
const R = 99;
const STROKE = 13;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function TimerRing({
  progress,
  elapsed,
  zoneLabel,
  goalHours,
  isActive,
}: TimerRingProps) {
  const { tokens } = useTheme();
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const offset = CIRCUMFERENCE - (clampedProgress / 100) * CIRCUMFERENCE;

  const progressAngle = (clampedProgress / 100) * 360;
  const progressRad = ((progressAngle - 90) * Math.PI) / 180;
  const dotX = SIZE / 2 + R * Math.cos(progressRad);
  const dotY = SIZE / 2 + R * Math.sin(progressRad);

  return (
    <Box sx={{ position: "relative", width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <defs>
          <linearGradient id="timerGrad" x1="0.1" y1="0.95" x2="0.9" y2="0.05">
            <stop offset="0" stopColor="#8ADE88" />
            <stop offset="0.4" stopColor="#F8BF24" />
            <stop offset="0.75" stopColor="#F0932C" />
            <stop offset="1" stopColor="#F87171" />
          </linearGradient>
          <filter id="timerGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {isActive ? (
          <>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={tokens.track}
              strokeWidth={STROKE}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="url(#timerGrad)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              filter="url(#timerGlow)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
            {clampedProgress > 0 && (
              <circle
                cx={dotX}
                cy={dotY}
                r={6.5}
                fill="#fff"
                filter="url(#timerGlow)"
              />
            )}
          </>
        ) : (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={tokens.track}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="1.5 11"
          />
        )}
      </svg>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
        }}
      >
        <Box
          component="span"
          sx={{
            font: '600 11px Inter',
            letterSpacing: "0.17em",
            color: "text.secondary",
          }}
        >
          {isActive ? zoneLabel.toUpperCase() : "SINCE LAST FAST"}
        </Box>
        <Box
          component="span"
          sx={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            fontSize: 34,
            color: "text.primary",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {elapsed}
        </Box>
        <Box
          component="span"
          sx={{
            font: '500 12px Inter',
            letterSpacing: "0.05em",
            color: "primary.main",
          }}
        >
          EDIT {goalHours}H GOAL
        </Box>
      </Box>
    </Box>
  );
}
