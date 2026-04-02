"""
Agent 1: Market Intelligence Strategist (Chief Market Officer)
Maps Thailand FM and drone/DaaS markets with TAM/SAM/SOM analysis.
Updated: IFS-KTV Integrated FM Solutions Presentation 2026
"""

import json
from ..config import TARGET_MARKET, SERVICE_LINES, FINANCIAL, IFS_PARTNER, SECTOR_PRICING


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
        "growth_drivers": TARGET_MARKET["market_drivers"],
        "first_mover_advantages": TARGET_MARKET["first_mover_advantages"],
        "competitive_landscape": {
            "rope_access": "Dominant but high risk, expensive, slow",
            "other_drone_ops": "Fragmented, no ESG/GRESB integration, no BMS/CMMS integration",
            "ktv_advantage": (
                "World's only certified autonomous drone cleaning provider. "
                "GRESB-ready, Smart Green Operations platform, 30+ years sensor tech, "
                "patented roof safety system, smart city BMS integration"
            ),
        },
        "key_differentiators": {
            "speed": "80% faster than traditional methods",
            "emissions": "96% GHG reduction vs conventional",
            "safety": "100% elimination of high-risk manual tasks",
        },
    }

    sector_insights = {
        "commercial-real-estate": {
            "buildings_bangkok": 400,
            "avg_sqm_per_building": 12_000,
            "cycles_per_year": 4,
            "total_addressable_sqm": 19_200_000,
            "price_thb_sqm": SECTOR_PRICING["commercial-offices"]["rate_thb"],
            "decision_maker": "Property manager / building committee",
            "route": "IFS",
        },
        "healthcare": {
            "hospitals_bangkok": 130,
            "avg_sqm": 5_000,
            "cycles_per_year": 4,
            "price_thb_sqm": 30,
            "compliance_critical": True,
            "route": "IFS",
        },
        "industrial": {
            "factories_eastern_seaboard": 3_000,
            "avg_sqm": 8_000,
            "cycles_per_year": 2,
            "price_thb_sqm": SECTOR_PRICING["industrial"]["rate_thb"],
            "route": "IFS",
        },
        "government": {
            "opportunities": IFS_PARTNER["government_opportunities"],
            "avg_sqm": 15_000,
            "cycles_per_year": 4,
            "price_thb_sqm": SECTOR_PRICING["government"]["rate_thb"],
            "route": "IFS",
            "strategic_note": "Smart city contracts, multi-year, high volume",
        },
        "transport": {
            "airports_thailand": 38,
            "large_airports": 6,
            "train_stations": 50,
            "avg_sqm": 50_000,
            "price_thb_sqm": SECTOR_PRICING["transport"]["rate_thb"],
            "security_clearance": True,
            "route": "IFS",
        },
        "o_and_g": {
            "refineries_thailand": 7,
            "offshore_platforms": 300,
            "pipeline_km": 4_500,
            "price_thb_sqm": 60,
            "premium_note": "Premium hazardous environment pricing",
            "route": "IFS",
        },
        "data-centres": {
            "strategic_note": "Thailand emerging as ASEAN data centre hub",
            "avg_sqm": 20_000,
            "cycles_per_year": 4,
            "price_thb_sqm": SECTOR_PRICING["mission-critical"]["rate_thb"],
            "mission_critical": True,
            "route": "IFS",
        },
        "hotels": {
            "hotels_bangkok": 800,
            "avg_sqm": 8_000,
            "cycles_per_year": 4,
            "price_thb_sqm": SECTOR_PRICING["hotels"]["rate_thb"],
            "route": "IFS",
        },
        "education": {
            "universities_thailand": 170,
            "schools_bangkok": 2_000,
            "avg_sqm": 15_000,
            "cycles_per_year": 4,
            "price_private_thb": SECTOR_PRICING["education-private"]["rate_thb"],
            "price_government_thb": SECTOR_PRICING["education-government"]["rate_thb"],
            "route": "IFS",
        },
        "solar": {
            "solar_farms_thailand": 200,
            "avg_sqm": 30_000,
            "cycles_per_year": 2,
            "price_thb_sqm": 30,
            "route": "IFS",
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
            "Phase 1: commercial real estate and government via IFS — "
            "highest sqm density, recurring revenue, smart city alignment. "
            "Data centres as premium mission-critical tier. "
            "O&G via IFS for high-margin premium pricing."
        ),
    }

    return json.dumps(result, indent=2, default=str)


def _rank_opportunities(sectors: dict) -> list:
    """Rank sectors by estimated addressable revenue."""
    ranked = []
    for name, data in sectors.items():
        sqm = data.get("avg_sqm", data.get("avg_sqm_per_building", 0)) * data.get("cycles_per_year", 1)
        count = data.get(
            "buildings_bangkok",
            data.get("hospitals_bangkok", data.get(
                "factories_eastern_seaboard", data.get(
                    "airports_thailand", data.get("hotels_bangkok", 10)
                )
            ))
        )
        total_sqm = sqm * min(count, 50)  # Realistic capture in Year 1
        price = data.get("price_thb_sqm", FINANCIAL["base_price_per_sqm"])
        revenue = total_sqm * price
        ranked.append({
            "sector": name,
            "estimated_sqm_year1": total_sqm,
            "estimated_revenue_thb": revenue,
            "price_thb_sqm": price,
            "route": data.get("route", "IFS"),
            "priority": "high" if revenue > 10_000_000 else "medium",
        })
    ranked.sort(key=lambda x: x["estimated_revenue_thb"], reverse=True)
    return ranked
