/**
 * KTV Working Drone Thailand - Automated Triggers
 * Time-based and condition-based triggers that fire without human input
 * These are the autonomous "reflexes" of the operations brain
 */

import { EventBus, KtvEvent, KtvEventType, createKtvEvent } from './event-bus.js';
import { AgentExecutor } from './engine.js';

// ── Trigger Definition ─────────────────────────────────────

export type TriggerType = 'interval' | 'cron-like' | 'condition' | 'threshold';

export interface TriggerDefinition {
  id: string;
  name: string;
  description: string;
  type: TriggerType;
  intervalMs?: number;
  condition?: (state: TriggerState) => boolean;
  action: () => Promise<void>;
  enabled: boolean;
}

export interface TriggerState {
  lastFired: Date | null;
  fireCount: number;
  lastResult: unknown;
}

// ── Trigger Manager ────────────────────────────────────────

export class TriggerManager {
  private triggers: Map<string, TriggerDefinition> = new Map();
  private states: Map<string, TriggerState> = new Map();
  private intervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private running = false;

  constructor(
    private eventBus: EventBus,
    private executor: AgentExecutor,
  ) {}

  register(trigger: TriggerDefinition): void {
    this.triggers.set(trigger.id, trigger);
    this.states.set(trigger.id, { lastFired: null, fireCount: 0, lastResult: null });
  }

  start(): void {
    this.running = true;
    console.log('[Triggers] Starting automated triggers...');

    for (const [id, trigger] of this.triggers) {
      if (!trigger.enabled) continue;

      if (trigger.type === 'interval' && trigger.intervalMs) {
        const interval = setInterval(async () => {
          if (!this.running) return;
          await this.fire(id);
        }, trigger.intervalMs);
        this.intervals.set(id, interval);
        console.log(`[Triggers]   ${trigger.name} (every ${trigger.intervalMs / 1000}s)`);
      }
    }

    console.log(`[Triggers] ${this.triggers.size} triggers registered, ${this.intervals.size} interval-based active`);
  }

  stop(): void {
    this.running = false;
    for (const [id, interval] of this.intervals) {
      clearInterval(interval);
    }
    this.intervals.clear();
    console.log('[Triggers] All triggers stopped');
  }

  async fire(triggerId: string): Promise<void> {
    const trigger = this.triggers.get(triggerId);
    const state = this.states.get(triggerId);
    if (!trigger || !state) return;

    // Check condition if present
    if (trigger.condition && !trigger.condition(state)) return;

    try {
      await trigger.action();
      state.lastFired = new Date();
      state.fireCount++;
    } catch (error) {
      console.error(`[Triggers] Trigger "${trigger.name}" failed:`, error);
    }
  }

  // ── Manual fire for testing ──────────────────────────────

  async fireByName(name: string): Promise<boolean> {
    for (const [id, trigger] of this.triggers) {
      if (trigger.name === name || trigger.id === id) {
        await this.fire(id);
        return true;
      }
    }
    return false;
  }

  getStatus(): { id: string; name: string; enabled: boolean; fireCount: number; lastFired: Date | null }[] {
    return Array.from(this.triggers.entries()).map(([id, t]) => {
      const state = this.states.get(id);
      return {
        id,
        name: t.name,
        enabled: t.enabled,
        fireCount: state?.fireCount ?? 0,
        lastFired: state?.lastFired ?? null,
      };
    });
  }
}

// ── Built-in Trigger Factory ───────────────────────────────

