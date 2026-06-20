# KTV Working Drone Thailand — AGENTS

**14 Core Agents | 13 Company Agents (39 Sub-Agents) | 6 Teams | 20 Routines (107 Tasks) | 5 Commands**
**Build**: tsc clean | **Tests**: 94/94 | **Target**: ES2022 / Node16

---

## 1. Agent Registry

### Operations (O1–O7)

| ID | Agent | Role | Skills | Capability |
|----|-------|------|:------:|------------|
| O1 | Fleet Manager | `fleet-management` | 6 | 16-drone fleet, battery health, maintenance, assignment |
| O2 | Job Manager | `job-lifecycle` | 4 | 13-stage lifecycle, pipeline tracking, cycle time |
| O3 | CRM & Sales | `crm-sales` | 5 | Leads, clients, NPS, segments, pipeline |
| O4 | Safety | `safety-compliance` | 4 | CAAT compliance, risk assessment, pre-flight, incidents |
| O5 | Finance | `finance-invoicing` | 5 | Invoicing (7% VAT), collections, DSO, overdue |
| O6 | Pilots | `pilot-operations` | 4 | 10 pilots, cert tracking, auto-ground, flight hours |
| O7 | Data | `data-processing` | 5 | 4-copy backup, QA pipeline, ESG certificates |

### Strategy (S1–S7)

| ID | Agent | Role | Skills | Capability |
|----|-------|------|:------:|------------|
| S1 | Market Intelligence | `market_intelligence_strategist` | 4 | TAM/SAM/SOM, opportunity scanning, demand forecasting |
| S2 | Partner Strategy | `partner_strategy_architect` | 4 | IFS channel routing, JV governance, equity milestones |
| S3 | Smart Green | `smart_green_product_orchestrator` | 4 | GRESB, ESG telemetry, BMS/CMMS integration |
| S4 | Financial Model | `financial_model_capital_planner` | 5 | IRR/NPV, carbon credits, guardrails, 3-year model |
| S5 | Deal Design | `deal_design_pitch_engineer` | 3 | Pitch decks, proposals, one-pagers |
| S6 | Sales Playbook | `sales_playbook_account_selector` | 3 | Account scoring, sector playbooks, pilot structuring |
| S7 | Ops Compliance | `operations_compliance_mission_planner` | 4 | CAAT regulation, capacity planning, crew SOPs |

### Supervisor

| Agent | Capability |
|-------|------------|
| `AgentSupervisor` | Monitors all agents, tracks productivity per team, rates performance (excellent/good/needs-attention/critical), generates alerts |

### Company Strategy Agents (13 Companies)

Each company gets 3 sub-agents (**Marketing**, **Sales**, **Docs**) with weekly auto-sync to Google Drive.

| ID | Company | Sector | Annual Target | Lead | GDrive |
|----|---------|--------|---------------|------|--------|
| `ca-jll` | JLL Thailand | Real Estate | THB 15–25M | S1 | `JLL Thailand/` |
| `ca-knight-frank` | Knight Frank Thailand | Real Estate | THB 10–18M | S6 | `Knight Frank Thailand/` |
| `ca-cbre` | CBRE Thailand | Real Estate | THB 20–35M | S1 | `CBRE Thailand/` |
| `ca-one-bangkok` | One Bangkok | Real Estate | THB 23.97M | S5 | `One Bangkok/` |
| `ca-frasers` | Frasers Property | Real Estate | THB 10–20M | S3 | `Frasers Property Thailand/` |
| `ca-cpn` | Central Pattana (CPN) | Real Estate | THB 15–30M | S6 | `Central Pattana CPN/` |
| `ca-shell` | Shell Thailand | Energy | THB 12M + $360K | S2 | `Shell Thailand/` |
| `ca-ptt` | PTT / OR | Energy | THB 30–50M + $550K | S2 | `PTT OR Thailand/` |
| `ca-bangchak` | Bangchak Corporation | Energy | THB 15–25M | S3 | `Bangchak Corporation/` |
| `ca-kbank` | Kasikornbank | Green Finance | THB 5–10M | S4 | `KBANK Green Finance/` |
| `ca-scb` | SCB / SCB X | Green Finance | THB 3–8M | S4 | `SCB Green Finance/` |
| `ca-bbl` | Bangkok Bank | Green Finance | THB 3–6M | S4 | `BBL Green Finance/` |
| `ca-wha` | WHA Group | Industrial | THB 8–15M | S7 | `WHA Group/` |

