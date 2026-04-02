/**
 * KTV Working Drone Thailand - Workflow Engine
 * Defines, triggers, and executes multi-agent workflow sequences
 * Each workflow is a chain of steps across different agents
 */

import { AgentRole } from '../types/index.js';
import { EventBus, KtvEvent, KtvEventType, createKtvEvent } from './event-bus.js';

// ── Workflow Definition ────────────────────────────────────

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface WorkflowStep {
  id: string;
  name: string;
  agent: AgentRole;
  action: string;
  inputMap: (context: WorkflowContext) => Record<string, unknown>;
  outputKey?: string;
  condition?: (context: WorkflowContext) => boolean;
  onFailure?: 'abort' | 'skip' | 'retry';
  maxRetries?: number;
  emitsEvent?: KtvEventType;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: KtvEventType | KtvEventType[];
  triggerCondition?: (event: KtvEvent) => boolean;
  steps: WorkflowStep[];
  timeout?: number;
}

export interface WorkflowContext {
  workflowId: string;
  definitionId: string;
  triggerEvent: KtvEvent;
  stepResults: Map<string, Record<string, unknown>>;
  variables: Record<string, unknown>;
  startedAt: Date;
}

export interface WorkflowInstance {
  id: string;
  definitionId: string;
  status: WorkflowStatus;
  currentStep: number;
  context: WorkflowContext;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  stepsCompleted: string[];
  stepsSkipped: string[];
}

// ── Agent Executor Interface ───────────────────────────────

export type AgentExecutor = (
  agent: AgentRole,
  action: string,
  payload: Record<string, unknown>,
) => Promise<Record<string, unknown>>;

// ── Workflow Engine ────────────────────────────────────────

export class WorkflowEngine {
  private definitions: Map<string, WorkflowDefinition> = new Map();
  private instances: Map<string, WorkflowInstance> = new Map();
  private eventBus: EventBus;
  private executor: AgentExecutor;

  constructor(eventBus: EventBus, executor: AgentExecutor) {
    this.eventBus = eventBus;
    this.executor = executor;
  }

  // ── Register Workflows ───────────────────────────────────

  register(definition: WorkflowDefinition): void {
    this.definitions.set(definition.id, definition);

    // Auto-subscribe to trigger events
    const triggers = Array.isArray(definition.trigger) ? definition.trigger : [definition.trigger];

    this.eventBus.subscribe({
      id: `wf-trigger-${definition.id}`,
      eventType: triggers,
      handler: async (event: KtvEvent) => {
        if (definition.triggerCondition && !definition.triggerCondition(event)) {
          return; // condition not met, skip
        }
        await this.execute(definition.id, event);
      },
      description: `Trigger: ${definition.name}`,
    });
  }

  // ── Execute Workflow ─────────────────────────────────────

