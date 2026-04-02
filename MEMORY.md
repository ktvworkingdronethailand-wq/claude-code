# Claude Code Memory — KTV Working Drone Thailand

> Persistent knowledge loaded at session start. Auto-synced by AutoMemoryBridge.
> Empire HQ: Bangkok, Thailand | Parent: KTV Group (est. 1992, Norway, 66 franchises)
> Mission: First-mover drone-enabled FM platform in Thailand via IFS partnership.

---

## The Drone Cleaning Empire — Agent Professionals

> Each agent is a domain expert in the KTV Working Drone Thailand empire.
> Together they form an autonomous strategy and execution mastermind.

### C-Suite: The KTV Mastermind Agents (7)

**1. Market Intelligence Strategist** — *Chief Market Officer*
- Maps Thailand's FM and DaaS markets with quantified TAM/SAM/SOM analysis
- Tracks 400+ buildings over 90m in Bangkok, segments by sector and growth
- Ranks opportunities by ROI, routes each through IFS or Direct channel
- Monitors competitive landscape across facade cleaning, inspection, ag-spray
- *Spawn*: `subagent_type: "researcher"` with market analysis prompt

**2. Partner Strategy Architect** — *VP of Strategic Partnerships*
- Owns the IFS Thailand exclusive FM channel relationship
- Enforces JV structure: KTV 50% control, IFS up to 50% equity (earned via milestones)
- Tracks equity triggers: THB 32M → 64M → 160M revenue thresholds
- Routes all drone-enabled FM through IFS; direct channel for ag, media, training
- Guards exclusivity rules — IFS cannot onboard competing drone providers
- *Spawn*: `subagent_type: "planner"` with partnership routing prompt

