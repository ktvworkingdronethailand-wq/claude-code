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


def handle_cowork(args: str) -> str:
    """Handle the /cowork command with arguments."""
    args = args.strip().lower()

    if not args or args == "help":
        return show_team_roster()

    if args == "teams":
        return show_team_roster()

    if args == "stats":
        return show_cowork_stats()

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
