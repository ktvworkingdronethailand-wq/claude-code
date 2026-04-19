/**
 * KTV Working Drone Thailand — Thailand Climate Change Act Configuration
 *
 * Codifies the Thailand Climate Change Act (2025) regulatory framework:
 * ETS cap-and-trade, GHG reporting, carbon tax, CBAM, Climate Fund, TGO.
 *
 * Integrates: IFS "Green FM" marketing strategy, IoT fleet monitoring,
 * ESG drone van framework, and Smart Green Operations telemetry.
 */

// ── Emissions Trading System (ETS) ──────────────────────────

export const THAILAND_ETS = {
  mechanism: 'cap-and-trade',
  regulator: 'TGO (Thailand Greenhouse Gas Management Organization)',
  description: 'Government sets emission limits; designated entities buy/sell allowances',
  ktvRelevance: {
    position: 'Carbon credit generator — drone ops produce 96% fewer emissions than rope access',
    strategy: 'Accumulate carbon credits from verified drone missions, trade or sell to FM clients',
    clientValue: 'IFS FM clients can offset building maintenance emissions via KTV drone services',
  },
  allowanceTrading: {
    registry: 'Thailand Carbon Credit Exchange (upcoming)',
    verificationBody: 'TGO',
    creditType: 'T-VER (Thailand Voluntary Emission Reduction)',
    ktvCreditSources: [
      'GHG reduction: drone vs rope access per sqm cleaned',
      'Water savings: 0.3 L/sqm vs 0.7+ L/sqm conventional',
      'Chemical reduction: 0.05 L/sqm eco-product line',
      'Energy efficiency: electric drone vs diesel-powered equipment',
    ],
  },
} as const;

// ── Mandatory GHG Reporting ─────────────────────────────────

export const GHG_REPORTING = {
  mandate: 'Public and private sectors must report emissions, carbon sinks, and net reductions',
  registry: 'National GHG Registry (TGO-administered)',
  reportingFrequency: 'annual',
  scopes: {
    scope1: 'Direct emissions from owned/controlled sources (drone fleet energy)',
    scope2: 'Indirect emissions from purchased energy (charging infrastructure)',
    scope3: 'Value chain emissions (client building maintenance baseline)',
  },
  ktvMetrics: {
    droneEmissionsPerMission: {
      unit: 'kgCO2e',
      calculation: 'Battery kWh × grid emission factor (Thailand: 0.4999 kgCO2/kWh)',
    },
    baselineAvoidance: {
      unit: 'kgCO2e',
      calculation: 'Rope access baseline emissions minus drone mission emissions',
      reductionPercent: 96,
    },
    waterFootprint: {
      unit: 'liters/sqm',
      droneMethod: 0.3,
      conventionalMethod: 0.7,
      savingsPercent: 57,
    },
  },
  smartGreenFields: [
    'ghg_scope1_kgco2e',
    'ghg_scope2_kgco2e',
    'ghg_scope3_avoided_kgco2e',
    'carbon_credits_generated',
    'water_consumption_liters',
    'chemical_consumption_liters',
    'energy_consumption_kwh',
    'work_at_height_hours_avoided',
  ],
} as const;

// ── Carbon Tax & Pricing ────────────────────────────────────

export const CARBON_TAX = {
  framework: 'Legal framework for carbon tax alongside ETS',
  cbam: {
    name: 'Thailand CBAM (Carbon Border Adjustment Mechanism)',
    scope: 'Imported goods with embedded carbon intensity',
    ktvImpact: 'Minimal — all operations domestic; benefits clients importing FM equipment',
  },
  carbonPricing: {
    estimatedRateThbPerTon: 200,
    globalBenchmark: 'EU ETS ~EUR 60/ton; Thailand starting conservative',
    ktvAdvantage: 'Drone operations near carbon-neutral; competitors face increasing carbon costs',
  },
} as const;

// ── Climate Fund ────────────────────────────────────────────

export const CLIMATE_FUND = {
  name: 'Thailand Climate Fund',
  funding: ['Carbon tax revenue', 'ETS auction proceeds', 'International climate finance'],
  eligibleProjects: [
    'Clean energy investments',
    'Adaptation projects',
    'GHG reduction programs',
    'Green technology deployment',
  ],
  ktvOpportunity: {
    category: 'GHG reduction through technology deployment',
    proposal: 'Drone-enabled facade maintenance as verified GHG reduction program',
    fundingUse: 'Fleet expansion, IoT sensor deployment, Smart Green R&D',
  },
} as const;

// ── Governing Structure ─────────────────────────────────────

