# KTV Weekly Scheduled Tasks — All 14 Agents

**Schedule**: Every Monday 08:00 ICT (Asia/Bangkok)
**Duration**: Rolling 7-day cycle, tasks fire continuously via triggers + weekly batch via CoWork
**Report**: Auto-generated every Friday 17:00 ICT → pushed to 8 platforms

---

## Monday — Week Start & Planning

### 08:00 Daily Ops Briefing (All Teams)
**Command**: `/cowork daily-ops`
**Agents**: All 14 (parallel)

| Task | Agent | Action | Output |
|------|-------|--------|--------|
| Safety status check | O4 Safety | `get-safety-stats` | Incidents, pass rate, compliance |
| Fleet readiness report | O1 Fleet | `get-fleet-summary` | Drones available, in-flight, maintenance |
| Pilot availability | O6 Pilots | `get-available-pilots` | Available pilots, cert status |
| Revenue snapshot | O5 Finance | `get-financial-summary` | MTD revenue, outstanding, overdue |
| Pipeline status | O3 CRM | `get-pipeline` | Leads by stage, conversion rate |
| Data queue check | O7 Data | `get-processing-stats` | Queue depth, QA rate, backups |
| Job pipeline summary | O2 Jobs | `get-pipeline-summary` | Active jobs, bottlenecks, cycle time |

### 09:00 Weekly Market Scan (Intelligence Team)
**Agents**: S1 Market Intelligence, S2 Partner Strategy

| Task | Agent | Action |
|------|-------|--------|
| Scan new opportunities by sector | S1 Market Intelligence | `scan-opportunities` |
| Rank opportunities by revenue potential | S1 Market Intelligence | `rank_opportunities` |
| Route new leads to IFS or Direct KTV | S2 Partner Strategy | `route-opportunity` |
| Check IFS equity milestone progress | S2 Partner Strategy | `check_equity_impact` |

### 10:00 Weekly Capacity Planning (Delivery + Compliance)
**Agents**: S7 Ops Compliance, O1 Fleet, O6 Pilots

| Task | Agent | Action |
|------|-------|--------|
| Forecast demand for coming week | S7 Ops Compliance | `capacity-analysis` |
| Review fleet maintenance schedule | O1 Fleet | `get-maintenance-alerts` |
| Check pilot certifications expiry | O6 Pilots | `check-certifications` |
| Plan crew assignments for booked jobs | S7 Ops Compliance | `plan-mission` |

---

## Continuous — Automated Triggers (Run All Week)

These fire automatically at fixed intervals, no manual action needed:

| Trigger | Interval | Agent | What It Does |
|---------|----------|-------|-------------|
| trig-fleet-health | Every 5 min | O1 Fleet | Poll 16 drones, flag battery/maintenance issues |
| trig-data-queue | Every 5 min | O7 Data | Check processing queue, flag >48h jobs |
| trig-safety-stats | Every 10 min | O4 Safety | Aggregate incidents, pre-flight pass rates |
| trig-overdue-invoices | Every 15 min | O5 Finance | Scan overdue invoices, emit collection events |
| trig-crm-pipeline | Every 20 min | O3 CRM | Count leads per stage, flag stalled >72h |
| trig-cert-check | Every 30 min | O6 Pilots | Check all pilot certifications, auto-ground expired |

---

## Continuous — Event-Driven Workflows (Fire on Trigger)

These fire when events occur during the week:

| Event | Workflow | Agents | Steps |
|-------|----------|--------|-------|
| New lead arrives | wf-lead-to-client + wf-connected-lead-onboard | O3 CRM, O2 Jobs | Qualify → create job + Gmail welcome + Calendar meeting |
| Job contracted | wf-mission-prep | O4 Safety, O1 Fleet, O6 Pilots, O2 Jobs | Risk assess → weather → assign drone → assign pilot → advance |
| Pre-flight passes | wf-preflight-to-mission + wf-connected-mission-brief | O4 Safety, O1 Fleet | Launch mission + Gmail briefing + Calendar event |
| Mission completes | wf-post-mission | O7 Data, O1 Fleet | Release drone → create data job → 4 backups → process → QA |
| Data QA passes | wf-delivery-to-payment | O7 Data, O5 Finance | Create delivery → create invoice → send |
| Invoice sent | wf-connected-invoice-email | O5 Finance | Gmail invoice to client |
| Invoice overdue | wf-overdue-collection + Gmail follow-up | O5 Finance | Pull overdue → escalate + Gmail reminder |
| Safety incident | wf-incident-response + wf-connected-safety-alert | O4 Safety, O1 Fleet, O6 Pilots | Safety stats → fleet check → cert check + Gmail URGENT |
| Maintenance due | wf-maintenance-auto | O1 Fleet | Ground drone → schedule maintenance + Calendar block |
| Cert expiring | wf-cert-expiry + wf-connected-cert-expiry | O6 Pilots, O4 Safety | Audit certs → safety review + Gmail + Calendar deadline |

