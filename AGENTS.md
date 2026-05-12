# KTV Working Drone Thailand — AGENTS

**14 AI agents | 6 CoWork teams | 18 weekly routines | 78 tasks | 5 commands**
**Upload to**: `/cowork` orchestrator for full automation

---

## Agent Registry

### Operations Layer (7 Agents)

| ID | Agent | Class | Role | Description |
|----|-------|-------|------|-------------|
| O1 | Fleet Manager | `FleetManagementAgent` | `fleet-management` | 16-drone fleet, batteries, payloads, maintenance schedules |
| O2 | Job Manager | `JobLifecycleAgent` | `job-lifecycle` | 13-stage job lifecycle from lead-capture to completion |
| O3 | CRM & Sales | `CrmSalesAgent` | `crm-sales` | Leads, clients, segments, NPS, pipeline tracking |
| O4 | Safety & Compliance | `SafetyComplianceAgent` | `safety-compliance` | CAAT compliance, risk assessment, incident response |
| O5 | Finance & Invoicing | `FinanceInvoicingAgent` | `finance-invoicing` | Invoicing, revenue tracking, collections, DSO |
| O6 | Pilot Operations | `PilotOperationsAgent` | `pilot-operations` | Pilot scheduling, certifications, performance |
| O7 | Data Processing | `DataProcessingAgent` | `data-processing` | Data pipeline, 4-copy backup, QA, client delivery |

### Strategy Layer (7 Agents — Mastermind)

| ID | Agent | Strategy Role | Description |
|----|-------|--------------|-------------|
| S1 | Market Intelligence | `market_intelligence_strategist` | TAM/SAM/SOM, competitive intelligence, opportunity mapping |
| S2 | Partner Strategy | `partner_strategy_architect` | IFS channel routing, JV governance, equity milestones |
| S3 | Smart Green Product | `smart_green_product_orchestrator` | ESG telemetry, GRESB readiness, BMS/CMMS integration |
| S4 | Financial Model | `financial_model_capital_planner` | 3-year model, IRR/NPV/payback, guardrails, carbon credits |
| S5 | Deal Design | `deal_design_pitch_engineer` | Investor decks, proposals, term sheets, pitch materials |
| S6 | Sales Playbook | `sales_playbook_account_selector` | Account prioritization, sector playbooks, closing strategy |
| S7 | Ops Compliance | `operations_compliance_mission_planner` | CAAT regulation, crew planning, mission SOPs, capacity |

### Supervisor

| Agent | Class | Purpose |
|-------|-------|---------|
| Supervisor | `AgentSupervisor` | Monitors all 14 agents, tracks productivity, generates reports, flags underperformers |

---

## 6 CoWork Teams

### Team 1: Growth Engine (`growth`)

**Mission**: Identify, qualify, and route market opportunities through IFS or Direct KTV channels

| Role | Agents |
|------|--------|
| Strategy | S1 Market Intelligence, S2 Partner Strategy, S6 Sales Playbook |
| Operations | O3 CRM & Sales, O2 Job Lifecycle |
| Lead | S1 Market Intelligence |

**KPIs**: New leads/week, Lead→qualified conversion, Pipeline value (THB), IFS vs Direct split

**Workflows**: `wf-lead-to-client`

### Team 2: Service Delivery (`delivery`)

**Mission**: Execute drone missions from planning through data delivery with zero safety incidents

| Role | Agents |
|------|--------|
| Strategy | S7 Ops Compliance, S3 Smart Green |
| Operations | O1 Fleet, O2 Jobs, O6 Pilots, O4 Safety, O7 Data |
| Lead | O1 Fleet Management |

**KPIs**: Missions/week, Sqm processed, Safety incidents (0), On-time delivery, Backup compliance (100%)

**Workflows**: `wf-mission-prep`, `wf-preflight-to-mission`, `wf-post-mission`

### Team 3: Compliance & Safety (`compliance`)

**Mission**: Maintain zero safety incidents, CAAT compliance, and fleet readiness at all times

| Role | Agents |
|------|--------|
| Strategy | S7 Ops Compliance |
| Operations | O4 Safety, O1 Fleet, O6 Pilots |
| Lead | O4 Safety & Compliance |

**KPIs**: Incidents (0), Pre-flight pass rate (>95%), Fleet availability, Cert currency, CAAT status

**Workflows**: `wf-incident-response`, `wf-maintenance-auto`, `wf-cert-expiry`

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

**KPIs**: IFS equity progress (THB 32M→64M→160M), Smart Green sites, Partner satisfaction, Proposals delivered

**Workflows**: `wf-lead-to-client`

### Team 6: Revenue Operations (`revenue`)

**Mission**: Maximise revenue, maintain healthy margins, and ensure timely collections

