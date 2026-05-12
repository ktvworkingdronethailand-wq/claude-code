# Agent Supervisor — Productivity Monitor & Report Generator

**Class**: `AgentSupervisor` (`src/agents/supervisor.ts`)
**Role**: Monitors all 14 agents across 6 CoWork teams, tracks task completion, generates productivity reports, and flags underperforming agents.

---

## Interfaces

### AgentProductivity

Tracks per-agent performance metrics:

| Field | Type | Description |
|-------|------|-------------|
| `agentId` | `string` | Unique agent identifier |
| `role` | `AgentRole \| string` | O1-O7 operations or S1-S7 strategy |
| `team` | `CoworkTeamId[]` | Teams the agent belongs to |
| `tasksAssigned` | `number` | Total tasks assigned |
| `tasksCompleted` | `number` | Tasks completed successfully |
| `tasksFailed` | `number` | Tasks that errored or timed out |
| `completionRate` | `number` | `completed / (completed + failed) * 100` |
| `avgResponseMs` | `number` | Average response time in milliseconds |
| `uptime` | `number` | Agent uptime in seconds |
| `status` | `AgentHealth['status']` | `active \| idle \| offline \| error` |
| `errorCount` | `number` | Total errors since last reset |
| `lastActivity` | `Date` | Timestamp of last activity |
| `rating` | `string` | `excellent \| good \| needs-attention \| critical` |

### SupervisorReport

Full system productivity report:

| Field | Type | Description |
|-------|------|-------------|
| `generatedAt` | `Date` | Report generation timestamp |
| `period` | `string` | Report period (e.g., "2026-W20") |
| `overallHealth` | `string` | `healthy \| degraded \| warning \| critical` |
| `totalAgents` | `number` | Total agents tracked |
| `activeAgents` | `number` | Agents with `active` status |
| `totalTasksCompleted` | `number` | Sum across all agents |
| `totalTasksFailed` | `number` | Sum across all agents |
| `overallCompletionRate` | `number` | System-wide completion percentage |
| `agentProductivity` | `AgentProductivity[]` | Per-agent breakdown, sorted by rate |
| `teamProductivity` | `TeamProductivity[]` | Per-team breakdown |
| `routineCompletion` | `RoutineCompletionSummary` | Weekly routine tracking |
| `alerts` | `string[]` | Auto-generated alert messages |
| `recommendations` | `string[]` | Actionable suggestions |

### TeamProductivity

Per-team aggregated metrics:

| Field | Type | Description |
|-------|------|-------------|
| `teamId` | `CoworkTeamId` | Team identifier |
| `teamName` | `string` | Human-readable team name |
| `agentCount` | `number` | Agents in this team |
| `tasksCompleted` | `number` | Team total completed |
| `tasksFailed` | `number` | Team total failed |
| `completionRate` | `number` | Team completion percentage |
| `rating` | `string` | Team performance rating |

### RoutineCompletionSummary

Weekly routine execution tracking:

| Field | Type | Description |
|-------|------|-------------|
| `totalRoutines` | `number` | Total routines in WEEKLY_ROUTINES |
| `completedRoutines` | `number` | Routines marked complete |
| `totalTasks` | `number` | All routine tasks across 7 days |
| `completedTasks` | `number` | Tasks completed this period |
| `byDay` | `Record<RoutineDay, {...}>` | Scheduled vs completed per day |

---

## Methods

### recordAgentActivity(agentId, role, teams, health, tasksAssigned, avgResponseMs)

Records or updates an agent's productivity entry. Automatically calculates completion rate and assigns a rating based on:

| Rating | Criteria |
|--------|----------|
| **critical** | Status is `error` OR errorCount > 5 |
| **needs-attention** | Status is `offline` |
| **excellent** | Completion rate ≥ 95% |
| **good** | Completion rate ≥ 80% |
| **needs-attention** | Completion rate < 80% |

### generateReport(period)

Creates a full `SupervisorReport` with:
1. Agent productivity sorted by completion rate (ascending — worst first)
2. Team productivity aggregated from agent data per CoWork team
3. Routine completion summary from WEEKLY_ROUTINES schedule
4. Auto-generated alerts for critical/offline/low-completion agents
5. Recommendations for investigation, scaling, or workload rebalancing

