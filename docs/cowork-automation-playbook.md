# KTV CoWork — Unified Agent Automation Playbook

**14 Agents | 6 Teams | 15 Workflows | 6 Triggers | 9 Automations | 5 Commands**

This file is the master reference for all KTV agents and their automated coordination. Every agent, workflow, trigger, and automation listed here is implemented in code and runs without human intervention once the platform starts.

---

## How It Works

```
/cowork → CoworkOrchestrator activates teams
           ↓
  Strategy Layer (7 Mastermind agents) — plans, analyzes, decides
           ↓
  Operations Layer (7 KTV agents) — executes, monitors, reports
           ↓
  Connected Apps (Gmail + Calendar) — emails, events, alerts
           ↓
  Automated Reporting (8 platforms) — distributes KPIs, reports, dashboards
```

Start the system: `npm run start` → `KtvPlatform.start()` → all agents initialize, brain starts, triggers activate.

---

## Team 1: Growth Engine

**Mission**: Identify, qualify, and route market opportunities through IFS or Direct KTV channels

**Lead**: market_intelligence_strategist

| Role | Agent | What It Does |
|------|-------|-------------|
| Strategy | market_intelligence_strategist | Scans market, identifies opportunities, TAM/SAM/SOM |
| Strategy | partner_strategy_architect | Routes leads to IFS partnership or Direct KTV channel |
| Strategy | sales_playbook_account_selector | Prioritizes accounts, builds sector-specific playbooks |
| Operations | crm-sales | Lead scoring, pipeline tracking, NPS, client segmentation |
| Operations | job-lifecycle | Creates jobs from qualified leads, tracks 13-stage pipeline |

**Automated Workflows**:
- `wf-lead-to-client` — Lead arrives → auto-qualify → create job → onboard client
- `wf-connected-lead-onboard` — Draft welcome email + schedule intro meeting

**Automated Triggers**:
- `trig-crm-pipeline` — Scans CRM pipeline every 20 minutes

**Connected Apps**:
- Gmail: Welcome email to new leads (template: `email-lead-welcome`)
- Calendar: Client introduction meeting (template: `cal-client-meeting`)

**KPIs**:
- New leads per week
- Lead-to-qualified conversion rate
- Pipeline value (THB)
- IFS vs Direct KTV channel split

---

## Team 2: Service Delivery

**Mission**: Execute drone missions from planning through data delivery with zero safety incidents

**Lead**: fleet-management

| Role | Agent | What It Does |
|------|-------|-------------|
| Strategy | operations_compliance_mission_planner | Assesses site feasibility, plans missions, capacity analysis |
| Strategy | smart_green_product_orchestrator | Configures ESG telemetry, Smart Green integration |
| Operations | fleet-management | 16 DJI drones — assignment, utilization, maintenance alerts |
| Operations | job-lifecycle | 13-stage job pipeline from lead-capture to payment |
| Operations | pilot-operations | 10 pilots — scheduling, certifications, performance |
| Operations | safety-compliance | Pre-flight checklists, risk assessment, CAAT compliance |
| Operations | data-processing | 4-copy backup, photogrammetry, QA, client delivery |

**Automated Workflows**:
- `wf-mission-prep` — Job stage changes → 5-step mission preparation pipeline
- `wf-preflight-to-mission` — Pre-flight passes → launch mission
- `wf-post-mission` — Mission completes → 8-step data pipeline
- `wf-connected-mission-brief` — Crew briefing email + mission calendar event

**Automated Triggers**:
- `trig-fleet-health` — Monitors fleet health every 5 minutes
- `trig-data-queue` — Checks data processing queue every 5 minutes

**Connected Apps**:
- Gmail: Mission briefing to crew (template: `email-mission-briefing`)
- Calendar: Mission day event (template: `cal-mission-scheduled`)
- Calendar: Site assessment visit (template: `cal-site-assessment`)
- Calendar: Maintenance window (template: `cal-maintenance-window`)

**KPIs**:
- Missions completed per week
- Sqm cleaned/inspected
- Safety incidents (target: 0)
- On-time delivery rate
- Data backup compliance (target: 100%)

---

## Team 3: Compliance & Safety

**Mission**: Maintain zero safety incidents, CAAT compliance, and fleet readiness at all times

