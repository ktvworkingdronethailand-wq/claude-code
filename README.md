# claude-code

Claude Code project with [claude-flow](https://github.com/ruvnet/claude-flow) (ruflo) plugin for multi-agent orchestration.

## Setup

```bash
npm install
```

## Claude Flow Commands

```bash
# Initialize swarm
npx ruflo swarm init --v3-mode

# Start daemon
npx ruflo daemon start

# Run diagnostics
npx ruflo doctor --fix

# Spawn an agent
npx ruflo agent spawn -t coder --name my-coder

# Search memory
npx ruflo memory search --query "your query"
```

## MCP Integration

The `.mcp.json` file configures claude-flow as an MCP server for Claude Code, providing direct tool access within sessions.

## Project Structure

- `.claude/` - Claude Code settings, skills, commands, and agents
- `.claude-flow/` - Runtime config, data, logs, and sessions
- `CLAUDE.md` - Behavioral rules and swarm orchestration guidance
