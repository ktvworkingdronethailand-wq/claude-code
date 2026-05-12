# KTV Agent Skills — Master Reference

**14 Agents | 7 Strategy + 7 Operations | Connected to CoWork + Gmail + Calendar + 8 Report Platforms**

Every agent listed here is implemented, tested (94/94 pass), and auto-starts on `npm run start`. Strategy agents run via Python Mastermind (`src/mastermind/`). Operations agents run via TypeScript (`src/agents/`). Both layers coordinate through CoWork (`src/workflows/cowork.ts`).

---

## Strategy Layer — 7 Mastermind Agents

### Agent S1: Market Intelligence Strategist

**ID**: `market_intelligence_strategist`
**Role**: Chief Market Officer
**Source**: `src/mastermind/agents/market_intelligence.py`
**CoWork Teams**: Growth Engine (lead), Market Intelligence (lead)

| Skill | Input | Output |
|-------|-------|--------|
| Scan opportunities | sectors, region, depth | Market overview + ranked opportunities |
| TAM/SAM/SOM analysis | region | THB 85B TAM → 6.8B SAM → 180M SOM |
| Sector intelligence | sector list | Per-sector insights (sqm, pricing, route) |
| Demand forecasting | region, period | Revenue forecast by segment |
| Competitive analysis | — | Rope access vs other drones vs KTV |

**10 Sector Databases**: Commercial real estate, healthcare, industrial, government, transport, O&G, data centres, hotels, education, solar

**Autonomous Decisions**:
1. Ranks sectors by estimated addressable revenue
2. Identifies first-mover vs follow-on opportunities
3. Maps every sector to IFS or Direct KTV channel

**CoWork Commands**: full-cycle (step 1), daily-ops (pipeline brief), scale-up (demand forecast)

---

### Agent S2: Partner Strategy Architect

**ID**: `partner_strategy_architect`
**Role**: VP Strategic Partnerships
**Source**: `src/mastermind/agents/partner_strategy.py`
**CoWork Teams**: Ecosystem Builder (lead), Growth Engine, Market Intelligence

| Skill | Input | Output |
|-------|-------|--------|
| Route opportunity | opportunity{sector, service_type} | IFS or Direct KTV routing decision |
| Evaluate partnership | partnership_type | KTV CARE or Technology Partnership details |
| Assess equity impact | opportunity, revenue | IFS equity milestone progress |
| Plan expansion | region | Territory + partner capacity plan |

**Channel Rules (Hard-coded)**:
- All FM sectors → IFS Thailand (exclusive scope)
- Non-FM (agriculture, media, training) → Direct KTV
- IFS does not build competing drone stack outside JV

**IFS Equity Milestones**: THB 32M → 64M → 160M

**Autonomous Decisions**:
1. Routes every opportunity to correct channel
2. Tracks cumulative revenue against IFS equity triggers
3. Enforces exclusivity rules — no competing FM partners

**CoWork Commands**: full-cycle (step 2), new-partner (steps 2-3), scale-up (partner expansion)

---

### Agent S3: Smart Green Product Orchestrator

**ID**: `smart_green_product_orchestrator`
**Role**: Chief Product Officer
**Source**: `src/mastermind/agents/smart_green.py`
**CoWork Teams**: Ecosystem Builder, Market Intelligence, Service Delivery

| Skill | Input | Output |
|-------|-------|--------|
| Assess site | site_type | Integration flow + compatibility |
| Design integration | site_type, integration_target | BMS/CMMS integration design |
| Configure telemetry | site_type | ESG sensor configuration |
| Establish baseline | site_type | GHG/water/energy baselines |
| GRESB readiness check | — | Status + reporting categories |

**Smart Green Platform**: https://www.smartgreenoperations.com
- GRESB-ready: Energy, Water, Chemical, Work-at-Height, Carbon, PM2.5
- Export formats: PDF, CSV, API, GRESB template
- Verification: Cryptographically verifiable telemetry
- AI: Predictive maintenance, anomaly detection, coverage optimization

**Autonomous Decisions**:
1. Selects sensor configuration per site type
2. Designs BMS/CMMS integration flow
3. Calculates GHG baselines for T-VER credits
4. Generates GRESB-formatted compliance reports

**CoWork Commands**: smart-green (all 5 steps), new-partner (integration design)

---

### Agent S4: Financial Model & Capital Planner

