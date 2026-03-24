"""
Agent 6: Sales Playbook & Account Selector (VP Sales)
Prioritises accounts, designs sector playbooks, proposes pilot structures.
Updated: IFS-KTV Integrated FM Solutions Presentation 2026
"""

import json
from ..config import (
    IFS_PARTNER, FINANCIAL, TARGET_MARKET, SERVICE_LINES,
    SECTOR_PRICING, KTV_CARE, EMERGENCY_SERVICES,
)


# Bangkok top accounts database (expanded 2026)
ACCOUNT_DATABASE = [
    # Commercial Real Estate
    {"name": "One Bangkok", "sector": "commercial-offices", "sqm": 104_000, "owner": "TCC Group", "route": "ifs"},
    {"name": "King Power Mahanakhon", "sector": "commercial-offices", "sqm": 45_000, "owner": "King Power", "route": "ifs"},
    {"name": "Magnolias Waterfront", "sector": "commercial-offices", "sqm": 60_000, "owner": "MQDC", "route": "ifs"},
    {"name": "The Parq", "sector": "commercial-offices", "sqm": 32_000, "owner": "TCC Group", "route": "ifs"},
    # Retail
    {"name": "CentralWorld", "sector": "retail", "sqm": 55_000, "owner": "Central Pattana", "route": "ifs"},
    {"name": "Icon Siam", "sector": "retail", "sqm": 75_000, "owner": "Siam Piwat", "route": "ifs"},
    # Healthcare
    {"name": "Siriraj Hospital", "sector": "healthcare", "sqm": 30_000, "owner": "Mahidol University", "route": "ifs"},
    {"name": "Bumrungrad Hospital", "sector": "healthcare", "sqm": 25_000, "owner": "Bumrungrad Int'l", "route": "ifs"},
    # Transport
    {"name": "Suvarnabhumi Airport", "sector": "transport", "sqm": 120_000, "owner": "AOT", "route": "ifs"},
    {"name": "Don Mueang Airport", "sector": "transport", "sqm": 80_000, "owner": "AOT", "route": "ifs"},
    {"name": "BTS Skytrain Stations", "sector": "transport", "sqm": 50_000, "owner": "BTS Group", "route": "ifs"},
    # Industrial
    {"name": "Map Ta Phut Industrial", "sector": "industrial", "sqm": 50_000, "owner": "IEAT", "route": "ifs"},
    {"name": "Amata City Chonburi", "sector": "industrial", "sqm": 200_000, "owner": "Amata Corp", "route": "ifs"},
    # O&G / Energy
    {"name": "PTT Refinery Rayong", "sector": "industrial", "sqm": 35_000, "owner": "PTT", "route": "ifs"},
    {"name": "IRPC Refinery", "sector": "industrial", "sqm": 28_000, "owner": "IRPC", "route": "ifs"},
    # Campus
    {"name": "True Digital Park", "sector": "commercial-offices", "sqm": 42_000, "owner": "True Corp", "route": "ifs"},
    {"name": "Thammasat Rangsit", "sector": "education-private", "sqm": 80_000, "owner": "Thammasat University", "route": "ifs"},
    # Government
    {"name": "BMA District Offices", "sector": "government", "sqm": 60_000, "owner": "Bangkok Metropolitan Administration", "route": "ifs"},
    {"name": "Ministry of Education Complex", "sector": "government", "sqm": 45_000, "owner": "Ministry of Education", "route": "ifs"},
    # Hotels
    {"name": "Mandarin Oriental Bangkok", "sector": "hotels", "sqm": 20_000, "owner": "Mandarin Oriental", "route": "ifs"},
    {"name": "Centara Grand at CentralWorld", "sector": "hotels", "sqm": 35_000, "owner": "Central Group", "route": "ifs"},
    # Data Centres
    {"name": "True IDC Bangkok", "sector": "mission-critical", "sqm": 25_000, "owner": "True Corp", "route": "ifs"},
    {"name": "ST Telemedia Bangkok", "sector": "mission-critical", "sqm": 30_000, "owner": "ST Telemedia", "route": "ifs"},
    # Solar
    {"name": "EGAT Solar Farm Lopburi", "sector": "solar", "sqm": 80_000, "owner": "EGAT", "route": "ifs"},
]