**Sub-agent outputs per company** (synced weekly to GDrive):

| Sub-Agent | Action | GDrive File |
|-----------|--------|-------------|
| Marketing | `scan-company-intel` | `{Company}-Marketing-Strategy.md` |
| Sales | `update-pipeline` | `{Company}-Sales-Pipeline.md` |
| Docs | `sync-gdrive` | `{Company}-Strategy-Master.md` |

---

## 2. CoWork Teams

| # | Team | ID | Lead | Strategy Agents | Ops Agents | Workflows |
|---|------|----|------|-----------------|------------|-----------|
| 1 | Growth Engine | `growth` | S1 | S1, S2, S6 | O3, O2 | `wf-lead-to-client` |
| 2 | Service Delivery | `delivery` | O1 | S7, S3 | O1, O2, O4, O6, O7 | `wf-mission-prep`, `wf-preflight-to-mission`, `wf-post-mission` |
| 3 | Compliance & Safety | `compliance` | O4 | S7 | O4, O1, O6 | `wf-incident-response`, `wf-maintenance-auto`, `wf-cert-expiry` |
| 4 | Market Intelligence | `intelligence` | S1 | S1, S2, S3 | O3, O7 | — |
| 5 | Ecosystem Builder | `ecosystem` | S2 | S2, S3, S5, S6 | O3, O2 | `wf-lead-to-client` |
| 6 | Revenue Operations | `revenue` | O5 | S4, S5, S6 | O5, O3, O2 | `wf-delivery-to-payment`, `wf-overdue-collection` |

---

## 3. Weekly Schedule (20 Routines, 107 Tasks)

All routines have structured prompts in `src/workflows/routine-prompts.ts`. Each task prompt tells the executing agent exactly what to produce — structured tables, action flags, KPI comparisons.

### Monday (3 routines, 12 tasks)

| Time | Routine | Teams | What Happens |
|------|---------|-------|--------------|
| 09:00 | Weekly Market Scan | Intelligence, Growth | Scan sectors, rank by revenue, route to IFS/Direct, check equity milestones |
| 10:00 | Capacity Planning | Delivery, Compliance | Demand forecast, maintenance review, cert audit, crew assignment |
| 11:00 | Client Onboarding | Growth, Delivery | Welcome sequences, site assessments, proposal→contract conversion |

### Tuesday (4 routines, 25 tasks)

| Time | Routine | Teams | What Happens |
|------|---------|-------|--------------|
| 09:00 | Partner Pipeline | Ecosystem | Review partnerships, update IFS equity, Smart Green adoption, new targets |
| 09:30 | Company Marketing Scans | Growth, Ecosystem, Intelligence | 13 company agents scan targets → GDrive sync |
| 11:00 | ESG Tracking | Ecosystem, Compliance | GRESB indicators (PE1–PE5), GHG reduction, T-VER credits, compliance matrix |
| 14:00 | Sales Grooming | Growth, Revenue | Score accounts, flag stalled >72h, generate proposals, update playbooks |

### Wednesday (4 routines, 15 tasks)

| Time | Routine | Teams | What Happens |
|------|---------|-------|--------------|
| 08:00 | Safety Review | Compliance | WTD incidents, pre-flight analysis, pilot check, CAAT compliance gaps |
| 10:00 | Fleet Optimization | Delivery | Utilization analysis, maintenance scheduling, mission efficiency |
| 11:00 | Shell IoT Health | Delivery, Ecosystem | 400-station sensor check, HMAC-SHA256 provenance, offline flags, edge uptime |
| 14:00 | Recurring Scheduling | Delivery, Revenue | Active contracts, next-month slots, retention rate, renewal pipeline |

