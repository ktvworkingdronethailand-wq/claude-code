# KTV Data Processing — Agent Skills

**Agent ID:** `data-processing`
**Team:** Service Delivery + Ecosystem Builder
**Brain Layer:** Operational (Layer 1)

---

## Core Capabilities

| Skill | Action | Trigger |
|-------|--------|---------|
| Create Data Job | `create-data-job` | Mission complete |
| Register Backup | `register-backup` | 4-copy protocol |
| Advance Processing | `advance-processing` | Stage progression |
| Create Delivery | `create-delivery` | QA passed |
| Get Processing Stats | `get-processing-stats` | Every 300s + daily ops |

## 4-Copy Backup Rule (NON-NEGOTIABLE)

```
Copy 1: SD card (on-site, immediate)
Copy 2: Field laptop (van, end of mission)
Copy 3: NAS (office, same day)
Copy 4: AWS S3 (cloud, automated upload)
```

**All 4 copies must register before processing begins.**

## Processing Pipelines

| Pipeline | Input | Output | Time |
|----------|-------|--------|------|
| photogrammetry | RGB images | Orthomosaic + 3D model | 24-48h |
| lidar | Point cloud | BIM + measurements | 12-24h |
| thermal | Thermal video | Anomaly report | 8-16h |
| inspection | Mixed media | Defect map + report | 24h |
| esg-report | All sensors | GHG + ESG dashboard | 4-8h |

## Workflow Interactions

- **WORKFLOW_POST_MISSION** steps 2-7: creates data job → 4 backups → advances to processing
- **WORKFLOW_DELIVERY_TO_PAYMENT** step 1: creates delivery, uploads to client portal
- **WORKFLOW_DAILY_OPS** step 7: processing queue status

## Self-Improvement Loop

```
Every 300 seconds (Data Processing Queue Monitor):
  1. Check all jobs in queue / processing / QA / delivery
  2. Flag jobs processing >48h → escalate
  3. Verify backup compliance: all 4 copies present
  4. Calculate QA pass rate
  5. Check S3 upload health
  6. Emit queue stats to Brain
  7. Log: queue depth / QA rate / backup compliance
```

## QA Standards

| Deliverable | Pass Criteria |
|-------------|--------------|
| Orthomosaic | GSD ≤1.5cm, RMSE ≤5cm |
| 3D Model | Mesh quality score ≥90 |
| Thermal Report | All anomalies classified |
| ESG Report | GHG calculation verified ✓ |

**QA pass rate target: ≥97%**

## ESG Data Pipeline

Smart Green IoT integration:
- Drone GPS + flight time → area cleaned + energy used
- IoT van sensors → PM2.5, CO2, VOC, chemical usage
- GHG engine: `kWh × 0.4999 kgCO2/kWh = emissions`
- Baseline: rope access emissions per sqm (TGO factors)
- Delta: baseline - actual = carbon credits (T-VER)
- Output: per-mission GHG certificate + TGO submission

## Client Deliverables (Standard Package)

```
report.pdf         — executive summary + findings
orthomosaic.tif    — georeferenced aerial image
model.obj          — 3D mesh model
defect_map.kml     — GIS layer for BMS integration
esg_certificate.pdf — GHG reduction + carbon credits
```

## Key Metrics

| KPI | Target | Zero Tolerance |
|-----|--------|----------------|
| Backup Compliance | 100% | Any missing copy = halt |
| QA Pass Rate | ≥97% | Below 90% = audit |
| Processing Time | ≤avg 1.4 days | Flag if >48h |
| S3 Upload Health | 100% | Retry + alert on failure |

## Decisions the Agent Makes Autonomously

1. **Pipeline selection**: matches drone data type to correct pipeline
2. **QA approval**: auto-approves if all thresholds met, flags if any fail
3. **Delivery packaging**: assembles correct file set per contract
4. **ESG certificate generation**: calculates credits, formats for TGO

---
_KTV Data Processing — 4-Copy Backup | Smart Green ESG Pipeline | T-VER Ready_
