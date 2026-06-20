/**
 * KTV Working Drone Thailand — Company Strategy Agents
 *
 * Dedicated agents per target company, each with sub-agent specializations
 * for marketing, sales, and Google Docs strategy documentation.
 * Strategies auto-update weekly via CoWork routines.
 *
 * Target Companies:
 *   Real Estate & FM: JLL, Knight Frank, CBRE, One Bangkok, Frasers, CPN, WHA, AIA
 *   Petrol / Energy:  Shell Thailand, PTT/OR, Bangchak
 *   ESG Leaders:      KBANK, SCB, BBL, Delta Electronics, Indorama, PTTGC
 */

import { CoworkTeamId, StrategyAgent } from '../workflows/cowork.js';

// ── Types ──────────────────────────────────────────────────────

export type CompanySector =
  | 'real-estate-fm'
  | 'petrol-energy'
  | 'banking-green-finance'
  | 'esg-sustainability'
  | 'industrial';

export type SubAgentRole = 'marketing' | 'sales' | 'docs';

export interface CompanyAgent {
  id: string;
  company: string;
  sector: CompanySector;
  website: string;
  country: 'TH';
  keyContacts: string[];
  ktvRelevance: string;
  annualTarget: string;
  coworkTeams: CoworkTeamId[];
  leadAgent: StrategyAgent;
  subAgents: SubAgentSpec[];
  gdriveFolder: string;
  weeklyTasks: CompanyWeeklyTask[];
  strategy: CompanyStrategy;
}

export interface SubAgentSpec {
  role: SubAgentRole;
  focus: string;
  outputs: string[];
  gdriveFile: string;
}

export interface CompanyWeeklyTask {
  id: string;
  name: string;
  subAgent: SubAgentRole;
  action: string;
  outputKey: string;
  gdriveUpdate: boolean;
}

export interface CompanyStrategy {
  positioning: string;
  valueProposition: string;
  entryStrategy: string;
  pricingApproach: string;
  competitiveAdvantage: string;
  timeline: string;
  kpis: string[];
}

// ── Company Agent Definitions ──────────────────────────────────

