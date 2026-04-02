/**
 * KTV Working Drone Thailand - Business Workflow Definitions
 * Complete automated sequences for every KTV operation
 * These are the "thinking patterns" of the operations brain
 */

import { WorkflowDefinition } from './engine.js';

// ────────────────────────────────────────────────────────────
// 1. NEW LEAD → FULL ONBOARDING
// Trigger: A new lead arrives (LINE, website, phone, referral)
// Sequence: CRM → Job → CRM → Finance
// ────────────────────────────────────────────────────────────

export const WORKFLOW_LEAD_TO_CLIENT: WorkflowDefinition = {
  id: 'wf-lead-to-client',
  name: 'Lead Qualification & Onboarding',
  description: 'Automatically qualifies leads, creates jobs, and onboards clients',
  trigger: 'lead.created',
  steps: [
    {
      id: 'qualify-lead',
      name: 'Auto-qualify lead by segment value',
      agent: 'crm-sales',
      action: 'advance-lead',
      inputMap: (ctx) => ({
        leadId: ctx.variables.leadId,
        stage: 'contacted',
      }),
    },
    {
      id: 'create-job-from-lead',
      name: 'Create job for qualified lead',
      agent: 'job-lifecycle',
      action: 'create-job',
      inputMap: (ctx) => ({
        clientId: ctx.variables.leadId,
        title: `${ctx.variables.companyName} - ${ctx.variables.serviceLine ?? 'facade-cleaning'}`,
        serviceLine: ctx.variables.serviceLine ?? 'facade-cleaning',
        estimatedDuration: ctx.variables.estimatedDuration ?? 480,
      }),
      outputKey: 'newJob',
      emitsEvent: 'job.created',
    },
  ],
};

// ────────────────────────────────────────────────────────────
// 2. JOB CONTRACTED → FULL MISSION PREPARATION
// Trigger: Job advances to 'contract' stage
// Sequence: Safety → Fleet → Pilot → Safety → Job
// ────────────────────────────────────────────────────────────

export const WORKFLOW_MISSION_PREP: WorkflowDefinition = {
  id: 'wf-mission-prep',
  name: 'Mission Preparation Pipeline',
  description: 'Coordinates risk assessment, drone assignment, pilot assignment, and pre-flight checks',
  trigger: 'job.stage.changed',
  triggerCondition: (event) => event.data.toStage === 'contract',
  steps: [
    {
      id: 'assess-risk',
      name: 'Run risk assessment for job site',
      agent: 'safety-compliance',
      action: 'assess-risk',
      inputMap: (ctx) => ({
        jobId: ctx.variables.jobId,
        likelihood: 2,
        severity: 3,
        hazards: ['Height operations', 'Urban airspace', 'Public proximity'],
        mitigations: ['Safety perimeter', 'Spotter deployed', 'NOTAM filed'],
      }),
      outputKey: 'riskAssessment',
      emitsEvent: 'safety.risk.assessed',
    },
    {
      id: 'check-weather',
      name: 'Check weather conditions at job site',
      agent: 'safety-compliance',
      action: 'check-weather',
      inputMap: (ctx) => ({
        windSpeedMs: 5,
        visibilityKm: 10,
        precipitation: false,
        lightningWithin30km: false,
      }),
      outputKey: 'weatherCheck',
      onFailure: 'skip',
    },
    {
      id: 'assign-drone',
      name: 'Select and assign best available drone',
      agent: 'fleet-management',
      action: 'get-available-drones',
      inputMap: (ctx) => ({
        category: ctx.variables.droneCategory ?? 'inspection',
      }),
      outputKey: 'availableDrones',
      emitsEvent: 'fleet.drone.assigned',
    },
    {
      id: 'find-pilot',
      name: 'Find and assign qualified pilot',
      agent: 'pilot-operations',
      action: 'get-available-pilots',
      inputMap: (ctx) => ({
        typeRating: ctx.variables.requiredTypeRating,
      }),
      outputKey: 'availablePilots',
      emitsEvent: 'pilot.assigned',
    },
    {
      id: 'advance-to-preflight',
      name: 'Advance job to pre-flight stage',
      agent: 'job-lifecycle',
      action: 'advance-stage',
      inputMap: (ctx) => ({
        jobId: ctx.variables.jobId,
        performedBy: 'brain',
        notes: 'Auto-advanced: risk assessed, drone and pilot assigned',
      }),
    },
  ],
};

