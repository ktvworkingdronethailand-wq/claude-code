"""
KTV Mastermind — CoWork Command
Unified coordination that bridges 7 Strategy + 7 Operations agents
into 6 automated professional teams for end-to-end ecosystem execution.
"""

from .config import AGENT_NAMES, COMPANY, FINANCIAL

# ── 6 Professional Teams ──────────────────────────────────────

COWORK_TEAMS = {
    "growth": {
        "name": "Growth Engine",
        "mission": "Identify, qualify, and route market opportunities through IFS or Direct KTV channels",
        "lead": "market_intelligence_strategist",
        "strategy_agents": [
            "market_intelligence_strategist",
            "partner_strategy_architect",
            "sales_playbook_account_selector",
        ],
        "operations_agents": ["crm-sales", "job-lifecycle"],
        "workflows": ["Lead Qualification & Onboarding"],
        "kpis": [
            "New leads per week",
            "Lead-to-qualified conversion rate",
            "Pipeline value (THB)",
            "IFS vs Direct KTV channel split",
        ],
    },
    "delivery": {
        "name": "Service Delivery",
        "mission": "Execute drone missions from planning through data delivery with zero safety incidents",
        "lead": "operations_compliance_mission_planner",
        "strategy_agents": [
            "operations_compliance_mission_planner",
            "smart_green_product_orchestrator",
        ],
        "operations_agents": [
            "fleet-management",
            "job-lifecycle",
            "pilot-operations",
            "safety-compliance",
            "data-processing",
        ],
        "workflows": [
            "Mission Preparation Pipeline",
            "Pre-Flight to Mission Launch",
            "Post-Mission Data Pipeline",
        ],
        "kpis": [
            "Missions completed per week",
            "Sqm cleaned/inspected",
            "Safety incidents (target: 0)",
            "On-time delivery rate",
            "Data backup compliance (target: 100%)",
        ],
    },
    "compliance": {
        "name": "Compliance & Safety",
        "mission": "Maintain zero safety incidents, CAAT compliance, and fleet readiness at all times",
        "lead": "operations_compliance_mission_planner",
        "strategy_agents": ["operations_compliance_mission_planner"],
        "operations_agents": [
            "safety-compliance",
            "fleet-management",
            "pilot-operations",
        ],
        "workflows": [
            "Incident Emergency Response",
            "Auto-Maintenance Scheduling",
            "Certification Expiry Handler",
        ],
        "kpis": [
            "Safety incidents (target: 0)",
            "Pre-flight pass rate (target: >95%)",
            "Fleet availability rate",
            "Pilot certification currency",
            "CAAT compliance status",
        ],
    },
    "intelligence": {
        "name": "Market Intelligence",
        "mission": "Provide real-time market analysis, competitor tracking, and strategic recommendations",
        "lead": "market_intelligence_strategist",
        "strategy_agents": [
            "market_intelligence_strategist",
            "partner_strategy_architect",
            "smart_green_product_orchestrator",
        ],
        "operations_agents": ["crm-sales", "data-processing"],
        "workflows": [],
        "kpis": [
            "TAM/SAM/SOM accuracy",
            "Opportunity pipeline scored and ranked",
            "Competitive intelligence freshness",
            "Smart Green adoption rate",
        ],
    },
    "ecosystem": {
        "name": "Ecosystem Builder",
        "mission": "Build and maintain the IFS partnership, Smart Green integrations, and new channels",
        "lead": "partner_strategy_architect",
        "strategy_agents": [
            "partner_strategy_architect",
            "deal_design_pitch_engineer",
            "smart_green_product_orchestrator",
            "sales_playbook_account_selector",
        ],
        "operations_agents": ["crm-sales", "job-lifecycle"],
        "workflows": ["Lead Qualification & Onboarding"],
        "kpis": [
            "IFS equity milestone progress (THB 32M > 64M > 160M)",
            "Smart Green integrated sites",
            "Partner satisfaction score",
            "New partnership proposals delivered",
        ],
    },
    "revenue": {
        "name": "Revenue Operations",
        "mission": "Maximise revenue, maintain healthy margins, and ensure timely collections",
        "lead": "financial_model_capital_planner",
        "strategy_agents": [
            "financial_model_capital_planner",
            "deal_design_pitch_engineer",
            "sales_playbook_account_selector",
        ],
        "operations_agents": [
            "finance-invoicing",
            "crm-sales",
            "job-lifecycle",
        ],
        "workflows": [
            "Delivery to Payment Collection",
            "Overdue Invoice Collection",
        ],
        "kpis": [
            f"Gross revenue vs Year 1 target (THB {FINANCIAL['year1']['gross_revenue']:,.0f})",
            "EBITDA margin (target: >55%)",
            "Invoice collection rate",
            "Days sales outstanding",
            "IRR tracking",
        ],
    },
}

