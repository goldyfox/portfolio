export type Domain =
  | "AI"
  | "Architecture"
  | "Monetization"
  | "Incubator"
  | "Messaging";

export type Visibility = "public" | "omit";

export interface BriefMetric {
  value: string;
  label: string;
}

export interface EditorialBriefData {
  id: string;
  title: string;
  subtitle?: string;
  company: string;
  year: string;
  domains: Domain[];
  bet: string;
  metrics: BriefMetric[];
  constraint: string;
  move: string;
  workDescription: string;
  unlock: string;
  hasDeepWork?: boolean;
  ic6Themes?: string[];
}

export interface CatalogRow {
  id: string;
  slug?: string;
  title: string;
  company: string;
  year: string;
  domains: Domain[];
  summary: string;
  impact?: string;
  visibility: Visibility;
}

export interface Chapter {
  id: string;
  label: string;
  subtitle?: string;
}

export interface DoodleItem {
  id: string;
  src: string;
  alt: string;
}
