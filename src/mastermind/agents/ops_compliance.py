"""
Agent 7: Operations & Compliance Mission Planner
Checks feasibility, plans fleet/crew, outlines SOPs against Thai regulations.
"""

import json
from ..config import CAAT, FINANCIAL, PHASE1


# Fleet inventory
FLEET = {
    "cleaning": [
        {"model": "DJI Agras T50", "qty": 4, "payload_kg": 40, "endurance_min": 11, "category": "agricultural"},
        {"model": "DJI Agras T25", "qty": 2, "payload_kg": 25, "endurance_min": 13, "category": "agricultural"},
    ],
    "inspection": [
        {"model": "DJI Matrice 350 RTK", "qty": 2, "payload_kg": 2.7, "endurance_min": 55, "category": "survey"},
        {"model": "DJI Matrice 30T", "qty": 2, "payload_kg": 0.3, "endurance_min": 41, "category": "inspection"},
        {"model": "DJI Mavic 3 Enterprise RTK", "qty": 2, "payload_kg": 0, "endurance_min": 45, "category": "survey"},
    ],
    "media": [
        {"model": "DJI Inspire 3", "qty": 1, "category": "media"},
        {"model": "DJI Mavic 3 Pro Cine", "qty": 1, "category": "media"},
    ],
}

# Crew requirements per operation type
CREW_REQUIREMENTS = {
    "facade-cleaning": {"pilots": 2, "ground_crew": 2, "supervisor": 1},
    "building-inspection": {"pilots": 1, "ground_crew": 1, "supervisor": 1},
    "og-inspection": {"pilots": 2, "ground_crew": 2, "supervisor": 1, "safety_officer": 1},
    "survey-mapping": {"pilots": 1, "ground_crew": 1},
    "agricultural": {"pilots": 1, "ground_crew": 1},
}


def handle(params: dict) -> str:
    task = params.get("task", "")
    site = params.get("site", {})
    fleet_required = params.get("fleet_required", [])
    check_caat = params.get("check_caat", True)

    result = {
        "agent": "operations_compliance_mission_planner",
        "task": task,
    }

    if site:
        result["feasibility"] = _check_feasibility(site, check_caat)
        result["fleet_plan"] = _plan_fleet(site, fleet_required)
        result["crew_plan"] = _plan_crew(site)
        result["sop_outline"] = _outline_sop(site)

    result["fleet_inventory"] = _fleet_summary()
    result["regulatory_summary"] = _regulatory_summary()
    result["capacity_status"] = _capacity_status()

    return json.dumps(result, indent=2, default=str)


def _check_feasibility(site: dict, check_caat: bool) -> dict:
    issues = []
    warnings = []
    status = "FEASIBLE"

    height = site.get("height_m", 0)
    near_airport = site.get("near_airport", False)
    site_type = site.get("type", "commercial")
    location = site.get("location", "Bangkok")

    if check_caat:
        if height > CAAT["max_altitude_m"]:
            issues.append(
                f"Building height {height}m exceeds CAAT max altitude {CAAT['max_altitude_m']}m — "
                "requires special CAAT exemption / phased approach"
            )
            status = "CONDITIONAL"

        if near_airport:
            issues.append(
                f"Within {CAAT['airport_buffer_km']}km airport buffer zone — "
                "requires CAAT and airport authority coordination"
            )
            status = "CONDITIONAL"

    # Site type checks
    if site_type in ("o_and_g", "refinery", "chemical"):
        warnings.append("Hazardous site — KTV must use ATEX-aware procedures")
        warnings.append("Additional safety briefing and risk assessment required")

    if site_type == "healthcare":
        warnings.append("Hospital operations: prefer night/weekend, minimise noise disruption")

    if location.lower() in ("phuket", "samui", "chiang mai"):
        warnings.append(f"Regional site ({location}) — logistics planning needed for equipment transport")

    # Permit check
    permits = ["CAAT flight approval", "Building owner consent"]
    if near_airport:
        permits.append("Airport authority coordination letter")
    if site_type in ("o_and_g", "refinery"):
        permits.append("Plant safety officer approval")
        permits.append("Hot work / ATEX zone clearance")
    if height > 50:
        permits.append("High-altitude operation plan filed with CAAT")

    return {
        "status": status,
        "issues": issues,
        "warnings": warnings,
        "required_permits": permits,
        "estimated_approval_days": 5 if status == "FEASIBLE" else 15,
    }


