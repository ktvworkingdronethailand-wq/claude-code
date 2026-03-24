"""
KTV Mastermind — Memory Seed Data
Seeds the persistent memory with all baseline strategic data.
"""

from .memory import memory_create, memory_view


def seed_all_memories():
    """Seed all memory files with KTV baseline data."""
    seeds = {
        "business/ktv_core.txt": _ktv_core(),
        "partners/ifs_thailand.txt": _ifs_partner(),
        "jv/structure.txt": _jv_structure(),
        "finance/base_case.txt": _financial_base_case(),
        "product/smart_green.txt": _smart_green(),
        "sales/phase1_rollout.txt": _phase1_rollout(),
        "ops/compliance_thailand.txt": _ops_compliance(),
    }

    for path, content in seeds.items():
        # Only create if not exists
        existing = memory_view(path)
        if "not found" in existing.lower():
            memory_create(path, content)
            print(f"  [Seed] Created {path}")
        else:
            print(f"  [Seed] Skipped {path} (already exists)")


def _ktv_core() -> str:
    return """KTV Working Drone Thailand — Core Profile
- Company: KTV Working Drone Thailand Co., Ltd.
- Parent: KTV Group (est. 1992, Norway, 66 countries)
- Founder: Kennet Nilsen
- HQ: Bangkok, Thailand
- Ownership: 50% KTV (control), up to 50% IFS
- Mission: First-mover drone-enabled FM platform in Thailand
- Service lines: Facade cleaning, building inspection, agricultural spraying, survey/mapping, media, training
- Fleet: 16 drones (DJI Agras T50/T25, Matrice 350 RTK, M30T, Inspire 3, Mavic 3)
- Key differentiator: Smart Green Operations (GRESB-ready ESG platform)
- Target: 400+ buildings over 90m in Bangkok, quarterly cleaning cycles
- Year 1 revenue target: THB 180,180,000"""


def _ifs_partner() -> str:
    return """IFS Thailand — FM Partner Memory
- Role: Exclusive FM partner for KTV drone services in Thailand
- Equity: Up to 25% earned via milestones
- Sectors: Aviation, Business & IT, Healthcare, Energy & Resources, Manufacturing & Industry, Commercial Towers, Campuses
- Channel: All drone-enabled FM services go through IFS within its FM portfolio
- KTV does not partner with competing FM providers in agreed exclusive scope
- Equity triggers (THB): 32,000,000 → 64,000,000 → 160,000,000
- Smart Green integration: min 5 sites for min 3 months
- FM scope: General building FM, commercial towers, offices, campuses, retail, healthcare, education, airports
- Sales messaging:
  * "You already own the FM relationship; we plug in world-class drones and ESG data."
  * "We turn risky, manual facade cleaning into a digital, data-driven service."
  * "Your clients see measurable safety and ESG gains via Smart Green Operations."
"""


def _jv_structure() -> str:
    return """KTV–IFS JV Structure — Master Rules
- Ownership:
  * KTV Working Drone Thailand: 50% (control, technology owner, brand and operating framework)
  * IFS Thailand: up to 50% (exclusive FM channel in Thailand)
- Governance:
  * KTV retains board control and acts as neutral technology anchor
  * IFS has board representation and reserved matters
  * Clear buyout/buyback mechanisms for equity changes
- Channel rules:
  * FM in Thailand: All drone-enabled FM goes through IFS
  * No conflict: IFS no competing drone stack
- Equity milestones:
  * Earned via revenue/sqm, live integrated sites, safety/ESG performance
  * Caps strict (max 50% IFS) unless Series A or restructuring agreed
"""


def _financial_base_case() -> str:
    return """Financial Base Case — KTV Working Drone Thailand
- Currency: THB (1 USD ≈ 35.5 THB)
- Base price: 45 THB/sqm for drone cleaning
- Market range: 15–70 THB/sqm depending on sector/complexity
- Year 1:
  * Gross revenue: THB 180,180,000
  * Implied volume: ~4,004,000 sqm
  * Net income: THB 112,283,616
  * Free cash flow: THB 97,884,816
- IRR: ~260-280% (base case)
- Payback: ~9-11 months
- Capital: USD 1,455,000 (THB 51,652,500)
- Use of funds: Drones/equipment, working capital, marketing, insurance/legal, contingency
- Tax: 7% VAT, 7% royalty to KTV Group, 20% corporate tax
- Guardrails:
  * Healthy gross margins required
  * Payback under 18 months
  * No fleet overcommit beyond planned capacity
  * Equity milestones must be realistic
"""


def _smart_green() -> str:
    return """Smart Green Operations — Product Memory
- Role: Smart, green operations platform linking KTV drones, ESG data, and FM workflows
- Core functions:
  * Orchestrates drone missions and work orders across multiple sites
  * Captures telemetry: sqm cleaned, water/chemical consumption, time at height avoided, energy
  * Produces cryptographically verifiable ESG metrics for GRESB and green building reporting
- IFS integration:
  * Embedded into IFS FM operational processes
  * Used daily/weekly across live IFS sites
  * KPIs visible in standard IFS client reports
  * Key fields: sqm_cleaned, water_liters, chemical_liters, height_avoided_min, energy_kwh
- Differentiators:
  * Only drone ops platform positioned as GRESB-ready for FM operators
  * Converts one-off jobs into recurring, data-rich FM service
  * Future-proof ESG and digital FM layer for Thailand and SE Asia
"""


def _phase1_rollout() -> str:
    return """Phase 1 — IFS Thailand FM Rollout
- Objective: Secure IFS as exclusive FM partner, launch pilot sites
- Step 1: Sign JV / exclusivity and equity framework
- Step 2: Select 1-3 initial IFS sites as flagship pilots
  * Examples: commercial tower, campus, industrial facility
- Step 3: Deploy KTV drones + Smart Green at pilot sites
  * KPIs: sqm cleaned, safety incidents (target 0), time/cost vs rope access, ESG metrics
- Step 4: Scale to broader IFS portfolio
  * Revenue thresholds: THB 32M → 64M → 160M
- Target safety incidents: 0
- Pilot duration: 3 months
- Priority sectors: commercial-tower, campus, healthcare
- Strategy:
  * Lead with IFS relationship
  * Propose diverse pilot set (tower + campus + industrial)
  * Use Smart Green ESG data as differentiator
  * Target first revenue within 2-4 weeks of JV signing
"""


def _ops_compliance() -> str:
    return """Operations & Compliance — Thailand Drone FM
- Regulator: CAAT (Civil Aviation Authority of Thailand)
- Key limits:
  * Max altitude: 90m
  * Airport buffer: 9km
  * Min insurance: THB 1,000,000
  * Registration: required above 250g
  * Pilot license: required (RPL)
  * UAOC: required
- Validation checklist:
  * Site location type (urban, suburban, industrial, O&G)
  * Height profiles and proximity to sensitive infrastructure
  * Permits, clearances, building/FM team coordination
- Safety priorities:
  * Work-at-height risk reduction (zero incidents target)
  * Track avoided work-at-height hours via Smart Green
- Capacity rules:
  * Align fleet/crew with financial capacity and Phase 1 targets
  * Update when new SOPs or CAAT guidance introduced
- Fleet: 16 drones across cleaning, inspection, and media categories
- Daily flight limits: 8h per pilot, 80h monthly max
"""
