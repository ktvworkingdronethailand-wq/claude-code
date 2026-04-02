"""
Agent 5: Deal Design & Pitch Engineer (VP Business Development)
Produces decks, one-pagers, emails, term-sheet text, KTV CARE proposals.
Updated: IFS-KTV Integrated FM Solutions Presentation 2026
"""

import json
from datetime import date
from ..config import (
    COMPANY, JV_STRUCTURE, IFS_PARTNER, SMART_GREEN, FINANCIAL,
    KTV_CARE, TECHNOLOGY_PARTNERSHIP, TRAINING_PROGRAMS, SECTOR_PRICING,
)


def handle(params: dict) -> str:
    task = params.get("task", "")
    artifact_type = params.get("artifact_type", "one-pager")
    audience = params.get("audience", "IFS Thailand")
    key_points = params.get("key_points", [])
    tone = params.get("tone", "executive")

    generators = {
        "deck-slide": _generate_deck_slide,
        "one-pager": _generate_one_pager,
        "email": _generate_email,
        "term-sheet": _generate_term_sheet,
        "executive-summary": _generate_exec_summary,
        "proposal": _generate_proposal,
        "care-agreement": _generate_care_proposal,
        "technology-partnership": _generate_tech_partnership,
        "training-proposal": _generate_training_proposal,
    }

    generator = generators.get(artifact_type, _generate_one_pager)
    artifact = generator(task, audience, key_points, tone)

    return json.dumps({
        "agent": "deal_design_pitch_engineer",
        "task": task,
        "artifact_type": artifact_type,
        "audience": audience,
        "tone": tone,
        "artifact": artifact,
        "notes": "All financial and JV facts sourced from KTV baseline — do not modify without memory update.",
    }, indent=2, default=str)


def _generate_deck_slide(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "slide_title": task or "KTV × IFS: Drone-Enabled FM Innovation",
        "subtitle": "Smart Green Operations — Faster. Safer. Smarter.",
        "body_bullets": points or [
            f"KTV Working Drone Thailand — franchise of KTV Group ({COMPANY['parent_founded']}, {COMPANY['parent_country']}, {COMPANY['franchise_countries']} countries)",
            "World's only certified autonomous drone cleaning and maintenance provider",
            f"80% faster cleaning | 96% GHG reduction | 100% risk elimination",
            f"Year 1 target: THB {FINANCIAL['year1']['gross_revenue']:,.0f} revenue",
            f"Smart Green Operations: {SMART_GREEN['url']}",
            f"JV: KTV {JV_STRUCTURE['ktv']['stake']}% | IFS up to {JV_STRUCTURE['ifs']['stake_max']}%",
        ],
        "visual_suggestion": "Split: autonomous drone in action left, Smart Green dashboard right",
        "speaker_notes": f"Tailor for {audience}. Lead with safety and ESG, close with economics.",
    }


