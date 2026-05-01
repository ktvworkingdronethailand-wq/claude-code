# Shell Fuel Station IoT Intelligence Strategy

**KTV Working Drone Thailand × Shell Thailand**
400 fuel stations | IoT sensor hub | 7 value layers | Recurring data revenue

---

## Strategic Position

The cleaning contract is the Trojan horse — the data is the product.

KTV drone vans visit every Shell station on a recurring schedule. Each van carries an IoT sensor hub that captures high-value operational data as a byproduct of cleaning — zero marginal cost. No competitor has physical access + IoT sensors + data intelligence combined.

## What KTV Already Captures (Drone Van Sensor Hub)

Each drone van runs a **Raspberry Pi 4B (8 GB)** edge gateway with:

| Sensor | Model | Data Captured |
|--------|-------|---------------|
| GPS | u-blox ZED-F9P (RTK) | Station coordinates, route tracking, dwell time |
| Camera | 4K RGB + FLIR thermal | Before/after imagery, equipment thermal profiles, structural condition |
| Air Quality | Sensirion SEN5x | PM2.5, PM10, VOC, NOx, temperature, humidity |
| Weather | Davis Vantage Vue | Wind speed/direction, rain, barometric pressure, solar radiation |
| Power | Shelly Pro 3EM | Energy per circuit (kWh), power factor, harmonics |
| Water | Seametrics iMAG | Flow rate (L/min), total volume per clean |
| Chemical | Sensorex SAM-1 | pH, conductivity, chemical concentration |
| Telemetry | MAVLink protocol | Battery voltage, motor RPM, vibration, flight hours |

Every reading is captured automatically during the cleaning visit. The sensor hub runs whether or not Shell buys a data subscription — we capture everything, always.

## Data Provenance (Tamper-Proof Chain)

Every sensor reading follows a cryptographic chain of custody:

```
Sensor Reading
  → HMAC-SHA256 (per-device key, quarterly rotation)
    → DataProvenance { hash, deviceId, timestamp, gps }
      → AWS KMS RSA-4096 envelope encryption (AES-256-GCM data key)
        → S3 Object Lock (GOVERNANCE mode, 7-year retention)
```

| Stage | Technology | Purpose |
|-------|-----------|---------|
| Device Signing | HMAC-SHA256 | Proves reading came from a specific sensor at a specific time |
| Provenance Record | DataProvenance struct | Links hash + device + timestamp + GPS into single verifiable record |
| Envelope Encryption | KMS RSA-4096 / AES-256-GCM | Encrypts data at rest, key managed by AWS KMS |
| Immutable Storage | S3 Object Lock GOVERNANCE | Cannot be deleted or modified for 7 years |
| Audit Trail | CloudTrail + hash chain | Every access logged, full chain verifiable end-to-end |

This makes every reading **audit-grade and legally defensible** — critical for ESG compliance, insurance claims, and regulatory reporting.

## 7 Value Layers for Shell

### Layer 1: Predictive Maintenance
- **KTV Delivers**: Equipment thermal profiles + power consumption anomalies → ML-based failure prediction
- **Shell Value**: Prevent unplanned equipment downtime, reduce maintenance costs 30-40%
- **Sensors**: Thermal camera, Shelly Pro 3EM power monitor
- **Example**: Thermal hotspot on pump motor flagged 2 weeks before failure

### Layer 2: ESG & Compliance Reporting
- **KTV Delivers**: Air quality, water usage, chemical consumption, energy data → GRESB/GRI/CDP-ready reports
- **Shell Value**: Automated sustainability reporting with audit-grade evidence
- **Sensors**: SEN5x air quality, iMAG water, SAM-1 chemical, Shelly power
- **Example**: Per-station Scope 3 emissions report generated automatically each quarter

### Layer 3: Proof of Service
- **KTV Delivers**: Timestamped GPS coordinates + before/after imagery + sensor readings per visit
- **Shell Value**: SLA verification, dispute elimination, insurance evidence
- **Sensors**: GPS, camera, water meter, chemical monitor
- **Example**: Contractual proof that Station #247 was cleaned on date/time with exact water/chemical usage

