import type { EditorialBriefData } from "./types";

export const briefs: EditorialBriefData[] = [
  {
    id: "first-messaging-experience",
    title: "First messaging experience in Messenger",
    subtitle:
      "Redesigning the icebreaker UI across Messenger and Facebook to create a consistent, high-performing first-message experience for messaging ads.",
    company: "Meta",
    year: "2026",
    domains: ["Messaging"],
    bet: "Facebook's bottom sheet icebreakers consistently outperformed Messenger's despite looking outdated. Neither platform looked like the other or behaved the same — and no one had a shared theory for why.",
    metrics: [
      { value: "+$10M/yr", label: "Incremental revenue" },
      { value: "TBD", label: "CTR lift (experiment)" },
    ],
    constraint:
      "Two platforms with different design systems, different motion languages, and different interaction models. Any unified solution had to feel native on both while resolving the multi-tap edge case on bottom sheet.",
    move: "Ran an A/B/Control experiment (icon vs. no icon vs. control) across both surfaces. Designed platform-specific animation patterns within a shared visual framework. Resolved the multi-tap edge case and evolved the pattern into ongoing consumer suggested messages.",
    workDescription:
      "Icebreaker redesign across Messenger and Facebook bottom sheet — experiment design, animation patterns, cross-platform unification.",
    unlock:
      "Shipped a unified first-message experience that became the foundation for consumer suggested messages — extending engagement beyond the initial prompt.",
    hasDeepWork: true,
    ic6Themes: ["Cross-platform systems", "Experimentation"],
  },
  {
    id: "genai-conversations",
    title: "Less Work, Better Ads with Generative AI",
    subtitle:
      "I rebuilt the Message Template card as a GenAI-first Chat Builder — the post-click surface in Ads Manager where CTM advertisers shape what people see after they tap.",
    company: "Meta",
    year: "2024",
    domains: ["AI"],
    bet: "The legacy Message Template card looked like a feature; operationally it was a bottleneck. Flat IA, manual copywriting, and zero guidance meant almost no one customized — and the org still had to fund a foundational fix.",
    metrics: [
      { value: "85", label: "UPB benchmark score (from 62)" },
      { value: "100%", label: "Task completion on Flow 75 retest" },
      { value: "95%", label: "GenAI icebreaker adoption (shipping cohort)" },
      { value: "23.7%", label: "CTR on GenAI icebreakers vs 13.6% default" },
    ],
    constraint:
      "Post-click settings for CTM sat across six teams. Any redesign had to clear Ads Manager quality bars, UPB usability gates, and CFO-level monetization scrutiny — without fragmenting GenAI and non-GenAI markets.",
    move: "I linked UPB remediation, Advantage+ Generative AI, and the North Star IA into one program, redefined the UPB task around reviewing AI-generated icebreakers (not hand-writing everything), and shipped a decoupled UI architecture that scales globally.",
    workDescription:
      "Chat Builder L1 card, recommended-template flows, GenAI vs non-GenAI variants, stakeholder alignment across CTM / CTWA / CTD and Ads Manager.",
    unlock:
      "Flow 75 graduated at UPB 85 with 100% task completion. Launch held ad performance neutral while clearing guardrails — proof the new foundation could carry the next wave of GenAI without breaking a multi-billion-dollar funnel.",
    ic6Themes: ["Organizational influence", "Vision artifacts"],
    hasDeepWork: true,
  },
  {
    id: "inbox-ads",
    title: "Increasing ad creation from business inboxes",
    subtitle: "Businesses use Instagram, Messenger, and WhatsApp to talk directly with their customers, but had no easy access to the best tool for getting more messages (messaging ads) from the place they actually spend their time.",
    company: "Meta",
    year: "2022",
    domains: ["Monetization"],
    bet: "The Messenger inbox — seen by billions daily — was an untapped ad surface because previous attempts at inbox advertising felt invasive and eroded user trust.",
    metrics: [
      { value: "+$300M", label: "Projected 5-year revenue" },
      { value: "+6%", label: "IG messaging ad purchases" },
      { value: "100M+", label: "Business accounts reached" },
      { value: "1st", label: "Native ad creation in Messenger" },
    ],
    constraint:
      "Any new ad format had to pass Meta's internal user-experience quality bar while satisfying advertisers' ROI expectations — two constituencies with historically opposing incentives. The CFO's organization was a direct stakeholder in the revenue targets.",
    move: "Introduced contextual entry points that earned their place in the inbox through relevance rather than interruption. Led the cross-team design strategy across three surface variants, navigating org politics between the Messenger UX team and the Ads monetization team.",
    workDescription:
      "Inbox ad entry point designs showing contextual placement, user flow, and engagement patterns.",
    unlock:
      "Proved that user-first ad design could grow revenue without degrading experience, shifting how the Ads organization approaches new surface development. The framework became a template for responsible monetization of communication surfaces.",
    ic6Themes: ["Organizational influence", "Judgment under ambiguity"],
  },
  {
    id: "journey-explorer",
    title: "Unifying qualitative data at scale",
    subtitle: "First qualitative data dashboard at Autodesk — unifying seven data sources so product teams could prioritize with evidence, not opinion.",
    company: "Autodesk",
    year: "2019",
    domains: ["Incubator"],
    bet: "Qualitative data was some of the most insightful feedback Autodesk collected, but it was scattered across seven platforms, impossible to quantify, and rarely used. Prioritization debates stalled on opinion because no one had a shared, data-grounded picture of where customers actually struggled.",
    metrics: [
      { value: "10K+", label: "Employees gained data access" },
      { value: "7", label: "Data sources unified" },
      { value: "1st place", label: "Autodesk hackathon, 2019" },
      { value: "~$1M+", label: "Annual cost reduced" },
    ],
    constraint:
      "Data lived in Salesforce, Qualtrics, PowerBI, Lithium, and three other platforms — each with different access levels, field names, and owners. You first had to know a source existed before you could request a license to see it. There was no standardization, no way to search across sources, and no way to quantify comment volume to gauge severity.",
    move: "I conceptualized a unified qualitative data hub and proved the concept at the 2019 Autodesk hackathon by running multiple data sets through our customer journey taxonomy. After winning, I led the project as both designer and second product owner across a 12-person cross-disciplinary team. We applied taxonomy classification and sentiment tagging across all sources, creating universal filters that let anyone slice the data by journey phase, product, sentiment, and time — without needing a data analyst.",
    workDescription:
      "Interactive qualitative data dashboard with volume, sentiment, and trend views across seven unified data sources.",
    unlock:
      "Journey Explorer democratized access to qualitative data across Autodesk, eliminating the need for individual platform licenses and giving data analysts time back for complex work. The self-service dashboard was used by hundreds of employees monthly and established a repeatable pattern for connecting journey insight to analytics at scale.",
    hasDeepWork: true,
    ic6Themes: [
      "Organizational influence",
      "Mentorship / team amplification",
    ],
  },
  {
    id: "virtual-agent",
    title: "Pioneering self-service AI at Autodesk",
    subtitle:
      "Led the research and prototyping that defined how Autodesk's first virtual agent would communicate, what it could handle, and how it would be deployed to reduce support case loads.",
    company: "Autodesk",
    year: "2016",
    domains: ["AI"],
    bet: "Autodesk offered multiple support channels, but none were instantaneous. For simple questions, customers waited just as long as complex ones. A chatbot could solve repetitive issues faster than a human, but in 2016, customer sentiment toward bots was overwhelmingly negative.",
    metrics: [
      { value: "21", label: "Customer interviews at AU2016" },
      { value: "49", label: "Survey responses analyzed" },
      { value: "27", label: "Chatbots benchmarked" },
      { value: "50+", label: "Watson intents trained" },
    ],
    constraint:
      "Chatbots in 2016 were largely perfunctory form-fillers or novelty toys. Customer survey results showed negative sentiment toward bots based on past experiences. We had to prove that a conversational AI could be helpful without being annoying, and do it with technology that had real limits on what it could understand.",
    move: "Ran a three-method research process: heuristic evaluation of 27 existing bots, a customer survey on preferences and pain points, and live moderated testing at Autodesk University 2016. Built an interactive prototype using IBM Watson BlueMix with 50+ trained intents and deployed it to Slack for consistent, repeatable user testing.",
    workDescription:
      "Conversational AI research and IBM Watson prototype deployed in Slack for live user testing at AU2016.",
    unlock:
      "The research established the voice, use-case scope, and interaction model that became the foundation for AVA, Autodesk Virtual Assistant. AVA now resolves 86% of customer issues in under 4 minutes and is available 24/7 across Autodesk web properties.",
    hasDeepWork: true,
    ic6Themes: [
      "Organizational influence",
      "Vision artifacts",
    ],
  },
];
