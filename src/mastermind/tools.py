"""
KTV Mastermind — Claude API Tool Definitions

Defines the JSON tool schemas for all 7 strategy agents + memory tool.
These are passed directly to client.messages.create(tools=TOOLS).
"""


def _agent_tool(name: str, description: str, properties: dict, required: list) -> dict:
    return {
        "name": name,
        "description": description,
        "input_schema": {
            "type": "object",
            "properties": properties,
            "required": required,
        },
    }


# ── Memory Tool ───────────────────────────────────────────────

MEMORY_TOOL = _agent_tool(
    name="memory",
    description=(
        "Persistent KTV memory system. Use to store and recall strategic data.\n"
        "Commands: view, append, str_replace, create, list, search.\n"
        "File paths are relative to /memories/ (e.g., 'business/ktv_core.txt').\n"
        "Before strategic recommendations, VIEW relevant files first."
    ),
    properties={
        "command": {
            "type": "string",
            "enum": ["view", "append", "str_replace", "create", "list", "search"],
            "description": "The memory operation to perform.",
        },
        "file_path": {
            "type": "string",
            "description": "Path relative to /memories/ (e.g., 'partners/ifs_thailand.txt').",
        },
        "content": {
            "type": "string",
            "description": "Content to write (for append/create).",
        },
        "old_str": {
            "type": "string",
            "description": "String to find (for str_replace).",
        },
        "new_str": {
            "type": "string",
            "description": "Replacement string (for str_replace).",
        },
        "directory": {
            "type": "string",
            "description": "Subdirectory to list or search (for list/search).",
        },
        "query": {
            "type": "string",
            "description": "Search query string (for search).",
        },
    },
    required=["command"],
)

# ── Agent 1: Market Intelligence Strategist ───────────────────

MARKET_INTELLIGENCE_TOOL = _agent_tool(
    name="market_intelligence_strategist",
    description=(
        "Maps Thailand FM and drone/DaaS markets. Provides TAM/SAM/SOM estimates, "
        "segment growth rates, competitive landscape, and ranked opportunity lists. "
        "Use for market sizing, sector analysis, and opportunity identification."
    ),
    properties={
        "task": {
            "type": "string",
            "description": "What market analysis to perform.",
        },
        "sectors": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Sectors to analyse (e.g., ['commercial-towers', 'healthcare']).",
        },
        "region": {
            "type": "string",
            "description": "Geographic focus (default: Bangkok/Thailand).",
        },
        "depth": {
            "type": "string",
            "enum": ["quick", "standard", "deep"],
            "description": "Analysis depth level.",
        },
    },
    required=["task"],
)

# ── Agent 2: Partner Strategy Architect ───────────────────────

PARTNER_STRATEGY_TOOL = _agent_tool(
    name="partner_strategy_architect",
    description=(
        "Applies JV rules between KTV (50%), IFS (up to 25%), and Skyller (up to 25%). "
        "For each opportunity, decides routing (IFS / Skyller / Direct KTV), "
        "channel constraints, and equity milestone implications. "
        "Respects exclusivity, non-compete, and equity caps."
    ),
    properties={
        "task": {
            "type": "string",
            "description": "What partner/routing decision to make.",
        },
        "opportunity": {
            "type": "object",
            "properties": {
                "client": {"type": "string"},
                "sector": {"type": "string"},
                "service_type": {"type": "string"},
                "estimated_sqm": {"type": "number"},
                "estimated_revenue_thb": {"type": "number"},
            },
            "description": "Opportunity details to route.",
        },
        "check_equity_impact": {
            "type": "boolean",
            "description": "Whether to evaluate equity milestone implications.",
        },
    },
    required=["task"],
)

# ── Agent 3: Smart Green Product Orchestrator ─────────────────

SMART_GREEN_TOOL = _agent_tool(
    name="smart_green_product_orchestrator",
    description=(
        "Designs Smart Green Operations integration into FM workflows and ESG reporting. "
        "Defines ESG metrics, GRESB reporting flows, telemetry capture, "
        "and adoption/usage milestones for IFS and end clients."
    ),
    properties={
        "task": {
            "type": "string",
            "description": "What Smart Green design/assessment to perform.",
        },
        "site_type": {
            "type": "string",
            "description": "Type of site (e.g., 'commercial-tower', 'campus', 'industrial').",
        },
        "metrics_needed": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Specific ESG/telemetry metrics to design for.",
        },
        "integration_target": {
            "type": "string",
            "enum": ["ifs", "client-direct", "skyller"],
            "description": "Which partner integration to design.",
        },
    },
    required=["task"],
)

# ── Agent 4: Financial Model & Capital Planner ────────────────

