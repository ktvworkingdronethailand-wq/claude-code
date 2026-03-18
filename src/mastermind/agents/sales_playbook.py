"""
Agent 6: Sales Playbook & Account Selector
Prioritises accounts, designs sector playbooks, proposes pilot structures.
"""

import json
from ..config import IFS_PARTNER, FINANCIAL, TARGET_MARKET, SERVICE_LINES


# Bangkok top accounts database (representative)
ACCOUNT_DATABASE = [
    {"name": "CentralWorld", "sector": "retail", "sqm": 55_000, "owner": "Central Pattana", "route": "ifs"},
    {"name": "Icon Siam", "sector": "retail", "sqm": 75_000, "owner": "Siam Piwat", "route": "ifs"},
    {"name": "One Bangkok", "sector": "commercial-tower", "sqm": 104_000, "owner": "TCC Group", "route": "ifs"},
    {"name": "King Power Mahanakhon", "sector": "commercial-tower", "sqm": 45_000, "owner": "King Power", "route": "ifs"},
    {"name": "Magnolias Waterfront", "sector": "commercial-tower", "sqm": 60_000, "owner": "MQDC", "route": "ifs"},
    {"name": "Siriraj Hospital", "sector": "healthcare", "sqm": 30_000, "owner": "Mahidol University", "route": "ifs"},
    {"name": "Bumrungrad Hospital", "sector": "healthcare", "sqm": 25_000, "owner": "Bumrungrad Int'l", "route": "ifs"},
    {"name": "Suvarnabhumi Airport", "sector": "aviation", "sqm": 120_000, "owner": "AOT", "route": "ifs"},
    {"name": "Map Ta Phut Industrial", "sector": "industrial", "sqm": 50_000, "owner": "IEAT", "route": "ifs"},
    {"name": "PTT Refinery Rayong", "sector": "o_and_g", "sqm": 35_000, "owner": "PTT", "route": "skyller"},
    {"name": "IRPC Refinery", "sector": "o_and_g", "sqm": 28_000, "owner": "IRPC", "route": "skyller"},
    {"name": "True Digital Park", "sector": "campus", "sqm": 42_000, "owner": "True Corp", "route": "ifs"},
    {"name": "Thammasat Rangsit", "sector": "campus", "sqm": 80_000, "owner": "Thammasat University", "route": "ifs"},
    {"name": "Amata City Chonburi", "sector": "industrial", "sqm": 200_000, "owner": "Amata Corp", "route": "ifs"},
    {"name": "The Parq", "sector": "commercial-tower", "sqm": 32_000, "owner": "TCC Group", "route": "ifs"},
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
    result["ranked_accounts"] = accounts[:10]

    # Pilot proposal
    result["pilot_proposal"] = _propose_pilots(accounts, pilot_sites)

    # Sector playbook
    if sector:
        result["sector_playbook"] = _sector_playbook(sector)
    else:
        result["phase1_playbook"] = _phase1_playbook()

    return json.dumps(result, indent=2, default=str)


def _filter_and_rank(sector: str, budget: dict, sort_by: str) -> list:
    accounts = ACCOUNT_DATABASE.copy()

    if sector:
        accounts = [a for a in accounts if a["sector"] == sector]

    if budget:
        min_b = budget.get("min", 0)
        max_b = budget.get("max", float("inf"))
        accounts = [a for a in accounts if min_b <= a["sqm"] * 45 * 4 <= max_b]

    # Score each account
    for a in accounts:
        annual_revenue = a["sqm"] * 45 * 4  # Base price × quarterly
        a["annual_revenue_thb"] = annual_revenue
        a["price_suggestion"] = _suggest_price(a["sector"], a["sqm"])

        if sort_by == "revenue":
            a["score"] = annual_revenue
        elif sort_by == "sqm":
            a["score"] = a["sqm"]
        elif sort_by == "strategic-value":
            strategic_mult = 2 if a["sector"] in {"aviation", "healthcare"} else 1.5 if a["sqm"] > 50000 else 1
            a["score"] = annual_revenue * strategic_mult
        elif sort_by == "ease-of-win":
            ease_mult = 2 if a["sector"] in {"commercial-tower", "campus"} else 1
            a["score"] = annual_revenue * ease_mult
        else:
            a["score"] = annual_revenue

    accounts.sort(key=lambda x: x["score"], reverse=True)
    return accounts


def _suggest_price(sector: str, sqm: int) -> dict:
    base = FINANCIAL["base_price_per_sqm"]
    premiums = {
        "aviation": 1.4,
        "healthcare": 1.2,
        "o_and_g": 1.8,
        "industrial": 1.1,
        "commercial-tower": 1.0,
        "campus": 0.95,
        "retail": 1.1,
    }
    mult = premiums.get(sector, 1.0)
    volume_discount = 0.95 if sqm > 50_000 else 1.0

    suggested = round(base * mult * volume_discount)
    return {
        "suggested_thb_per_sqm": suggested,
        "annual_value_thb": suggested * sqm * 4,
        "rationale": f"Base {base} × {mult} sector premium × {volume_discount} volume",
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
        "success_kpis": [
            "sqm cleaned per cycle",
            "Safety incidents = 0",
            "Time/cost vs rope access baseline",
            "ESG metrics captured in Smart Green",
        ],
    }


def _sector_playbook(sector: str) -> dict:
    playbooks = {
        "commercial-tower": {
            "value_prop": "Eliminate rope access risk, capture ESG data for GRESB reporting",
            "decision_makers": ["Property Manager", "Building Committee", "Juristic Person"],
            "objection_handling": {
                "cost": "Compare total cost vs rope access (insurance, scaffolding, downtime)",
                "safety": "Zero work-at-height incidents, full CAAT compliance, insured",
                "quality": "Consistent coverage tracked by Smart Green; photos/video proof",
            },
            "typical_deal": "8,000-25,000 sqm, quarterly, 45-55 THB/sqm",
            "closing_timeline": "4-6 weeks from first meeting",
        },
        "healthcare": {
            "value_prop": "Infection control compliance, minimal disruption, ESG reporting",
            "decision_makers": ["Hospital Director", "Facilities Head", "Procurement"],
            "objection_handling": {
                "noise": "Electric drones, minimal noise vs traditional methods",
                "schedule": "Night/weekend operations available",
                "compliance": "CAAT certified, insured, documented process",
            },
            "typical_deal": "5,000-30,000 sqm, quarterly, 50-65 THB/sqm",
            "closing_timeline": "6-8 weeks (procurement process)",
        },
        "o_and_g": {
            "value_prop": "ATEX-aware inspection, zero confined-space entry, Skyller expertise",
            "decision_makers": ["Plant Manager", "HSE Director", "Procurement"],
            "route": "Skyller under IFS umbrella",
            "typical_deal": "Premium pricing 60-120 THB/sqm, project-based",
            "closing_timeline": "8-12 weeks (safety approvals)",
        },
    }
    return playbooks.get(sector, {
        "value_prop": "Drone-enabled FM with ESG data capture",
        "route": "IFS",
        "typical_deal": f"Base price {FINANCIAL['base_price_per_sqm']} THB/sqm",
    })


def _phase1_playbook() -> dict:
    return {
        "phase": "Phase 1 — IFS Thailand FM Rollout",
        "priority_sectors": ["commercial-tower", "campus", "healthcare"],
        "target_pilot_sites": 3,
        "strategy": [
            "Lead with IFS relationship — they own the FM contract",
            "Propose 1 commercial tower + 1 campus + 1 industrial as diverse pilots",
            "Use Smart Green ESG data as differentiator in client presentations",
            "Target first revenue within 2-4 weeks of JV signing",
        ],
        "revenue_milestones_thb": IFS_PARTNER["equity_triggers_thb"],
        "kpis": [
            "Pilot sites converted to annual contracts",
            "Safety: zero incidents",
            "Client NPS > 8",
            "Smart Green adoption across all pilot sites",
        ],
    }
