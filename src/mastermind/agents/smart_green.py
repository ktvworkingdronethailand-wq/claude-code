"""
Agent 3: Smart Green Product Orchestrator (Chief Product Officer)
Designs Smart Green Operations integration, ESG metrics, and adoption milestones.
Updated: IFS-KTV Integrated FM Solutions Presentation 2026
"""

import json
from ..config import SMART_GREEN, IFS_PARTNER, COMPANY


def handle(params: dict) -> str:
    task = params.get("task", "")
    site_type = params.get("site_type", "commercial-tower")
    metrics_needed = params.get("metrics_needed", [])
    integration_target = params.get("integration_target", "ifs")

    result = {
        "agent": "smart_green_product_orchestrator",
        "task": task,
        "product": SMART_GREEN["name"],
        "url": SMART_GREEN["url"],
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
            "Energy consumption (drone ops vs traditional — 96% GHG reduction)",
            "Water usage (cleaning operations — precision spraying minimises waste)",
            "Chemical consumption (eco-friendly products, measured per sqm)",
            "Work-at-height risk elimination (100% reduction)",
            "Carbon footprint reduction vs rope access",
            "PM2.5 monitoring and pollution control data",
        ],
        "verification": "Cryptographically verifiable telemetry data",
        "export_formats": ["PDF report", "CSV raw data", "API integration", "GRESB template"],
    }

    # Technology capabilities
    result["technology_stack"] = {
        "ai": "Predictive maintenance, anomaly detection, coverage optimisation",
        "ar": "Immersive training for FM teams",
        "robotics": "Co-botic and autonomous cleaning operations",
        "bms_integration": "Real-time data exchange with Building Management Systems",
        "cmms_integration": "Work order sync with IFM/CMMS platforms",
    }

    result["differentiators"] = SMART_GREEN["differentiators"]
    result["key_stats"] = COMPANY["key_stats"]

    return json.dumps(result, indent=2, default=str)


def _design_integration(site_type: str, target: str) -> dict:
    base_flow = {
        "data_capture": [
            "Drone telemetry (GPS, altitude, speed, coverage)",
            "Cleaning metrics (sqm, passes, water/chemical usage)",
            "Environmental data (temperature, humidity, wind, PM2.5)",
            "Safety logs (incidents, near-misses, time at height avoided)",
            "Facade condition scoring and damage documentation",
        ],
        "processing": [
            "Real-time dashboard during mission",
            "Post-mission quality assurance imagery",
            "Automated metric aggregation per site/building",
            "AI-powered predictive maintenance analysis",
            "PM2.5 monitoring and pollution trend tracking",
        ],
        "reporting": [
            "Per-mission completion report",
            "Monthly site performance summary",
            "Quarterly ESG compliance report (aligned with KTV CARE inspection cycle)",
            "Annual GRESB-ready sustainability report",
            "Building condition report with maintenance recommendations",
        ],
    }

    if target == "ifs":
        base_flow["ifs_integration"] = {
            "workflow_embedding": "Smart Green as 'drone + ESG' layer in IFS FM process",
            "data_flow": "Mission data → Smart Green → IFS client portal → ESG reports",
            "bms_sync": "Bidirectional data exchange with building BMS systems",
            "cmms_sync": "Work order creation and completion tracking via IFM/CMMS",
            "kpi_visibility": "Embedded in standard IFS client reports",
            "trigger_points": [
                "IFS work order created → Smart Green mission planned",
                "Mission complete → IFS work order updated with telemetry",
                "Monthly cycle → ESG summary pushed to IFS reporting",
                "Quarterly → KTV CARE inspection report generated automatically",
            ],
        }

    site_configs = {
        "commercial-tower": {
            "typical_sqm": "8,000-25,000",
            "frequency": "Quarterly (4x/year)",
            "sensors": ["RGB camera", "thermal (optional)"],
            "unique_metrics": ["facade_condition_score", "window_cleanliness_index"],
            "services": ["facade-cleaning", "window-cleaning", "building-inspection"],
        },
        "campus": {
            "typical_sqm": "15,000-50,000",
            "frequency": "Quarterly",
            "sensors": ["RGB camera", "multispectral (for landscaping)"],
            "unique_metrics": ["multi_building_coverage", "landscape_health_index"],
            "services": ["facade-cleaning", "vertical-gardens", "building-inspection"],
        },
        "industrial": {
            "typical_sqm": "5,000-30,000",
            "frequency": "Bi-annual (2x/year)",
            "sensors": ["RGB", "thermal", "gas detection (O&G)"],
            "unique_metrics": ["corrosion_index", "thermal_anomaly_count"],
            "services": ["infrastructure", "building-inspection", "jet-wash"],
        },
        "government": {
            "typical_sqm": "10,000-50,000",
            "frequency": "Quarterly",
            "sensors": ["RGB camera", "thermal"],
            "unique_metrics": ["compliance_score", "maintenance_priority_index"],
            "services": ["facade-cleaning", "window-cleaning", "pm25-pollution-control"],
        },
        "solar": {
            "typical_sqm": "20,000-100,000",
            "frequency": "Bi-annual (2x/year)",
            "sensors": ["RGB", "thermal (hotspot detection)"],
            "unique_metrics": ["panel_efficiency_delta", "hotspot_count", "soiling_index"],
            "services": ["solar-panel-cleaning", "building-inspection"],
        },
        "data-centre": {
            "typical_sqm": "15,000-40,000",
            "frequency": "Quarterly",
            "sensors": ["RGB", "thermal"],
            "unique_metrics": ["roof_condition_score", "drainage_status"],
            "services": ["facade-cleaning", "infrastructure", "building-inspection"],
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
        "carbon_offset_kg": {"unit": "kg CO2e", "capture": "calculated vs rope access (96% reduction)", "gresb_category": "GHG"},
        "pm25_readings": {"unit": "µg/m³", "capture": "environmental sensor", "gresb_category": "Environmental"},
        "facade_condition_score": {"unit": "score 1-10", "capture": "AI image analysis", "gresb_category": "Asset Condition"},
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
        {"milestone": 4, "target": "BMS/CMMS integration active at pilot sites", "timeline": "Month 4"},
        {"milestone": 5, "target": "5+ sites active with daily/weekly data", "timeline": "Month 6"},
        {"milestone": 6, "target": "KTV CARE quarterly inspection reports automated", "timeline": "Month 8"},
        {"milestone": 7, "target": "GRESB-ready annual report capability", "timeline": "Month 9"},
    ]

    if target == "ifs":
        milestones.append({
            "milestone": 8,
            "target": "KPIs visible in standard IFS client reports across 10+ sites",
            "timeline": "Month 12",
            "equity_trigger": True,
        })

    return milestones
