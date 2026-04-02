"""KTV Mastermind — Agent Handlers"""

from .market_intelligence import handle as handle_market_intelligence
from .partner_strategy import handle as handle_partner_strategy
from .smart_green import handle as handle_smart_green
from .financial_model import handle as handle_financial_model
from .deal_design import handle as handle_deal_design
from .sales_playbook import handle as handle_sales_playbook
from .ops_compliance import handle as handle_ops_compliance

AGENT_HANDLERS = {
    "market_intelligence_strategist": handle_market_intelligence,
    "partner_strategy_architect": handle_partner_strategy,
    "smart_green_product_orchestrator": handle_smart_green,
    "financial_model_capital_planner": handle_financial_model,
    "deal_design_pitch_engineer": handle_deal_design,
    "sales_playbook_account_selector": handle_sales_playbook,
    "operations_compliance_mission_planner": handle_ops_compliance,
}
