"""
Agent 2: Partner Strategy Architect
Applies JV rules, routes opportunities, tracks equity milestones.
"""

import json
from ..config import JV_STRUCTURE, IFS_PARTNER


# Sectors that route through IFS (FM)
IFS_SECTORS = set(s.lower().replace(" ", "-").replace("&", "and") for s in IFS_PARTNER["sectors"])


def handle(params: dict) -> str:
    task = params.get("task", "")
    opportunity = params.get("opportunity", {})
    check_equity = params.get("check_equity_impact", False)

    result = {
        "agent": "partner_strategy_architect",
        "task": task,
        "jv_structure": {
            "ktv": f"{JV_STRUCTURE['ktv']['stake']}% (control)",
            "ifs": f"up to {JV_STRUCTURE['ifs']['stake_max']}% (FM channel)",
        },
    }

    if opportunity:
        routing = _route_opportunity(opportunity)
        result["routing_decision"] = routing

        if check_equity:
            result["equity_impact"] = _assess_equity_impact(opportunity, routing)

    # Channel rules reminder
    result["channel_rules"] = {
        "fm_thailand": "All drone-enabled FM goes through IFS within its FM portfolio",
        "no_conflict": [
            "IFS does not build competing drone cleaning stack outside JV",
        ],
    }

    return json.dumps(result, indent=2, default=str)


def _route_opportunity(opp: dict) -> dict:
    sector = (opp.get("sector", "") or "").lower().replace(" ", "-")
    service = (opp.get("service_type", "") or "").lower()

    # FM sectors → IFS
    is_fm = any(s in sector for s in IFS_SECTORS) or sector in {
        "commercial-towers", "offices", "campuses", "retail",
        "healthcare", "education", "airports", "condominiums",
        "o_and_g", "oil-gas", "refinery", "industrial",
    }
    if is_fm or service in {"facade-cleaning", "building-inspection", "solar-cleaning", "inspection"}:
        return {
            "route": "ifs",
            "channel": "IFS FM portfolio",
            "lead_partner": "IFS Thailand",
            "ktv_role": "Drone operations + Smart Green data layer",
            "rationale": "FM sector within IFS exclusive scope",
            "constraints": [
                "KTV does not partner with competing FM providers",
                "ESG reporting via Smart Green Operations",
                "Standard IFS contract framework",
            ],
        }

    # Everything else → Direct KTV (agriculture, media, training, etc.)
    return {
        "route": "direct-ktv",
        "channel": "KTV direct",
        "lead_partner": "KTV Working Drone Thailand",
        "ktv_role": "Full service provider",
        "rationale": "Outside IFS exclusive scope — KTV operates directly",
        "constraints": ["Standard KTV pricing and terms apply"],
    }


def _assess_equity_impact(opp: dict, routing: dict) -> dict:
    revenue = opp.get("estimated_revenue_thb", 0)
    sqm = opp.get("estimated_sqm", 0)
    route = routing.get("route", "direct-ktv")

    triggers = IFS_PARTNER["equity_triggers_thb"]

    if route == "ifs":
        return {
            "partner": "IFS",
            "revenue_contribution": revenue,
            "sqm_contribution": sqm,
            "next_milestone_thb": _next_milestone(revenue, triggers),
            "milestone_progress": f"This deal contributes {revenue:,.0f} THB toward IFS equity milestones",
        }
    return {"partner": "N/A", "note": "Direct KTV deals do not affect partner equity"}


def _next_milestone(cumulative_revenue: float, thresholds: list) -> str:
    for t in thresholds:
        if cumulative_revenue < t:
            return f"THB {t:,.0f} (need {t - cumulative_revenue:,.0f} more)"
    return "All milestones achieved"
