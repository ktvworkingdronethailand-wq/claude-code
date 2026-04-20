# KTV Job Manager — Agent Skills

**Agent ID:** `job-lifecycle`
**Team:** Service Delivery
**Brain Layer:** Operational (Layer 1)

---

## Core Capabilities

| Skill | Action | Trigger |
|-------|--------|---------|
| Create Job | `create-job` | `lead.created` → workflow |
| Advance Stage | `advance-stage` | Preflight pass, mission complete |
| Get Pipeline Summary | `get-pipeline-summary` | Daily ops, brain health check |

## 13-Stage Job Lifecycle

```
enquiry → qualified → proposal → contract
→ planning → pre-flight → mission
→ data-processing → qa → delivery
→ invoiced → paid → completed
```

Every stage transition:
- Emits an event to the EventBus
- Triggers relevant downstream workflows
- Records actor + timestamp + notes

## Workflow Interactions

- **WORKFLOW_LEAD_TO_CLIENT** step 2: creates job from qualified lead
- **WORKFLOW_MISSION_PREP** step 5: advances job to `pre-flight`
- **WORKFLOW_PREFLIGHT_TO_MISSION** step 2: advances to `mission` if preflight passed
- **WORKFLOW_POST_MISSION** step 7: advances to `data-processing`
- **WORKFLOW_DELIVERY_TO_PAYMENT** steps: advances through delivery → invoiced

## Self-Improvement Loop

```
Every job completion:
  1. Calculate actual cycle time vs 3.2-day target
  2. Identify stage where job spent most time (bottleneck)
  3. Emit bottleneck data to Brain for analysis
  4. Update stageBottleneck metric
  5. Log: jobs active / completed / avg cycle time
```

## Automation Triggers

- `job.created` → Site Assessment calendar event auto-created
- `job.stage.changed` (→ contract) → Mission Prep workflow fires
- `job.stage.changed` (→ pre-flight) → Preflight-to-Mission workflow fires

## Key Metrics

| KPI | Target | Action if Off |
|-----|--------|---------------|
| Active Jobs | Capacity based | Scale pilot/fleet |
| Avg Cycle Time | ≤3.2 days | Identify bottleneck stage |
| Stage Bottleneck | none | Resolve blocker |

## Connected App Integration

- `job.created` → Calendar: 3-hour site assessment visit scheduled
- `job.created` attendees: Krit + Matthew
- Site location auto-populated from client record

## Decisions the Agent Makes Autonomously

1. **Stage eligibility**: validates all prerequisites before advancing
2. **Bottleneck detection**: flags jobs stalled in same stage >24h
3. **Auto-escalation**: notifies brain if job stuck >48h
4. **Pipeline summary**: calculates jobs per stage, cycle time trends

---
_KTV Job Manager — 13-Stage Lifecycle | Full Pipeline Visibility_