def _generate_one_pager(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "title": "KTV Working Drone Thailand — Partnership Overview",
        "date": str(date.today()),
        "for": audience,
        "sections": [
            {
                "heading": "The Opportunity",
                "content": (
                    "Thailand's 400+ high-rise buildings require quarterly facade maintenance. "
                    "Traditional rope access is dangerous, expensive, and slow. "
                    "KTV's autonomous drone platform eliminates 100% of work-at-height risk, "
                    "cleans 80% faster, and reduces GHG emissions by 96% — all while "
                    "capturing verified ESG data through Smart Green Operations."
                ),
            },
            {
                "heading": "Why IFS + KTV",
                "content": "\n".join(f"• {m}" for m in IFS_PARTNER["sales_messaging"]),
            },
            {
                "heading": "Smart Green Operations",
                "content": "\n".join(f"• {f}" for f in SMART_GREEN["core_functions"])
                + f"\n• Platform: {SMART_GREEN['url']}",
            },
            {
                "heading": "Service Portfolio",
                "content": (
                    f"• Facade Cleaning: from {FINANCIAL['base_price_per_sqm']} THB/sqm\n"
                    "• Window Cleaning, Solar Panels, Vertical Gardens, PM2.5 Control\n"
                    "• Infrastructure & Jet Wash services\n"
                    "• Building Inspection & Condition Reporting\n"
                    f"• Minimum order: {FINANCIAL['minimum_order_sqm']:,} sqm"
                ),
            },
            {
                "heading": "KTV CARE Agreement",
                "content": (
                    f"• Long-term maintenance partnership ({KTV_CARE['minimum_commitment_months']}-month minimum)\n"
                    "• Full responsibility for facade & window cleanliness\n"
                    "• Quarterly inspections with condition reports\n"
                    "• Smart Green platform access with complete work history"
                ),
            },
            {
                "heading": "Economics",
                "content": (
                    f"• Year 1 target: THB {FINANCIAL['year1']['gross_revenue']:,.0f}\n"
                    f"• IRR: {FINANCIAL['irr_range']}\n"
                    f"• Payback: {FINANCIAL['payback_months']} months"
                ),
            },
            {
                "heading": "Next Steps",
                "content": (
                    "1. Complimentary building assessment\n"
                    "2. Current state analysis & drone inspection\n"
                    "3. Customised KTV CARE recommendation\n"
                    "4. Deploy and measure (3-month pilot)\n"
                    "5. Scale across portfolio"
                ),
            },
        ],
    }


def _generate_email(task: str, audience: str, points: list, tone: str) -> dict:
    formal = tone == "formal"
    return {
        "subject": task or "KTV Working Drone Thailand — Partnership Proposal",
        "to": audience,
        "body": (
            f"{'Dear' if formal else 'Hi'} {audience},\n\n"
            "Thank you for your interest in drone-enabled facility management.\n\n"
            f"KTV Working Drone Thailand, part of KTV Group ({COMPANY['franchise_countries']} countries), "
            "is the world's only certified provider of autonomous drone cleaning and maintenance. "
            "Our Smart Green Operations platform captures verified ESG metrics — "
            "sqm cleaned, water savings, work-at-height hours eliminated — "
            "directly into your client reporting.\n\n"
            "Key results: 80% faster cleaning, 96% lower emissions, 100% risk elimination.\n\n"
            + ("\n".join(f"• {p}" for p in points) + "\n\n" if points else "")
            + "We offer a complimentary building assessment to demonstrate our capabilities.\n\n"
            f"{'Best regards' if formal else 'Best'},\n"
            "KTV Working Drone Thailand\n"
            f"{COMPANY['address']}"
        ),
    }


def _generate_term_sheet(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "title": "INDICATIVE TERM SHEET — KTV × IFS Thailand JV",
        "status": "DRAFT — For Discussion Only",
        "date": str(date.today()),
        "parties": [
            f"KTV Working Drone Thailand Co., Ltd. ({JV_STRUCTURE['ktv']['stake']}%)",
            f"IFS Thailand (up to {JV_STRUCTURE['ifs']['stake_max']}%)",
        ],
        "key_terms": {
            "structure": "Joint Venture with equity milestones",
            "ktv_contribution": "Drone fleet, Smart Green platform, operating framework, global certification",
            "ifs_contribution": f"Exclusive FM client channel in Thailand ({IFS_PARTNER['heritage']})",
            "governance": "KTV retains board control; IFS has board seats",
            "exclusivity": "IFS is sole FM channel in Thailand",
            "equity_milestones": f"Revenue thresholds: THB {', '.join(f'{t:,.0f}' for t in IFS_PARTNER['equity_triggers_thb'])}",
            "initial_capital": f"USD {FINANCIAL['capital']['total_equity_usd']:,.0f} ({FINANCIAL['currency']} {FINANCIAL['capital']['total_equity_thb']:,.0f})",
            "partnership_models": ["KTV CARE Agreement (36-month)", "Technology Partnership Program (36-month)"],
        },
    }


