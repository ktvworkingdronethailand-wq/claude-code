# KTV CRM & Sales — Agent Skills

**Agent ID:** `crm-sales`
**Team:** Growth Engine
**Brain Layer:** Operational (Layer 1)

---

## Core Capabilities

| Skill | Action | Trigger |
|-------|--------|---------|
| Advance Lead | `advance-lead` | Lead stage progression |
| Get Pipeline | `get-pipeline` | CRM monitor (every 1200s) |
| Record NPS | `record-nps` | Post-delivery |

## Lead Pipeline Stages

```
new → contacted → qualified → proposal → negotiation
→ won → lost → recurring
```

## Channel Routing (CRITICAL RULE)

```
Facility Management (facade, window, solar, inspection via FM)
  → Route through IFS Thailand channel
  → IFS manages client relationship, KTV delivers ops

Non-FM (agriculture, media, survey, training academy)
  → Direct KTV channel
  → KTV manages full relationship
```

## Workflow Interactions

- **WORKFLOW_LEAD_TO_CLIENT** step 1: auto-qualifies lead, advances to `contacted`
- **CONNECTED: Lead Welcome & Meeting Setup**: drafts welcome email + schedules intro meeting
- **WORKFLOW_DAILY_OPS** step 6: morning pipeline overview
- **WORKFLOW_OVERDUE_COLLECTION** step 2: reviews pipeline for affected clients

## Self-Improvement Loop

```
Every 1200 seconds (CRM Pipeline Monitor):
  1. Count leads per stage
  2. Calculate conversion rate (won / total)
  3. Identify leads stalled >72h without activity
  4. Flag low-NPS clients (<50) for recovery action
  5. Emit pipeline health to Brain
  6. Log: total leads / conversion rate / NPS avg
```

## Automation Triggers

- `lead.created` → Gmail: welcome email drafted to prospect
- `lead.created` → Calendar: intro meeting created (Matthew + prospect)
- `lead.qualified` → Calendar: client meeting event
- `finance.invoice.overdue` → Gmail: payment reminder to client

## IFS Green FM Sales Messaging

Target audiences identified in Climate Act config:
1. GRESB-rated investment funds (30+ Thai REITs)
2. SET-listed companies (mandatory ESG disclosure)
3. MNCs with Scope 3 reporting obligations
4. Green building certifications (TREES/LEED/WELL)
5. Government properties (Climate Act compliance)

Active campaigns:
- **Climate Act Readiness** — "Is your FM ready for Thailand's carbon tax?"
- **Carbon Credit Generator** — "Turn drone cleaning into T-VER credits"
- **Green Building Accelerator** — "Maintain certifications with 96% lower GHG"
- **ESG Investor Report** — "Automated ESG reporting for asset managers"

## Key Metrics

| KPI | Target | Action if Below |
|-----|--------|-----------------|
| Total Leads | ≥50/week | Activate campaigns |
| Conversion Rate | ≥25% | Review follow-up cadence |
| NPS Score | ≥50 | Client satisfaction interviews |
| IFS Pipeline % | ≥60% | Strengthen IFS channel |

## Decisions the Agent Makes Autonomously

1. **Lead scoring**: ranks by segment (FM > non-FM), size, urgency
2. **Channel routing**: auto-assigns IFS or Direct KTV based on service line
3. **Follow-up timing**: suggests next contact based on stage age
4. **NPS action**: flags recovery needed below threshold

---
_KTV CRM & Sales — IFS Channel | Green FM Pipeline | NPS Tracking_
