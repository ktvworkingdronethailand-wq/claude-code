# VS Code + Claude Code Setup Guide

Copy-paste commands to get running from VS Code terminal.

---

## Step 1: Clone and Open in VS Code

```bash
git clone https://github.com/ktvworkingdronethailand-wq/claude-code.git
cd claude-code
code .
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Build and Verify

```bash
npm run build
npm test
```

Expected output: `Results: 94 passed, 0 failed`

## Step 4: Start Claude Code

Open VS Code terminal (Ctrl+` or Cmd+`) and run:

```bash
claude
```

Or resume your last session:

```bash
claude --resume
```

## Step 5: Run the Platform

```bash
npm run start
```

## Step 6: Run Full Demo (Proof of Execution)

```bash
npm run build && node dist/scripts/demo-full-report.js
```

---

## Quick Commands (copy-paste into VS Code terminal)

### Claude Code Sessions
```bash
# Start new Claude Code session
claude

# Resume last session
claude --resume

# Run CoWork orchestrator
claude -p '/cowork'

# Run with specific prompt
claude -p 'your prompt here'
```

### Build & Test
```bash
# Build
npm run build

# Run all 94 tests
npm test

# Type check only (no emit)
npm run lint

# Build + run platform
npm run build && npm run start

# Build + run demo
npm run build && node dist/scripts/demo-full-report.js
```

### Swarm Operations
```bash
# Initialize swarm
npx ruflo@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized

# Memory store
npx ruflo@latest memory store --key "key" --value "val" --namespace ns

# Memory search
npx ruflo@latest memory search --query "search term"

# Diagnostics
npx ruflo@latest doctor --fix

# Security scan
npx ruflo@latest security scan
```

### Python Mastermind
```bash
# Run mastermind tests
python src/mastermind/tests/mastermind.test.py

# Run mastermind orchestrator
python src/mastermind/main.py
```

### Git Operations
```bash
# Check status
git status

# Pull latest
git pull origin claude/ai-agents-ktv-drone-ZsAc0

# Push changes
git push -u origin claude/ai-agents-ktv-drone-ZsAc0
```

---

## VS Code Tasks (Ctrl+Shift+P > "Tasks: Run Task")

These are pre-configured in `.vscode/tasks.json`:

| Task | What it does |
|------|-------------|
| Claude Code - Start Session | Opens claude in terminal |
| Claude Code - Resume Last Session | Resumes with --resume |
| Claude Code - CoWork Orchestrator | Runs /cowork skill |
| KTV - Build | npm run build (Ctrl+Shift+B) |
| KTV - Test | npm test (all 3 suites) |
| KTV - Start Platform | npm run start |
| KTV - Run Demo | Full proof of execution |
| KTV - Lint | Type check only |
| Swarm - Initialize | Init swarm topology |
| Swarm - Doctor | Diagnose + fix |
| Python Mastermind - Run Tests | Run Python test suite |

## VS Code Debug Configurations (F5)

Pre-configured in `.vscode/launch.json`:

| Config | What it runs |
|--------|-------------|
| KTV Platform - Start | Launches platform with debugger |
| KTV Demo - Full Report | Runs demo with debugger |
| KTV Tests - Agents | Debug agent tests |
| KTV Tests - Workflows | Debug workflow tests |
| KTV Tests - Platform | Debug platform tests |

## Recommended Extensions

Listed in `.vscode/extensions.json` — VS Code will prompt to install:

- **Claude Code** (anthropics.claude-code) - AI coding assistant
- **TypeScript** (ms-vscode.vscode-typescript-next)
- **Prettier** (esbenp.prettier-vscode)
- **ESLint** (dbaeumer.vscode-eslint)
- **Python** (ms-python.python)

---

## Environment Variables

Create a `.env` file in the project root (never committed):

```bash
# Supabase (dashboard)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Integrations (add as needed)
NOTION_API_KEY=ntn_...
ASANA_ACCESS_TOKEN=1/...
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
GAMMA_API_KEY=sk-gamma-...
CANVA_ACCESS_TOKEN=...
GDRIVE_ACCESS_TOKEN=...
```

## File Structure at a Glance

```
claude-code/
  .claude/
    agents/        98 agent templates (23 categories)
    skills/        31 registered skills
    helpers/       40 hook helpers
    settings.json  Hooks, permissions, learning config
  .vscode/         VS Code settings, tasks, launch, extensions
  src/
    agents/        7 operational agents + orchestrator
    workflows/     Brain, engine, triggers, connected apps
    operations/    Platform, reporting, scheduling, onboarding
    integrations/  10 external platforms
    config/        Business config, climate act, JV partners
    types/         All TypeScript interfaces
    mastermind/    Python strategy agents
  tests/           3 test suites (94 tests)
  scripts/         Demo runner, Supabase schema
  docs/            Business docs, One Bangkok, reports
  CLAUDE.md        Project instructions for Claude Code
```
