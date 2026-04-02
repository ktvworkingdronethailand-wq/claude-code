/**
 * KTV Working Drone Thailand - Agent Type Definitions
 * Core interfaces for all operational AI agents
 */

// ─── Agent Framework ───────────────────────────────────────

export type AgentRole =
  | 'fleet-management'
  | 'job-lifecycle'
  | 'crm-sales'
  | 'safety-compliance'
  | 'finance-invoicing'
  | 'pilot-operations'
  | 'data-processing';

export type AgentStatus = 'idle' | 'active' | 'processing' | 'error' | 'offline';

export interface AgentMessage {
  from: AgentRole;
  to: AgentRole | 'orchestrator';
  type: 'command' | 'event' | 'query' | 'response';
  payload: Record<string, unknown>;
  timestamp: Date;
  correlationId: string;
}

export interface AgentConfig {
  role: AgentRole;
  name: string;
  description: string;
  dependencies: AgentRole[];
  pollIntervalMs: number;
}

export interface BaseAgent {
  config: AgentConfig;
  status: AgentStatus;
  start(): Promise<void>;
  stop(): Promise<void>;
  handleMessage(message: AgentMessage): Promise<AgentMessage | null>;
  getHealth(): AgentHealth;
}

export interface AgentHealth {
  role: AgentRole;
  status: AgentStatus;
  uptime: number;
  lastActivity: Date;
  errorCount: number;
  tasksPending: number;
  tasksCompleted: number;
}

// ─── Fleet Management ──────────────────────────────────────

export type DroneCategory = 'agricultural' | 'survey' | 'inspection' | 'media' | 'facade-cleaning';
export type DroneStatus = 'available' | 'in-flight' | 'maintenance' | 'charging' | 'retired';
export type BatteryHealth = 'good' | 'training-only' | 'retired';

export interface Drone {
  id: string;
  model: string;
  serialNumber: string;
  category: DroneCategory;
  status: DroneStatus;
  flightHours: number;
  purchaseDate: Date;
  lastMaintenance: Date;
  nextMaintenanceDue: number; // flight hours
  location: GeoLocation;
}

export interface Battery {
  id: string;
  serialNumber: string;
  compatibleModels: string[];
  healthPercent: number;
  healthStatus: BatteryHealth;
  cycleCount: number;
  lastUsed: Date;
}

export interface Payload {
  id: string;
  name: string;
  type: 'camera' | 'thermal' | 'lidar' | 'multispectral' | 'sprayer';
  compatibleAirframes: string[];
  lastCalibration: Date;
  calibrationIntervalDays: number;
}

export interface MaintenanceRecord {
  id: string;
  droneId: string;
  type: 'pre-flight' | 'post-flight' | '50-hour' | '200-hour';
  date: Date;
  technician: string;
  findings: string;
  actionsPerformed: string[];
  partsReplaced: string[];
  nextDue: Date;
}

export interface FleetSummary {
  totalDrones: number;
  available: number;
  inFlight: number;
  inMaintenance: number;
  totalFlightHours: number;
  maintenanceAlerts: MaintenanceAlert[];
}

export interface MaintenanceAlert {
  droneId: string;
  model: string;
  type: '50-hour' | '200-hour';
  hoursRemaining: number;
  urgency: 'low' | 'medium' | 'high';
}

// ─── Job Lifecycle ─────────────────────────────────────────

export type JobStage =
  | 'lead-capture' | 'qualification' | 'site-assessment'
  | 'flight-planning' | 'quotation' | 'contract'
  | 'pre-flight' | 'mission-execution' | 'data-processing'
  | 'quality-assurance' | 'delivery' | 'invoicing' | 'follow-up';

export type ServiceLine =
  | 'facade-cleaning' | 'building-inspection'
  | 'agricultural-spraying' | 'survey-mapping'
  | 'media-production' | 'training-academy';

export interface Job {
  id: string;
  clientId: string;
  serviceLine: ServiceLine;
  stage: JobStage;
  title: string;
  description: string;
  siteLocation: GeoLocation;
  assignedPilots: string[];
  assignedDrones: string[];
  scheduledDate: Date;
  estimatedDuration: number; // minutes
  quotedPrice: number; // THB
  createdAt: Date;
  updatedAt: Date;
}

export interface JobTransition {
  jobId: string;
  fromStage: JobStage;
  toStage: JobStage;
  timestamp: Date;
  performedBy: string;
  notes: string;
}

// ─── CRM & Sales ──────────────────────────────────────────

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal-sent' | 'negotiation' | 'won' | 'lost';
export type CustomerSegment =
  | 'small-farm' | 'large-agribusiness' | 'construction'
  | 'real-estate' | 'government' | 'tourism' | 'insurance';
