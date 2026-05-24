"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import {
  UI,
  PRODUCT_COLORS,
  SOURCE_DOMAIN_COLORS,
  PHASE_COLORS,
} from "./colors";
import { generateTrendSeries, TREND_BASELINES } from "./data";
import type { FilterState } from "./FilterSidebar";
import { QUARTER_OPTIONS, FY_OPTIONS, FY_TO_QUARTERS, QUARTER_TO_MONTHS } from "./FilterSidebar";

type Metric = "Volume" | "Sentiment";
type Grouping = "By Product" | "By Domain" | "By Phase";

const METRIC_OPTIONS: Metric[] = ["Volume", "Sentiment"];
const GROUPING_OPTIONS: Grouping[] = ["By Product", "By Domain", "By Phase"];

const COLOR_MAPS: Record<Grouping, Record<string, string>> = {
  "By Product": PRODUCT_COLORS,
  "By Domain": SOURCE_DOMAIN_COLORS,
  "By Phase": PHASE_COLORS,
};

const BASELINE_KEYS: Record<string, keyof typeof TREND_BASELINES> = {
  "Volume|By Product": "volumeByProduct",
  "Volume|By Domain": "volumeByDomain",
  "Volume|By Phase": "volumeByPhase",
  "Sentiment|By Product": "sentimentByProduct",
  "Sentiment|By Domain": "sentimentByDomain",
  "Sentiment|By Phase": "sentimentByPhase",
};

