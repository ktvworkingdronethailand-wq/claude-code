# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ktv-working-drone-thailand** — AI agent-powered autonomous drone operations platform for KTV Working Drone Thailand (KTV Group, est. 1992, Norway, 66 franchises). TypeScript + Python, orchestrated via RuFlo V3.

## Build & Test

```bash
npm run build          # tsc → dist/
npm run start          # node dist/src/index.js
npm test               # build + run all 3 test suites sequentially
npm run lint           # tsc --noEmit (type checking only)
```

Tests run as compiled JS: `dist/tests/agents.test.js`, `dist/tests/workflows.test.js`, `dist/tests/platform.test.js`. There is no test runner — each file self-executes assertions.

Python Mastermind tests: `python src/mastermind/tests/mastermind.test.py`

## Architecture

### Three-Layer System

```
Layer 1: 7 Operational Agents (src/agents/)
  All extend KtvAgent base class, communicate via AgentMessage
  Fleet | Jobs | CRM | Safety | Finance | Pilots | Data
         ↓
Layer 2: Operations Brain (src/workflows/brain.ts)
  EventBus → TriggerManager → WorkflowEngine → 10+ workflows
  OperationsBrain is the central decision engine connecting agents to events
         ↓
Layer 3: Business Operations (src/operations/)
  KtvPlatform (unified facade) → ServiceOps | Scheduling | Onboarding | SupplyChain | Reporting
```

**Entry point:** `src/index.ts` → `bootstrap()` → `KtvPlatform.start()` which initializes orchestrator, brain, and all operations systems.

### Key Patterns

- **KtvOrchestrator** (`src/agents/orchestrator.ts`): Registry of all 7 agents. Routes messages between agents, runs health checks (60s intervals), calculates system status (healthy → degraded → warning → critical).
- **EventBus** (`src/workflows/event-bus.ts`): Pub/sub for KTV events. Triggers fire workflows which dispatch to agents.
- **CoworkOrchestrator** (`src/workflows/cowork-orchestrator.ts`): 14 team members across 6 teams (Sales, Ops, Finance, Marketing, Legal, Product) with connected app automations.
- **ConnectedApps** (`src/workflows/connected-apps.ts`): Gmail + Google Calendar automation templates for all teams.

### External Integrations (src/integrations/)

- **LINE** — Customer messaging (Thai market)
- **Odoo** — ERP connector
- **AWS S3** — Data storage
- **DJI FlightHub** — Fleet telemetry

### Type System

All types in `src/types/index.ts` (~387 lines). Key domains: AgentRole/AgentMessage, Drone/Fleet, Job (13 stages), Lead/Client, RiskAssessment/WeatherCheck, Invoice, Pilot, DataJob.

### Configuration (src/config/)

- `ktv-operations.ts` — Company info, 6 service lines with pricing, CAAT regulations (90m max altitude, 9km airport buffer), fleet config (16 DJI drones), financial rules (7% VAT, 7% royalty, 20% corp tax)
- `jv-partners.ts` — IFS Thailand JV structure, Smart Green ESG platform, financial projections

### Python Mastermind (src/mastermind/)

Parallel strategy system with 7 expert agents (Market, Partner, SmartGreen, Financial, Deal, Sales, Operations). Entry: `main.py` → `orchestrator.py`. Has its own `memory.py`, `tools.py`, `prompts.py`.

### One Bangkok Initiative (docs/one-bangkok/)

Strategic deal documentation: battle-plan, market-intelligence, partnership, financial-model, pitch-deck, compliance (CAAT), smart-green integration, sales-playbook. Key metrics: THB 23.97M ACV, 77.7% EBITDA, 3.6mo payback.

## Behavioral Rules

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary — prefer editing existing files
- NEVER proactively create docs/README files unless explicitly requested
- NEVER save files to root folder — use `src/`, `tests/`, `docs/`, `config/`, `scripts/`, `examples/`
- ALWAYS read a file before editing it
- ALWAYS run tests after code changes, verify build before committing
- NEVER commit secrets, credentials, or .env files

## File Organization

| Directory | Purpose |
|-----------|---------|
| `src/agents/` | 7 operational agents + orchestrator + base class |
| `src/workflows/` | EventBus, WorkflowEngine, OperationsBrain, triggers, connected apps |
| `src/operations/` | KtvPlatform, service ops, scheduling, onboarding, supply chain, reporting |
| `src/integrations/` | LINE, Odoo, S3, FlightHub connectors |
| `src/types/` | All TypeScript interfaces |
| `src/config/` | Business config (operations, JV partners) |
| `src/mastermind/` | Python strategy agents |
| `tests/` | Test suites (agents, workflows, platform) |
| `docs/` | Business documentation and One Bangkok initiative |
| `.claude/agents/` | 25 Claude Code agent templates |
| `.claude/skills/` | 33 registered skills |

## Code Style

- TypeScript strict mode, ES2022 target, Node16 module resolution
- Use `.js` extensions in all import paths (required for Node16 ESM)
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Domain-Driven Design with bounded contexts

## Swarm & Multi-Agent Orchestration

RuFlo V3 manages multi-agent coordination. Config in `.mcp.json` and `.claude-flow/config.yaml`.

```bash
# Initialize swarm
npx ruflo@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized

# Memory operations
npx ruflo@latest memory store --key "key" --value "val" --namespace ns
npx ruflo@latest memory search --query "search term"

# Diagnostics
npx ruflo@latest doctor --fix
```

- Topology: hierarchical-mesh, max 15 agents, hybrid memory with HNSW
- Use `raft` consensus for hive-mind coordination
- Batch all agent spawns in one message for parallel execution
- After spawning agents, stop and wait for results — never poll

## Supabase Dashboard

Master operations dashboard at `docs/dashboard/ktv-master-dashboard.html` — shows all 14 agents, 6 CoWork teams, KPIs, brain decisions, and activity feed in real-time.

### Environment Variables

```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # optional, enables writes
```

### Setup Steps

1. Create Supabase project at supabase.com
2. Run `scripts/supabase/001_ktv_dashboard_schema.sql` in the SQL Editor
3. Enable realtime on `agent_status`, `team_activity`, `brain_decisions` tables
4. Set the three env vars above
5. Open `docs/dashboard/ktv-master-dashboard.html` → paste URL + anon key → Connect

### Integration API

```typescript
import { createSupabaseClient, AgentTelemetry, AGENT_TEAM_MAP } from './integrations/supabase.js';

const sb = createSupabaseClient();           // returns null if env vars missing
const telemetry = new AgentTelemetry(sb);

await telemetry.reportAgentHealth(health, agentName, team, 'operational');
await telemetry.reportDecision(decision);
await telemetry.reportKpi('Revenue Operations', 'ebitda_margin_pct', 55, '%', '55', 'on-track');
await telemetry.reportActivity('Growth Engine', 'crm-sales', 'Lead qualified', 'One Bangkok · THB 23.97M');
```

### Tables

| Table | Purpose |
|-------|---------|
| `agent_status` | Live heartbeat — 1 row per agent, upserted every 60s |
| `workflow_events` | Every workflow execution and automation trigger |
| `brain_decisions` | OperationsBrain decision log with reasoning + outcome |
| `kpi_snapshots` | Current KPI values per team (upserted, 1 row per team+kpi) |
| `mission_log` | Append-only drone mission history |
| `team_activity` | Rolling feed of agent actions across all 6 CoWork teams |

## Security

- Never hardcode API keys or credentials
- Validate user input at system boundaries
- Sanitize file paths to prevent directory traversal
- Run `npx ruflo@latest security scan` after security-related changes