export const COMPANY_AGENTS: CompanyAgent[] = [

  // ── REAL ESTATE & FM ─────────────────────────────────────────

  {
    id: 'ca-jll',
    company: 'JLL Thailand',
    sector: 'real-estate-fm',
    website: 'https://www.jll.co.th',
    country: 'TH',
    keyContacts: ['Country Head Thailand', 'Head of Property Management', 'ESG Director'],
    ktvRelevance: 'Manages 200+ commercial properties in Bangkok. Published flight-to-green research showing 96% occupiers want green by 2030. Major FM contracts.',
    annualTarget: 'THB 15-25M',
    coworkTeams: ['growth', 'ecosystem'],
    leadAgent: 'market_intelligence_strategist',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV as JLL preferred drone FM vendor for green-certified buildings', outputs: ['JLL co-branded ESG case study', 'Green building maintenance ROI calculator', 'JLL-specific pitch deck'], gdriveFile: 'JLL-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Target JLL managed properties portfolio for drone cleaning contracts', outputs: ['JLL property audit list', 'Pilot proposal (3 buildings)', 'Pricing schedule per sqm'], gdriveFile: 'JLL-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain JLL strategy docs and meeting notes in Google Drive', outputs: ['JLL master strategy doc', 'Meeting minutes', 'Proposal tracker'], gdriveFile: 'JLL-Strategy-Master.md' },
    ],
    gdriveFolder: 'JLL Thailand',
    weeklyTasks: [
      { id: 'jll-mkt-scan', name: 'Scan JLL Thailand property listings and ESG reports', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'jllMktScan', gdriveUpdate: true },
      { id: 'jll-sales-pipe', name: 'Update JLL sales pipeline and contact tracking', subAgent: 'sales', action: 'update-pipeline', outputKey: 'jllPipeline', gdriveUpdate: true },
      { id: 'jll-docs-sync', name: 'Sync JLL strategy docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'jllDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Preferred drone FM partner for JLL managed green-certified portfolio',
      valueProposition: 'Automated facade cleaning with ESG data feed directly into JLL sustainability reports — 14% rental premium enabler',
      entryStrategy: 'Co-present at TGRE 2026 follow-up events, propose 3-building paid pilot',
      pricingApproach: '45 THB/sqm cleaning + Smart Green ESG data subscription',
      competitiveAdvantage: 'Only provider combining drone cleaning + real-time ESG data + GRESB-ready reporting',
      timeline: 'Q3 2026 pilot proposal → Q4 2026 pilot execution → Q1 2027 portfolio rollout',
      kpis: ['Properties under contract', 'Sqm cleaned/quarter', 'ESG reports delivered', 'JLL referrals generated'],
    },
  },

  {
    id: 'ca-knight-frank',
    company: 'Knight Frank Thailand',
    sector: 'real-estate-fm',
    website: 'https://www.knightfrank.co.th',
    country: 'TH',
    keyContacts: ['Managing Director Thailand', 'Head of Property Management', 'Head of Valuation & Advisory'],
    ktvRelevance: 'Premium property advisory with strong Grade A office and condo management portfolio in Bangkok CBD.',
    annualTarget: 'THB 10-18M',
    coworkTeams: ['growth', 'ecosystem'],
    leadAgent: 'sales_playbook_account_selector',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV drone cleaning as premium service matching Knight Frank brand', outputs: ['Knight Frank co-branded materials', 'Premium building case study', 'ESG value proposition deck'], gdriveFile: 'KnightFrank-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Target Knight Frank managed Grade A offices and luxury condos', outputs: ['Property target list', 'Premium service pricing', 'Pilot proposal'], gdriveFile: 'KnightFrank-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain Knight Frank strategy documentation', outputs: ['Master strategy', 'Contact log', 'Proposal history'], gdriveFile: 'KnightFrank-Strategy-Master.md' },
    ],
    gdriveFolder: 'Knight Frank Thailand',
    weeklyTasks: [
      { id: 'kf-mkt-scan', name: 'Scan Knight Frank listings and market reports', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'kfMktScan', gdriveUpdate: true },
      { id: 'kf-sales-pipe', name: 'Update Knight Frank sales pipeline', subAgent: 'sales', action: 'update-pipeline', outputKey: 'kfPipeline', gdriveUpdate: true },
      { id: 'kf-docs-sync', name: 'Sync Knight Frank docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'kfDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Premium drone cleaning for Knight Frank Grade A managed portfolio',
      valueProposition: 'Enhance property valuations with certified green cleaning + digital twin inspection data',
      entryStrategy: 'Direct approach via Property Management head with ESG audit offer',
      pricingApproach: '55-70 THB/sqm premium service + quarterly ESG reports',
      competitiveAdvantage: 'Zero work-at-height risk + property condition intelligence',
      timeline: 'Q3 2026 intro meeting → Q4 2026 pilot → Q1 2027 contract',
      kpis: ['Properties pitched', 'Pilot conversions', 'Sqm under management', 'Client satisfaction score'],
    },
  },

  {
    id: 'ca-cbre',
    company: 'CBRE Thailand',
    sector: 'real-estate-fm',
    website: 'https://www.cbre.co.th',
    country: 'TH',
    keyContacts: ['Country Head Thailand', 'Head of Facilities Management', 'ESG & Sustainability Lead'],
    ktvRelevance: 'Largest commercial real estate services firm globally. Strong FM division managing corporate campuses, retail, and industrial in Thailand.',
    annualTarget: 'THB 20-35M',
    coworkTeams: ['growth', 'ecosystem', 'revenue'],
    leadAgent: 'market_intelligence_strategist',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV as CBRE ESG-compliant FM technology partner', outputs: ['CBRE green FM white paper', 'Technology partnership proposal', 'ESG benchmark comparison'], gdriveFile: 'CBRE-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Target CBRE FM portfolio — offices, retail, industrial', outputs: ['CBRE managed property database', 'Multi-site proposal', 'Enterprise pricing'], gdriveFile: 'CBRE-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain CBRE partnership strategy documentation', outputs: ['Master strategy', 'RFP responses', 'Meeting tracker'], gdriveFile: 'CBRE-Strategy-Master.md' },
    ],
    gdriveFolder: 'CBRE Thailand',
    weeklyTasks: [
      { id: 'cbre-mkt-scan', name: 'Monitor CBRE Thailand ESG reports and FM opportunities', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'cbreMktScan', gdriveUpdate: true },
      { id: 'cbre-sales-pipe', name: 'Update CBRE enterprise sales pipeline', subAgent: 'sales', action: 'update-pipeline', outputKey: 'cbrePipeline', gdriveUpdate: true },
      { id: 'cbre-docs-sync', name: 'Sync CBRE docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'cbreDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Technology partner for CBRE green FM transformation across Thailand portfolio',
      valueProposition: 'Drone-enabled FM reduces cleaning costs 60-70%, eliminates work-at-height, generates GRESB data',
      entryStrategy: 'Respond to CBRE FM RFPs with drone cleaning as differentiator. Propose tech partnership.',
      pricingApproach: 'Enterprise volume pricing: 35-45 THB/sqm + Smart Green platform license',
      competitiveAdvantage: 'Integrated FM + ESG data platform — no competitor offers both',
      timeline: 'Q3 2026 partnership proposal → Q4 2026 pilot site → Q2 2027 portfolio expansion',
      kpis: ['RFPs responded', 'Pilot sites won', 'Portfolio sqm', 'CBRE partnership tier'],
    },
  },

  // ── PETROL & ENERGY ──────────────────────────────────────────

  {
    id: 'ca-shell',
    company: 'Shell Thailand',
    sector: 'petrol-energy',
    website: 'https://www.shell.co.th',
    country: 'TH',
    keyContacts: ['Country Chairman Thailand', 'Head of Retail Operations', 'FM/Facilities Manager', 'ESG Director'],
    ktvRelevance: '520 fuel stations + 320 Helix stations. Premium brand requiring high station standards. Expanding EV charging + Shell Cafe. IoT data opportunity.',
    annualTarget: 'THB 12M cleaning + $360K data revenue',
    coworkTeams: ['ecosystem', 'delivery', 'revenue'],
    leadAgent: 'partner_strategy_architect',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV as Shell preferred green station cleaning partner with IoT data', outputs: ['Shell station cleaning ROI study', 'IoT sensor hub pitch deck', '7 value layers presentation'], gdriveFile: 'Shell-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Close 400-station pilot deal, upsell Standard→Premium data tiers', outputs: ['400-station pilot proposal', 'Station coverage map', 'Tier pricing matrix'], gdriveFile: 'Shell-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain Shell deal documentation and IoT deployment tracker', outputs: ['Shell master strategy', 'IoT deployment plan', 'Data provenance specs'], gdriveFile: 'Shell-Strategy-Master.md' },
    ],
    gdriveFolder: 'Shell Thailand',
    weeklyTasks: [
      { id: 'shell-mkt-intel', name: 'Monitor Shell Thailand announcements and station expansion', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'shellMktIntel', gdriveUpdate: true },
      { id: 'shell-sales-track', name: 'Track Shell pilot proposal status and station onboarding', subAgent: 'sales', action: 'update-pipeline', outputKey: 'shellSalesTrack', gdriveUpdate: true },
      { id: 'shell-docs-sync', name: 'Sync Shell IoT deployment docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'shellDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Exclusive drone cleaning + IoT data partner for Shell Thailand station network',
      valueProposition: '7 value layers: predictive maintenance, ESG compliance, proof-of-service, asset management, benchmarking, safety records, carbon footprint',
      entryStrategy: '400-station paid pilot via IFS Thailand as FM channel partner',
      pricingApproach: 'Base (cleaning only) → Standard ($20/station/mo) → Premium ($75/station/mo)',
      competitiveAdvantage: 'Cleaning contract = distribution channel for $360K/yr recurring data revenue',
      timeline: 'Q3 2026 pilot proposal → Q4 2026 first 100 stations → Q2 2027 full 520 rollout',
      kpis: ['Stations onboarded', 'Data tier conversion rate', 'Monthly data revenue', 'Sensor uptime %'],
    },
  },

  {
    id: 'ca-ptt',
    company: 'PTT / OR (PTT Oil & Retail)',
    sector: 'petrol-energy',
    website: 'https://www.pttor.com',
    country: 'TH',
    keyContacts: ['CEO OR', 'VP Retail Operations', 'VP Sustainability', 'Station Operations Director'],
    ktvRelevance: '2,345 stations — largest network in Thailand. Expanding self-service (reducing staff). Rising minimum wage pressure on cleaning costs.',
    annualTarget: 'THB 30-50M cleaning + $550K data',
    coworkTeams: ['ecosystem', 'delivery', 'revenue'],
    leadAgent: 'partner_strategy_architect',
    subAgents: [
      { role: 'marketing', focus: 'Position drone cleaning as cost reducer amid PTT self-service expansion', outputs: ['PTT cost-savings analysis', 'Self-service station cleaning model', 'ESG brand alignment deck'], gdriveFile: 'PTT-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Propose 100-station proof-of-concept, scale to 2,345', outputs: ['100-station POC proposal', 'Regional rollout plan', 'Volume pricing tiers'], gdriveFile: 'PTT-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain PTT strategy docs and rollout planning', outputs: ['PTT master strategy', 'Station mapping', 'Rollout tracker'], gdriveFile: 'PTT-Strategy-Master.md' },
    ],
    gdriveFolder: 'PTT OR Thailand',
    weeklyTasks: [
      { id: 'ptt-mkt-scan', name: 'Monitor PTT/OR self-service expansion and FM procurement', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'pttMktScan', gdriveUpdate: true },
      { id: 'ptt-sales-pipe', name: 'Update PTT POC pipeline and regional contacts', subAgent: 'sales', action: 'update-pipeline', outputKey: 'pttPipeline', gdriveUpdate: true },
      { id: 'ptt-docs-sync', name: 'Sync PTT strategy docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'pttDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Automated cleaning solution addressing PTT labor cost escalation from minimum wage increases',
      valueProposition: 'Drone cleaning eliminates 70% of station cleaning labor costs while providing ESG compliance data for PTT sustainability reports',
      entryStrategy: '100-station pilot in Bangkok metro, prove cost savings, then national rollout',
      pricingApproach: 'Volume pricing: THB 8,000-12,000/station/quarter cleaning + data tiers',
      competitiveAdvantage: 'Automation solves the exact problem PTT is trying to fix with self-service (labor costs)',
      timeline: 'Q3 2026 proposal → Q4 2026 100-station pilot → 2027 national rollout',
      kpis: ['Stations contracted', 'Cost savings per station', 'Cleaning frequency compliance', 'Data tier adoption'],
    },
  },

  {
    id: 'ca-bangchak',
    company: 'Bangchak Corporation',
    sector: 'petrol-energy',
    website: 'https://www.bangchak.co.th',
    country: 'TH',
    keyContacts: ['CEO', 'VP Retail', 'Head of Sustainability', 'Green Innovation Director'],
    ktvRelevance: '1,200+ stations. Greenest brand among Thai fuel companies — SAF production, solar integration. Perfect ESG alignment.',
    annualTarget: 'THB 15-25M',
    coworkTeams: ['ecosystem', 'delivery', 'intelligence'],
    leadAgent: 'smart_green_product_orchestrator',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV as Bangchak green brand extension — drone cleaning + carbon neutrality', outputs: ['Bangchak green partnership deck', 'Carbon offset case study', 'SAF + drone synergy brief'], gdriveFile: 'Bangchak-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Target Bangchak green innovation fund for pilot funding', outputs: ['Green innovation proposal', 'Pilot pricing', 'Carbon credit revenue model'], gdriveFile: 'Bangchak-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain Bangchak partnership documentation', outputs: ['Master strategy', 'Green metrics tracker', 'Partnership terms'], gdriveFile: 'Bangchak-Strategy-Master.md' },
    ],
    gdriveFolder: 'Bangchak Corporation',
    weeklyTasks: [
      { id: 'bgk-mkt-scan', name: 'Monitor Bangchak sustainability initiatives and station expansion', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'bgkMktScan', gdriveUpdate: true },
      { id: 'bgk-sales-pipe', name: 'Update Bangchak green innovation pipeline', subAgent: 'sales', action: 'update-pipeline', outputKey: 'bgkPipeline', gdriveUpdate: true },
      { id: 'bgk-docs-sync', name: 'Sync Bangchak docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'bgkDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Green brand partner — drone cleaning as carbon-neutral station maintenance',
      valueProposition: 'Bangchak leads Thai green energy; KTV drone cleaning = 96% GHG reduction, perfect brand alignment + T-VER carbon credits',
      entryStrategy: 'Approach via Bangchak Green Innovation division, propose carbon-neutral station pilot',
      pricingApproach: '45 THB/sqm cleaning + carbon credit revenue sharing',
      competitiveAdvantage: 'Only drone FM provider with carbon credit generation capability',
      timeline: 'Q3 2026 green innovation pitch → Q4 2026 pilot → Q2 2027 expansion',
      kpis: ['Green pilot stations', 'Carbon credits generated', 'GHG reduction measured', 'Brand co-marketing events'],
    },
  },

  // ── BANKING & GREEN FINANCE ──────────────────────────────────

  {
    id: 'ca-kbank',
    company: 'Kasikornbank (KBANK)',
    sector: 'banking-green-finance',
    website: 'https://www.kasikornbank.com',
    country: 'TH',
    keyContacts: ['Head of Sustainable Banking', 'Green Finance Product Manager', 'ESG Data Director'],
    ktvRelevance: 'THB 400-500B green finance target by 2030. 1M+ sqm green building loans. Needs ESG compliance data for loan covenants. GCF accreditation path.',
    annualTarget: 'THB 5-10M (data/consulting)',
    coworkTeams: ['revenue', 'ecosystem', 'intelligence'],
    leadAgent: 'financial_model_capital_planner',
    subAgents: [
      { role: 'marketing', focus: 'Position Smart Green as KBANK green loan compliance data feed', outputs: ['KBANK ESG data integration proposal', 'Green loan covenant automation brief', 'Carbon credit financing deck'], gdriveFile: 'KBANK-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Sell ESG data subscription to KBANK for green loan portfolio monitoring', outputs: ['Data feed pricing', 'API integration spec', 'Pilot portfolio proposal'], gdriveFile: 'KBANK-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain KBANK partnership strategy and data specs', outputs: ['Master strategy', 'API documentation', 'Revenue projections'], gdriveFile: 'KBANK-Strategy-Master.md' },
    ],
    gdriveFolder: 'KBANK Green Finance',
    weeklyTasks: [
      { id: 'kbank-mkt-scan', name: 'Monitor KBANK green finance announcements and ESG products', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'kbankMktScan', gdriveUpdate: true },
      { id: 'kbank-sales-pipe', name: 'Update KBANK ESG data partnership pipeline', subAgent: 'sales', action: 'update-pipeline', outputKey: 'kbankPipeline', gdriveUpdate: true },
      { id: 'kbank-docs-sync', name: 'Sync KBANK strategy to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'kbankDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'ESG data infrastructure partner for KBANK green loan portfolio',
      valueProposition: 'Automate green loan covenant monitoring with real-time building ESG data — GHG, water, energy metrics per property',
      entryStrategy: 'Approach Sustainable Banking division with green loan data feed demo',
      pricingApproach: 'THB 50K/month per 100 properties monitored + setup fee',
      competitiveAdvantage: 'Only provider with building-level ESG data from actual drone cleaning operations',
      timeline: 'Q3 2026 product demo → Q4 2026 pilot portfolio → Q1 2027 full integration',
      kpis: ['Properties monitored', 'Data feed uptime', 'KBANK green loans using KTV data', 'Revenue from data subscription'],
    },
  },

  {
    id: 'ca-scb',
    company: 'Siam Commercial Bank (SCB) / SCB X',
    sector: 'banking-green-finance',
    website: 'https://www.scb.co.th',
    country: 'TH',
    keyContacts: ['Head of ESG', 'SVP Sustainability', 'Green Bond Program Manager'],
    ktvRelevance: 'Most ambitious Scope 3 net zero target (2050) among Thai banks. Active green bond issuer. Needs supply chain ESG data.',
    annualTarget: 'THB 3-8M',
    coworkTeams: ['revenue', 'ecosystem'],
    leadAgent: 'financial_model_capital_planner',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV data as SCB Scope 3 supply chain carbon tracking solution', outputs: ['SCB Scope 3 data proposal', 'Carbon tracking integration brief', 'ESG bond reporting solution'], gdriveFile: 'SCB-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Sell carbon tracking data feed to SCB for Scope 3 reporting', outputs: ['Scope 3 data pricing', 'Integration proposal', 'Pilot scope'], gdriveFile: 'SCB-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain SCB strategy documentation', outputs: ['Master strategy', 'Scope 3 methodology', 'Revenue model'], gdriveFile: 'SCB-Strategy-Master.md' },
    ],
    gdriveFolder: 'SCB Green Finance',
    weeklyTasks: [
      { id: 'scb-mkt-scan', name: 'Monitor SCB ESG reports and green bond issuances', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'scbMktScan', gdriveUpdate: true },
      { id: 'scb-sales-pipe', name: 'Update SCB Scope 3 data pipeline', subAgent: 'sales', action: 'update-pipeline', outputKey: 'scbPipeline', gdriveUpdate: true },
      { id: 'scb-docs-sync', name: 'Sync SCB docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'scbDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Supply chain carbon data provider for SCB Scope 3 net zero journey',
      valueProposition: 'Real-time building carbon data from drone operations feeds directly into SCB TCFD/CDP Scope 3 reporting',
      entryStrategy: 'Approach ESG team with Scope 3 data methodology and pilot proposal',
      pricingApproach: 'THB 30K/month data feed + carbon credit facilitation fees',
      competitiveAdvantage: 'Verified, sensor-grade carbon data (not estimates) from actual FM operations',
      timeline: 'Q4 2026 methodology presentation → Q1 2027 pilot → Q2 2027 contract',
      kpis: ['Data feed contracts', 'Scope 3 categories covered', 'Carbon credits facilitated', 'Bank reporting cycles supported'],
    },
  },

  {
    id: 'ca-bbl',
    company: 'Bangkok Bank (BBL)',
    sector: 'banking-green-finance',
    website: 'https://www.bangkokbank.com',
    country: 'TH',
    keyContacts: ['Head of Bualuang Green Financing', 'VP Sustainable Finance', 'ESG Risk Manager'],
    ktvRelevance: 'THB 19.5B transition financing in 2025. Bualuang Green Financing programme. Building retrofit loan portfolio needs ESG monitoring.',
    annualTarget: 'THB 3-6M',
    coworkTeams: ['revenue', 'ecosystem'],
    leadAgent: 'financial_model_capital_planner',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV ESG data as BBL green retrofit loan compliance tool', outputs: ['BBL Bualuang Green proposal', 'Retrofit monitoring pitch', 'Building ESG scorecard'], gdriveFile: 'BBL-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Bundle drone cleaning into BBL green retrofit loan offerings', outputs: ['Bundled loan product spec', 'Builder partnership model', 'Revenue sharing proposal'], gdriveFile: 'BBL-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain BBL strategy documentation', outputs: ['Master strategy', 'Product specifications', 'Meeting log'], gdriveFile: 'BBL-Strategy-Master.md' },
    ],
    gdriveFolder: 'BBL Green Finance',
    weeklyTasks: [
      { id: 'bbl-mkt-scan', name: 'Monitor BBL Bualuang Green and transition finance updates', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'bblMktScan', gdriveUpdate: true },
      { id: 'bbl-sales-pipe', name: 'Update BBL bundled product pipeline', subAgent: 'sales', action: 'update-pipeline', outputKey: 'bblPipeline', gdriveUpdate: true },
      { id: 'bbl-docs-sync', name: 'Sync BBL docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'bblDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Green retrofit compliance monitoring partner for BBL Bualuang Green loan book',
      valueProposition: 'Automated ESG monitoring for green retrofit loans — proves borrower compliance, reduces BBL risk',
      entryStrategy: 'Partner with BBL to bundle drone cleaning + ESG monitoring into green retrofit loans',
      pricingApproach: 'THB 25K/month per building portfolio + per-building cleaning contracts',
      competitiveAdvantage: 'End-to-end: physical cleaning + compliance data in one contract',
      timeline: 'Q4 2026 product design → Q1 2027 pilot buildings → Q2 2027 loan product launch',
      kpis: ['Buildings monitored', 'Loan products with KTV bundled', 'Default risk reduction data', 'BBL green loan growth'],
    },
  },

  // ── ESG & GREEN BUILDING ASSET MANAGERS ──────────────────────

  {
    id: 'ca-one-bangkok',
    company: 'One Bangkok (TCC Assets / Frasers Property)',
    sector: 'real-estate-fm',
    website: 'https://www.onebangkok.com',
    country: 'TH',
    keyContacts: ['Project Director', 'FM Director', 'Sustainability Director', 'Smart Building Manager'],
    ktvRelevance: '1.3M sqm mixed-use. First LEED-ND Platinum in Thailand. Double WiredScore/SmartScore Platinum. Flagship smart green building.',
    annualTarget: 'THB 23.97M ACV',
    coworkTeams: ['growth', 'ecosystem', 'delivery', 'revenue'],
    leadAgent: 'deal_design_pitch_engineer',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV as exclusive drone FM partner for One Bangkok smart district', outputs: ['One Bangkok pitch deck (10 slides)', 'Smart Green integration brief', 'KTV CARE agreement template'], gdriveFile: 'OneBangkok-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Close THB 23.97M ACV flagship deal — facade cleaning + inspection + ESG', outputs: ['ACV deal structure', 'Phase deployment plan', 'Competitive bid response'], gdriveFile: 'OneBangkok-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain One Bangkok deal documentation and compliance tracker', outputs: ['Battle plan', 'Financial model', 'CAAT compliance doc', 'Smart Green specs'], gdriveFile: 'OneBangkok-Strategy-Master.md' },
    ],
    gdriveFolder: 'One Bangkok',
    weeklyTasks: [
      { id: 'ob-mkt-intel', name: 'Monitor One Bangkok construction progress and FM procurement', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'obMktIntel', gdriveUpdate: true },
      { id: 'ob-sales-track', name: 'Track One Bangkok deal progress and stakeholder engagement', subAgent: 'sales', action: 'update-pipeline', outputKey: 'obSalesTrack', gdriveUpdate: true },
      { id: 'ob-docs-sync', name: 'Sync One Bangkok deal docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'obDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Exclusive smart drone FM partner for Thailand flagship green district',
      valueProposition: 'THB 23.97M ACV — 77.7% EBITDA — 3.6mo payback. Only solution matching One Bangkok LEED-ND + SmartScore Platinum standards.',
      entryStrategy: 'IFS Thailand as FM channel + direct to One Bangkok sustainability team',
      pricingApproach: 'Base 45 THB/sqm + Smart Green Enterprise THB 350K/mo',
      competitiveAdvantage: 'Already have full battle plan, financial model, and pitch deck ready',
      timeline: '90-day paid pilot → phased rollout across 5 towers + retail + hotel',
      kpis: ['ACV contracted', 'Buildings deployed', 'Sqm cleaned/quarter', 'ESG reports delivered', 'EBITDA margin'],
    },
  },

  {
    id: 'ca-frasers',
    company: 'Frasers Property Thailand',
    sector: 'real-estate-fm',
    website: 'https://www.frasersproperty.co.th',
    country: 'TH',
    keyContacts: ['CEO Thailand', 'Head of Sustainability', 'VP Property Management'],
    ktvRelevance: 'S&P Sustainability Yearbook 2026 (first time). SBTi validated 42% GHG cut by 2030. Co-owner of One Bangkok.',
    annualTarget: 'THB 10-20M',
    coworkTeams: ['growth', 'ecosystem'],
    leadAgent: 'smart_green_product_orchestrator',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV as SBTi-aligned FM partner helping Frasers hit 42% GHG target', outputs: ['SBTi alignment brief', 'GHG reduction case study', 'Sustainability Yearbook contribution deck'], gdriveFile: 'Frasers-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Target Frasers portfolio beyond One Bangkok — residential, industrial', outputs: ['Portfolio coverage proposal', 'Multi-asset pricing', 'GHG reduction projections'], gdriveFile: 'Frasers-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain Frasers sustainability partnership docs', outputs: ['Master strategy', 'SBTi progress tracker', 'Portfolio mapping'], gdriveFile: 'Frasers-Strategy-Master.md' },
    ],
    gdriveFolder: 'Frasers Property Thailand',
    weeklyTasks: [
      { id: 'fp-mkt-scan', name: 'Monitor Frasers sustainability reports and SBTi progress', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'fpMktScan', gdriveUpdate: true },
      { id: 'fp-sales-pipe', name: 'Update Frasers portfolio pipeline', subAgent: 'sales', action: 'update-pipeline', outputKey: 'fpPipeline', gdriveUpdate: true },
      { id: 'fp-docs-sync', name: 'Sync Frasers docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'fpDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'SBTi-aligned FM partner accelerating Frasers 42% GHG reduction target',
      valueProposition: 'Drone cleaning delivers 96% GHG reduction — directly contributes to Frasers SBTi near-term target',
      entryStrategy: 'Leverage One Bangkok relationship to expand across Frasers Thai portfolio',
      pricingApproach: '45-55 THB/sqm + Smart Green Professional tier',
      competitiveAdvantage: 'Already connected via One Bangkok — trusted partner extension',
      timeline: 'Q3 2026 portfolio pitch → Q4 2026 first non-OB property → Q1 2027 portfolio contract',
      kpis: ['Properties under contract', 'GHG reduction delivered (tCO2e)', 'SBTi contribution %', 'Portfolio expansion rate'],
    },
  },

  {
    id: 'ca-cpn',
    company: 'Central Pattana (CPN)',
    sector: 'real-estate-fm',
    website: 'https://www.centralpattana.co.th',
    country: 'TH',
    keyContacts: ['CEO', 'SVP Property Management', 'Head of Sustainability', 'VP Operations'],
    ktvRelevance: 'Largest retail REIT in Thailand (CPNREIT). 40+ malls. LEED/TREES certified properties. Continuous facade cleaning needs.',
    annualTarget: 'THB 15-30M',
    coworkTeams: ['growth', 'revenue'],
    leadAgent: 'sales_playbook_account_selector',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV for CPN retail mall facade portfolio', outputs: ['Mall cleaning ROI study', 'Retail ESG certification support deck', 'CPN brand alignment brief'], gdriveFile: 'CPN-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Target CPN 40+ mall portfolio with volume cleaning contracts', outputs: ['Mall portfolio proposal', 'Regional pricing tiers', 'Quarterly cleaning schedule'], gdriveFile: 'CPN-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain CPN partnership strategy', outputs: ['Master strategy', 'Mall inventory', 'Contract tracker'], gdriveFile: 'CPN-Strategy-Master.md' },
    ],
    gdriveFolder: 'Central Pattana CPN',
    weeklyTasks: [
      { id: 'cpn-mkt-scan', name: 'Monitor CPN new mall openings and sustainability reports', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'cpnMktScan', gdriveUpdate: true },
      { id: 'cpn-sales-pipe', name: 'Update CPN mall portfolio pipeline', subAgent: 'sales', action: 'update-pipeline', outputKey: 'cpnPipeline', gdriveUpdate: true },
      { id: 'cpn-docs-sync', name: 'Sync CPN docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'cpnDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Volume drone cleaning partner for Thailand largest retail portfolio',
      valueProposition: '40+ malls × quarterly cleaning = massive recurring revenue. ESG data supports CPN REIT sustainability ratings.',
      entryStrategy: 'Propose 3-mall pilot in Bangkok (CentralWorld, CentralPlaza Ladprao, CentralFestival EastVille)',
      pricingApproach: 'Volume: 35-40 THB/sqm with 40+ mall commitment discount',
      competitiveAdvantage: 'Scale efficiency — 40+ malls with one contract, drone fleet optimization',
      timeline: 'Q3 2026 portfolio pitch → Q4 2026 3-mall pilot → Q1 2027 national rollout',
      kpis: ['Malls contracted', 'Total sqm/quarter', 'REIT ESG score impact', 'Contract renewal rate'],
    },
  },

  {
    id: 'ca-wha',
    company: 'WHA Group / WHART REIT',
    sector: 'industrial',
    website: 'https://www.wha-group.com',
    country: 'TH',
    keyContacts: ['CEO WHA Industrial', 'REIT Manager WHART', 'Head of ESG'],
    ktvRelevance: 'GRESB-assessed industrial REIT. Logistics/warehouse portfolio. ESG compliance pressure from international tenants.',
    annualTarget: 'THB 8-15M',
    coworkTeams: ['growth', 'delivery'],
    leadAgent: 'operations_compliance_mission_planner',
    subAgents: [
      { role: 'marketing', focus: 'Position KTV for industrial facility facade and roof cleaning', outputs: ['Industrial cleaning proposal', 'GRESB data integration brief', 'Logistics ESG deck'], gdriveFile: 'WHA-Marketing-Strategy.md' },
      { role: 'sales', focus: 'Target WHA industrial estates and logistics parks', outputs: ['Estate coverage proposal', 'Industrial pricing', 'Tenant ESG package'], gdriveFile: 'WHA-Sales-Pipeline.md' },
      { role: 'docs', focus: 'Maintain WHA strategy and GRESB compliance docs', outputs: ['Master strategy', 'GRESB submission support', 'Facility inventory'], gdriveFile: 'WHA-Strategy-Master.md' },
    ],
    gdriveFolder: 'WHA Group',
    weeklyTasks: [
      { id: 'wha-mkt-scan', name: 'Monitor WHA REIT ESG ratings and new estate launches', subAgent: 'marketing', action: 'scan-company-intel', outputKey: 'whaMktScan', gdriveUpdate: true },
      { id: 'wha-sales-pipe', name: 'Update WHA industrial estate pipeline', subAgent: 'sales', action: 'update-pipeline', outputKey: 'whaPipeline', gdriveUpdate: true },
      { id: 'wha-docs-sync', name: 'Sync WHA docs to Google Drive', subAgent: 'docs', action: 'sync-gdrive', outputKey: 'whaDocsSync', gdriveUpdate: true },
    ],
    strategy: {
      positioning: 'Industrial drone FM partner supporting WHART REIT GRESB score improvement',
      valueProposition: 'Industrial facade + roof cleaning with ESG data for GRESB submission — helps international tenant ESG requirements',
      entryStrategy: 'Approach via REIT manager with GRESB score improvement proposal',
      pricingApproach: '30-40 THB/sqm industrial rate + ESG data package',
      competitiveAdvantage: 'Drone access to industrial roofs/facades eliminates scaffolding costs',
      timeline: 'Q4 2026 GRESB alignment pitch → Q1 2027 pilot estate → Q2 2027 expansion',
      kpis: ['Estates under contract', 'GRESB score improvement', 'Tenant satisfaction', 'Industrial sqm/quarter'],
    },
  },
];

// ── Helpers ────────────────────────────────────────────────────

export function getCompanyAgent(id: string): CompanyAgent | undefined {
  return COMPANY_AGENTS.find(a => a.id === id);
}

export function getCompanyAgentsByCompany(name: string): CompanyAgent | undefined {
  return COMPANY_AGENTS.find(a => a.company.toLowerCase().includes(name.toLowerCase()));
}

export function getCompanyAgentsBySector(sector: CompanySector): CompanyAgent[] {
  return COMPANY_AGENTS.filter(a => a.sector === sector);
}

export function getAllCompanyWeeklyTasks(): CompanyWeeklyTask[] {
  return COMPANY_AGENTS.flatMap(a => a.weeklyTasks);
}

export function getGDriveFolderStructure(): { company: string; folder: string; files: string[] }[] {
  return COMPANY_AGENTS.map(a => ({
    company: a.company,
    folder: a.gdriveFolder,
    files: a.subAgents.map(s => s.gdriveFile),
  }));
}

export function printCompanyAgentRoster(): string {
  const lines: string[] = [];
  lines.push('╔════════════════════════════════════════════════════════════════════╗');
  lines.push('║        KTV COMPANY STRATEGY AGENTS — Target Accounts             ║');
  lines.push(`║        ${COMPANY_AGENTS.length} Companies | ${COMPANY_AGENTS.length * 3} Sub-Agents | Weekly Auto-Update     ║`);
  lines.push('╠════════════════════════════════════════════════════════════════════╣');

  const sectors: CompanySector[] = ['real-estate-fm', 'petrol-energy', 'banking-green-finance', 'industrial'];
  const sectorNames: Record<CompanySector, string> = {
    'real-estate-fm': 'REAL ESTATE & FM',
    'petrol-energy': 'PETROL & ENERGY',
    'banking-green-finance': 'BANKING & GREEN FINANCE',
    'esg-sustainability': 'ESG & SUSTAINABILITY',
    'industrial': 'INDUSTRIAL',
  };

  for (const sector of sectors) {
    const agents = getCompanyAgentsBySector(sector);
    if (agents.length === 0) continue;

    lines.push(`║                                                                    ║`);
    lines.push(`║  ┌─ ${(sectorNames[sector] ?? sector).padEnd(62)}┐  ║`);
    for (const agent of agents) {
      lines.push(`║  │  ${agent.company.slice(0, 40).padEnd(40)} ${agent.annualTarget.slice(0, 20).padEnd(20)}│  ║`);
      lines.push(`║  │    Marketing | Sales | Docs → GDrive: ${agent.gdriveFolder.slice(0, 22).padEnd(22)}│  ║`);
    }
    lines.push(`║  └──────────────────────────────────────────────────────────────┘  ║`);
  }

  lines.push('╠════════════════════════════════════════════════════════════════════╣');
  lines.push(`║  Total Weekly Tasks: ${String(getAllCompanyWeeklyTasks().length).padEnd(4)} (all sync to Google Drive)            ║`);
  lines.push(`║  Sub-Agents:         ${String(COMPANY_AGENTS.length * 3).padEnd(4)} (Marketing + Sales + Docs per company)  ║`);
  lines.push('╚════════════════════════════════════════════════════════════════════╝');

  return lines.join('\n');
}
