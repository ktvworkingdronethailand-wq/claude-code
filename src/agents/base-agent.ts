/**
 * KTV Working Drone Thailand - Base Agent
 * Abstract base class for all operational AI agents
 */

import {
  AgentConfig,
  AgentHealth,
  AgentMessage,
  AgentRole,
  AgentStatus,
  BaseAgent,
} from '../types/index.js';

export abstract class KtvAgent implements BaseAgent {
  config: AgentConfig;
  status: AgentStatus = 'idle';

  private startTime: Date = new Date();
  private errorCount = 0;
  private tasksPending = 0;
  private tasksCompleted = 0;
  private lastActivity: Date = new Date();
  private messageHandlers: Map<string, (msg: AgentMessage) => Promise<AgentMessage | null>> = new Map();

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    this.startTime = new Date();
    this.status = 'active';
    this.lastActivity = new Date();
    await this.onStart();
    console.log(`[${this.config.name}] Agent started`);
  }

  async stop(): Promise<void> {
    this.status = 'offline';
    await this.onStop();
    console.log(`[${this.config.name}] Agent stopped`);
  }

  async handleMessage(message: AgentMessage): Promise<AgentMessage | null> {
    this.lastActivity = new Date();
    this.tasksPending++;

    try {
      const handler = this.messageHandlers.get(message.type);
      const result = handler
        ? await handler(message)
        : await this.processMessage(message);

      this.tasksPending--;
      this.tasksCompleted++;
      return result;
    } catch (error) {
      this.errorCount++;
      this.tasksPending--;
      this.status = 'error';

      return this.createResponse(message, {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      });
    }
  }

  getHealth(): AgentHealth {
    return {
      role: this.config.role,
      status: this.status,
      uptime: Date.now() - this.startTime.getTime(),
      lastActivity: this.lastActivity,
      errorCount: this.errorCount,
      tasksPending: this.tasksPending,
      tasksCompleted: this.tasksCompleted,
    };
  }

  // ── Subclass hooks ───────────────────────────────────────

  protected abstract onStart(): Promise<void>;
  protected abstract onStop(): Promise<void>;
  protected abstract processMessage(message: AgentMessage): Promise<AgentMessage | null>;

  // ── Helpers ──────────────────────────────────────────────

  protected registerHandler(
    type: string,
    handler: (msg: AgentMessage) => Promise<AgentMessage | null>,
  ): void {
    this.messageHandlers.set(type, handler);
  }

  protected createResponse(
    original: AgentMessage,
    payload: Record<string, unknown>,
  ): AgentMessage {
    return {
      from: this.config.role,
      to: original.from,
      type: 'response',
      payload,
      timestamp: new Date(),
      correlationId: original.correlationId,
    };
  }

  protected createEvent(
    to: AgentRole | 'orchestrator',
    payload: Record<string, unknown>,
  ): AgentMessage {
    return {
      from: this.config.role,
      to,
      type: 'event',
      payload,
      timestamp: new Date(),
      correlationId: crypto.randomUUID(),
    };
  }

  protected log(message: string): void {
    console.log(`[${this.config.name}] ${message}`);
  }
}