def _generate_exec_summary(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "title": "Executive Summary — KTV Working Drone Thailand",
        "for": audience,
        "summary": (
            f"KTV Working Drone Thailand is a franchise of KTV Group ({COMPANY['parent_country']}, "
            f"est. {COMPANY['parent_founded']}, {COMPANY['franchise_countries']} countries). "
            "We are launching Thailand's first certified autonomous drone-enabled FM platform, "
            "targeting 400+ high-rise buildings in Bangkok. Our drones clean 80% faster, "
            "reduce emissions by 96%, and eliminate 100% of work-at-height risk. "
            f"Year 1 projects THB {FINANCIAL['year1']['gross_revenue']:,.0f} revenue with "
            f"{FINANCIAL['irr_range']} IRR and {FINANCIAL['payback_months']} month payback."
        ),
        "key_numbers": {
            "year1_revenue": f"THB {FINANCIAL['year1']['gross_revenue']:,.0f}",
            "net_income": f"THB {FINANCIAL['year1']['net_income']:,.0f}",
            "irr": FINANCIAL["irr_range"],
            "payback": FINANCIAL["payback_months"],
            "investment": f"USD {FINANCIAL['capital']['total_equity_usd']:,.0f}",
            "base_price": f"{FINANCIAL['base_price_per_sqm']} THB/sqm",
        },
        "certifications": COMPANY["certifications"],
    }


def _generate_proposal(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "title": task or "Drone-Enabled FM Pilot Proposal",
        "for": audience,
        "sections": [
            {"heading": "Overview", "content": "3-month pilot at selected IFS-managed site(s)"},
            {"heading": "Scope", "content": points or [
                "Quarterly facade cleaning using KTV autonomous drone fleet",
                "Window cleaning and solar panel maintenance",
                "Smart Green Operations telemetry + ESG reporting",
                "PM2.5 monitoring and pollution control",
                "Safety: zero work-at-height, full CAAT compliance",
            ]},
            {"heading": "Pricing", "content": f"From {FINANCIAL['base_price_per_sqm']} THB/sqm (min {FINANCIAL['minimum_order_sqm']:,} sqm)"},
            {"heading": "Timeline", "content": "Complimentary assessment → First mission within 2 weeks"},
            {"heading": "Success Criteria", "content": [
                "sqm cleaned per cycle vs target",
                "Safety incidents = 0",
                "80% faster than rope access baseline",
                "96% GHG reduction documented",
                "ESG metrics captured and reported via Smart Green",
            ]},
            {"heading": "Conversion Path", "content": "Pilot → KTV CARE Agreement (36-month)"},
        ],
    }


def _generate_care_proposal(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "title": "KTV CARE Agreement Proposal",
        "for": audience,
        "date": str(date.today()),
        "description": KTV_CARE["description"],
        "minimum_commitment": f"{KTV_CARE['minimum_commitment_months']} months",
        "includes": KTV_CARE["includes"],
        "value_proposition": KTV_CARE["value_prop"],
        "assessment_flow": KTV_CARE["assessment_flow"],
        "pricing_note": "Custom based on building portfolio — contact for assessment",
    }


def _generate_tech_partnership(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "title": "Technology Partnership Program",
        "for": audience,
        "date": str(date.today()),
        "description": TECHNOLOGY_PARTNERSHIP["description"],
        "minimum_commitment": f"{TECHNOLOGY_PARTNERSHIP['minimum_commitment_months']} months",
        "includes": TECHNOLOGY_PARTNERSHIP["includes"],
        "pricing": TECHNOLOGY_PARTNERSHIP["pricing"],
    }


def _generate_training_proposal(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "title": "Staff Training Programs — KTV Working Drone Thailand",
        "for": audience,
        "date": str(date.today()),
        "capacity": f"Maximum {TRAINING_PROGRAMS['max_people_per_month']} people per month",
        "courses": [
            {"name": c["name"], "duration": f"{c['duration_hours']} hours", "price": f"{c['price_thb']:,} THB"}
            for c in TRAINING_PROGRAMS["courses"]
        ],
        "packages": {
            k: {"name": v["name"], "price": f"{v['price_thb']:,} THB"}
            for k, v in TRAINING_PROGRAMS["packages"].items()
        },
    }
