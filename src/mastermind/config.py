"""
KTV Mastermind — Configuration & Constants
All strategic, financial, and partner data in one place.
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
}

# ── JV Structure ──────────────────────────────────────────────

JV_STRUCTURE = {
    "ktv": {"stake": 50, "role": "Control, technology owner, brand and operating framework"},
    "ifs": {"stake_max": 25, "role": "Exclusive FM channel in Thailand"},
    "skyller": {"stake_max": 25, "role": "Exclusive O&G drone cleaning and inspection partner under IFS"},
    "governance": {
        "board_control": "ktv",
        "board_seats": ["ktv", "ifs", "skyller"],
        "reserved_matters": True,
        "buyout_mechanisms": True,
    },
    "equity_caps_strict": True,
}

# ── IFS Thailand ──────────────────────────────────────────────

IFS_PARTNER = {
    "name": "IFS Thailand",
    "role": "Exclusive FM partner",
    "sectors": [
        "Aviation", "Business & IT", "Healthcare",
        "Energy & Resources", "Manufacturing & Industry",
        "Commercial Towers", "Campuses",
    ],
    "exclusive_fm": True,
    "no_competing_providers": True,
    "equity_triggers_thb": [32_000_000, 64_000_000, 160_000_000],
    "smart_green_milestones": {"min_sites": 5, "min_months": 3},
    "fm_scope": [
        "General building FM: commercial towers, offices, campuses, retail",
        "Healthcare, education, airports",
        "Facade/window/solar cleaning via KTV drones",
        "Core FM services with ESG data reporting",
    ],
    "sales_messaging": [
        "You already own the FM relationship; we plug in world-class drones and ESG data.",
        "We turn risky, manual facade cleaning into a digital, data-driven service.",
        "Your clients see measurable safety and ESG gains via Smart Green Operations.",
    ],
}

# ── Skyller ────────────────────────────────────────────────────

SKYLLER_PARTNER = {
    "name": "Skyller",
    "role": "Specialist O&G drone inspection and industrial cleaning partner",
    "backing": "VC-backed",
    "expertise": ["O&G", "hazardous environments", "industrial inspection"],
    "channel_position": "Under IFS umbrella for Energy & Resources, Transport, Manufacturing",
    "equity_max": 25,
    "og_scope": [
        "O&G assets, flares, tanks, vessels, pipelines, refineries",
        "Hazardous sites inspection and safety operations",
        "KTV adds cleaning/surface treatment where relevant",
    ],
    "no_competing_fm_channel": True,
}

# ── Smart Green Operations ────────────────────────────────────

SMART_GREEN = {
    "name": "Smart Green Operations",
    "description": "Smart, green operations platform linking autonomous drones, ESG data, and FM workflows",
    "core_functions": [
        "Orchestrates drone missions and work orders across multiple sites",
        "Captures telemetry: sqm cleaned, water/chemical consumption, time at height avoided, energy",
        "Produces cryptographically verifiable ESG metrics for GRESB and green building reporting",
    ],
    "telemetry_fields": [
        "sqm_cleaned", "water_consumption_liters", "chemical_consumption_liters",
        "time_at_height_avoided_minutes", "energy_usage_kwh",
        "safety_incidents", "mission_duration_minutes",
    ],
    "differentiators": [
        "Only drone ops platform positioned as GRESB-ready for FM operators",
        "Converts drone cleaning from one-off jobs into recurring, data-rich FM service",
        "Future-proof ESG and digital FM layer for Thailand and SE Asia",
    ],
}

# ── Financial Base Case ───────────────────────────────────────

FINANCIAL = {
    "currency": "THB",
    "fx_usd_thb": 35.5,
    "base_price_per_sqm": 45,
    "market_range": {"low": 15, "high": 70},
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

# ── Service Lines ─────────────────────────────────────────────

SERVICE_LINES = {
    "facade-cleaning": {"name": "Facade Cleaning", "base_thb": 45, "premium_thb": 70, "unit": "sqm"},
    "building-inspection": {"name": "Building Inspection", "base_thb": 15_000, "premium_thb": 80_000, "unit": "project"},
    "agricultural-spraying": {"name": "Agricultural Spraying", "base_thb": 80, "premium_thb": 120, "unit": "rai"},
    "survey-mapping": {"name": "Aerial Survey & Mapping", "base_thb": 15_000, "premium_thb": 80_000, "unit": "project"},
    "media-production": {"name": "Media Production", "base_thb": 15_000, "premium_thb": 150_000, "unit": "project"},
    "training-academy": {"name": "CAAT Pilot Training", "base_thb": 25_000, "premium_thb": 100_000, "unit": "course"},
}

# ── Target Market ─────────────────────────────────────────────

TARGET_MARKET = {
    "buildings_over_90m_bangkok": 400,
    "cleaning_cycles_per_year": 4,
    "primary_segments": ["condominiums", "office-towers", "hotels", "shopping-malls"],
    "secondary_segments": ["industrial", "government", "temples"],
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