### Thursday (3 routines, 12 tasks)

| Time | Routine | Teams | What Happens |
|------|---------|-------|--------------|
| 09:00 | Revenue Review | Revenue, Growth | WTD revenue, collections, deal guardrails, carbon credits, NPS |
| 11:00 | ESG Report Prep | Ecosystem, Revenue | Per-mission certificates, client reports, carbon revenue, disclosure deadlines |
| 14:00 | Data Quality Audit | Delivery | 4-copy backup compliance, QA pass rate, ESG certificate status |

### Friday (4 routines, 34 tasks)

| Time | Routine | Teams | What Happens |
|------|---------|-------|--------------|
| 09:00 | KPI Aggregation | All 6 teams | All 7 ops agents report KPIs (fleet, safety, revenue, CRM, pilots, data, jobs) |
| 10:00 | Company Sales + Docs | Growth, Ecosystem, Revenue, Intelligence | 13 company sales pipelines + all strategy docs → GDrive sync |
| 11:00 | Shell Revenue Report | Revenue, Ecosystem | Base/Standard/Premium tier tracking, upsell candidates, 7 value layers |
| 17:00 | Report Distribution | All 6 teams | Push to 8 platforms: Notion, Asana, Airtable, Supabase, Gamma, Canva, GDrive, Email |

### Weekend (2 routines, 9 tasks)

| Time | Routine | Teams | What Happens |
|------|---------|-------|--------------|
| Sat 08:00 | Fleet & Sensor Monitoring | Delivery, Compliance | Fleet snapshot, sensor sync, S3 Object Lock health, emergency readiness |
| Sun 18:00 | Pre-Week Sync | Delivery, Intelligence | IoT upload verification, dashboard prep, market pre-load, Monday schedule |

**Plus**: Daily Ops Briefing runs weekdays 08:00 — 7 agents parallel via `/cowork daily-ops`

---

## 4. Automation

### Triggers (24/7)

| Trigger | Interval | Agent | Monitors |
|---------|:--------:|-------|----------|
| `trig-fleet-health` | 5 min | O1 | Drone availability, battery, maintenance alerts |
| `trig-data-queue` | 5 min | O7 | Processing backlog, flag jobs >48h |
| `trig-safety-stats` | 10 min | O4 | Incident counts, pre-flight pass rates |
| `trig-overdue-invoices` | 15 min | O5 | Past-due invoices, escalation triggers |
| `trig-crm-pipeline` | 20 min | O3 | Lead aging, stage bottlenecks, stalled >72h |
| `trig-cert-check` | 30 min | O6 | Cert expiry, auto-ground enforcement |

### Workflows (10 Core)

| Trigger Event | Workflow | Pipeline |
|---------------|----------|----------|
| Lead created | `wf-lead-to-client` | O3 qualify → O2 create job |
| Job contracted | `wf-mission-prep` | O4 risk → weather → O1 drone → O6 pilot → O2 advance |
| Pre-flight passes | `wf-preflight-to-mission` | O4 clear → O1 launch |
| Mission completes | `wf-post-mission` | O1 release → O7 data job → 4 backups → process → QA |
| Data QA passes | `wf-delivery-to-payment` | O7 deliver → O5 invoice → send |
| Invoice overdue | `wf-overdue-collection` | O5 pull overdue → escalate |
| Safety incident | `wf-incident-response` | O4 → O1 fleet check → O6 cert check |
| Maintenance due | `wf-maintenance-auto` | O1 ground → schedule |
| Cert expiring | `wf-cert-expiry` | O6 audit → O4 safety review |
| Platform start | `wf-cowork-daily-briefing` | 7 agents report in parallel |

### Connected Apps (9 Automations)