**ID**: `financial_model_capital_planner`
**Role**: Chief Financial Officer
**Source**: `src/mastermind/agents/financial_model.py`
**CoWork Teams**: Revenue Operations, Ecosystem Builder

| Skill | Input | Output |
|-------|-------|--------|
| Analyze deal | deal{sqm, price, sector}, scenario | Revenue, margin, NPV, IRR |
| Check guardrails | deal | Pass/fail on min price, min order, margin floor |
| Model partnership | partner opportunity | Equity impact + milestone tracking |
| Model expansion | fleet + pilots needed | CapEx model + ROI timeline |
| Training revenue | — | Academy revenue projection |
| CARE agreement value | deal | KTV CARE subscription economics |

**Financial Guardrails (Hard-coded)**:
- Min price: 27 THB/sqm — NEVER below
- Min order: 20,000 sqm
- VAT: 7%, Royalty: 7%, Corp Tax: 20%
- Year 1 target: THB 180.18M gross revenue
- IRR range: 257%, Payback: 6.3 months

**Autonomous Decisions**:
1. Rejects deals below guardrail thresholds
2. Selects pricing scenario (conservative 30 / base 45 / premium 70 THB/sqm)
3. Calculates carbon credit revenue stream
4. Projects KTV CARE subscription economics

**CoWork Commands**: full-cycle (step 4), new-partner (step 3), scale-up (capex model)

---

### Agent S5: Deal Design & Pitch Engineer

**ID**: `deal_design_pitch_engineer`
**Role**: VP Business Development
**Source**: `src/mastermind/agents/deal_design.py`
**CoWork Teams**: Ecosystem Builder, Revenue Operations

| Skill | Input | Output |
|-------|-------|--------|
| Generate deck slide | task, audience, key_points | Slide content (title + bullets + notes) |
| Generate one-pager | audience, tone | Executive one-pager |
| Generate email | audience, tone | Outreach email |
| Generate term sheet | deal details | Term sheet text |
| Generate executive summary | — | Deal executive summary |
| Generate proposal | audience, deal | Full proposal document |
| Generate CARE agreement | deal | KTV CARE proposal |
| Generate tech partnership | — | Technology Partnership proposal |
| Generate training proposal | — | Training Academy proposal |

**9 Artifact Types**: deck-slide, one-pager, email, term-sheet, executive-summary, proposal, care-agreement, technology-partnership, training-proposal

**Autonomous Decisions**:
1. Selects correct artifact type for audience
2. Embeds verified financials from KTV baseline (never modified without memory update)
3. Applies correct branding and tone per audience

**CoWork Commands**: new-partner (step 4 — create pitch)

---

### Agent S6: Sales Playbook & Account Selector

**ID**: `sales_playbook_account_selector`
**Role**: VP Sales
**Source**: `src/mastermind/agents/sales_playbook.py`
**CoWork Teams**: Growth Engine, Ecosystem Builder, Revenue Operations

| Skill | Input | Output |
|-------|-------|--------|
| Prioritize accounts | sector, filters | Ranked account list with revenue estimates |
| Create playbook | sector | Sector-specific sales playbook |
| Design pilot | account | 90-day paid pilot structure |
| Score account | account data | Priority score + recommended approach |

**24+ Named Accounts**: One Bangkok (104K sqm), Icon Siam (75K), Suvarnabhumi Airport (120K), Amata City (200K), CentralWorld (55K), and more

**Account Scoring**: sqm × price × cycles/year × capture probability

**Autonomous Decisions**:
1. Ranks all accounts by estimated revenue
2. Routes each to IFS or Direct KTV channel
3. Designs 90-day pilot with phased rollout
4. Selects pricing tier by sector

**CoWork Commands**: full-cycle (step 3), new-partner (step 5 — playbook), scale-up (planning)

---

### Agent S7: Operations & Compliance Mission Planner

**ID**: `operations_compliance_mission_planner`
**Role**: Chief Operations Officer
**Source**: `src/mastermind/agents/ops_compliance.py`
**CoWork Teams**: Service Delivery, Compliance & Safety

| Skill | Input | Output |
|-------|-------|--------|
| Assess feasibility | site{height, area, location} | GO/NO-GO + risk assessment |
| Plan mission | site, service_type | Crew, fleet, timeline, SOP |
| CAAT compliance check | site location | Altitude, airspace, NOTAM requirements |
| Capacity analysis | demand forecast | Fleet/pilot gaps + procurement plan |
| Emergency response plan | site | Emergency SOP + contacts |

