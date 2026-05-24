"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { UI } from "./colors";
import type { Phase } from "./colors";
import FilterSidebar, {
  DEFAULT_FILTERS,
  type FilterState,
} from "./FilterSidebar";
import VolumeChart from "./VolumeChart";
import SentimentChart from "./SentimentChart";
import TrendsChart from "./TrendsChart";
import DetailsPanels, { CommentsPanel } from "./DetailsPanels";

type Tab = "Volume" | "Sentiment" | "Trends";

const TABS: Tab[] = ["Volume", "Sentiment", "Trends"];

export default function JourneyExplorer() {
  const [activeTab, setActiveTab] = useState<Tab>("Volume");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [trendColors, setTrendColors] = useState<Record<string, string>>({});
  const [trendTotals, setTrendTotals] = useState<Record<string, number>>({});
  const [trendGrouping, setTrendGrouping] = useState("By Product");
  const [trendMetric, setTrendMetric] = useState("Volume");
  const [highlightedSeries, setHighlightedSeries] = useState<string | null>(null);
  const isLockedRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const addSearchTerm = useCallback((term: string) => {
    const t = term.trim();
    if (t && !searchTerms.includes(t.toLowerCase())) {
      setSearchTerms((prev) => [...prev, t.toLowerCase()]);
    }
    setSearchInput("");
  }, [searchTerms]);

  const removeSearchTerm = useCallback((term: string) => {
    setSearchTerms((prev) => prev.filter((t) => t !== term));
  }, []);

  const handleSeriesHover = useCallback((series: string | null) => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
    isLockedRef.current = false;
    setHighlightedSeries(series);
    if (series) {
      lockTimerRef.current = setTimeout(() => {
        isLockedRef.current = true;
        lockTimerRef.current = null;
      }, 3000);
    }
  }, []);

  const handleSeriesLeave = useCallback(() => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
    if (!isLockedRef.current) {
      setHighlightedSeries(null);
    }
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setSelectedPhase(null);
  }, []);

  const trendsLegendTotal = useMemo(() => {
    const vals = Object.values(trendTotals);
    if (vals.length === 0) {
      return trendMetric === "Sentiment" ? "0%" : "0";
    }
    const g = vals.reduce((a, b) => a + b, 0);
    if (trendMetric === "Sentiment") {
      return `${g > 0 ? "+" : ""}${g}%`;
    }
    return g.toLocaleString();
  }, [trendTotals, trendMetric]);

  return (
    <div
      className="je-root"
      style={{
        fontFamily: "var(--font-artifakt)",
        background: UI.artboardBg,
        minHeight: 600,
      }}
    >
      {/* @font-face declarations scoped to this component */}
      <style>{`
        @font-face {
          font-family: 'Artifakt Element';
          src: url('/fonts/Artifakt Element Light.woff2') format('woff2');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Artifakt Element';
          src: url('/fonts/Artifakt Element Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Artifakt Element';
          src: url('/fonts/Artifakt Element Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Artifakt Element';
          src: url('/fonts/Artifakt Element Bold.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        .je-root {
          --font-artifakt: 'Artifakt Element', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .je-root * {
          font-family: var(--font-artifakt);
        }
        .je-root button {
          font-family: var(--font-artifakt);
          outline: none;
          cursor: pointer;
        }
        .je-root *:focus,
        .je-root *:focus-visible {
          outline: none;
        }
        .je-root .recharts-bar-rectangle {
          cursor: pointer;
        }
      `}</style>

      {/* Header — sits on artboard gray bg, spans full width */}
      <div className="px-6 pt-5 pb-3" style={{ background: UI.artboardBg }}>
        <div className="flex items-start justify-between">
          <div>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: UI.textPrimary,
                lineHeight: 1.2,
              }}
            >
              Journey Explorer
            </h2>
            <p style={{ fontSize: 16, color: UI.textSecondary, marginTop: 2 }}>
              Visualizing customer comments
            </p>
          </div>
          <div className="flex items-center gap-6" style={{ marginTop: 6 }}>
            <button
              className="flex items-center gap-1"
              style={{ fontSize: 16, color: UI.textSecondary }}
            >
              Query case details
              <span style={{ color: UI.textMuted }}>›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content: filter sidebar + content column */}
      <div className="flex" style={{ minHeight: 500 }}>
        {/* Filter sidebar — #666666 bg, full height */}
        <div
          className={`flex-shrink-0 ${sidebarOpen ? "block" : "hidden"} lg:block`}
        >
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {/* Content column: search bar + chart + details */}
        <div className="min-w-0 flex-1 px-4 pb-4">
          {/* Search bar — input row */}
          <div
            className="flex items-center gap-3 px-4"
            style={{
              background: UI.contentBg,
              height: 56,
              cursor: "text",
            }}
            onClick={() => searchInputRef.current?.focus()}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="7.5" cy="7.5" r="5.5" stroke={UI.textMuted} strokeWidth="1.2" />
              <path d="M12 12L16 16" stroke={UI.textMuted} strokeWidth="1.2" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchInput.trim()) {
                  addSearchTerm(searchInput);
                } else if (e.key === "Backspace" && !searchInput && searchTerms.length) {
                  removeSearchTerm(searchTerms[searchTerms.length - 1]);
                }
              }}
              placeholder="Search"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 20,
                color: UI.textSecondary,
                flex: 1,
                minWidth: 80,
                fontFamily: "var(--font-artifakt)",
              }}
            />
          </div>

          {/* Keyword pills row — only visible when search terms exist */}
          {searchTerms.length > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2"
              style={{
                background: UI.contentBg,
                borderTop: `1px solid ${UI.border}`,
              }}
            >
              {searchTerms.map((term) => (
                <span
                  key={term}
                  className="flex items-center gap-1.5"
                  style={{
                    background: "#ececec",
                    padding: "4px 10px",
                    fontSize: 14,
                    color: UI.textSecondary,
                    whiteSpace: "nowrap",
                  }}
                >
                  {term}
                  <button
                    onClick={() => removeSearchTerm(term)}
                    style={{ color: UI.textMuted, lineHeight: 1 }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </button>
                </span>
              ))}
              <button
                onClick={() => { setSearchTerms([]); setSearchInput(""); }}
                className="ml-auto flex items-center gap-1"
                style={{ fontSize: 14, color: UI.textMuted, whiteSpace: "nowrap" }}
              >
                CLEAR ALL
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
          )}

          {/* Spacer between search bar and content */}
          <div style={{ height: 16 }} />

          {searchTerms.length > 0 ? (
            /* Full-screen search results — replaces chart + details */
            <div style={{ background: UI.contentBg }}>
              <CommentsPanel
                filters={filters}
                activeTab={activeTab}
                trendGrouping={trendGrouping}
                searchTerms={searchTerms}
                expanded
                trendsLegendTotal={activeTab === "Trends" ? trendsLegendTotal : null}
                onCollapse={() => { setSearchTerms([]); setSearchInput(""); }}
              />
            </div>
          ) : (
            /* Normal chart + details layout */
            <div className="flex gap-4">
              {/* Main chart card */}
              <div
                className="min-w-0 flex-1 p-4"
                style={{ background: UI.contentBg }}
              >
                {/* Back link (drill-down only) */}
                {selectedPhase && (
                  <button
                    onClick={() => setSelectedPhase(null)}
                    className="flex items-center gap-1 mb-2"
                    style={{ fontSize: 14, color: UI.textMuted }}
                  >
                    ← Back
                  </button>
                )}

                {/* Overview title / breadcrumb */}
                <div className="mb-2">
                  {selectedPhase ? (
                    <div className="flex items-center gap-2" style={{ fontSize: 20, fontWeight: 500, color: "#222222" }}>
                      <button
                        onClick={() => setSelectedPhase(null)}
                        style={{ color: "#222222" }}
                      >
                        Overview
                      </button>
                      <span style={{ color: UI.textMuted }}>›</span>
                      <span>{selectedPhase}</span>
                    </div>
                  ) : (
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 500,
                        color: "#222222",
                      }}
                    >
                      Overview
                    </span>
                  )}
                </div>

                {/* Tabs */}
                <div className="mb-4 flex items-center">
                  {TABS.map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className="relative px-3 py-2 first:pl-0"
                        style={{
                          fontSize: 14,
                          color: isActive ? UI.textSecondary : UI.textMuted,
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {tab}
                        {isActive && (
                          <span
                            className="absolute bottom-0 left-3 right-3 first:left-0"
                            style={{ height: 2, background: UI.accent }}
                          />
                        )}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="ml-auto lg:hidden"
                    style={{ fontSize: 14, color: UI.accent }}
                  >
                    {sidebarOpen ? "Hide Filters" : "Show Filters"}
                  </button>
                </div>

                {activeTab === "Volume" && (
                  <VolumeChart
                    filters={filters}
                    onPhaseSelect={setSelectedPhase}
                    selectedPhase={selectedPhase}
                  />
                )}
                {activeTab === "Sentiment" && (
                  <SentimentChart filters={filters} />
                )}
                {activeTab === "Trends" && (
                  <TrendsChart
                    filters={filters}
                    onColorsChange={setTrendColors}
                    onTotalsChange={setTrendTotals}
                    onGroupingChange={setTrendGrouping}
                    onMetricChange={setTrendMetric}
                    highlightedSeries={highlightedSeries}
                    onSeriesHover={handleSeriesHover}
                    onSeriesLeave={handleSeriesLeave}
                  />
                )}

                {/* All Comments — always below the chart */}
                <div className="mt-6">
                  <CommentsPanel
                    filters={filters}
                    activeTab={activeTab}
                    trendGrouping={trendGrouping}
                    trendsLegendTotal={activeTab === "Trends" ? trendsLegendTotal : null}
                  />
                </div>
              </div>

              {/* Right-side panels: Volume/Sentiment Details + Taxonomy */}
              <div
                className="hidden flex-shrink-0 xl:block"
                style={{ width: 232 }}
              >
                <DetailsPanels
                  filters={filters}
                  activeTab={activeTab}
                  trendColors={trendColors}
                  trendTotals={trendTotals}
                  trendMetric={trendMetric}
                  highlightedSeries={highlightedSeries}
                  onSeriesHover={handleSeriesHover}
                  onSeriesLeave={handleSeriesLeave}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
