/**
 * KTV Working Drone Thailand - JV Partner & Strategic Configuration
 *
 * Master rules for the KTV–IFS–Skyller joint venture structure,
 * Smart Green Operations product, financial base case, and Phase 1 rollout.
 */

// ── JV Ownership & Governance ────────────────────────────────

export const JV_STRUCTURE = {
  ownership: {
    ktv: { stake: 50, role: 'Control, technology owner, brand and operating framework' },
    ifs: { stakeMax: 25, role: 'Exclusive FM channel in Thailand' },
    skyller: { stakeMax: 25, role: 'Exclusive O&G drone cleaning and inspection partner under IFS' },
  },
  governance: {
    boardControl: 'ktv',
    boardRepresentation: ['ktv', 'ifs', 'skyller'] as const,
    reservedMatters: true,
    buyoutMechanisms: true,
  },
  equityMilestones: {
    criteria: [
      'Revenue and sqm under drone service within their channels',
      'Number of live, integrated sites using Smart Green Operations',
      'Safety, operational performance and ESG reporting adoption',
    ],
    capsStrict: true, // max 25% each unless Series A or restructuring agreed
  },
} as const;

// ── IFS Thailand – FM Partner ────────────────────────────────

export const IFS_PARTNER = {
  name: 'IFS Thailand',
  role: 'Exclusive FM partner for KTV drone services in Thailand',
  sectors: [
    'Aviation',
    'Business & IT',
    'Healthcare',
    'Energy & Resources',
    'Manufacturing & Industry',
    'Commercial Towers',
    'Campuses',
  ] as const,
  channelScope: {
    exclusiveFm: true,
    description: 'All drone-enabled FM services go through IFS within its FM portfolio',
    noCompetingProviders: true,
  },
  equityTriggers: {
    revenueThresholds: [32_000_000, 64_000_000, 160_000_000] as const, // THB
    smartGreenIntegration: { minSites: 5, minMonths: 3 },
  },
  fmJobScope: [
    'General building FM: commercial towers, offices, campuses, retail',
    'Healthcare, education, airports',
    'Facade/window/solar cleaning via KTV drones',
    'Core FM services with ESG data reporting',
  ] as const,
  salesMessaging: [
    'You already own the FM relationship; we plug in world-class drones and ESG data.',
    'We turn risky, manual facade cleaning into a digital, data-driven service with visible innovation.',
    'Your clients see measurable safety and ESG gains in standard reports via Smart Green Operations.',
  ] as const,
} as const;

// ── Skyller – O&G and Inspection Partner ─────────────────────

export const SKYLLER_PARTNER = {
  name: 'Skyller',
  role: 'Specialist O&G drone inspection and industrial cleaning partner',
  backing: 'VC-backed',
  expertise: ['O&G', 'hazardous environments', 'industrial inspection'] as const,
  channelPosition: 'Under IFS umbrella for Energy & Resources, Transport & Infrastructure, Manufacturing & Industry',
  equityMax: 25,
  ogJobScope: [
    'O&G assets, flares, tanks, vessels, pipelines, refineries',
    'Hazardous sites inspection and safety operations',
    'KTV adds cleaning/surface treatment where relevant',
  ] as const,
  channelRules: {
    noCompetingFmChannel: true, // Skyller does not build competing FM channel in Thailand
    ifsNoCompetingDroneStack: true, // IFS does not build competing drone cleaning stack
  },
  narrative: {
    skyller: 'Premium O&G flight-ops and inspection player',
    ifs: 'Steady pipeline of multi-site FM contracts',
    ktv: 'Drone cleaning/surface treatment system and Smart Green data layer',
  },
} as const;

// ── Smart Green Operations Product ───────────────────────────

