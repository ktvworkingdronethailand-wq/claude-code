/**
 * KTV Working Drone Thailand - External Systems Integration Hub
 * Connectors for Odoo ERP, AWS S3, DJI FlightHub, and client portal
 *
 * Abstracted interfaces that agents use to connect to real systems
 */

// ── Odoo ERP Connector ────────────────────────────────────

export interface OdooConfig {
  url: string;
  database: string;
  modules: ('crm' | 'invoicing' | 'inventory' | 'hr' | 'project')[];
}

export class OdooConnector {
  private config: OdooConfig;
  private syncLog: { module: string; timestamp: Date; records: number; status: string }[] = [];

  constructor(config?: Partial<OdooConfig>) {
    this.config = {
      url: config?.url ?? 'https://ktv-thailand.odoo.com',
      database: config?.database ?? 'ktv_production',
      modules: config?.modules ?? ['crm', 'invoicing', 'inventory', 'hr', 'project'],
    };
  }

  async syncContacts(contacts: { name: string; email: string; phone: string; company: string }[]): Promise<{ synced: number }> {
    this.logSync('crm', contacts.length, 'success');
    return { synced: contacts.length };
  }

  async syncInvoices(invoices: { id: string; clientName: string; amount: number; status: string }[]): Promise<{ synced: number }> {
    this.logSync('invoicing', invoices.length, 'success');
    return { synced: invoices.length };
  }

  async syncInventory(items: { name: string; quantity: number; location: string }[]): Promise<{ synced: number }> {
    this.logSync('inventory', items.length, 'success');
    return { synced: items.length };
  }

  async syncPilots(pilots: { name: string; license: string; status: string }[]): Promise<{ synced: number }> {
    this.logSync('hr', pilots.length, 'success');
    return { synced: pilots.length };
  }

  private logSync(module: string, records: number, status: string): void {
    this.syncLog.push({ module, timestamp: new Date(), records, status });
  }

  getSyncHistory(limit = 20): typeof this.syncLog {
    return this.syncLog.slice(-limit);
  }

  getConfig(): OdooConfig {
    return this.config;
  }
}

// ── AWS S3 Storage Connector ───────────────────────────────

export interface S3Config {
  region: string;
  buckets: {
    rawData: string;
    processed: string;
    deliverables: string;
    backups: string;
  };
}

export class S3Connector {
  private config: S3Config;
  private uploadLog: { bucket: string; key: string; sizeBytes: number; timestamp: Date }[] = [];

  constructor(config?: Partial<S3Config>) {
    this.config = {
      region: config?.region ?? 'ap-southeast-1', // Bangkok
      buckets: config?.buckets ?? {
        rawData: 'ktv-thailand-raw-data',
        processed: 'ktv-thailand-processed',
        deliverables: 'ktv-thailand-deliverables',
        backups: 'ktv-thailand-backups',
      },
    };
  }

  async uploadRawData(jobId: string, fileName: string, sizeBytes: number): Promise<{ url: string }> {
    const key = `raw/${jobId}/${fileName}`;
    this.uploadLog.push({ bucket: this.config.buckets.rawData, key, sizeBytes, timestamp: new Date() });
    return { url: `s3://${this.config.buckets.rawData}/${key}` };
  }

  async uploadProcessed(jobId: string, fileName: string, sizeBytes: number): Promise<{ url: string }> {
    const key = `processed/${jobId}/${fileName}`;
    this.uploadLog.push({ bucket: this.config.buckets.processed, key, sizeBytes, timestamp: new Date() });
    return { url: `s3://${this.config.buckets.processed}/${key}` };
  }

  async uploadDeliverable(clientId: string, jobId: string, fileName: string, sizeBytes: number): Promise<{ url: string }> {
    const key = `clients/${clientId}/${jobId}/${fileName}`;
    this.uploadLog.push({ bucket: this.config.buckets.deliverables, key, sizeBytes, timestamp: new Date() });
    return { url: `https://portal.ktv-drone.co.th/download/${clientId}/${jobId}/${fileName}` };
  }

  getStorageStats(): {
    totalUploads: number;
    totalBytes: number;
    byBucket: Record<string, { uploads: number; bytes: number }>;
  } {
    const byBucket: Record<string, { uploads: number; bytes: number }> = {};
    for (const log of this.uploadLog) {
      if (!byBucket[log.bucket]) byBucket[log.bucket] = { uploads: 0, bytes: 0 };
      byBucket[log.bucket].uploads++;
      byBucket[log.bucket].bytes += log.sizeBytes;
    }
    return {
      totalUploads: this.uploadLog.length,
      totalBytes: this.uploadLog.reduce((sum, l) => sum + l.sizeBytes, 0),
      byBucket,
    };
  }

  getConfig(): S3Config {
    return this.config;
  }
}

// ── DJI FlightHub Connector ────────────────────────────────

export interface FlightHubConfig {
  organizationId: string;
  apiEndpoint: string;
}

export class FlightHubConnector {
  private config: FlightHubConfig;
  private telemetryLog: { droneId: string; lat: number; lng: number; altM: number; timestamp: Date }[] = [];

  constructor(config?: Partial<FlightHubConfig>) {
    this.config = {
      organizationId: config?.organizationId ?? 'KTV-THAILAND-001',
      apiEndpoint: config?.apiEndpoint ?? 'https://flighthub.dji.com/api/v2',
    };
  }

  async syncFleetStatus(drones: { id: string; model: string; status: string }[]): Promise<{ synced: number }> {
    return { synced: drones.length };
  }

  async uploadFlightPlan(jobId: string, waypoints: { lat: number; lng: number; altM: number }[]): Promise<{ planId: string }> {
    return { planId: `FP-${jobId}-${Date.now()}` };
  }

  async recordTelemetry(droneId: string, lat: number, lng: number, altM: number): Promise<void> {
    this.telemetryLog.push({ droneId, lat, lng, altM, timestamp: new Date() });
  }

  getTelemetryHistory(droneId: string, limit = 100): typeof this.telemetryLog {
    return this.telemetryLog.filter(t => t.droneId === droneId).slice(-limit);
  }

  getConfig(): FlightHubConfig {
    return this.config;
  }
}

// ── Integration Hub ────────────────────────────────────────

export class IntegrationHub {
  readonly odoo: OdooConnector;
  readonly s3: S3Connector;
  readonly flightHub: FlightHubConnector;

  constructor() {
    this.odoo = new OdooConnector();
    this.s3 = new S3Connector();
    this.flightHub = new FlightHubConnector();
  }

  getSystemStatus(): {
    odoo: { url: string; modules: string[] };
    s3: { region: string; buckets: string[] };
    flightHub: { orgId: string };
  } {
    return {
      odoo: { url: this.odoo.getConfig().url, modules: this.odoo.getConfig().modules },
      s3: { region: this.s3.getConfig().region, buckets: Object.values(this.s3.getConfig().buckets) },
      flightHub: { orgId: this.flightHub.getConfig().organizationId },
    };
  }
}
