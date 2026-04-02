#!/usr/bin/env bash
set -euo pipefail

# Claude Flow Plugin Verification Script
# Checks that all plugin components are properly installed

PASS=0
FAIL=0
WARN=0

check() {
    local label="$1"
    local condition="$2"
    if eval "$condition" &>/dev/null; then
        echo "  [PASS] $label"
        ((PASS++))
    else
        echo "  [FAIL] $label"
        ((FAIL++))
    fi
}

warn_check() {
    local label="$1"
    local condition="$2"
    if eval "$condition" &>/dev/null; then
        echo "  [PASS] $label"
        ((PASS++))
    else
        echo "  [WARN] $label"
        ((WARN++))
    fi
}

echo "Claude Flow Plugin Verification"
echo "================================"
echo ""

echo "Package:"
check "ruflo installed" "npx ruflo --version 2>/dev/null | grep -q 'v'"
check "package.json exists" "[ -f package.json ]"
check "node_modules/ruflo exists" "[ -d node_modules/ruflo ] || [ -d node_modules/.package-lock.json ]"

echo ""
echo "Plugin Metadata:"
check "plugin.json exists" "[ -f .claude-plugin/plugin.json ]"
check "marketplace.json exists" "[ -f .claude-plugin/marketplace.json ]"

echo ""
echo "Claude Code Integration:"
check ".claude/settings.json exists" "[ -f .claude/settings.json ]"
check ".mcp.json exists" "[ -f .mcp.json ]"
check "CLAUDE.md exists" "[ -f CLAUDE.md ]"

echo ""
echo "Commands:"
CMD_COUNT=$(find .claude/commands -name "*.md" -not -name "README.md" -not -name "COMMAND_COMPLIANCE_REPORT.md" 2>/dev/null | wc -l)
check "Slash commands installed ($CMD_COUNT found)" "[ $CMD_COUNT -gt 0 ]"

echo ""
echo "Skills:"
SKILL_COUNT=$(find .claude/skills -name "SKILL.md" 2>/dev/null | wc -l)
check "Skills installed ($SKILL_COUNT found)" "[ $SKILL_COUNT -gt 0 ]"

echo ""
echo "Agents:"
AGENT_COUNT=$(find .claude/agents -name "*.md" -o -name "*.yaml" 2>/dev/null | wc -l)
check "Agents installed ($AGENT_COUNT found)" "[ $AGENT_COUNT -gt 0 ]"

echo ""
echo "Helpers:"
HELPER_COUNT=$(find .claude/helpers -type f -not -name "README.md" 2>/dev/null | wc -l)
check "Helper scripts installed ($HELPER_COUNT found)" "[ $HELPER_COUNT -gt 0 ]"

echo ""
echo "Runtime:"
check ".claude-flow/ directory exists" "[ -d .claude-flow ]"
check "config.yaml exists" "[ -f .claude-flow/config.yaml ]"
warn_check "Daemon running" "npx ruflo status 2>/dev/null | grep -qi 'running'"
warn_check "Memory initialized" "[ -f .claude-flow/data/memory.db ] || [ -f .claude-flow/data/agentdb.sqlite ]"

echo ""
echo "Hooks:"
HOOK_TYPES=$(grep -c '"type": "command"' .claude/settings.json 2>/dev/null || echo 0)
check "Hook handlers configured ($HOOK_TYPES hooks)" "[ $HOOK_TYPES -gt 0 ]"

echo ""
echo "================================"
echo "Results: $PASS passed, $FAIL failed, $WARN warnings"
echo "================================"

if [ "$FAIL" -gt 0 ]; then
    echo ""
    echo "Some checks failed. Run the installer:"
    echo "  bash .claude-plugin/scripts/install.sh"
    exit 1
fi

echo ""
echo "Plugin is properly installed!"
