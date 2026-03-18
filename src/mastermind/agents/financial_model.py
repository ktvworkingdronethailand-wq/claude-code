"""
Agent 4: Financial Model & Capital Planner
Evaluates deals against KTV Thailand's 3-year model with guardrail checks.
"""

import json
import math
from ..config import FINANCIAL, SERVICE_LINES, PHASE1


def handle(params: dict) -> str:
    task = params.get("task", "")
    deal = params.get("deal", {})
    scenario = params.get("scenario", "base")
    check_guardrails = params.get("check_guardrails", True)

    result = {
        "agent": "financial_model_capital_planner",
        "task": task,
        "scenario": scenario,
        "base_case": {
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

    result["capacity_summary"] = _capacity_check()

    return json.dumps(result, indent=2, default=str)


def _analyze_deal(deal: dict, scenario: str) -> dict:
    sqm = deal.get("sqm_annual", 0)
    price = deal.get("price_per_sqm", FINANCIAL["base_price_per_sqm"])
    years = deal.get("contract_years", 1)
    frequency = deal.get("frequency", "quarterly")
    service = deal.get("service_line", "facade-cleaning")

    # Revenue
    annual_revenue = sqm * price
    total_revenue = annual_revenue * years

    # Scenario multipliers
    multipliers = {"conservative": 0.75, "base": 1.0, "aggressive": 1.25}
    mult = multipliers.get(scenario, 1.0)
    annual_revenue *= mult
    total_revenue *= mult

    # Costs (based on service line margins)
    svc = SERVICE_LINES.get(service, SERVICE_LINES["facade-cleaning"])
    # Estimate EBITDA margin from industry benchmarks
    ebitda_margin = 0.65  # Conservative for deal-level analysis
    ebitda = annual_revenue * ebitda_margin

    # Tax impact
    vat = annual_revenue * FINANCIAL["tax"]["vat_pct"] / 100
    royalty = annual_revenue * FINANCIAL["tax"]["royalty_pct"] / 100
    corp_tax = ebitda * FINANCIAL["tax"]["corporate_tax_pct"] / 100
    net_income = ebitda - royalty - corp_tax

    # Payback (assume 1 drone + crew setup per deal)
    setup_cost = 2_500_000  # ~THB 2.5M per drone setup
    payback_months = (setup_cost / (net_income / 12)) if net_income > 0 else float("inf")

    # Simple NPV (10% discount rate)
    discount_rate = 0.10
    npv = sum(net_income / ((1 + discount_rate) ** y) for y in range(1, years + 1)) - setup_cost

    # IRR approximation
    irr = (net_income / setup_cost) * 100 if setup_cost > 0 else 0

    # Drone hours needed
    sqm_per_hour = 500  # Approximate cleaning rate
    hours_per_cycle = sqm / sqm_per_hour
    cycles = {"quarterly": 4, "monthly": 12, "biannual": 2, "annual": 1}.get(frequency, 4)
    annual_drone_hours = hours_per_cycle * cycles

    return {
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
        "price_vs_base": f"{price} vs {FINANCIAL['base_price_per_sqm']} THB/sqm base",
    }


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

    # Price check
    price = deal.get("price_per_sqm", 45)
    if price < FINANCIAL["market_range"]["low"]:
        flags.append(f"Price {price} THB/sqm below market floor ({FINANCIAL['market_range']['low']})")
        status = "FAIL"
    elif price < 30:
        warnings.append(f"Price {price} THB/sqm is on the low end — ensure volume justifies")

    # Fleet capacity
    hours = analysis.get("annual_drone_hours", 0)
    if hours > 2000:  # ~250 working days × 8 hours
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


def _capacity_check() -> dict:
    year1 = FINANCIAL["year1"]
    sqm = year1["implied_sqm"]
    hours = sqm / 500  # sqm per drone-hour
    drones_needed = math.ceil(hours / (250 * 6))  # 250 days × 6 productive hours

    return {
        "year1_target_sqm": sqm,
        "estimated_drone_hours": round(hours),
        "drones_needed": drones_needed,
        "fleet_utilisation_note": f"~{drones_needed} drones at 80% utilisation for Year 1 target",
        "capex_thb": FINANCIAL["capital"]["total_equity_thb"],
        "runway_months": round(FINANCIAL["capital"]["total_equity_thb"] / (year1["gross_revenue"] / 12 * 0.35)),
    }