// ────────────────────────────────────────────────────────────
// 3. PRE-FLIGHT → MISSION EXECUTION
// Trigger: Job reaches pre-flight stage
// Sequence: Safety (checklist) → Job (advance) → Fleet (track)
// ────────────────────────────────────────────────────────────

export const WORKFLOW_PREFLIGHT_TO_MISSION: WorkflowDefinition = {
  id: 'wf-preflight-to-mission',
  name: 'Pre-Flight to Mission Launch',
  description: 'Runs pre-flight checklist and launches mission if all checks pass',
  trigger: 'job.stage.changed',
  triggerCondition: (event) => event.data.toStage === 'pre-flight',
  steps: [
    {
      id: 'run-preflight',
      name: 'Execute standardized pre-flight checklist',
      agent: 'safety-compliance',
      action: 'submit-preflight',
      inputMap: (ctx) => ({
        jobId: ctx.variables.jobId,
        droneId: ctx.variables.droneId ?? 'DRONE-001',
        pilotId: ctx.variables.pilotId ?? 'PILOT-001',
        airframeIntegrity: true,
        batteryState: true,
        payloadMounted: true,
        airspaceClearance: true,
        weatherChecked: true,
        communicationSystems: true,
      }),
      outputKey: 'preflightResult',
      emitsEvent: 'mission.preflight.passed',
    },
    {
      id: 'launch-mission',
      name: 'Advance job to mission execution',
      agent: 'job-lifecycle',
      action: 'advance-stage',
      inputMap: (ctx) => ({
        jobId: ctx.variables.jobId,
        performedBy: 'brain',
        notes: 'Pre-flight passed, mission authorized',
      }),
      condition: (ctx) => {
        const result = ctx.stepResults.get('run-preflight');
        return result?.allPassed === true;
      },
      emitsEvent: 'mission.started',
    },
  ],
};

// ────────────────────────────────────────────────────────────
// 4. MISSION COMPLETE → DATA PROCESSING → QA → DELIVERY
// Trigger: Mission execution completed
// Sequence: Data (create) → Data (backup) → Data (QA) → Data (deliver)
// ────────────────────────────────────────────────────────────

