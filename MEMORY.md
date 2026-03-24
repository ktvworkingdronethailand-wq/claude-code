# Claude Code Memory

> Persistent knowledge loaded at session start. Entries are auto-synced by the AutoMemoryBridge hook.

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
