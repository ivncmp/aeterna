import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";
import { TimeRangeSelector } from "@/components/charts/TimeRangeSelector";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { DeltaBadge } from "@/components/charts/DeltaBadge";
import { formatDate, sleepBarColor, MOOD_EMOJIS } from "@/lib/chart-utils";
import {
  useWeightSeries,
  useFastingSeries,
  useNutritionSeries,
  useSleepSeries,
  useWaterSeries,
  useMoodSeries,
} from "@/hooks/useChartData";
import { ZONE_CONFIG } from "@/lib/zones";
import type { TimeRange, MetabolicZone } from "@/types";

const RANGE_DAYS: Record<TimeRange, number> = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
  ALL: 365,
};

export function History() {
  const theme = useTheme();
  const [range, setRange] = useState<TimeRange>("1W");
  const days = RANGE_DAYS[range];

  const AXIS_STYLE = {
    fontSize: 10,
    fill: theme.tokens.textTertiary,
    fontFamily: "Inter",
  };

  const GRID_STROKE = theme.palette.divider;

  const { data: weight = [] } = useWeightSeries(days);
  const { data: fasting = [] } = useFastingSeries(days);
  const { data: nutrition = [] } = useNutritionSeries(days);
  const { data: sleep = [] } = useSleepSeries(days);
  const { data: water = [] } = useWaterSeries(days);
  const { data: mood = [] } = useMoodSeries(days);

  const weightDelta =
    weight.length >= 2
      ? weight[weight.length - 1].weight - weight[0].weight
      : 0;

  return (
    <Box sx={{ pb: "24px" }}>
      <Typography
        sx={{
          font: "700 24px Inter",
          color: "text.primary",
          px: "20px",
          pt: "8px",
          pb: "12px",
        }}
      >
        History
      </Typography>

      <TimeRangeSelector value={range} onChange={setRange} />

      <Box sx={{ px: "16px" }}>
        {/* Weight Chart */}
        <ChartCard
          title="Weight"
          badge={<DeltaBadge value={weightDelta} unit="kg" />}
        >
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weight}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke={theme.palette.text.primary}
                strokeWidth={2}
                dot={false}
                name="Weight"
              />
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#F0932C"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                dot={false}
                name="Trend"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fasting Chart */}
        <ChartCard title="Fasting">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={fasting}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                width={32}
                unit="h"
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={16}
                stroke="#F0932C"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
                label={{
                  value: "Goal",
                  position: "right",
                  fill: "#F0932C",
                  fontSize: 10,
                }}
              />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]} name="Hours">
                {fasting.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={ZONE_CONFIG[entry.zone as MetabolicZone].color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Nutrition Chart */}
        <ChartCard title="Nutrition">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={nutrition}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="cal"
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <YAxis
                yAxisId="prot"
                orientation="right"
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                width={28}
                unit="g"
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                yAxisId="cal"
                y={2000}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="4 4"
              />
              <ReferenceLine
                yAxisId="prot"
                y={128}
                stroke="rgba(240,147,44,0.3)"
                strokeDasharray="4 4"
              />
              <Line
                yAxisId="cal"
                type="monotone"
                dataKey="calories"
                stroke={theme.palette.text.primary}
                strokeWidth={2}
                dot={false}
                name="Calories"
              />
              <Line
                yAxisId="prot"
                type="monotone"
                dataKey="protein"
                stroke="#F0932C"
                strokeWidth={2}
                dot={false}
                name="Protein"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Sleep Chart */}
        <ChartCard title="Sleep">
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={sleep}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="hours"
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                width={28}
                unit="h"
              />
              <YAxis
                yAxisId="quality"
                orientation="right"
                domain={[0, 5]}
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                yAxisId="hours"
                dataKey="hours"
                radius={[4, 4, 0, 0]}
                name="Hours"
              >
                {sleep.map((entry, i) => (
                  <Cell key={i} fill={sleepBarColor(entry.hours)} />
                ))}
              </Bar>
              <Line
                yAxisId="quality"
                type="monotone"
                dataKey="quality"
                stroke="#A78BFA"
                strokeWidth={2}
                dot={{ r: 3, fill: "#A78BFA" }}
                name="Quality"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Water Chart */}
        <ChartCard title="Water">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={water}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                width={36}
                unit="ml"
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={2000}
                stroke="#60A5FA"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
                label={{
                  value: "Goal",
                  position: "right",
                  fill: "#60A5FA",
                  fontSize: 10,
                }}
              />
              <Bar
                dataKey="ml"
                radius={[4, 4, 0, 0]}
                fill="#60A5FA"
                name="Water"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Mood Chart */}
        <ChartCard title="Mood">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={mood}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(v: number) => MOOD_EMOJIS[v] ?? ""}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const val = payload[0].value as number;
                  return (
                    <Box
                      sx={{
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: "8px",
                        p: "8px 12px",
                      }}
                    >
                      <Typography
                        sx={{
                          font: "500 11px Inter",
                          color: theme.palette.text.secondary,
                          mb: "4px",
                        }}
                      >
                        {label ? formatDate(label as string) : ""}
                      </Typography>
                      <Typography sx={{ font: "500 16px Inter" }}>
                        {MOOD_EMOJIS[val]}
                      </Typography>
                    </Box>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#F8BF24"
                strokeWidth={2}
                dot={{ r: 4, fill: "#F8BF24" }}
                name="Mood"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>
    </Box>
  );
}
