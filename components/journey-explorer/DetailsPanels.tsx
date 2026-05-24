"use client";

import { useState, useMemo, type ReactNode } from "react";
import {
  UI,
  DATA_SOURCE_COLORS,
  SENTIMENT_COLORS,
  PRODUCT_COLORS,
  PHASE_COLORS,
} from "./colors";
import type { SentimentKey, DataSourceKey } from "./colors";
import {
  volumeData,
  sentimentData,
  taxonomyTopics,
  sampleComments,
  dateMultiplier,
} from "./data";
import type { FilterState } from "./FilterSidebar";
import { getSelectedMonths } from "./FilterSidebar";

/** Single source of truth for “total volume / comments” on Volume + Sentiment tabs (matches chart scaling). */
export function computeVolumeBackedCommentTotal(filters: FilterState): number {
  const selectedMonths = getSelectedMonths(filters);
  const mult = dateMultiplier(selectedMonths);
  const ALL_S: SentimentKey[] = ["Positive", "Neutral", "Negative", "Mixed", "Error"];
  return volumeData
    .filter((d) => filters.phases.includes(d.phase))
    .reduce((acc, d) => {
      const sd = sentimentData.find((s) => s.phase === d.phase);
      const sf = sd
        ? ALL_S.filter((k) => filters.sentiments.includes(k)).reduce((sum, k) => sum + sd[k], 0) /
          100
        : 1;
      return (
        acc +
        Math.round(d.Cases * mult * sf) +
        Math.round(d.Surveys * mult * sf) +
        Math.round(d.Forums * mult * sf)
      );
    }, 0);
}

function highlightText(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (terms.some((t) => part.toLowerCase() === t.toLowerCase())) {
      return (
        <mark
          key={i}
          style={{
            background: "#fff3b0",
            color: "inherit",
            padding: "1px 2px",
            borderRadius: 2,
          }}
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

type ActiveTab = "Volume" | "Sentiment" | "Trends";

interface DetailsPanelsProps {
  filters: FilterState;
  activeTab: ActiveTab;
  trendColors?: Record<string, string>;
  trendTotals?: Record<string, number>;
  trendMetric?: string;
  highlightedSeries?: string | null;
  onSeriesHover?: (series: string | null) => void;
  onSeriesLeave?: () => void;
}

function VolumeDetails({ filters }: { filters: FilterState }) {
  const selectedMonths = useMemo(
    () => getSelectedMonths(filters),
    [filters.dateView, filters.dateRanges],
  );

  const mult = useMemo(() => dateMultiplier(selectedMonths), [selectedMonths]);

  const ALL_SENTIMENTS: SentimentKey[] = ["Positive", "Neutral", "Negative", "Mixed", "Error"];

  const totals = useMemo(() => {
    const filtered = volumeData.filter((d) => filters.phases.includes(d.phase));
    return filtered.reduce(
      (acc, d) => {
        const sd = sentimentData.find((s) => s.phase === d.phase);
        const sFactor = sd
          ? ALL_SENTIMENTS.filter((k) => filters.sentiments.includes(k)).reduce((sum, k) => sum + sd[k], 0) / 100
          : 1;
        return {
          Cases: acc.Cases + Math.round(d.Cases * mult * sFactor),
          Surveys: acc.Surveys + Math.round(d.Surveys * mult * sFactor),
          Forums: acc.Forums + Math.round(d.Forums * mult * sFactor),
        };
      },
      { Cases: 0, Surveys: 0, Forums: 0 }
    );
  }, [filters.phases, filters.sentiments, mult]);

  const grandTotal = useMemo(() => computeVolumeBackedCommentTotal(filters), [filters]);

  const sources: { key: DataSourceKey; value: number }[] = [
    { key: "Forums", value: totals.Forums },
    { key: "Surveys", value: totals.Surveys },
    { key: "Cases", value: totals.Cases },
  ];

  return (
    <div className="p-4" style={{ background: UI.contentBg }}>
      <h4
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: UI.textPrimary,
          marginBottom: 12,
        }}
      >
        Volume Details
      </h4>
      {sources.map((s) => (
        <div
          key={s.key}
          className="mb-2 flex items-center gap-2"
          style={{ fontSize: 12, color: UI.textSecondary }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: DATA_SOURCE_COLORS[s.key],
              flexShrink: 0,
            }}
          />
          <span className="flex-1">
            {s.key} Volume
            <br />
            <span style={{ fontWeight: 500 }}>
              {s.value.toLocaleString()}
            </span>
          </span>
        </div>
      ))}
      <div
        className="mt-3 border-t pt-2"
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: UI.textPrimary,
          borderColor: UI.border,
        }}
      >
        Total: {grandTotal.toLocaleString()}
      </div>
    </div>
  );
}