export function createDefaultTriggers(
  eventBus: EventBus,
  executor: AgentExecutor,
): TriggerDefinition[] {
  return [
    // ── Fleet Health Monitor (every 5 min) ──────────────
    {
      id: 'trig-fleet-health',
      name: 'Fleet Health Monitor',
      description: 'Checks fleet status and fires maintenance alerts',
      type: 'interval',
      intervalMs: 300_000, // 5 min
      enabled: true,
      action: async () => {
        const result = await executor('fleet-management', 'get-fleet-summary', { action: 'get-fleet-summary' });
        const summary = result as Record<string, unknown>;
        const alerts = summary.maintenanceAlerts as unknown[] ?? [];

        if (alerts.length > 0) {
          await eventBus.emit(createKtvEvent('fleet.maintenance.due', 'fleet-management', {
            alertCount: alerts.length,
            alerts,
          }));
        }
      },
    },

    // ── Pilot Certification Checker (every 30 min) ──────
    {
      id: 'trig-cert-check',
      name: 'Pilot Certification Checker',
      description: 'Monitors pilot certification expiry dates',
      type: 'interval',
      intervalMs: 1_800_000, // 30 min
      enabled: true,
      action: async () => {
        const result = await executor('pilot-operations', 'check-certifications', { action: 'check-certifications' });
        const alerts = (result as Record<string, unknown>).alerts as unknown[];

        if (alerts && alerts.length > 0) {
          await eventBus.emit(createKtvEvent('pilot.certification.expiring', 'pilot-operations', {
            alertCount: alerts.length,
            alerts,
          }));
        }
      },
    },

    // ── Overdue Invoice Scanner (every 15 min) ──────────
    {
      id: 'trig-overdue-invoices',
      name: 'Overdue Invoice Scanner',
      description: 'Scans for overdue invoices and triggers collection workflow',
      type: 'interval',
      intervalMs: 900_000, // 15 min
      enabled: true,
      action: async () => {
        const result = await executor('finance-invoicing', 'get-overdue-invoices', { action: 'get-overdue-invoices' });
        const invoices = (result as Record<string, unknown>).invoices as unknown[];

        if (invoices && invoices.length > 0) {
          await eventBus.emit(createKtvEvent('finance.invoice.overdue', 'finance-invoicing', {
            overdueCount: invoices.length,
            invoices,
          }));
        }
      },
    },

    // ── Safety Stats Aggregator (every 10 min) ──────────
    {
      id: 'trig-safety-stats',
      name: 'Safety Stats Aggregator',
      description: 'Aggregates safety statistics and monitors incident rate',
      type: 'interval',
      intervalMs: 600_000, // 10 min
      enabled: true,
      action: async () => {
        const result = await executor('safety-compliance', 'get-safety-stats', { action: 'get-safety-stats' });
        const stats = (result as Record<string, unknown>).stats as Record<string, unknown>;

        if (stats && (stats.totalIncidents as number) > 0) {
          const checklistRate = stats.checklistPassRate as number;
          if (checklistRate < 0.95) {
            await eventBus.emit(createKtvEvent('system.health.degraded', 'system', {
              reason: `Pre-flight pass rate below 95%: ${(checklistRate * 100).toFixed(1)}%`,
              stats,
            }));
          }
        }
      },
    },

    // ── Data Processing Queue Monitor (every 5 min) ─────
    {
      id: 'trig-data-queue',
      name: 'Data Processing Queue Monitor',
      description: 'Monitors data processing queue and backup compliance',
      type: 'interval',
      intervalMs: 300_000, // 5 min
      enabled: true,
      action: async () => {
        const result = await executor('data-processing', 'get-processing-stats', { action: 'get-processing-stats' });
        const stats = (result as Record<string, unknown>).stats as Record<string, unknown>;

        if (stats && (stats.backupComplianceRate as number) < 1.0) {
          await eventBus.emit(createKtvEvent('data.backup.noncompliant', 'data-processing', {
            complianceRate: stats.backupComplianceRate,
            stats,
          }));
        }
      },
    },

    // ── CRM Pipeline Monitor (every 20 min) ─────────────
    {
      id: 'trig-crm-pipeline',
      name: 'CRM Pipeline Monitor',
      description: 'Monitors lead pipeline health and conversion rates',
      type: 'interval',
      intervalMs: 1_200_000, // 20 min
      enabled: true,
      action: async () => {
        await executor('crm-sales', 'get-pipeline', { action: 'get-pipeline' });
        await executor('crm-sales', 'get-segment-report', { action: 'get-segment-report' });
      },
    },
  ];
}