| Trigger | Gmail | Calendar |
|---------|-------|----------|
| Lead qualified | Welcome email | Intro meeting |
| Pre-flight passes | Crew briefing | Mission block |
| Invoice created | Invoice to client | Payment due date |
| Incident reported | URGENT alert | Review meeting |
| Cert <30 days | Warning email | Training deadline |
| Invoice >30 days | Reminder email | — |
| Daily ops complete | Summary email | — |
| Friday 17:00 | Weekly report | — |
| Drone grounded | Maintenance notice | Maintenance block |

---

## 5. Delivery Pipeline

```
TRIGGER                          EXECUTION                        OUTPUT
─────────────────────────────────────────────────────────────────────────────
6 Triggers (24/7)  ──┐
20 Routines (weekly) ─┤─→ EventBus ─→ WorkflowEngine ─→ Agents ─→ Results
46 Event types ───────┤              ├─→ OperationsBrain          ├─→ Supabase (real-time)
5 CoWork commands ────┘              └─→ Connected Apps            ├─→ Google Drive (39 files)
                                         (Gmail + Calendar)        ├─→ 8 platforms (Friday)
                                                                   └─→ Supervisor ratings
```

### Weekly GDrive Sync

- **Tuesday 09:30**: 13 marketing scans → `{Company}-Marketing-Strategy.md`
- **Friday 10:00**: 13 sales pipelines → `{Company}-Sales-Pipeline.md` + 13 strategy masters synced

### Friday Report Distribution (17:00)

| Platform | Format | Content |
|----------|--------|---------|
| Notion | Markdown page | Full ops report — KPIs, alerts, agent status |
| Asana | Markdown + JSON | Team tasks — completed + next week |
| Airtable | JSON records | KPI snapshot — all metrics by team |
| Supabase | JSON (real-time) | Dashboard — agent health, KPIs, decisions |
| Gamma | Markdown slides | Weekly presentation for management |
| Canva | Markdown | Pitch content with latest numbers |
| Google Drive | Markdown file | Master weekly report + company strategies |
| Email | HTML | Summary to Matthew, Thanvarat, Krit |

---

## 6. KPI Targets

| KPI | Agent | Target | Frequency |
|-----|-------|--------|-----------|
| Fleet Utilization | O1 | >=70% | Weekly (Wed) |
| Fleet Availability | O1 | >=90% | Daily |
| Pre-flight Pass Rate | O4 | >=95% | Weekly (Wed) |
| Days Without Incident | O4 | 365 continuous | Daily |
| Gross Revenue | O5 | THB 180.18M/yr | Weekly (Thu) |
| EBITDA Margin | O5 | >=77.7% | Weekly (Thu) |
| Invoice DSO | O5 | <=30 days | Weekly (Thu) |
| Leads per Week | O3 | >=50 | Weekly (Tue) |
| Conversion Rate | O3 | >=25% | Weekly (Tue) |
| NPS Score | O3 | >=50 | Weekly (Thu) |
| Pilot Cert Compliance | O6 | 100% | Daily (trigger) |
| Backup Compliance | O7 | 100% | Weekly (Thu) |
| QA Pass Rate | O7 | >=97% | Weekly (Thu) |
| GHG Reduction | S3 | >=96% | Weekly (Tue) |
| Carbon Credits | S4 | Active | Weekly (Thu) |

---

## 7. CoWork Commands

| Command | What It Does | Teams | Steps |
|---------|-------------|-------|:-----:|
| `/cowork daily-ops` | Morning briefing — all teams report status, KPIs, blockers | 4 teams parallel | 6 |
| `/cowork full-cycle` | End-to-end: market scan → qualify → mission → deliver → invoice | 4 teams sequential | 7 |
| `/cowork new-partner` | Evaluate → model financials → pitch → sales playbook | 3 teams sequential | 5 |
| `/cowork scale-up` | Demand forecast → capacity gap → hiring → capex → partners | 5 teams sequential | 5 |
| `/cowork smart-green` | Site assessment → BMS integration → telemetry → ESG baseline | 4 teams sequential | 5 |

