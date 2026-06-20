# KTV Working Drone Thailand — CoWork Master Reference

**14 Core Agents | 13 Company Agents | 39 Sub-Agents | 6 Teams | 20 Routines | 105 Tasks | 5 Commands**
**Upload to**: `/cowork` orchestrator for full automation
**Last Updated**: 2026-06-20

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      /cowork orchestrator                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Strategy Layer (7 Mastermind Agents)                           │
│    S1 Market Intelligence  S2 Partner Strategy                  │
│    S3 Smart Green Product  S4 Financial Model                   │
│    S5 Deal Design          S6 Sales Playbook                    │
│    S7 Ops Compliance                                            │
│                         ↕                                       │
│  Operations Layer (7 KTV Agents)                                │
│    O1 Fleet Mgmt    O2 Job Lifecycle   O3 CRM & Sales          │
│    O4 Safety        O5 Finance         O6 Pilots               │
│    O7 Data Processing                                           │
│                         ↕                                       │
│  Company Strategy Agents (13 Companies × 3 Sub-Agents)         │
│    JLL | Knight Frank | CBRE | Shell | PTT/OR | Bangchak       │
│    KBANK | SCB | BBL | One Bangkok | Frasers | CPN | WHA       │
│    Each: Marketing + Sales + Docs → Google Drive weekly sync    │
│                         ↕                                       │
│  Automation Layer                                               │
│    6 Triggers (24/7) | 15 Workflows | 9 Connected Apps         │
│    20 Weekly Routines | 8-Platform Report Distribution          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agent Registry

### Operations Layer (O1–O7)

| ID | Agent | Role | Skills | Key Capability |
|----|-------|------|--------|----------------|
| O1 | Fleet Manager | `fleet-management` | 6 | 16-drone fleet, battery health, maintenance scheduling |
| O2 | Job Manager | `job-lifecycle` | 4 | 13-stage lifecycle from lead-capture to completion |
| O3 | CRM & Sales | `crm-sales` | 5 | Leads, clients, NPS, segments, pipeline tracking |
| O4 | Safety & Compliance | `safety-compliance` | 4 | CAAT compliance, risk assessment, pre-flight checks |
| O5 | Finance & Invoicing | `finance-invoicing` | 5 | Invoicing (7% VAT), collections, DSO tracking |
| O6 | Pilot Operations | `pilot-operations` | 4 | 10 pilots, cert tracking, auto-ground expired |
| O7 | Data Processing | `data-processing` | 5 | 4-copy backup, QA pipeline, ESG certificates |

### Strategy Layer (S1–S7 — Mastermind)

| ID | Agent | Role | Skills | Key Capability |
|----|-------|------|--------|----------------|
| S1 | Market Intelligence | `market_intelligence_strategist` | 4 | TAM/SAM/SOM, opportunity scanning, demand forecast |
| S2 | Partner Strategy | `partner_strategy_architect` | 4 | IFS channel routing, JV governance, equity milestones |
| S3 | Smart Green Product | `smart_green_product_orchestrator` | 4 | GRESB readiness, ESG telemetry, BMS integration |
| S4 | Financial Model | `financial_model_capital_planner` | 5 | 3-year model, IRR/NPV, carbon credits, guardrails |
| S5 | Deal Design | `deal_design_pitch_engineer` | 3 | Pitch decks, proposals, one-pagers, term sheets |
| S6 | Sales Playbook | `sales_playbook_account_selector` | 3 | Account scoring, sector playbooks, closing strategy |
| S7 | Ops Compliance | `operations_compliance_mission_planner` | 4 | CAAT regulation, capacity planning, crew SOPs |

### Supervisor

| Agent | Purpose |
|-------|---------|
| AgentSupervisor | Monitors all 14 agents, tracks productivity, generates reports, flags underperformers |

---

## 6 CoWork Teams

### Team 1: Growth Engine (`growth`)

**Mission**: Identify, qualify, and route market opportunities through IFS or Direct KTV channels

| Role | Agents |
|------|--------|
| Strategy | S1 Market Intelligence, S2 Partner Strategy, S6 Sales Playbook |
| Operations | O3 CRM & Sales, O2 Job Lifecycle |
| Lead | S1 Market Intelligence |

**Workflows**: `wf-lead-to-client`, `wf-connected-lead-onboard`
**Triggers**: `trig-crm-pipeline` (20 min)
**KPIs**: New leads/week, Lead→qualified conversion, Pipeline value (THB), IFS vs Direct split

### Team 2: Service Delivery (`delivery`)

**Mission**: Execute drone missions from planning through data delivery with zero safety incidents

| Role | Agents |
|------|--------|
| Strategy | S7 Ops Compliance, S3 Smart Green |
| Operations | O1 Fleet, O2 Jobs, O6 Pilots, O4 Safety, O7 Data |
| Lead | O1 Fleet Management |

**Workflows**: `wf-mission-prep`, `wf-preflight-to-mission`, `wf-post-mission`, `wf-connected-mission-brief`
**Triggers**: `trig-fleet-health` (5 min), `trig-data-queue` (5 min)
**KPIs**: Missions/week, Sqm processed, Incidents (0), On-time delivery, Backup compliance (100%)