**Fleet Inventory**: 16 drones (4× T50, 2× T25, 2× M350 RTK, 2× M30T, 2× Mavic 3E RTK, 1× Inspire 3, 1× Mavic 3 Pro Cine, + KTV Facade Drones)

**Crew Requirements per Service** (pilots/ground/supervisor):
- Facade/window/jet-wash: 2/2/1
- Solar/gardens/PM2.5: 1/2/1 or 1/1/1
- O&G inspection: 2/2/1 + safety officer
- Emergency: 2/2/1

**CAAT Hard Limits**: 90m altitude, 9km airport buffer, wind <8 m/s, visibility >5km

**Autonomous Decisions**:
1. GO/NO-GO based on site + weather + CAAT rules
2. Selects optimal fleet composition per service type
3. Assigns crew by type rating and availability
4. Generates NOTAM filing requirements

**CoWork Commands**: full-cycle (step 5), smart-green (step 3), scale-up (step 2)

---

## Operations Layer — 7 KTV Agents

### Agent O1: Fleet Manager

**ID**: `fleet-management`
**Source**: `src/agents/fleet-management.ts`
**CoWork Teams**: Service Delivery (lead), Compliance & Safety

| Skill | Action | Trigger |
|-------|--------|---------|
| Fleet summary | `get-fleet-summary` | Daily ops, health monitor |
| Available drones | `get-available-drones` | Mission prep |
| Assign drone | `assign-drone` | Job assignment |
| Release drone | `release-drone` | Mission complete |
| Maintenance alerts | `get-maintenance-alerts` | Every 300s trigger |

**Fleet**: 16 DJI drones (agricultural, survey, inspection, media)
**Trigger**: `trig-fleet-health` — every 5 minutes
**Connected Apps**: Calendar maintenance window block
**Autonomous**: Best drone selection, maintenance priority, battery rotation, 7-day availability forecast

---

### Agent O2: Job Manager

**ID**: `job-lifecycle`
**Source**: `src/agents/job-lifecycle.ts`
**CoWork Teams**: Service Delivery, Growth Engine, Revenue Operations, Ecosystem Builder

| Skill | Action | Trigger |
|-------|--------|---------|
| Create job | `create-job` | Lead qualified |
| Advance stage | `advance-stage` | Stage prerequisites met |
| Pipeline summary | `get-pipeline-summary` | Daily ops |

**13-Stage Pipeline**: enquiry → qualified → proposal → contract → planning → pre-flight → mission → data-processing → qa → delivery → invoiced → paid → completed
**Connected Apps**: Calendar site assessment visit (on job.created)
**Autonomous**: Stage eligibility validation, bottleneck detection (>24h), auto-escalation (>48h)

---

### Agent O3: CRM & Sales

**ID**: `crm-sales`
**Source**: `src/agents/crm-sales.ts`
**CoWork Teams**: Growth Engine, Market Intelligence, Ecosystem Builder, Revenue Operations

| Skill | Action | Trigger |
|-------|--------|---------|
| Advance lead | `advance-lead` | Lead stage progression |
| Get pipeline | `get-pipeline` | Every 1200s CRM monitor |
| Record NPS | `record-nps` | Post-delivery |

**Lead Stages**: new → contacted → qualified → proposal → negotiation → won/lost → recurring
**Channel Routing**: FM → IFS, Non-FM → Direct KTV
**Trigger**: `trig-crm-pipeline` — every 20 minutes
**Connected Apps**: Gmail welcome email + Calendar intro meeting (on lead.created)
**Autonomous**: Lead scoring, channel routing, follow-up timing, NPS recovery flagging

---

### Agent O4: Safety & Compliance

**ID**: `safety-compliance`
**Source**: `src/agents/safety-compliance.ts`
**CoWork Teams**: Compliance & Safety (lead), Service Delivery

| Skill | Action | Trigger |
|-------|--------|---------|
| Assess risk | `assess-risk` | Job contracted |
| Check weather | `check-weather` | Mission prep |
| Submit preflight | `submit-preflight` | Pre-flight stage |
| Safety stats | `get-safety-stats` | Every 600s + daily ops |

