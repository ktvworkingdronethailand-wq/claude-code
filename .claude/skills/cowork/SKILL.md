---
name: cowork
description: "KTV Working Drone Thailand unified agent team coordination. Orchestrates 14 AI agents across 6 specialist teams for end-to-end drone FM operations, market intelligence, revenue management, and Smart Green platform deployment."
version: 2.0.0
category: orchestration
tags:
  - ktv
  - cowork
  - agents
  - teams
  - orchestration
  - drone
  - fm
author: KTV Mastermind
---

# CoWork — Unified Agent Team Coordination

## Overview

CoWork coordinates 14 AI agents organized into 6 specialist teams for KTV Working Drone Thailand's drone-enabled facility management operations. It bridges the Strategy Layer (Mastermind) and Operations Layer into automated professional teams.

**14 Agents | 6 Teams | 5 Commands | 11 Workflows | 9 Automations | 2 Connected Apps**

## Usage

```
/cowork                  — Show team roster and available commands
/cowork quickstart       — Full copy-paste onboarding brief for all agents
/cowork teams            — Show all 6 teams with agents and KPIs
/cowork stats            — Show agent and team statistics
/cowork full-cycle       — End-to-end: market > qualify > mission > deliver > pay
/cowork new-partner      — Evaluate, pitch, and onboard a new partnership
/cowork daily-ops        — Morning briefing across all teams
/cowork scale-up         — Capacity expansion: market > fleet > pilots > finance
/cowork smart-green      — Deploy Smart Green to a new site or portfolio
/cowork growth           — Drill into Growth Engine team
/cowork delivery         — Drill into Service Delivery team
/cowork compliance       — Drill into Compliance & Safety team
/cowork intelligence     — Drill into Market Intelligence team
/cowork ecosystem        — Drill into Ecosystem Builder team
/cowork revenue          — Drill into Revenue Operations team
/cowork apps             — Show connected apps, team contacts, and 9 automations
/cowork automations      — Same as /cowork apps
/cowork connected        — Same as /cowork apps
```

## Instructions

When the user invokes `/cowork` with any argument, execute the matching command by running the Python cowork module. Follow these steps:

### Step 1: Parse the argument

The user's argument (after `/cowork`) determines which function to call:

| Argument | Action |
|----------|--------|
| *(empty)* or `help` | Show team roster |
| `quickstart` | Generate full onboarding brief |
| `teams` | Show team roster |
| `stats` | Show agent and team statistics |
| `full-cycle` | Run full business cycle command |
| `new-partner` | Run new partner onboarding command |
| `daily-ops` | Run daily operations briefing command |
| `scale-up` | Run scale-up planning command |
| `smart-green` | Run Smart Green rollout command |
| `growth` | Show Growth Engine team details |
| `delivery` | Show Service Delivery team details |
| `compliance` | Show Compliance & Safety team details |
| `intelligence` | Show Market Intelligence team details |
| `ecosystem` | Show Ecosystem Builder team details |
| `revenue` | Show Revenue Operations team details |

### Step 2: Execute the command

Run the cowork handler via Python:

```bash
cd /home/user/claude-code && python -c "from src.mastermind.cowork import handle_cowork; print(handle_cowork('ARGUMENT'))"
```

Replace `ARGUMENT` with the user's argument (lowercase, trimmed).

### Step 3: Display the result

Show the output directly to the user. The output is pre-formatted text with box-drawing characters and alignment.

### Step 4: For workflow commands, activate agents

When executing a **workflow command** (`full-cycle`, `new-partner`, `daily-ops`, `scale-up`, `smart-green`), after displaying the execution plan, activate the relevant agents by spawning them as sub-agents. The execution plan lists the teams and steps involved.

**Agent activation for each command:**

#### `/cowork full-cycle`
Teams: Intelligence > Growth > Delivery > Revenue (sequential)
1. Market Intelligence: `market_intelligence_strategist` scans opportunities
2. Partner Strategy: `partner_strategy_architect` routes to IFS or Direct KTV
3. Sales + CRM: `sales_playbook_account_selector` qualifies leads
4. Finance: `financial_model_capital_planner` validates deal economics
5. Operations: `operations_compliance_mission_planner` assesses feasibility
6. Delivery: Execute mission and process data via `fleet-management` + `job-lifecycle`
7. Revenue: Invoice and collect via `finance-invoicing`

