# Claude Flow Plugin for Claude Code

The leading agent orchestration platform for Claude Code. Deploy intelligent multi-agent swarms, coordinate autonomous workflows, and build conversational AI systems.

## Features

- **Multi-Agent Swarm Orchestration** - Coordinate up to 15 concurrent agents with hierarchical-mesh topology
- **81 Slash Commands** - Analysis, automation, GitHub, monitoring, optimization, SPARC methodology
- **30 Skills** - AgentDB, GitHub integration, V3 core, swarm orchestration, and more
- **99 Agent Definitions** - Core, GitHub, consensus, SPARC, swarm, optimization agents
- **41 Helper Scripts** - Hook handlers, memory management, security scanning, metrics
- **MCP Server Integration** - Native Model Context Protocol server for Claude Code
- **10 Hook Types** - PreToolUse, PostToolUse, SessionStart/End, SubagentStart/Stop, and more
- **Self-Learning Hooks** - Intelligent workflow automation that improves over time
- **Memory System** - Hybrid memory backend with HNSW vector search
- **SPARC Methodology** - Specification, Pseudocode, Architecture, Refinement, Completion

## Installation

### Quick Install

```bash
npm install ruflo@latest
npx ruflo init
```

### Full Install (with MCP)

```bash
bash .claude-plugin/scripts/install.sh
```

### Verify Installation

```bash
bash .claude-plugin/scripts/verify.sh
```

## Project Structure

```
claude-flow/
├── .claude-plugin/
│   ├── plugin.json            Plugin metadata
│   ├── marketplace.json       Distribution metadata
│   ├── README.md              This file
│   ├── scripts/
│   │   ├── install.sh         Installation script
│   │   ├── verify.sh          Verification script
│   │   └── uninstall.sh       Uninstallation script
│   └── docs/
│       └── QUICKSTART.md      5-minute quickstart guide
├── .claude/
│   ├── settings.json          Hooks, permissions, and config
│   ├── commands/              81 slash commands
│   │   ├── analysis/          Performance and token analysis
│   │   ├── automation/        Auto-agent, self-healing, workflows
│   │   ├── github/            PR, issue, release, and review management
│   │   ├── hooks/             Hook management commands
│   │   ├── monitoring/        Agent metrics and swarm monitoring
│   │   ├── optimization/      Topology and parallel execution
│   │   └── sparc/             SPARC methodology commands
│   ├── skills/                30 skills (AgentDB, GitHub, V3, etc.)
│   ├── agents/                99 agent definitions
│   │   ├── core/              coder, planner, researcher, reviewer, tester
│   │   ├── consensus/         Byzantine, CRDT, Raft, Gossip coordinators
│   │   ├── github/            PR, issue, release, code-review agents
│   │   ├── sparc/             Architecture, pseudocode, refinement
│   │   ├── swarm/             Hierarchical, mesh, adaptive coordinators
│   │   ├── v3/                Security, memory, performance specialists
│   │   └── ...                Templates, optimization, flow-nexus
│   └── helpers/               41 helper scripts
├── .claude-flow/
│   ├── config.yaml            Runtime configuration
│   ├── data/                  Runtime data
│   ├── logs/                  Log files
│   ├── sessions/              Session state
│   ├── metrics/               Performance metrics
│   └── security/              Security audit data
├── .mcp.json                  MCP server configuration
├── CLAUDE.md                  Behavioral rules and guidance
└── hooks/
    └── hooks.json             Hook event configuration
```

## Command Categories

| Category | Count | Examples |
|----------|-------|---------|
| Analysis | 5 | `bottleneck-detect`, `token-usage`, `performance-report` |
| Automation | 6 | `auto-agent`, `smart-spawn`, `self-healing` |
| GitHub | 16 | `code-review`, `pr-manager`, `release-swarm` |
| Hooks | 6 | `pre-task`, `post-edit`, `session-end` |
| Monitoring | 5 | `status`, `swarm-monitor`, `agent-metrics` |
| Optimization | 5 | `auto-topology`, `parallel-execute`, `cache-manage` |
| SPARC | 28 | `architect`, `coder`, `tdd`, `security-review` |
| Core | 3 | `claude-flow-help`, `claude-flow-memory`, `claude-flow-swarm` |

## CLI Reference

```bash
npx ruflo init                          # Initialize project
npx ruflo swarm init --v3-mode          # Start a swarm
npx ruflo agent spawn -t coder          # Spawn an agent
npx ruflo memory search --query "..."   # Search memory
npx ruflo daemon start                  # Start background workers
npx ruflo doctor --fix                  # Run diagnostics
npx ruflo hooks list                    # List active hooks
npx ruflo status                        # System status
```

## Uninstall

```bash
bash .claude-plugin/scripts/uninstall.sh
```

## Links

- Repository: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues
- Releases: https://github.com/ruvnet/claude-flow/releases