def _plan_fleet(site: dict, requested: list) -> dict:
    site_type = site.get("type", "commercial")
    sqm = site.get("sqm", 10_000) if "sqm" in site else 10_000

    # Select appropriate drones
    if site_type in ("o_and_g", "refinery", "industrial"):
        primary = FLEET["inspection"]
        category = "inspection + cleaning"
    else:
        primary = FLEET["cleaning"]
        category = "cleaning"

    # Estimate mission time
    sqm_per_hour = 500
    hours_needed = sqm / sqm_per_hour
    batteries_per_hour = 3  # Average swaps per hour
    total_batteries = int(hours_needed * batteries_per_hour)

    return {
        "category": category,
        "recommended_drones": [
            {"model": d["model"], "qty_available": d["qty"]}
            for d in primary[:2]
        ],
        "estimated_hours": round(hours_needed, 1),
        "battery_swaps": total_batteries,
        "water_liters": round(sqm * 0.3),  # ~0.3L per sqm
        "chemical_liters": round(sqm * 0.05),  # ~0.05L per sqm
    }


def _plan_crew(site: dict) -> dict:
    site_type = site.get("type", "commercial")
    if site_type in ("o_and_g", "refinery"):
        crew = CREW_REQUIREMENTS["og-inspection"]
    elif site_type in ("facade", "commercial", "commercial-tower"):
        crew = CREW_REQUIREMENTS["facade-cleaning"]
    else:
        crew = CREW_REQUIREMENTS["building-inspection"]

    return {
        "crew_composition": crew,
        "total_personnel": sum(crew.values()),
        "certifications_required": [
            "CAAT Remote Pilot License",
            "KTV Safety Certification",
            "First Aid (at least 1 crew member)",
        ],
        "training_needs": (
            ["ATEX awareness", "H2S detection", "Confined space rescue awareness"]
            if site_type in ("o_and_g", "refinery")
            else ["Working at height awareness", "Emergency procedures"]
        ),
    }


def _outline_sop(site: dict) -> dict:
    site_type = site.get("type", "commercial")
    return {
        "sop_id": f"SOP-{site_type.upper()}-001",
        "phases": [
            {
                "phase": "Pre-Mission",
                "steps": [
                    "Site risk assessment (5x5 matrix)",
                    "Weather check (wind <8m/s, no rain, visibility >5km)",
                    "CAAT NOTAM check and flight plan filing",
                    "Equipment inspection and pre-flight checklist",
                    "Client and building management notification",
                ],
            },
            {
                "phase": "Mission Execution",
                "steps": [
                    "Establish ground control point and safety perimeter",
                    "Launch and system check at 10m hover",
                    "Execute planned cleaning/inspection pattern",
                    "Real-time telemetry monitoring via Smart Green",
                    "Battery swap protocol (land, swap, resume)",
                ],
            },
            {
                "phase": "Post-Mission",
                "steps": [
                    "Complete post-flight checklist",
                    "Download telemetry and imagery to Smart Green",
                    "Quality assurance review of coverage",
                    "Client sign-off and completion report",
                    "Equipment maintenance and storage",
                ],
            },
        ],
        "safety_protocols": [
            "Emergency landing procedures",
            "Lost-link protocol (auto-RTH)",
            "Public safety perimeter (minimum 30m)",
            "Incident reporting within 24 hours",
        ],
    }


def _fleet_summary() -> dict:
    total = sum(d["qty"] for cat in FLEET.values() for d in cat)
    return {
        "total_drones": total,
        "by_category": {
            cat: sum(d["qty"] for d in drones)
            for cat, drones in FLEET.items()
        },
        "models": [
            {"model": d["model"], "qty": d["qty"], "category": cat}
            for cat, drones in FLEET.items()
            for d in drones
        ],
    }


def _regulatory_summary() -> dict:
    return {
        "regulator": CAAT["regulator"],
        "key_limits": {
            "max_altitude_m": CAAT["max_altitude_m"],
            "airport_buffer_km": CAAT["airport_buffer_km"],
            "min_insurance_thb": CAAT["min_insurance_thb"],
            "registration_above_g": CAAT["registration_above_g"],
        },
        "required_certifications": [
            "Remote Pilot License (RPL)",
            "Unmanned Aircraft Operating Certificate (UAOC)",
            "Drone registration with CAAT",
            "Minimum THB 1M liability insurance",
        ],
    }


def _capacity_status() -> dict:
    total_drones = sum(d["qty"] for cat in FLEET.values() for d in cat)
    daily_capacity_hours = total_drones * 6  # 6 productive hours per drone
    monthly_capacity_sqm = daily_capacity_hours * 500 * 22  # 22 working days
    annual_capacity_sqm = monthly_capacity_sqm * 12

    return {
        "daily_capacity_hours": daily_capacity_hours,
        "monthly_capacity_sqm": monthly_capacity_sqm,
        "annual_capacity_sqm": annual_capacity_sqm,
        "year1_target_sqm": FINANCIAL["year1"]["implied_sqm"],
        "utilisation_pct": round(FINANCIAL["year1"]["implied_sqm"] / annual_capacity_sqm * 100, 1),
        "headroom": "Sufficient" if annual_capacity_sqm > FINANCIAL["year1"]["implied_sqm"] else "Fleet expansion needed",
    }
