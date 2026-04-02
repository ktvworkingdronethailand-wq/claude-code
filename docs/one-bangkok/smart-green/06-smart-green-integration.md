# Smart Green Integration Design: One Bangkok

**Date:** 2 April 2026
**Agent:** Smart Green Product Orchestrator
**Classification:** Commercial-In-Confidence

---

## 1. Platform Overview

Smart Green transforms every drone cleaning mission into a building performance data event.

### Data Captured Per Mission

- **Thermal imaging:** Surface temperature differentials, insulation failures, HVAC leakage zones (0.1°C sensitivity)
- **Glass integrity:** Micro-cracks, seal degradation, delamination, coating wear (geo-tagged per panel)
- **Structural assessment:** Joint condition, caulking degradation, water intrusion, corrosion
- **Cleaning verification:** Before/after with quantified cleanliness scoring (0-100 per zone)
- **Environmental context:** Wind, humidity, UV index, temperature at time of capture

### Dashboard Design

- **Complex view:** Bird's-eye map, color-coded condition (green/amber/red), aggregated ESG scores
- **Building view:** Individual facades as grid, click any zone for full inspection history
- **Mission timeline:** Chronological feed with anomaly alerts
- **Alert panel:** Priority-ranked items with severity scoring and time-to-failure estimates

## 2. BMS/CMMS Integration Architecture

```
Layer 1: Smart Green Data Platform
  → Raw telemetry → CV + thermal analysis → Structured condition reports
    |
Layer 2: IFS Asset Management
  → API ingestion → Asset records → Work orders → Lifecycle costing
    |
Layer 3: One Bangkok BMS
  → HVAC zone correlation → Energy consumption cross-reference
```

### Automated Work Order Flow (Closed Loop)

1. Drone detects anomaly (e.g., seal degradation, Building C, Level 22, East facade)
2. Smart Green classifies severity (Amber: 4-6 months before water intrusion risk)
3. Smart Green pushes to IFS via API → work order created with photos + location
4. IFS routes to PCS → technician dispatched with full context
5. Next drone mission confirms repair → Smart Green closes loop in IFS

### API Architecture

- **Smart Green API:** RESTful + webhooks for real-time event push
- **IFS Integration:** Standard IFS BOD format for asset updates and work orders
- **BMS Bridge:** Read-only BACnet/IP or Modbus TCP for energy correlation

## 3. ESG Reporting Value

### LEED/WELL Contributions

- **LEED EA Credit:** Facade thermal data validates envelope performance
- **LEED MR Credit:** Facade component lifecycle tracking
- **LEED Innovation:** Novel drone-based monitoring (credible submission)
- **WELL Thermal Comfort:** Envelope performance validation
- **WELL Light:** Glass condition monitoring for daylight credit

### Automated Reporting

- Continuous data collection at every cleaning cycle
- Machine-generated condition scores (consistent, auditable, comparable)
- Compatible: GRI Standards, TCFD, SET ESG, GRESB

### Carbon Footprint Reduction

- Eliminated: gondolas, scaffolding, rope access teams
- Reduced: water consumption (80%+ less than traditional)
- Measured: carbon equivalent of drone vs traditional, Scope 1/2 reportable

## 4. Data Moat Strategy

### Four Reinforcing Principles

1. **Historical baseline ownership** — Year 1 data cannot be replicated by a new provider
2. **Integration depth** — every IFS work order and BMS correlation is a dependency
3. **Predictive model training** — 12+ months to reach equivalent accuracy if replaced
4. **Regulatory lock-in** — embedded in LEED certification and ESG disclosures

## 5. Subscription Tiers

| Tier | Monthly (THB) | Annual (THB) | Includes |
|------|--------------|-------------|----------|
| **Basic** | Included | Included | Post-mission PDF reports, critical anomaly flagging |
| **Pro** | 150,000 | 1,500,000 | Dashboard, full anomaly detection, ESG analytics, alerts |
| **Enterprise** | 350,000 | 3,500,000 | Everything + IFS integration + BMS correlation + predictive + ESG reports |

**Recommended for One Bangkok: Enterprise**

## 6. Implementation Roadmap

| Phase | Months | Scope |
|-------|--------|-------|
| **Pilot** | 1-2 | 1-2 buildings, baseline missions, Pro dashboard |
| **Full Deployment** | 3-4 | All buildings, IFS integration live, BMS correlation |
| **Predictive + ESG** | 5-6 | Predictive models, automated quarterly ESG reports |

**Time to full deployment: 6 months**
**Time to irreplaceable data moat: 12 months**

---

*End of Smart Green Integration Design*