FINANCIAL_MODEL_TOOL = _agent_tool(
    name="financial_model_capital_planner",
    description=(
        "Evaluates deals using KTV Thailand's 3-year financial model. "
        "Uses 45 THB/sqm base case. Returns IRR, NPV, payback, margins, "
        "capacity requirements and guardrail flags with recommendations. "
        "Flags deals that breach payback, margin, or fleet capacity limits."
    ),
    properties={
        "task": {
            "type": "string",
            "description": "What financial analysis to perform.",
        },
        "deal": {
            "type": "object",
            "properties": {
                "client": {"type": "string"},
                "service_line": {"type": "string"},
                "sqm_annual": {"type": "number"},
                "price_per_sqm": {"type": "number"},
                "contract_years": {"type": "number"},
                "frequency": {"type": "string"},
            },
            "description": "Deal parameters to evaluate.",
        },
        "scenario": {
            "type": "string",
            "enum": ["base", "conservative", "aggressive"],
            "description": "Which scenario to model.",
        },
        "check_guardrails": {
            "type": "boolean",
            "description": "Whether to check financial guardrails.",
        },
    },
    required=["task"],
)

# ── Agent 5: Deal Design & Pitch Engineer ─────────────────────

DEAL_DESIGN_TOOL = _agent_tool(
    name="deal_design_pitch_engineer",
    description=(
        "Turns strategy and numbers into decks, one-pagers, email text, and term-sheet sections. "
        "Produces structured artifacts that humans can drop into PowerPoint or email. "
        "Aligns language with IFS and Skyller positioning. "
        "Reads factual JV and financial details from memory — never invents them."
    ),
    properties={
        "task": {
            "type": "string",
            "description": "What deliverable to produce.",
        },
        "artifact_type": {
            "type": "string",
            "enum": ["deck-slide", "one-pager", "email", "term-sheet", "executive-summary", "proposal"],
            "description": "Type of output to generate.",
        },
        "audience": {
            "type": "string",
            "description": "Who will read this (e.g., 'IFS Thailand MD', 'building owner').",
        },
        "key_points": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Key messages or data points to include.",
        },
        "tone": {
            "type": "string",
            "enum": ["formal", "conversational", "executive"],
            "description": "Communication tone.",
        },
    },
    required=["task", "artifact_type"],
)

# ── Agent 6: Sales Playbook & Account Selector ────────────────

SALES_PLAYBOOK_TOOL = _agent_tool(
    name="sales_playbook_account_selector",
    description=(
        "Prioritises accounts (especially through IFS Thailand's FM portfolio), "
        "designs sector playbooks, and proposes pilot structures. "
        "Returns ranked target lists with route (IFS/Skyller/Direct), "
        "sqm and price suggestions, and sector-specific playbooks."
    ),
    properties={
        "task": {
            "type": "string",
            "description": "What sales planning to perform.",
        },
        "sector": {
            "type": "string",
            "description": "Target sector to plan for.",
        },
        "budget_range_thb": {
            "type": "object",
            "properties": {
                "min": {"type": "number"},
                "max": {"type": "number"},
            },
            "description": "Client budget range in THB.",
        },
        "pilot_sites": {
            "type": "integer",
            "description": "Number of pilot sites to propose.",
        },
        "prioritise_by": {
            "type": "string",
            "enum": ["revenue", "sqm", "strategic-value", "ease-of-win"],
            "description": "How to rank accounts.",
        },
    },
    required=["task"],
)

# ── Agent 7: Operations & Compliance Mission Planner ──────────

OPS_COMPLIANCE_TOOL = _agent_tool(
    name="operations_compliance_mission_planner",
    description=(
        "Checks Thai regulatory and operational feasibility, plans fleet/crew/training, "
        "and outlines SOPs. Validates against CAAT regulations (90m altitude, 9km airport buffer). "
        "Returns feasibility status, capacity plans, and SOP outlines for different site types. "
        "Never proposes operations that violate safety or regulatory constraints."
    ),
    properties={
        "task": {
            "type": "string",
            "description": "What operational assessment to perform.",
        },
        "site": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "type": {"type": "string"},
                "height_m": {"type": "number"},
                "location": {"type": "string"},
                "near_airport": {"type": "boolean"},
            },
            "description": "Site details for feasibility check.",
        },
        "fleet_required": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Drone types needed for this operation.",
        },
        "check_caat": {
            "type": "boolean",
            "description": "Whether to validate against CAAT regulations.",
        },
    },
    required=["task"],
)

# ── Combined Tool List ────────────────────────────────────────

TOOLS = [
    MEMORY_TOOL,
    MARKET_INTELLIGENCE_TOOL,
    PARTNER_STRATEGY_TOOL,
    SMART_GREEN_TOOL,
    FINANCIAL_MODEL_TOOL,
    DEAL_DESIGN_TOOL,
    SALES_PLAYBOOK_TOOL,
    OPS_COMPLIANCE_TOOL,
]