---

## Tuesday — Partner & Ecosystem

### 09:00 Partner Pipeline Review (Ecosystem Team)
**Agents**: S2 Partner Strategy, S6 Sales Playbook, S3 Smart Green

| Task | Agent | Action |
|------|-------|--------|
| Review active partnership proposals | S2 Partner Strategy | `evaluate-partnership` |
| Update IFS equity contribution tracking | S2 Partner Strategy | `check_equity_impact` |
| Review Smart Green adoption progress | S3 Smart Green | `assess-site` status |
| Identify new partnership targets | S6 Sales Playbook | `prioritize-accounts` |

### 14:00 Sales Pipeline Grooming (Growth Team)
**Agents**: S6 Sales Playbook, O3 CRM, S5 Deal Design

| Task | Agent | Action |
|------|-------|--------|
| Score and rank all active accounts | S6 Sales Playbook | `prioritize-accounts` |
| Flag leads stalled >72h | O3 CRM | `get-pipeline` |
| Generate proposals for qualified leads | S5 Deal Design | `generate-proposal` |
| Update sector playbooks with new wins | S6 Sales Playbook | `create-playbook` |

---

## Wednesday — Operations & Safety

### 08:00 Mid-Week Safety Review (Compliance Team)
**Agents**: O4 Safety, O6 Pilots, S7 Ops Compliance

| Task | Agent | Action |
|------|-------|--------|
| Week-to-date incident summary | O4 Safety | `get-safety-stats` |
| Pre-flight failure root cause analysis | O4 Safety | `assess-risk` patterns |
| Pilot performance mid-week check | O6 Pilots | `check-certifications` |
| Compliance gap identification | S7 Ops Compliance | `check_caat` |

### 10:00 Fleet Optimization (Delivery Team)
**Agents**: O1 Fleet, S7 Ops Compliance

| Task | Agent | Action |
|------|-------|--------|
| Drone utilization analysis | O1 Fleet | `get-fleet-summary` |
| Maintenance schedule optimization | O1 Fleet | `get-maintenance-alerts` |
| Battery rotation review | O1 Fleet | internal check |
| Mission efficiency review (sqm/hour) | S7 Ops Compliance | `assess-feasibility` patterns |

---

## Thursday — Revenue & Financial

### 09:00 Revenue Operations Review (Revenue Team)
**Agents**: O5 Finance, S4 Financial Model, O3 CRM

| Task | Agent | Action |
|------|-------|--------|
| Week-to-date revenue tracking | O5 Finance | `get-financial-summary` |
| Invoice collection status | O5 Finance | `get-overdue-invoices` |
| Deal economics validation for pending proposals | S4 Financial Model | `check-guardrails` |
| Carbon credit revenue tracking | S4 Financial Model | `analyze-deal` (carbon) |
| Client NPS review | O3 CRM | `record-nps` summary |

### 14:00 Data Quality Audit (Delivery Team)
**Agents**: O7 Data

| Task | Agent | Action |
|------|-------|--------|
| Review 4-copy backup compliance | O7 Data | `get-processing-stats` |
| QA pass rate analysis | O7 Data | processing stats review |
| Processing time vs target (1.4 day avg) | O7 Data | queue timing analysis |
| ESG certificate generation status | O7 Data | T-VER output check |

---

## Friday — Reporting & Week Close

### 09:00 Weekly KPI Aggregation (All Agents)

The ReportingEngine aggregates data from all 7 operations agents:

| KPI | Source Agent | Target |
|-----|-------------|--------|
| Fleet Utilization | O1 Fleet | ≥70% |
| Fleet Availability | O1 Fleet | ≥90% |
| Missions Completed | O2 Jobs | Based on pipeline |
| Avg Cycle Time | O2 Jobs | ≤3.2 days |
| Preflight Pass Rate | O4 Safety | ≥95% |
| Days Without Incident | O4 Safety | 365 continuous |
| Gross Revenue | O5 Finance | THB 180.18M/yr target |
| EBITDA Margin | O5 Finance | ≥77.7% |
| Invoice DSO | O5 Finance | ≤30 days |
| Total Leads | O3 CRM | ≥50/week |
| Conversion Rate | O3 CRM | ≥25% |
| NPS Score | O3 CRM | ≥50 |
| Pilot Cert Compliance | O6 Pilots | 100% |
| Backup Compliance | O7 Data | 100% |
| QA Pass Rate | O7 Data | ≥97% |

### 14:00 Executive Summary Generation

The brain generates an `ExecutiveSummary` with:
- **Headline**: "All systems normal" or "X alert(s) require attention"
- **Alerts**: Auto-flagged from KPI thresholds (safety <95%, fleet <80%, backup <100%, NPS <50)
- **Recommendations**: Auto-generated actions for each alert

### 17:00 Weekly Report Distribution (8 Platforms)

`AutomatedReportingOrchestrator.pushWeeklyReport()` fires in parallel:

| # | Platform | What Gets Pushed | Format |
|---|----------|-----------------|--------|
| 1 | Notion | Full ops report — KPIs, alerts, agent status | Markdown page |
| 2 | Asana | Team tasks — completed + next week's actions | Markdown + JSON tasks |
| 3 | Airtable | KPI snapshot — all metrics by team | JSON records |
| 4 | Supabase | Dashboard data — agent health, KPIs, decisions | JSON (real-time) |
| 5 | Gamma | Presentation — weekly slides for management | Markdown slides |
| 6 | Canva | Pitch content — updated deck with latest numbers | Markdown content |
| 7 | Google Drive | Master report — complete weekly document | Markdown document |
| 8 | Email | HTML summary — sent to Matthew, Thanvarat, Krit | HTML email file |

Output directory: `docs/reports/{platform}/weekly-YYYY-MM-DD.*`

---

## Saturday/Sunday — Autonomous Monitoring Only

No scheduled team tasks. Automated triggers continue running:
- Fleet health every 5 min
- Data queue every 5 min
- Safety stats every 10 min
- Overdue invoices every 15 min
- CRM pipeline every 20 min
- Cert checks every 30 min

Safety incident workflow fires immediately 24/7 if `safety.incident.reported` event occurs.

---

## Weekly Report Template

The weekly report includes all tasks completed across all 14 agents:

