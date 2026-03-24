"""
Agent 5: Deal Design & Pitch Engineer
Produces decks, one-pagers, emails, and term-sheet text.
"""

import json
from datetime import date
from ..config import COMPANY, JV_STRUCTURE, IFS_PARTNER, SMART_GREEN, FINANCIAL


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
        "subtitle": "Smart Green Operations — Safety, Sustainability, Data",
        "body_bullets": points or [
            f"KTV Working Drone Thailand — franchise of KTV Group ({COMPANY['parent_founded']}, {COMPANY['parent_country']})",
            "World-first GRESB-ready drone cleaning platform for FM operators",
            f"Year 1 target: THB {FINANCIAL['year1']['gross_revenue']:,.0f} revenue",
            "Zero work-at-height risk, measurable ESG gains",
            f"JV: KTV {JV_STRUCTURE['ktv']['stake']}% | IFS up to {JV_STRUCTURE['ifs']['stake_max']}%",
        ],
        "visual_suggestion": "Split: drone photo left, data dashboard right",
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
                    "KTV's autonomous drone platform eliminates work-at-height risk while "
                    "capturing verifiable ESG data through Smart Green Operations."
                ),
            },
            {
                "heading": "Why IFS + KTV",
                "content": "\n".join(f"• {m}" for m in IFS_PARTNER["sales_messaging"]),
            },
            {
                "heading": "Smart Green Operations",
                "content": "\n".join(f"• {f}" for f in SMART_GREEN["core_functions"]),
            },
            {
                "heading": "Economics",
                "content": (
                    f"• Base price: {FINANCIAL['base_price_per_sqm']} THB/sqm\n"
                    f"• Year 1 target: THB {FINANCIAL['year1']['gross_revenue']:,.0f}\n"
                    f"• IRR: {FINANCIAL['irr_range']}\n"
                    f"• Payback: {FINANCIAL['payback_months']} months"
                ),
            },
            {
                "heading": "Next Steps",
                "content": (
                    "1. Sign JV framework agreement\n"
                    "2. Select 1-3 pilot sites\n"
                    "3. Deploy and measure (3-month pilot)\n"
                    "4. Scale across IFS portfolio"
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
            "offers the only GRESB-ready drone cleaning platform for FM operators. "
            "Our Smart Green Operations platform captures verified ESG metrics — "
            "sqm cleaned, water savings, work-at-height hours eliminated — "
            "directly into your client reporting.\n\n"
            + ("\n".join(f"• {p}" for p in points) + "\n\n" if points else "")
            + "We'd welcome a 30-minute meeting to discuss a pilot at one of your sites.\n\n"
            f"{'Best regards' if formal else 'Best'},\n"
            "KTV Working Drone Thailand"
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
            "ktv_contribution": "Drone fleet, Smart Green platform, operating framework",
            "ifs_contribution": "Exclusive FM client channel in Thailand",
            "governance": "KTV retains board control; IFS has board seats",
            "exclusivity": "IFS is sole FM channel in Thailand",
            "equity_milestones": f"Revenue thresholds: THB {', '.join(f'{t:,.0f}' for t in IFS_PARTNER['equity_triggers_thb'])}",
            "initial_capital": f"USD {FINANCIAL['capital']['total_equity_usd']:,.0f} ({FINANCIAL['currency']} {FINANCIAL['capital']['total_equity_thb']:,.0f})",
        },
    }


def _generate_exec_summary(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "title": "Executive Summary — KTV Working Drone Thailand",
        "for": audience,
        "summary": (
            f"KTV Working Drone Thailand is a franchise of KTV Group ({COMPANY['parent_country']}, "
            f"est. {COMPANY['parent_founded']}, {COMPANY['franchise_countries']} countries). "
            "We are launching Thailand's first GRESB-ready drone-enabled FM platform, "
            "targeting 400+ high-rise buildings in Bangkok with quarterly cleaning cycles. "
            f"Year 1 projects THB {FINANCIAL['year1']['gross_revenue']:,.0f} revenue with "
            f"{FINANCIAL['irr_range']} IRR and {FINANCIAL['payback_months']} month payback."
        ),
        "key_numbers": {
            "year1_revenue": f"THB {FINANCIAL['year1']['gross_revenue']:,.0f}",
            "net_income": f"THB {FINANCIAL['year1']['net_income']:,.0f}",
            "irr": FINANCIAL["irr_range"],
            "payback": FINANCIAL["payback_months"],
            "investment": f"USD {FINANCIAL['capital']['total_equity_usd']:,.0f}",
        },
    }


def _generate_proposal(task: str, audience: str, points: list, tone: str) -> dict:
    return {
        "title": task or "Drone-Enabled FM Pilot Proposal",
        "for": audience,
        "sections": [
            {"heading": "Overview", "content": "3-month pilot at selected IFS-managed site(s)"},
            {"heading": "Scope", "content": points or [
                "Quarterly facade cleaning using KTV drone fleet",
                "Smart Green Operations telemetry + ESG reporting",
                "Safety: zero work-at-height, full CAAT compliance",
            ]},
            {"heading": "Pricing", "content": f"From {FINANCIAL['base_price_per_sqm']} THB/sqm"},
            {"heading": "Timeline", "content": "Site assessment → First mission within 2 weeks"},
            {"heading": "Success Criteria", "content": [
                "sqm cleaned per cycle",
                "Safety incidents = 0",
                "Cost/time vs rope access baseline",
                "ESG metrics captured and reported",
            ]},
        ],
    }
