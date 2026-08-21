export type ValidationState = {
  verified: number;
  unclear: number;
  notCovered: number;
  incorrect: number;
};

export type Platform = {
  id: string;
  name: string;
  family: "search" | "agent";
  role: string;
  verb: string;
  strength: string;
  watchFor: string;
  handoff: string;
  coverage: number;
  coverageLow: number;
  coverageHigh: number;
  generationRate: number | null;
  roundOverlap: number;
  firstUsefulSeconds: number;
  validation: ValidationState;
  provenanceNote: string;
};

export const platforms: Platform[] = [
  {
    id: "tiktok",
    name: "TikTok",
    family: "search",
    role: "Inspiration with visible creator context",
    verb: "Discover",
    strength: "Creator identity and experiential language were easy to see in the captured results.",
    watchFor: "Scenario constraints were only partly covered, and commercial context was often incomplete in visible text.",
    handoff: "Carry the creator, direct item link, and claims into a layer that can verify them.",
    coverage: 65.7457,
    coverageLow: 56.4881,
    coverageHigh: 74.8132,
    generationRate: null,
    roundOverlap: 38.0952,
    firstUsefulSeconds: 2.67,
    validation: { verified: 0, unclear: 15, notCovered: 19, incorrect: 0 },
    provenanceNote: "Creator identity was visible for 91.7% of captured items; only 2 of 33 commercial-visible observations showed full disclosure in captured text.",
  },
  {
    id: "youtube",
    name: "YouTube",
    family: "search",
    role: "A route to deeper reviews",
    verb: "Route to depth",
    strength: "Channels, URLs, and sponsored modules were legible on the captured search page.",
    watchFor: "Titles and metadata could not answer every complex scenario; the videos themselves were outside this study.",
    handoff: "Use the result page to choose what to watch, then preserve the chosen review as evidence.",
    coverage: 47.538,
    coverageLow: 38.0969,
    coverageHigh: 57.2569,
    generationRate: null,
    roundOverlap: 53.8462,
    firstUsefulSeconds: 1.5475,
    validation: { verified: 2, unclear: 16, notCovered: 16, incorrect: 0 },
    provenanceNote: "Creator identity was visible for 86.5% of captured items; all 46 commercial-visible observations carried a visible disclosure signal.",
  },
  {
    id: "google-ai-mode",
    name: "Google AI Mode",
    family: "agent",
    role: "Source-linked synthesis with state handling",
    verb: "Synthesize + verify",
    strength: "Generated answers usually covered constraints and exposed links to supporting pages.",
    watchFor: "Eight Round 2 tasks showed fallback results instead of an AI answer; three narrow incorrect claims were coded.",
    handoff: "Keep generation state visible and route consequential claims through a verification queue.",
    coverage: 95.0612,
    coverageLow: 91.2748,
    coverageHigh: 98.0159,
    generationRate: 83.3333,
    roundOverlap: 18.6076,
    firstUsefulSeconds: 4.8165,
    validation: { verified: 27, unclear: 2, notCovered: 2, incorrect: 3 },
    provenanceNote: "40 of 48 initial answers generated; 18 of 20 commercial-visible observations showed full disclosure in captured text.",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    family: "agent",
    role: "Constraint organizer and decision canvas",
    verb: "Structure",
    strength: "All 48 initial answers were generated and consistently organized constraints, trade-offs, and disqualifiers.",
    watchFor: "The structured record did not retain every destination URL behind visible source buttons.",
    handoff: "Export durable claim-level links and creator context with the structured decision.",
    coverage: 98.2556,
    coverageLow: 96.3459,
    coverageHigh: 99.7685,
    generationRate: 100,
    roundOverlap: 32.2644,
    firstUsefulSeconds: 1.83,
    validation: { verified: 31, unclear: 3, notCovered: 0, incorrect: 0 },
    provenanceNote: "48 of 48 initial answers generated; visible source labels were present, while destination completeness was not recoverable for every button.",
  },
];

export const validationTotals: ValidationState = {
  verified: 60,
  unclear: 36,
  notCovered: 37,
  incorrect: 3,
};

export const surveyLayers = {
  strict: {
    label: "Primary",
    n: 73,
    note: "Current U.S. adults who met the frozen eligibility definition and researched a target category in the prior 12 months.",
    handoff: [
      { label: "Approve each handoff", n: 30, denominator: 73, value: 41.0959 },
      { label: "Automatic handoff", n: 26, denominator: 73, value: 35.6164 },
      { label: "No cross-product handoff", n: 17, denominator: 73, value: 23.2877 },
    ],
    improvements: [
      { label: "Direct links or citations", n: 25, denominator: 72, value: 34.7222 },
      { label: "Side-by-side comparison", n: 18, denominator: 72, value: 25 },
      { label: "Current price and availability", n: 17, denominator: 72, value: 23.6111 },
      { label: "Save or export a shortlist", n: 17, denominator: 72, value: 23.6111 },
      { label: "Carry needs and constraints", n: 16, denominator: 72, value: 22.2222 },
      { label: "Label ads and incentives", n: 16, denominator: 72, value: 22.2222 },
    ],
  },
  expanded: {
    label: "Expanded sensitivity",
    n: 122,
    note: "Includes all 73 primary respondents plus 49 additional eligible U.S. adults retained for a broader sensitivity check.",
    handoff: [
      { label: "Approve each handoff", n: 49, denominator: 122, value: 40.1639 },
      { label: "Automatic handoff", n: 46, denominator: 122, value: 37.7049 },
      { label: "No cross-product handoff", n: 27, denominator: 122, value: 22.1311 },
    ],
    improvements: [
      { label: "Direct links or citations", n: 39, denominator: 121, value: 32.2314 },
      { label: "Side-by-side comparison", n: 27, denominator: 121, value: 22.314 },
      { label: "Current price and availability", n: 35, denominator: 121, value: 28.9256 },
      { label: "Save or export a shortlist", n: 25, denominator: 121, value: 20.6612 },
      { label: "Carry needs and constraints", n: 28, denominator: 121, value: 23.1405 },
      { label: "Label ads and incentives", n: 23, denominator: 121, value: 19.0083 },
    ],
  },
} as const;

export const roadmap = {
  first: [
    { name: "Consent-based Intent Passport", job: "Carry budget, ecosystem, constraints, and exclusions with Approve / Auto / Off controls." },
    { name: "Claim-to-Proof Graph", job: "Bind each consequential claim to an accessible source, creator, date, and evidence type." },
    { name: "Verification Queue", job: "Flag volatile, unsupported, contradictory, or safety-relevant claims before shortlist entry." },
    { name: "Decision Canvas", job: "Compare trade-offs, disqualifiers, and unresolved questions in one inspectable view." },
  ],
  next: [
    { name: "Portable Shortlist Snapshot", job: "Export constraints, timestamps, source links, and verification states." },
    { name: "Origin-preserving Evidence Drawer", job: "Keep creator context, incentives, and direct item links visible inside synthesis." },
  ],
} as const;
