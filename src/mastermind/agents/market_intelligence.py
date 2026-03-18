"""
Agent 1: Market Intelligence Strategist
Maps Thailand FM and drone/DaaS markets with TAM/SAM/SOM analysis.
"""

import json
from ..config import TARGET_MARKET, SERVICE_LINES, FINANCIAL, IFS_PARTNER


def handle(params: dict) -> str:
    task = params.get("task", "")
    sectors = params.get("sectors", [])
    region = params.get("region", "Bangkok/Thailand")
    depth = params.get("depth", "standard")

    # Thailand FM & Drone Market Intelligence
    market_data = {
        "thailand_fm_market": {
            "tam_thb": 85_000_000_000,  # THB 85B total FM market
            "drone_addressable_pct": 8,
            "sam_thb": 6_800_000_000,   # THB 6.8B drone-addressable FM
            "ktv_target_som_pct": 2.65,
            "som_thb": 180_180_000,     # Year 1 target
        },
        "growth_drivers": [
            "400+ buildings over 90m in Bangkok alone",
            "Quarterly cleaning cycles (tropical climate)",
            "Increasing ESG reporting requirements",
            "Government push for smart city and digital services",
            "Work-at-height safety regulations tightening",
        ],
        "competitive_landscape": {
            "rope_access": "Dominant but high risk, expensive, slow",
            "other_drone_ops": "Fragmented, no ESG/GRESB integration",
            "ktv_advantage": "Only GRESB-ready, data-rich drone FM platform",
        },
    }

    sector_insights = {
        "commercial-towers": {
            "buildings_bangkok": 400,
            "avg_sqm_per_building": 12_000,
            "cycles_per_year": 4,
            "total_addressable_sqm": 19_200_000,
            "price_range_thb": "35-70/sqm",
            "decision_maker": "Property manager / building committee",
            "route": "IFS",
        },
        "healthcare": {
            "hospitals_bangkok": 130,
            "avg_sqm": 5_000,
            "cycles_per_year": 4,
            "price_range_thb": "45-65/sqm",
            "compliance_critical": True,
            "route": "IFS",
        },
        "industrial": {
            "factories_eastern_seaboard": 3_000,
            "avg_sqm": 8_000,
            "cycles_per_year": 2,
            "price_range_thb": "40-60/sqm",
            "route": "IFS (general) / Skyller (O&G/hazardous)",
        },
        "aviation": {
            "airports_thailand": 38,
            "large_airports": 6,
            "avg_sqm": 50_000,
            "price_range_thb": "45-70/sqm",
            "security_clearance": True,
            "route": "IFS",
        },
        "o_and_g": {
            "refineries_thailand": 7,
            "offshore_platforms": 300,
            "pipeline_km": 4_500,
            "price_range_thb": "60-120/sqm (premium hazardous)",
            "route": "Skyller under IFS",
        },
    }

    # Filter by requested sectors
    if sectors:
        sector_insights = {k: v for k, v in sector_insights.items() if k in sectors}

    result = {
        "agent": "market_intelligence_strategist",
        "task": task,
        "region": region,
        "depth": depth,
        "market_overview": market_data,
        "sector_insights": sector_insights,
        "top_opportunities": _rank_opportunities(sector_insights),
        "recommendation": (
            "Phase 1 should focus on commercial towers and campuses via IFS — "
            "highest sqm density, recurring revenue, and clear ESG value proposition. "
            "O&G via Skyller as high-margin premium tier."
        ),
    }

    return json.dumps(result, indent=2, default=str)


def _rank_opportunities(sectors: dict) -> list:
    """Rank sectors by estimated addressable revenue."""
    ranked = []
    for name, data in sectors.items():
        sqm = data.get("avg_sqm", 0) * data.get("cycles_per_year", 1)
        count = data.get("buildings_bangkok", data.get("hospitals_bangkok",
                data.get("factories_eastern_seaboard", data.get("airports_thailand", 10))))
        total_sqm = sqm * min(count, 50)  # Realistic capture in Year 1
        revenue = total_sqm * 45  # Base price
        ranked.append({
            "sector": name,
            "estimated_sqm_year1": total_sqm,
            "estimated_revenue_thb": revenue,
            "route": data.get("route", "IFS"),
            "priority": "high" if revenue > 10_000_000 else "medium",
        })
    ranked.sort(key=lambda x: x["estimated_revenue_thb"], reverse=True)
    return ranked
