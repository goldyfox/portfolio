"use client";

import { useState } from "react";
import Link from "next/link";
import type { CatalogRow, Domain } from "@/lib/content/types";
import { getPublicRows, filterByDomain } from "@/lib/content/catalog";

const CHIPS: ("All" | Domain)[] = [
  "All",
  "AI",
  "Architecture",
  "Monetization",
  "Incubator",
  "Messaging",
];

export function CatalogFilter() {
  const [active, setActive] = useState<"All" | Domain>("All");
  const allRows = getPublicRows();
  const filtered = filterByDomain(allRows, active);

  return (
    <div>
      <div
        className="flex flex-wrap gap-3"
        role="group"
        aria-label="Filter by domain"
      >
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setActive(chip)}
            aria-pressed={active === chip}
            className={`cursor-pointer rounded-[10px] px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${
              active === chip
                ? "border border-ethos-blue text-ethos-blue"
                : "border border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-12" role="region" aria-live="polite">
        {filtered.length === 0 ? (
          <p className="font-serif text-[18px] text-gray-500 italic">
            No projects in this category yet.
          </p>
        ) : (
          <div className="w-full">
            <div
              className="catalog-grid catalog-header sticky top-0 z-10 border-t border-b border-ethos-blue/30 bg-ethos-cream py-4 font-sans text-[11px] uppercase tracking-[0.1em] text-gray-500"
              aria-hidden="true"
            >
              <div className="col-year px-2">Year</div>
              <div className="col-project px-2">Project</div>
              <div className="col-domain px-2">Domain</div>
              <div className="col-impact px-2">Company</div>
              <div className="col-arrow px-2" />
            </div>

            <div>
              {filtered.map((row) => (
                <CatalogRowItem key={row.id} row={row} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CatalogRowItem({ row }: { row: CatalogRow }) {
  const hasLink = Boolean(row.slug);
  const inner = (
    <div className={`border-b border-ethos-blue/10 py-6 transition-colors duration-500 md:py-8 ${hasLink ? "group cursor-pointer hover:bg-white" : ""}`}>
      <div className="catalog-grid">
        <div className="col-year px-2 font-sans text-xs tracking-[0.15em] text-gray-500">
          {row.year}
        </div>
        <div className={`col-project px-2 font-serif text-2xl md:text-3xl ${hasLink ? "text-ethos-blue" : "text-gray-900"}`}>
          {row.title}
        </div>
        <div className="col-domain px-2 font-sans text-[13px] text-gray-600">
          {row.domains.join(", ")}
        </div>
        <div className="col-impact px-2 font-sans text-[13px] text-gray-600">
          {row.company}
        </div>
        {hasLink && (
          <div className="col-arrow flex justify-end px-2">
            <span className="text-ethos-blue">&rarr;</span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 min-[769px]:hidden">
        <div>
          <span className="block mb-1 font-sans text-[9px] uppercase tracking-[0.2em] text-gray-500">
            Domain
          </span>
          <span className="font-sans text-[13px] text-gray-600">
            {row.domains.join(", ")}
          </span>
        </div>
        <div>
          <span className="block mb-1 font-sans text-[9px] uppercase tracking-[0.2em] text-gray-500">
            Company
          </span>
          <span className="font-sans text-[13px] text-gray-600">
            {row.company}
          </span>
        </div>
      </div>
    </div>
  );

  if (row.slug) {
    return <Link href={`/index/${row.slug}`}>{inner}</Link>;
  }

  return inner;
}
