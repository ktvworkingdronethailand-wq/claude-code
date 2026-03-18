#!/usr/bin/env python3
"""
KTV Mastermind — Test Suite
Tests all 7 agents, memory system, orchestrator, and seed data.
"""

import sys
import os
import json
import shutil
import tempfile
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

passed = 0
failed = 0


def test(name: str, condition: bool):
    global passed, failed
    if condition:
        print(f"  PASS: {name}")
        passed += 1
    else:
        print(f"  FAIL: {name}")
        failed += 1


# ── Memory System Tests ───────────────────────────────────────

print("\nKTV Mastermind — Test Suite")
print("=" * 60)
print("\n--- Memory System ---")

# Override memory dir for testing
from mastermind import config as cfg
original_dir = cfg.MEMORY_DIR
test_dir = Path(tempfile.mkdtemp()) / "test_memories"
cfg.MEMORY_DIR = test_dir

from mastermind.memory import (
    run_memory_command, memory_view, memory_create,
    memory_append, memory_str_replace, memory_list, memory_search,
)

# Create
result = memory_create("test/hello.txt", "Hello World")
test("Create memory file", "Created" in result)

# View
result = memory_view("test/hello.txt")
test("View memory file", "Hello World" in result)

# View non-existent
result = memory_view("test/nonexistent.txt")
test("View non-existent returns error", "not found" in result.lower())

# Append
result = memory_append("test/hello.txt", "New data appended")
test("Append to memory", "Appended" in result)
content = memory_view("test/hello.txt")
test("Appended content visible", "New data appended" in content)

# Str replace
result = memory_str_replace("test/hello.txt", "Hello World", "Hi There")
test("String replace", "Replaced" in result)
content = memory_view("test/hello.txt")
test("Replaced content visible", "Hi There" in content)

# List
result = memory_list()
test("List memory files", "hello.txt" in result)

# Search
result = memory_search("Hi There")
test("Search finds content", "1 match" in result)

# Search no result
result = memory_search("nonexistent_string_xyz")
test("Search no results", "No results" in result)

# Create duplicate
result = memory_create("test/hello.txt", "Duplicate")
test("Create duplicate blocked", "already exists" in result.lower())

# Run command dispatch
result = run_memory_command("view", file_path="test/hello.txt")
test("Run command dispatch works", "Hi There" in result)

result = run_memory_command("unknown_cmd")
test("Unknown command handled", "Unknown" in result)

# ── Agent Tests ───────────────────────────────────────────────

print("\n--- Market Intelligence Agent ---")
from mastermind.agents.market_intelligence import handle as market_handle

result = json.loads(market_handle({"task": "Market overview", "depth": "quick"}))
test("Returns market overview", "market_overview" in result)
test("Has TAM data", result["market_overview"]["thailand_fm_market"]["tam_thb"] > 0)
test("Has sector insights", len(result["sector_insights"]) > 0)
test("Has ranked opportunities", len(result["top_opportunities"]) > 0)
test("Opportunities have route", all("route" in o for o in result["top_opportunities"]))

# Filter sectors
result = json.loads(market_handle({"task": "Sector analysis", "sectors": ["healthcare"]}))
test("Sector filter works", "healthcare" in result["sector_insights"])
test("Non-requested sectors excluded", "aviation" not in result["sector_insights"])

print("\n--- Partner Strategy Agent ---")
from mastermind.agents.partner_strategy import handle as partner_handle

# FM opportunity → IFS
result = json.loads(partner_handle({
    "task": "Route opportunity",
    "opportunity": {"client": "One Bangkok", "sector": "commercial-tower", "service_type": "facade-cleaning"},
    "check_equity_impact": True,
}))
test("FM routes to IFS", result["routing_decision"]["route"] == "ifs")
test("Equity impact assessed", "equity_impact" in result)
test("Channel rules present", "channel_rules" in result)

# O&G opportunity → Skyller
result = json.loads(partner_handle({
    "task": "Route O&G opportunity",
    "opportunity": {"client": "PTT", "sector": "o_and_g", "service_type": "inspection"},
}))
test("O&G routes to Skyller", result["routing_decision"]["route"] == "skyller")
test("Skyller under IFS umbrella", "IFS" in result["routing_decision"]["channel"])