### Team 3: Compliance & Safety (`compliance`)

**Mission**: Maintain zero safety incidents, CAAT compliance, and fleet readiness at all times

| Role | Agents |
|------|--------|
| Strategy | S7 Ops Compliance |
| Operations | O4 Safety, O1 Fleet, O6 Pilots |
| Lead | O4 Safety & Compliance |

**Workflows**: `wf-incident-response`, `wf-maintenance-auto`, `wf-cert-expiry`, `wf-connected-safety-alert`, `wf-connected-cert-expiry`
**Triggers**: `trig-cert-check` (30 min), `trig-safety-stats` (10 min)
**KPIs**: Incidents (0), Pre-flight pass rate (>95%), Fleet availability, Cert currency, CAAT status

### Team 4: Market Intelligence (`intelligence`)

**Mission**: Real-time market analysis, competitor tracking, and strategic recommendations

| Role | Agents |
|------|--------|
| Strategy | S1 Market Intelligence, S2 Partner Strategy, S3 Smart Green |
| Operations | O3 CRM, O7 Data |
| Lead | S1 Market Intelligence |

**KPIs**: TAM/SAM/SOM accuracy, Opportunity pipeline ranked, Competitive intel freshness, Smart Green adoption

### Team 5: Ecosystem Builder (`ecosystem`)

**Mission**: Build IFS partnership, Smart Green integrations, and new channel development

| Role | Agents |
|------|--------|
| Strategy | S2 Partner Strategy, S5 Deal Design, S3 Smart Green, S6 Sales Playbook |
| Operations | O3 CRM, O2 Jobs |
| Lead | S2 Partner Strategy |

**Workflows**: `wf-lead-to-client`
**KPIs**: IFS equity progress (THB 32M→64M→160M), Smart Green sites, Partner satisfaction, Proposals delivered

### Team 6: Revenue Operations (`revenue`)

**Mission**: Maximise revenue, maintain healthy margins, and ensure timely collections

| Role | Agents |
|------|--------|
| Strategy | S4 Financial Model, S5 Deal Design, S6 Sales Playbook |
| Operations | O5 Finance, O3 CRM, O2 Jobs |
| Lead | O5 Finance & Invoicing |

**Workflows**: `wf-delivery-to-payment`, `wf-overdue-collection`, `wf-connected-invoice-email`
**Triggers**: `trig-overdue-invoices` (15 min)
**KPIs**: Revenue vs THB 180.18M target, EBITDA margin (>55%), Collection rate, DSO, IRR tracking

---

## Company Strategy Agents (13 Companies)

Each company has 3 dedicated sub-agents (Marketing, Sales, Docs) with weekly auto-updates synced to Google Drive.

### Real Estate & FM

| Company | ID | Annual Target | Lead Agent | GDrive Folder |
|---------|----|---------------|------------|---------------|
| JLL Thailand | `ca-jll` | THB 15-25M | S1 Market Intelligence | `JLL Thailand/` |
| Knight Frank Thailand | `ca-knight-frank` | THB 10-18M | S6 Sales Playbook | `Knight Frank Thailand/` |
| CBRE Thailand | `ca-cbre` | THB 20-35M | S1 Market Intelligence | `CBRE Thailand/` |
| One Bangkok | `ca-one-bangkok` | THB 23.97M ACV | S5 Deal Design | `One Bangkok/` |
| Frasers Property | `ca-frasers` | THB 10-20M | S3 Smart Green | `Frasers Property Thailand/` |
| Central Pattana (CPN) | `ca-cpn` | THB 15-30M | S6 Sales Playbook | `Central Pattana CPN/` |

### Petrol & Energy

| Company | ID | Annual Target | Lead Agent | GDrive Folder |
|---------|----|---------------|------------|---------------|
| Shell Thailand | `ca-shell` | THB 12M + $360K data | S2 Partner Strategy | `Shell Thailand/` |
| PTT / OR | `ca-ptt` | THB 30-50M + $550K | S2 Partner Strategy | `PTT OR Thailand/` |
| Bangchak Corporation | `ca-bangchak` | THB 15-25M | S3 Smart Green | `Bangchak Corporation/` |

### Banking & Green Finance

| Company | ID | Annual Target | Lead Agent | GDrive Folder |
|---------|----|---------------|------------|---------------|
| Kasikornbank (KBANK) | `ca-kbank` | THB 5-10M | S4 Financial Model | `KBANK Green Finance/` |
| SCB / SCB X | `ca-scb` | THB 3-8M | S4 Financial Model | `SCB Green Finance/` |
| Bangkok Bank (BBL) | `ca-bbl` | THB 3-6M | S4 Financial Model | `BBL Green Finance/` |

### Industrial

| Company | ID | Annual Target | Lead Agent | GDrive Folder |
|---------|----|---------------|------------|---------------|
| WHA Group / WHART REIT | `ca-wha` | THB 8-15M | S7 Ops Compliance | `WHA Group/` |

### Sub-Agent Structure (Per Company)

Each company agent deploys 3 sub-agents:

| Sub-Agent | Role | Weekly Output | GDrive File |
|-----------|------|---------------|-------------|
| Marketing | Company intel scanning, ESG reports, positioning | Market scan report | `{Company}-Marketing-Strategy.md` |
| Sales | Pipeline tracking, proposals, contact management | Pipeline update | `{Company}-Sales-Pipeline.md` |
| Docs | Strategy documentation, meeting notes, trackers | Strategy master doc | `{Company}-Strategy-Master.md` |

### Company Strategy Details

#### JLL Thailand
- **Positioning**: Preferred drone FM partner for JLL managed green-certified portfolio
- **Value Prop**: Automated facade cleaning with ESG data feed — 14% rental premium enabler
- **Entry**: Co-present at TGRE 2026, propose 3-building paid pilot
- **Pricing**: 45 THB/sqm cleaning + Smart Green ESG data subscription
- **Timeline**: Q3 2026 pilot → Q4 2026 execution → Q1 2027 portfolio rollout

#### Knight Frank Thailand
- **Positioning**: Premium drone cleaning for Grade A managed portfolio
- **Value Prop**: Enhanced property valuations with certified green cleaning + digital twin data
- **Entry**: Direct approach via Property Management head with ESG audit offer
- **Pricing**: 55-70 THB/sqm premium service + quarterly ESG reports
- **Timeline**: Q3 2026 intro → Q4 2026 pilot → Q1 2027 contract

#### CBRE Thailand
- **Positioning**: Technology partner for CBRE green FM transformation
- **Value Prop**: Drone FM reduces cleaning costs 60-70%, eliminates work-at-height, generates GRESB data
- **Entry**: Respond to CBRE FM RFPs with drone cleaning differentiator
- **Pricing**: Enterprise volume 35-45 THB/sqm + Smart Green platform license
- **Timeline**: Q3 2026 partnership proposal → Q4 2026 pilot → Q2 2027 expansion

#### Shell Thailand
- **Positioning**: Exclusive drone cleaning + IoT data partner for 520-station network
- **Value Prop**: 7 value layers — predictive maintenance, ESG, proof-of-service, asset mgmt, benchmarking, safety, carbon
- **Entry**: 400-station paid pilot via IFS Thailand as FM channel partner
- **Pricing**: Base (cleaning) → Standard ($20/station/mo) → Premium ($75/station/mo)
- **Revenue**: Cleaning contract = distribution channel for $360K/yr recurring data revenue
- **Timeline**: Q3 2026 pilot → Q4 2026 first 100 stations → Q2 2027 full 520 rollout

#### PTT / OR
- **Positioning**: Automated cleaning solving PTT labor cost escalation from minimum wage
- **Value Prop**: 70% station cleaning labor cost elimination + ESG compliance data
- **Entry**: 100-station pilot in Bangkok metro, prove cost savings
- **Pricing**: THB 8,000-12,000/station/quarter cleaning + data tiers
- **Timeline**: Q3 2026 proposal → Q4 2026 100-station pilot → 2027 national rollout

#### Bangchak Corporation
- **Positioning**: Green brand partner — drone cleaning as carbon-neutral station maintenance
- **Value Prop**: 96% GHG reduction aligns with Bangchak green energy brand + T-VER carbon credits
- **Entry**: Approach via Bangchak Green Innovation division
- **Pricing**: 45 THB/sqm cleaning + carbon credit revenue sharing
- **Timeline**: Q3 2026 green innovation pitch → Q4 2026 pilot → Q2 2027 expansion

#### KBANK (Kasikornbank)
- **Positioning**: ESG data infrastructure partner for KBANK green loan portfolio
- **Value Prop**: Automate green loan covenant monitoring with real-time building ESG data
- **Entry**: Approach Sustainable Banking division with green loan data feed demo
- **Pricing**: THB 50K/month per 100 properties monitored + setup fee
- **Timeline**: Q3 2026 demo → Q4 2026 pilot portfolio → Q1 2027 full integration

#### SCB / SCB X
- **Positioning**: Supply chain carbon data provider for SCB Scope 3 net zero journey
- **Value Prop**: Sensor-grade carbon data (not estimates) feeds into SCB TCFD/CDP reporting
- **Entry**: Approach ESG team with Scope 3 data methodology
- **Pricing**: THB 30K/month data feed + carbon credit facilitation fees
- **Timeline**: Q4 2026 methodology → Q1 2027 pilot → Q2 2027 contract

#### Bangkok Bank (BBL)
- **Positioning**: Green retrofit compliance monitoring for BBL Bualuang Green loan book
- **Value Prop**: Automated ESG monitoring for green retrofit loans — proves borrower compliance
- **Entry**: Bundle drone cleaning + ESG monitoring into green retrofit loans
- **Pricing**: THB 25K/month per building portfolio + per-building cleaning
- **Timeline**: Q4 2026 product design → Q1 2027 pilot → Q2 2027 loan product launch

#### One Bangkok
- **Positioning**: Exclusive smart drone FM partner for Thailand flagship green district
- **Value Prop**: THB 23.97M ACV — 77.7% EBITDA — 3.6mo payback. LEED-ND + SmartScore Platinum
- **Entry**: IFS Thailand as FM channel + direct to sustainability team
- **Pricing**: Base 45 THB/sqm + Smart Green Enterprise THB 350K/mo
- **Timeline**: 90-day paid pilot → phased rollout across 5 towers + retail + hotel

