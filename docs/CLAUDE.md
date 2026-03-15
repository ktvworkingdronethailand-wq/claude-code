# KTV Working Drone Thailand - Project Configuration

## Company Overview

- **Company**: KTV Working Drone Thailand Co., Ltd.
- **Parent**: KTV Group (est. 1992, Norway, Kennet Nilsen)
- **Core Business**: Autonomous drone facade cleaning, inspection, surface treatment
- **Franchise**: 66 countries globally, Thailand country partner
- **Market**: Thailand drone market USD 192.8M (2024) → USD 470M (2033), 10.41% CAGR

## Key Financial Reference (Verified)

- **Initial Investment**: USD 1,455,000 (THB 51,652,500)
- **Base Case Pricing**: 45 THB/sqm
- **3-Year Revenue**: USD 30,448,732 (THB 1,081,080,000)
- **3-Year Net Income**: USD 19,900,010 (THB 706,561,973)
- **ROI**: 1,350% | **IRR**: 257% | **Payback**: 6.3 months

## Documentation Structure

All business documents are in `/docs/`:

| Doc | File | Content |
|-----|------|---------|
| 00 | `00-KTV-BUSINESS-BREAKDOWN-INDEX.md` | Master index with verified financials |
| 01 | `01-market-research.md` | Thailand drone industry, competitors, CAAT regulations |
| 02 | `02-business-plan.md` | 6 service lines, 7 customer segments, 3-year growth |
| 03 | `03-operational-workflows.md` | Job lifecycle, fleet management, pilot ops, SMS, CRM |
| 04 | `04-technology-systems.md` | Fleet composition, payloads, software, IT infrastructure |
| 05 | `05-marketing-strategy.md` | Brand, digital marketing, sales, partnerships, pricing |
| 06 | `06-legal-financials.md` | Registration, CAAT compliance, insurance, projections |
| 07 | `07-INVESTOR-FINANCIALS-VERIFIED.md` | Official verified investor-grade financials |

## Service Lines

1. **Facade Cleaning** (Primary) - 45-70 THB/sqm, 87-92% EBITDA
2. **Building Inspection** - Thermal/visual surveys
3. **Agricultural Spraying** - Crop treatment services
4. **Aerial Survey & Mapping** - LiDAR/photogrammetry
5. **Media Production** - Commercial aerial photography/video
6. **Training Academy** - CAAT-certified pilot training

## Regulatory Requirements (CAAT Thailand)

- Drone registration required for aircraft >250g
- Maximum altitude: 90 meters
- Airport buffer zone: 9km minimum
- Pilot licensing required for commercial operations
- UAOC (Unmanned Aircraft Operating Certificate) mandatory
- Insurance: minimum THB 1M third-party liability

## Fleet & Technology

| Platform | Role | Cost (THB) |
|----------|------|-----------|
| DJI Agras T50 | Agricultural spraying | ~850,000 |
| DJI Agras T25 | Light agricultural | ~450,000 |
| DJI Matrice 350 RTK | Survey & mapping | ~650,000 |
| DJI M30T | Inspection & thermal | ~550,000 |
| DJI Inspire 3 | Media production | ~350,000 |
| KTV Facade Drone | Autonomous cleaning | Via franchise |

## Business Rules

- Always use verified financials from doc 07 for investor communications
- Conservative scenario (30 THB/sqm) for internal planning
- Base case (45 THB/sqm) for investor presentations
- Account for 8.33% monsoon season capacity reduction (4 months)
- 7% royalty on gross revenue to KTV Group
- 20% corporate tax on EBIT
- Thai LLC structure: 51/49 split or BOI promotion for 100% foreign ownership

## Target Market (Bangkok Priority)

- 400+ buildings over 90m height
- Tropical climate = recurring cleaning demand (quarterly cycles)
- Primary segments: condominiums, office towers, hotels, shopping malls
- Secondary: industrial facilities, government buildings, temples

## Key Competitive Advantages

1. First mover - only certified autonomous cleaning drone in Thailand
2. 400m proven height - tested on Icon of the Seas (world's largest cruise ship)
3. ISO certified - 9001, 14001, 45001
4. Full franchise support from parent company (training, tech, operations)

## Development Notes

- Source code in `/src/`
- Tests in `/tests/`
- Configuration in `/config/`
- Scripts in `/scripts/`
- Use ruflo v3.5.15 for agent coordination
- Follow hierarchical-mesh topology with max 8 agents for coding tasks
