#!/usr/bin/env bash
set -euo pipefail

# Claude Flow Plugin Installer
# Installs ruflo and initializes claude-flow for Claude Code

PLUGIN_NAME="claude-flow"
PACKAGE="ruflo@latest"
MIN_NODE_VERSION=20

echo "=================================="
echo "  Claude Flow Plugin Installer"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
    echo "ERROR: Node.js is required (>= v${MIN_NODE_VERSION})"
    echo "Install from: https://nodejs.org/"
    exit 1
fi

NODE_MAJOR=$(node -e "console.log(process.versions.node.split('.')[0])")
if [ "$NODE_MAJOR" -lt "$MIN_NODE_VERSION" ]; then
    echo "ERROR: Node.js >= v${MIN_NODE_VERSION} required (found v$(node --version))"
    exit 1
fi
echo "[OK] Node.js $(node --version)"

# Check npm
if ! command -v npm &>/dev/null; then
    echo "ERROR: npm is required"
    exit 1
fi
echo "[OK] npm $(npm --version)"

# Check for package.json
if [ ! -f "package.json" ]; then
    echo "[..] No package.json found, initializing..."
    npm init -y --quiet
fi

# Install ruflo
echo ""
echo "[..] Installing ${PACKAGE}..."
npm install "${PACKAGE}" --save
echo "[OK] ruflo installed"

# Initialize claude-flow
echo ""
echo "[..] Initializing claude-flow..."
npx ruflo init
echo "[OK] claude-flow initialized"

# Verify installation
echo ""
echo "[..] Running verification..."
bash "$(dirname "$0")/verify.sh"

echo ""
echo "=================================="
echo "  Installation Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "  1. Restart Claude Code to load the plugin"
echo "  2. Run: npx ruflo daemon start"
echo "  3. Run: npx ruflo doctor --fix"
echo ""
echo "Use /project:claude-flow-help for available commands"