#### Frasers Property Thailand
- **Positioning**: SBTi-aligned FM partner accelerating 42% GHG reduction target
- **Value Prop**: 96% GHG reduction from drone cleaning directly contributes to SBTi near-term target
- **Entry**: Leverage One Bangkok relationship to expand across Frasers Thai portfolio
- **Pricing**: 45-55 THB/sqm + Smart Green Professional tier
- **Timeline**: Q3 2026 portfolio pitch → Q4 2026 first non-OB property → Q1 2027 contract

#### Central Pattana (CPN)
- **Positioning**: Volume drone cleaning partner for Thailand largest retail portfolio
- **Value Prop**: 40+ malls × quarterly cleaning = massive recurring revenue + REIT ESG ratings
- **Entry**: 3-mall pilot in Bangkok (CentralWorld, CentralPlaza Ladprao, CentralFestival EastVille)
- **Pricing**: Volume 35-40 THB/sqm with 40+ mall commitment discount
- **Timeline**: Q3 2026 portfolio pitch → Q4 2026 3-mall pilot → Q1 2027 national rollout

#### WHA Group / WHART REIT
- **Positioning**: Industrial drone FM partner for WHART REIT GRESB improvement
- **Value Prop**: Industrial facade + roof cleaning with ESG data for GRESB submission
- **Entry**: Approach via REIT manager with GRESB score improvement proposal
- **Pricing**: 30-40 THB/sqm industrial rate + ESG data package
- **Timeline**: Q4 2026 pitch → Q1 2027 pilot estate → Q2 2027 expansion

### Google Drive Folder Structure

```
KTV Company Strategies/
├── JLL Thailand/
│   ├── JLL-Marketing-Strategy.md
│   ├── JLL-Sales-Pipeline.md
│   └── JLL-Strategy-Master.md
├── Knight Frank Thailand/
│   ├── KnightFrank-Marketing-Strategy.md
│   ├── KnightFrank-Sales-Pipeline.md
│   └── KnightFrank-Strategy-Master.md
├── CBRE Thailand/
│   ├── CBRE-Marketing-Strategy.md
│   ├── CBRE-Sales-Pipeline.md
│   └── CBRE-Strategy-Master.md
├── Shell Thailand/
│   ├── Shell-Marketing-Strategy.md
│   ├── Shell-Sales-Pipeline.md
│   └── Shell-Strategy-Master.md
├── PTT OR Thailand/
│   ├── PTT-Marketing-Strategy.md
│   ├── PTT-Sales-Pipeline.md
│   └── PTT-Strategy-Master.md
├── Bangchak Corporation/
│   ├── Bangchak-Marketing-Strategy.md
│   ├── Bangchak-Sales-Pipeline.md
│   └── Bangchak-Strategy-Master.md
├── KBANK Green Finance/
│   ├── KBANK-Marketing-Strategy.md
│   ├── KBANK-Sales-Pipeline.md
│   └── KBANK-Strategy-Master.md
├── SCB Green Finance/
│   ├── SCB-Marketing-Strategy.md
│   ├── SCB-Sales-Pipeline.md
│   └── SCB-Strategy-Master.md
├── BBL Green Finance/
│   ├── BBL-Marketing-Strategy.md
│   ├── BBL-Sales-Pipeline.md
│   └── BBL-Strategy-Master.md
├── One Bangkok/
│   ├── OneBangkok-Marketing-Strategy.md
│   ├── OneBangkok-Sales-Pipeline.md
│   └── OneBangkok-Strategy-Master.md
├── Frasers Property Thailand/
│   ├── Frasers-Marketing-Strategy.md
│   ├── Frasers-Sales-Pipeline.md
│   └── Frasers-Strategy-Master.md
├── Central Pattana CPN/
│   ├── CPN-Marketing-Strategy.md
│   ├── CPN-Sales-Pipeline.md
│   └── CPN-Strategy-Master.md
└── WHA Group/
    ├── WHA-Marketing-Strategy.md
    ├── WHA-Sales-Pipeline.md
    └── WHA-Strategy-Master.md
```

---

## Agent Skills Reference

### O1 Fleet Management

| Skill | Action | Output |
|-------|--------|--------|
| Fleet summary | `get-fleet-summary` | Drone count, status, availability, utilization |
| Available drones | `get-available-drones` | Drones ready for assignment |
| Assign drone | `assign-drone` | Lock drone to mission |
| Release drone | `release-drone` | Return drone to pool |
| Maintenance alerts | `get-maintenance-alerts` | Upcoming maintenance, battery health |
| Battery health | `get-battery-health` | Cycle counts, voltage, replacement schedule |

### O2 Job Lifecycle

| Skill | Action | Output |
|-------|--------|--------|
| Create job | `create-job` | New job at lead-capture stage |
| Advance stage | `advance-stage` | Move job through 13 stages |
| Pipeline summary | `get-pipeline-summary` | Jobs by stage, bottlenecks, cycle time |
| Job details | `get-job` | Full job record with history |