def handle(params: dict) -> str:
    task = params.get("task", "")
    sector = params.get("sector", "")
    budget_range = params.get("budget_range_thb", {})
    pilot_sites = params.get("pilot_sites", 3)
    prioritise_by = params.get("prioritise_by", "revenue")

    result = {
        "agent": "sales_playbook_account_selector",
        "task": task,
    }

    # Account ranking
    accounts = _filter_and_rank(sector, budget_range, prioritise_by)
    result["ranked_accounts"] = accounts[:15]

    # Pilot proposal
    result["pilot_proposal"] = _propose_pilots(accounts, pilot_sites)

    # Sector playbook
    if sector:
        result["sector_playbook"] = _sector_playbook(sector)
    else:
        result["phase1_playbook"] = _phase1_playbook()

    return json.dumps(result, indent=2, default=str)


def _filter_and_rank(sector: str, budget: dict, sort_by: str) -> list:
    accounts = [a.copy() for a in ACCOUNT_DATABASE]

    if sector:
        accounts = [a for a in accounts if a["sector"] == sector]

    if budget:
        min_b = budget.get("min", 0)
        max_b = budget.get("max", float("inf"))
        accounts = [a for a in accounts
                     if min_b <= a["sqm"] * _get_sector_rate(a["sector"]) * 4 <= max_b]

    # Score each account
    for a in accounts:
        rate = _get_sector_rate(a["sector"])
        annual_revenue = a["sqm"] * rate * 4  # Quarterly
        a["annual_revenue_thb"] = annual_revenue
        a["price_suggestion"] = _suggest_price(a["sector"], a["sqm"])

        if sort_by == "revenue":
            a["score"] = annual_revenue
        elif sort_by == "sqm":
            a["score"] = a["sqm"]
        elif sort_by == "strategic-value":
            strategic_mult = 2 if a["sector"] in {"transport", "mission-critical", "government"} else 1.5 if a["sqm"] > 50000 else 1
            a["score"] = annual_revenue * strategic_mult
        elif sort_by == "ease-of-win":
            ease_mult = 2 if a["sector"] in {"commercial-offices", "retail"} else 1
            a["score"] = annual_revenue * ease_mult
        else:
            a["score"] = annual_revenue

    accounts.sort(key=lambda x: x["score"], reverse=True)
    return accounts


def _get_sector_rate(sector: str) -> float:
    return SECTOR_PRICING.get(sector, {}).get("rate_thb", FINANCIAL["base_price_per_sqm"])


def _suggest_price(sector: str, sqm: int) -> dict:
    rate = _get_sector_rate(sector)
    adjustment = SECTOR_PRICING.get(sector, {}).get("adjustment", "Base rate")
    volume_discount = 0.95 if sqm > 50_000 else 1.0

    suggested = round(rate * volume_discount)
    return {
        "suggested_thb_per_sqm": suggested,
        "sector_rate": rate,
        "adjustment": adjustment,
        "annual_value_thb": suggested * sqm * 4,
        "care_36month_value_thb": suggested * sqm * 4 * 3,  # KTV CARE 36-month
        "rationale": f"Sector rate {rate} THB × {volume_discount} volume",
    }


def _propose_pilots(accounts: list, count: int) -> dict:
    pilots = accounts[:count]
    total_sqm = sum(p["sqm"] for p in pilots)
    total_rev = sum(p.get("annual_revenue_thb", 0) for p in pilots)

    return {
        "pilot_count": len(pilots),
        "sites": [
            {
                "name": p["name"],
                "sector": p["sector"],
                "sqm": p["sqm"],
                "route": p["route"],
                "estimated_annual_thb": p.get("annual_revenue_thb", 0),
            }
            for p in pilots
        ],
        "total_pilot_sqm": total_sqm,
        "total_pilot_revenue_thb": total_rev,
        "pilot_duration": "3 months",
        "conversion_path": f"Pilot → KTV CARE Agreement ({KTV_CARE['minimum_commitment_months']}-month)",
        "complimentary_assessment": True,
        "success_kpis": [
            "sqm cleaned per cycle vs target",
            "Safety incidents = 0",
            "80% faster than rope access baseline",
            "96% GHG reduction documented",
            "ESG metrics captured in Smart Green",
        ],
    }