# ── CoWork Sequences ──────────────────────────────────────────

COWORK_COMMANDS = {
    "full-cycle": {
        "name": "Full Business Cycle",
        "description": "End-to-end: market analysis > lead qualification > mission > delivery > payment",
        "teams": ["intelligence", "growth", "delivery", "revenue"],
        "steps": [
            "Market opportunity scan (Market Intelligence)",
            "Route to IFS or Direct KTV (Partner Strategy)",
            "Qualify leads and build pipeline (Sales + CRM)",
            "Deal economics and guardrail validation (Finance)",
            "Plan drone mission and assess feasibility (Ops)",
            "Execute mission and process data (Delivery)",
            "Invoice and collection (Revenue)",
        ],
    },
    "new-partner": {
        "name": "New Partner Onboarding",
        "description": "Evaluate, pitch, and onboard a new partnership opportunity",
        "teams": ["intelligence", "ecosystem", "revenue"],
        "steps": [
            "Market context for partner segment (Market Intelligence)",
            "Determine channel and JV implications (Partner Strategy)",
            "Model financial impact and milestones (Finance)",
            "Generate pitch materials (Deal Design)",
            "Build sector-specific sales playbook (Sales)",
        ],
    },
    "daily-ops": {
        "name": "Daily Operations Briefing",
        "description": "Morning briefing: all teams report status, KPIs, and blockers",
        "teams": ["compliance", "delivery", "revenue", "growth"],
        "steps": [
            "Safety & compliance status (Compliance)",
            "Fleet readiness report (Delivery)",
            "Pilot availability report (Delivery)",
            "Revenue and collections snapshot (Revenue)",
            "Sales pipeline status (Growth)",
            "Data processing queue (Delivery)",
        ],
    },
    "scale-up": {
        "name": "Scale-Up Planning",
        "description": "Plan capacity expansion: market > fleet > pilots > finance > partnerships",
        "teams": ["intelligence", "delivery", "compliance", "revenue", "ecosystem"],
        "steps": [
            "Forecast demand by segment and region (Market Intelligence)",
            "Identify fleet and pilot capacity gaps (Ops + Fleet)",
            "Pilot hiring and certification plan (Compliance)",
            "Capital expenditure and ROI model (Finance)",
            "Partner capacity and territory expansion (Ecosystem)",
        ],
    },
    "smart-green": {
        "name": "Smart Green Rollout",
        "description": "Deploy Smart Green Operations platform to a new site or portfolio",
        "teams": ["ecosystem", "delivery", "compliance", "intelligence"],
        "steps": [
            "Assess site for Smart Green integration (Product)",
            "Design BMS/CMMS integration flow (Product)",
            "Drone operations feasibility for site (Ops)",
            "Configure ESG telemetry capture (Product)",
            "Establish ESG baseline metrics (Intelligence)",
        ],
    },
}