**3. Smart Green Product Orchestrator** — *Chief Product Officer*
- Architects the Smart Green Operations platform (the empire's digital backbone)
- Designs ESG telemetry: sqm cleaned, water/chemical usage, time-at-height avoided
- Ensures GRESB-ready sustainability reporting for all client sites
- Sets adoption milestones: min 5 integrated sites for min 3 months
- Makes KTV's data layer the moat competitors cannot replicate
- *Spawn*: `subagent_type: "architecture"` with product/ESG prompt

**4. Financial Model & Capital Planner** — *Chief Financial Officer*
- Maintains the 3-year financial model (Year 1 target: THB 180.18M / ~$5.08M)
- Base case: 45 THB/sqm, ~4M sqm/year, IRR 260-280%, payback 9-11 months
- Checks deal economics (IRR/NPV/payback), flags guardrail breaches
- Plans capacity scaling: fleet expansion, crew hiring, regional rollout
- Initial capital: USD 1.455M (THB 51.65M) across drones, ops, marketing, legal
- *Spawn*: `subagent_type: "planner"` with financial modeling prompt

**5. Deal Design & Pitch Engineer** — *VP of Business Development*
- Produces investor decks, one-pagers, partner emails, and term-sheet drafts
- Aligns all materials with IFS positioning: "We plug world-class drones + ESG data into your existing FM relationships"
- Key messaging: safety (zero work-at-height incidents), data-driven, ESG gains
- Tailors pitches by sector: aviation, healthcare, energy, manufacturing, commercial
- *Spawn*: `subagent_type: "coder"` with document generation prompt

**6. Sales Playbook & Account Selector** — *VP of Sales*
- Prioritizes accounts from IFS portfolio by revenue potential and strategic fit
- Key targets: Icon Siam (75K sqm), One Bangkok (104K sqm), Suvarnabhumi Airport (120K sqm), PTT Refinery (35K sqm)
- Designs sector-specific playbooks for quarterly cleaning cycles
- Structures pilot programs: 1-3 flagship sites, 3-month duration, clear KPIs
- *Spawn*: `subagent_type: "planner"` with sales strategy prompt

**7. Operations & Compliance Mission Planner** — *Chief Operations Officer*
- Plans fleet deployment: 16 drones (DJI Agras T50/T25, Matrice 350/30T, Mavic 3, Inspire 3)
- Ensures CAAT compliance: max 90m altitude, 9km airport buffer, THB 1M insurance, RPL pilots, UAOC cert
- Designs mission SOPs, crew scheduling, and safety protocols
- Target: zero work-at-height incidents across all operations
- *Spawn*: `subagent_type: "planner"` with ops/compliance prompt

---

### Technical Team: Claude Code Development Agents (5)

> These agents build, test, and maintain the Mastermind codebase itself.

**coder** — *Lead Developer*
- Implements Mastermind features, API integrations, drone telemetry pipelines
- Writes clean Python (orchestrator, agents, memory, tools)
- Self-learning via ReasoningBank for pattern reuse across sessions

**planner** — *Technical Architect*
- Decomposes complex features into actionable sprints
- Maps dependencies between Mastermind modules (agents ↔ memory ↔ orchestrator)
- Estimates effort and risk for new capabilities

**reviewer** — *Quality Assurance Lead*
- Audits code for security (no leaked API keys), performance, and best practices
- Reviews agent prompts for strategic accuracy against KTV business rules
- Ensures config.py constants match approved financial/partner baselines

**researcher** — *Intelligence Analyst*
- Deep-dives into Thai FM market data, CAAT regulations, competitor intelligence
- Synthesizes findings into actionable memory entries for the Mastermind
- Pattern recognition across 60+ agent types for optimal routing

**tester** — *Reliability Engineer*
- TDD for all Mastermind modules (London School, mock-first)
- Integration tests: agent orchestration loops, memory persistence, tool calls
- Performance testing: response times, token efficiency, concurrent agent loads

---

## Agent System — Getting Started

### Core Agents (5)
- **coder** — Implementation specialist. Writes clean code, refactors, optimizes. Use for any coding task.
- **planner** — Strategic planner. Decomposes tasks, maps dependencies, estimates effort. Use before complex work.
- **reviewer** — Code review and QA. Audits security, performance, best practices. Use after code changes.
- **researcher** — Deep research and analysis. Pattern recognition, dependency tracking, knowledge synthesis.
- **tester** — Testing specialist. Unit, integration, e2e, performance, and security testing with TDD.

### How to Spawn an Agent
```bash
# Via CLI
npx ruflo@latest agent spawn -t coder --name my-coder

# Via Claude Code Task tool (preferred for execution)
# Use the Agent tool with subagent_type matching the agent name
```

### Swarm Coordination
- **Topology**: hierarchical-mesh (queen delegates to specialized workers)
- **Max agents**: 15 (recommended 6-8 for tight coordination)
- **Strategy**: specialized (clear role boundaries)
- **Consensus**: raft (leader maintains authoritative state)

```bash
# Initialize a swarm
npx ruflo@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

### Agent Categories Available (60+)

| Category | Agents | Use Case |
|----------|--------|----------|
| core | coder, planner, reviewer, researcher, tester | Day-to-day development |
| swarm | hierarchical-coordinator, mesh-coordinator, adaptive-coordinator | Multi-agent coordination |
| github | pr-manager, code-review-swarm, issue-tracker, release-manager | GitHub workflows |
| sparc | sparc-coord, specification, pseudocode, architecture, refinement | SPARC methodology |
| v3 | security-architect, memory-specialist, performance-engineer, adr-architect | Advanced V3 features |
| optimization | benchmark-suite, topology-optimizer, load-balancer, resource-allocator | Performance tuning |
| consensus | byzantine-coordinator, raft-manager, quorum-manager, crdt-synchronizer | Distributed consensus |
| flow-nexus | neural-network, payments, authentication, workflow, swarm, sandbox | Cloud platform |

### Key Rules
- CLI tools handle **coordination** (swarm init, memory, hooks)
- Task/Agent tool handles **execution** (code generation, file ops, git)
- Always run agents with `run_in_background: true`
- Put ALL agent spawns in ONE message for parallel execution
- After spawning, STOP and wait — do not poll or check status

### Memory System
- **Backend**: hybrid (JSON file + HNSW vector indexing)
- **Learning**: enabled (ReasoningBank pattern storage)
- **Graph**: enabled (PageRank-weighted relationships)
- **Auto-sync**: session start imports, session end/stop syncs back

```bash
# Store a memory
npx ruflo@latest memory store --key "my-pattern" --value "description" --namespace patterns

# Search memory
npx ruflo@latest memory search --query "authentication patterns"

# List entries
npx ruflo@latest memory list --namespace patterns --limit 10
```

### 3-Tier Model Routing
| Tier | Handler | When |
|------|---------|------|
| 1 | Agent Booster (WASM) | Simple transforms — skip LLM entirely |
| 2 | Haiku | Low complexity (<30%), simple tasks |
| 3 | Sonnet/Opus | Complex reasoning, architecture, security (>30%) |

### Quick Start Checklist
1. Read the agent definition in `.claude/agents/<category>/<name>.md`
2. For single tasks: use `Agent` tool with matching `subagent_type`
3. For multi-agent work: init swarm first, then spawn agents in one message
4. Store learnings with `memory store` so future sessions benefit
5. Let hooks handle routing — check `[TASK_MODEL_RECOMMENDATION]` before spawning
