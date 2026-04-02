"""
KTV Mastermind — Configuration & Constants
All strategic, financial, and partner data in one place.
Updated: IFS-KTV Integrated FM Solutions Presentation 2026
"""

import os
from pathlib import Path

# ── Claude API ────────────────────────────────────────────────

MODEL_NAME = os.getenv("KTV_MODEL", "claude-sonnet-4-6")
MAX_TOKENS = 4096
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

# ── Paths ─────────────────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent
MEMORY_DIR = BASE_DIR / "memories"

# ── Company ───────────────────────────────────────────────────

COMPANY = {
    "name": "KTV Working Drone Thailand Co., Ltd.",
    "parent": "KTV Group",
    "founder": "Kennet Nilsen",
    "parent_founded": 1992,
    "parent_country": "Norway",
    "franchise_countries": 66,
    "hq": "Bangkok, Thailand",
    "address": "Rasa Two, 1818 Petchaburi Rd, Makkasan, Ratchathewi, Bangkok 10400",
    "website": "https://ktvworkingdrone.com",
    "leadership": {
        "director": {"name": "Thanvarat K. Agnew", "email": "thanvarat@ktvworkingdrone.com"},
        "managing_director": {"name": "Matthew Peter James", "email": "matthew.james@ktvworkingdrone.com"},
    },
    "certifications": [
        "World's only certified provider of autonomous drone cleaning and maintenance",
        "Thailand's first drone cleaning provider",
        "Patented roof safety system (unique globally)",
        "30+ years proprietary sensor technology (centimetre-level precision)",
    ],
    "key_stats": {
        "cleaning_speed": "80% faster than traditional methods",
        "ghg_reduction": "96% lower emissions than conventional approaches",
        "risk_reduction": "100% elimination of high-risk manual tasks",
    },
}

# ── JV Structure ──────────────────────────────────────────────

JV_STRUCTURE = {
    "ktv": {"stake": 50, "role": "Control, technology owner, brand and operating framework"},
    "ifs": {"stake_max": 50, "role": "Exclusive FM channel in Thailand"},
    "governance": {
        "board_control": "ktv",
        "board_seats": ["ktv", "ifs"],
        "reserved_matters": True,
        "buyout_mechanisms": True,
    },
    "equity_caps_strict": True,
}

# ── IFS Thailand ──────────────────────────────────────────────

IFS_PARTNER = {
    "name": "IFS Thailand",
    "role": "Exclusive FM partner",
    "heritage": "40+ years of integrated FM expertise",
    "sectors": [
        "Aviation", "Business & IT", "Healthcare",
        "Energy & Resources", "Manufacturing & Industry",
        "Commercial Real Estate", "Campuses",
        "Government", "Transport", "Hotels & Hospitality",
        "Education", "Data Centers", "Sporting Facilities",
        "Industrial", "Solar",
    ],
    "exclusive_fm": True,
    "no_competing_providers": True,
    "equity_triggers_thb": [32_000_000, 64_000_000, 160_000_000],
    "smart_green_milestones": {"min_sites": 5, "min_months": 3},
    "fm_scope": [
        "Planned preventative & reactive maintenance (drone inspections + cleaning)",
        "Minor works, capital projects & quality assurance (pre-work + post-completion verification)",
        "Landscaping, biodiversity & ESG (vertical gardens, precision spraying, PM2.5 control)",
        "Cleaning + technology (AI, AR, robotics, smart building integration, co-botic cleaning)",
        "Facade/window/solar cleaning via KTV autonomous drones",
        "Emergency and rapid incident response via on-demand drone deployment",
    ],
    "sales_messaging": [
        "You already own the FM relationship; we plug in world-class drones and ESG data.",
        "We turn risky, manual facade cleaning into a digital, data-driven service.",
        "Your clients see measurable safety and ESG gains via Smart Green Operations.",
        "Transform building maintenance from reactive expense to predictive asset management.",
    ],
    "government_opportunities": [
        "Bangkok Metropolitan Administration (BMA) — smart city ops, district offices, schools",
        "Ministries — Education, Transport, Energy, Health — proactive maintenance & safety",
        "Schools & educational institutions — safe, healthy, sustainable learning environments",
        "Transport & energy infrastructure — airports, train stations, solar farms, power facilities",
        "Industrial & urban estates — multi-year cleaning, inspection, and reporting contracts",
        "Data centres — mission-critical facility management (ASEAN data centre hub)",
    ],
}