**CAAT Limits**: 90m altitude, 9km airport buffer, 5km visibility, 8 m/s wind
**Trigger**: `trig-safety-stats` — every 10 minutes
**Connected Apps**: Gmail safety incident alert (URGENT to all leadership), Gmail cert expiry warning
**Autonomous**: GO/NO-GO decision, incident severity classification, CAAT filing, emergency halt broadcast

---

### Agent O5: Finance & Invoicing

**ID**: `finance-invoicing`
**Source**: `src/agents/finance-invoicing.ts`
**CoWork Teams**: Revenue Operations (lead)

| Skill | Action | Trigger |
|-------|--------|---------|
| Create invoice | `create-invoice` | Data QA passed |
| Update status | `update-invoice-status` | Payment / overdue |
| Overdue invoices | `get-overdue-invoices` | Every 900s scanner |
| Financial summary | `get-financial-summary` | Daily ops |

**Rules**: VAT 7%, Royalty 7%, Corp Tax 20%, Min 27 THB/sqm, Net 30 days
**Trigger**: `trig-overdue-invoices` — every 15 minutes
**Connected Apps**: Gmail invoice to client, Gmail overdue follow-up
**Autonomous**: Price validation (rejects <27 THB/sqm), overdue escalation, VAT calculation, revenue reconciliation

---

### Agent O6: Pilot Operations

**ID**: `pilot-operations`
**Source**: `src/agents/pilot-operations.ts`
**CoWork Teams**: Service Delivery, Compliance & Safety

| Skill | Action | Trigger |
|-------|--------|---------|
| Available pilots | `get-available-pilots` | Mission prep, daily ops |
| Check certifications | `check-certifications` | Every 1800s |

**Fleet**: 10 CAAT-certified pilots
**Trigger**: `trig-cert-check` — every 30 minutes
**Connected Apps**: Gmail cert expiry warning, Calendar renewal deadline
**Autonomous**: Best pilot for job (type rating + performance), cert expiry grounding (no override), fatigue management (8hr limit), training recommendations

---

### Agent O7: Data Processing

**ID**: `data-processing`
**Source**: `src/agents/data-processing.ts`
**CoWork Teams**: Service Delivery, Ecosystem Builder

| Skill | Action | Trigger |
|-------|--------|---------|
| Create data job | `create-data-job` | Mission complete |
| Register backup | `register-backup` | 4-copy protocol |
| Advance processing | `advance-processing` | Stage progression |
| Create delivery | `create-delivery` | QA passed |
| Processing stats | `get-processing-stats` | Every 300s |

**4-Copy Backup Rule**: SD card → field laptop → NAS → AWS S3 (all 4 required before processing)
**Pipelines**: photogrammetry (24-48h), LiDAR (12-24h), thermal (8-16h), inspection (24h), ESG (4-8h)
**Trigger**: `trig-data-queue` — every 5 minutes
**Autonomous**: Pipeline selection by data type, QA auto-approval if thresholds met, delivery packaging per contract, ESG certificate generation for T-VER

---

## Agent-to-CoWork Team Mapping

| Agent | Growth | Delivery | Compliance | Intelligence | Ecosystem | Revenue |
|-------|--------|----------|------------|-------------|-----------|---------|
| S1 Market Intelligence | **Lead** | | | **Lead** | | |
| S2 Partner Strategy | X | | | X | **Lead** | |
| S3 Smart Green | | X | | X | X | |
| S4 Financial Model | | | | | X | X |
| S5 Deal Design | | | | | X | X |
| S6 Sales Playbook | X | | | | X | X |
| S7 Ops Compliance | | X | X | | | |
| O1 Fleet Manager | | **Lead** | X | | | |
| O2 Job Manager | X | X | | | X | X |
| O3 CRM & Sales | X | | | X | X | X |
| O4 Safety & Compliance | | X | **Lead** | | | |
| O5 Finance & Invoicing | | | | | | **Lead** |
| O6 Pilot Operations | | X | X | | | |
| O7 Data Processing | | X | | | X | |

## Agent-to-Connected App Mapping