function SentimentDetails({ filters }: { filters: FilterState }) {
  const ALL_S: SentimentKey[] = ["Positive", "Neutral", "Negative", "Mixed", "Error"];

  const grandTotal = useMemo(() => computeVolumeBackedCommentTotal(filters), [filters]);

  const entries = useMemo(() => {
    const months = getSelectedMonths(filters);
    const mult = dateMultiplier(months);
    const gt = computeVolumeBackedCommentTotal(filters);
    const keys = (Object.keys(SENTIMENT_COLORS) as SentimentKey[]).filter((k) =>
      filters.sentiments.includes(k),
    );
    const volAcc: Record<SentimentKey, number> = {
      Positive: 0,
      Neutral: 0,
      Negative: 0,
      Mixed: 0,
      Error: 0,
    };

    for (const d of volumeData.filter((row) => filters.phases.includes(row.phase))) {
      const sd = sentimentData.find((s) => s.phase === d.phase);
      if (!sd) continue;
      const sf =
        ALL_S.filter((k) => filters.sentiments.includes(k)).reduce((sum, k) => sum + sd[k], 0) /
        100;
      const phaseVol =
        Math.round(d.Cases * mult * sf) +
        Math.round(d.Surveys * mult * sf) +
        Math.round(d.Forums * mult * sf);
      const activeSum = keys.reduce((sum, k) => sum + sd[k], 0);
      if (activeSum <= 0) continue;
      for (const k of keys) {
        volAcc[k] += phaseVol * (sd[k] / activeSum);
      }
    }

    return keys.map((k) => {
      const volume = Math.round(volAcc[k]);
      const pct =
        gt > 0 ? Math.min(100, Math.max(0, Math.round((volAcc[k] / gt) * 100))) : 0;
      return { key: k, pct, volume };
    });
  }, [filters]);

  const totalPct = entries.reduce((a, e) => a + e.pct, 0);

  return (
    <div className="p-4" style={{ background: UI.contentBg }}>
      <h4
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: UI.textPrimary,
          marginBottom: 12,
        }}
      >
        Sentiment Details
      </h4>
      {entries.map((e) => (
        <div
          key={e.key}
          className="mb-2 flex items-center gap-2"
          style={{ fontSize: 12, color: UI.textSecondary }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: SENTIMENT_COLORS[e.key],
              flexShrink: 0,
            }}
          />
          <span className="flex-1">
            {e.key} Total
            <br />
            <span style={{ fontWeight: 500 }}>
              {e.volume.toLocaleString()} ({e.pct}%)
            </span>
          </span>
        </div>
      ))}
      <div
        className="mt-3 border-t pt-2"
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: UI.textPrimary,
          borderColor: UI.border,
        }}
      >
        Total: {grandTotal.toLocaleString()} ({totalPct}%)
      </div>
    </div>
  );
}

