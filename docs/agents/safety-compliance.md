# KTV Safety & Compliance — Agent Skills

**Agent ID:** `safety-compliance`
**Team:** Compliance & Safety
**Brain Layer:** Operational (Layer 1)

---

## Core Capabilities

| Skill | Action | Trigger |
|-------|--------|---------|
| Assess Risk | `assess-risk` | Job contracted |
| Check Weather | `check-weather` | Mission prep |
| Submit Preflight | `submit-preflight` | Pre-flight stage |
| Get Safety Stats | `get-safety-stats` | Every 600s + daily ops |

## CAAT Regulatory Limits (Hard-coded)

```
Max altitude:      90 m AGL
Airport buffer:    9 km radius
Min visibility:    5 km
Max wind speed:    8 m/s
NOTAM:             Required for all urban missions
Night operations:  Prohibited without special permit
```

**Any breach = immediate mission abort + CAAT notification**

## Risk Assessment Matrix

| Likelihood | Severity | Rating | Action |
|-----------|----------|--------|--------|
| 1 | 1-2 | Low | Standard pre-flight |
| 2 | 3 | Medium | Enhanced checklist + spotter |
| 3 | 4+ | High | Management sign-off required |
| Any | 5 | Critical | Mission cancelled |

## Pre-flight Checklist (All Must Pass)

1. Airframe integrity ✓
2. Battery state (>80% per pack) ✓
3. Payload mounted and secured ✓
4. Airspace clearance (NOTAM filed) ✓
5. Weather checked (wind <8 m/s, visibility >5 km) ✓
6. Communication systems (RC + backup) ✓

**Pre-flight pass rate target: ≥95%**

## Workflow Interactions

- **WORKFLOW_MISSION_PREP** step 1: risk assessment → `safety.risk.assessed`
- **WORKFLOW_MISSION_PREP** step 2: weather check (onFailure: skip — mission continues if API unavailable)
- **WORKFLOW_PREFLIGHT_TO_MISSION** step 1: full preflight checklist → `mission.preflight.passed`
- **WORKFLOW_INCIDENT_RESPONSE** step 1: pulls safety stats after incident
- **WORKFLOW_CERT_EXPIRY** step 2: triggers safety review
- **WORKFLOW_DAILY_OPS** step 4: safety compliance overview

## Self-Improvement Loop

```
Every 600 seconds (Safety Stats Aggregator):
  1. Tally all preflight results (pass/fail)
  2. Calculate checklistPassRate
  3. Count incidents by type/severity
  4. Compute daysWithoutIncident
  5. Compare vs CAAT reporting thresholds
  6. Emit stats to Brain for GHG + ESG reporting
  7. Log: incidents / pass rate / assessments completed
```

## Automation Triggers

- `safety.incident.reported` → Gmail: URGENT email to all leadership (Matthew, Thanvarat, Krit)
- `mission.preflight.passed` → Gmail: crew briefing email
- `mission.preflight.passed` → Calendar: mission block for Krit
- `pilot.certification.expiring` → Gmail: expiry warning + Calendar deadline

## GHG & Climate Act Integration

Safety stats feed GHG reporting:
- Flight hours → emissions calculation (kWh × 0.4999 kgCO2/kWh)
- Baseline avoided emissions tracked per mission
- CAAT data → T-VER verification documentation
- All missions timestamped for TGO registry

## Key Metrics

| KPI | Target | Zero Tolerance |
|-----|--------|----------------|
| Safety Incidents | 0 | Any incident triggers emergency response |
| Preflight Pass Rate | ≥95% | Below 90% = operations review |
| Days Without Incident | 365 continuous | Reset on any incident |
| Risk Assessments | 100% coverage | No job launches without RA |

## Decisions the Agent Makes Autonomously

1. **GO/NO-GO**: weather + checklist determines mission authorization
2. **Incident severity**: classifies and routes to correct response level
3. **CAAT filing**: auto-flags when NOTAM required
4. **Emergency halt**: can broadcast halt to all active missions

---
_KTV Safety & Compliance — CAAT Certified | Zero Work-at-Height Target_
