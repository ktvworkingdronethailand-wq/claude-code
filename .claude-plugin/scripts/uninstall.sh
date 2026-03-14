#!/usr/bin/env bash
set -euo pipefail

# Claude Flow Plugin Uninstaller
# Removes claude-flow components from Claude Code project

echo "=================================="
echo "  Claude Flow Plugin Uninstaller"
echo "=================================="
echo ""

read -p "This will remove all claude-flow plugin files. Continue? [y/N] " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

echo ""

# Stop daemon if running
echo "[..] Stopping daemon..."
npx ruflo daemon stop 2>/dev/null || true

# Remove claude-flow runtime
if [ -d ".claude-flow" ]; then
    echo "[..] Removing .claude-flow/ runtime directory..."
    rm -rf .claude-flow
    echo "[OK] Removed .claude-flow/"
fi

# Remove Claude Code integration files
if [ -d ".claude" ]; then
    echo "[..] Removing .claude/ directory (settings, commands, skills, agents)..."
    rm -rf .claude
    echo "[OK] Removed .claude/"
fi

# Remove MCP config
if [ -f ".mcp.json" ]; then
    echo "[..] Removing .mcp.json..."
    rm -f .mcp.json
    echo "[OK] Removed .mcp.json"
fi

# Remove CLAUDE.md
if [ -f "CLAUDE.md" ]; then
    echo "[..] Removing CLAUDE.md..."
    rm -f CLAUDE.md
    echo "[OK] Removed CLAUDE.md"
fi

# Remove plugin metadata
if [ -d ".claude-plugin" ]; then
    echo "[..] Removing .claude-plugin/ metadata..."
    rm -rf .claude-plugin
    echo "[OK] Removed .claude-plugin/"
fi

# Uninstall npm package
echo "[..] Uninstalling ruflo package..."
npm uninstall ruflo 2>/dev/null || true
echo "[OK] Uninstalled ruflo"

echo ""
echo "=================================="
echo "  Uninstall Complete"
echo "=================================="
echo ""
echo "Restart Claude Code to apply changes."