### O3 CRM & Sales

| Skill | Action | Output |
|-------|--------|--------|
| Create lead | `create-lead` | New lead with segment, source, value |
| Advance lead | `advance-lead` | Move through: new→qualified→proposal→won/lost |
| Get pipeline | `get-pipeline` | Leads by stage, stalled flags, conversion |
| Record NPS | `record-nps` | Client satisfaction score + feedback |
| Client lookup | `get-client` | Full client record |

### O4 Safety & Compliance

| Skill | Action | Output |
|-------|--------|--------|
| Safety stats | `get-safety-stats` | Incidents, pre-flight pass rate, compliance |
| Risk assessment | `assess-risk` | Site risk score, weather, airspace, hazards |
| Pre-flight check | `run-preflight` | Checklist execution, pass/fail with reasons |
| Report incident | `report-incident` | Incident record, severity, response actions |

### O5 Finance & Invoicing

| Skill | Action | Output |
|-------|--------|--------|
| Financial summary | `get-financial-summary` | MTD revenue, outstanding, overdue |
| Create invoice | `create-invoice` | Invoice from job details (7% VAT) |
| Send invoice | `send-invoice` | Mark invoice as sent to client |
| Overdue invoices | `get-overdue-invoices` | All overdue with aging buckets |
| Record payment | `record-payment` | Payment received against invoice |

### O6 Pilot Operations

| Skill | Action | Output |
|-------|--------|--------|
| Available pilots | `get-available-pilots` | Pilots ready, cert status, hours |
| Assign pilot | `assign-pilot` | Lock pilot to mission |
| Check certifications | `check-certifications` | Cert expiry dates, auto-ground expired |
| Log flight hours | `log-flight-hours` | Update pilot flight hour records |

### O7 Data Processing

| Skill | Action | Output |
|-------|--------|--------|
| Processing stats | `get-processing-stats` | Queue depth, QA rate, backup status |
| Create data job | `create-data-job` | New processing job from mission |
| Register backup | `register-backup` | Record backup copy (4-copy protocol) |
| Start processing | `start-processing` | Begin data processing pipeline |
| Mark QA | `mark-qa-complete` | QA passed/failed with findings |

### S1 Market Intelligence

| Skill | Action | Output |
|-------|--------|--------|
| Scan opportunities | `scan-opportunities` | New opportunities by sector |
| Rank opportunities | `rank-opportunities` | Revenue-weighted ranking |
| Segment analysis | `segment-analysis` | Market context for target segment |
| Forecast demand | `forecast-demand` | Demand projection by region/segment |

### S2 Partner Strategy

| Skill | Action | Output |
|-------|--------|--------|
| Route opportunity | `route-opportunity` | IFS channel or Direct KTV |
| Evaluate partnership | `evaluate-partnership` | Partnership fit score + terms |
| Check equity impact | `check-equity-impact` | IFS equity milestone progress |
| Plan expansion | `plan-expansion` | Territory + partner growth plan |

### S3 Smart Green Product

| Skill | Action | Output |
|-------|--------|--------|
| Assess site | `assess-site` | Smart Green readiness score |
| Design integration | `design-integration` | BMS/CMMS integration flow |
| Configure telemetry | `configure-telemetry` | ESG sensor + data capture config |
| Establish baseline | `establish-baseline` | GRESB baseline metrics |

### S4 Financial Model

| Skill | Action | Output |
|-------|--------|--------|
| Check guardrails | `check-guardrails` | Deal economics pass/fail |
| Analyze deal | `analyze-deal` | IRR, NPV, payback, margin |
| Analyze carbon | `analyze-carbon` | Carbon credit revenue projection |
| Model expansion | `model-expansion` | CAPEX model for scaling |
| Model partnership | `model-partnership` | Financial impact of partnership |

### S5 Deal Design

| Skill | Action | Output |
|-------|--------|--------|
| Create proposal | `create-proposal` | Client proposal document |
| Create deck | `create-deck` | Pitch deck for partner/investor |
| Generate one-pager | `generate-one-pager` | Executive summary document |

### S6 Sales Playbook

| Skill | Action | Output |
|-------|--------|--------|
| Prioritize accounts | `prioritise-accounts` | Scored + ranked account list |
| Create playbook | `create-playbook` | Sector-specific sales playbook |
| Structure pilot | `structure-pilot` | 90-day paid pilot proposal |

### S7 Ops Compliance

| Skill | Action | Output |
|-------|--------|--------|
| Capacity analysis | `capacity-analysis` | Fleet + pilot demand forecast |
| Assess feasibility | `assess-feasibility` | Mission feasibility score |
| Plan mission | `plan-mission` | Crew + drone assignment plan |
| Check CAAT | `check-caat` | CAAT regulatory compliance status |

### Company Agent Skills (All 13)

| Skill | Action | Output |
|-------|--------|--------|
| Scan company intel | `scan-company-intel` | Company news, ESG reports, FM procurement opportunities |
| Update pipeline | `update-pipeline` | Sales pipeline status, contacts, next actions |
| Sync GDrive | `sync-gdrive` | Push strategy docs to Google Drive folder |
| Sync all company docs | `sync-all-company-docs` | Bulk sync all 13 company strategy folders |

