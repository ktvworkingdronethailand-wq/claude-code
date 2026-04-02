/**
 * KTV Working Drone Thailand - Agent Orchestrator
 * Central coordinator for all 7 operational AI agents
 * Handles message routing, health monitoring, and lifecycle management
 */

import { KtvAgent } from './base-agent.js';
import {
  AgentHealth,
  AgentMessage,
  AgentRole,
  BaseAgent,
} from '../types/index.js';
import { FleetManagementAgent } from './fleet-management.js';
import { JobLifecycleAgent } from './job-lifecycle.js';
import { CrmSalesAgent } from './crm-sales.js';
import { SafetyComplianceAgent } from './safety-compliance.js';
import { FinanceInvoicingAgent } from './finance-invoicing.js';
import { PilotOperationsAgent } from './pilot-operations.js';
import { DataProcessingAgent } from './data-processing.js';

export class KtvOrchestrator {
  private agents: Map<AgentRole, KtvAgent> = new Map();
  private messageQueue: AgentMessage[] = [];
  private running = false;
  private healthCheckInterval?: ReturnType<typeof setInterval>;

  constructor() {
    this.registerAgents();
  }

  private registerAgents(): void {
    const agentInstances: KtvAgent[] = [
      new FleetManagementAgent(),
      new JobLifecycleAgent(),
      new CrmSalesAgent(),
      new SafetyComplianceAgent(),
      new FinanceInvoicingAgent(),
      new PilotOperationsAgent(),
      new DataProcessingAgent(),
    ];

    for (const agent of agentInstances) {
      this.agents.set(agent.config.role, agent);
    }
  }

  // ── Lifecycle ────────────────────────────────────────────

  async start(): Promise<void> {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   KTV Working Drone Thailand - Operations System         ║');
    console.log('║   Autonomous Drone Services | Bangkok, Thailand          ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log();

    this.running = true;

    // Start all agents in parallel
    const startPromises = Array.from(this.agents.values()).map(agent => agent.start());
    await Promise.all(startPromises);

    // Start health monitoring
    this.healthCheckInterval = setInterval(() => this.healthCheck(), 60_000);

    console.log(`\n[Orchestrator] All ${this.agents.size} agents started successfully\n`);
    this.printAgentStatus();
  }

  async stop(): Promise<void> {
    this.running = false;

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    const stopPromises = Array.from(this.agents.values()).map(agent => agent.stop());
    await Promise.all(stopPromises);

    console.log('[Orchestrator] All agents stopped');
  }

  // ── Message Routing ──────────────────────────────────────

  async routeMessage(message: AgentMessage): Promise<AgentMessage | null> {
    if (message.to === 'orchestrator') {
      return this.handleOrchestratorMessage(message);
    }

    const targetAgent = this.agents.get(message.to as AgentRole);
    if (!targetAgent) {
      console.error(`[Orchestrator] No agent found for role: ${message.to}`);
      return null;
    }

    return targetAgent.handleMessage(message);
  }

  async broadcast(message: Omit<AgentMessage, 'to'>): Promise<(AgentMessage | null)[]> {
    const results: Promise<AgentMessage | null>[] = [];
    for (const [role, agent] of this.agents) {
      if (role !== message.from) {
        results.push(agent.handleMessage({ ...message, to: role } as AgentMessage));
      }
    }
    return Promise.all(results);
  }

  private async handleOrchestratorMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const { action } = message.payload as { action: string };

    switch (action) {
      case 'get-system-health':
        return {
          from: message.to as AgentRole,
          to: message.from,
          type: 'response',
          payload: { health: this.getSystemHealth() },
          timestamp: new Date(),
          correlationId: message.correlationId,
        };

      case 'get-dashboard':
        return {
          from: message.to as AgentRole,
          to: message.from,
          type: 'response',
          payload: { dashboard: await this.getDashboard() },
          timestamp: new Date(),
          correlationId: message.correlationId,
        };

      default:
        return null;
    }
  }

  // ── Health Monitoring ────────────────────────────────────

  getSystemHealth(): { agents: AgentHealth[]; systemStatus: string } {
    const health = Array.from(this.agents.values()).map(a => a.getHealth());
    const errorAgents = health.filter(h => h.status === 'error');
    const offlineAgents = health.filter(h => h.status === 'offline');

    let systemStatus = 'healthy';
    if (offlineAgents.length > 0) systemStatus = 'degraded';
    if (errorAgents.length > 0) systemStatus = 'warning';
    if (errorAgents.length > 2 || offlineAgents.length > 2) systemStatus = 'critical';

    return { agents: health, systemStatus };
  }

  private healthCheck(): void {
    const { agents, systemStatus } = this.getSystemHealth();
    if (systemStatus !== 'healthy') {
      console.warn(`[Orchestrator] System status: ${systemStatus}`);
      for (const agent of agents) {
        if (agent.status === 'error' || agent.status === 'offline') {
          console.warn(`  - ${agent.role}: ${agent.status} (errors: ${agent.errorCount})`);
        }
      }
    }
  }

  // ── Dashboard ────────────────────────────────────────────

  async getDashboard(): Promise<Record<string, unknown>> {
    const health = this.getSystemHealth();

    // Gather stats from each agent
    const fleetAgent = this.agents.get('fleet-management') as FleetManagementAgent;
    const safetyAgent = this.agents.get('safety-compliance') as SafetyComplianceAgent;

    return {
      system: {
        status: health.systemStatus,
        agentCount: this.agents.size,
        uptime: health.agents[0]?.uptime ?? 0,
      },
      fleet: fleetAgent?.getFleetSummary(),
      safety: await safetyAgent?.handleMessage({
        from: 'fleet-management',
        to: 'safety-compliance',
        type: 'query',
        payload: { action: 'get-safety-stats' },
        timestamp: new Date(),
        correlationId: 'dashboard',
      }).then(r => r?.payload),
      agents: health.agents.map(a => ({
        role: a.role,
        status: a.status,
        tasks: a.tasksCompleted,
        errors: a.errorCount,
      })),
    };
  }

  // ── Utilities ────────────────────────────────────────────

  getAgent<T extends KtvAgent>(role: AgentRole): T | undefined {
    return this.agents.get(role) as T | undefined;
  }

  printAgentStatus(): void {
    console.log('┌─────────────────────────┬──────────┬──────────────────────────────────────────────────┐');
    console.log('│ Agent                   │ Status   │ Description                                      │');
    console.log('├─────────────────────────┼──────────┼──────────────────────────────────────────────────┤');
    for (const agent of this.agents.values()) {
      const name = agent.config.name.padEnd(23);
      const status = agent.status.padEnd(8);
      const desc = agent.config.description.slice(0, 48).padEnd(48);
      console.log(`│ ${name} │ ${status} │ ${desc} │`);
    }
    console.log('└─────────────────────────┴──────────┴──────────────────────────────────────────────────┘');
  }
}