| Event | Gmail Template | Calendar Template | Agents Involved |
|-------|---------------|-------------------|----------------|
| lead.created | Welcome email | Intro meeting | O3 CRM, S1 Market |
| lead.qualified | — | Client meeting | O3 CRM, S6 Sales |
| job.created | — | Site assessment | O2 Job, O4 Safety |
| mission.preflight.passed | Crew briefing | Mission day event | O4 Safety, O1 Fleet, O6 Pilot |
| finance.invoice.sent | Invoice to client | — | O5 Finance |
| finance.invoice.overdue | Payment reminder | — | O5 Finance |
| safety.incident.reported | URGENT alert | — | O4 Safety |
| pilot.certification.expiring | Cert warning | Renewal deadline | O6 Pilot, O4 Safety |
| fleet.maintenance.due | — | Maintenance window | O1 Fleet |
| system.health.recovered | Daily ops summary | Daily standup | All agents |

## Agent-to-Report Platform Mapping

All 14 agents feed into the 8-platform weekly reporting cycle:

| Platform | What Gets Pushed | Source Agents |
|----------|-----------------|---------------|
| Notion | Full ops report (markdown) | All 7 operations agents |
| Asana | Team tasks by CoWork team | All 14 agents via team mapping |
| Airtable | KPI snapshots (JSON) | O1 Fleet, O3 CRM, O5 Finance, O4 Safety |
| Supabase | Real-time dashboard data | All 7 operations agents (telemetry) |
| Gamma | Presentation slides | S4 Financial, S5 Deal Design |
| Canva | Pitch deck content | S5 Deal Design |
| Google Drive | Master report | All agents (aggregated) |
| Email | HTML ops summary | All agents (executive summary) |

---

## Quick Reference — Start All Agents

```bash
# Start platform (all 7 ops agents auto-initialize + brain + triggers)
npm run start

# Run all strategy agents (Mastermind)
python src/mastermind/main.py

# Run CoWork orchestrator (coordinates all 14)
claude -p '/cowork'

# Specific CoWork commands
claude -p '/cowork full-cycle'      # Market → Lead → Mission → Payment
claude -p '/cowork daily-ops'       # Morning briefing (parallel)
claude -p '/cowork new-partner'     # Evaluate + pitch + onboard
claude -p '/cowork scale-up'        # Capacity expansion planning
claude -p '/cowork smart-green'     # Smart Green site deployment

# Run full demo (8-platform report proof)
npm run build && node dist/scripts/demo-full-report.js
```

## Source Files

| Layer | File | What It Contains |
|-------|------|-----------------|
| Strategy | src/mastermind/agents/market_intelligence.py | S1 — 10 sector databases, TAM/SAM/SOM |
| Strategy | src/mastermind/agents/partner_strategy.py | S2 — JV routing, equity milestones |
| Strategy | src/mastermind/agents/smart_green.py | S3 — ESG integration, GRESB readiness |
| Strategy | src/mastermind/agents/financial_model.py | S4 — Deal economics, guardrails |
| Strategy | src/mastermind/agents/deal_design.py | S5 — 9 artifact types, pitch generation |
| Strategy | src/mastermind/agents/sales_playbook.py | S6 — 24+ named accounts, playbooks |
| Strategy | src/mastermind/agents/ops_compliance.py | S7 — Fleet planning, CAAT compliance |
| Strategy | src/mastermind/orchestrator.py | Mastermind orchestrator + tool loop |
| Operations | src/agents/fleet-management.ts | O1 — 16 drones, assignment, maintenance |
| Operations | src/agents/job-lifecycle.ts | O2 — 13-stage pipeline |
| Operations | src/agents/crm-sales.ts | O3 — Lead pipeline, NPS, channel routing |
| Operations | src/agents/safety-compliance.ts | O4 — Pre-flight, risk, CAAT |
| Operations | src/agents/finance-invoicing.ts | O5 — Invoicing, VAT, collections |
| Operations | src/agents/pilot-operations.ts | O6 — 10 pilots, certifications |
| Operations | src/agents/data-processing.ts | O7 — 4-copy backup, 5 pipelines |
| Operations | src/agents/orchestrator.ts | Registry, message routing, health checks |
| CoWork | src/workflows/cowork.ts | 6 teams, 5 commands, session management |
| Connectors | src/workflows/connected-apps.ts | 7 email + 6 calendar templates, 9 automations |
| Brain | src/workflows/brain.ts | Central decision engine |
| Triggers | src/workflows/triggers.ts | 6 automated triggers |
| Reporting | src/operations/automated-reporting.ts | 8-platform parallel distribution |
