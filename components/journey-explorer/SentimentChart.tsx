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
} from "recharts";
import { SENTIMENT_COLORS, UI } from "./colors";
import type { SentimentKey } from "./colors";
import { sentimentData } from "./data";
import type { FilterState } from "./FilterSidebar";

type SentimentView = "phase" | "subphase";

interface SentimentChartProps {
  filters: FilterState;
}

function SentimentTooltip({
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
        minWidth: 130,
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
          <span>{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

const ALL_SENTIMENT_KEYS: SentimentKey[] = [
  "Positive",
  "Neutral",
  "Negative",
  "Mixed",
  "Error",
];

export default function SentimentChart({ filters }: SentimentChartProps) {
  const [view, setView] = useState<SentimentView>("phase");

  const filteredPhaseData = useMemo(() => {
    const phaseFiltered = sentimentData.filter((d) =>
      filters.phases.includes(d.phase)
    );
    return phaseFiltered.map((d) => {
      const activeTotal = filters.sentiments.reduce(
        (sum, k) => sum + d[k],
        0
      );
      if (activeTotal === 0) return d;
      const scale = 100 / activeTotal;
      return {
        phase: d.phase,
        Positive: filters.sentiments.includes("Positive") ? Math.round(d.Positive * scale) : 0,
        Neutral: filters.sentiments.includes("Neutral") ? Math.round(d.Neutral * scale) : 0,
        Negative: filters.sentiments.includes("Negative") ? Math.round(d.Negative * scale) : 0,
        Mixed: filters.sentiments.includes("Mixed") ? Math.round(d.Mixed * scale) : 0,
        Error: filters.sentiments.includes("Error") ? Math.round(d.Error * scale) : 0,
      };
    });
  }, [filters.phases, filters.sentiments]);

  const STACK_ORDER: SentimentKey[] = ["Error", "Mixed", "Negative", "Neutral", "Positive"];

  const views: { key: SentimentView; label: string }[] = [
    { key: "phase", label: "Phase" },
    { key: "subphase", label: "Subphase" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-artifakt)" }}>
      <div className="mb-4 flex items-center gap-4">
        {views.map((v) => {
          const isActive = v.key === view;
          return (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className="flex items-center gap-1.5"
              style={{ fontSize: 14, color: UI.textSecondary }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: isActive ? "none" : "1.5px solid #bbbbbb",
                  background: isActive ? "#808080" : "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isActive && (
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
              {v.label}
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={393}>
        <BarChart
          data={filteredPhaseData}
          margin={{ top: 10, right: 10, bottom: 5, left: 0 }}
          barCategoryGap="15%"
        >
          <CartesianGrid
            strokeDasharray="none"
            stroke="#eeeeee"
            vertical={false}
          />
          <XAxis
            dataKey="phase"
            tick={{ fontSize: 12, fill: UI.textMuted, fontFamily: "var(--font-artifakt)" }}
            tickLine={false}
            axisLine={{ stroke: "#cccccc" }}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 12, fill: UI.textMuted, fontFamily: "var(--font-artifakt)" }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<SentimentTooltip />} />
          {STACK_ORDER.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="sentiment"
              fill={SENTIMENT_COLORS[key]}
              barSize={view === "subphase" ? 14 : 50}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