def show_cowork_help() -> str:
    """Show the /cowork command help."""
    lines = []
    lines.append("")
    lines.append("  /cowork — Unified Agent Team Coordination")
    lines.append("  ─────────────────────────────────────────")
    lines.append("  Usage:")
    lines.append("    /cowork              — Show team roster and available commands")
    lines.append("    /cowork quickstart   — Full copy-paste onboarding brief for all agents")
    lines.append("    /cowork teams        — Show all 6 teams with agents and KPIs")
    lines.append("    /cowork <command>    — Run a coordinated multi-team sequence")
    lines.append("    /cowork stats        — Show agent and team statistics")
    lines.append("")
    lines.append("  Commands:")
    for cmd_id, cmd in COWORK_COMMANDS.items():
        lines.append(f"    /cowork {cmd_id:<16} — {cmd['name']}")
    lines.append("")
    return "\n".join(lines)


def show_team_roster() -> str:
    """Display the full team roster with all agents."""
    lines = []
    lines.append("")
    lines.append("╔════════════════════════════════════════════════════════════════════╗")
    lines.append("║              KTV COWORK — Unified Agent Teams                     ║")
    lines.append("║              14 Agents | 6 Teams | 5 Commands                     ║")
    lines.append("╠════════════════════════════════════════════════════════════════════╣")

    for team_id, team in COWORK_TEAMS.items():
        lines.append("║                                                                    ║")
        lines.append(f"║  [{team_id.upper()}] {team['name']}")
        lines.append(f"║  Mission: {team['mission']}")
        lines.append(f"║  Lead: {team['lead']}")
        lines.append("║")
        lines.append("║  Strategy Agents:")
        for sa in team["strategy_agents"]:
            lines.append(f"║    • {sa}")
        lines.append("║  Operations Agents:")
        for oa in team["operations_agents"]:
            lines.append(f"║    • {oa}")
        lines.append("║")
        lines.append("║  KPIs:")
        for kpi in team["kpis"]:
            lines.append(f"║    → {kpi}")
        if team["workflows"]:
            lines.append("║  Automated Workflows:")
            for wf in team["workflows"]:
                lines.append(f"║    ⟳ {wf}")
        lines.append("║")

    lines.append("╠════════════════════════════════════════════════════════════════════╣")
    lines.append("║  Available Commands:                                               ║")
    for cmd_id, cmd in COWORK_COMMANDS.items():
        lines.append(f"║    /cowork {cmd_id:<16} {cmd['name']}")
    lines.append("╚════════════════════════════════════════════════════════════════════╝")
    lines.append("")
    return "\n".join(lines)


def show_cowork_stats() -> str:
    """Show agent and team statistics."""
    all_strategy = set()
    all_ops = set()
    for team in COWORK_TEAMS.values():
        for a in team["strategy_agents"]:
            all_strategy.add(a)
        for a in team["operations_agents"]:
            all_ops.add(a)

    total_workflows = sum(len(t["workflows"]) for t in COWORK_TEAMS.values())
    total_kpis = sum(len(t["kpis"]) for t in COWORK_TEAMS.values())

    lines = []
    lines.append("")
    lines.append("  KTV CoWork Statistics")
    lines.append("  ─────────────────────")
    lines.append(f"  Teams:              {len(COWORK_TEAMS)}")
    lines.append(f"  Strategy Agents:    {len(all_strategy)}")
    lines.append(f"  Operations Agents:  {len(all_ops)}")
    lines.append(f"  Total Agents:       {len(all_strategy) + len(all_ops)}")
    lines.append(f"  Commands:           {len(COWORK_COMMANDS)}")
    lines.append(f"  Automated Workflows:{total_workflows}")
    lines.append(f"  KPIs Tracked:       {total_kpis}")
    lines.append("")
    lines.append("  Strategy Layer (Mastermind):")
    for a in sorted(all_strategy):
        lines.append(f"    • {a}")
    lines.append("")
    lines.append("  Operations Layer:")
    for a in sorted(all_ops):
        lines.append(f"    • {a}")
    lines.append("")
    return "\n".join(lines)


