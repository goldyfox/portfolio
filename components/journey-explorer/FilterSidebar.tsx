"use client";

import { useState, useCallback } from "react";
import { UI, PHASES, SENTIMENT_COLORS } from "./colors";
import type { Phase, SentimentKey } from "./colors";

export const QUARTER_TO_MONTHS: Record<string, string[]> = {
  "FY21 Q4": ["2020-08", "2020-09", "2020-10"],
  "FY21 Q3": ["2020-05", "2020-06", "2020-07"],
  "FY21 Q2": ["2020-02", "2020-03", "2020-04"],
  "FY21 Q1": ["2019-11", "2019-12", "2020-01"],
  "FY20 Q4": ["2019-08", "2019-09", "2019-10"],
  "FY20 Q3": ["2019-05", "2019-06", "2019-07"],
  "FY20 Q2": ["2019-02", "2019-03", "2019-04"],
  "FY20 Q1": ["2018-11", "2018-12", "2019-01"],
};

export const FY_TO_QUARTERS: Record<string, string[]> = {
  FY21: ["FY21 Q1", "FY21 Q2", "FY21 Q3", "FY21 Q4"],
  FY20: ["FY20 Q1", "FY20 Q2", "FY20 Q3", "FY20 Q4"],
};

export const FY_OPTIONS = ["FY21", "FY20"];
export const QUARTER_OPTIONS = [
  "FY21 Q4",
  "FY21 Q3",
  "FY21 Q2",
  "FY21 Q1",
  "FY20 Q4",
  "FY20 Q3",
  "FY20 Q2",
  "FY20 Q1",
];

export type DateView = "fiscal_year" | "quarter";

export interface FilterState {
  dateView: DateView;
  dateRanges: string[];
  phases: Phase[];
  sentiments: SentimentKey[];
}

export const DEFAULT_FILTERS: FilterState = {
  dateView: "quarter",
  dateRanges: [...QUARTER_OPTIONS],
  phases: [...PHASES],
  sentiments: Object.keys(SENTIMENT_COLORS) as SentimentKey[],
};

export function getSelectedMonths(filters: FilterState): string[] {
  const months: string[] = [];
  if (filters.dateView === "fiscal_year") {
    for (const fy of filters.dateRanges) {
      const quarters = FY_TO_QUARTERS[fy] || [];
      for (const q of quarters) {
        months.push(...(QUARTER_TO_MONTHS[q] || []));
      }
    }
  } else {
    for (const q of filters.dateRanges) {
      months.push(...(QUARTER_TO_MONTHS[q] || []));
    }
  }
  return [...new Set(months)];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      style={{
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 200ms ease",
      }}
    >
      <path d="M1.5 1L6.5 6L1.5 11" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6h-1.5A4.5 4.5 0 117 2.5V5l3.5-2.5L7 0v1z"
        fill="#ffffff"
      />
    </svg>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2.5"
        style={{ color: "#ffffff", fontSize: 14, fontFamily: "var(--font-artifakt)" }}
      >
        <span>{title}</span>
        <ChevronIcon open={open} />
      </button>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }} />
      {open && (
        <div className="py-2" style={{ fontSize: 14 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Checkbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className="flex cursor-pointer items-center gap-2 py-1"
      style={{ color: "#ffffff", fontSize: 14, fontFamily: "var(--font-artifakt)" }}
      onClick={(e) => {
        e.preventDefault();
        onChange(!checked);
      }}
    >
      <span
        className="flex items-center justify-center"
        style={{
          width: 16,
          height: 16,
          border: "1px solid rgba(255,255,255,0.5)",
          background: checked ? "#ffffff" : "transparent",
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 3.5L3.5 6L9 1"
              stroke={UI.filterBg}
              strokeWidth="1.5"
            />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
}: FilterSidebarProps) {
  const setDateView = useCallback(
    (view: DateView) => {
      if (view === filters.dateView) return;
      let newRanges: string[];
      if (view === "quarter") {
        const quarters: string[] = [];
        for (const fy of filters.dateRanges) {
          quarters.push(...(FY_TO_QUARTERS[fy] || []));
        }
        newRanges = quarters.length ? quarters : [...QUARTER_OPTIONS];
      } else {
        const fySet = new Set<string>();
        for (const q of filters.dateRanges) {
          for (const [fy, qs] of Object.entries(FY_TO_QUARTERS)) {
            if (qs.includes(q)) fySet.add(fy);
          }
        }
        newRanges = fySet.size ? [...fySet] : [...FY_OPTIONS];
      }
      onFilterChange({ ...filters, dateView: view, dateRanges: newRanges });
    },
    [filters, onFilterChange],
  );

  const toggleRange = useCallback(
    (range: string) => {
      const next = filters.dateRanges.includes(range)
        ? filters.dateRanges.filter((r) => r !== range)
        : [...filters.dateRanges, range];
      if (next.length === 0) return;
      onFilterChange({ ...filters, dateRanges: next });
    },
    [filters, onFilterChange],
  );

  const togglePhase = useCallback(
    (phase: Phase) => {
      const next = filters.phases.includes(phase)
        ? filters.phases.filter((p) => p !== phase)
        : [...filters.phases, phase];
      if (next.length === 0) return;
      onFilterChange({ ...filters, phases: next });
    },
    [filters, onFilterChange],
  );

  const toggleSentiment = useCallback(
    (s: SentimentKey) => {
      const next = filters.sentiments.includes(s)
        ? filters.sentiments.filter((x) => x !== s)
        : [...filters.sentiments, s];
      if (next.length === 0) return;
      onFilterChange({ ...filters, sentiments: next });
    },
    [filters, onFilterChange],
  );

  const resetFilters = useCallback(() => {
    onFilterChange({ ...DEFAULT_FILTERS });
  }, [onFilterChange]);

  const rangeOptions =
    filters.dateView === "fiscal_year" ? FY_OPTIONS : QUARTER_OPTIONS;

  return (
    <div
      className="flex flex-col overflow-y-auto"
      style={{
        width: 232,
        background: UI.filterBg,
        fontFamily: "var(--font-artifakt)",
        minHeight: 0,
      }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span style={{ color: "#ffffff", fontSize: 19, fontWeight: 500 }}>
          Filter
        </span>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5"
          style={{ color: "#ffffff", fontSize: 14 }}
        >
          <RestartIcon />
          <span>Reset filters</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <FilterSection title="Date view" defaultOpen>
          <Checkbox
            checked={filters.dateView === "fiscal_year"}
            label="View by fiscal year"
            onChange={() => setDateView("fiscal_year")}
          />
          <Checkbox
            checked={filters.dateView === "quarter"}
            label="View by quarter"
            onChange={() => setDateView("quarter")}
          />
        </FilterSection>

        <FilterSection title="Date range" defaultOpen>
          {rangeOptions.map((range) => (
            <Checkbox
              key={range}
              checked={filters.dateRanges.includes(range)}
              label={range}
              onChange={() => toggleRange(range)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Journey phase">
          {PHASES.map((phase) => (
            <Checkbox
              key={phase}
              checked={filters.phases.includes(phase)}
              label={phase}
              onChange={() => togglePhase(phase)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Sentiment">
          {(Object.keys(SENTIMENT_COLORS) as SentimentKey[]).map((s) => (
            <Checkbox
              key={s}
              checked={filters.sentiments.includes(s)}
              label={s}
              onChange={() => toggleSentiment(s)}
            />
          ))}
        </FilterSection>
      </div>
    </div>
  );
}
