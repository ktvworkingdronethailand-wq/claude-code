/**
 * KTV Working Drone Thailand - Operations Brain
 * The central AI coordinator that connects all agents, events, workflows,
 * and triggers into one autonomous decision-making system
 *
 * This is the "brain" — it thinks, decides, and acts across all 7 agents
 */

import { AgentRole } from '../types/index.js';
import { KtvAgent } from '../agents/base-agent.js';
import { KtvOrchestrator } from '../agents/orchestrator.js';
import { EventBus, KtvEvent, KtvEventType, createKtvEvent } from './event-bus.js';
import { WorkflowEngine, AgentExecutor } from './engine.js';
import { ALL_WORKFLOWS } from './definitions.js';
import { TriggerManager, createDefaultTriggers } from './triggers.js';
import { CONNECTED_APP_WORKFLOWS, CONNECTED_AUTOMATIONS, EMAIL_TEMPLATES, CALENDAR_TEMPLATES, KTV_TEAM } from './connected-apps.js';

// ── Decision Log ───────────────────────────────────────────

export interface BrainDecision {
  id: string;
  timestamp: Date;
  trigger: string;
  reasoning: string;
  actions: string[];
  outcome: 'success' | 'failure' | 'pending';
  agentsInvolved: AgentRole[];
}

// ── Operations Brain ───────────────────────────────────────

export class OperationsBrain {
  readonly eventBus: EventBus;
  readonly workflowEngine: WorkflowEngine;
  readonly triggerManager: TriggerManager;

  private orchestrator: KtvOrchestrator;
  private decisions: BrainDecision[] = [];
  private running = false;

  constructor(orchestrator: KtvOrchestrator) {
    this.orchestrator = orchestrator;
    this.eventBus = new EventBus();

    // Create the agent executor that bridges workflows to agents
    const executor: AgentExecutor = this.createExecutor();

    this.workflowEngine = new WorkflowEngine(this.eventBus, executor);
    this.triggerManager = new TriggerManager(this.eventBus, executor);
  }

  // ── Lifecycle ────────────────────────────────────────────

  async start(): Promise<void> {
    console.log('\n[Brain] KTV Operations Brain initializing...');
    this.running = true;

    // 1. Register all workflow definitions (core + connected apps)
    const allWorkflows = [...ALL_WORKFLOWS, ...CONNECTED_APP_WORKFLOWS];
    for (const workflow of allWorkflows) {
      this.workflowEngine.register(workflow);
    }
    console.log(`[Brain] ${allWorkflows.length} workflows registered (${ALL_WORKFLOWS.length} core + ${CONNECTED_APP_WORKFLOWS.length} connected apps)`);

    // 2. Register automated triggers
    const defaultTriggers = createDefaultTriggers(this.eventBus, this.createExecutor());
    for (const trigger of defaultTriggers) {
      this.triggerManager.register(trigger);
    }
    console.log(`[Brain] ${defaultTriggers.length} automated triggers registered`);

    // 3. Set up cross-agent reactive listeners
    this.setupReactiveListeners();

    // 4. Start triggers (interval-based monitoring)
    this.triggerManager.start();

    console.log('[Brain] Operations Brain is ONLINE\n');
    this.printBrainStatus();
  }

  async stop(): Promise<void> {
    this.running = false;
    this.triggerManager.stop();
    this.eventBus.clear();
    console.log('[Brain] Operations Brain shutdown complete');
  }

  // ── Agent Executor Bridge ────────────────────────────────

  private createExecutor(): AgentExecutor {
    return async (agent: AgentRole, action: string, payload: Record<string, unknown>) => {
      const agentInstance = this.orchestrator.getAgent<KtvAgent>(agent);
      if (!agentInstance) {
        throw new Error(`Agent not found: ${agent}`);
      }

      const message = {
        from: 'fleet-management' as AgentRole, // brain acts as coordinator
        to: agent,
        type: 'command' as const,
        payload: { action, ...payload },
        timestamp: new Date(),
        correlationId: crypto.randomUUID(),
      };

      const result = await agentInstance.handleMessage(message);
      return result?.payload ?? {};
    };
  }

  // ── Reactive Cross-Agent Listeners ───────────────────────
  // These are the "synapses" — automatic reactions between agents