def _sector_playbook(sector: str) -> dict:
    playbooks = {
        "commercial-offices": {
            "value_prop": "Eliminate rope access risk, 80% faster cleaning, ESG data for GRESB reporting",
            "decision_makers": ["Property Manager", "Building Committee", "Juristic Person"],
            "objection_handling": {
                "cost": "Compare total cost vs rope access (insurance, scaffolding, downtime). 80% faster = less disruption",
                "safety": "Zero work-at-height incidents, full CAAT compliance, insured",
                "quality": "Consistent coverage tracked by Smart Green; photos/video proof per mission",
                "data": "Smart Green provides complete work history and predictive maintenance",
            },
            "typical_deal": f"20,000-100,000 sqm, quarterly, {SECTOR_PRICING['commercial-offices']['rate_thb']} THB/sqm",
            "closing_timeline": "4-6 weeks from first meeting",
            "conversion": f"KTV CARE Agreement ({KTV_CARE['minimum_commitment_months']}-month minimum)",
        },
        "healthcare": {
            "value_prop": "Infection control compliance, minimal disruption, ESG reporting, zero risk",
            "decision_makers": ["Hospital Director", "Facilities Head", "Procurement"],
            "objection_handling": {
                "noise": "Autonomous drones, minimal noise vs traditional methods",
                "schedule": "Night/weekend operations available (+25-30% surcharge)",
                "compliance": "CAAT certified, insured, documented process, Smart Green audit trail",
            },
            "typical_deal": f"20,000-30,000 sqm, quarterly, 30 THB/sqm",
            "closing_timeline": "6-8 weeks (procurement process)",
        },
        "industrial": {
            "value_prop": "ATEX-aware inspection, zero confined-space entry, 96% emissions reduction",
            "decision_makers": ["Plant Manager", "HSE Director", "Procurement"],
            "typical_deal": f"20,000+ sqm, bi-annual, {SECTOR_PRICING['industrial']['rate_thb']} THB/sqm",
            "closing_timeline": "8-12 weeks (safety approvals)",
        },
        "government": {
            "value_prop": "Smart city alignment, multi-year contracts, PM2.5 control, cost efficiency",
            "decision_makers": ["Director General", "Procurement Office", "BMA Officials"],
            "opportunities": IFS_PARTNER["government_opportunities"],
            "typical_deal": f"20,000+ sqm, quarterly, {SECTOR_PRICING['government']['rate_thb']} THB/sqm",
            "closing_timeline": "8-16 weeks (government procurement)",
        },
        "mission-critical": {
            "value_prop": "Data centre-grade maintenance, zero disruption, mission-critical SLAs",
            "decision_makers": ["Data Centre Manager", "Facilities Director", "Operations VP"],
            "typical_deal": f"20,000+ sqm, quarterly, {SECTOR_PRICING['mission-critical']['rate_thb']} THB/sqm",
            "closing_timeline": "6-10 weeks",
            "strategic_note": "Thailand emerging as ASEAN data centre hub — high growth",
        },
        "transport": {
            "value_prop": "Security-compliant, rapid deployment, zero disruption to operations",
            "decision_makers": ["Airport Director", "Station Manager", "AOT Procurement"],
            "typical_deal": f"50,000+ sqm, quarterly, {SECTOR_PRICING['transport']['rate_thb']} THB/sqm",
            "closing_timeline": "8-12 weeks (security approvals)",
        },
        "hotels": {
            "value_prop": "Guest-invisible cleaning, premium appearance, ESG for luxury brands",
            "decision_makers": ["General Manager", "Engineering Director", "Asset Management"],
            "typical_deal": f"20,000+ sqm, quarterly, {SECTOR_PRICING['hotels']['rate_thb']} THB/sqm",
            "closing_timeline": "4-6 weeks",
        },
    }
    return playbooks.get(sector, {
        "value_prop": "Autonomous drone-enabled FM with ESG data capture",
        "route": "IFS",
        "typical_deal": f"From {FINANCIAL['base_price_per_sqm']} THB/sqm, min {FINANCIAL['minimum_order_sqm']:,} sqm",
    })


def _phase1_playbook() -> dict:
    return {
        "phase": "Phase 1 — IFS Thailand FM Rollout",
        "priority_sectors": ["commercial-offices", "government", "transport", "mission-critical"],
        "target_pilot_sites": 3,
        "strategy": [
            "Lead with IFS relationship — they own the FM contract (40+ years heritage)",
            "Offer complimentary building assessment to every prospect",
            "Propose diverse pilot: 1 commercial + 1 government/transport + 1 data centre",
            "Use Smart Green ESG data as key differentiator (80% faster, 96% lower GHG, 100% risk reduction)",
            "Convert pilots to KTV CARE Agreements (36-month minimum)",
            "Target first revenue within 2-4 weeks of JV signing",
        ],
        "revenue_milestones_thb": IFS_PARTNER["equity_triggers_thb"],
        "emergency_upsell": {
            "callout_fee": f"{EMERGENCY_SERVICES['callout_fee_thb']:,} THB + {EMERGENCY_SERVICES['callout_rate_thb_per_sqm']} THB/sqm",
            "surcharges": EMERGENCY_SERVICES["surcharges"],
        },
        "kpis": [
            "Pilot sites converted to KTV CARE annual contracts",
            "Safety: zero incidents",
            "Client NPS > 8",
            "Smart Green adoption across all pilot sites",
            "80% faster cleaning vs rope access documented",
        ],
    }