**Lead**: safety-compliance

| Role | Agent | What It Does |
|------|-------|-------------|
| Strategy | operations_compliance_mission_planner | CAAT regulatory compliance, mission feasibility |
| Operations | safety-compliance | Incident tracking, pre-flight checks, risk assessment |
| Operations | fleet-management | Drone maintenance scheduling, grounding enforcement |
| Operations | pilot-operations | Certification tracking, auto-ground on expiry |

**Automated Workflows**:
- `wf-incident-response` — Safety incident → 3-step emergency response
- `wf-maintenance-auto` — Maintenance due → auto-schedule + ground drone
- `wf-cert-expiry` — Cert expiring → alert + renewal scheduling
- `wf-connected-safety-alert` — Emergency email to all leadership
- `wf-connected-cert-expiry` — Cert warning email + calendar deadline

**Automated Triggers**:
- `trig-cert-check` — Scans pilot certifications every 30 minutes
- `trig-safety-stats` — Aggregates safety statistics every 10 minutes

**Connected Apps**:
- Gmail: Safety incident alert (template: `email-safety-incident`)
- Gmail: Certification expiry warning (template: `email-cert-expiry-warning`)
- Calendar: Cert renewal deadline (template: `cal-cert-renewal`)

**KPIs**:
- Safety incidents (target: 0)
- Pre-flight pass rate (target: >95%)
- Fleet availability rate
- Pilot certification currency
- CAAT compliance status

---

## Team 4: Market Intelligence

**Mission**: Provide real-time market analysis, competitor tracking, and strategic recommendations

**Lead**: market_intelligence_strategist

| Role | Agent | What It Does |
|------|-------|-------------|
| Strategy | market_intelligence_strategist | TAM/SAM/SOM analysis, demand forecasting |
| Strategy | partner_strategy_architect | Partnership evaluation, channel assessment |
| Strategy | smart_green_product_orchestrator | Smart Green adoption tracking, ESG positioning |
| Operations | crm-sales | Client segment data, pipeline intelligence |
| Operations | data-processing | Market data aggregation, analytics |

**KPIs**:
- TAM/SAM/SOM accuracy
- Opportunity pipeline scored and ranked
- Competitive intelligence freshness
- Smart Green adoption rate

---

## Team 5: Ecosystem Builder

**Mission**: Build and maintain the IFS partnership, Smart Green integrations, and new channel development

**Lead**: partner_strategy_architect

| Role | Agent | What It Does |
|------|-------|-------------|
| Strategy | partner_strategy_architect | IFS JV structure, partnership evaluation |
| Strategy | deal_design_pitch_engineer | Pitch decks, proposals, deal materials |
| Strategy | smart_green_product_orchestrator | Smart Green platform integration design |
| Strategy | sales_playbook_account_selector | Account targeting, playbook creation |
| Operations | crm-sales | Partner pipeline management |
| Operations | job-lifecycle | Partner project tracking |

**Automated Workflows**:
- `wf-lead-to-client` — Onboard partners same as clients

**KPIs**:
- IFS equity milestone progress (THB 32M → 64M → 160M)
- Smart Green integrated sites
- Partner satisfaction score
- New partnership proposals delivered

---

## Team 6: Revenue Operations

**Mission**: Maximise revenue, maintain healthy margins, and ensure timely collections

**Lead**: finance-invoicing

| Role | Agent | What It Does |
|------|-------|-------------|
| Strategy | financial_model_capital_planner | Deal economics, ROI models, capex planning |
| Strategy | deal_design_pitch_engineer | Pricing strategy, proposal financials |
| Strategy | sales_playbook_account_selector | Account value ranking, revenue optimization |
| Operations | finance-invoicing | Invoicing, VAT 7%, royalty 7%, collections |
| Operations | crm-sales | Revenue pipeline tracking |
| Operations | job-lifecycle | Job-to-invoice lifecycle |

**Automated Workflows**:
- `wf-delivery-to-payment` — Data QA passes → create invoice → send → collect
- `wf-overdue-collection` — Invoice overdue → escalation workflow
- `wf-connected-invoice-email` — Draft invoice email to client

**Automated Triggers**:
- `trig-overdue-invoices` — Scans for overdue invoices every 15 minutes

