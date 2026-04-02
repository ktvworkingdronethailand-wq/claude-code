"""
Agent 4: Financial Model & Capital Planner (Chief Financial Officer)
Evaluates deals against KTV Thailand's 3-year model with guardrail checks.
Updated: IFS-KTV Integrated FM Solutions Presentation 2026
"""

import json
import math
from ..config import (
    FINANCIAL, SERVICE_LINES, PHASE1, SECTOR_PRICING,
    TRAINING_PROGRAMS, EMERGENCY_SERVICES, KTV_CARE,
)


def handle(params: dict) -> str:
    task = params.get("task", "")
    deal = params.get("deal", {})
    scenario = params.get("scenario", "base")
    check_guardrails = params.get("check_guardrails", True)
    include_training = params.get("include_training", False)
    include_care = params.get("include_care", False)

    result = {
        "agent": "financial_model_capital_planner",
        "task": task,
        "scenario": scenario,
        "base_case": {
            "base_price_sqm": FINANCIAL["base_price_per_sqm"],
            "minimum_order_sqm": FINANCIAL["minimum_order_sqm"],
            "year1_revenue": FINANCIAL["year1"]["gross_revenue"],
            "year1_net_income": FINANCIAL["year1"]["net_income"],
            "year1_fcf": FINANCIAL["year1"]["free_cash_flow"],
            "irr": FINANCIAL["irr_range"],
            "payback": FINANCIAL["payback_months"],
        },
    }

    if deal:
        analysis = _analyze_deal(deal, scenario)
        result["deal_analysis"] = analysis

        if check_guardrails:
            result["guardrail_check"] = _check_guardrails(deal, analysis)

    if include_training:
        result["training_revenue"] = _training_revenue()

    if include_care:
        result["care_agreement_value"] = _care_agreement_value(deal)

    result["sector_pricing"] = {k: v for k, v in SECTOR_PRICING.items()}
    result["capacity_summary"] = _capacity_check()

    return json.dumps(result, indent=2, default=str)


def _analyze_deal(deal: dict, scenario: str) -> dict:
    sqm = deal.get("sqm_annual", 0)
    sector = deal.get("sector", "commercial-offices")

    # Get sector-specific pricing
    sector_rate = SECTOR_PRICING.get(sector, {}).get("rate_thb", FINANCIAL["base_price_per_sqm"])
    price = deal.get("price_per_sqm", sector_rate)
    years = deal.get("contract_years", 1)
    frequency = deal.get("frequency", "quarterly")
    service = deal.get("service_line", "facade-cleaning")

    # Check minimum order
    min_order = FINANCIAL["minimum_order_sqm"]
    below_minimum = sqm > 0 and (sqm / max({"quarterly": 4, "monthly": 12, "biannual": 2, "annual": 1}.get(frequency, 4), 1)) < min_order

    # Revenue
    annual_revenue = sqm * price
    total_revenue = annual_revenue * years

    # Scenario multipliers
    multipliers = {"conservative": 0.75, "base": 1.0, "aggressive": 1.25}
    mult = multipliers.get(scenario, 1.0)
    annual_revenue *= mult
    total_revenue *= mult

    # EBITDA margin
    ebitda_margin = 0.65
    ebitda = annual_revenue * ebitda_margin

    # Tax impact
    vat = annual_revenue * FINANCIAL["tax"]["vat_pct"] / 100
    royalty = annual_revenue * FINANCIAL["tax"]["royalty_pct"] / 100
    corp_tax = ebitda * FINANCIAL["tax"]["corporate_tax_pct"] / 100
    net_income = ebitda - royalty - corp_tax

    # Payback
    setup_cost = 2_500_000
    payback_months = (setup_cost / (net_income / 12)) if net_income > 0 else float("inf")

    # NPV (10% discount rate)
    discount_rate = 0.10
    npv = sum(net_income / ((1 + discount_rate) ** y) for y in range(1, years + 1)) - setup_cost

    # IRR approximation
    irr = (net_income / setup_cost) * 100 if setup_cost > 0 else 0

    # Drone hours
    sqm_per_hour = 500
    hours_per_cycle = sqm / sqm_per_hour if sqm > 0 else 0
    cycles = {"quarterly": 4, "monthly": 12, "biannual": 2, "annual": 1}.get(frequency, 4)
    annual_drone_hours = hours_per_cycle * cycles

    result = {
        "sector": sector,
        "sector_rate_thb": sector_rate,
        "annual_revenue_thb": round(annual_revenue),
        "total_contract_value_thb": round(total_revenue),
        "ebitda_thb": round(ebitda),
        "ebitda_margin_pct": round(ebitda_margin * 100, 1),
        "net_income_thb": round(net_income),
        "vat_thb": round(vat),
        "royalty_thb": round(royalty),
        "corporate_tax_thb": round(corp_tax),
        "setup_cost_thb": setup_cost,
        "payback_months": round(payback_months, 1),
        "npv_thb": round(npv),
        "irr_pct": round(irr, 1),
        "annual_drone_hours": round(annual_drone_hours),
        "price_vs_sector": f"{price} vs {sector_rate} THB/sqm sector rate",
    }

    if below_minimum:
        result["minimum_order_warning"] = f"Per-cycle sqm below {min_order:,} minimum order"

    return result


