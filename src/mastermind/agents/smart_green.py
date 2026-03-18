"""
Agent 3: Smart Green Product Orchestrator
Designs Smart Green Operations integration, ESG metrics, and adoption milestones.
"""

import json
from ..config import SMART_GREEN, IFS_PARTNER


def handle(params: dict) -> str:
    task = params.get("task", "")
    site_type = params.get("site_type", "commercial-tower")
    metrics_needed = params.get("metrics_needed", [])
    integration_target = params.get("integration_target", "ifs")

    result = {
        "agent": "smart_green_product_orchestrator",
        "task": task,
        "product": SMART_GREEN["name"],
    }

    # Integration flow design
    result["integration_flow"] = _design_integration(site_type, integration_target)

    # ESG metrics definition
    result["esg_metrics"] = _define_esg_metrics(site_type, metrics_needed)

    # Adoption milestones
    result["adoption_milestones"] = _define_milestones(integration_target)

    # GRESB readiness
    result["gresb_readiness"] = {
        "status": "Ready",
        "reporting_categories": [
            "Energy consumption (drone ops vs traditional)",
            "Water usage (cleaning operations)",
            "Chemical consumption (eco-friendly products)",
            "Work-at-height risk elimination",
            "Carbon footprint reduction vs rope access",
        ],
        "verification": "Cryptographically verifiable telemetry data",
        "export_formats": ["PDF report", "CSV raw data", "API integration", "GRESB template"],
    }

    result["differentiators"] = SMART_GREEN["differentiators"]

    return json.dumps(result, indent=2, default=str)


def _design_integration(site_type: str, target: str) -> dict:
    base_flow = {
        "data_capture": [
            "Drone telemetry (GPS, altitude, speed, coverage)",
            "Cleaning metrics (sqm, passes, water/chemical usage)",
            "Environmental data (temperature, humidity, wind)",
            "Safety logs (incidents, near-misses, time at height avoided)",
        ],
        "processing": [
            "Real-time dashboard during mission",
            "Post-mission quality assurance imagery",
            "Automated metric aggregation per site/building",
        ],
        "reporting": [
            "Per-mission completion report",
            "Monthly site performance summary",
            "Quarterly ESG compliance report",
            "Annual GRESB-ready sustainability report",
        ],
    }

    if target == "ifs":
        base_flow["ifs_integration"] = {
            "workflow_embedding": "Smart Green as 'drone + ESG' layer in IFS FM process",
            "data_flow": "Mission data → Smart Green → IFS client portal → ESG reports",
            "kpi_visibility": "Embedded in standard IFS client reports",
            "trigger_points": [
                "IFS work order created → Smart Green mission planned",
                "Mission complete → IFS work order updated with telemetry",
                "Monthly cycle → ESG summary pushed to IFS reporting",
            ],
        }
    elif target == "skyller":
        base_flow["skyller_integration"] = {
            "workflow_embedding": "Smart Green captures O&G inspection + cleaning data",
            "data_flow": "Inspection data → Smart Green → Skyller safety reports → IFS umbrella",
            "safety_layer": "Enhanced safety monitoring for hazardous sites",
        }

    site_configs = {
        "commercial-tower": {
            "typical_sqm": "8,000-25,000",
            "frequency": "Quarterly (4x/year)",
            "sensors": ["RGB camera", "thermal (optional)"],
            "unique_metrics": ["facade_condition_score", "window_cleanliness_index"],
        },
        "campus": {
            "typical_sqm": "15,000-50,000",
            "frequency": "Quarterly",
            "sensors": ["RGB camera", "multispectral (for landscaping)"],
            "unique_metrics": ["multi_building_coverage", "landscape_health_index"],
        },
        "industrial": {
            "typical_sqm": "5,000-30,000",
            "frequency": "Bi-annual (2x/year)",
            "sensors": ["RGB", "thermal", "gas detection (O&G)"],
            "unique_metrics": ["corrosion_index", "thermal_anomaly_count"],
        },
    }
    base_flow["site_config"] = site_configs.get(site_type, site_configs["commercial-tower"])

    return base_flow


def _define_esg_metrics(site_type: str, extra_metrics: list) -> dict:
    core = {
        "sqm_cleaned": {"unit": "sqm", "capture": "automatic", "gresb_category": "Operations"},
        "water_consumption_liters": {"unit": "liters", "capture": "flow sensor", "gresb_category": "Water"},
        "chemical_consumption_liters": {"unit": "liters", "capture": "tank sensor", "gresb_category": "Materials"},
        "time_at_height_avoided_minutes": {"unit": "minutes", "capture": "calculated", "gresb_category": "Health & Safety"},
        "energy_usage_kwh": {"unit": "kWh", "capture": "battery telemetry", "gresb_category": "Energy"},
        "safety_incidents": {"unit": "count", "capture": "manual + auto", "gresb_category": "Health & Safety"},
        "carbon_offset_kg": {"unit": "kg CO2e", "capture": "calculated vs rope access baseline", "gresb_category": "GHG"},
    }

    # Add any requested extra metrics
    for m in extra_metrics:
        if m not in core:
            core[m] = {"unit": "custom", "capture": "configurable", "gresb_category": "Custom"}

    return core


def _define_milestones(target: str) -> list:
    milestones = [
        {"milestone": 1, "target": "Smart Green deployed at first pilot site", "timeline": "Month 1"},
        {"milestone": 2, "target": "Telemetry flowing for all core KPIs", "timeline": "Month 2"},
        {"milestone": 3, "target": "First monthly ESG report generated", "timeline": "Month 3"},
        {"milestone": 4, "target": "5+ sites active with daily/weekly data", "timeline": "Month 6"},
        {"milestone": 5, "target": "GRESB-ready annual report capability", "timeline": "Month 9"},
    ]

    if target == "ifs":
        milestones.append({
            "milestone": 6,
            "target": "KPIs visible in standard IFS client reports across 10+ sites",
            "timeline": "Month 12",
            "equity_trigger": True,
        })

    return milestones