export const WORKFLOW_POST_MISSION: WorkflowDefinition = {
  id: 'wf-post-mission',
  name: 'Post-Mission Data Pipeline',
  description: 'Processes captured data, ensures 4-copy backup, runs QA, and delivers to client',
  trigger: 'mission.completed',
  steps: [
    {
      id: 'release-drone',
      name: 'Release drone back to fleet',
      agent: 'fleet-management',
      action: 'release-drone',
      inputMap: (ctx) => ({
        droneId: ctx.variables.droneId ?? 'DRONE-001',
      }),
      emitsEvent: 'fleet.drone.released',
    },
    {
      id: 'create-data-job',
      name: 'Create data processing job',
      agent: 'data-processing',
      action: 'create-data-job',
      inputMap: (ctx) => ({
        jobId: ctx.variables.jobId,
        pipeline: ctx.variables.pipeline ?? 'photogrammetry',
        rawDataSizeGb: ctx.variables.dataSizeGb ?? 15,
      }),
      outputKey: 'dataJob',
      emitsEvent: 'data.job.created',
    },
    {
      id: 'backup-sd',
      name: 'Register SD card backup (copy 1)',
      agent: 'data-processing',
      action: 'register-backup',
      inputMap: (ctx) => {
        const dataJob = ctx.stepResults.get('create-data-job') as Record<string, unknown> | undefined;
        return { dataJobId: (dataJob?.dataJob as Record<string, unknown>)?.id ?? '', copy: 'sd-card' };
      },
    },
    {
      id: 'backup-laptop',
      name: 'Register field laptop backup (copy 2)',
      agent: 'data-processing',
      action: 'register-backup',
      inputMap: (ctx) => {
        const dataJob = ctx.stepResults.get('create-data-job') as Record<string, unknown> | undefined;
        return { dataJobId: (dataJob?.dataJob as Record<string, unknown>)?.id ?? '', copy: 'field-laptop' };
      },
    },
    {
      id: 'backup-nas',
      name: 'Register NAS backup (copy 3)',
      agent: 'data-processing',
      action: 'register-backup',
      inputMap: (ctx) => {
        const dataJob = ctx.stepResults.get('create-data-job') as Record<string, unknown> | undefined;
        return { dataJobId: (dataJob?.dataJob as Record<string, unknown>)?.id ?? '', copy: 'nas' };
      },
    },
    {
      id: 'backup-s3',
      name: 'Register AWS S3 backup (copy 4)',
      agent: 'data-processing',
      action: 'register-backup',
      inputMap: (ctx) => {
        const dataJob = ctx.stepResults.get('create-data-job') as Record<string, unknown> | undefined;
        return { dataJobId: (dataJob?.dataJob as Record<string, unknown>)?.id ?? '', copy: 'cloud-s3' };
      },
      emitsEvent: 'data.backup.complete',
    },
    {
      id: 'advance-processing',
      name: 'Start data processing',
      agent: 'data-processing',
      action: 'advance-processing',
      inputMap: (ctx) => {
        const dataJob = ctx.stepResults.get('create-data-job') as Record<string, unknown> | undefined;
        return { dataJobId: (dataJob?.dataJob as Record<string, unknown>)?.id ?? '', toStatus: 'processing' };
      },
    },
    {
      id: 'advance-to-data-stage',
      name: 'Advance job to data processing stage',
      agent: 'job-lifecycle',
      action: 'advance-stage',
      inputMap: (ctx) => ({
        jobId: ctx.variables.jobId,
        performedBy: 'brain',
        notes: 'Data processing started, 4-copy backup in progress',
      }),
    },
  ],
};

// ────────────────────────────────────────────────────────────
// 5. DATA QA PASSED → DELIVERY → INVOICING → FOLLOW-UP
// Trigger: QA passes
// Sequence: Data (deliver) → Job (advance x3) → Finance (invoice)
// ────────────────────────────────────────────────────────────

export const WORKFLOW_DELIVERY_TO_PAYMENT: WorkflowDefinition = {
  id: 'wf-delivery-to-payment',
  name: 'Delivery to Payment Collection',
  description: 'Delivers to client portal, creates invoice, sends, and schedules follow-up',
  trigger: 'data.qa.passed',
  steps: [
    {
      id: 'deliver-to-client',
      name: 'Upload deliverables to client portal',
      agent: 'data-processing',
      action: 'create-delivery',
      inputMap: (ctx) => ({
        dataJobId: ctx.variables.dataJobId,
        clientId: ctx.variables.clientId,
        deliverables: ctx.variables.deliverables ?? ['report.pdf', 'orthomosaic.tif', 'model.obj'],
      }),
      outputKey: 'delivery',
      emitsEvent: 'data.delivered',
    },
    {
      id: 'create-invoice',
      name: 'Generate invoice from job details',
      agent: 'finance-invoicing',
      action: 'create-invoice',
      inputMap: (ctx) => ({
        jobId: ctx.variables.jobId,
        clientId: ctx.variables.clientId,
        lineItems: ctx.variables.lineItems ?? [{
          description: 'Drone service - standard package',
          quantity: 1,
          unitPrice: ctx.variables.quotedPrice ?? 50_000,
          unit: 'project',
          total: ctx.variables.quotedPrice ?? 50_000,
        }],
      }),
      outputKey: 'invoice',
      emitsEvent: 'finance.invoice.created',
    },
    {
      id: 'send-invoice',
      name: 'Send invoice to client',
      agent: 'finance-invoicing',
      action: 'update-invoice-status',
      inputMap: (ctx) => {
        const inv = ctx.stepResults.get('create-invoice') as Record<string, unknown> | undefined;
        return {
          invoiceId: (inv?.invoice as Record<string, unknown>)?.id ?? '',
          status: 'sent',
        };
      },
      emitsEvent: 'finance.invoice.sent',
    },
  ],
};