| Role | Agents |
|------|--------|
| Strategy | S4 Financial Model, S5 Deal Design, S6 Sales Playbook |
| Operations | O5 Finance, O3 CRM, O2 Jobs |
| Lead | O5 Finance & Invoicing |

**KPIs**: Revenue vs THB 180.18M target, EBITDA margin (>55%), Collection rate, DSO, IRR tracking

**Workflows**: `wf-delivery-to-payment`, `wf-overdue-collection`

---

## Agent Skills

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

---

## Weekly Routine Schedule (18 Routines, 78 Tasks)

### Monday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 08:00 | Daily Ops Briefing | All 6 teams | 7 agents report in parallel (via `/cowork daily-ops`) |
| 09:00 | Weekly Market Scan | Intelligence, Growth | Scan sectors, rank opportunities, route leads, check IFS equity |
| 10:00 | Weekly Capacity Planning | Delivery, Compliance | Forecast demand, maintenance review, cert check, crew planning |
| 11:00 | Client Onboarding Pipeline | Growth, Delivery | Welcome sequences, site assessments, contract conversion, channel routing |

### Tuesday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 09:00 | Partner Pipeline Review | Ecosystem | Partnership proposals, equity tracking, Smart Green adoption, new targets |
| 11:00 | Smart Green ESG Tracking | Ecosystem, Compliance | GRESB indicators, GHG reduction, T-VER credits, ESG compliance matrix |
| 14:00 | Sales Pipeline Grooming | Growth, Revenue | Score accounts, flag stalled leads, generate proposals, update playbooks |

### Wednesday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 08:00 | Mid-Week Safety Review | Compliance | WTD incidents, pre-flight analysis, pilot check, compliance gaps |
| 10:00 | Fleet Optimization | Delivery | Utilization, maintenance optimization, mission efficiency |
| 11:00 | Shell IoT Station Health | Delivery, Ecosystem | 400-station sensor check, data provenance, offline flags, edge uptime |
| 14:00 | Recurring Service Scheduling | Delivery, Revenue | Active contracts, next-month slots, retention rate, renewal flags |

### Thursday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 09:00 | Revenue Operations Review | Revenue, Growth | WTD revenue, collections, deal guardrails, carbon credits, NPS |
| 11:00 | ESG Report Preparation | Ecosystem, Revenue | ESG certificates, client reports, carbon revenue, disclosure artifacts |
| 14:00 | Data Quality Audit | Delivery | 4-copy backup compliance, QA pass rate, ESG certificate status |

### Friday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 09:00 | Weekly KPI Aggregation | All 6 teams | All 7 ops agents report KPIs |
| 11:00 | Shell IoT Revenue & Tier Report | Revenue, Ecosystem | Base/Standard/Premium tier revenue, upsell candidates, value layers |
| 17:00 | Weekly Report Distribution | All 6 teams | Push to 8 platforms: Notion, Asana, Airtable, Supabase, Gamma, Canva, GDrive, Email |

### Saturday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 08:00 | Weekend Fleet & Sensor Monitoring | Delivery, Compliance | Fleet snapshot, sensor sync, S3 health, emergency readiness, battery status |

### Sunday

| Time | Routine | Teams | Tasks |
|------|---------|-------|-------|
| 18:00 | Pre-Week Data Sync & Prep | Delivery, Intelligence | IoT upload verification, dashboard prep, market pre-load, Monday schedule |

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

## Event-Driven Workflows (10 Core + 5 Connected)

| Event | Workflow | Agents | What Happens |
|-------|----------|--------|-------------|
| New lead | `wf-lead-to-client` | O3, O2 | Qualify → create job |
| Job contracted | `wf-mission-prep` | O4, O1, O6, O2 | Risk → weather → drone → pilot → advance |
| Pre-flight passes | `wf-preflight-to-mission` | O4, O1 | Launch mission |
| Mission completes | `wf-post-mission` | O7, O1 | Release drone → data job → 4 backups → process → QA |
| Data QA passes | `wf-delivery-to-payment` | O7, O5 | Delivery → invoice → send |
| Invoice overdue | `wf-overdue-collection` | O5 | Pull overdue → escalate |
| Safety incident | `wf-incident-response` | O4, O1, O6 | Safety → fleet → cert check |
| Maintenance due | `wf-maintenance-auto` | O1 | Ground drone → schedule |
| Cert expiring | `wf-cert-expiry` | O6, O4 | Audit → safety review |
| New lead (connected) | `wf-connected-lead-onboard` | O3 | Gmail welcome + Calendar meeting |
| Mission launch (connected) | `wf-connected-mission-brief` | O1 | Gmail briefing + Calendar event |
| Invoice sent (connected) | `wf-connected-invoice-email` | O5 | Gmail invoice to client |
| Safety incident (connected) | `wf-connected-safety-alert` | O4 | Gmail URGENT alert |
| Cert expiring (connected) | `wf-connected-cert-expiry` | O6 | Gmail + Calendar deadline |

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