### assessOverallHealth(agents)

System health determination:

| Health | Condition |
|--------|-----------|
| **critical** | > 2 agents rated critical |
| **warning** | ≥ 1 agent rated critical |
| **degraded** | > 2 agents need attention |
| **healthy** | All agents performing well |

### generateAlerts(agents, teams)

Automatically flags:
- `CRITICAL`: Agent has error status or > 5 errors
- `OFFLINE`: Agent not responding
- `LOW COMPLETION`: Agent below 80% completion rate (target: 95%)
- `TEAM CRITICAL`: Team completion rate below 60%

### generateRecommendations(agents, teams)

Actionable suggestions:
- Investigate critical agents (lists agent IDs)
- Scale resources for agents with > 5s response time
- Review workload for underperforming teams
- Increase throughput if all agents are excellent

### printProductivityReport(period)

Generates a formatted ASCII report:

```
╔════════════════════════════════════════════════════════════════════╗
║            KTV SUPERVISOR — Agent Productivity Report             ║
║            Period: 2026-W20                                       ║
╠════════════════════════════════════════════════════════════════════╣
║  System Health:    HEALTHY                                        ║
║  Active Agents:    14  / 14                                       ║
║  Tasks Completed:  342                                            ║
║  Tasks Failed:     3                                              ║
║  Completion Rate:  99.1%                                          ║
╠════════════════════════════════════════════════════════════════════╣
║  AGENT PERFORMANCE                                                ║
║  [OK] fleet-management-agent          100%  active   ║
║  [OK] safety-compliance-agent          98%  active   ║
║  [!!] data-processing-agent            72%  active   ║
╠════════════════════════════════════════════════════════════════════╣
║  TEAM PERFORMANCE                                                  ║
║  [OK] Growth Engine              4   agents  97%     ║
║  [OK] Service Delivery           3   agents  99%     ║
╠════════════════════════════════════════════════════════════════════╣
║  ALERTS                                                            ║
║  ! LOW COMPLETION: data-processing-agent — 72.0% (target: 95%)    ║
╠════════════════════════════════════════════════════════════════════╣
║  RECOMMENDATIONS                                                   ║
║  > Review workload for: Service Delivery                           ║
╚════════════════════════════════════════════════════════════════════╝
```

### getWeeklyTracker()

Returns the `WeeklyReportTracker` instance for recording routine completions.

### getReportHistory(limit?)

Returns the last N supervisor reports (default: 10).

### getAgentProductivity(agentId)

Returns a single agent's productivity entry.

### getAllProductivity()

Returns all tracked agent productivity entries.

---

## Integration Points

| System | How Supervisor Connects |
|--------|------------------------|
| **KtvOrchestrator** | Reads agent health from orchestrator's health checks |
| **CoWork Teams** | Groups agents by COWORK_TEAMS for team productivity |
| **WEEKLY_ROUTINES** | Tracks 18 routines / 78 tasks across 7 days |
| **WeeklyReportTracker** | Records routine completion events per day |
| **OperationsBrain** | Can subscribe to brain decisions for activity tracking |
| **ReportingEngine** | Feeds supervisor data into weekly KPI reports |

## 6 CoWork Teams Monitored

| Team | ID | Agents |
|------|----|--------|
| Growth Engine | `growth` | S1, S6, O3, S5, S2 |
| Service Delivery | `delivery` | O1, O2, O6, O7, S7 |
| Compliance & Safety | `compliance` | O4, O6, S7 |
| Market Intelligence | `intelligence` | S1, S2, S3 |
| Ecosystem Builder | `ecosystem` | S2, S3, S5, S6 |
| Revenue Operations | `revenue` | O5, S4, O3, S5 |

## Usage

```typescript
import { AgentSupervisor } from './agents/supervisor.js';

const supervisor = new AgentSupervisor();

// Record activity from agent health checks
supervisor.recordAgentActivity(
  'fleet-management',
  'fleet-management',
  ['delivery'],
  agentHealth,
  42,
  850,
);

// Generate and print report
const report = supervisor.generateReport('2026-W20');
console.log(supervisor.printProductivityReport('2026-W20'));

// Track routine completions
const tracker = supervisor.getWeeklyTracker();
tracker.recordCompletion('monday', 'routine-daily-ops');
```
