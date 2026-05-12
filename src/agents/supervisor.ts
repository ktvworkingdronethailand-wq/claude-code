/**
 * KTV Working Drone Thailand - Agent Supervisor
 * Monitors productivity, task completion, and health across all 14 agents.
 * Generates performance reports and flags underperforming agents.
 */

import { AgentHealth, AgentRole } from '../types/index.js';
import {
  WEEKLY_ROUTINES, WeeklyReportTracker,
  getRoutinesByDay, getAllRoutineTasks,
  type RoutineDay, type CoworkTeamId,
  COWORK_TEAMS,
} from '../workflows/cowork.js';

// ── Types ──────────────────────────────────────────────────────

export interface AgentProductivity {
  agentId: string;
  role: AgentRole | string;
  team: CoworkTeamId[];
  tasksAssigned: number;
  tasksCompleted: number;
  tasksFailed: number;
  completionRate: number;
  avgResponseMs: number;
  uptime: number;
  status: AgentHealth['status'];
  errorCount: number;
  lastActivity: Date;
  rating: 'excellent' | 'good' | 'needs-attention' | 'critical';
}

export interface SupervisorReport {
  generatedAt: Date;
  period: string;
  overallHealth: 'healthy' | 'degraded' | 'warning' | 'critical';
  totalAgents: number;
  activeAgents: number;
  totalTasksCompleted: number;
  totalTasksFailed: number;
  overallCompletionRate: number;
  agentProductivity: AgentProductivity[];
  teamProductivity: TeamProductivity[];
  routineCompletion: RoutineCompletionSummary;
  alerts: string[];
  recommendations: string[];
}

export interface TeamProductivity {
  teamId: CoworkTeamId;
  teamName: string;
  agentCount: number;
  tasksCompleted: number;
  tasksFailed: number;
  completionRate: number;
  rating: 'excellent' | 'good' | 'needs-attention' | 'critical';
}

export interface RoutineCompletionSummary {
  totalRoutines: number;
  completedRoutines: number;
  totalTasks: number;
  completedTasks: number;
  byDay: Record<RoutineDay, { scheduled: number; completed: number }>;
}

// ── Supervisor ─────────────────────────────────────────────────

export class AgentSupervisor {
  private productivityLog: Map<string, AgentProductivity> = new Map();
  private reportHistory: SupervisorReport[] = [];
  private weeklyTracker = new WeeklyReportTracker();

  getWeeklyTracker(): WeeklyReportTracker {
    return this.weeklyTracker;
  }

  recordAgentActivity(
    agentId: string,
    role: AgentRole | string,
    teams: CoworkTeamId[],
    health: AgentHealth,
    tasksAssigned: number,
    avgResponseMs: number,
  ): void {
    const existing = this.productivityLog.get(agentId);
    const completed = health.tasksCompleted;
    const failed = health.errorCount;
    const completionRate = (completed + failed) > 0
      ? (completed / (completed + failed)) * 100 : 100;

    this.productivityLog.set(agentId, {
      agentId,
      role,
      team: teams,
      tasksAssigned,
      tasksCompleted: completed,
      tasksFailed: failed,
      completionRate,
      avgResponseMs,
      uptime: health.uptime,
      status: health.status,
      errorCount: health.errorCount,
      lastActivity: health.lastActivity,
      rating: this.rateAgent(completionRate, health.status, health.errorCount),
    });
  }

  private rateAgent(completionRate: number, status: AgentHealth['status'], errorCount: number): AgentProductivity['rating'] {
    if (status === 'error' || errorCount > 5) return 'critical';
    if (status === 'offline') return 'needs-attention';
    if (completionRate >= 95) return 'excellent';
    if (completionRate >= 80) return 'good';
    return 'needs-attention';
  }