function TaxonomyPanel() {
  const maxCount = taxonomyTopics[0]?.count || 1;

  return (
    <div className="p-4" style={{ background: UI.contentBg }}>
      <h4
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: UI.textPrimary,
          marginBottom: 12,
        }}
      >
        Taxonomy
      </h4>
      {taxonomyTopics.map((topic) => (
        <div key={topic.name} className="mb-3">
          <div
            className="mb-1 flex items-center justify-between"
            style={{ fontSize: 12, color: UI.textSecondary }}
          >
            <span>{topic.name}</span>
            <span>{topic.count.toLocaleString()}</span>
          </div>
          <div
            style={{
              height: 10,
              background: "#eeeeee",
              width: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(topic.count / maxCount) * 100}%`,
                background: "#808080",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentCard({
  comment,
  activeTab = "Volume",
  trendGrouping = "By Product",
  searchTerms = [],
}: {
  comment: (typeof sampleComments)[number];
  activeTab?: string;
  trendGrouping?: string;
  searchTerms?: string[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-2">
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background:
              activeTab === "Sentiment"
                ? SENTIMENT_COLORS[comment.sentiment]
                : activeTab === "Trends"
                  ? trendGrouping === "By Domain"
                    ? DATA_SOURCE_COLORS[comment.source as DataSourceKey] || UI.textMuted
                    : trendGrouping === "By Phase"
                      ? PHASE_COLORS[comment.phase] || UI.textMuted
                      : PRODUCT_COLORS[comment.product] || UI.textMuted
                  : DATA_SOURCE_COLORS[comment.source as DataSourceKey] || UI.textMuted,
            flexShrink: 0,
            marginTop: 5,
          }}
        />
        <div className="flex-1">
          <div
            style={{
              fontSize: 14,
              color: UI.textPrimary,
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            {highlightText(comment.title, searchTerms)}
          </div>

          <div
            className="flex items-center gap-2 mb-3"
            style={{ fontSize: 14, color: UI.textSecondary }}
          >
            <span>{comment.source}</span>
            <span style={{ color: UI.border }}>|</span>
            <span>{comment.date}</span>
            <span style={{ color: UI.border }}>|</span>
            <span>{comment.forum}</span>
          </div>

          <p
            style={{
              fontSize: 14,
              color: UI.textSecondary,
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            {highlightText(comment.text, searchTerms)}
          </p>

          {expanded && (
            <table
              className="mb-4"
              style={{
                fontSize: 14,
                borderCollapse: "separate",
                borderSpacing: "24px 4px",
                marginLeft: -24,
              }}
            >
              <thead>
                <tr>
                  <td style={{ color: UI.textMuted }}>Sentiment</td>
                  <td style={{ color: UI.textMuted, whiteSpace: "nowrap" }}>Customer Journey</td>
                  <td style={{ color: UI.textMuted }}>Product</td>
                  <td style={{ color: UI.textMuted }}>Version</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: UI.textSecondary }}>{comment.sentiment}</td>
                  <td style={{ color: UI.textSecondary }}>{comment.phase} / {comment.subphase}</td>
                  <td style={{ color: UI.textSecondary }}>{comment.product}</td>
                  <td style={{ color: UI.textSecondary }}>1.2.324</td>
                </tr>
              </tbody>
            </table>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            style={{ fontSize: 12, color: UI.textMuted }}
            className="flex items-center gap-1"
          >
            {expanded ? "Show less" : "Show more"}
            <svg
              width="8"
              height="5"
              viewBox="0 0 8 5"
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms",
              }}
            >
              <path d="M1 1L4 4L7 1" stroke={UI.textMuted} strokeWidth="1" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentsPanel({
  filters,
  activeTab = "Volume",
  trendGrouping = "By Product",
  searchTerms = [],
  expanded = false,
  onCollapse,
  trendsLegendTotal = null,
}: {
  filters: FilterState;
  activeTab?: string;
  trendGrouping?: string;
  searchTerms?: string[];
  expanded?: boolean;
  onCollapse?: () => void;
  /** When set (Trends tab), toolbar total matches right-rail aggregate. */
  trendsLegendTotal?: string | null;
}) {
  const [sortBy, setSortBy] = useState("Newest to oldest");
  const effectiveSort = searchTerms.length ? "Most relevant" : sortBy;

  const selectedMonths = useMemo(
    () => getSelectedMonths(filters),
    [filters.dateView, filters.dateRanges],
  );

  const volumeBackedTotal = useMemo(() => computeVolumeBackedCommentTotal(filters), [filters]);

  const toolbarTotalLabel =
    activeTab === "Trends" && trendsLegendTotal != null
      ? trendsLegendTotal
      : volumeBackedTotal.toLocaleString();

  const filtered = useMemo(() => {
    const periodSet = new Set(selectedMonths);
    let list = sampleComments.filter(
      (c) =>
        filters.phases.includes(c.phase) &&
        filters.sentiments.includes(c.sentiment) &&
        periodSet.has(c.isoDate.slice(0, 7))
    );

    if (searchTerms.length) {
      list = list.filter((c) => {
        const haystack = `${c.title} ${c.text}`.toLowerCase();
        return searchTerms.every((t) => haystack.includes(t));
      });
      list.sort((a, b) => {
        const aText = `${a.title} ${a.text}`.toLowerCase();
        const bText = `${b.title} ${b.text}`.toLowerCase();
        const aHits = searchTerms.reduce((n, t) => n + (aText.split(t).length - 1), 0);
        const bHits = searchTerms.reduce((n, t) => n + (bText.split(t).length - 1), 0);
        return bHits - aHits;
      });
    } else {
      const dir = effectiveSort === "Newest to oldest" ? -1 : 1;
      list.sort((a, b) => dir * a.isoDate.localeCompare(b.isoDate));
    }

    return list;
  }, [filters.phases, filters.sentiments, selectedMonths, searchTerms, effectiveSort]);

  return (
    <div style={{ background: UI.contentBg }}>
      {/* All Comments header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${UI.border}` }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: UI.textPrimary,
          }}
        >
          All Comments
        </span>
        {expanded && (
          <div className="flex items-center gap-3">
            {/* Download icon */}
            <button style={{ color: UI.textMuted }} title="Download">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v10M4 8l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
                <path d="M2 13h12" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            {/* Minimize icon — four right angles pointing inward */}
            <button style={{ color: UI.textMuted }} title="Collapse window" onClick={onCollapse}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 5h4V1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M15 5h-4V1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M1 11h4v4" stroke="currentColor" strokeWidth="1.2" />
                <path d="M15 11h-4v4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Toolbar row */}
      <div
        className="flex items-center gap-4 px-4 py-2"
        style={{ fontSize: 14, borderBottom: `1px solid ${UI.border}` }}
      >
        <span style={{ color: UI.textSecondary, fontWeight: 500 }}>
          Total: {toolbarTotalLabel}
        </span>
        <span style={{ color: UI.textMuted }}>Sort by:</span>
        <button
          onClick={() => {
            if (!searchTerms.length) {
              setSortBy(
                sortBy === "Newest to oldest"
                  ? "Oldest to newest"
                  : "Newest to oldest"
              );
            }
          }}
          className="flex items-center gap-1"
          style={{ color: UI.textSecondary, cursor: searchTerms.length ? "default" : "pointer" }}
        >
          {effectiveSort}
          <svg width="8" height="5" viewBox="0 0 8 5">
            <path d="M1 1L4 4L7 1" stroke={UI.textMuted} strokeWidth="1" fill="none" />
          </svg>
        </button>
        {expanded && (
          <>
            <button
              className="flex items-center gap-1"
              style={{ color: UI.textSecondary }}
            >
              Cases
              <svg width="8" height="5" viewBox="0 0 8 5">
                <path d="M1 1L4 4L7 1" stroke={UI.textMuted} strokeWidth="1" fill="none" />
              </svg>
            </button>
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-8 text-center" style={{ color: UI.textMuted, fontSize: 14 }}>
          No comments match the current filters.
        </div>
      ) : (
        <div
          className="divide-y overflow-y-auto"
          style={{ borderColor: UI.border, maxHeight: expanded ? "none" : 430 }}
        >
          {filtered.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              activeTab={activeTab}
              trendGrouping={trendGrouping}
              searchTerms={searchTerms}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TrendsDetails({
  colors,
  totals,
  metric,
  highlightedSeries,
  onSeriesHover,
  onSeriesLeave,
}: {
  colors: Record<string, string>;
  totals: Record<string, number>;
  metric?: string;
  highlightedSeries: string | null;
  onSeriesHover: (series: string | null) => void;
  onSeriesLeave: () => void;
}) {
  const entries = Object.entries(colors);
  if (!entries.length) return null;

  const isSentiment = metric === "Sentiment";
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  return (
    <div
      className="p-4"
      style={{ background: UI.contentBg }}
      onMouseLeave={onSeriesLeave}
    >
      <h4
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: UI.textPrimary,
          marginBottom: 12,
        }}
      >
        Trends Details
      </h4>
      {entries.map(([name, color]) => {
        const isActive = highlightedSeries === name;
        const isFaded =
          highlightedSeries !== null && highlightedSeries !== name;
        const val = totals[name] || 0;
        const display = isSentiment
          ? `${val > 0 ? "+" : ""}${val}%`
          : val.toLocaleString();
        return (
          <div
            key={name}
            className="mb-2 flex items-center gap-2"
            style={{
              fontSize: 12,
              color: isFaded ? "#bbbbbb" : UI.textSecondary,
              cursor: "pointer",
              opacity: isFaded ? 0.5 : 1,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={() => onSeriesHover(name)}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isFaded ? "#d0d0d0" : color,
                flexShrink: 0,
              }}
            />
            <span className="flex-1">
              <span style={{ fontWeight: isActive ? 500 : 400 }}>{name}</span>
              <br />
              <span style={{ fontWeight: 500, color: isFaded ? "#cccccc" : UI.textMuted }}>
                {display}
              </span>
            </span>
          </div>
        );
      })}
      <div
        className="mt-3 border-t pt-2"
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: UI.textPrimary,
          borderColor: UI.border,
        }}
      >
        {isSentiment
          ? `Avg: ${grandTotal > 0 ? "+" : ""}${grandTotal}%`
          : `Total: ${grandTotal.toLocaleString()}`}
      </div>
    </div>
  );
}

export { CommentsPanel };

export default function DetailsPanels({
  filters,
  activeTab,
  trendColors = {},
  trendTotals = {},
  trendMetric = "Volume",
  highlightedSeries = null,
  onSeriesHover = () => {},
  onSeriesLeave = () => {},
}: DetailsPanelsProps) {
  return (
    <div className="flex flex-col gap-4">
      {activeTab === "Trends" ? (
        <TrendsDetails
          colors={trendColors}
          totals={trendTotals}
          metric={trendMetric}
          highlightedSeries={highlightedSeries}
          onSeriesHover={onSeriesHover}
          onSeriesLeave={onSeriesLeave}
        />
      ) : activeTab === "Sentiment" ? (
        <SentimentDetails filters={filters} />
      ) : (
        <VolumeDetails filters={filters} />
      )}
      <TaxonomyPanel />
    </div>
  );
}