# ── Smart Green Operations ────────────────────────────────────

SMART_GREEN = {
    "name": "Smart Green Operations",
    "url": "https://www.smartgreenoperations.com",
    "description": (
        "Smart city integration platform linking autonomous drones, ESG data, "
        "and FM workflows with existing BMS & IFM (CMMS) systems"
    ),
    "core_functions": [
        "Orchestrates drone missions and work orders across multiple sites",
        "Captures telemetry: sqm cleaned, water/chemical consumption, time at height avoided, energy",
        "Produces cryptographically verifiable ESG metrics for GRESB and green building reporting",
        "Integrates with Building Management Systems (BMS) and IFM (CMMS)",
        "Complete work and inspection history with full oversight of external damage",
        "Predictive maintenance capabilities and strategic planning tools",
    ],
    "telemetry_fields": [
        "sqm_cleaned", "water_consumption_liters", "chemical_consumption_liters",
        "time_at_height_avoided_minutes", "energy_usage_kwh",
        "safety_incidents", "mission_duration_minutes", "carbon_offset_kg",
        "pm25_readings", "facade_condition_score",
    ],
    "differentiators": [
        "Only drone ops platform positioned as GRESB-ready for FM operators",
        "Converts drone cleaning from one-off jobs into recurring, data-rich FM service",
        "Future-proof ESG and digital FM layer for Thailand and SE Asia",
        "Smart city integration with existing building systems (BMS/CMMS)",
        "AI-supported predictive maintenance and co-botic autonomous cleaning",
    ],
}

# ── KTV CARE Agreement ────────────────────────────────────────

KTV_CARE = {
    "name": "KTV CARE Agreement",
    "description": "Long-term maintenance partnership with full responsibility for facade and window cleanliness",
    "minimum_commitment_months": 36,
    "includes": [
        "Full responsibility for facade and window cleanliness",
        "Quarterly inspections with comprehensive condition reports",
        "Digital access to Smart Green Operations platform",
        "Complete work and inspection history",
        "Full oversight of external damage and future maintenance needs",
        "Budget predictability through long-term agreements",
        "Predictive capabilities and strategic maintenance planning",
    ],
    "value_prop": (
        "Over a 100-year period, maintenance costs for a building are often far higher "
        "than the original construction cost. By combining cleaning and inspection under "
        "one agreement, costs are significantly reduced whilst ensuring complete control."
    ),
    "assessment_flow": [
        "Current state analysis (existing costs, safety, environmental impact, digital capability)",
        "Drone-based building inspection (condition report, maintenance needs, digital documentation)",
        "KTV CARE solution (Smart Green overview, customised agreement, implementation roadmap)",
    ],
}

# ── Technology Partnership Program ────────────────────────────

TECHNOLOGY_PARTNERSHIP = {
    "name": "Technology Partnership Program",
    "description": "Complete business management solution for facility management companies",
    "minimum_commitment_months": 36,
    "includes": {
        "operational_management": [
            "KTV manages all drone cleaning operations",
            "Complete scheduling, delivery & quality assurance",
            "Full regulatory compliance & safety oversight",
            "Equipment provision, maintenance & insurance",
        ],
        "staff_training": [
            "All 6 training courses included",
            "Up to 6 people per month",
            "Quarterly refresher training",
            "Dedicated training coordinator",
        ],
        "strategic_benefits": [
            "Priority access to new technology",
            "Co-branded service delivery",
            "Dedicated account management",
            "Priority scheduling across all properties",
            "Monthly performance reporting",
            "Joint client presentations & marketing support",
        ],
    },
    "pricing": "Custom quote based on portfolio size",
}