  generateReport(period: string): SupervisorReport {
    const agents = Array.from(this.productivityLog.values());
    const activeAgents = agents.filter(a => a.status === 'active');
    const totalCompleted = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
    const totalFailed = agents.reduce((sum, a) => sum + a.tasksFailed, 0);
    const totalTasks = totalCompleted + totalFailed;

    const overallHealth = this.assessOverallHealth(agents);
    const teamProductivity = this.assessTeamProductivity(agents);
    const routineCompletion = this.assessRoutineCompletion();
    const alerts = this.generateAlerts(agents, teamProductivity);
    const recommendations = this.generateRecommendations(agents, teamProductivity);

    const report: SupervisorReport = {
      generatedAt: new Date(),
      period,
      overallHealth,
      totalAgents: agents.length,
      activeAgents: activeAgents.length,
      totalTasksCompleted: totalCompleted,
      totalTasksFailed: totalFailed,
      overallCompletionRate: totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 100,
      agentProductivity: agents.sort((a, b) => a.completionRate - b.completionRate),
      teamProductivity,
      routineCompletion,
      alerts,
      recommendations,
    };

    this.reportHistory.push(report);
    return report;
  }

  private assessOverallHealth(agents: AgentProductivity[]): SupervisorReport['overallHealth'] {
    const critical = agents.filter(a => a.rating === 'critical').length;
    const needsAttention = agents.filter(a => a.rating === 'needs-attention').length;
    if (critical > 2) return 'critical';
    if (critical > 0) return 'warning';
    if (needsAttention > 2) return 'degraded';
    return 'healthy';
  }

  private assessTeamProductivity(agents: AgentProductivity[]): TeamProductivity[] {
    const teams: TeamProductivity[] = [];

    for (const [teamId, team] of Object.entries(COWORK_TEAMS)) {
      const teamAgents = agents.filter(a => a.team.includes(teamId as CoworkTeamId));
      const completed = teamAgents.reduce((sum, a) => sum + a.tasksCompleted, 0);
      const failed = teamAgents.reduce((sum, a) => sum + a.tasksFailed, 0);
      const total = completed + failed;
      const rate = total > 0 ? (completed / total) * 100 : 100;

      teams.push({
        teamId: teamId as CoworkTeamId,
        teamName: team.name,
        agentCount: teamAgents.length,
        tasksCompleted: completed,
        tasksFailed: failed,
        completionRate: rate,
        rating: rate >= 95 ? 'excellent' : rate >= 80 ? 'good' : rate >= 60 ? 'needs-attention' : 'critical',
      });
    }

    return teams;
  }

  private assessRoutineCompletion(): RoutineCompletionSummary {
    const allDays: RoutineDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const byDay: Record<RoutineDay, { scheduled: number; completed: number }> = {} as Record<RoutineDay, { scheduled: number; completed: number }>;

    let totalScheduled = 0;
    let totalCompleted = 0;

    for (const day of allDays) {
      const routines = getRoutinesByDay(day);
      const taskCount = routines.reduce((sum, r) => sum + r.tasks.length, 0);
      byDay[day] = { scheduled: taskCount, completed: 0 };
      totalScheduled += taskCount;
    }

    return {
      totalRoutines: WEEKLY_ROUTINES.length,
      completedRoutines: 0,
      totalTasks: getAllRoutineTasks().length,
      completedTasks: totalCompleted,
      byDay,
    };
  }

  private generateAlerts(agents: AgentProductivity[], teams: TeamProductivity[]): string[] {
    const alerts: string[] = [];

    for (const agent of agents) {
      if (agent.rating === 'critical') {
        alerts.push(`CRITICAL: ${agent.agentId} (${agent.role}) — ${agent.errorCount} errors, status: ${agent.status}`);
      }
      if (agent.status === 'offline') {
        alerts.push(`OFFLINE: ${agent.agentId} (${agent.role}) — agent not responding`);
      }
      if (agent.completionRate < 80 && agent.tasksAssigned > 0) {
        alerts.push(`LOW COMPLETION: ${agent.agentId} — ${agent.completionRate.toFixed(1)}% (target: 95%)`);
      }
    }

    for (const team of teams) {
      if (team.rating === 'critical') {
        alerts.push(`TEAM CRITICAL: ${team.teamName} — completion rate ${team.completionRate.toFixed(1)}%`);
      }
    }

    return alerts;
  }