---

## Weekly Routine Schedule (20 Routines, 105 Tasks)

### Monday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 08:00 | Daily Ops Briefing | All 6 teams | 7 agents report in parallel |
| 09:00 | Weekly Market Scan | Intelligence, Growth | Scan sectors, rank opportunities, route leads, check IFS equity |
| 10:00 | Weekly Capacity Planning | Delivery, Compliance | Forecast demand, maintenance review, cert check, crew planning |
| 11:00 | Client Onboarding Pipeline | Growth, Delivery | Welcome sequences, site assessments, contracts, channel routing |

### Tuesday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 09:00 | Partner Pipeline Review | Ecosystem | Partnership proposals, equity tracking, Smart Green, new targets |
| 09:30 | **Company Agent Marketing Scans** | Growth, Ecosystem, Intelligence | **All 13 company marketing agents scan → GDrive sync** |
| 11:00 | Smart Green ESG Tracking | Ecosystem, Compliance | GRESB indicators, GHG reduction, T-VER credits, ESG matrix |
| 14:00 | Sales Pipeline Grooming | Growth, Revenue | Score accounts, flag stalled leads, generate proposals, playbooks |

### Wednesday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 08:00 | Mid-Week Safety Review | Compliance | WTD incidents, pre-flight analysis, pilot check, compliance gaps |
| 10:00 | Fleet Optimization | Delivery | Utilization, maintenance optimization, mission efficiency |
| 11:00 | Shell IoT Station Health | Delivery, Ecosystem | 400-station sensor check, provenance, offline flags, edge uptime |
| 14:00 | Recurring Service Scheduling | Delivery, Revenue | Active contracts, next-month slots, retention, renewal flags |

### Thursday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 09:00 | Revenue Operations Review | Revenue, Growth | WTD revenue, collections, deal guardrails, carbon credits, NPS |
| 11:00 | ESG Report Preparation | Ecosystem, Revenue | ESG certificates, client reports, carbon revenue, disclosures |
| 14:00 | Data Quality Audit | Delivery | 4-copy backup compliance, QA pass rate, ESG certificate status |

### Friday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 09:00 | Weekly KPI Aggregation | All 6 teams | All 7 ops agents report KPIs |
| 10:00 | **Company Agent Sales + Docs Sync** | Growth, Ecosystem, Revenue, Intelligence | **All 13 company sales pipelines + docs → GDrive sync** |
| 11:00 | Shell IoT Revenue & Tier Report | Revenue, Ecosystem | Base/Standard/Premium tier revenue, upsell, value layers |
| 17:00 | Weekly Report Distribution | All 6 teams | Push to 8 platforms: Notion, Asana, Airtable, Supabase, Gamma, Canva, GDrive, Email |

### Saturday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 08:00 | Weekend Fleet & Sensor Monitoring | Delivery, Compliance | Fleet snapshot, sensor sync, S3 health, emergency readiness, battery |

### Sunday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 18:00 | Pre-Week Data Sync & Prep | Delivery, Intelligence | IoT upload verification, dashboard prep, market pre-load, Monday schedule |

---

## Company Agent Weekly Task Details

### Tuesday 09:30 — Marketing Scans (13 tasks)

| # | Company | Team | Agent | Action |
|---|---------|------|-------|--------|
| 1 | JLL Thailand | Growth | S1 | `scan-company-intel` |
| 2 | Knight Frank | Growth | S6 | `scan-company-intel` |
| 3 | CBRE Thailand | Growth | S1 | `scan-company-intel` |
| 4 | Shell Thailand | Ecosystem | S2 | `scan-company-intel` |
| 5 | PTT/OR | Ecosystem | S2 | `scan-company-intel` |
| 6 | Bangchak | Ecosystem | S3 | `scan-company-intel` |
| 7 | KBANK | Intelligence | S4 | `scan-company-intel` |
| 8 | SCB | Intelligence | S4 | `scan-company-intel` |
| 9 | BBL | Intelligence | S4 | `scan-company-intel` |
| 10 | One Bangkok | Growth | S5 | `scan-company-intel` |
| 11 | Frasers Property | Ecosystem | S3 | `scan-company-intel` |
| 12 | Central Pattana | Growth | S6 | `scan-company-intel` |
| 13 | WHA Group | Growth | S7 | `scan-company-intel` |

### Friday 10:00 — Sales Pipelines + Docs (14 tasks)

| # | Company | Team | Agent | Action |
|---|---------|------|-------|--------|
| 1 | JLL Thailand | Growth | S1 | `update-pipeline` |
| 2 | Knight Frank | Growth | S6 | `update-pipeline` |
| 3 | CBRE Thailand | Growth | S1 | `update-pipeline` |
| 4 | Shell Thailand | Ecosystem | S2 | `update-pipeline` |
| 5 | PTT/OR | Ecosystem | S2 | `update-pipeline` |
| 6 | Bangchak | Ecosystem | S3 | `update-pipeline` |
| 7 | KBANK | Revenue | S4 | `update-pipeline` |
| 8 | SCB | Revenue | S4 | `update-pipeline` |
| 9 | BBL | Revenue | S4 | `update-pipeline` |
| 10 | One Bangkok | Growth | S5 | `update-pipeline` |
| 11 | Frasers Property | Ecosystem | S3 | `update-pipeline` |
| 12 | Central Pattana | Growth | S6 | `update-pipeline` |
| 13 | WHA Group | Growth | S7 | `update-pipeline` |
| 14 | All companies | Intelligence | S1 | `sync-all-company-docs` |