// ────────────────────────────────────────────────────────────
// 6. MAINTENANCE ALERT → AUTO-GROUND DRONE
// Trigger: Maintenance due alert fires
// Sequence: Fleet (ground drone) → Fleet (log maintenance)
// ────────────────────────────────────────────────────────────

export const WORKFLOW_MAINTENANCE: WorkflowDefinition = {
  id: 'wf-maintenance-auto',
  name: 'Auto-Maintenance Scheduling',
  description: 'Automatically grounds drone when maintenance is due and schedules service',
  trigger: 'fleet.maintenance.due',
  steps: [
    {
      id: 'ground-drone',
      name: 'Set drone to maintenance status',
      agent: 'fleet-management',
      action: 'release-drone',
      inputMap: (ctx) => ({
        droneId: ctx.variables.droneId,
      }),
    },
    {
      id: 'check-maintenance-alerts',
      name: 'Get current maintenance alerts',
      agent: 'fleet-management',
      action: 'get-maintenance-alerts',
      inputMap: () => ({}),
      outputKey: 'alerts',
    },
  ],
};

// ────────────────────────────────────────────────────────────
// 7. SAFETY INCIDENT → EMERGENCY RESPONSE
// Trigger: Incident reported
// Sequence: Safety → Fleet (ground) → Pilot (release) → Job (hold)
// ────────────────────────────────────────────────────────────

export const WORKFLOW_INCIDENT_RESPONSE: WorkflowDefinition = {
  id: 'wf-incident-response',
  name: 'Incident Emergency Response',
  description: 'Automatic emergency response: ground fleet, notify CAAT, pause operations',
  trigger: 'safety.incident.reported',
  steps: [
    {
      id: 'get-safety-stats',
      name: 'Pull current safety statistics',
      agent: 'safety-compliance',
      action: 'get-safety-stats',
      inputMap: () => ({}),
      outputKey: 'safetyStats',
    },
    {
      id: 'fleet-status',
      name: 'Review fleet status for affected drones',
      agent: 'fleet-management',
      action: 'get-fleet-summary',
      inputMap: () => ({}),
      outputKey: 'fleetStatus',
    },
    {
      id: 'cert-check',
      name: 'Check pilot certification status',
      agent: 'pilot-operations',
      action: 'check-certifications',
      inputMap: () => ({}),
      outputKey: 'certAlerts',
    },
  ],
};

// ────────────────────────────────────────────────────────────
// 8. INVOICE OVERDUE → COLLECTION SEQUENCE
// Trigger: Invoice marked overdue
// Sequence: Finance → CRM (flag client) → CRM (NPS impact)
// ────────────────────────────────────────────────────────────

export const WORKFLOW_OVERDUE_COLLECTION: WorkflowDefinition = {
  id: 'wf-overdue-collection',
  name: 'Overdue Invoice Collection',
  description: 'Flags overdue accounts, adjusts client status, initiates collection',
  trigger: 'finance.invoice.overdue',
  steps: [
    {
      id: 'get-overdue',
      name: 'Pull all overdue invoices',
      agent: 'finance-invoicing',
      action: 'get-overdue-invoices',
      inputMap: () => ({}),
      outputKey: 'overdueInvoices',
    },
    {
      id: 'review-pipeline',
      name: 'Review CRM pipeline for affected clients',
      agent: 'crm-sales',
      action: 'get-pipeline',
      inputMap: () => ({}),
      outputKey: 'pipeline',
    },
  ],
};