export const CLIMATE_GOVERNANCE = {
  policyBody: 'National Climate Change Policy Committee',
  regulator: 'TGO (Thailand Greenhouse Gas Management Organization)',
  tgoFunctions: [
    'ETS administration and allowance allocation',
    'GHG registry management',
    'Carbon credit verification (T-VER program)',
    'Climate reporting standards enforcement',
    'CBAM implementation oversight',
  ],
  ktvCompliance: {
    registration: 'Register as carbon credit generator with TGO',
    reporting: 'Annual GHG report via Smart Green Operations telemetry',
    verification: 'Independent assurance: Bureau Veritas / DNV / SGS Thailand',
    credits: 'T-VER credits from verified emission reductions per mission',
  },
} as const;

// ── IFS "Green FM" Marketing Strategy ───────────────────────

export const IFS_GREEN_FM_STRATEGY = {
  positioning: 'IFS Thailand as the "Green FM" company — Thailand\'s first carbon-verified FM provider',
  tagline: 'Green FM by IFS × KTV — Where Facility Management Meets Climate Action',
  targetAudience: [
    'GRESB-reporting property funds and REITs',
    'SET-listed companies with ESG disclosure requirements',
    'Multinational tenants with corporate sustainability mandates',
    'Green building certified properties (LEED, TREES, WELL)',
    'Government agencies under Climate Change Act reporting',
  ],
  valueProposition: [
    '96% GHG reduction vs traditional facade maintenance — verified per mission',
    'Carbon credits generated from every drone cleaning cycle',
    'Thailand Climate Change Act compliant GHG reporting built-in',
    'ETS-ready: carbon allowance trading position from day one',
    'GRESB, TREES, LEED, WELL, SET One Report data integration',
    'IoT-enabled real-time environmental monitoring across all sites',
  ],
  competitiveEdge: {
    vsTraditionalFm: 'Zero GHG reporting capability, high carbon footprint, no ESG data',
    vsCompetitorDrones: 'No Smart Green platform, no carbon credit generation, no GRESB integration',
    moat: 'Only FM provider with verified per-mission carbon accounting under Climate Change Act',
  },
  salesMessages: [
    'Your buildings generate carbon credits, not carbon costs.',
    'Every drone mission produces a verifiable ESG certificate your investors can audit.',
    'Thailand\'s Climate Change Act is coming — your FM partner should already be compliant.',
    'Green FM isn\'t a cost — it\'s a revenue line through carbon credit trading.',
    'IFS Green FM: the only facility management service that pays for itself in carbon savings.',
  ],
  campaigns: [
    {
      name: 'Climate Act Readiness',
      channel: 'Direct to property managers & CFOs',
      message: 'Is your building ready for mandatory GHG reporting? IFS Green FM makes compliance automatic.',
    },
    {
      name: 'Carbon Credit Generator',
      channel: 'GRESB fund managers & REITs',
      message: 'Turn facade maintenance from a cost center into a carbon credit revenue stream.',
    },
    {
      name: 'Green Building Accelerator',
      channel: 'LEED/TREES certification consultants',
      message: 'Unlock 4+ green building credits with drone-verified environmental data.',
    },
    {
      name: 'ESG Investor Report',
      channel: 'SET-listed company IR departments',
      message: 'Automated ESG data for your 56-1 One Report — no manual data collection.',
    },
  ],
} as const;

// ── IoT Fleet Monitoring ────────────────────────────────────