### Layer 4: Asset Management
- **KTV Delivers**: Structural imaging, thermal profiles, condition scoring per station
- **Shell Value**: Digital twin baseline for each station, lifecycle cost optimization
- **Sensors**: 4K + thermal camera
- **Example**: Progressive condition scoring identifies stations needing capex investment before visible deterioration

### Layer 5: Operational Benchmarking
- **KTV Delivers**: Cross-station comparison of energy, water, and chemical consumption
- **Shell Value**: Identify top/bottom performing stations, standardize best practices
- **Sensors**: Power, water, chemical monitors
- **Example**: Station #89 uses 3x more water per clean than average → plumbing investigation saves $12K/yr

### Layer 6: Safety & Compliance Records
- **KTV Delivers**: Environmental readings, equipment condition data, incident documentation
- **Shell Value**: Regulatory audit readiness, risk reduction, liability protection
- **Sensors**: Air quality, weather, camera
- **Example**: Air quality readings prove compliance with Department of Industrial Works standards

### Layer 7: Carbon Footprint (Scope 3)
- **KTV Delivers**: Energy, water, chemical, and transport data → verified GHG calculations
- **Shell Value**: Scope 3 supply chain emissions for each station, carbon credit eligibility
- **Sensors**: Power, water, chemical, GPS
- **Example**: Verified per-station carbon footprint feeds into Shell's global Scope 3 reporting

## Pricing Model (400 Stations)

| Tier | What's Included | $/Station/Month | Annual Revenue |
|------|----------------|----------------:|---------------:|
| **Base** | Cleaning + proof-of-service photos + GPS logs | $0 | — |
| **Standard** | Base + predictive maintenance alerts + ESG data feeds + benchmarking | $20 | **$96,000/yr** |
| **Premium** | Standard + real-time API + digital twin data + carbon accounting + custom analytics | $75 | **$360,000/yr** |

- Base tier is **included in the cleaning contract** — builds trust and demonstrates value
- Standard tier alone = **$96K/yr recurring data revenue** on top of cleaning fees
- Premium tier = **$360K/yr recurring** — data revenue scales with zero marginal cleaning cost
- All tiers share the same sensor infrastructure — cost of data capture is already sunk

### Revenue Stacking

```
Cleaning Contract Revenue     ← Primary contract (per-station fee)
  + Standard Data Revenue     ← $96,000/yr (400 × $20/mo)
  + Premium Data Revenue      ← $360,000/yr (400 × $75/mo)
─────────────────────────────
Total addressable = Cleaning + $456K/yr data revenue
```

## Competitive Moat

| Advantage | Why It Matters |
|-----------|---------------|
| Physical access | KTV is already at every station on a recurring schedule |
| Zero marginal cost | Sensors capture data during cleaning — no extra visit needed |
| Audit-grade provenance | HMAC-SHA256 → KMS → S3 Object Lock = legally defensible readings |
| No competitor overlap | No other cleaning company combines physical access + IoT + data intelligence |
| Lock-in via data | Once Shell builds workflows on KTV data feeds, switching cost is enormous |

## Implementation Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Pilot | 90 days | 10 stations, Base + Standard tiers, prove sensor reliability |
| Rollout | 6 months | Scale to 100 stations, onboard Shell operations team |
| Full deployment | 12 months | All 400 stations, Premium tier available |
| Data products | 18 months | Custom analytics, API marketplace, third-party data licensing |

## Technical Configuration

- Sensor hub hardware specs: `src/config/shell-stations.ts`
- IoT fleet monitoring types: `src/config/thai-climate-act.ts`
- ESG compliance matrix: `src/config/thai-climate-act.ts`
- Data provenance pipeline: `src/config/shell-stations.ts`

---

*Document reference: KTV Working Drone Thailand — Shell IoT Intelligence Strategy v1.0*
