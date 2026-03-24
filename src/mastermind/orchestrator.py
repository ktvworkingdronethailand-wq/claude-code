"""
KTV Mastermind — Orchestrator
Main Claude API tool-use loop that dispatches to agents and memory.
"""

import json
import os
import sys
import time
from typing import Optional

try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False

from .config import MODEL_NAME, MAX_TOKENS, ANTHROPIC_API_KEY
from .prompts import KTV_MASTER_SYSTEM_PROMPT
from .tools import TOOLS
from .memory import run_memory_command
from .agents import AGENT_HANDLERS


class KtvMastermind:
    """
    The KTV Mastermind orchestrator.
    Sends user messages to Claude with tool definitions for 7 agents + memory.
    Handles the tool-use loop: Claude calls tools → we execute → return results → repeat.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.model = model or MODEL_NAME
        self.api_key = api_key or ANTHROPIC_API_KEY

        if not self.api_key:
            print("[Mastermind] Warning: ANTHROPIC_API_KEY not set. Set it to enable Claude API calls.")
            print("[Mastermind] Running in offline mode (agents will execute locally without Claude routing).")
            self.client = None
        elif not HAS_ANTHROPIC:
            print("[Mastermind] Warning: anthropic package not installed. Run: pip install anthropic")
            print("[Mastermind] Running in offline mode.")
            self.client = None
        else:
            self.client = anthropic.Anthropic(api_key=self.api_key)

        self.conversation: list[dict] = []
        self.tool_calls_log: list[dict] = []

    # ── Main Chat Method ──────────────────────────────────────

    def chat(self, user_message: str, max_rounds: int = 15) -> str:
        """
        Send a user message and get the Mastermind's response.
        Handles the full tool-use loop automatically.
        """
        self.conversation.append({"role": "user", "content": user_message})

        if not self.client:
            return self._offline_chat(user_message)

        for round_num in range(max_rounds):
            response = self.client.messages.create(
                model=self.model,
                max_tokens=MAX_TOKENS,
                system=KTV_MASTER_SYSTEM_PROMPT,
                tools=TOOLS,
                messages=self.conversation,
            )

            # Check if we have tool use
            if response.stop_reason == "tool_use":
                # Process all tool calls in the response
                assistant_content = response.content
                self.conversation.append({"role": "assistant", "content": assistant_content})

                tool_results = []
                for block in assistant_content:
                    if block.type == "tool_use":
                        result = self._execute_tool(block.name, block.input)
                        self.tool_calls_log.append({
                            "round": round_num + 1,
                            "tool": block.name,
                            "input": block.input,
                            "output_preview": result[:200],
                        })
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        })

                self.conversation.append({"role": "user", "content": tool_results})

            elif response.stop_reason == "end_turn":
                # Extract text response
                text = ""
                for block in response.content:
                    if hasattr(block, "text"):
                        text += block.text
                self.conversation.append({"role": "assistant", "content": response.content})
                return text

            else:
                # Unexpected stop reason
                text = ""
                for block in response.content:
                    if hasattr(block, "text"):
                        text += block.text
                return text or f"[Mastermind] Unexpected stop: {response.stop_reason}"

        return "[Mastermind] Max rounds reached. The response may be incomplete."

    # ── Tool Execution ────────────────────────────────────────

    def _execute_tool(self, tool_name: str, tool_input: dict) -> str:
        """Execute a tool call and return the result string."""
        try:
            if tool_name == "memory":
                return run_memory_command(**tool_input)

            handler = AGENT_HANDLERS.get(tool_name)
            if handler:
                return handler(tool_input)

            return f"[Error] Unknown tool: {tool_name}"
        except Exception as e:
            return f"[Error] Tool '{tool_name}' failed: {str(e)}"

    # ── Offline Mode ──────────────────────────────────────────

    def _offline_chat(self, user_message: str) -> str:
        """
        Offline mode: run agents directly based on keyword matching.
        Used when no API key is available.
        """
        msg = user_message.lower()
        results = []

        # Determine which agents to invoke
        agent_triggers = {
            "market_intelligence_strategist": ["market", "tam", "sam", "opportunity", "sector", "competitor"],
            "partner_strategy_architect": ["partner", "jv", "ifs", "route", "equity", "channel"],
            "smart_green_product_orchestrator": ["smart green", "esg", "gresb", "telemetry", "sustainability"],
            "financial_model_capital_planner": ["financial", "irr", "npv", "payback", "revenue", "margin", "deal economics"],
            "deal_design_pitch_engineer": ["deck", "pitch", "email", "proposal", "one-pager", "term sheet"],
            "sales_playbook_account_selector": ["sales", "account", "playbook", "pilot", "target", "prospect"],
            "operations_compliance_mission_planner": ["operations", "caat", "fleet", "sop", "compliance", "feasibility", "crew"],
        }

        invoked = set()
        for agent_name, triggers in agent_triggers.items():
            if any(t in msg for t in triggers):
                invoked.add(agent_name)

        # If no specific match, use a broad set for general queries
        if not invoked:
            invoked = {"market_intelligence_strategist", "partner_strategy_architect", "financial_model_capital_planner"}

        for agent_name in sorted(invoked):
            handler = AGENT_HANDLERS.get(agent_name)
            if handler:
                result = handler({"task": user_message})
                results.append(f"=== {agent_name} ===\n{result}")

        return "\n\n".join(results) if results else "[Mastermind] No agents matched your query."

    # ── Conversation Management ───────────────────────────────

    def reset_conversation(self):
        """Clear conversation history."""
        self.conversation = []
        self.tool_calls_log = []

    def get_tool_calls_log(self) -> list:
        """Return the log of all tool calls made."""
        return self.tool_calls_log

    def get_stats(self) -> dict:
        """Return session statistics."""
        return {
            "model": self.model,
            "online": self.client is not None,
            "messages": len(self.conversation),
            "tool_calls": len(self.tool_calls_log),
            "agents_used": list(set(t["tool"] for t in self.tool_calls_log)),
        }


def create_mastermind(api_key: Optional[str] = None, model: Optional[str] = None) -> KtvMastermind:
    """Factory function to create a KTV Mastermind instance."""
    return KtvMastermind(api_key=api_key, model=model)
