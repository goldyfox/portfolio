import type { Phase, SentimentKey, DataSourceKey } from "./colors";

export interface VolumeDataPoint {
  phase: Phase;
  Cases: number;
  Surveys: number;
  Forums: number;
}

export interface SentimentDataPoint {
  phase: Phase;
  Positive: number;
  Neutral: number;
  Negative: number;
  Mixed: number;
  Error: number;
}

export interface TrendsDataPoint {
  period: string;
  [series: string]: number | string;
}

export interface SubphaseVolumeDataPoint {
  subphase: string;
  Cases: number;
  Surveys: number;
  Forums: number;
}

export interface TaxonomyTopic {
  name: string;
  count: number;
}

export interface Comment {
  id: string;
  title: string;
  text: string;
  source: DataSourceKey;
  sentiment: SentimentKey;
  phase: Phase;
  subphase: string;
  product: string;
  date: string;
  isoDate: string;
  forum: string;
}

// --- Volume data (matches XD: 9 phases, 3 data sources) ---

export const volumeData: VolumeDataPoint[] = [
  { phase: "Discover", Cases: 3900, Surveys: 3000, Forums: 5600 },
  { phase: "Subscribe", Cases: 9700, Surveys: 5100, Forums: 6700 },
  { phase: "Access", Cases: 6400, Surveys: 7400, Forums: 4500 },
  { phase: "Manage", Cases: 11600, Surveys: 5100, Forums: 12600 },
  { phase: "Extend", Cases: 9700, Surveys: 7600, Forums: 9500 },
  { phase: "Get Help", Cases: 9700, Surveys: 5100, Forums: 6700 },
  { phase: "Learn", Cases: 3900, Surveys: 9600, Forums: 13100 },
  { phase: "Use", Cases: 6600, Surveys: 6900, Forums: 19900 },
  { phase: "Unclassified", Cases: 5500, Surveys: 5100, Forums: 4300 },
];

export const subphaseVolumeData: Record<Phase, SubphaseVolumeDataPoint[]> = {
  Discover: [
    { subphase: "Awareness", Cases: 1200, Surveys: 900, Forums: 1800 },
    { subphase: "Explore", Cases: 1400, Surveys: 1100, Forums: 2100 },
    { subphase: "Evaluate", Cases: 1300, Surveys: 1000, Forums: 1700 },
  ],
  Subscribe: [
    { subphase: "Try", Cases: 3200, Surveys: 1700, Forums: 2200 },
    { subphase: "Select", Cases: 3300, Surveys: 1700, Forums: 2300 },
    { subphase: "Pay", Cases: 3200, Surveys: 1700, Forums: 2200 },
  ],
  Access: [
    { subphase: "Prepare", Cases: 1800, Surveys: 2100, Forums: 1200 },
    { subphase: "Install", Cases: 2800, Surveys: 3200, Forums: 2000 },
    { subphase: "Update", Cases: 1800, Surveys: 2100, Forums: 1300 },
  ],
  Manage: [
    { subphase: "Control", Cases: 6200, Surveys: 2700, Forums: 6800 },
    { subphase: "Monitor", Cases: 5400, Surveys: 2400, Forums: 5800 },
  ],
  Extend: [
    { subphase: "Renew", Cases: 3200, Surveys: 2500, Forums: 3100 },
    { subphase: "Churn", Cases: 1800, Surveys: 1400, Forums: 1600 },
    { subphase: "Expand", Cases: 3300, Surveys: 2600, Forums: 3200 },
    { subphase: "Advocate", Cases: 1400, Surveys: 1100, Forums: 1600 },
  ],
  "Get Help": [
    { subphase: "Get Help", Cases: 9700, Surveys: 5100, Forums: 6700 },
  ],
  Learn: [
    { subphase: "Learn", Cases: 3900, Surveys: 9600, Forums: 13100 },
  ],
  Use: [{ subphase: "Use", Cases: 6600, Surveys: 6900, Forums: 19900 }],
  Unclassified: [
    { subphase: "Unclassified", Cases: 5500, Surveys: 5100, Forums: 4300 },
  ],
};

// --- Sentiment data ---

