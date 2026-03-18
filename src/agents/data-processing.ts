/**
 * KTV Working Drone Thailand - Data Processing Agent
 * Manages data pipelines, backup protocol, QA review, and client delivery
 * Implements 4-copy backup rule and processing pipelines
 */

import { KtvAgent } from './base-agent.js';
import {
  AgentMessage,
  BackupCopy,
  DataJob,
  DeliveryRecord,
  ProcessingPipeline,
  ProcessingStatus,
} from '../types/index.js';

/** Required backup copies per the 4-copy rule */
const REQUIRED_BACKUPS: BackupCopy[] = ['sd-card', 'field-laptop', 'nas', 'cloud-s3'];

/** Minimum archive retention in days (12 months) */
const ARCHIVE_RETENTION_DAYS = 365;

export class DataProcessingAgent extends KtvAgent {
  private dataJobs: Map<string, DataJob> = new Map();
  private deliveries: Map<string, DeliveryRecord> = new Map();

  constructor() {
    super({
      role: 'data-processing',
      name: 'KTV Data Processing',
      description: 'Data pipeline management, backup protocol, QA, and client delivery for KTV Working Drone Thailand',
      dependencies: ['job-lifecycle'],
      pollIntervalMs: 30_000,
    });
  }

  protected async onStart(): Promise<void> {
    this.log('Data Processing system initialized');
    this.log(`Backup rule: ${REQUIRED_BACKUPS.length}-copy (${REQUIRED_BACKUPS.join(', ')})`);
  }

  protected async onStop(): Promise<void> {
    this.log('Data Processing system shutting down');
  }

  protected async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const { action } = message.payload as { action: string };