**Connected Apps**:
- Gmail: Invoice to client (template: `email-invoice-send`)
- Gmail: Overdue follow-up (template: `email-overdue-followup`)

**KPIs**:
- Gross revenue vs Year 1 target (THB 180.18M)
- EBITDA margin (target: >55%)
- Invoice collection rate
- Days sales outstanding
- IRR tracking

---

## Cross-Team: Daily Operations

**Trigger**: `system.health.recovered` (runs on platform startup and health recovery)

**Connected Apps**:
- Gmail: Daily operations summary (template: `email-daily-ops-summary`)
- Calendar: KTV Daily Standup (template: `cal-daily-standup`)
- Workflow: `wf-daily-ops` — 7-step health check across all agents

---

## All 15 Workflows

| # | ID | Name | Trigger | Steps | Team |
|---|-----|------|---------|-------|------|
| 1 | wf-lead-to-client | Lead Qualification & Onboarding | lead.created | 2 | Growth |
| 2 | wf-mission-prep | Mission Preparation Pipeline | job.stage.changed | 5 | Delivery |
| 3 | wf-preflight-to-mission | Pre-Flight to Mission Launch | job.stage.changed | 2 | Delivery |
| 4 | wf-post-mission | Post-Mission Data Pipeline | mission.completed | 8 | Delivery |
| 5 | wf-delivery-to-payment | Delivery to Payment Collection | data.qa.passed | 3 | Revenue |
| 6 | wf-maintenance-auto | Auto-Maintenance Scheduling | fleet.maintenance.due | 2 | Compliance |
| 7 | wf-incident-response | Incident Emergency Response | safety.incident.reported | 3 | Compliance |
| 8 | wf-overdue-collection | Overdue Invoice Collection | finance.invoice.overdue | 2 | Revenue |
| 9 | wf-cert-expiry | Certification Expiry Handler | pilot.certification.expiring | 2 | Compliance |
| 10 | wf-daily-ops | Daily Operations Health Check | system.health.recovered | 7 | All |
| 11 | wf-connected-lead-onboard | Lead Welcome & Meeting Setup | lead.created | 2 | Growth |
| 12 | wf-connected-mission-brief | Mission Briefing & Calendar | mission.preflight.passed | 2 | Delivery |
| 13 | wf-connected-invoice-email | Invoice Email to Client | finance.invoice.sent | 1 | Revenue |
| 14 | wf-connected-safety-alert | Safety Incident Emergency Alerts | safety.incident.reported | 1 | Compliance |
| 15 | wf-connected-cert-expiry | Certification Expiry Alerts | pilot.certification.expiring | 2 | Compliance |

## All 6 Automated Triggers

| ID | Name | Interval | What It Monitors |
|----|------|----------|-----------------|
| trig-fleet-health | Fleet Health Monitor | 5 min | Drone availability, battery status, maintenance alerts |
| trig-cert-check | Pilot Certification Checker | 30 min | Expiring certifications, auto-ground enforcement |
| trig-overdue-invoices | Overdue Invoice Scanner | 15 min | Past-due invoices, escalation triggers |
| trig-safety-stats | Safety Stats Aggregator | 10 min | Incident counts, pre-flight pass rates |
| trig-data-queue | Data Processing Queue Monitor | 5 min | Processing backlog, QA queue depth |
| trig-crm-pipeline | CRM Pipeline Monitor | 20 min | Lead aging, stage bottlenecks |

## All 9 Connected App Automations

| # | Name | Trigger | Apps | Team |
|---|------|---------|------|------|
| 1 | Welcome New Leads | lead.created | Gmail + Calendar | Growth |
| 2 | Mission Crew Briefing | mission.preflight.passed | Gmail + Calendar | Delivery |
| 3 | Site Assessment Scheduling | job.created | Calendar | Delivery |
| 4 | Invoice Delivery | finance.invoice.sent | Gmail | Revenue |
| 5 | Overdue Invoice Follow-up | finance.invoice.overdue | Gmail | Revenue |
| 6 | Safety Incident Alert | safety.incident.reported | Gmail | Compliance |
| 7 | Certification Expiry Alert | pilot.certification.expiring | Gmail + Calendar | Compliance |
| 8 | Maintenance Calendar Block | fleet.maintenance.due | Calendar | Delivery |
| 9 | Daily Ops Email Summary | system.health.recovered | Gmail + Calendar | All |