def _check_guardrails(deal: dict, analysis: dict) -> dict:
    flags = []
    warnings = []
    status = "PASS"

    # Payback check
    payback = analysis.get("payback_months", 999)
    if payback > FINANCIAL["guardrails"]["max_payback_months"]:
        flags.append(f"Payback {payback:.0f} months exceeds {FINANCIAL['guardrails']['max_payback_months']} month limit")
        status = "FAIL"
    elif payback > 12:
        warnings.append(f"Payback {payback:.0f} months — acceptable but not ideal (target <12)")

    # Margin check
    margin = analysis.get("ebitda_margin_pct", 0)
    if margin < 40:
        flags.append(f"EBITDA margin {margin}% is below healthy threshold (40%+)")
        status = "FAIL"
    elif margin < 55:
        warnings.append(f"EBITDA margin {margin}% — monitor closely")

    # Price check (updated for 2026 pricing)
    price = deal.get("price_per_sqm", 30)
    if price < FINANCIAL["market_range"]["low"]:
        flags.append(f"Price {price} THB/sqm below market floor ({FINANCIAL['market_range']['low']})")
        status = "FAIL"

    # Minimum order check
    if analysis.get("minimum_order_warning"):
        warnings.append(analysis["minimum_order_warning"])

    # Fleet capacity
    hours = analysis.get("annual_drone_hours", 0)
    if hours > 2000:
        flags.append(f"Requires {hours} drone-hours/year — needs dedicated fleet allocation")
    elif hours > 1000:
        warnings.append(f"{hours} drone-hours/year — significant fleet commitment")

    # NPV check
    if analysis.get("npv_thb", 0) < 0:
        flags.append("Negative NPV — deal destroys value at 10% discount rate")
        status = "FAIL"

    if flags:
        status = "FAIL"

    return {
        "status": status,
        "flags": flags,
        "warnings": warnings,
        "recommendation": (
            "Deal passes financial guardrails" if status == "PASS"
            else "Deal requires restructuring — address flagged issues before proceeding"
        ),
    }


def _training_revenue() -> dict:
    """Calculate potential training program revenue."""
    courses = TRAINING_PROGRAMS["courses"]
    packages = TRAINING_PROGRAMS["packages"]
    return {
        "individual_courses": [
            {"name": c["name"], "price_thb": c["price_thb"], "duration_hours": c["duration_hours"]}
            for c in courses
        ],
        "packages": {
            k: {"name": v["name"], "price_thb": v["price_thb"]}
            for k, v in packages.items()
        },
        "max_capacity_per_month": TRAINING_PROGRAMS["max_people_per_month"],
        "max_monthly_revenue_thb": packages["multi_sector"]["price_thb"] * 6,  # 6 people × top package
    }


def _care_agreement_value(deal: dict) -> dict:
    """Calculate KTV CARE agreement value."""
    sqm = deal.get("sqm_annual", 0)
    price = deal.get("price_per_sqm", FINANCIAL["base_price_per_sqm"])
    annual = sqm * price
    return {
        "agreement_type": KTV_CARE["name"],
        "minimum_term_months": KTV_CARE["minimum_commitment_months"],
        "annual_value_thb": round(annual),
        "total_contract_value_thb": round(annual * 3),  # 36-month minimum
        "includes": KTV_CARE["includes"],
    }


def _capacity_check() -> dict:
    year1 = FINANCIAL["year1"]
    sqm = year1["implied_sqm"]
    hours = sqm / 500
    drones_needed = math.ceil(hours / (250 * 6))

    return {
        "year1_target_sqm": sqm,
        "estimated_drone_hours": round(hours),
        "drones_needed": drones_needed,
        "fleet_utilisation_note": f"~{drones_needed} drones at 80% utilisation for Year 1 target",
        "capex_thb": FINANCIAL["capital"]["total_equity_thb"],
        "runway_months": round(FINANCIAL["capital"]["total_equity_thb"] / (year1["gross_revenue"] / 12 * 0.35)),
    }
