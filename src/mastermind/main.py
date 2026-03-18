#!/usr/bin/env python3
"""
KTV Mastermind — CLI Entry Point
Interactive REPL for the KTV Working Drone Thailand strategic AI brain.

Usage:
  python -m mastermind                    # Interactive REPL
  python -m mastermind "your question"    # Single query mode
  python -m mastermind --seed             # Seed memory files with baseline data
  python -m mastermind --status           # Show system status
"""

import sys
import json
import argparse
from pathlib import Path

from .orchestrator import create_mastermind
from .memory import run_memory_command, memory_list
from .seed import seed_all_memories


BANNER = """
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   KTV MASTERMIND — Strategic AI Brain                           ║
║   KTV Working Drone Thailand                                    ║
║                                                                  ║
║   7 Agents: Market | Partner | Smart Green | Finance            ║
║             Deal Design | Sales | Operations                    ║
║                                                                  ║
║   JV: KTV 50% | IFS 25% | Skyller 25%                         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
"""

HELP_TEXT = """
Commands:
  /agents     — List all 7 strategy agents
  /memory     — Show memory file index
  /stats      — Show session statistics
  /reset      — Clear conversation history
  /seed       — Seed memory with baseline data
  /status     — Show system status
  /help       — Show this help
  /quit       — Exit

Example queries:
  "Design Phase 1 FM rollout with IFS"
  "Check economics for Icon Siam facade cleaning — 75,000 sqm at 50 THB/sqm"
  "Route this opportunity: PTT refinery inspection, 35,000 sqm"
  "Create a one-pager for IFS Thailand MD"
  "What's our fleet capacity for Year 1?"
  "Prioritise top 5 accounts for Phase 1 pilots"
"""


def run_repl():
    """Run the interactive REPL."""
    print(BANNER)
    mastermind = create_mastermind()
    stats = mastermind.get_stats()
    mode = "ONLINE (Claude API)" if stats["online"] else "OFFLINE (local agents)"
    print(f"  Mode: {mode}")
    print(f"  Model: {stats['model']}")
    print(f"\n  Type /help for commands, or ask anything about KTV operations.\n")

    while True:
        try:
            user_input = input("KTV> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n[Mastermind] Goodbye.")
            break

        if not user_input:
            continue

        # Handle commands
        if user_input.startswith("/"):
            cmd = user_input.lower().split()[0]
            if cmd in ("/quit", "/exit", "/q"):
                print("[Mastermind] Goodbye.")
                break
            elif cmd == "/help":
                print(HELP_TEXT)
            elif cmd == "/agents":
                _show_agents()
            elif cmd == "/memory":
                print(memory_list())
            elif cmd == "/stats":
                print(json.dumps(mastermind.get_stats(), indent=2))
            elif cmd == "/reset":
                mastermind.reset_conversation()
                print("[Mastermind] Conversation cleared.")
            elif cmd == "/seed":
                seed_all_memories()
                print("[Mastermind] Memory seeded with baseline data.")
            elif cmd == "/status":
                _show_status(mastermind)
            else:
                print(f"Unknown command: {cmd}. Type /help for available commands.")
            continue

        # Send to Mastermind
        print("\n[Thinking...]\n")
        response = mastermind.chat(user_input)
        print(response)
        print()


def run_single_query(query: str):
    """Run a single query and print the response."""
    mastermind = create_mastermind()
    response = mastermind.chat(query)
    print(response)


def _show_agents():
    print("""
  KTV Mastermind — 7 Strategy Agents
  ───────────────────────────────────
  1. market_intelligence_strategist
     → TAM/SAM/SOM, segment analysis, opportunity ranking

  2. partner_strategy_architect
     → JV routing (IFS/Skyller/Direct), equity milestones, channel rules

  3. smart_green_product_orchestrator
     → ESG integration, GRESB readiness, telemetry design

  4. financial_model_capital_planner
     → Deal economics, IRR/NPV/payback, guardrail checks

  5. deal_design_pitch_engineer
     → Decks, one-pagers, emails, term sheets, proposals

  6. sales_playbook_account_selector
     → Account prioritisation, sector playbooks, pilot proposals

  7. operations_compliance_mission_planner
     → CAAT feasibility, fleet planning, SOPs, crew requirements
""")


def _show_status(mastermind):
    stats = mastermind.get_stats()
    mem = memory_list()
    print(f"""
  KTV Mastermind Status
  ─────────────────────
  Mode:        {"ONLINE" if stats["online"] else "OFFLINE"}
  Model:       {stats["model"]}
  Messages:    {stats["messages"]}
  Tool calls:  {stats["tool_calls"]}
  Agents used: {", ".join(stats["agents_used"]) or "None yet"}

  Memory:
  {mem}
""")


def main():
    parser = argparse.ArgumentParser(description="KTV Mastermind — Strategic AI Brain")
    parser.add_argument("query", nargs="?", help="Single query to process")
    parser.add_argument("--seed", action="store_true", help="Seed memory with baseline data")
    parser.add_argument("--status", action="store_true", help="Show system status")
    parser.add_argument("--model", help="Override Claude model")
    parser.add_argument("--api-key", help="Anthropic API key")
    args = parser.parse_args()

    if args.seed:
        seed_all_memories()
        print("[Mastermind] Memory seeded with baseline data.")
        return

    if args.status:
        mastermind = create_mastermind(api_key=args.api_key, model=args.model)
        _show_status(mastermind)
        return

    if args.query:
        run_single_query(args.query)
    else:
        run_repl()


if __name__ == "__main__":
    main()
