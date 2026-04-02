# KTV Working Drone Thailand - Operational Workflows

## Job Lifecycle

The complete job lifecycle follows a 13-stage process from initial contact through post-delivery follow-up.

| Stage | Activity | Description |
|-------|----------|-------------|
| 1 | Lead Capture | Inbound inquiries via LINE, website, phone, referrals |
| 2 | Qualification | Assess scope, feasibility, budget alignment |
| 3 | Site Assessment | On-site visit to evaluate terrain, obstacles, airspace |
| 4 | Flight Planning | Route planning, altitude mapping, waypoint programming |
| 5 | Quotation | Formal pricing based on assessment and service tier |
| 6 | Contract | Service agreement execution with terms and SLAs |
| 7 | Pre-Flight Preparation | Equipment staging, battery charging, payload configuration |
| 8 | Mission Execution | On-site flight operations with safety protocols |
| 9 | Data Processing | Raw data ingestion, processing, and analysis |
| 10 | Quality Assurance | Output review against quality standards and specifications |
| 11 | Delivery | Client portal upload and handover of deliverables |
| 12 | Invoicing | Billing and payment processing |
| 13 | Follow-Up | Satisfaction check, feedback collection, future scheduling |

---

## Fleet Management

### Asset Register

Maintain a centralized register of all drones, payloads, batteries, and accessories with serial numbers, purchase dates, flight hours, and maintenance history.

### Battery Management

| Protocol | Detail |
|----------|--------|
| Rotation Protocol | Sequential cycling to ensure even wear across battery inventory |
| 80% Health Threshold | Battery reassigned to training operations only |
| 70% Health Threshold | Battery retired from service and disposed of properly |

### Payload Management

All payloads tracked individually with calibration records, mounting logs, and compatibility matrices per airframe.

### Maintenance Schedule

| Interval | Activities |
|----------|------------|
| Pre-Flight | Visual inspection, firmware check, sensor calibration, battery state |
| Post-Flight | Cleaning, damage inspection, log download, battery storage protocol |
| 50-Hour Service | Propeller replacement, motor inspection, gimbal calibration, firmware updates |
| 200-Hour Service | Full overhaul, bearing replacement, ESC testing, manufacturer service submission |

---

## Pilot Operations

### Scheduling

| Rule | Limit |
|------|-------|
| Maximum Flight Hours Per Day | 8 hours |
| Maximum Flight Hours Per Month | 80 hours |

### Certification Tracking

| Certification | Requirement |
|---------------|-------------|
| CAAT License | Current and valid pilot license issued by CAAT |
| Medical Certificate | Valid aviation medical certificate |
| Type Ratings | Specific ratings for each airframe operated |

### Training Program

- **New Hire Duration**: 4 - 6 weeks
- Covers ground school, simulator training, supervised flights, emergency procedures, and company SOPs

### Performance Scorecard

Pilots evaluated on mission completion rate, safety compliance, data quality, customer feedback, and equipment handling.

---

## Safety Management System

### Risk Assessment: 5x5 Risk Matrix

|  | Negligible (1) | Minor (2) | Moderate (3) | Major (4) | Catastrophic (5) |
|--|-----------------|-----------|---------------|-----------|-------------------|
| **Almost Certain (5)** | 5 | 10 | 15 | 20 | 25 |
| **Likely (4)** | 4 | 8 | 12 | 16 | 20 |
| **Possible (3)** | 3 | 6 | 9 | 12 | 15 |
| **Unlikely (2)** | 2 | 4 | 6 | 8 | 10 |
| **Rare (1)** | 1 | 2 | 3 | 4 | 5 |

- **1-4**: Acceptable risk, proceed with standard controls
- **5-9**: Moderate risk, additional mitigation required
- **10-15**: High risk, senior approval needed
- **16-25**: Unacceptable risk, do not proceed

### Pre-Flight Checklists

Standardized checklists covering airframe integrity, battery state, payload mounting, airspace clearance, weather conditions, and communication systems.

### Emergency Procedures

| Emergency | Protocol |
|-----------|----------|
| Flyaway | Activate return-to-home, notify ATC if in controlled airspace, track via telemetry |
| Crash | Secure area, document scene, recover equipment, file incident report |
| Injury | Administer first aid, call emergency services, preserve scene, report internally |
| Battery Fire | Evacuate area, use sand or fire blanket (no water), call fire services, quarantine other batteries |

### Incident Reporting

All incidents and near-misses reported within 24 hours using standardized forms. CAAT notification required for serious incidents.

### Weather Decision Criteria

| Parameter | Go/No-Go |
|-----------|----------|
| Wind Speed | Below 10 m/s (varies by airframe) |
| Visibility | Minimum 3 km |
| Precipitation | No rain, snow, or hail |
| Temperature | Manufacturer-specified operating range |
| Lightning | No operations within 30 km of lightning |

---

## Data Management Pipeline

### Field Capture Standards

All raw data captured with GPS tagging, consistent overlap settings (for photogrammetry), and calibrated sensors.

### Backup Protocol: 4-Copy Rule

| Copy | Location |
|------|----------|
| Copy 1 | On-board SD card (original capture) |
| Copy 2 | Field laptop transfer immediately post-flight |
| Copy 3 | NAS upload upon return to office |
| Copy 4 | Cloud backup (AWS S3) within 24 hours |

### Processing Pipelines

| Pipeline | Application |
|----------|-------------|
| Photogrammetry | Orthomosaics, 3D models, point clouds, volumetric analysis |
| NDVI | Crop health indices, vegetation analysis, prescription maps |
| Video | Editing, color grading, stabilization, deliverable packaging |

### QA Checklists

All deliverables pass quality assurance review for accuracy, completeness, resolution, georeferencing, and format compliance before client delivery.

### Client Portal Delivery

Deliverables uploaded to a secure client portal with download access, viewing tools, and archival for 12 months minimum.

---

## CRM and Customer Management

### Lead Pipeline Stages

1. New Lead
2. Contacted
3. Qualified
4. Proposal Sent
5. Negotiation
6. Won / Lost

### Onboarding Checklist

- Contract signed
- Site assessment completed
- Client portal account created
- Primary contact and billing details confirmed
- Service schedule agreed
- Emergency contacts exchanged

### Recurring Service Scheduling

Automated scheduling for subscription clients with calendar integration, pilot assignment, and equipment reservation.

### NPS Tracking

Net Promoter Score surveys sent after each project or quarterly for recurring clients, with target NPS above 50.

---

## Supply Chain Management

### Spare Parts Inventory

Maintain minimum stock levels for propellers, batteries, motors, landing gear, and common wear items. Reorder triggers at 30% of minimum stock.

### Chemical Procurement

Agricultural chemicals sourced from approved suppliers with proper licensing, MSDS documentation, and storage compliance.

### Vendor Management

- All vendors reviewed annually for quality, pricing, and reliability
- Minimum two approved suppliers per critical category
- Performance scorecards maintained for all key vendors