export const sentimentData: SentimentDataPoint[] = [
  { phase: "Discover", Positive: 35, Neutral: 25, Negative: 20, Mixed: 15, Error: 5 },
  { phase: "Subscribe", Positive: 28, Neutral: 22, Negative: 30, Mixed: 15, Error: 5 },
  { phase: "Access", Positive: 20, Neutral: 20, Negative: 35, Mixed: 20, Error: 5 },
  { phase: "Manage", Positive: 30, Neutral: 25, Negative: 25, Mixed: 15, Error: 5 },
  { phase: "Extend", Positive: 40, Neutral: 22, Negative: 18, Mixed: 15, Error: 5 },
  { phase: "Get Help", Positive: 15, Neutral: 20, Negative: 40, Mixed: 20, Error: 5 },
  { phase: "Learn", Positive: 45, Neutral: 25, Negative: 15, Mixed: 10, Error: 5 },
  { phase: "Use", Positive: 38, Neutral: 28, Negative: 18, Mixed: 12, Error: 4 },
];

// --- Trends data (monthly time series, dynamically generated) ---

const ALL_MONTHS = [
  "2018-11", "2018-12",
  "2019-01", "2019-02", "2019-03", "2019-04", "2019-05", "2019-06", "2019-07",
  "2019-08", "2019-09", "2019-10", "2019-11", "2019-12",
  "2020-01", "2020-02", "2020-03", "2020-04", "2020-05", "2020-06", "2020-07",
  "2020-08", "2020-09", "2020-10",
];
const TOTAL_MONTHS = ALL_MONTHS.length;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatMonthLabel(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split("-");
  const m = parseInt(monthStr) - 1;
  return `${MONTH_NAMES[m]} '${yearStr.slice(2)}`;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateTrendSeries(
  baselines: Record<string, number>,
  seedBase: number,
  periodLabels: string[],
  isPercent: boolean,
): TrendsDataPoint[] {
  const total = periodLabels.length;

  const driftRng = seededRng(seedBase + 7777);
  const drifts: Record<string, number> = {};
  for (const key of Object.keys(baselines)) {
    drifts[key] = isPercent
      ? (driftRng() - 0.5) * 20
      : (driftRng() - 0.5) * 0.6;
  }

  return periodLabels.map((label, idx) => {
    const point: TrendsDataPoint = { period: label };
    const periodSeed = hashString(label) + seedBase;
    const progress = total > 1 ? idx / (total - 1) : 0.5;
    let keyIdx = 0;
    for (const [key, base] of Object.entries(baselines)) {
      const rng = seededRng(periodSeed + keyIdx * 997);
      const r1 = rng(), r2 = rng(), r3 = rng(), r4 = rng();
      const normal = (r1 + r2 + r3 + r4 - 2) * 2;
      const drift = drifts[key] * (progress - 0.5);

      if (isPercent) {
        let swing = normal * 12;
        const eventRoll = rng();
        if (eventRoll > 0.88) swing += rng() > 0.5 ? 15 : -15;
        point[key] = Math.round(
          Math.max(-100, Math.min(100, base + drift + swing)),
        );
      } else {
        let mult = Math.exp(normal * 0.45);
        const eventRoll = rng();
        if (eventRoll > 0.88) mult *= 1.5 + rng();
        point[key] = Math.round(base * (1 + drift) * mult);
      }
      keyIdx++;
    }
    return point;
  });
}

// Baseline configs for each metric x grouping
export const TREND_BASELINES = {
  volumeByProduct: {
    baselines: { AutoCAD: 4200, Revit: 3800, "Fusion 360": 2600, "3DS Max": 1900, Maya: 1500 },
    seed: 101,
  },
  volumeByDomain: {
    baselines: { "Account Survey": 3500, "Case Survey": 2800, Forums: 4100, "Sitewide Survey": 1200 },
    seed: 202,
  },
  volumeByPhase: {
    baselines: { Discover: 2100, Subscribe: 3400, Access: 2800, Manage: 4600, Extend: 3200, "Get Help": 5100, Learn: 1800, Use: 3900, Unclassified: 900 },
    seed: 303,
  },
  sentimentByProduct: {
    baselines: { AutoCAD: 12, Revit: -8, "Fusion 360": 25, "3DS Max": -15, Maya: 5 },
    seed: 404,
  },
  sentimentByDomain: {
    baselines: { "Account Survey": 28, "Case Survey": -5, Forums: -12, "Sitewide Survey": 15 },
    seed: 505,
  },
  sentimentByPhase: {
    baselines: { Discover: 15, Subscribe: -2, Access: -15, Manage: 5, Extend: 22, "Get Help": -8, Learn: 18, Use: -5, Unclassified: 2 },
    seed: 606,
  },
} as const;

// --- Date multiplier for Volume charts ---

export function dateMultiplier(selectedMonths: string[]): number {
  const ratio = selectedMonths.length / TOTAL_MONTHS;
  const jitterSeed = seededRng(hashString(selectedMonths.join(",")));
  const jitter = 1 + (jitterSeed() - 0.5) * 0.1;
  return ratio * jitter;
}

// --- Taxonomy topics ---

export const taxonomyTopics: TaxonomyTopic[] = [
  { name: "Installation issues", count: 10000 },
  { name: "License activation", count: 8000 },
  { name: "Rendering performance", count: 7000 },
  { name: "File compatibility", count: 6000 },
  { name: "Cloud sync errors", count: 5000 },
  { name: "CAM toolpath generation", count: 4500 },
  { name: "Drawing templates", count: 4000 },
  { name: "Plugin conflicts", count: 3500 },
  { name: "Export failures", count: 3000 },
  { name: "Subscription management", count: 2500 },
];

// --- Sample comments ---

export const sampleComments: Comment[] = [
  {
    id: "c1",
    title: "A software problem has caused Autodesk 3DS Max 2018 to close unexpectedly",
    text: "I am a university graduate student trying to download 3DS Max (any version). I am running MacOS Mojave 10.14.2. At first, there was an option for Macintosh. A blue error banner appeared stating Autodesk was having difficulties. Now, only Windows is available. I have tried all of the remedy steps available on their website.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Access",
    subphase: "Install",
    product: "3DS Max",
    date: "9 July 2019",
    isoDate: "2019-07-09",
    forum: "3ds Max Forums",
  },
  {
    id: "c2",
    title: "I can't find 3DS Max for my Mac",
    text: "Everyone that recommends bootcamp is basically telling me to buy windows. I want to have 3DS Max on my Mac, because my Adobe Master Collections contract is licensed under apple products. There are Universities facing the same issues. It's difficult to move to a different platform when you have years of work on Mac.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Access",
    subphase: "Install",
    product: "3DS Max",
    date: "9 July 2019",
    isoDate: "2019-07-09",
    forum: "Type/Topic",
  },
  {
    id: "c3",
    title: "Error 1603 during installation — no resolution found",
    text: "I keep getting error code 1603 during installation. Tried all troubleshooting steps in the knowledge base. Nothing works. Uninstalled, cleaned registry, reinstalled — same error. This is a fresh Windows 10 machine with no prior Autodesk products.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Access",
    subphase: "Install",
    product: "AutoCAD",
    date: "22 April 2019",
    isoDate: "2019-04-22",
    forum: "AutoCAD Forums",
  },
  {
    id: "c4",
    title: "File access and stability issues with AutoCAD",
    text: "Making the access to things clearer and easier and I don't know why there is no way to open any file, I understand that it is a piece of program, but it is quite unstable. Crashes happen at least twice per session.",
    source: "Surveys",
    sentiment: "Mixed",
    phase: "Access",
    subphase: "Prepare",
    product: "AutoCAD",
    date: "1 July 2019",
    isoDate: "2019-07-01",
    forum: "Product Survey",
  },
  {
    id: "c5",
    title: "Generative design in Fusion 360 saved weeks of work",
    text: "The new Fusion 360 update has been incredible for our workflow. Generative design features saved us weeks of iteration time. The simulation tools are also much more responsive than the previous version.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Use",
    subphase: "Use",
    product: "Fusion 360",
    date: "20 June 2019",
    isoDate: "2019-06-20",
    forum: "Product Survey",
  },
  {
    id: "c6",
    title: "Confusing renewal process — overcharged for features",
    text: "Renewal process was confusing — had to call support three times before getting the right license tier. Ended up overpaying for features we don't use. The account portal doesn't clearly show what's included in each plan.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Extend",
    subphase: "Renew",
    product: "Revit",
    date: "15 May 2019",
    isoDate: "2019-05-15",
    forum: "Support Cases",
  },
  {
    id: "c7",
    title: "BIM 360 cloud workflow improved team collaboration",
    text: "BIM 360 integration with Revit has been smooth. Our team collaboration improved significantly since migrating to the cloud workflow. Real-time co-authoring is a game changer for our multi-office projects.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Manage",
    subphase: "Monitor",
    product: "BIM 360",
    date: "10 July 2019",
    isoDate: "2019-07-10",
    forum: "Product Survey",
  },
  {
    id: "c8",
    title: "License activation fails after hardware change",
    text: "After upgrading my workstation's GPU, my Inventor license won't activate. The serial number is flagged as 'already in use.' Support says I need to wait 72 hours for the old machine to release, but it's been a week.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Access",
    subphase: "Install",
    product: "Inventor",
    date: "3 June 2019",
    isoDate: "2019-06-03",
    forum: "Inventor Forums",
  },
  {
    id: "c9",
    title: "Revit 2020 crashes on large assemblies after update",
    text: "Ever since the 2020.1 hotfix, Revit crashes when opening projects with more than 200 linked models. Rolling back to the previous build resolved it but we lose the new structural analysis features. Very frustrating timing with a deadline next week.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Use",
    subphase: "Use",
    product: "Revit",
    date: "14 November 2019",
    isoDate: "2019-11-14",
    forum: "Revit Forums",
  },
  {
    id: "c10",
    title: "Fusion 360 cloud rendering is surprisingly fast",
    text: "Just tried the updated cloud rendering in Fusion 360. Render times dropped by about 40% compared to last quarter. The integration with the generative design workspace is seamless now. This is exactly what our prototyping team needed.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Use",
    subphase: "Use",
    product: "Fusion 360",
    date: "8 February 2020",
    isoDate: "2020-02-08",
    forum: "Product Survey",
  },
  {
    id: "c11",
    title: "Subscription portal shows wrong renewal date",
    text: "My Autodesk account shows my subscription renewing in March but I was charged in January. Support confirmed the portal displays the wrong date for multi-year plans. This has been reported by several users in our organization.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Extend",
    subphase: "Renew",
    product: "AutoCAD",
    date: "22 January 2020",
    isoDate: "2020-01-22",
    forum: "Support Cases",
  },
  {
    id: "c12",
    title: "Maya 2020 animation workflow is much improved",
    text: "The cached playback in Maya 2020 changed everything for our animation pipeline. We can now preview complex scenes in real time without proxy rigs. The team productivity has noticeably increased since we upgraded.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Use",
    subphase: "Use",
    product: "Maya",
    date: "5 May 2020",
    isoDate: "2020-05-05",
    forum: "Product Survey",
  },
  {
    id: "c13",
    title: "Trial period too short to evaluate properly",
    text: "30 days is not nearly enough to evaluate a tool this complex for enterprise use. By the time we got IT to approve the install and configure our test environment, we had 12 days left. We need at least 60 days for a proper pilot.",
    source: "Surveys",
    sentiment: "Negative",
    phase: "Subscribe",
    subphase: "Try",
    product: "Revit",
    date: "18 February 2019",
    isoDate: "2019-02-18",
    forum: "Product Survey",
  },
  {
    id: "c14",
    title: "AutoCAD pricing page is misleading",
    text: "The website shows one price but checkout shows a completely different number after taxes and fees. Took 20 minutes to figure out the difference was because of the maintenance plan add-on that was pre-selected. Very frustrating discovery experience.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Discover",
    subphase: "Evaluate",
    product: "AutoCAD",
    date: "8 March 2019",
    isoDate: "2019-03-08",
    forum: "Support Cases",
  },
  {
    id: "c15",
    title: "Great webinar on Revit MEP workflows",
    text: "Attended the Revit MEP deep dive webinar last week. The presenter covered duct routing and clash detection in a way that actually made sense. Already applied two techniques to our current hospital project. More content like this please.",
    source: "Forums",
    sentiment: "Positive",
    phase: "Learn",
    subphase: "Learn",
    product: "Revit",
    date: "12 April 2019",
    isoDate: "2019-04-12",
    forum: "Revit Forums",
  },
  {
    id: "c16",
    title: "Multi-seat license management is a nightmare",
    text: "Managing 45 seats across three offices with the current admin console is painful. No bulk operations, no usage reporting, and the assignment UI times out constantly. We spend hours every quarter reconciling licenses manually.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Manage",
    subphase: "Control",
    product: "AutoCAD",
    date: "29 August 2019",
    isoDate: "2019-08-29",
    forum: "Support Cases",
  },
  {
    id: "c17",
    title: "Inventor assembly performance finally usable",
    text: "The performance improvements in the latest Inventor update are dramatic. Assemblies with 5000+ components that used to take 90 seconds to open now load in under 20. This was the single biggest blocker for our adoption.",
    source: "Forums",
    sentiment: "Positive",
    phase: "Use",
    subphase: "Use",
    product: "Inventor",
    date: "15 September 2019",
    isoDate: "2019-09-15",
    forum: "Inventor Forums",
  },
  {
    id: "c18",
    title: "Support response times have gotten worse",
    text: "Used to get a response within 4 hours on priority cases. Last three tickets took 2-3 business days for initial response. For a premium support contract this is unacceptable, especially when production is blocked.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Get Help",
    subphase: "Get Help",
    product: "Revit",
    date: "3 October 2019",
    isoDate: "2019-10-03",
    forum: "Support Cases",
  },
  {
    id: "c19",
    title: "Fusion 360 tutorials are best-in-class",
    text: "The structured learning path for Fusion 360 is genuinely excellent. Went from zero CAM knowledge to running my first toolpath in a weekend. The video quality, pacing, and project files are all top notch. Wish every Autodesk product had this.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Learn",
    subphase: "Learn",
    product: "Fusion 360",
    date: "20 September 2019",
    isoDate: "2019-09-20",
    forum: "Product Survey",
  },
  {
    id: "c20",
    title: "Account migration broke our team permissions",
    text: "After migrating to the new Autodesk Account system, half our team lost access to shared projects. The admin portal shows them as active but they get 403 errors. Support says it is a known issue with no ETA on a fix.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Manage",
    subphase: "Control",
    product: "BIM 360",
    date: "7 August 2019",
    isoDate: "2019-08-07",
    forum: "BIM 360 Forums",
  },
  {
    id: "c21",
    title: "AutoCAD LT is perfect for our small firm",
    text: "We switched from full AutoCAD to AutoCAD LT for our 8-person architecture firm. The cost savings are significant and honestly we weren't using any of the 3D or customization features. LT covers everything we need for 2D drafting.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Subscribe",
    subphase: "Select",
    product: "AutoCAD",
    date: "14 March 2019",
    isoDate: "2019-03-14",
    forum: "Product Survey",
  },
  {
    id: "c22",
    title: "Renewal discount not applied correctly",
    text: "Was promised a 15% loyalty discount on renewal but the invoice shows full price. Third time this has happened across different products. The disconnect between sales and billing is really eroding our trust.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Extend",
    subphase: "Renew",
    product: "Maya",
    date: "11 December 2019",
    isoDate: "2019-12-11",
    forum: "Support Cases",
  },
  {
    id: "c23",
    title: "Civil 3D corridor modeling training was excellent",
    text: "The instructor-led training on corridor modeling in Civil 3D was worth every penny. Finally understand how assemblies, alignments, and profiles work together. Applied it immediately to our highway interchange project.",
    source: "Forums",
    sentiment: "Positive",
    phase: "Learn",
    subphase: "Learn",
    product: "AutoCAD Civil 3D",
    date: "28 March 2020",
    isoDate: "2020-03-28",
    forum: "Civil 3D Forums",
  },
  {
    id: "c24",
    title: "Vault integration with Inventor keeps breaking",
    text: "Every other Vault update breaks the Inventor integration. Check-in fails silently, lifecycle state changes don't propagate, and the thick client crashes during get-latest operations. We have to roll back quarterly.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Use",
    subphase: "Use",
    product: "Vault",
    date: "19 April 2020",
    isoDate: "2020-04-19",
    forum: "Vault Forums",
  },
  {
    id: "c25",
    title: "Switched from SketchUp and never looked back",
    text: "After years with SketchUp, our team moved to Revit for BIM compliance on government contracts. The learning curve was steep but the parametric families and scheduling capabilities are leagues ahead. Three months in and productivity is already higher.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Discover",
    subphase: "Explore",
    product: "Revit",
    date: "6 June 2020",
    isoDate: "2020-06-06",
    forum: "Product Survey",
  },
  {
    id: "c26",
    title: "Knowledge base articles are outdated",
    text: "Half the troubleshooting articles reference menu locations that no longer exist in the 2020 release. Screenshots are from 2017. When you are debugging at midnight before a client deadline, finding outdated help content is incredibly demoralizing.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Get Help",
    subphase: "Get Help",
    product: "AutoCAD",
    date: "22 May 2020",
    isoDate: "2020-05-22",
    forum: "AutoCAD Forums",
  },
  {
    id: "c27",
    title: "Payment processing failed three times",
    text: "Tried to purchase a new AutoCAD subscription and the payment kept failing with no error message. Tried different cards, different browsers. Finally called support who said there was a known issue with their payment processor. Why no status page?",
    source: "Cases",
    sentiment: "Negative",
    phase: "Subscribe",
    subphase: "Pay",
    product: "AutoCAD",
    date: "15 February 2019",
    isoDate: "2019-02-15",
    forum: "Support Cases",
  },
  {
    id: "c28",
    title: "3DS Max rendering quality exceeds expectations",
    text: "Upgraded to 3DS Max 2020 primarily for the new physical material library. The Arnold renderer improvements are significant — getting photoreal results in half the time compared to our old V-Ray setup. Client presentations have never looked better.",
    source: "Forums",
    sentiment: "Positive",
    phase: "Use",
    subphase: "Use",
    product: "3DS Max",
    date: "30 July 2020",
    isoDate: "2020-07-30",
    forum: "3ds Max Forums",
  },
  {
    id: "c29",
    title: "Team expanded subscription after successful pilot",
    text: "Started with 5 Fusion 360 seats as a trial. After the first quarter our prototyping team was so productive that leadership approved expanding to 25 seats. The integrated CAD/CAM/CAE workflow eliminated three separate tools from our stack.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Extend",
    subphase: "Expand",
    product: "Fusion 360",
    date: "10 June 2020",
    isoDate: "2020-06-10",
    forum: "Product Survey",
  },
  {
    id: "c30",
    title: "Autodesk desktop app update notifications are excessive",
    text: "The desktop app pops up update notifications every single day even when I click 'remind me later.' It interrupts full-screen presentations and rendering jobs. There needs to be a quiet hours setting or at minimum a weekly cadence option.",
    source: "Forums",
    sentiment: "Mixed",
    phase: "Manage",
    subphase: "Monitor",
    product: "AutoCAD",
    date: "2 November 2019",
    isoDate: "2019-11-02",
    forum: "AutoCAD Forums",
  },
  {
    id: "c31",
    title: "Holiday promo pricing unclear on website",
    text: "Saw an ad for 25% off Autodesk subscriptions but when I went to the site the pricing looked normal. Turns out the promo only applies to new customers, not renewals. This should be stated clearly in the ad, not buried in fine print.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Discover",
    subphase: "Evaluate",
    product: "Revit",
    date: "19 November 2018",
    isoDate: "2018-11-19",
    forum: "Support Cases",
  },
  {
    id: "c32",
    title: "Year-end budget approval delayed our purchase",
    text: "We had approval to buy 12 seats in December but the payment system went down for maintenance during the last week of the fiscal year. By the time it came back the budget had rolled over and we had to start the approval process again.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Subscribe",
    subphase: "Pay",
    product: "AutoCAD",
    date: "28 December 2018",
    isoDate: "2018-12-28",
    forum: "Support Cases",
  },
  {
    id: "c33",
    title: "Revit 2019 training materials were helpful for onboarding",
    text: "We onboarded 8 new hires in January using the official Revit learning path. The structured curriculum made it much easier than our old ad-hoc training. All of them were productive within two weeks, which is a record for us.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Learn",
    subphase: "Learn",
    product: "Revit",
    date: "14 January 2019",
    isoDate: "2019-01-14",
    forum: "Product Survey",
  },
  {
    id: "c34",
    title: "BIM 360 mobile app crashes on large models",
    text: "Tried viewing a 500MB Revit model on the BIM 360 mobile app at a job site. App crashed immediately. Tried three different iPads — same result. The field team needs reliable mobile access for on-site coordination.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Use",
    subphase: "Use",
    product: "BIM 360",
    date: "15 August 2020",
    isoDate: "2020-08-15",
    forum: "BIM 360 Forums",
  },
  {
    id: "c35",
    title: "Fusion 360 extension marketplace is growing nicely",
    text: "The new add-in marketplace for Fusion 360 has some genuinely useful extensions now. The nesting plugin alone saved us hours of manual layout work. Great to see the ecosystem maturing.",
    source: "Forums",
    sentiment: "Positive",
    phase: "Extend",
    subphase: "Expand",
    product: "Fusion 360",
    date: "22 September 2020",
    isoDate: "2020-09-22",
    forum: "Fusion 360 Forums",
  },
  {
    id: "c36",
    title: "Inventor file conversion errors after OS update",
    text: "After updating to Windows 10 version 2004, all Inventor DWG exports produce corrupt files. The geometry is there but dimensions and annotations are scrambled. Rolling back the OS update fixes it but that is not a long-term solution.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Use",
    subphase: "Use",
    product: "Inventor",
    date: "8 October 2020",
    isoDate: "2020-10-08",
    forum: "Support Cases",
  },
  {
    id: "c37",
    title: "Revit to AutoCAD export loses layer mapping every time",
    text: "Every time I export from Revit to DWG the layer mapping resets to defaults. I have a custom mapping table saved but the export dialog ignores it after each Revit session restart. Our consultants need clean DWG deliverables and I end up remapping 60+ layers manually each week.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Use",
    subphase: "Use",
    product: "Revit",
    date: "4 March 2019",
    isoDate: "2019-03-04",
    forum: "Revit Forums",
  },
  {
    id: "c38",
    title: "Dynamo scripts make Revit so much more powerful",
    text: "Just started learning Dynamo and it has completely changed how I approach repetitive tasks in Revit. Renumbered 400 doors across 12 levels in under a minute. The visual programming interface has a learning curve but the community packages are incredibly well documented.",
    source: "Forums",
    sentiment: "Positive",
    phase: "Learn",
    subphase: "Learn",
    product: "Revit",
    date: "22 June 2019",
    isoDate: "2019-06-22",
    forum: "Revit Forums",
  },
  {
    id: "c39",
    title: "Why can't I transfer my license to a new machine without calling support?",
    text: "Upgraded my workstation and need to move my Inventor license. The online portal says to contact support, support says 48 hour wait. In a production environment this is completely unacceptable — I'm dead in the water for two days because of a hardware upgrade.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Manage",
    subphase: "Control",
    product: "Inventor",
    date: "3 January 2020",
    isoDate: "2020-01-03",
    forum: "Support Cases",
  },
  {
    id: "c40",
    title: "Civil 3D corridor modeling has gotten really intuitive",
    text: "The improvements to corridor modeling in the recent releases are substantial. Assembly sets and target mapping that used to take a full day of setup now take an hour. Our highway interchange project went from concept to grading plan in a fraction of the usual time.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Use",
    subphase: "Use",
    product: "AutoCAD Civil 3D",
    date: "11 August 2019",
    isoDate: "2019-08-11",
    forum: "Product Survey",
  },
  {
    id: "c41",
    title: "Fusion 360 personal use license restrictions are too limiting",
    text: "The personal use license used to allow 10 active documents but now limits to 3 editable designs with reduced export formats. For hobbyists and makers this feels like bait and switch. I understand the business model but many of us evangelized this product to our employers based on the personal experience.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Subscribe",
    subphase: "Select",
    product: "Fusion 360",
    date: "1 February 2020",
    isoDate: "2020-02-01",
    forum: "Fusion 360 Forums",
  },
  {
    id: "c42",
    title: "BIM 360 permission model is confusing for project admins",
    text: "Spent two hours trying to figure out why a subcontractor could see structural models but not MEP. The permission inheritance between project-level, folder-level, and document-level access is not intuitive at all. We need a simple matrix view showing who can see what.",
    source: "Cases",
    sentiment: "Negative",
    phase: "Manage",
    subphase: "Control",
    product: "BIM 360",
    date: "21 September 2019",
    isoDate: "2019-09-21",
    forum: "Support Cases",
  },
  {
    id: "c43",
    title: "Arnold GPU rendering in Maya is a massive time saver",
    text: "Switched from CPU to GPU rendering in Arnold and our lookdev iteration time dropped from 8 minutes to 45 seconds per frame. The visual parity between GPU and final CPU renders is close enough for client reviews. This single change transformed our entire lighting pipeline.",
    source: "Forums",
    sentiment: "Positive",
    phase: "Use",
    subphase: "Use",
    product: "Maya",
    date: "9 June 2019",
    isoDate: "2019-06-09",
    forum: "Arnold for Maya Forum",
  },
  {
    id: "c44",
    title: "Need better interoperability between Inventor and Fusion 360",
    text: "Our team uses Inventor for production assemblies and Fusion 360 for concept modeling. Transferring designs between the two always loses feature history and constraints. For products in the same family this level of friction between tools is surprising and frustrating.",
    source: "Surveys",
    sentiment: "Mixed",
    phase: "Use",
    subphase: "Use",
    product: "Inventor",
    date: "4 March 2020",
    isoDate: "2020-03-04",
    forum: "Product Survey",
  },
  {
    id: "c45",
    title: "AutoCAD web app is perfect for field markup",
    text: "Started using the AutoCAD web app for redline markup during site visits and it works surprisingly well on a tablet. Being able to open DWG files directly from BIM 360 docs without any conversion is the key feature. Our field engineers adopted it immediately without any training.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Use",
    subphase: "Use",
    product: "AutoCAD",
    date: "20 February 2020",
    isoDate: "2020-02-20",
    forum: "Product Survey",
  },
  {
    id: "c46",
    title: "Civil 3D surface not displaying in Navisworks",
    text: "I'm trying to append a Civil 3D surface into Navisworks with no success. I know I need the Object Enabler installed but the download link on the Autodesk website leads to a 404 page. The documentation references URLs that no longer exist.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Use",
    subphase: "Use",
    product: "AutoCAD Civil 3D",
    date: "16 July 2019",
    isoDate: "2019-07-16",
    forum: "Civil 3D Forums",
  },
  {
    id: "c47",
    title: "3ds Max to Unreal Engine pipeline needs work",
    text: "Exporting FBX from 3ds Max to Unreal Engine consistently loses material assignments and UV channel mappings. Every asset requires 15 minutes of manual cleanup after import. Competing tools have one-click pipelines now and our team is starting to ask hard questions about staying with Max.",
    source: "Forums",
    sentiment: "Negative",
    phase: "Use",
    subphase: "Use",
    product: "3DS Max",
    date: "10 May 2020",
    isoDate: "2020-05-10",
    forum: "3ds Max Forums",
  },
  {
    id: "c48",
    title: "Inventor iLogic automation saved hundreds of engineering hours",
    text: "Built an iLogic ruleset that auto-generates our standard bracket configurations from a single parametric model. What used to require an engineer manually creating each variant now produces 200+ configurations in an afternoon. The ROI on learning iLogic was immediate and dramatic.",
    source: "Surveys",
    sentiment: "Positive",
    phase: "Use",
    subphase: "Use",
    product: "Inventor",
    date: "12 April 2020",
    isoDate: "2020-04-12",
    forum: "Product Survey",
  },
];