## CoWork Commands

| Command | ID | Description | Teams | Mode |
|---------|-----|------------|-------|------|
| `/cowork full-cycle` | `cowork-full-cycle` | Market → lead → mission → delivery → payment | Intelligence, Growth, Delivery, Revenue | Sequential |
| `/cowork new-partner` | `cowork-new-partner` | Evaluate → pitch → onboard partnership | Intelligence, Ecosystem, Revenue | Sequential |
| `/cowork daily-ops` | `cowork-daily-ops` | Morning briefing: all teams report | Compliance, Delivery, Revenue, Growth | Parallel |
| `/cowork scale-up` | `cowork-scale-up` | Capacity expansion planning | Intelligence, Delivery, Compliance, Revenue, Ecosystem | Sequential |
| `/cowork smart-green` | `cowork-smart-green` | Smart Green platform deployment | Ecosystem, Delivery, Compliance, Intelligence | Sequential |

---

## KPI Targets

| KPI | Agent | Target |
|-----|-------|--------|
| Fleet Utilization | O1 | ≥70% |
| Fleet Availability | O1 | ≥90% |
| Missions Completed | O2 | Per pipeline |
| Avg Cycle Time | O2 | ≤3.2 days |
| Pre-flight Pass Rate | O4 | ≥95% |
| Days Without Incident | O4 | 365 continuous |
| Gross Revenue | O5 | THB 180.18M/yr |
| EBITDA Margin | O5 | ≥77.7% |
| Invoice DSO | O5 | ≤30 days |
| Total Leads | O3 | ≥50/week |
| Conversion Rate | O3 | ≥25% |
| NPS Score | O3 | ≥50 |
| Pilot Cert Compliance | O6 | 100% |
| Backup Compliance | O7 | 100% |
| QA Pass Rate | O7 | ≥97% |
| GHG Reduction | S3 | ≥96% |
| Carbon Credits | S4 | Active |

---

## Report Distribution (8 Platforms)

| # | Platform | Format | Content |
|---|----------|--------|---------|
| 1 | Notion | Markdown | Full ops report — KPIs, alerts, agent status |
| 2 | Asana | Markdown + JSON | Team tasks — completed + next week |
| 3 | Airtable | JSON | KPI snapshot — all metrics by team |
| 4 | Supabase | JSON (real-time) | Dashboard — agent health, KPIs, decisions |
| 5 | Gamma | Markdown slides | Weekly presentation for management |
| 6 | Canva | Markdown | Pitch content with latest numbers |
| 7 | Google Drive | Markdown | Master weekly report document |
| 8 | Email | HTML | Summary to Matthew, Thanvarat, Krit |

**Output**: `docs/reports/{platform}/weekly-YYYY-MM-DD.*`

---

## Supervisor Ratings

The `AgentSupervisor` rates each agent automatically:

| Rating | Criteria |
|--------|----------|
| **critical** | Status `error` OR >5 errors |
| **needs-attention** | Status `offline` OR completion <80% |
| **good** | Completion rate ≥80% |
| **excellent** | Completion rate ≥95% |

**System health**: healthy → degraded (>2 need attention) → warning (any critical) → critical (>2 critical)

---

## Source Files

| File | Purpose |
|------|---------|
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
| `src/mastermind/orchestrator.py` | Mastermind parallel orchestration |
| `src/mastermind/prompts.py` | Agent system prompts |
| `src/workflows/cowork.ts` | 6 teams, 5 commands, 18 routines, 78 tasks |
| `src/workflows/connected-apps.ts` | 9 automations, 7 email + 6 calendar templates |
| `src/workflows/definitions.ts` | 10 core workflow definitions |
| `src/workflows/triggers.ts` | 6 automated triggers (5-30 min) |
| `src/workflows/brain.ts` | OperationsBrain — decision engine |
| `src/workflows/engine.ts` | WorkflowEngine — step execution |
| `src/workflows/event-bus.ts` | EventBus — pub/sub events |

---

## How to Run

```bash
# Start platform (all agents + triggers)
npm run start

# CoWork commands
claude -p '/cowork daily-ops'
claude -p '/cowork full-cycle'
claude -p '/cowork new-partner'
claude -p '/cowork scale-up'
claude -p '/cowork smart-green'

# Generate weekly report
npm run build && node dist/scripts/demo-full-report.js

# Build and test
npm run build          # tsc → dist/
npm test               # 94/94 tests
npm run lint           # type checking

# View reports
ls docs/reports/*/weekly-*
```