  async execute(definitionId: string, triggerEvent: KtvEvent): Promise<WorkflowInstance> {
    const definition = this.definitions.get(definitionId);
    if (!definition) {
      throw new Error(`Workflow definition not found: ${definitionId}`);
    }

    const instanceId = `WF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date();

    const context: WorkflowContext = {
      workflowId: instanceId,
      definitionId,
      triggerEvent,
      stepResults: new Map(),
      variables: { ...triggerEvent.data },
      startedAt: now,
    };

    const instance: WorkflowInstance = {
      id: instanceId,
      definitionId,
      status: 'running',
      currentStep: 0,
      context,
      startedAt: now,
      stepsCompleted: [],
      stepsSkipped: [],
    };

    this.instances.set(instanceId, instance);

    // Emit workflow started event
    await this.eventBus.emit(createKtvEvent('workflow.started', 'brain', {
      workflowId: instanceId,
      definitionId,
      name: definition.name,
      triggerEventType: triggerEvent.type,
    }, triggerEvent.correlationId));

    console.log(`[Brain] Workflow started: ${definition.name} (${instanceId})`);

    // Execute steps sequentially
    try {
      for (let i = 0; i < definition.steps.length; i++) {
        const step = definition.steps[i];
        instance.currentStep = i;

        // Check condition
        if (step.condition && !step.condition(context)) {
          instance.stepsSkipped.push(step.id);
          console.log(`[Brain]   Step skipped: ${step.name} (condition not met)`);
          continue;
        }

        // Build input from context
        const input = step.inputMap(context);
        const payload = { action: step.action, ...input };

        // Execute with retry
        let result: Record<string, unknown> | undefined;
        let retries = step.maxRetries ?? 0;
        let lastError: Error | undefined;

        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            result = await this.executor(step.agent, step.action, payload);
            break;
          } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            if (attempt < retries) {
              console.log(`[Brain]   Step "${step.name}" retry ${attempt + 1}/${retries}`);
            }
          }
        }

        if (!result && lastError) {
          if (step.onFailure === 'skip') {
            instance.stepsSkipped.push(step.id);
            console.log(`[Brain]   Step skipped (failed): ${step.name}`);
            continue;
          }
          if (step.onFailure === 'abort' || !step.onFailure) {
            throw lastError;
          }
        }

        // Store result in context
        if (result) {
          context.stepResults.set(step.id, result);
          if (step.outputKey) {
            context.variables[step.outputKey] = result;
          }
        }

        // Emit step event if defined
        if (step.emitsEvent) {
          await this.eventBus.emit(createKtvEvent(step.emitsEvent, step.agent, {
            workflowId: instanceId,
            stepId: step.id,
            ...result,
          }, triggerEvent.correlationId));
        }

        instance.stepsCompleted.push(step.id);
        console.log(`[Brain]   Step done: ${step.name} -> ${step.agent}`);
      }

      instance.status = 'completed';
      instance.completedAt = new Date();

      await this.eventBus.emit(createKtvEvent('workflow.completed', 'brain', {
        workflowId: instanceId,
        definitionId,
        name: definition.name,
        stepsCompleted: instance.stepsCompleted.length,
        stepsSkipped: instance.stepsSkipped.length,
        durationMs: instance.completedAt.getTime() - instance.startedAt.getTime(),
      }, triggerEvent.correlationId));

      console.log(`[Brain] Workflow completed: ${definition.name} (${instance.stepsCompleted.length} steps)`);
    } catch (error) {
      instance.status = 'failed';
      instance.completedAt = new Date();
      instance.error = error instanceof Error ? error.message : String(error);

      await this.eventBus.emit(createKtvEvent('workflow.failed', 'brain', {
        workflowId: instanceId,
        definitionId,
        error: instance.error,
        failedAtStep: instance.currentStep,
      }, triggerEvent.correlationId));

      console.error(`[Brain] Workflow failed: ${definition.name} - ${instance.error}`);
    }

    return instance;
  }

  // ── Query ────────────────────────────────────────────────

  getDefinitions(): WorkflowDefinition[] {
    return Array.from(this.definitions.values());
  }

  getInstance(id: string): WorkflowInstance | undefined {
    return this.instances.get(id);
  }

  getActiveWorkflows(): WorkflowInstance[] {
    return Array.from(this.instances.values()).filter(i => i.status === 'running');
  }

  getWorkflowHistory(limit = 50): WorkflowInstance[] {
    return Array.from(this.instances.values())
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }

  getStats(): {
    definitionsRegistered: number;
    totalExecutions: number;
    activeWorkflows: number;
    completed: number;
    failed: number;
    avgDurationMs: number;
  } {
    const all = Array.from(this.instances.values());
    const completed = all.filter(i => i.status === 'completed');
    const durations = completed
      .filter(i => i.completedAt)
      .map(i => i.completedAt!.getTime() - i.startedAt.getTime());

    return {
      definitionsRegistered: this.definitions.size,
      totalExecutions: all.length,
      activeWorkflows: all.filter(i => i.status === 'running').length,
      completed: completed.length,
      failed: all.filter(i => i.status === 'failed').length,
      avgDurationMs: durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0,
    };
  }
}