## 5 CoWork Commands

Run these from Claude Code with `/cowork`:

### 1. Full Business Cycle
```
/cowork full-cycle
```
End-to-end: market analysis → lead qualification → mission → delivery → payment
- Teams: Intelligence → Growth → Delivery → Revenue
- 7 sequential steps, strategy + operations coordination

### 2. New Partner Onboarding
```
/cowork new-partner
```
Evaluate, pitch, and onboard a new partnership opportunity
- Teams: Intelligence → Ecosystem → Revenue
- 5 steps: market context → partner routing → deal economics → pitch → playbook

### 3. Daily Operations Briefing
```
/cowork daily-ops
```
Morning briefing: all teams report status, KPIs, and blockers
- Teams: Compliance + Delivery + Revenue + Growth (parallel)
- 6 parallel reports: safety, fleet, pilots, finance, pipeline, data queue

### 4. Scale-Up Planning
```
/cowork scale-up
```
Plan capacity expansion: market → fleet → pilots → finance → partnerships
- Teams: Intelligence → Delivery → Compliance → Revenue → Ecosystem
- 5 steps: demand forecast → capacity gap → hiring plan → capex model → partner expansion

### 5. Smart Green Rollout
```
/cowork smart-green
```
Deploy Smart Green Operations platform to a new site or portfolio
- Teams: Ecosystem → Delivery → Compliance → Intelligence
- 5 steps: site assessment → integration design → ops feasibility → telemetry → ESG baseline

## 8-Platform Report Distribution

Every week, `AutomatedReportingOrchestrator` pushes to all 8 platforms in parallel:

| # | Platform | Output | Location |
|---|----------|--------|----------|
| 1 | Notion | Workspace page (markdown) | docs/reports/notion/ |
| 2 | Asana | Team tasks (markdown + JSON) | docs/reports/asana/ |
| 3 | Airtable | KPI snapshot (JSON) | docs/reports/airtable/ |
| 4 | Supabase | Dashboard data (JSON) | docs/reports/supabase/ |
| 5 | Gamma | Presentation slides (markdown) | docs/reports/gamma/ |
| 6 | Canva | Pitch deck content (markdown) | docs/reports/canva/ |
| 7 | Google Drive | Master report (markdown) | docs/reports/gdrive/ |
| 8 | Email | HTML report file | docs/reports/email/ |

## Team Contacts

| Name | Role | Email | Teams |
|------|------|-------|-------|
| Matthew Peter James | Managing Director | matthew@ktvworkingdronethailand.com | Revenue, Growth, Ecosystem |
| Thanvarat K. Agnew | Director | thanvaratka@ktvworkingdronethailand.com | Compliance, Delivery, Ecosystem |
| Krit Jitbanjong | Technical & Safety Manager | krit.j@ktvworkingdronethailand.com | Delivery, Compliance |

## Quick Start

```bash
# Start the platform (all agents auto-initialize)
npm run start

# Run from Claude Code
claude -p '/cowork'

# Run specific command
claude -p '/cowork daily-ops'

# Run full demo with all 8 report platforms
npm run build && node dist/scripts/demo-full-report.js
```

## Source Files

| File | What It Contains |
|------|-----------------|
| src/workflows/cowork.ts | 6 teams, 5 commands, CoworkOrchestrator class |
| src/workflows/connected-apps.ts | 7 email templates, 6 calendar templates, 9 automations |
| src/workflows/definitions.ts | 10 core workflow definitions |
| src/workflows/brain.ts | OperationsBrain — central decision engine |
| src/workflows/engine.ts | WorkflowEngine — register, execute, retry |
| src/workflows/event-bus.ts | EventBus — 46 event types, pub/sub |
| src/workflows/triggers.ts | TriggerManager — 6 interval-based triggers |
| src/agents/*.ts | 7 operational agents + orchestrator |
| src/operations/automated-reporting.ts | 8-platform parallel report distribution |
| src/operations/ktv-platform.ts | KtvPlatform — unified facade, bootstrap |