export const SMART_GREEN_OPERATIONS = {
  name: 'Smart Green Operations',
  description: 'Smart, green operations platform linking KTV autonomous drones, ESG data capture, and FM workflows',
  coreFunctions: [
    'Orchestrates drone missions and work orders across multiple sites',
    'Captures telemetry: sqm cleaned, water/chemical consumption, time at height avoided, energy usage',
    'Produces cryptographically verifiable ESG metrics for GRESB and green building reporting',
  ] as const,
  ifsIntegration: {
    role: 'Drone + ESG layer for FM contracts',
    milestones: [
      'Smart Green embedded into IFS FM operational processes',
      'Used daily/weekly across at least 5-10 live IFS sites for 3-6 months',
      'KPIs visible in standard IFS client reports',
    ],
    kpis: ['sqm cleaned', 'water savings', 'chemical savings', 'work-at-height hours avoided'],
  },
  differentiators: [
    'Only drone operations platform positioned as GRESB-ready for FM operators',
    'Converts drone cleaning from one-off jobs into recurring, data-rich FM service',
    'Future-proof layer for ESG and digital FM strategy in Thailand and SE Asia',
  ] as const,
  telemetryFields: {
    sqmCleaned: 'number',
    waterConsumptionLiters: 'number',
    chemicalConsumptionLiters: 'number',
    timeAtHeightAvoidedMinutes: 'number',
    energyUsageKwh: 'number',
    safetyIncidents: 'number',
    missionDurationMinutes: 'number',
  },
} as const;

// ── Financial Base Case ──────────────────────────────────────

export const FINANCIAL_BASE_CASE = {
  currency: 'THB',
  fxRate: { usdToThb: 35.5 },
  pricing: {
    basePricePerSqm: 45,
    marketRangeLow: 15,
    marketRangeHigh: 70,
  },
  year1: {
    grossRevenue: 180_180_000,
    impliedVolumeSqm: 4_004_000,
    netIncome: 112_283_616,
    freeCashFlow: 97_884_816,
  },
  projections: {
    overallIrr: '260-280%',
    paybackMonths: '9-11',
  },
  capital: {
    totalEquityUsd: 1_455_000,
    totalEquityThb: 51_652_500,
    useOfFunds: [
      'Drones/equipment/vehicles',
      'Working capital and operations',
      'Marketing and business development',
      'Insurance and legal setup',
      'Contingency reserve',
    ] as const,
  },
  agentGuardrails: {
    healthyGrossMargins: true,
    maxPaybackMonths: 18,
    noFleetOvercommit: true,
    equityMilestonesMustBeRealistic: true,
  },
} as const;

// ── Phase 1: IFS Thailand FM Rollout ─────────────────────────

export const PHASE1_ROLLOUT = {
  objective: 'Secure IFS as exclusive FM partner and launch first wave of pilot sites',
  steps: [
    {
      step: 1,
      action: 'Sign JV / exclusivity and equity framework',
      details: 'KTV 50%, IFS up to 25%, Skyller up to 25%',
    },
    {
      step: 2,
      action: 'Select 1-3 initial IFS sites as flagship pilots',
      examples: ['Commercial tower', 'Campus', 'Industrial facility'],
    },
    {
      step: 3,
      action: 'Deploy KTV drones and Smart Green Operations at pilot sites',
      kpis: [
        'sqm cleaned',
        'safety incidents (target 0)',
        'time and cost vs rope access',
        'ESG metrics captured (water, chemicals, work-at-height avoided)',
      ],
    },
    {
      step: 4,
      action: 'Scale to broader IFS portfolio after pilot success',
      revenueThresholds: [32_000_000, 64_000_000, 160_000_000], // THB
    },
  ] as const,
  pilotSiteTypes: ['commercial-tower', 'campus', 'industrial'] as const,
  targetSafetyIncidents: 0,
} as const;

// ── Operations & Compliance ──────────────────────────────────

export const OPERATIONS_COMPLIANCE = {
  regulator: 'CAAT (Civil Aviation Authority of Thailand)',
  validationChecklist: [
    'Site location type (urban, suburban, industrial, O&G)',
    'Height profiles and proximity to sensitive infrastructure',
    'Need for permits, clearances, and coordination with building/FM teams',
  ] as const,
  safetyPriorities: [
    'Work-at-height risk reduction messaging (zero incidents target)',
    'Track avoided work-at-height hours via Smart Green',
  ] as const,
  capacityRules: [
    'Align fleet and crew planning with financial capacity and Phase 1 rollout targets',
    'Update operations memory when new SOPs or CAAT guidance are introduced',
  ] as const,
} as const;
