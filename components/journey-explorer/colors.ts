export const PRODUCT_COLORS: Record<string, string> = {
  Revit: "#6696e0",
  "Fusion 360": "#faa21b",
  Maya: "#32bcad",
  Inventor: "#f8df5e",
  "AutoCAD Civil 3D": "#87b340",
  "BIM 360": "#0e4a8d",
  AutoCAD: "#dd2222",
  Vault: "#8380c1",
  "AutoCAD LT": "#f9b4b4",
  "3DS Max": "#6ac0e7",
};

export const PHASE_COLORS: Record<string, string> = {
  Discover: "#8380c1",
  Subscribe: "#4c9cd8",
  Access: "#32bcad",
  Manage: "#72bf62",
  Extend: "#b7d78c",
  "Get Help": "#f4e38c",
  Learn: "#f2bd8c",
  Use: "#ed7d66",
  Unclassified: "#cccccc",
};

export const SENTIMENT_COLORS = {
  Positive: "#b7d78c",
  Neutral: "#fddaa4",
  Negative: "#eb7a7a",
  Mixed: "#a3bcdc",
  Error: "#cccccc",
} as const;

export const SOURCE_DOMAIN_COLORS: Record<string, string> = {
  "Account Survey": "#0696d7",
  "Case Survey": "#f9b4b4",
  "Sitewide Survey": "#0a7e71",
  "AKN Survey": "#faa21b",
  "Forums Survey": "#f4df73",
  Forums: "#faa21b",
  SFDC_Cases: "#dd2222",
};

export const DATA_SOURCE_COLORS = {
  Cases: "#4679b9",
  Surveys: "#6ac0e7",
  Forums: "#32bcad",
} as const;

export const UI = {
  filterBg: "#666666",
  tooltipBg: "#535353",
  contentBg: "#ffffff",
  artboardBg: "#f5f5f5",
  accent: "#0696d7",
  textPrimary: "#2a2a2a",
  textSecondary: "#3c3c3c",
  textMuted: "#666666",
  border: "#dcdcdc",
  scrollbar: "#999999",
} as const;

export const PHASES = [
  "Discover",
  "Subscribe",
  "Access",
  "Manage",
  "Extend",
  "Get Help",
  "Learn",
  "Use",
  "Unclassified",
] as const;

export const SUBPHASES: Record<string, string[]> = {
  Discover: ["Awareness", "Explore", "Evaluate"],
  Subscribe: ["Try", "Select", "Pay"],
  Access: ["Prepare", "Install", "Update"],
  Manage: ["Control", "Monitor"],
  Extend: ["Renew", "Churn", "Expand", "Advocate"],
  "Get Help": ["Get Help"],
  Learn: ["Learn"],
  Use: ["Use"],
  Unclassified: ["Unclassified"],
};

export type Phase = (typeof PHASES)[number];
export type SentimentKey = keyof typeof SENTIMENT_COLORS;
export type DataSourceKey = keyof typeof DATA_SOURCE_COLORS;