export const IOT_FLEET_MONITORING = {
  description: 'IoT sensor network across all fleet vehicles and ESG drone van for real-time environmental monitoring',
  droneVanFramework: {
    name: 'KTV ESG Drone Van',
    concept: 'Mobile command center with integrated IoT environmental monitoring',
    sensors: [
      { type: 'air-quality', metric: 'PM2.5/PM10', unit: 'ug/m3', frequency: 'continuous' },
      { type: 'air-quality', metric: 'CO2', unit: 'ppm', frequency: 'continuous' },
      { type: 'air-quality', metric: 'VOC', unit: 'ppb', frequency: 'continuous' },
      { type: 'temperature', metric: 'Ambient Temperature', unit: 'C', frequency: '1min' },
      { type: 'humidity', metric: 'Relative Humidity', unit: '%', frequency: '1min' },
      { type: 'noise', metric: 'Sound Level', unit: 'dB', frequency: '5min' },
      { type: 'energy', metric: 'Van Energy Consumption', unit: 'kWh', frequency: '1min' },
      { type: 'water', metric: 'Water Consumption', unit: 'liters', frequency: 'per-mission' },
      { type: 'chemical', metric: 'Chemical Usage', unit: 'liters', frequency: 'per-mission' },
      { type: 'gps', metric: 'Vehicle Location', unit: 'lat/lng', frequency: '10s' },
    ],
  },
  droneSensors: [
    { type: 'telemetry', metric: 'Flight Energy', unit: 'kWh', frequency: 'per-flight' },
    { type: 'telemetry', metric: 'Flight Duration', unit: 'minutes', frequency: 'per-flight' },
    { type: 'telemetry', metric: 'Area Covered', unit: 'sqm', frequency: 'per-flight' },
    { type: 'environmental', metric: 'Spray Volume', unit: 'liters', frequency: 'per-flight' },
    { type: 'environmental', metric: 'Chemical Concentration', unit: '%', frequency: 'per-flight' },
    { type: 'thermal', metric: 'Surface Temperature', unit: 'C', frequency: 'continuous' },
    { type: 'thermal', metric: 'Thermal Anomaly Count', unit: 'count', frequency: 'per-flight' },
  ],
  dataFlow: {
    collection: 'IoT sensors → MQTT broker → Smart Green Operations',
    processing: 'Real-time aggregation → GHG calculation engine → ESG metrics',
    storage: 'Time-series DB → Supabase dashboard → GRESB/T-VER reporting',
    verification: 'Cryptographic signing at source → immutable ledger → independent assurance',
  },
  ghgCalculation: {
    droneEnergyToEmissions: 'kWh × Thailand grid factor (0.4999 kgCO2/kWh)',
    baselineComparison: 'Rope access baseline: diesel generator + manual labor energy footprint',
    netReduction: 'Baseline emissions - Drone emissions = Carbon credits (T-VER)',
    verificationMethod: 'Per-mission signed certificate with IoT telemetry hash',
  },
} as const;

// ── GHG Monitoring Dashboard Metrics ────────────────────────

export const GHG_DASHBOARD_METRICS = {
  realtime: [
    { metric: 'Fleet Carbon Footprint', unit: 'kgCO2e/day', source: 'drone telemetry + van IoT' },
    { metric: 'Carbon Credits Generated', unit: 'tCO2e MTD', source: 'mission completion events' },
    { metric: 'Water Efficiency', unit: 'L/sqm avg', source: 'spray system IoT' },
    { metric: 'Energy Consumption', unit: 'kWh/day', source: 'charging + van power IoT' },
    { metric: 'Air Quality Index', unit: 'AQI', source: 'van PM2.5 sensor' },
    { metric: 'Work-at-Height Hours Avoided', unit: 'hours MTD', source: 'mission logs' },
  ],
  periodic: [
    { metric: 'Monthly GHG Report', frequency: 'monthly', recipient: 'TGO registry' },
    { metric: 'Quarterly ESG Certificate', frequency: 'quarterly', recipient: 'GRESB / clients' },
    { metric: 'Annual Climate Act Report', frequency: 'annual', recipient: 'TGO / SET disclosure' },
    { metric: 'Carbon Credit Statement', frequency: 'quarterly', recipient: 'ETS trading desk' },
  ],
} as const;

// ── Consolidated ESG Compliance Matrix ──────────────────────

export const ESG_COMPLIANCE_MATRIX = {
  frameworks: [
    {
      name: 'Thailand Climate Change Act',
      body: 'TGO',
      requirements: ['GHG reporting', 'ETS participation', 'Carbon tax compliance'],
      ktvCoverage: 'Full — Smart Green + IoT telemetry',
    },
    {
      name: 'GRESB Real Estate Assessment',
      body: 'GRESB Foundation',
      requirements: ['PE1-Energy', 'PE2-GHG', 'PE3-Water', 'PE4-Waste', 'PE5-H&S'],
      ktvCoverage: 'Full — per-mission ESG evidence',
    },
    {
      name: 'TREES (Thai Green Building)',
      body: 'TGBI',
      requirements: ['Water', 'Energy', 'IEQ', 'Innovation'],
      ktvCoverage: 'Partial — Water + Innovation credits',
    },
    {
      name: 'LEED O+M',
      body: 'USGBC',
      requirements: ['Exterior maintenance', 'Indoor air', 'IPM'],
      ktvCoverage: 'Partial — exterior + air quality',
    },
    {
      name: 'SET One Report (56-1)',
      body: 'SEC Thailand',
      requirements: ['ESG disclosure', 'Climate risk', 'Carbon footprint'],
      ktvCoverage: 'Full — automated ESG appendix',
    },
    {
      name: 'T-VER',
      body: 'TGO',
      requirements: ['Emission reduction verification', 'Carbon credit issuance'],
      ktvCoverage: 'Full — per-mission verified reduction',
    },
  ],
} as const;