function TrendsTooltip({
  active,
  payload,
  label,
  isPercent,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  isPercent?: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: UI.tooltipBg,
        padding: "8px 12px",
        fontFamily: "var(--font-artifakt)",
        fontSize: 12,
        color: "#ffffff",
        minWidth: 140,
      }}
    >
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center justify-between gap-4"
        >
          <span className="flex items-center gap-1.5">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: entry.color,
                display: "inline-block",
              }}
            />
            {entry.name}
          </span>
          <span>
            {isPercent
              ? `${entry.value > 0 ? "+" : ""}${entry.value}%`
              : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function Dropdown<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1"
        style={{
          fontSize: 14,
          color: UI.textSecondary,
          fontFamily: "var(--font-artifakt)",
          borderBottom: `2px solid ${UI.accent}`,
          paddingBottom: 2,
          minWidth: 100,
        }}
      >
        <span>{value}</span>
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
          <path d="M1 1L4 4L7 1" stroke={UI.textMuted} strokeWidth="1.2" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 z-10 mt-1"
          style={{
            background: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: 120,
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="block w-full px-3 py-1.5 text-left"
              style={{
                fontSize: 12,
                fontFamily: "var(--font-artifakt)",
                color: UI.textSecondary,
                background: opt === value ? "#f5f5f5" : "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  opt === value ? "#f5f5f5" : "transparent")
              }
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DataPointLabel({
  x,
  y,
  value,
  isPercent,
}: {
  x?: number;
  y?: number;
  value?: number;
  isPercent: boolean;
}) {
  if (x == null || y == null || value == null) return null;
  const text = isPercent ? `${value}%` : value.toLocaleString();
  const padding = 4;
  const charWidth = 7;
  const boxWidth = text.length * charWidth + padding * 2;
  const boxHeight = 18;
  return (
    <g>
      <rect
        x={x - boxWidth / 2}
        y={y - boxHeight - 6}
        width={boxWidth}
        height={boxHeight}
        fill={UI.tooltipBg}
        rx={2}
      />
      <text
        x={x}
        y={y - boxHeight / 2 - 6 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontFamily="var(--font-artifakt)"
        fill="#ffffff"
      >
        {text}
      </text>
    </g>
  );
}

interface TrendsChartProps {
  filters: FilterState;
  onColorsChange?: (colors: Record<string, string>) => void;
  onTotalsChange?: (totals: Record<string, number>) => void;
  onGroupingChange?: (grouping: string) => void;
  onMetricChange?: (metric: string) => void;
  highlightedSeries: string | null;
  onSeriesHover: (series: string | null) => void;
  onSeriesLeave: () => void;
}

export default function TrendsChart({
  filters,
  onColorsChange,
  onTotalsChange,
  onGroupingChange,
  onMetricChange,
  highlightedSeries,
  onSeriesHover,
  onSeriesLeave,
}: TrendsChartProps) {
  const [metric, setMetric] = useState<Metric>("Volume");
  const [grouping, setGrouping] = useState<Grouping>("By Product");

  useEffect(() => {
    onGroupingChange?.(grouping);
  }, [grouping, onGroupingChange]);

  useEffect(() => {
    onMetricChange?.(metric);
  }, [metric, onMetricChange]);

  const colors = COLOR_MAPS[grouping];

  const periodLabels = useMemo(() => {
    if (filters.dateView === "quarter") {
      return [...QUARTER_OPTIONS].reverse().filter((r) => filters.dateRanges.includes(r));
    }
    const selectedFYs = [...FY_OPTIONS].reverse().filter((r) => filters.dateRanges.includes(r));
    if (selectedFYs.length === 1) {
      const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const quarters = FY_TO_QUARTERS[selectedFYs[0]] || [];
      const months = quarters.flatMap((q) => QUARTER_TO_MONTHS[q] || []);
      return months.map((m) => {
        const mo = parseInt(m.split("-")[1]) - 1;
        return MONTH_NAMES[mo];
      });
    }
    return selectedFYs;
  }, [filters.dateView, filters.dateRanges]);

  const rawData = useMemo(() => {
    const bKey = BASELINE_KEYS[`${metric}|${grouping}`];
    if (!bKey) return [];
    const cfg = TREND_BASELINES[bKey];
    return generateTrendSeries(
      cfg.baselines as Record<string, number>,
      cfg.seed,
      periodLabels,
      metric === "Sentiment",
    );
  }, [metric, grouping, periodLabels]);

  const data = useMemo(() => {
    if (grouping !== "By Phase") return rawData;
    const activePhases = new Set(filters.phases);
    return rawData.map((point) => {
      const filtered: Record<string, string | number> = { period: point.period };
      for (const [k, v] of Object.entries(point)) {
        if (k === "period") continue;
        if (activePhases.has(k as never)) filtered[k] = v;
      }
      return filtered;
    });
  }, [rawData, grouping, filters.phases]);

  const seriesKeys = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).filter((k) => k !== "period");
  }, [data]);

  const activeColors = useMemo(() => {
    const filtered: Record<string, string> = {};
    for (const k of seriesKeys) {
      if (colors[k]) filtered[k] = colors[k];
    }
    return filtered;
  }, [seriesKeys, colors]);

  useEffect(() => {
    onColorsChange?.(activeColors);
  }, [activeColors, onColorsChange]);

  const isPercent = metric === "Sentiment";

  const totals = useMemo(() => {
    const sums: Record<string, number> = {};
    const n = data.length || 1;
    for (const point of data) {
      for (const [k, v] of Object.entries(point)) {
        if (k !== "period" && typeof v === "number") {
          sums[k] = (sums[k] || 0) + v;
        }
      }
    }
    if (isPercent) {
      for (const k of Object.keys(sums)) {
        sums[k] = Math.round(sums[k] / n);
      }
    }
    return sums;
  }, [data, isPercent]);

  useEffect(() => {
    onTotalsChange?.(totals);
  }, [totals, onTotalsChange]);

  const yTicks = useMemo(() => {
    if (!isPercent || !data.length) return undefined;
    let min = 0;
    let max = 0;
    for (const point of data) {
      for (const [k, v] of Object.entries(point)) {
        if (k !== "period" && typeof v === "number") {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
    }
    const lo = Math.floor(min / 10) * 10;
    const hi = Math.ceil(max / 10) * 10;
    const ticks: number[] = [];
    for (let t = lo; t <= hi; t += 10) {
      ticks.push(t);
    }
    return ticks;
  }, [data, isPercent]);

  if (!data.length) {
    return (
      <div style={{ fontFamily: "var(--font-artifakt)", padding: 40, textAlign: "center", color: UI.textMuted }}>
        No data for the selected periods.
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-artifakt)" }}>
      <div className="mb-4 flex items-center gap-4">
        <Dropdown
          value={metric}
          options={METRIC_OPTIONS}
          onChange={(v) => {
            setMetric(v);
            onSeriesHover(null);
          }}
        />
        <Dropdown
          value={grouping}
          options={GROUPING_OPTIONS}
          onChange={(v) => {
            setGrouping(v);
            onSeriesHover(null);
          }}
        />
      </div>

      <ResponsiveContainer width="100%" height={393}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 60, bottom: 5, left: 10 }}
          onMouseLeave={onSeriesLeave}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#eeeeee"
            vertical={false}
          />
          {isPercent && (
            <ReferenceArea
              y1={0}
              y2={-9999}
              fill="#e0e0e0"
              fillOpacity={0.5}
              ifOverflow="hidden"
              strokeOpacity={0}
            />
          )}
          {isPercent && (
            <>
              {yTicks?.filter((t) => t < 0).map((t) => (
                <ReferenceLine key={t} y={t} stroke="#d0d0d0" strokeWidth={1} strokeDasharray="3 3" />
              ))}
              <ReferenceLine y={0} stroke="#cccccc" strokeWidth={1} />
            </>
          )}
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: UI.textMuted, fontFamily: "var(--font-artifakt)" }}
            tickLine={false}
            axisLine={{ stroke: "#cccccc" }}
            interval={0}
            angle={45}
            textAnchor="start"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12, fill: UI.textMuted, fontFamily: "var(--font-artifakt)" }}
            tickLine={false}
            axisLine={false}
            domain={isPercent && yTicks ? [yTicks[0] - 5, yTicks[yTicks.length - 1]] : ['auto', 'auto']}
            ticks={yTicks}
            tickFormatter={(v: number) => {
              if (isPercent) return `${v}%`;
              return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);
            }}
          />
          {!highlightedSeries && (
            <Tooltip
              content={<TrendsTooltip isPercent={isPercent} />}
              isAnimationActive={false}
              cursor={{ stroke: "#cccccc", strokeWidth: 1 }}
            />
          )}
          {seriesKeys.map((key) => {
            const isHighlighted = highlightedSeries === key;
            const isFaded =
              highlightedSeries !== null && highlightedSeries !== key;
            return (
              <Line
                key={key}
                type="linear"
                dataKey={key}
                stroke={isFaded ? "#d0d0d0" : (colors[key] || UI.accent)}
                strokeWidth={isHighlighted ? 3 : 2}
                dot={isHighlighted ? {
                  r: 3,
                  fill: colors[key] || UI.accent,
                  stroke: colors[key] || UI.accent,
                } : false}
                activeDot={{ r: 4 }}
                opacity={isFaded ? 0.4 : 1}
                isAnimationActive={!highlightedSeries}
                animationDuration={600}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => onSeriesHover(key)}
                onMouseLeave={onSeriesLeave}
                label={isHighlighted ? ((props: { x?: number; y?: number; value?: number }) => (
                    <DataPointLabel
                      x={props.x}
                      y={props.y}
                      value={props.value}
                      isPercent={isPercent}
                    />
                  )) as never : false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