#### `/cowork new-partner`
Teams: Intelligence > Ecosystem > Revenue (sequential)
1. Market Intelligence: `market_intelligence_strategist` analyses partner segment
2. Partner Strategy: `partner_strategy_architect` evaluates partnership & JV implications
3. Finance: `financial_model_capital_planner` models financial impact
4. Deal Design: `deal_design_pitch_engineer` generates pitch materials
5. Sales: `sales_playbook_account_selector` builds sector playbook

#### `/cowork daily-ops`
Teams: Compliance + Delivery + Revenue + Growth (parallel)
All steps run in parallel:
- Safety & compliance status (`safety-compliance`)
- Fleet readiness (`fleet-management`)
- Pilot availability (`pilot-operations`)
- Revenue snapshot (`finance-invoicing`)
- Pipeline status (`crm-sales`)
- Data queue (`data-processing`)

#### `/cowork scale-up`
Teams: Intelligence > Delivery > Compliance > Revenue > Ecosystem (sequential)
1. Demand forecast by segment (`market_intelligence_strategist`)
2. Fleet & pilot capacity gaps (`operations_compliance_mission_planner` + `fleet-management`)
3. Pilot hiring plan (`pilot-operations`)
4. Capex & ROI model (`financial_model_capital_planner`)
5. Partner expansion (`partner_strategy_architect`)

#### `/cowork smart-green`
Teams: Ecosystem > Delivery > Compliance > Intelligence (sequential)
1. Site assessment (`smart_green_product_orchestrator`)
2. BMS/CMMS integration design (`smart_green_product_orchestrator`)
3. Drone ops feasibility (`operations_compliance_mission_planner`)
4. ESG telemetry config (`smart_green_product_orchestrator`)
5. ESG baseline establishment (`smart_green_product_orchestrator`)

## The 6 Teams

### Team 1: Growth Engine
- **Mission**: Find, qualify, route market opportunities through IFS or Direct KTV
- **Lead**: `market_intelligence_strategist`
- **Strategy**: market_intelligence + partner_strategy + sales_playbook
- **Operations**: crm-sales + job-lifecycle
- **KPIs**: leads/week, conversion rate, pipeline value, channel split

### Team 2: Service Delivery
- **Mission**: Execute drone missions end-to-end with zero safety incidents
- **Lead**: `operations_compliance_mission_planner`
- **Strategy**: operations_compliance + smart_green_product
- **Operations**: fleet-management + job-lifecycle + pilot-operations + safety-compliance + data-processing
- **KPIs**: missions/week, sqm cleaned, safety incidents (0), on-time rate

### Team 3: Compliance & Safety
- **Mission**: Maintain zero incidents, CAAT compliance, fleet readiness
- **Lead**: `operations_compliance_mission_planner`
- **Strategy**: operations_compliance
- **Operations**: safety-compliance + fleet-management + pilot-operations
- **KPIs**: incidents (0), pre-flight pass rate (>95%), fleet availability

### Team 4: Market Intelligence
- **Mission**: Real-time market analysis, competitor tracking, strategic recs
- **Lead**: `market_intelligence_strategist`
- **Strategy**: market_intelligence + partner_strategy + smart_green_product
- **Operations**: crm-sales + data-processing
- **KPIs**: TAM/SAM accuracy, scored pipeline, competitive intel

### Team 5: Ecosystem Builder
- **Mission**: Build IFS partnership, Smart Green integrations, new channels
- **Lead**: `partner_strategy_architect`
- **Strategy**: partner_strategy + deal_design + smart_green_product + sales_playbook
- **Operations**: crm-sales + job-lifecycle
- **KPIs**: IFS milestones (32M>64M>160M), integrated sites, partner score

### Team 6: Revenue Operations
- **Mission**: Maximise revenue, healthy margins, timely collections
- **Lead**: `financial_model_capital_planner`
- **Strategy**: financial_model + deal_design + sales_playbook
- **Operations**: finance-invoicing + crm-sales + job-lifecycle
- **KPIs**: revenue vs 180.18M target, EBITDA >55%, collection rate, DSO