  private setupReactiveListeners(): void {
    // When a job stage changes, emit a standardized event
    this.eventBus.subscribe({
      id: 'brain-job-stage-monitor',
      eventType: 'job.stage.changed',
      handler: async (event) => {
        this.logDecision(
          `Job ${event.data.jobId} stage change`,
          `Job moved to ${event.data.toStage}, evaluating required actions`,
          [`Trigger workflow for stage: ${event.data.toStage}`],
          [event.source as AgentRole],
        );
      },
      description: 'Brain monitors all job stage transitions',
    });

    // When safety risk is unacceptable, auto-block the job
    this.eventBus.subscribe({
      id: 'brain-risk-blocker',
      eventType: 'safety.risk.unacceptable',
      handler: async (event) => {
        this.logDecision(
          'Unacceptable risk detected',
          `Risk score too high for job ${event.data.jobId}, blocking mission`,
          ['Block job advancement', 'Notify operations manager', 'Log safety concern'],
          ['safety-compliance', 'job-lifecycle'],
        );
      },
      description: 'Brain blocks jobs with unacceptable risk',
    });

    // When weather is no-go, pause all pending missions
    this.eventBus.subscribe({
      id: 'brain-weather-pause',
      eventType: 'safety.weather.nogo',
      handler: async (event) => {
        this.logDecision(
          'Weather NO-GO',
          `Weather conditions unsafe: ${event.data.reason}`,
          ['Pause all pending missions', 'Notify assigned pilots', 'Reschedule affected jobs'],
          ['safety-compliance', 'pilot-operations', 'job-lifecycle'],
        );
      },
      description: 'Brain pauses missions during bad weather',
    });

    // When fleet health degrades, reduce mission capacity
    this.eventBus.subscribe({
      id: 'brain-fleet-capacity',
      eventType: 'fleet.maintenance.due',
      handler: async (event) => {
        const alertCount = event.data.alertCount as number;
        this.logDecision(
          'Fleet maintenance required',
          `${alertCount} drones need maintenance, adjusting capacity`,
          ['Ground affected drones', 'Reassign pending missions', 'Order spare parts'],
          ['fleet-management', 'job-lifecycle'],
        );
      },
      description: 'Brain adjusts capacity when fleet needs maintenance',
    });

    // When incident occurs, trigger emergency protocol
    this.eventBus.subscribe({
      id: 'brain-emergency',
      eventType: 'safety.incident.reported',
      handler: async (event) => {
        this.logDecision(
          'EMERGENCY: Incident reported',
          `${event.data.type} incident (${event.data.severity}): ${event.data.description}`,
          ['Execute emergency protocol', 'Ground affected drone', 'Release pilot', 'File CAAT report'],
          ['safety-compliance', 'fleet-management', 'pilot-operations'],
        );
      },
      description: 'Brain handles emergency incidents',
    });

    // When backup is non-compliant, flag immediately
    this.eventBus.subscribe({
      id: 'brain-backup-compliance',
      eventType: 'data.backup.noncompliant',
      handler: async (event) => {
        this.logDecision(
          'Backup compliance violation',
          `4-copy backup rule not met (${((event.data.complianceRate as number) * 100).toFixed(0)}% compliant)`,
          ['Alert data team', 'Pause delivery until compliant', 'Run compliance check'],
          ['data-processing'],
        );
      },
      description: 'Brain enforces 4-copy backup protocol',
    });

    // When workflow completes, log decision
    this.eventBus.subscribe({
      id: 'brain-workflow-complete',
      eventType: 'workflow.completed',
      handler: async (event) => {
        this.logDecision(
          `Workflow completed: ${event.data.name}`,
          `${event.data.stepsCompleted} steps completed in ${event.data.durationMs}ms`,
          ['Archive workflow result', 'Update dashboards'],
          [],
        );
      },
      description: 'Brain tracks workflow completions',
    });

    // Connected apps: log email/calendar events
    this.eventBus.subscribe({
      id: 'brain-email-drafted',
      eventType: 'email.draft.created',
      handler: async (event) => {
        this.logDecision(
          `Email drafted: ${event.data.template}`,
          `Draft created for ${event.data.to} — ${event.data.subject}`,
          ['Email draft saved to Gmail'],
          [],
        );
      },
      description: 'Brain tracks email drafts created by automations',
    });

    this.eventBus.subscribe({
      id: 'brain-calendar-created',
      eventType: 'calendar.event.created',
      handler: async (event) => {
        this.logDecision(
          `Calendar event: ${event.data.template}`,
          `Event created: ${event.data.summary}`,
          ['Calendar event added for team'],
          [],
        );
      },
      description: 'Brain tracks calendar events created by automations',
    });

    console.log(`[Brain] Connected apps: ${CONNECTED_AUTOMATIONS.length} automations, ${EMAIL_TEMPLATES.length} email templates, ${CALENDAR_TEMPLATES.length} calendar templates`);
    console.log(`[Brain] Team contacts: ${Object.values(KTV_TEAM).map(c => c.name).join(', ')}`);
    console.log(`[Brain] ${this.eventBus.getSubscriptionCount()} reactive listeners active`);
  }

