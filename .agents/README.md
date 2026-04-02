# .agents/ - Claude-Flow Agent Configuration

## Structure

```
.agents/
  config.toml     # Main configuration file
  skills/         # Skill definitions
    skill-name/
      SKILL.md    # Skill instructions
      scripts/    # Optional scripts
      docs/       # Optional documentation
  README.md       # This file
```

## Configuration

Edit `config.toml` to customize:
- **topology** - Swarm topology type and max agents
- **memory** - Memory backend and HNSW/neural settings
- **model_routing** - 3-tier model routing thresholds
- **security** - Input validation and path sanitization

## Adding Skills

Create a new directory under `skills/` with a `SKILL.md` file:

```bash
mkdir -p .agents/skills/my-skill
```

Then add a `SKILL.md` with the skill's instructions and configuration.

## Usage

The MCP tools (`mcp__claude-flow__*`) and CLI (`npx ruflo@latest`) reference this configuration automatically.
```