```
KTV WEEKLY OPERATIONS REPORT
Week of: [Monday date] — [Friday date]
Generated: [Friday 17:00 ICT]

═══════════════════════════════════════════
EXECUTIVE SUMMARY
═══════════════════════════════════════════
Headline: [auto-generated from KPI thresholds]
Agents Active: [X]/14
Alerts: [count]

═══════════════════════════════════════════
TASKS COMPLETED THIS WEEK
═══════════════════════════════════════════

GROWTH ENGINE (Team 1)
  □ Monday market scan — [X] opportunities identified
  □ [X] new leads qualified → [Y] routed IFS, [Z] Direct KTV
  □ [X] proposals generated by Deal Design agent
  □ Tuesday pipeline grooming — [X] accounts scored
  □ Pipeline value: THB [amount]
  Leads: [new] → [qualified] → [won] / [lost]

SERVICE DELIVERY (Team 2)
  □ Monday capacity plan — [X] missions scheduled
  □ [X] missions completed / [Y] sqm processed
  □ Fleet utilization: [X]% | Availability: [Y]%
  □ Wednesday fleet optimization — [X] maintenance slots adjusted
  □ Data pipeline: [X] jobs processed, [Y]% QA pass rate
  □ Backup compliance: [X]%

COMPLIANCE & SAFETY (Team 3)
  □ Pre-flight pass rate: [X]%
  □ Safety incidents: [X] (target: 0)
  □ Days without incident: [X]
  □ Wednesday safety review — [X] findings
  □ Pilot certifications: [X]% compliant
  □ CAAT compliance: [status]

MARKET INTELLIGENCE (Team 4)
  □ Monday market scan — [X] sectors analyzed
  □ Top opportunity: [name] — THB [amount]
  □ Competitive intelligence updated

ECOSYSTEM BUILDER (Team 5)
  □ Tuesday partner review — [X] partnerships active
  □ IFS equity progress: THB [amount] / [milestone]
  □ Smart Green sites: [X] integrated
  □ [X] pitch materials generated

REVENUE OPERATIONS (Team 6)
  □ Gross revenue WTD: THB [amount]
  □ EBITDA margin: [X]%
  □ Invoices: [paid] paid / [overdue] overdue
  □ Thursday financials — DSO: [X] days
  □ Carbon credit status: [active/pending]

═══════════════════════════════════════════
CONNECTED APP ACTIVITY
═══════════════════════════════════════════
  Gmail drafts created:     [X]
  Calendar events created:  [X]
  Automations fired:        [X]

  Breakdown:
  - Welcome emails:         [X]
  - Mission briefings:      [X]
  - Invoice emails:         [X]
  - Safety alerts:          [X]
  - Cert warnings:          [X]
  - Overdue reminders:      [X]
  - Daily ops summaries:    [X]

═══════════════════════════════════════════
AUTOMATED TRIGGER ACTIVITY
═══════════════════════════════════════════
  trig-fleet-health:     [X] fires (every 5 min)
  trig-data-queue:       [X] fires (every 5 min)
  trig-safety-stats:     [X] fires (every 10 min)
  trig-overdue-invoices: [X] fires (every 15 min)
  trig-crm-pipeline:     [X] fires (every 20 min)
  trig-cert-check:       [X] fires (every 30 min)
  Total trigger fires:   [X]

═══════════════════════════════════════════
KPI DASHBOARD
═══════════════════════════════════════════

| Team | KPI | Value | Target | Status |
|------|-----|-------|--------|--------|
| Delivery | Fleet Utilization | [X]% | 70% | [status] |
| Delivery | Fleet Availability | [X]% | 90% | [status] |
| Compliance | Preflight Pass Rate | [X]% | 95% | [status] |
| Compliance | Days Without Incident | [X] | 365 | [status] |
| Revenue | Gross Revenue | THB [X]M | 180.18M | [status] |
| Revenue | EBITDA Margin | [X]% | 77.7% | [status] |
| Growth | Total Leads | [X] | 50 | [status] |
| Growth | Conversion Rate | [X]% | 25% | [status] |
| Ecosystem | GHG Reduction | 96% | 90% | on-track |
| Ecosystem | Carbon Credits | Active | Active | on-track |

═══════════════════════════════════════════
ALERTS & ACTIONS
═══════════════════════════════════════════
[Auto-generated alerts from KPI thresholds]
[Auto-generated recommendations]

═══════════════════════════════════════════
REPORT DISTRIBUTION
═══════════════════════════════════════════
  Notion:    ✓ docs/reports/notion/weekly-[date].md
  Asana:     ✓ docs/reports/asana/weekly-[date].md
  Airtable:  ✓ docs/reports/airtable/weekly-[date].json
  Supabase:  ✓ docs/reports/supabase/weekly-[date].json
  Gamma:     ✓ docs/reports/gamma/weekly-[date].md
  Canva:     ✓ docs/reports/canva/weekly-[date].md
  GDrive:    ✓ docs/reports/gdrive/weekly-[date].md
  Email:     ✓ docs/reports/email/weekly-[date].html

— KTV Operations Brain | Automated Weekly Report
```

---

## How to Run

```bash
# Start platform (triggers begin immediately)
npm run start

# Run Monday morning briefing
claude -p '/cowork daily-ops'

# Run full business cycle
claude -p '/cowork full-cycle'

# Generate weekly report manually
npm run build && node dist/scripts/demo-full-report.js

# View latest reports
ls docs/reports/*/weekly-*
```

## Source Files

| File | Purpose |
|------|---------|
| src/workflows/triggers.ts | 6 automated triggers (5-30 min intervals) |
| src/workflows/definitions.ts | 10 core workflow definitions |
| src/workflows/connected-apps.ts | 9 automations, 7 email + 6 calendar templates |
| src/workflows/cowork.ts | 6 teams, 5 commands, session management |
| src/workflows/brain.ts | OperationsBrain — event listeners, decision log |
| src/operations/reporting.ts | ReportingEngine — KPI aggregation, executive summary |
| src/operations/automated-reporting.ts | 8-platform parallel report distribution |
| src/operations/scheduling.ts | SchedulingEngine — slots, recurring, dispatch |
| scripts/demo-full-report.ts | Full proof-of-execution demo |