---

## Automated Triggers (24/7)

| Trigger | Interval | Agent | Action |
|---------|----------|-------|--------|
| `trig-fleet-health` | 5 min | O1 Fleet | Poll 16 drones, flag battery/maintenance |
| `trig-data-queue` | 5 min | O7 Data | Check queue, flag >48h jobs |
| `trig-safety-stats` | 10 min | O4 Safety | Aggregate incidents, pre-flight pass rates |
| `trig-overdue-invoices` | 15 min | O5 Finance | Scan overdue, emit collection events |
| `trig-crm-pipeline` | 20 min | O3 CRM | Count leads by stage, flag stalled >72h |
| `trig-cert-check` | 30 min | O6 Pilots | Audit certifications, auto-ground expired |

---

## Event-Driven Workflows (15 Total)

| # | ID | Trigger | Steps | Team |
|---|-----|---------|-------|------|
| 1 | `wf-lead-to-client` | lead.created | 2 | Growth |
| 2 | `wf-mission-prep` | job.stage.changed | 5 | Delivery |
| 3 | `wf-preflight-to-mission` | job.stage.changed | 2 | Delivery |
| 4 | `wf-post-mission` | mission.completed | 8 | Delivery |
| 5 | `wf-delivery-to-payment` | data.qa.passed | 3 | Revenue |
| 6 | `wf-maintenance-auto` | fleet.maintenance.due | 2 | Compliance |
| 7 | `wf-incident-response` | safety.incident.reported | 3 | Compliance |
| 8 | `wf-overdue-collection` | finance.invoice.overdue | 2 | Revenue |
| 9 | `wf-cert-expiry` | pilot.certification.expiring | 2 | Compliance |
| 10 | `wf-daily-ops` | system.health.recovered | 7 | All |
| 11 | `wf-connected-lead-onboard` | lead.created | 2 | Growth |
| 12 | `wf-connected-mission-brief` | mission.preflight.passed | 2 | Delivery |
| 13 | `wf-connected-invoice-email` | finance.invoice.sent | 1 | Revenue |
| 14 | `wf-connected-safety-alert` | safety.incident.reported | 1 | Compliance |
| 15 | `wf-connected-cert-expiry` | pilot.certification.expiring | 2 | Compliance |

---

## Connected App Automations (9 Total)

| # | Automation | Trigger | Gmail | Calendar |
|---|-----------|---------|-------|----------|
| 1 | Client welcome | New lead qualified | Welcome email | Intro meeting |
| 2 | Mission briefing | Pre-flight passes | Crew briefing | Mission block |
| 3 | Invoice delivery | Invoice created | Invoice email | Payment due |
| 4 | Safety alert | Incident reported | URGENT alert | Review meeting |
| 5 | Cert expiry warning | Cert <30 days | Warning email | Training deadline |
| 6 | Overdue follow-up | Invoice >30 days | Reminder email | — |
| 7 | Daily ops summary | Daily-ops completes | Summary email | — |
| 8 | Weekly report | Friday 17:00 | Report email | — |
| 9 | Maintenance notice | Drone grounded | Notice email | Maintenance block |

---

## 5 CoWork Commands

| Command | ID | Description | Teams | Mode |
|---------|-----|------------|-------|------|
| `/cowork full-cycle` | `cowork-full-cycle` | Market → lead → mission → delivery → payment | Intelligence, Growth, Delivery, Revenue | Sequential |
| `/cowork new-partner` | `cowork-new-partner` | Evaluate → pitch → onboard partnership | Intelligence, Ecosystem, Revenue | Sequential |
| `/cowork daily-ops` | `cowork-daily-ops` | Morning briefing: all teams report | Compliance, Delivery, Revenue, Growth | Parallel |
| `/cowork scale-up` | `cowork-scale-up` | Capacity expansion planning | All 5 teams | Sequential |
| `/cowork smart-green` | `cowork-smart-green` | Smart Green platform deployment | Ecosystem, Delivery, Compliance, Intelligence | Sequential |

---

## KPI Targets

| KPI | Agent | Target |
|-----|-------|--------|
| Fleet Utilization | O1 | >=70% |
| Fleet Availability | O1 | >=90% |
| Pre-flight Pass Rate | O4 | >=95% |
| Days Without Incident | O4 | 365 continuous |
| Gross Revenue | O5 | THB 180.18M/yr |
| EBITDA Margin | O5 | >=77.7% |
| Invoice DSO | O5 | <=30 days |
| Total Leads | O3 | >=50/week |
| Conversion Rate | O3 | >=25% |
| NPS Score | O3 | >=50 |
| Pilot Cert Compliance | O6 | 100% |
| Backup Compliance | O7 | 100% |
| QA Pass Rate | O7 | >=97% |
| GHG Reduction | S3 | >=96% |
| Carbon Credits | S4 | Active |