export type PricingTier = 'standard' | 'professional' | 'enterprise';

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  lineId?: string;
  segment: CustomerSegment;
  stage: LeadStage;
  source: 'line' | 'website' | 'phone' | 'referral' | 'event';
  estimatedValue: number; // THB
  notes: string;
  createdAt: Date;
  lastContactedAt: Date;
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  lineId?: string;
  segment: CustomerSegment;
  pricingTier: PricingTier;
  npsScore?: number;
  totalRevenue: number;
  jobCount: number;
  isRecurring: boolean;
  contractEndDate?: Date;
  onboardedAt: Date;
}

// ─── Safety & Compliance ───────────────────────────────────

export type RiskLevel = 'acceptable' | 'moderate' | 'high' | 'unacceptable';
export type WeatherStatus = 'go' | 'no-go' | 'marginal';
export type IncidentSeverity = 'near-miss' | 'minor' | 'moderate' | 'serious' | 'critical';

export interface RiskAssessment {
  id: string;
  jobId: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  severity: 1 | 2 | 3 | 4 | 5;
  riskScore: number;
  riskLevel: RiskLevel;
  hazards: string[];
  mitigations: string[];
  approvedBy?: string;
  date: Date;
}

export interface WeatherCheck {
  location: GeoLocation;
  timestamp: Date;
  windSpeedMs: number;
  visibilityKm: number;
  precipitation: boolean;
  temperatureC: number;
  lightningWithin30km: boolean;
  status: WeatherStatus;
  reason?: string;
}

export interface PreFlightChecklist {
  id: string;
  jobId: string;
  droneId: string;
  pilotId: string;
  airframeIntegrity: boolean;
  batteryState: boolean;
  payloadMounted: boolean;
  airspaceClearance: boolean;
  weatherChecked: boolean;
  communicationSystems: boolean;
  allPassed: boolean;
  completedAt: Date;
}

export interface IncidentReport {
  id: string;
  jobId?: string;
  droneId?: string;
  pilotId?: string;
  severity: IncidentSeverity;
  type: 'flyaway' | 'crash' | 'injury' | 'battery-fire' | 'near-miss' | 'equipment-failure';
  description: string;
  immediateActions: string[];
  caatNotified: boolean;
  reportedAt: Date;
  resolvedAt?: Date;
}

// ─── Finance & Invoicing ───────────────────────────────────

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type Currency = 'THB' | 'USD';

export interface Invoice {
  id: string;
  jobId: string;
  clientId: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  vatPercent: number;
  vatAmount: number;
  total: number;
  currency: Currency;
  status: InvoiceStatus;
  issuedAt: Date;
  dueDate: Date;
  paidAt?: Date;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  total: number;
}

export interface FinancialSummary {
  period: string;
  grossRevenue: number;
  operatingCosts: number;
  royaltyPayment: number; // 7% to KTV Group
  ebitda: number;
  ebitdaMargin: number;
  corporateTax: number; // 20%
  netIncome: number;
  netMargin: number;
  currency: Currency;
}

// ─── Pilot Operations ──────────────────────────────────────

export type PilotStatus = 'available' | 'on-mission' | 'training' | 'off-duty' | 'medical-leave';

export interface Pilot {
  id: string;
  name: string;
  caatLicenseNumber: string;
  caatLicenseExpiry: Date;
  medicalCertExpiry: Date;
  typeRatings: string[];
  status: PilotStatus;
  flightHoursTotal: number;
  flightHoursMonth: number;
  flightHoursToday: number;
  maxDailyHours: number; // 8
  maxMonthlyHours: number; // 80
  performanceScore?: number;
  hiredAt: Date;
}

export interface PilotSchedule {
  pilotId: string;
  date: Date;
  assignments: PilotAssignment[];
  totalHoursScheduled: number;
}

export interface PilotAssignment {
  jobId: string;
  startTime: Date;
  endTime: Date;
  droneId: string;
  location: GeoLocation;
}

// ─── Data Processing ───────────────────────────────────────

export type ProcessingPipeline = 'photogrammetry' | 'ndvi' | 'video' | 'thermal' | 'lidar';
export type ProcessingStatus = 'queued' | 'ingesting' | 'processing' | 'qa-review' | 'complete' | 'failed';
export type BackupCopy = 'sd-card' | 'field-laptop' | 'nas' | 'cloud-s3';

export interface DataJob {
  id: string;
  jobId: string;
  pipeline: ProcessingPipeline;
  status: ProcessingStatus;
  rawDataSizeGb: number;
  outputSizeGb: number;
  backupCopies: BackupCopy[];
  qaPassed?: boolean;
  qaReviewer?: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface DeliveryRecord {
  id: string;
  dataJobId: string;
  clientId: string;
  portalUrl: string;
  deliverables: string[];
  deliveredAt: Date;
  downloadedByClient: boolean;
  archiveExpiresAt: Date; // 12 months minimum
}

// ─── Shared Types ──────────────────────────────────────────

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  province?: string;
}

export interface AuditEntry {
  timestamp: Date;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, { before: unknown; after: unknown }>;
}
