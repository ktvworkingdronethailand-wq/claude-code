/**
 * KTV Working Drone Thailand - Job Lifecycle Agent
 * Manages the 13-stage job lifecycle from lead capture to follow-up
 */

import { KtvAgent } from './base-agent.js';
import {
  AgentMessage,
  Job,
  JobStage,
  JobTransition,
  ServiceLine,
} from '../types/index.js';

const STAGE_ORDER: JobStage[] = [
  'lead-capture', 'qualification', 'site-assessment',
  'flight-planning', 'quotation', 'contract',
  'pre-flight', 'mission-execution', 'data-processing',
  'quality-assurance', 'delivery', 'invoicing', 'follow-up',
];

export class JobLifecycleAgent extends KtvAgent {
  private jobs: Map<string, Job> = new Map();
  private transitions: JobTransition[] = [];

  constructor() {
    super({
      role: 'job-lifecycle',
      name: 'KTV Job Manager',
      description: 'Manages 13-stage job lifecycle for KTV Working Drone Thailand operations',
      dependencies: ['fleet-management', 'pilot-operations', 'safety-compliance'],
      pollIntervalMs: 15_000,
    });
  }

  protected async onStart(): Promise<void> {
    this.log('Job lifecycle system initialized');
  }

  protected async onStop(): Promise<void> {
    this.log('Job lifecycle system shutting down');
  }

  protected async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const { action } = message.payload as { action: string };

    switch (action) {
      case 'create-job':
        return this.createResponse(message, {
          job: this.createJob(message.payload as Partial<Job>),
        });

      case 'advance-stage':
        return this.createResponse(message, {
          success: this.advanceStage(
            message.payload.jobId as string,
            message.payload.performedBy as string,
            message.payload.notes as string,
          ),
        });

      case 'get-job':
        return this.createResponse(message, {
          job: this.jobs.get(message.payload.jobId as string) ?? null,
        });

      case 'get-jobs-by-stage':
        return this.createResponse(message, {
          jobs: this.getJobsByStage(message.payload.stage as JobStage),
        });

      case 'get-jobs-by-service':
        return this.createResponse(message, {
          jobs: this.getJobsByService(message.payload.serviceLine as ServiceLine),
        });

      case 'get-pipeline-summary':
        return this.createResponse(message, {
          summary: this.getPipelineSummary(),
        });

      default:
        return this.createResponse(message, { error: `Unknown action: ${action}` });
    }
  }

  // ── Job Operations ───────────────────────────────────────

  createJob(data: Partial<Job>): Job {
    const id = `JOB-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date();
    const job: Job = {
      id,
      clientId: data.clientId ?? '',
      serviceLine: data.serviceLine ?? 'facade-cleaning',
      stage: 'lead-capture',
      title: data.title ?? '',
      description: data.description ?? '',
      siteLocation: data.siteLocation ?? { latitude: 0, longitude: 0 },
      assignedPilots: [],
      assignedDrones: [],
      scheduledDate: data.scheduledDate ?? now,
      estimatedDuration: data.estimatedDuration ?? 0,
      quotedPrice: data.quotedPrice ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(id, job);
    this.log(`Job created: ${id} - ${job.title} (${job.serviceLine})`);
    return job;
  }

  advanceStage(jobId: string, performedBy: string, notes: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    const currentIndex = STAGE_ORDER.indexOf(job.stage);
    if (currentIndex >= STAGE_ORDER.length - 1) return false;

    const fromStage = job.stage;
    const toStage = STAGE_ORDER[currentIndex + 1];

    const transition: JobTransition = {
      jobId,
      fromStage,
      toStage,
      timestamp: new Date(),
      performedBy,
      notes,
    };

    job.stage = toStage;
    job.updatedAt = new Date();
    this.transitions.push(transition);

    this.log(`Job ${jobId}: ${fromStage} -> ${toStage}`);

    // Emit events for dependent agents
    if (toStage === 'pre-flight') {
      this.createEvent('safety-compliance', {
        event: 'pre-flight-required',
        jobId,
      });
    } else if (toStage === 'mission-execution') {
      this.createEvent('fleet-management', {
        event: 'mission-starting',
        jobId,
        drones: job.assignedDrones,
      });
    } else if (toStage === 'data-processing') {
      this.createEvent('data-processing', {
        event: 'data-ready',
        jobId,
      });
    } else if (toStage === 'invoicing') {
      this.createEvent('finance-invoicing', {
        event: 'invoice-required',
        jobId,
        clientId: job.clientId,
        amount: job.quotedPrice,
      });
    }

    return true;
  }

  getJobsByStage(stage: JobStage): Job[] {
    return Array.from(this.jobs.values()).filter(j => j.stage === stage);
  }

  getJobsByService(serviceLine: ServiceLine): Job[] {
    return Array.from(this.jobs.values()).filter(j => j.serviceLine === serviceLine);
  }

  getPipelineSummary(): Record<JobStage, number> {
    const summary = {} as Record<JobStage, number>;
    for (const stage of STAGE_ORDER) {
      summary[stage] = this.getJobsByStage(stage).length;
    }
    return summary;
  }

  getJobHistory(jobId: string): JobTransition[] {
    return this.transitions.filter(t => t.jobId === jobId);
  }
}
