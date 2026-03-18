/**
 * KTV Working Drone Thailand - Event Bus
 * Pub/sub event system connecting all agents into a reactive brain
 * Every agent action emits events; triggers listen and fire workflows
 */

import { AgentRole } from '../types/index.js';

// ── Event Types ────────────────────────────────────────────

export type KtvEventType =
  // Lead & CRM events
  | 'lead.created' | 'lead.qualified' | 'lead.won' | 'lead.lost'
  | 'client.onboarded' | 'client.nps.recorded'
  // Job lifecycle events
  | 'job.created' | 'job.stage.changed' | 'job.completed' | 'job.cancelled'
  // Mission events
  | 'mission.preflight.passed' | 'mission.preflight.failed'
  | 'mission.started' | 'mission.completed' | 'mission.aborted'
  // Fleet events
  | 'fleet.drone.assigned' | 'fleet.drone.released'
  | 'fleet.maintenance.due' | 'fleet.maintenance.completed'
  | 'fleet.battery.degraded' | 'fleet.battery.retired'
  // Safety events
  | 'safety.risk.assessed' | 'safety.risk.unacceptable'
  | 'safety.weather.nogo' | 'safety.weather.go'
  | 'safety.incident.reported' | 'safety.caat.notified'
  // Pilot events
  | 'pilot.assigned' | 'pilot.released'
  | 'pilot.hours.limit.approaching' | 'pilot.certification.expiring'
  // Data processing events
  | 'data.job.created' | 'data.processing.complete'
  | 'data.qa.passed' | 'data.qa.failed'
  | 'data.backup.complete' | 'data.backup.noncompliant'
  | 'data.delivered'
  // Finance events
  | 'finance.invoice.created' | 'finance.invoice.sent'
  | 'finance.invoice.paid' | 'finance.invoice.overdue'
  // System events
  | 'system.health.degraded' | 'system.health.recovered'
  | 'workflow.started' | 'workflow.completed' | 'workflow.failed';

export interface KtvEvent {
  id: string;
  type: KtvEventType;
  source: AgentRole | 'brain' | 'system';
  data: Record<string, unknown>;
  timestamp: Date;
  correlationId: string;
  metadata?: Record<string, unknown>;
}

export type EventHandler = (event: KtvEvent) => Promise<void>;

export interface EventSubscription {
  id: string;
  eventType: KtvEventType | KtvEventType[];
  handler: EventHandler;
  source?: AgentRole | 'brain' | 'system';
  description: string;
}

// ── Event Bus ──────────────────────────────────────────────

export class EventBus {
  private subscriptions: Map<KtvEventType, EventSubscription[]> = new Map();
  private eventLog: KtvEvent[] = [];
  private maxLogSize = 10_000;

  subscribe(sub: EventSubscription): void {
    const types = Array.isArray(sub.eventType) ? sub.eventType : [sub.eventType];
    for (const type of types) {
      const existing = this.subscriptions.get(type) ?? [];
      existing.push(sub);
      this.subscriptions.set(type, existing);
    }
  }

  unsubscribe(subscriptionId: string): void {
    for (const [type, subs] of this.subscriptions) {
      this.subscriptions.set(type, subs.filter(s => s.id !== subscriptionId));
    }
  }

  async emit(event: KtvEvent): Promise<void> {
    // Log the event
    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(-this.maxLogSize / 2);
    }

    // Find all matching subscribers
    const subs = this.subscriptions.get(event.type) ?? [];
    const matching = subs.filter(s => !s.source || s.source === event.source);

    // Execute all handlers concurrently
    const results = matching.map(async (sub) => {
      try {
        await sub.handler(event);
      } catch (error) {
        console.error(`[EventBus] Handler "${sub.description}" failed for ${event.type}:`, error);
      }
    });

    await Promise.all(results);
  }

  getEventLog(filter?: { type?: KtvEventType; source?: string; since?: Date; limit?: number }): KtvEvent[] {
    let events = this.eventLog;

    if (filter?.type) events = events.filter(e => e.type === filter.type);
    if (filter?.source) events = events.filter(e => e.source === filter.source);
    if (filter?.since) events = events.filter(e => e.timestamp >= filter.since!);

    return filter?.limit ? events.slice(-filter.limit) : events;
  }

  getSubscriptionCount(): number {
    let count = 0;
    for (const subs of this.subscriptions.values()) {
      count += subs.length;
    }
    return count;
  }

  getRegisteredEvents(): KtvEventType[] {
    return Array.from(this.subscriptions.keys());
  }

  clear(): void {
    this.subscriptions.clear();
    this.eventLog = [];
  }
}

// ── Helper to create events ────────────────────────────────

export function createKtvEvent(
  type: KtvEventType,
  source: AgentRole | 'brain' | 'system',
  data: Record<string, unknown>,
  correlationId?: string,
): KtvEvent {
  return {
    id: `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    source,
    data,
    timestamp: new Date(),
    correlationId: correlationId ?? crypto.randomUUID(),
  };
}