def run_cowork_command(cmd_id: str) -> str:
    """Run a cowork command and return its execution plan."""
    cmd = COWORK_COMMANDS.get(cmd_id)
    if not cmd:
        return f"[CoWork] Unknown command: {cmd_id}. Type /cowork for available commands."

    lines = []
    lines.append("")
    lines.append(f"  CoWork: {cmd['name']}")
    lines.append(f"  {'─' * (len(cmd['name']) + 9)}")
    lines.append(f"  {cmd['description']}")
    lines.append("")

    # Show teams involved
    lines.append("  Teams activated:")
    for team_id in cmd["teams"]:
        team = COWORK_TEAMS[team_id]
        agent_count = len(team["strategy_agents"]) + len(team["operations_agents"])
        lines.append(f"    [{team_id.upper()}] {team['name']} ({agent_count} agents)")
    lines.append("")

    # Show execution sequence
    lines.append("  Execution sequence:")
    for i, step in enumerate(cmd["steps"], 1):
        lines.append(f"    {i}. {step}")
    lines.append("")

    # Show relevant KPIs
    lines.append("  KPIs to monitor:")
    seen_kpis = set()
    for team_id in cmd["teams"]:
        team = COWORK_TEAMS[team_id]
        for kpi in team["kpis"][:2]:
            if kpi not in seen_kpis:
                lines.append(f"    → {kpi}")
                seen_kpis.add(kpi)
    lines.append("")

    return "\n".join(lines)


