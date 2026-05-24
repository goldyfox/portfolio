"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { DATA_SOURCE_COLORS, UI, PHASES, SUBPHASES } from "./colors";
import type { Phase, DataSourceKey } from "./colors";
import { volumeData, subphaseVolumeData, sentimentData, dateMultiplier } from "./data";
import type { FilterState } from "./FilterSidebar";
import { getSelectedMonths } from "./FilterSidebar";
import type { SentimentKey } from "./colors";

type ViewMode = "phase" | "subphase";

interface VolumeChartProps {
  filters: FilterState;
  onPhaseSelect: (phase: Phase | null) => void;
  selectedPhase: Phase | null;
}

interface FlatSubphasePoint {
  label: string;
  parentPhase: string;
  Cases: number;
  Surveys: number;
  Forums: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
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
        minWidth: 120,
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
          <span>{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function RadioOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 outline-none"
      style={{ fontSize: 14, color: UI.textSecondary }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: selected ? "none" : "1.5px solid #bbbbbb",
          background: selected ? "#808080" : "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {selected && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ffffff",
            }}
          />
        )}
      </span>
      {label}
    </button>
  );
}

export default function VolumeChart({
  filters,
  onPhaseSelect,
  selectedPhase,
}: VolumeChartProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("phase");

  const sources: DataSourceKey[] = ["Cases", "Surveys", "Forums"];

  const selectedMonths = useMemo(
    () => getSelectedMonths(filters),
    [filters.dateView, filters.dateRanges],
  );

  const mult = useMemo(() => dateMultiplier(selectedMonths), [selectedMonths]);

  const sentimentScale = useMemo(() => {
    const ALL_SENTIMENTS: SentimentKey[] = ["Positive", "Neutral", "Negative", "Mixed", "Error"];
    const scale: Record<string, number> = {};
    for (const sd of sentimentData) {
      const selectedPct = ALL_SENTIMENTS
        .filter((k) => filters.sentiments.includes(k))
        .reduce((sum, k) => sum + sd[k], 0);
      scale[sd.phase] = selectedPct / 100;
    }
    return scale;
  }, [filters.sentiments]);

  const phaseData = useMemo(
    () =>
      volumeData
        .filter((d) => filters.phases.includes(d.phase))
        .map((d) => {
          const s = sentimentScale[d.phase] ?? 1;
          return {
            ...d,
            Cases: Math.round(d.Cases * mult * s),
            Surveys: Math.round(d.Surveys * mult * s),
            Forums: Math.round(d.Forums * mult * s),
          };
        }),
    [filters.phases, mult, sentimentScale],
  );

  const flatSubphaseData = useMemo<FlatSubphasePoint[]>(() => {
    const result: FlatSubphasePoint[] = [];
    for (const phase of PHASES) {
      if (!filters.phases.includes(phase)) continue;
      const s = sentimentScale[phase] ?? 1;
      const subs = subphaseVolumeData[phase] || [];
      for (const sub of subs) {
        result.push({
          label: sub.subphase,
          parentPhase: phase,
          Cases: Math.round(sub.Cases * mult * s),
          Surveys: Math.round(sub.Surveys * mult * s),
          Forums: Math.round(sub.Forums * mult * s),
        });
      }
    }
    return result;
  }, [filters.phases, mult, sentimentScale]);

  const drillDownData = useMemo(() => {
    if (!selectedPhase) return [];
    const s = sentimentScale[selectedPhase] ?? 1;
    return (subphaseVolumeData[selectedPhase] || []).map((sub) => ({
      ...sub,
      Cases: Math.round(sub.Cases * mult * s),
      Surveys: Math.round(sub.Surveys * mult * s),
      Forums: Math.round(sub.Forums * mult * s),
    }));
  }, [selectedPhase, mult, sentimentScale]);

  const isDrillDown = selectedPhase !== null;

  const chartData = isDrillDown
    ? drillDownData
    : viewMode === "subphase"
      ? flatSubphaseData
      : phaseData;

  const xKey = isDrillDown
    ? "subphase"
    : viewMode === "subphase"
      ? "label"
      : "phase";

  const phaseBoundaries = useMemo(() => {
    if (viewMode !== "subphase" || isDrillDown) return [];
    const boundaries: number[] = [];
    let count = 0;
    for (const phase of PHASES) {
      if (!filters.phases.includes(phase)) continue;
      const subs = subphaseVolumeData[phase] || [];
      count += subs.length;
      boundaries.push(count);
    }
    boundaries.pop();
    return boundaries;
  }, [viewMode, isDrillDown, filters.phases]);

  return (
    <div style={{ fontFamily: "var(--font-artifakt)" }}>
      <div className="mb-3 flex items-center gap-4">
        <RadioOption
          label="Phase"
          selected={viewMode === "phase" && !isDrillDown}
          onClick={() => { setViewMode("phase"); onPhaseSelect(null); }}
        />
        <RadioOption
          label="Subphase"
          selected={viewMode === "subphase" || isDrillDown}
          onClick={() => { setViewMode("subphase"); onPhaseSelect(null); }}
        />
      </div>

      <ResponsiveContainer width="100%" height={393}>
        <BarChart
          data={chartData as Record<string, unknown>[]}
          margin={{ top: 10, right: 10, bottom: viewMode === "subphase" && !isDrillDown ? 40 : 5, left: 0 }}
          barGap={1}
          barCategoryGap={viewMode === "subphase" && !isDrillDown ? "10%" : "20%"}
          onMouseLeave={() => setHoveredKey(null)}
        >
          <CartesianGrid
            strokeDasharray="none"
            stroke="#eeeeee"
            vertical={false}
          />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: UI.textMuted, fontFamily: "var(--font-artifakt)" }}
            tickLine={false}
            axisLine={{ stroke: "#cccccc" }}
            interval={0}
            angle={viewMode === "subphase" && !isDrillDown ? -45 : 0}
            textAnchor={viewMode === "subphase" && !isDrillDown ? "end" : "middle"}
            height={viewMode === "subphase" && !isDrillDown ? 70 : 30}
          />
          <YAxis
            tick={{ fontSize: 12, fill: UI.textMuted, fontFamily: "var(--font-artifakt)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          {viewMode === "subphase" &&
            !isDrillDown &&
            phaseBoundaries.map((idx) => (
              <ReferenceLine
                key={idx}
                x={flatSubphaseData[idx]?.label}
                stroke="#dcdcdc"
                strokeDasharray="3 3"
              />
            ))}
          {sources.map((source) => (
            <Bar
              key={source}
              dataKey={source}
              stackId="volume"
              fill={DATA_SOURCE_COLORS[source]}
              barSize={viewMode === "subphase" && !isDrillDown ? 12 : 18}
              cursor={!isDrillDown && viewMode === "phase" ? "pointer" : "default"}
              onMouseEnter={(data) => {
                const d = data as unknown as Record<string, string>;
                const key =
                  isDrillDown
                    ? d?.subphase
                    : viewMode === "subphase"
                      ? d?.label
                      : d?.phase;
                if (key) setHoveredKey(key);
              }}
              onClick={(data) => {
                const d = data as unknown as Record<string, string>;
                if (!isDrillDown && viewMode === "phase" && d?.phase) {
                  onPhaseSelect(d.phase as Phase);
                }
              }}
            >
              {chartData.map((entry, idx) => {
                const key =
                  isDrillDown
                    ? (entry as { subphase?: string }).subphase
                    : viewMode === "subphase"
                      ? (entry as FlatSubphasePoint).label
                      : (entry as { phase?: string }).phase;
                const dimmed = hoveredKey !== null && hoveredKey !== key;
                return <Cell key={`${key}-${idx}`} opacity={dimmed ? 0.4 : 1} />;
              })}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