# ── Financial Base Case ───────────────────────────────────────

FINANCIAL = {
    "currency": "THB",
    "fx_usd_thb": 35.5,
    "base_price_per_sqm": 30,  # Updated 2026: 30 THB/sqm base rate
    "market_range": {"low": 27, "high": 60},
    "minimum_order_sqm": 20_000,
    "year1": {
        "gross_revenue": 180_180_000,
        "implied_sqm": 4_004_000,
        "net_income": 112_283_616,
        "free_cash_flow": 97_884_816,
    },
    "irr_range": "260-280%",
    "payback_months": "9-11",
    "capital": {
        "total_equity_usd": 1_455_000,
        "total_equity_thb": 51_652_500,
        "use_of_funds": [
            "Drones/equipment/vehicles",
            "Working capital and operations",
            "Marketing and business development",
            "Insurance and legal setup",
            "Contingency reserve",
        ],
    },
    "guardrails": {
        "healthy_gross_margins": True,
        "max_payback_months": 18,
        "no_fleet_overcommit": True,
        "equity_milestones_realistic": True,
    },
    "tax": {"vat_pct": 7, "royalty_pct": 7, "corporate_tax_pct": 20},
}

# ── Phase 1 Rollout ──────────────────────────────────────────

PHASE1 = {
    "objective": "Secure IFS as exclusive FM partner and launch first wave of pilot sites",
    "steps": [
        {"step": 1, "action": "Sign JV / exclusivity and equity framework"},
        {"step": 2, "action": "Select 1-3 initial IFS sites as flagship pilots",
         "examples": ["Commercial tower", "Campus", "Industrial facility"]},
        {"step": 3, "action": "Deploy KTV drones and Smart Green at pilot sites",
         "kpis": ["sqm cleaned", "safety incidents (target 0)",
                  "time/cost vs rope access", "ESG metrics captured"]},
        {"step": 4, "action": "Scale to broader IFS portfolio",
         "revenue_thresholds_thb": [32_000_000, 64_000_000, 160_000_000]},
    ],
    "target_safety_incidents": 0,
}

# ── CAAT Regulations ──────────────────────────────────────────

CAAT = {
    "regulator": "CAAT (Civil Aviation Authority of Thailand)",
    "max_altitude_m": 90,
    "airport_buffer_km": 9,
    "min_insurance_thb": 1_000_000,
    "registration_above_g": 250,
    "pilot_license_required": True,
    "uaoc_required": True,
}

# ── Core Service Lines (2026 Pricing) ─────────────────────────

SERVICE_LINES = {
    "facade-cleaning": {"name": "Facade Cleaning", "base_thb": 30, "unit": "sqm", "min_order_sqm": 20_000},
    "window-cleaning": {"name": "Window Cleaning", "base_thb": 30, "unit": "sqm", "min_order_sqm": 20_000},
    "solar-panel-cleaning": {"name": "Solar Panel Cleaning", "base_thb": 30, "unit": "sqm", "min_order_sqm": 20_000},
    "vertical-gardens": {"name": "Vertical Gardens", "base_thb": 40, "unit": "sqm", "min_order_sqm": 20_000},
    "pm25-pollution-control": {"name": "PM2.5 Pollution Control", "base_thb": 35, "unit": "sqm", "min_order_sqm": 20_000},
    "infrastructure": {"name": "Infrastructure", "base_thb": 35, "premium_thb": 50, "unit": "sqm", "min_order_sqm": 20_000},
    "jet-wash": {"name": "Jet Wash", "base_thb": 45, "unit": "sqm", "min_order_sqm": 20_000},
    "building-inspection": {"name": "Building Inspection", "base_thb": 15_000, "premium_thb": 80_000, "unit": "project"},
    "agricultural-spraying": {"name": "Agricultural Spraying", "base_thb": 80, "premium_thb": 120, "unit": "rai"},
    "survey-mapping": {"name": "Aerial Survey & Mapping", "base_thb": 15_000, "premium_thb": 80_000, "unit": "project"},
    "media-production": {"name": "Media Production", "base_thb": 15_000, "premium_thb": 150_000, "unit": "project"},
}

