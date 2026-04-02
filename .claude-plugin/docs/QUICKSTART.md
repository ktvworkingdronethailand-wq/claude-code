# Claude Flow Plugin - 5 Minute Quickstart

## 1. Install (30 seconds)

```bash
npm install ruflo@latest && npx ruflo init
```

## 2. Restart Claude Code

Exit and re-enter Claude Code in this directory to load the plugin:

```bash
# Exit current session (Ctrl+C or /exit)
claude
```

## 3. Verify (10 seconds)

```bash
bash .claude-plugin/scripts/verify.sh
```

## 4. Start Services (30 seconds)

```bash
npx ruflo daemon start
npx ruflo doctor --fix
```

## 5. Try It Out

### Spawn a coding agent
```bash
npx ruflo agent spawn -t coder --name my-coder
```

### Initialize a swarm
```bash
npx ruflo swarm init --topology hierarchical --max-agents 8
```

### Use slash commands
In Claude Code, type:
- `/project:sparc/architect` - Design system architecture
- `/project:github/code-review` - Code review workflow
- `/project:claude-flow-swarm` - Swarm management
- `/project:monitoring/status` - Check system status
- `/project:sparc/tdd` - Test-driven development

### Store and search memory
```bash
npx ruflo memory store --key "my-pattern" --value "description" --namespace patterns
npx ruflo memory search --query "pattern"
```

## Key Concepts

### Swarm Topology
- **Hierarchical**: Lead agent coordinates sub-agents (best for structured tasks)
- **Mesh**: Peer-to-peer agent communication (best for collaborative tasks)
- **Hierarchical-Mesh**: Hybrid approach (default, most flexible)

### SPARC Methodology
- **S**pecification - Define requirements
- **P**seudocode - Plan the logic
- **A**rchitecture - Design the system
- **R**efinement - Iterate and improve
- **C**ompletion - Test and deliver

### Agent Types
| Type | Purpose |
|------|---------|
| `coder` | Write and modify code |
| `reviewer` | Review code quality |
| `tester` | Write and run tests |
| `planner` | Plan tasks and architecture |
| `researcher` | Research solutions and patterns |
| `security-architect` | Security analysis |
| `pr-manager` | GitHub PR workflows |

## Troubleshooting

```bash
# Run diagnostics
npx ruflo doctor --fix

# Check status
npx ruflo status

# View logs
ls .claude-flow/logs/
```