def generate_quickstart() -> str:
    """Generate the full copy-paste onboarding brief for all agents."""
    return """
================================================================================
KTV COWORK QUICKSTART — COPY-PASTE AGENT ONBOARDING BRIEF
================================================================================

You are part of the KTV Working Drone Thailand CoWork system — a unified team
of 14 AI agents organised into 6 specialist teams. Your mission is to build and
operate Thailand's first-mover drone-enabled FM platform with world-class ESG
data integration.

────────────────────────────────────────────────────────────────────────────────
COMPANY IDENTITY
────────────────────────────────────────────────────────────────────────────────

Company:     KTV Working Drone Thailand Co., Ltd.
Parent:      KTV Group (est. 1992, Norway, 66 franchise countries)
Founder:     Kennet Nilsen
HQ:          Bangkok, Thailand
Address:     Rasa Two, 1818 Petchaburi Rd, Makkasan, Ratchathewi, Bangkok 10400
Website:     https://ktvworkingdrone.com
Platform:    Smart Green Operations — https://www.smartgreenoperations.com

Leadership:
  Director:           Thanvarat K. Agnew (thanvarat@ktvworkingdrone.com)
  Managing Director:  Matthew Peter James (matthew.james@ktvworkingdrone.com)

Certifications:
  - World's only certified provider of autonomous drone cleaning & maintenance
  - Thailand's first drone cleaning provider
  - Patented roof safety system (unique globally)
  - 30+ years proprietary sensor technology (centimetre-level precision)

Key Stats:
  - 80% faster cleaning than traditional methods
  - 96% lower GHG emissions than conventional approaches
  - 100% elimination of high-risk manual tasks (work-at-height)

────────────────────────────────────────────────────────────────────────────────
JV STRUCTURE & PARTNERSHIP
────────────────────────────────────────────────────────────────────────────────

KTV:  50% control (board control, technology owner, brand & operating framework)
IFS:  Up to 50% equity earned via revenue milestones

IFS Thailand — Exclusive FM Partner:
  - 40+ years integrated FM expertise
  - Exclusive FM channel in Phase 1 — ALL drone-enabled FM routes through IFS
  - No competing drone providers allowed
  - Equity triggers: THB 32M → THB 64M → THB 160M cumulative revenue
  - Smart Green milestone: minimum 5 integrated sites, 3 months operation

IFS Sectors: Aviation, Business & IT, Healthcare, Energy & Resources,
Manufacturing, Commercial Real Estate, Campuses, Government, Transport,
Hotels & Hospitality, Education, Data Centers, Sporting Facilities, Solar

Channel Routing Rules:
  - FM scope (facade, window, solar, inspection via FM) → Route through IFS
  - Non-FM (agriculture, media, survey, training academy) → Direct KTV

────────────────────────────────────────────────────────────────────────────────
SMART GREEN OPERATIONS — THE DATA MOAT
────────────────────────────────────────────────────────────────────────────────

Smart city integration platform linking autonomous drones, ESG data, and FM
workflows with existing BMS & IFM (CMMS) systems.

Core Functions:
  - Orchestrates drone missions and work orders across multiple sites
  - Captures telemetry: sqm cleaned, water/chemical use, height time avoided
  - Produces cryptographically verifiable ESG metrics for GRESB reporting
  - Integrates with Building Management Systems (BMS) and CMMS
  - Complete work/inspection history with full oversight of external damage
  - Predictive maintenance capabilities and strategic planning tools

Telemetry Fields: sqm_cleaned, water_consumption_liters,
chemical_consumption_liters, time_at_height_avoided_minutes, energy_usage_kwh,
safety_incidents, mission_duration_minutes, carbon_offset_kg, pm25_readings,
facade_condition_score

Rule: Smart Green is KTV's unassailable competitive advantage. No decision
should weaken the data layer.

────────────────────────────────────────────────────────────────────────────────
FINANCIAL BASELINE (2026)
────────────────────────────────────────────────────────────────────────────────

Currency: THB | FX: 35.5 THB/USD
Base price: 30 THB/sqm (market range: 27-60 THB/sqm)
Minimum order: 20,000 sqm per service cycle

Year 1 Targets:
  Gross Revenue:    THB 180,180,000 (~$5.08M)
  Implied Sqm:     4,004,000
  Net Income:       THB 112,283,616
  Free Cash Flow:   THB 97,884,816
  IRR:              260-280%
  Payback:          9-11 months

Capital: USD 1,455,000 (THB 51,652,500)
Tax: 7% VAT, 7% royalty to KTV Group, 20% corporate tax

Financial Guardrails (NEVER BREACH):
  - Payback must be < 18 months (target < 12)
  - EBITDA margin must be > 40% (healthy > 55%)
  - Price must not fall below 27 THB/sqm
  - Minimum order: 20,000 sqm
  - NPV must be positive at 10% discount rate
  - No fleet overcommit (>2000 drone-hours/year per deal needs dedicated alloc)

Sector Pricing:
  Base (30): Commercial, Retail, Transport, Education(private), Infrastructure
  Hotels (33): +10%
  Industrial (36): +20%
  Government/Edu-govt (27): -10%
  Mission-critical/Data centres (37.50): +25%
  Emergency: 50K THB callout + 60 THB/sqm (weekend +30%, night +25%, express +50%)

────────────────────────────────────────────────────────────────────────────────
SERVICE LINES
────────────────────────────────────────────────────────────────────────────────

  Facade Cleaning ........... 30 THB/sqm    Solar Panel Cleaning .. 30 THB/sqm
  Window Cleaning ........... 30 THB/sqm    Vertical Gardens ...... 40 THB/sqm
  PM2.5 Pollution Control ... 35 THB/sqm    Infrastructure ........ 35-50 THB/sqm
  Jet Wash .................. 45 THB/sqm    Building Inspection ... 15K-80K THB/project
  Agricultural Spraying ..... 80-120 THB/rai Survey & Mapping ...... 15K-80K THB/project
  Media Production .......... 15K-150K THB/project

Products:
  KTV CARE Agreement: 36-month maintenance partnership, quarterly inspections
  Technology Partnership: White-label drone FM for partner FM companies (36-month)

────────────────────────────────────────────────────────────────────────────────
OPERATIONS & COMPLIANCE
────────────────────────────────────────────────────────────────────────────────

Fleet (16 drones):
  Cleaning:   DJI Agras T50 x4, Agras T25 x2
  Inspection: Matrice 350 RTK x2, Matrice 30T x2, Mavic 3 Enterprise RTK x2
  Media:      Inspire 3 x1, Mavic 3 Pro Cine x1

CAAT Regulations (NEVER VIOLATE):
  - Max altitude: 90m
  - Airport buffer: 9km
  - Min insurance: THB 1,000,000
  - Registration: all drones >250g
  - Pilot license (RPL) + UAOC mandatory
  - NOTAM filing required for all commercial ops

Crew Requirements:
  Facade cleaning: 2 pilots + 2 ground crew + 1 supervisor
  Building inspection: 1 pilot + 1 ground crew + 1 supervisor
  O&G inspection: 2 pilots + 2 ground crew + 1 supervisor + 1 safety officer

Operational Parameters:
  Cleaning rate: ~500 sqm/drone-hour | Water: ~0.3 L/sqm | Chemical: ~0.05 L/sqm
  Battery swaps: ~3/hour | Weather limits: wind <8m/s, no rain, visibility >5km
  Working: 6 productive hours/drone/day, 22 days/month, 250 days/year

SAFETY IS NON-NEGOTIABLE. Target: ZERO work-at-height incidents.

────────────────────────────────────────────────────────────────────────────────
YOUR 6 TEAMS
────────────────────────────────────────────────────────────────────────────────

TEAM 1: GROWTH ENGINE
  Mission: Find, qualify, route market opportunities through IFS or Direct KTV
  Lead: market_intelligence_strategist
  Strategy: market_intelligence + partner_strategy + sales_playbook
  Operations: crm-sales + job-lifecycle
  Workflow: Lead Qualification & Onboarding
  KPIs: leads/week, conversion rate, pipeline value, channel split

TEAM 2: SERVICE DELIVERY
  Mission: Execute drone missions end-to-end with zero safety incidents
  Lead: operations_compliance_mission_planner
  Strategy: operations_compliance + smart_green_product
  Operations: fleet-management + job-lifecycle + pilot-operations +
              safety-compliance + data-processing
  Workflows: Mission Prep, Pre-Flight, Post-Mission Data Pipeline
  KPIs: missions/week, sqm cleaned, safety incidents (0), on-time rate, backups

TEAM 3: COMPLIANCE & SAFETY
  Mission: Maintain zero incidents, CAAT compliance, fleet readiness
  Lead: operations_compliance_mission_planner
  Strategy: operations_compliance
  Operations: safety-compliance + fleet-management + pilot-operations
  Workflows: Incident Response, Maintenance Scheduling, Cert Expiry
  KPIs: incidents (0), pre-flight pass rate (>95%), fleet availability, certs

TEAM 4: MARKET INTELLIGENCE
  Mission: Real-time market analysis, competitor tracking, strategic recs
  Lead: market_intelligence_strategist
  Strategy: market_intelligence + partner_strategy + smart_green_product
  Operations: crm-sales + data-processing
  KPIs: TAM/SAM accuracy, scored pipeline, competitive intel, Smart Green rate

TEAM 5: ECOSYSTEM BUILDER
  Mission: Build IFS partnership, Smart Green integrations, new channels
  Lead: partner_strategy_architect
  Strategy: partner_strategy + deal_design + smart_green_product + sales_playbook
  Operations: crm-sales + job-lifecycle
  KPIs: IFS milestones (32M>64M>160M), integrated sites, partner score, proposals

TEAM 6: REVENUE OPERATIONS
  Mission: Maximise revenue, healthy margins, timely collections
  Lead: financial_model_capital_planner
  Strategy: financial_model + deal_design + sales_playbook
  Operations: finance-invoicing + crm-sales + job-lifecycle
  Workflows: Delivery to Payment, Overdue Collection
  KPIs: revenue vs 180.18M target, EBITDA >55%, collection rate, DSO, IRR

────────────────────────────────────────────────────────────────────────────────
PHASE 1 PRIORITY TARGETS (via IFS)
────────────────────────────────────────────────────────────────────────────────

  Icon Siam ............. Retail, 75K sqm (Siam Piwat) — flagship visibility
  One Bangkok ........... Commercial, 104K sqm (TCC Group) — largest single-site
  Suvarnabhumi Airport .. Aviation, 120K sqm (AOT) — strategic anchor
  PTT Refinery Rayong ... O&G, 35K sqm (PTT) — premium pricing proof
  Thammasat Rangsit ..... Campus, 80K sqm — multi-building model
  Amata City Chonburi ... Industrial, 200K sqm (Amata Corp) — volume play
  + CentralWorld, King Power Mahanakhon, Magnolias Waterfront, Bumrungrad,
    Map Ta Phut, True Digital Park, IRPC Refinery, The Parq

────────────────────────────────────────────────────────────────────────────────
CORE RULES — EVERY AGENT MUST FOLLOW
────────────────────────────────────────────────────────────────────────────────

1. Always act in KTV's strategic interest — protect brand, data moat, IFS
2. Prefer simple, high-ROI, low-risk paths over complicated options
3. Respect the JV: KTV 50% control, IFS up to 50% via milestones
4. Smart Green is the moat — never weaken the data layer
5. Safety is non-negotiable — zero work-at-height incidents
6. Never invent financial numbers — source from the financial model
7. All FM opportunities route through IFS (non-FM = Direct KTV)
8. Never violate CAAT regulations
9. Never approve deals that breach financial guardrails
10. Combine agent results into coherent, actionable outputs

────────────────────────────────────────────────────────────────────────────────
AVAILABLE COWORK COMMANDS
────────────────────────────────────────────────────────────────────────────────

  /cowork full-cycle    — End-to-end: market > qualify > mission > deliver > pay
  /cowork new-partner   — Evaluate, pitch, and onboard a new partnership
  /cowork daily-ops     — Morning briefing across all teams
  /cowork scale-up      — Capacity expansion: market > fleet > pilots > finance
  /cowork smart-green   — Deploy Smart Green to a new site or portfolio

────────────────────────────────────────────────────────────────────────────────
GETTING STARTED — FIRST ACTIONS
────────────────────────────────────────────────────────────────────────────────

1. Run /cowork daily-ops to get a full status briefing across all teams
2. Run /cowork full-cycle to execute a complete business cycle
3. Ask any strategic question — the Mastermind routes to the right agents
4. Use /cowork <team-name> to drill into a specific team (e.g. /cowork growth)
5. Use /cowork stats to see the full agent and team breakdown

Example prompts to try:
  "Design Phase 1 FM rollout with IFS"
  "Check economics for Icon Siam facade cleaning — 75,000 sqm at 50 THB/sqm"
  "Route this opportunity: PTT refinery inspection, 35,000 sqm"
  "Create a one-pager for IFS Thailand MD"
  "What's our fleet capacity for Year 1?"
  "Prioritise top 5 accounts for Phase 1 pilots"
  "Model the financial impact of adding 4 more drones"
  "Assess CAAT feasibility for Suvarnabhumi Airport"

================================================================================
END OF QUICKSTART — ALL 14 AGENTS READY
================================================================================
"""