# ── Sector-Specific Pricing (2026) ───────────────────────────

SECTOR_PRICING = {
    "commercial-offices": {"rate_thb": 30, "adjustment": "Base rate"},
    "retail": {"rate_thb": 30, "adjustment": "Base rate"},
    "industrial": {"rate_thb": 36, "adjustment": "+20%"},
    "education-private": {"rate_thb": 30, "adjustment": "Base rate"},
    "education-government": {"rate_thb": 27, "adjustment": "-10%"},
    "infrastructure": {"rate_thb": 30, "adjustment": "Base rate"},
    "sporting-facilities": {"rate_thb": 30, "adjustment": "Base rate"},
    "government": {"rate_thb": 27, "adjustment": "-10%"},
    "transport": {"rate_thb": 30, "adjustment": "Base rate"},
    "hotels": {"rate_thb": 33, "adjustment": "+10%"},
    "mission-critical": {"rate_thb": 37.50, "adjustment": "+25%"},
}

# ── Training Programs ─────────────────────────────────────────

TRAINING_PROGRAMS = {
    "max_people_per_month": 6,
    "courses": [
        {"name": "Drone Operations Awareness", "duration_hours": 4, "price_thb": 25_000},
        {"name": "Sector Safety Protocols", "duration_hours": 4, "price_thb": 30_000},
        {"name": "Building Assessment", "duration_hours": 4, "price_thb": 30_000},
        {"name": "Regulatory Compliance", "duration_hours": 8, "price_thb": 45_000},
        {"name": "Technical Operations", "duration_hours": 16, "price_thb": 75_000},
        {"name": "Portfolio Management", "duration_hours": 8, "price_thb": 55_000},
    ],
    "packages": {
        "fm_team": {"name": "FM Team Package", "courses": 3, "price_thb": 70_000},
        "technical": {"name": "Technical Package", "courses": 5, "price_thb": 190_000, "includes_certification": True},
        "multi_sector": {"name": "Multi-Sector Package", "courses": "all", "price_thb": 320_000, "includes_support": True},
    },
}

# ── Emergency Services ────────────────────────────────────────

EMERGENCY_SERVICES = {
    "callout_fee_thb": 50_000,
    "callout_rate_thb_per_sqm": 60,
    "surcharges": {
        "weekend": 0.30,      # +30%
        "night": 0.25,        # +25%
        "express_48hr": 0.50, # +50%
    },
}

# ── Target Market ─────────────────────────────────────────────

TARGET_MARKET = {
    "buildings_over_90m_bangkok": 400,
    "cleaning_cycles_per_year": 4,
    "primary_segments": [
        "commercial-real-estate", "retail", "industrial",
        "healthcare", "government", "transport",
    ],
    "secondary_segments": [
        "hotels", "education", "data-centres",
        "sporting-facilities", "solar", "mission-critical",
    ],
    "first_mover_advantages": [
        "Establish smart city building management category in Thailand",
        "Set new industry standards for drone-enabled FM",
        "Build irreplaceable data assets via Smart Green Operations",
        "Create long-term strategic partnerships",
        "Position properties as innovation leaders",
    ],
    "market_drivers": [
        "Bangkok smart city initiatives accelerating",
        "ESG requirements intensifying",
        "Safety standards rising globally",
        "Digital transformation imperative",
        "Environmental pressures increasing (PM2.5)",
    ],
}

# ── Agent Names ───────────────────────────────────────────────

AGENT_NAMES = [
    "market_intelligence_strategist",
    "partner_strategy_architect",
    "smart_green_product_orchestrator",
    "financial_model_capital_planner",
    "deal_design_pitch_engineer",
    "sales_playbook_account_selector",
    "operations_compliance_mission_planner",
]