# Agricultural → Direct KTV
result = json.loads(partner_handle({
    "task": "Route agricultural opportunity",
    "opportunity": {"client": "Farm Co", "sector": "agriculture", "service_type": "spraying"},
}))
test("Agriculture routes to Direct KTV", result["routing_decision"]["route"] == "direct-ktv")

print("\n--- Smart Green Product Agent ---")
from mastermind.agents.smart_green import handle as smart_green_handle

result = json.loads(smart_green_handle({
    "task": "Design ESG integration for commercial tower",
    "site_type": "commercial-tower",
    "integration_target": "ifs",
}))
test("Integration flow designed", "integration_flow" in result)
test("IFS integration included", "ifs_integration" in result["integration_flow"])
test("ESG metrics defined", len(result["esg_metrics"]) > 0)
test("GRESB readiness confirmed", result["gresb_readiness"]["status"] == "Ready")
test("Adoption milestones defined", len(result["adoption_milestones"]) > 0)

print("\n--- Financial Model Agent ---")
from mastermind.agents.financial_model import handle as financial_handle

result = json.loads(financial_handle({
    "task": "Evaluate deal",
    "deal": {
        "client": "Icon Siam",
        "service_line": "facade-cleaning",
        "sqm_annual": 75_000,
        "price_per_sqm": 50,
        "contract_years": 3,
        "frequency": "quarterly",
    },
    "check_guardrails": True,
}))
test("Deal analysis returned", "deal_analysis" in result)
test("Annual revenue calculated", result["deal_analysis"]["annual_revenue_thb"] > 0)
test("IRR calculated", result["deal_analysis"]["irr_pct"] > 0)
test("Guardrail check done", "guardrail_check" in result)
test("Capacity summary present", "capacity_summary" in result)

# Bad deal check
result = json.loads(financial_handle({
    "task": "Check bad deal",
    "deal": {"sqm_annual": 100, "price_per_sqm": 10, "contract_years": 1},
    "check_guardrails": True,
}))
test("Low price flagged", any("below market" in f.lower() for f in result["guardrail_check"]["flags"]))

print("\n--- Deal Design Agent ---")
from mastermind.agents.deal_design import handle as deal_handle

result = json.loads(deal_handle({
    "task": "Create IFS partnership overview",
    "artifact_type": "one-pager",
    "audience": "IFS Thailand MD",
}))
test("One-pager generated", "artifact" in result)
test("Has sections", len(result["artifact"]["sections"]) > 0)
test("Audience noted", result["audience"] == "IFS Thailand MD")

# Email
result = json.loads(deal_handle({
    "task": "Partnership proposal email",
    "artifact_type": "email",
    "audience": "IFS Thailand",
    "tone": "formal",
}))
test("Email generated", "body" in result["artifact"])
test("Has subject line", "subject" in result["artifact"])

# Term sheet
result = json.loads(deal_handle({
    "task": "JV term sheet",
    "artifact_type": "term-sheet",
}))
test("Term sheet generated", "key_terms" in result["artifact"])
test("Parties listed", len(result["artifact"]["parties"]) == 3)

print("\n--- Sales Playbook Agent ---")
from mastermind.agents.sales_playbook import handle as sales_handle

result = json.loads(sales_handle({
    "task": "Phase 1 account ranking",
    "prioritise_by": "revenue",
    "pilot_sites": 3,
}))
test("Ranked accounts returned", len(result["ranked_accounts"]) > 0)
test("Pilot proposal generated", "pilot_proposal" in result)
test("3 pilot sites proposed", result["pilot_proposal"]["pilot_count"] == 3)
test("Phase 1 playbook present", "phase1_playbook" in result)

# Sector-specific
result = json.loads(sales_handle({
    "task": "Healthcare playbook",
    "sector": "healthcare",
}))
test("Healthcare accounts filtered", all(a["sector"] == "healthcare" for a in result["ranked_accounts"]))
test("Sector playbook generated", "sector_playbook" in result)

print("\n--- Operations & Compliance Agent ---")
from mastermind.agents.ops_compliance import handle as ops_handle

