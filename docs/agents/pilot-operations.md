# KTV Pilot Operations — Agent Skills

**Agent ID:** `pilot-operations`
**Team:** Service Delivery + Compliance & Safety
**Brain Layer:** Operational (Layer 1)

---

## Core Capabilities

| Skill | Action | Trigger |
|-------|--------|---------|
| Get Available Pilots | `get-available-pilots` | Mission prep, daily ops |
| Check Certifications | `check-certifications` | Every 1800s + incident response |

## Pilot Fleet

- **10 certified pilots** (CAAT Remote Pilot License holders)
- Type ratings: DJI T50, Matrice 350, Phantom 4 RTK
- Minimum: 2 pilots per active mission
- Target utilization: ≥70%

## Certification Management

```
RPL (Remote Pilot License)  — CAAT Thailand — 2-year renewal
Type Ratings                — Per drone model
Medical                     — Annual clearance
Night Operations            — Special CAAT permit
Urban Operations            — Enhanced endorsement
```

**Hard rule: Expired cert = automatic grounding**

## Workflow Interactions

- **WORKFLOW_MISSION_PREP** step 4: `get-available-pilots` → assigns to job
- **WORKFLOW_INCIDENT_RESPONSE** step 3: checks cert status post-incident
- **WORKFLOW_CERT_EXPIRY** step 1: audits all pilot certifications
- **WORKFLOW_CERT_EXPIRY** step 2: triggers safety compliance review
- **WORKFLOW_DAILY_OPS** step 2: morning pilot availability report

## Self-Improvement Loop

```
Every 1800 seconds (Pilot Certification Checker):
  1. Check expiry date for every cert × every pilot
  2. Flag: >90 days until expiry → INFO
  3. Flag: 30-90 days → WARNING → emit `pilot.certification.expiring`
  4. Flag: <30 days → CRITICAL → ground pilot immediately
  5. Recommend renewal schedule + CAAT booking
  6. Log: certificationCompliance % / upcoming renewals
```

## Automation Triggers

- `pilot.certification.expiring` → Gmail: warning to Krit (CC Thanvarat, Matthew)
- `pilot.certification.expiring` → Calendar: renewal deadline event for Krit
- `pilot.assigned` → emitted after assignment

## Performance Tracking

| Metric | Weight | Rating Scale |
|--------|--------|-------------|
| Mission success rate | 40% | 0-100% |
| Safety score | 30% | 0-100 |
| Data quality score | 20% | 0-100% |
| Punctuality | 10% | 0-100% |

Monthly performance review triggers training recommendations.

## Key Metrics

| KPI | Target | Action if Off |
|-----|--------|---------------|
| Certification Compliance | 100% | Ground pilot immediately |
| Pilot Utilization | ≥70% | Adjust scheduling |
| Performance Average | ≥85 | Remedial training |
| Availability per week | ≥8 of 10 pilots | Hiring plan |

## Decisions the Agent Makes Autonomously

1. **Best pilot for job**: matches type rating, availability, performance score
2. **Cert expiry action**: automatic grounding at expiry — no override
3. **Fatigue management**: prevents >8-hour flight days
4. **Training recommendations**: identifies underperforming skills for each pilot

---
_KTV Pilot Operations — 10 CAAT Certified Pilots | Zero Incident Culture_
