import type { CatalogRow, Domain } from "./types";

export const catalogRows: CatalogRow[] = [
  {
    id: "business-ai-in-ads",
    title: "AI Agents in Messaging Ads",
    company: "Meta",
    year: "2026",
    domains: ["AI", "Messaging"],
    summary:
      "Cross-surface AI agent experience in Ads Manager for CTM and CTWA — default states, L1/L2 card architecture, and automation order-of-operations.",
    visibility: "public",
  },
  {
    id: "first-messaging-experience",
    slug: "first-messaging-experience",
    title: "First messaging experience in Messenger",
    company: "Meta",
    year: "2026",
    domains: ["Messaging"],
    summary:
      "Chat component and first-message experience for Messenger ads — design strategy for advertiser and recipient entry into the thread.",
    visibility: "public",
  },
  {
    id: "genai-conversations",
    slug: "genai-conversations",
    title: "Less Work, Better Ads with Generative AI",
    company: "Meta",
    year: "2025",
    domains: ["AI", "Architecture"],
    summary:
      "CTM Message Template redesign into a GenAI-first Chat Builder — UPB, cross-team alignment, and a creator-to-reviewer shift on a multi-billion-dollar funnel.",
    visibility: "public",
  },
  {
    id: "reels-conversation-starters",
    title: "From Reels to conversations in one tap",
    company: "Meta",
    year: "2025",
    domains: ["Monetization"],
    summary:
      "Icebreaker-style conversation starters on Reels with progressive disclosure driven by watch-time; shipped through A/B tests with safety constraints.",
    visibility: "public",
  },
  {
    id: "inbox-ads",
    slug: "inbox-ads",
    title: "Increasing ad creation from business inboxes",
    company: "Meta",
    year: "2022",
    domains: ["Monetization"],
    summary:
      "Contextual ad formats for the Messenger inbox that grew a $3B+ revenue surface.",
    visibility: "public",
  },
  {
    id: "journey-explorer",
    slug: "journey-explorer",
    title: "Unifying qualitative data at scale",
    company: "Autodesk",
    year: "2019",
    domains: ["Incubator"],
    summary:
      "First data-driven customer journey map with CX Analytics, correlatable personas, and an interactive exploration prototype.",
    visibility: "public",
  },
  {
    id: "mobile-nav",
    title: "Multilingual mobile navigation",
    company: "Autodesk",
    year: "2018",
    domains: ["Architecture"],
    summary:
      "Multilingual cross-property mobile navigation for Autodesk's main web properties, deployed across 41 country sites; phased rollout of primary nav, mega-footer, legal footer, and notifications.",
    visibility: "public",
  },
  {
    id: "virtual-agent",
    slug: "virtual-agent",
    title: "Pioneering self-service AI at Autodesk",
    company: "Autodesk",
    year: "2016",
    domains: ["AI"],
    summary:
      "Led discovery, research, and prototyping for AVA, Autodesk's Virtual Agent helpbot (service design).",
    visibility: "public",
  },
];

export function getPublicRows(): CatalogRow[] {
  return catalogRows.filter((row) => row.visibility === "public");
}

export function filterByDomain(
  rows: CatalogRow[],
  domain: string,
): CatalogRow[] {
  if (domain === "All") return rows;
  return rows.filter((row) => row.domains.includes(domain as Domain));
}
