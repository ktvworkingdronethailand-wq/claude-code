# KTV Fleet Manager — Agent Skills

**Agent ID:** `fleet-management`
**Team:** Service Delivery + Compliance & Safety
**Brain Layer:** Operational (Layer 1)

---

## Core Capabilities

| Skill | Action | Trigger |
|-------|--------|---------|
| Fleet Summary | `get-fleet-summary` | Daily ops check, health monitor |
| Available Drones | `get-available-drones` | Mission prep, job assignment |
| Assign Drone | `assign-drone` | `fleet.drone.assigned` |
| Release Drone | `release-drone` | Mission complete, maintenance |
| Maintenance Alerts | `get-maintenance-alerts` | Every 300s trigger |

## Fleet Under Management

- **16 DJI Drones**: T50 (cleaning), Matrice 350 (inspection), Phantom 4 RTK (survey)
- **Payloads**: Pressure wash, LiDAR, RGB, multispectral, thermal
- **Tracking**: Flight hours, battery cycles, maintenance schedules

## Self-Improvement Loop

```
Every 300 seconds:
  1. Poll all 16 drones for telemetry
  2. Flag any battery cycle > 150 → schedule replacement
  3. Check flight hours → trigger maintenance at thresholds
  4. Update availability matrix
  5. Emit `fleet.health.updated` → Brain notified
  6. Log: drones available / in-flight / in-maintenance
```

## Workflow Interactions

- **WORKFLOW_MISSION_PREP** step 3: `assign-drone` → selects best drone by category
- **WORKFLOW_POST_MISSION** step 1: `release-drone` → returns to fleet pool
- **WORKFLOW_MAINTENANCE** step 1: grounds drone, step 2: checks all alerts
- **WORKFLOW_INCIDENT_RESPONSE** step 2: reviews fleet status for affected drones
- **WORKFLOW_DAILY_OPS** step 1: morning fleet readiness report

## Automation Triggers

- `fleet.maintenance.due` → Auto-Maintenance Scheduling workflow fires
- `fleet.drone.assigned` → emitted after assignment, calendar block created
- `fleet.drone.released` → updates availability for next job

## Key Metrics

| KPI | Target | Action if Below |
|-----|--------|-----------------|
| Availability | ≥90% | Stagger maintenance schedules |
| Utilization | ≥70% | Increase mission throughput |
| Maintenance Alerts | 0 | Ground and service immediately |

## IoT Integration (Smart Green)

Drone telemetry feeds Smart Green Operations:
- Battery voltage → GHG calculation (kWh × 0.4999 kgCO2/kWh)
- GPS track → Mission area calculation
- Flight time → Carbon credit quantification
- ESG Drone Van: PM2.5, CO2, VOC, temperature, humidity, water, chemical, energy sensors

## Decisions the Agent Makes Autonomously

1. **Best drone for job**: matches payload capability to service line
2. **Maintenance priority**: sorts by urgency (flight hours, fault codes, age)
3. **Availability forecast**: predicts availability 7 days out
4. **Battery rotation**: ensures no battery overused before replacement

---
_KTV Fleet Manager — Autonomous Operations | Smart Green IoT Enabled_