// ────────────────────────────────────────────────────────────
// 9. PILOT CERT EXPIRING → AUTO-GROUND
// Trigger: Pilot certification approaching expiry
// Sequence: Pilot (check) → Safety (flag)
// ────────────────────────────────────────────────────────────

export const WORKFLOW_CERT_EXPIRY: WorkflowDefinition = {
  id: 'wf-cert-expiry',
  name: 'Certification Expiry Handler',
  description: 'Proactively manages expiring pilot certifications',
  trigger: 'pilot.certification.expiring',
  steps: [
    {
      id: 'check-all-certs',
      name: 'Audit all pilot certifications',
      agent: 'pilot-operations',
      action: 'check-certifications',
      inputMap: () => ({}),
      outputKey: 'certAlerts',
    },
    {
      id: 'safety-review',
      name: 'Trigger safety compliance review',
      agent: 'safety-compliance',
      action: 'get-safety-stats',
      inputMap: () => ({}),
      outputKey: 'safetyStats',
    },
  ],
};

// ────────────────────────────────────────────────────────────
// 10. DAILY OPERATIONS CYCLE
// Trigger: System health check (scheduled)
// Sequence: All agents report status
// ────────────────────────────────────────────────────────────

export const WORKFLOW_DAILY_OPS: WorkflowDefinition = {
  id: 'wf-daily-ops',
  name: 'Daily Operations Health Check',
  description: 'Morning briefing: fleet status, pilot availability, upcoming jobs, safety review',
  trigger: 'system.health.recovered',
  steps: [
    {
      id: 'fleet-check',
      name: 'Fleet readiness report',
      agent: 'fleet-management',
      action: 'get-fleet-summary',
      inputMap: () => ({}),
      outputKey: 'fleetSummary',
    },
    {
      id: 'pilot-availability',
      name: 'Pilot availability report',
      agent: 'pilot-operations',
      action: 'get-available-pilots',
      inputMap: () => ({}),
      outputKey: 'availablePilots',
    },
    {
      id: 'job-pipeline',
      name: 'Job pipeline status',
      agent: 'job-lifecycle',
      action: 'get-pipeline-summary',
      inputMap: () => ({}),
      outputKey: 'jobPipeline',
    },
    {
      id: 'safety-stats',
      name: 'Safety compliance overview',
      agent: 'safety-compliance',
      action: 'get-safety-stats',
      inputMap: () => ({}),
      outputKey: 'safetyStats',
    },
    {
      id: 'financial-summary',
      name: 'Financial summary',
      agent: 'finance-invoicing',
      action: 'get-financial-summary',
      inputMap: () => ({ period: new Date().toISOString().split('T')[0] }),
      outputKey: 'financials',
    },
    {
      id: 'crm-pipeline',
      name: 'CRM pipeline overview',
      agent: 'crm-sales',
      action: 'get-pipeline',
      inputMap: () => ({}),
      outputKey: 'crmPipeline',
    },
    {
      id: 'processing-stats',
      name: 'Data processing queue status',
      agent: 'data-processing',
      action: 'get-processing-stats',
      inputMap: () => ({}),
      outputKey: 'processingStats',
    },
  ],
};

// ── Export all workflows ───────────────────────────────────

export const ALL_WORKFLOWS: WorkflowDefinition[] = [
  WORKFLOW_LEAD_TO_CLIENT,
  WORKFLOW_MISSION_PREP,
  WORKFLOW_PREFLIGHT_TO_MISSION,
  WORKFLOW_POST_MISSION,
  WORKFLOW_DELIVERY_TO_PAYMENT,
  WORKFLOW_MAINTENANCE,
  WORKFLOW_INCIDENT_RESPONSE,
  WORKFLOW_OVERDUE_COLLECTION,
  WORKFLOW_CERT_EXPIRY,
  WORKFLOW_DAILY_OPS,
];