---

## 8. Integrations

| Platform | Module | Purpose | Auth |
|----------|--------|---------|------|
| Google Drive | `gdrive.ts` | Company strategy docs, weekly reports | `GDRIVE_ACCESS_TOKEN` |
| Notion | `notion.ts` | Workspace pages, agent snapshots, KPI DB | `NOTION_API_KEY` |
| Asana | `asana.ts` | Project/task management per team | `ASANA_ACCESS_TOKEN` |
| Airtable | `airtable.ts` | Agent status records, KPI snapshots | `AIRTABLE_API_KEY` + `AIRTABLE_BASE_ID` |
| Supabase | `supabase.ts` | Real-time dashboard, telemetry, decisions | `SUPABASE_URL` + `SUPABASE_ANON_KEY` |
| Gamma | `gamma.ts` | AI pitch decks, investor reports, ESG decks | `GAMMA_API_KEY` |
| Canva | `canva.ts` | Pitch content, branded presentations | `CANVA_ACCESS_TOKEN` |
| LINE | `line-connector.ts` | Thai customer messaging (in-memory) | None |
| Odoo | `external-systems.ts` | ERP — contacts, invoices, inventory | Hardcoded defaults |
| AWS S3 | `external-systems.ts` | Data storage, Object Lock (7yr GOVERNANCE) | Hardcoded defaults |
| DJI FlightHub | `external-systems.ts` | Fleet telemetry, flight plans | Hardcoded defaults |

---

## 9. Supervisor

Rates every agent on each scan:

| Rating | Rule |
|--------|------|
| **excellent** | Completion rate >=95% |
| **good** | Completion rate >=80% |
| **needs-attention** | Offline OR completion <80% |
| **critical** | Error state OR >5 errors |

**System health**: healthy → degraded (>2 need attention) → warning (any critical) → critical (>2 critical)

---

## 10. Source Files

| File | What |
|------|------|
| `src/agents/base-agent.ts` | Abstract `KtvAgent` base class |
| `src/agents/fleet-management.ts` | O1 |
| `src/agents/job-lifecycle.ts` | O2 |
| `src/agents/crm-sales.ts` | O3 |
| `src/agents/safety-compliance.ts` | O4 |
| `src/agents/finance-invoicing.ts` | O5 |
| `src/agents/pilot-operations.ts` | O6 |
| `src/agents/data-processing.ts` | O7 |
| `src/agents/orchestrator.ts` | Message routing, health checks (60s) |
| `src/agents/supervisor.ts` | Productivity monitoring, ratings, alerts |
| `src/agents/company-agents.ts` | 13 company agents, 39 sub-agents |
| `src/agents/index.ts` | All exports (core + company) |
| `src/mastermind/main.py` | S1–S7 strategy agents (Python) |
| `src/mastermind/orchestrator.py` | Parallel strategy orchestration |
| `src/workflows/cowork.ts` | Teams, commands, routines, report tracker |
| `src/workflows/routine-prompts.ts` | 20 routine prompts, 107 task prompts |
| `src/workflows/connected-apps.ts` | Gmail/Calendar templates, 9 automations |
| `src/workflows/definitions.ts` | 10 core workflow definitions |
| `src/workflows/triggers.ts` | 6 automated triggers |
| `src/workflows/brain.ts` | OperationsBrain — decision engine |
| `src/workflows/engine.ts` | WorkflowEngine — step execution |
| `src/workflows/event-bus.ts` | EventBus — 46 event types, pub/sub |
| `src/integrations/gdrive.ts` | Google Drive client |
| `docs/COWORK.md` | Full CoWork upload reference |

---

## Quick Start

```bash
npm run start              # Platform + all agents + triggers
npm run build              # tsc → dist/
npm test                   # 94/94 tests
npm run lint               # tsc --noEmit (type check only)

claude -p '/cowork daily-ops'
claude -p '/cowork full-cycle'
```