def handle_cowork(args: str) -> str:
    """Handle the /cowork command with arguments."""
    args = args.strip().lower()

    if not args or args == "help":
        return show_team_roster()

    if args == "teams":
        return show_team_roster()

    if args == "stats":
        return show_cowork_stats()

    if args == "quickstart":
        return generate_quickstart()

    # Check if it's a command
    if args in COWORK_COMMANDS:
        return run_cowork_command(args)

    # Check if it's a team name
    if args in COWORK_TEAMS:
        team = COWORK_TEAMS[args]
        lines = []
        lines.append("")
        lines.append(f"  [{args.upper()}] {team['name']}")
        lines.append(f"  Mission: {team['mission']}")
        lines.append(f"  Lead: {team['lead']}")
        lines.append("")
        lines.append("  Strategy Agents:")
        for sa in team["strategy_agents"]:
            lines.append(f"    • {sa}")
        lines.append("  Operations Agents:")
        for oa in team["operations_agents"]:
            lines.append(f"    • {oa}")
        lines.append("")
        lines.append("  KPIs:")
        for kpi in team["kpis"]:
            lines.append(f"    → {kpi}")
        if team["workflows"]:
            lines.append("  Automated Workflows:")
            for wf in team["workflows"]:
                lines.append(f"    ⟳ {wf}")
        lines.append("")
        return "\n".join(lines)

    return show_cowork_help()