---

## 8-Platform Report Distribution

| # | Platform | Format | Content |
|---|----------|--------|---------|
| 1 | Notion | Markdown | Full ops report — KPIs, alerts, agent status |
| 2 | Asana | Markdown + JSON | Team tasks — completed + next week |
| 3 | Airtable | JSON | KPI snapshot — all metrics by team |
| 4 | Supabase | JSON (real-time) | Dashboard — agent health, KPIs, decisions |
| 5 | Gamma | Markdown slides | Weekly presentation for management |
| 6 | Canva | Markdown | Pitch content with latest numbers |
| 7 | Google Drive | Markdown | Master weekly report + company strategy docs |
| 8 | Email | HTML | Summary to Matthew, Thanvarat, Krit |

---

## Supervisor Ratings

| Rating | Criteria |
|--------|----------|
| **critical** | Status `error` OR >5 errors |
| **needs-attention** | Status `offline` OR completion <80% |
| **good** | Completion rate >=80% |
| **excellent** | Completion rate >=95% |

**System health**: healthy → degraded (>2 need attention) → warning (any critical) → critical (>2 critical)

---

## Integration Platforms (11)

| Integration | Module | Purpose |
|-------------|--------|---------|
| LINE | `line-connector.ts` | Thai customer messaging |
| Odoo | `external-systems.ts` | ERP connector |
| AWS S3 | `external-systems.ts` | Data storage, Object Lock (7yr) |
| DJI FlightHub | `external-systems.ts` | Fleet telemetry |
| Notion | `notion.ts` | Workspace, agent snapshots, KPI DB |
| Google Drive | `gdrive.ts` | Document storage, company strategy folders |
| Asana | `asana.ts` | Project/task management |
| Airtable | `airtable.ts` | Agent status, KPI snapshots |
| Supabase | `supabase.ts` | Real-time dashboard, telemetry |
| Gamma | `gamma.ts` | AI pitch decks, reports |
| Canva | `canva.ts` | Pitch content generation |

---

## Source Files

| File | Purpose |
|------|---------|
| `src/agents/company-agents.ts` | 13 company agents, 39 sub-agents, strategies, GDrive sync |
| `src/agents/base-agent.ts` | Abstract `KtvAgent` base class |
| `src/agents/fleet-management.ts` | O1 Fleet Management Agent |
| `src/agents/job-lifecycle.ts` | O2 Job Lifecycle Agent |
| `src/agents/crm-sales.ts` | O3 CRM & Sales Agent |
| `src/agents/safety-compliance.ts` | O4 Safety & Compliance Agent |
| `src/agents/finance-invoicing.ts` | O5 Finance & Invoicing Agent |
| `src/agents/pilot-operations.ts` | O6 Pilot Operations Agent |
| `src/agents/data-processing.ts` | O7 Data Processing Agent |
| `src/agents/orchestrator.ts` | `KtvOrchestrator` — routes messages, health checks |
| `src/agents/supervisor.ts` | `AgentSupervisor` — productivity monitor |
| `src/agents/index.ts` | All agent exports |
| `src/mastermind/main.py` | S1-S7 Strategy agent entry point |
| `src/workflows/cowork.ts` | 6 teams, 5 commands, 20 routines, 105 tasks |
| `src/workflows/connected-apps.ts` | 9 automations, 7 email + 6 calendar templates |
| `src/workflows/definitions.ts` | 10 core workflow definitions |
| `src/workflows/triggers.ts` | 6 automated triggers (5-30 min) |
| `src/workflows/brain.ts` | OperationsBrain — decision engine |
| `src/workflows/engine.ts` | WorkflowEngine — step execution |
| `src/workflows/event-bus.ts` | EventBus — pub/sub events |
| `src/integrations/gdrive.ts` | Google Drive client — company strategy folder sync |

---

## Quick Start

```bash
# Start platform (all agents + triggers)
npm run start

# CoWork commands
claude -p '/cowork daily-ops'
claude -p '/cowork full-cycle'
claude -p '/cowork new-partner'
claude -p '/cowork scale-up'
claude -p '/cowork smart-green'

# Build and test
npm run build          # tsc → dist/
npm test               # 94/94 tests
npm run lint           # type checking
```

---

## Platform Totals

| Metric | Count |
|--------|-------|
| Core Agents | 14 (7 ops + 7 strategy) |
| Company Agents | 13 |
| Sub-Agents | 39 (13 × 3: marketing + sales + docs) |
| CoWork Teams | 6 |
| CoWork Commands | 5 |
| Weekly Routines | 20 |
| Weekly Tasks | 105 |
| Automated Triggers | 6 (24/7) |
| Event Workflows | 15 |
| Connected App Automations | 9 |
| Integration Platforms | 11 |
| Report Distribution | 8 platforms |
| GDrive Strategy Folders | 13 |
| GDrive Strategy Files | 39 |
| Tests Passing | 94/94 |

---

*Generated for /cowork upload | KTV Working Drone Thailand | 2026-06-20*