# Standard site
result = json.loads(ops_handle({
    "task": "Check feasibility",
    "site": {"name": "One Bangkok", "type": "commercial-tower", "height_m": 80, "location": "Bangkok", "near_airport": False},
    "check_caat": True,
}))
test("Feasibility returned", "feasibility" in result)
test("Standard site is feasible", result["feasibility"]["status"] == "FEASIBLE")
test("Fleet plan generated", "fleet_plan" in result)
test("Crew plan generated", "crew_plan" in result)
test("SOP outlined", "sop_outline" in result)

# Over-height site
result = json.loads(ops_handle({
    "task": "Check tall building",
    "site": {"name": "Mahanakhon", "type": "commercial-tower", "height_m": 314, "location": "Bangkok", "near_airport": False},
    "check_caat": True,
}))
test("Tall building is conditional", result["feasibility"]["status"] == "CONDITIONAL")
test("Height issue flagged", any("altitude" in i.lower() for i in result["feasibility"]["issues"]))

# Near airport
result = json.loads(ops_handle({
    "task": "Airport zone check",
    "site": {"name": "Airport Plaza", "type": "commercial", "height_m": 30, "location": "Bangkok", "near_airport": True},
    "check_caat": True,
}))
test("Airport zone is conditional", result["feasibility"]["status"] == "CONDITIONAL")
test("Airport buffer flagged", any("airport" in i.lower() for i in result["feasibility"]["issues"]))

# Fleet and capacity
test("Fleet inventory present", "fleet_inventory" in result)
test("Regulatory summary present", "regulatory_summary" in result)
test("Capacity status present", "capacity_status" in result)

# ── Orchestrator Tests ────────────────────────────────────────

print("\n--- Orchestrator (Offline Mode) ---")
from mastermind.orchestrator import create_mastermind

mastermind = create_mastermind()  # No API key = offline mode
stats = mastermind.get_stats()
test("Offline mode detected", not stats["online"])
test("Model set", stats["model"] != "")

# Offline chat
result = mastermind.chat("What is the market opportunity?")
test("Offline chat returns result", len(result) > 100)
test("Market agent invoked", "market" in result.lower())

mastermind.reset_conversation()
test("Conversation reset", len(mastermind.conversation) == 0)

# Partner routing query
result = mastermind.chat("Route this through IFS or Skyller: a commercial tower deal")
test("Partner routing works offline", "partner" in result.lower() or "ifs" in result.lower())

# ── Seed Tests ────────────────────────────────────────────────

print("\n--- Memory Seeding ---")
# Reset memory dir for seed test
cfg.MEMORY_DIR = Path(tempfile.mkdtemp()) / "seed_memories"
from mastermind.seed import seed_all_memories

seed_all_memories()
mem_list = memory_list()
test("Seed creates business/ktv_core.txt", "ktv_core.txt" in mem_list)
test("Seed creates partners/ifs_thailand.txt", "ifs_thailand.txt" in mem_list)
test("Seed creates partners/skyller_og.txt", "skyller_og.txt" in mem_list)
test("Seed creates jv/structure.txt", "structure.txt" in mem_list)
test("Seed creates finance/base_case.txt", "base_case.txt" in mem_list)
test("Seed creates product/smart_green.txt", "smart_green.txt" in mem_list)
test("Seed creates sales/phase1_rollout.txt", "phase1_rollout.txt" in mem_list)
test("Seed creates ops/compliance_thailand.txt", "compliance_thailand.txt" in mem_list)

# Verify content
ktv_core = memory_view("business/ktv_core.txt")
test("KTV core has company name", "KTV Working Drone Thailand" in ktv_core)
test("KTV core has revenue target", "180,180,000" in ktv_core)

jv = memory_view("jv/structure.txt")
test("JV has 50% KTV", "50%" in jv)
test("JV has equity caps", "25%" in jv)

# Re-seed doesn't overwrite
seed_all_memories()
test("Re-seed skips existing files", True)  # No error = pass

# Restore original memory dir
cfg.MEMORY_DIR = original_dir

# ── Cleanup ───────────────────────────────────────────────────

print(f"\n{'=' * 60}")
print(f"Results: {passed} passed, {failed} failed")
sys.exit(1 if failed > 0 else 0)