  private generateRecommendations(agents: AgentProductivity[], teams: TeamProductivity[]): string[] {
    const recs: string[] = [];

    const criticalAgents = agents.filter(a => a.rating === 'critical');
    if (criticalAgents.length > 0) {
      recs.push(`Investigate ${criticalAgents.length} critical agent(s): ${criticalAgents.map(a => a.agentId).join(', ')}`);
    }

    const slowAgents = agents.filter(a => a.avgResponseMs > 5000);
    if (slowAgents.length > 0) {
      recs.push(`${slowAgents.length} agent(s) with >5s response time — consider resource scaling`);
    }

    const underperformingTeams = teams.filter(t => t.rating === 'needs-attention' || t.rating === 'critical');
    if (underperformingTeams.length > 0) {
      recs.push(`Review workload for: ${underperformingTeams.map(t => t.teamName).join(', ')}`);
    }

    if (agents.length > 0 && agents.every(a => a.rating === 'excellent')) {
      recs.push('All agents performing at excellent level — consider increasing throughput');
    }

    return recs;
  }

  getReportHistory(limit = 10): SupervisorReport[] {
    return this.reportHistory.slice(-limit);
  }

  getAgentProductivity(agentId: string): AgentProductivity | undefined {
    return this.productivityLog.get(agentId);
  }

  getAllProductivity(): AgentProductivity[] {
    return Array.from(this.productivityLog.values());
  }

  printProductivityReport(period: string): string {
    const report = this.generateReport(period);
    const lines: string[] = [];

    lines.push('╔════════════════════════════════════════════════════════════════════╗');
    lines.push('║            KTV SUPERVISOR — Agent Productivity Report             ║');
    lines.push(`║            Period: ${period.padEnd(48)}║`);
    lines.push('╠════════════════════════════════════════════════════════════════════╣');
    lines.push(`║  System Health:    ${report.overallHealth.toUpperCase().padEnd(49)}║`);
    lines.push(`║  Active Agents:    ${String(report.activeAgents).padEnd(3)} / ${String(report.totalAgents).padEnd(44)}║`);
    lines.push(`║  Tasks Completed:  ${String(report.totalTasksCompleted).padEnd(49)}║`);
    lines.push(`║  Tasks Failed:     ${String(report.totalTasksFailed).padEnd(49)}║`);
    lines.push(`║  Completion Rate:  ${report.overallCompletionRate.toFixed(1)}%${' '.repeat(46 - report.overallCompletionRate.toFixed(1).length)}║`);
    lines.push('╠════════════════════════════════════════════════════════════════════╣');
    lines.push('║  AGENT PERFORMANCE                                                ║');
    lines.push('║                                                                    ║');

    for (const agent of report.agentProductivity) {
      const badge = agent.rating === 'excellent' ? '[OK]' : agent.rating === 'good' ? '[OK]' : agent.rating === 'needs-attention' ? '[!!]' : '[XX]';
      lines.push(`║  ${badge} ${agent.agentId.slice(0, 35).padEnd(35)} ${agent.completionRate.toFixed(0).padStart(3)}%  ${agent.status.padEnd(8)} ║`);
    }

    lines.push('║                                                                    ║');
    lines.push('╠════════════════════════════════════════════════════════════════════╣');
    lines.push('║  TEAM PERFORMANCE                                                  ║');
    lines.push('║                                                                    ║');

    for (const team of report.teamProductivity) {
      const badge = team.rating === 'excellent' ? '[OK]' : team.rating === 'good' ? '[OK]' : team.rating === 'needs-attention' ? '[!!]' : '[XX]';
      lines.push(`║  ${badge} ${team.teamName.padEnd(25)} ${String(team.agentCount).padEnd(3)} agents  ${team.completionRate.toFixed(0).padStart(3)}%     ║`);
    }

    if (report.alerts.length > 0) {
      lines.push('║                                                                    ║');
      lines.push('╠════════════════════════════════════════════════════════════════════╣');
      lines.push('║  ALERTS                                                            ║');
      for (const alert of report.alerts) {
        lines.push(`║  ! ${alert.slice(0, 64).padEnd(64)}║`);
      }
    }

    if (report.recommendations.length > 0) {
      lines.push('║                                                                    ║');
      lines.push('╠════════════════════════════════════════════════════════════════════╣');
      lines.push('║  RECOMMENDATIONS                                                   ║');
      for (const rec of report.recommendations) {
        lines.push(`║  > ${rec.slice(0, 64).padEnd(64)}║`);
      }
    }

    lines.push('╚════════════════════════════════════════════════════════════════════╝');
    return lines.join('\n');
  }
}