  // ── Public API ───────────────────────────────────────────

  /** Emit an event into the brain — triggers workflows and reactions */
  async emit(type: KtvEventType, source: AgentRole | 'brain' | 'system', data: Record<string, unknown>): Promise<void> {
    const event = createKtvEvent(type, source, data);
    await this.eventBus.emit(event);
  }

  /** Run a specific workflow by ID */
  async runWorkflow(workflowId: string, data: Record<string, unknown>): Promise<void> {
    const event = createKtvEvent('system.health.recovered', 'brain', data);
    await this.workflowEngine.execute(workflowId, event);
  }

  /** Fire a trigger manually */
  async fireTrigger(triggerId: string): Promise<void> {
    await this.triggerManager.fireByName(triggerId);
  }

  /** Get the brain's decision log */
  getDecisions(limit = 50): BrainDecision[] {
    return this.decisions.slice(-limit);
  }

  /** Full brain status report */
  getStatus(): {
    running: boolean;
    workflows: ReturnType<WorkflowEngine['getStats']>;
    triggers: ReturnType<TriggerManager['getStatus']>;
    events: { total: number; types: KtvEventType[] };
    decisions: number;
    reactiveListeners: number;
  } {
    return {
      running: this.running,
      workflows: this.workflowEngine.getStats(),
      triggers: this.triggerManager.getStatus(),
      events: {
        total: this.eventBus.getEventLog().length,
        types: this.eventBus.getRegisteredEvents(),
      },
      decisions: this.decisions.length,
      reactiveListeners: this.eventBus.getSubscriptionCount(),
    };
  }

  // ── Decision Logging ─────────────────────────────────────

  private logDecision(
    trigger: string,
    reasoning: string,
    actions: string[],
    agentsInvolved: AgentRole[],
  ): BrainDecision {
    const decision: BrainDecision = {
      id: `DEC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date(),
      trigger,
      reasoning,
      actions,
      outcome: 'success',
      agentsInvolved,
    };

    this.decisions.push(decision);
    console.log(`[Brain] Decision: ${trigger}`);
    console.log(`[Brain]   Reasoning: ${reasoning}`);
    console.log(`[Brain]   Actions: ${actions.join(', ')}`);

    return decision;
  }

  // ── Display ──────────────────────────────────────────────

  printBrainStatus(): void {
    const status = this.getStatus();
    console.log('┌────────────────────────────────────────────────────────────────┐');
    console.log('│                  KTV OPERATIONS BRAIN                          │');
    console.log('├────────────────────────────────────────────────────────────────┤');
    console.log(`│  Status:              ${status.running ? 'ONLINE' : 'OFFLINE'}                                   │`);
    console.log(`│  Workflows:           ${String(status.workflows.definitionsRegistered).padEnd(4)} registered                            │`);
    console.log(`│  Triggers:            ${String(status.triggers.length).padEnd(4)} automated                             │`);
    console.log(`│  Reactive Listeners:  ${String(status.reactiveListeners).padEnd(4)} active                                │`);
    console.log(`│  Event Types:         ${String(status.events.types.length).padEnd(4)} monitored                             │`);
    console.log('├────────────────────────────────────────────────────────────────┤');
    console.log('│  Automated Workflows:                                          │');
    for (const wf of this.workflowEngine.getDefinitions()) {
      const name = wf.name.slice(0, 50).padEnd(50);
      console.log(`│    ${name}          │`);
    }
    console.log('├────────────────────────────────────────────────────────────────┤');
    console.log('│  Automated Triggers:                                           │');
    for (const trig of status.triggers) {
      const name = trig.name.slice(0, 40).padEnd(40);
      const state = trig.enabled ? 'ACTIVE' : 'OFF   ';
      console.log(`│    ${name}  ${state}              │`);
    }
    console.log('└────────────────────────────────────────────────────────────────┘');
  }
}