    switch (action) {
      case 'create-data-job':
        return this.createResponse(message, {
          dataJob: this.createDataJob(
            message.payload.jobId as string,
            message.payload.pipeline as ProcessingPipeline,
            message.payload.rawDataSizeGb as number,
          ),
        });

      case 'advance-processing':
        return this.createResponse(message, {
          success: this.advanceProcessing(
            message.payload.dataJobId as string,
            message.payload.toStatus as ProcessingStatus,
          ),
        });

      case 'register-backup':
        return this.createResponse(message, {
          success: this.registerBackup(
            message.payload.dataJobId as string,
            message.payload.copy as BackupCopy,
          ),
        });

      case 'check-backup-compliance':
        return this.createResponse(message, {
          compliance: this.checkBackupCompliance(message.payload.dataJobId as string),
        });

      case 'submit-qa':
        return this.createResponse(message, {
          result: this.submitQaReview(
            message.payload.dataJobId as string,
            message.payload.passed as boolean,
            message.payload.reviewer as string,
          ),
        });

      case 'create-delivery':
        return this.createResponse(message, {
          delivery: this.createDelivery(
            message.payload.dataJobId as string,
            message.payload.clientId as string,
            message.payload.deliverables as string[],
          ),
        });

      case 'get-processing-stats':
        return this.createResponse(message, {
          stats: this.getProcessingStats(),
        });

      default:
        return this.createResponse(message, { error: `Unknown action: ${action}` });
    }
  }

  // ── Data Job Management ──────────────────────────────────

  createDataJob(jobId: string, pipeline: ProcessingPipeline, rawDataSizeGb: number): DataJob {
    const id = `DJOB-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const dataJob: DataJob = {
      id,
      jobId,
      pipeline,
      status: 'queued',
      rawDataSizeGb,
      outputSizeGb: 0,
      backupCopies: [],
      startedAt: new Date(),
    };

    this.dataJobs.set(id, dataJob);
    this.log(`Data job ${id} created: ${pipeline} pipeline, ${rawDataSizeGb} GB raw data`);
    return dataJob;
  }

  advanceProcessing(dataJobId: string, toStatus: ProcessingStatus): boolean {
    const job = this.dataJobs.get(dataJobId);
    if (!job) return false;

    const statusOrder: ProcessingStatus[] = ['queued', 'ingesting', 'processing', 'qa-review', 'complete'];
    const currentIdx = statusOrder.indexOf(job.status);
    const targetIdx = statusOrder.indexOf(toStatus);

    if (targetIdx <= currentIdx && toStatus !== 'failed') return false;

    job.status = toStatus;
    if (toStatus === 'complete') {
      job.completedAt = new Date();
    }

    this.log(`Data job ${dataJobId}: status -> ${toStatus}`);
    return true;
  }

  // ── Backup Protocol (4-Copy Rule) ────────────────────────

  registerBackup(dataJobId: string, copy: BackupCopy): boolean {
    const job = this.dataJobs.get(dataJobId);
    if (!job) return false;
    if (job.backupCopies.includes(copy)) return false;

    job.backupCopies.push(copy);
    this.log(`Backup registered for ${dataJobId}: ${copy} (${job.backupCopies.length}/${REQUIRED_BACKUPS.length})`);
    return true;
  }

  checkBackupCompliance(dataJobId: string): { compliant: boolean; copies: BackupCopy[]; missing: BackupCopy[] } {
    const job = this.dataJobs.get(dataJobId);
    if (!job) return { compliant: false, copies: [], missing: REQUIRED_BACKUPS };

    const missing = REQUIRED_BACKUPS.filter(b => !job.backupCopies.includes(b));
    return {
      compliant: missing.length === 0,
      copies: job.backupCopies,
      missing,
    };
  }

  // ── QA Review ────────────────────────────────────────────

  submitQaReview(dataJobId: string, passed: boolean, reviewer: string): { passed: boolean; dataJobId: string } {
    const job = this.dataJobs.get(dataJobId);
    if (!job) return { passed: false, dataJobId };

    job.qaPassed = passed;
    job.qaReviewer = reviewer;

    if (passed) {
      job.status = 'complete';
      job.completedAt = new Date();
      this.log(`QA PASSED for ${dataJobId} by ${reviewer}`);
    } else {
      job.status = 'processing'; // Send back for reprocessing
      this.log(`QA FAILED for ${dataJobId} by ${reviewer} - sent back for reprocessing`);
    }

    return { passed, dataJobId };
  }

  // ── Client Delivery ──────────────────────────────────────

  createDelivery(dataJobId: string, clientId: string, deliverables: string[]): DeliveryRecord | null {
    const job = this.dataJobs.get(dataJobId);
    if (!job || !job.qaPassed) {
      this.log(`Cannot create delivery: data job ${dataJobId} has not passed QA`);
      return null;
    }

    const id = `DEL-${Date.now()}`;
    const archiveExpiry = new Date();
    archiveExpiry.setDate(archiveExpiry.getDate() + ARCHIVE_RETENTION_DAYS);

    const delivery: DeliveryRecord = {
      id,
      dataJobId,
      clientId,
      portalUrl: `/portal/clients/${clientId}/deliveries/${id}`,
      deliverables,
      deliveredAt: new Date(),
      downloadedByClient: false,
      archiveExpiresAt: archiveExpiry,
    };

    this.deliveries.set(id, delivery);
    this.log(`Delivery ${id} created for client ${clientId}: ${deliverables.length} files`);

    // Notify job lifecycle
    this.createEvent('job-lifecycle', {
      event: 'delivery-complete',
      dataJobId,
      deliveryId: id,
    });

    return delivery;
  }

  // ── Stats ────────────────────────────────────────────────

  getProcessingStats(): {
    totalJobs: number;
    byStatus: Record<string, number>;
    byPipeline: Record<string, number>;
    totalDataProcessedGb: number;
    qaPassRate: number;
    backupComplianceRate: number;
  } {
    const jobs = Array.from(this.dataJobs.values());

    const byStatus: Record<string, number> = {};
    const byPipeline: Record<string, number> = {};

    for (const job of jobs) {
      byStatus[job.status] = (byStatus[job.status] ?? 0) + 1;
      byPipeline[job.pipeline] = (byPipeline[job.pipeline] ?? 0) + 1;
    }

    const qaReviewed = jobs.filter(j => j.qaPassed !== undefined);
    const qaPassRate = qaReviewed.length > 0
      ? qaReviewed.filter(j => j.qaPassed).length / qaReviewed.length
      : 1;

    const backupCompliant = jobs.filter(j => {
      const missing = REQUIRED_BACKUPS.filter(b => !j.backupCopies.includes(b));
      return missing.length === 0;
    }).length;

    return {
      totalJobs: jobs.length,
      byStatus,
      byPipeline,
      totalDataProcessedGb: jobs.reduce((sum, j) => sum + j.rawDataSizeGb, 0),
      qaPassRate,
      backupComplianceRate: jobs.length > 0 ? backupCompliant / jobs.length : 1,
    };
  }
}