## Core Rules (Every Agent Must Follow)

1. Always act in KTV's strategic interest — protect brand, data moat, IFS
2. Prefer simple, high-ROI, low-risk paths over complicated options
3. Respect the JV: KTV 50% control, IFS up to 50% via milestones
4. Smart Green is the moat — never weaken the data layer
5. Safety is non-negotiable — zero work-at-height incidents
6. Never invent financial numbers — source from the financial model
7. All FM opportunities route through IFS (non-FM = Direct KTV)
8. Never violate CAAT regulations
9. Never approve deals that breach financial guardrails
10. Combine agent results into coherent, actionable outputs

## Financial Guardrails (NEVER BREACH)

- Payback must be < 18 months (target < 12)
- EBITDA margin must be > 40% (healthy > 55%)
- Price must not fall below 27 THB/sqm
- Minimum order: 20,000 sqm
- NPV must be positive at 10% discount rate
- No fleet overcommit (>2000 drone-hours/year per deal needs dedicated alloc)

## Channel Routing

- FM scope (facade, window, solar, inspection via FM) -> Route through IFS
- Non-FM (agriculture, media, survey, training academy) -> Direct KTV

## Connected Apps & Automations

CoWork integrates with Gmail and Google Calendar to automate communications and scheduling.

**Connected Apps:**
- Gmail: `matthew@ktvworkingdronethailand.com`
- Google Calendar: primary (Asia/Bangkok)

**Team Contacts:**
- Matthew Peter James — Managing Director (`matthew@ktvworkingdronethailand.com`)
- Thanvarat K. Agnew — Director (`thanvaratka@ktvworkingdronethailand.com`)
- Krit Jitbanjong — Technical & Safety Manager (`krit.j@ktvworkingdronethailand.com`)

### 9 Active Automations

| # | Automation | Trigger | Apps | Team |
|---|-----------|---------|------|------|
| 1 | Welcome New Leads | `lead.created` | Gmail + Calendar | Growth |
| 2 | Mission Crew Briefing | `mission.preflight.passed` | Gmail + Calendar | Delivery |
| 3 | Site Assessment Scheduling | `job.created` | Calendar | Delivery |
| 4 | Invoice Delivery | `finance.invoice.sent` | Gmail | Revenue |
| 5 | Overdue Invoice Follow-up | `finance.invoice.overdue` | Gmail | Revenue |
| 6 | Safety Incident Alert | `safety.incident.reported` | Gmail | Compliance |
| 7 | Certification Expiry Alert | `pilot.certification.expiring` | Gmail + Calendar | Compliance |
| 8 | Maintenance Calendar Block | `fleet.maintenance.due` | Calendar | Delivery |
| 9 | Daily Ops Email Summary | `system.health.recovered` | Gmail + Calendar | All |

### How Automations Work

When a workflow event fires (e.g., `lead.created`), the connected app automation:

1. **Gmail**: Drafts an email using the matching template (via `gmail_create_draft`)
   - Templates include: lead welcome, mission briefing, invoice, safety alert, cert expiry, daily ops, overdue reminder
2. **Calendar**: Creates a calendar event using the matching template (via `gcal_create_event`)
   - Templates include: mission block, client meeting, site assessment, daily standup, maintenance window, cert deadline

To execute an automation manually, describe the scenario and the agents will use the connected MCP tools directly:
- `"Draft a welcome email for a new lead from Siam Piwat"`
- `"Schedule a site assessment at Icon Siam for next Tuesday"`
- `"Send the daily ops briefing email"`
- `"Create a maintenance window for drone DJI-T50-001"`

## Example Prompts

```
"Design Phase 1 FM rollout with IFS"
"Check economics for Icon Siam facade cleaning — 75,000 sqm at 50 THB/sqm"
"Route this opportunity: PTT refinery inspection, 35,000 sqm"
"Create a one-pager for IFS Thailand MD"
"What's our fleet capacity for Year 1?"
"Prioritise top 5 accounts for Phase 1 pilots"
"Model the financial impact of adding 4 more drones"
"Assess CAAT feasibility for Suvarnabhumi Airport"
```
