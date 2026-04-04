/**
 * KTV Working Drone Thailand — Airtable Integration
 *
 * Pushes agent KPIs, mission logs, lead pipeline, and financial
 * data into Airtable bases via the REST API.
 *
 * Setup:
 *   Set AIRTABLE_API_KEY (or AIRTABLE_ACCESS_TOKEN) and AIRTABLE_BASE_ID
 */

export interface AirtableConfig {
  apiKey: string;
  baseId: string;
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}

// ── Client ────────────────────────────────────────────────────

export class AirtableClient {
  private base = 'https://api.airtable.com/v0';
  private headers: Record<string, string>;

  constructor(private config: AirtableConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.base}/${this.config.baseId}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json() as T;
    if (!res.ok) {
      const err = json as { error?: { message: string } };
      throw new Error(`Airtable ${method} ${path} → ${res.status}: ${err.error?.message ?? JSON.stringify(json)}`);
    }
    return json;
  }

  async createRecord(table: string, fields: Record<string, unknown>): Promise<AirtableRecord> {
    const result = await this.request<{ id: string; fields: Record<string, unknown>; createdTime: string }>(
      'POST', `/${encodeURIComponent(table)}`, { fields }
    );
    return result;
  }

  async createRecords(table: string, records: Record<string, unknown>[]): Promise<AirtableRecord[]> {
    const result = await this.request<{ records: AirtableRecord[] }>(
      'POST', `/${encodeURIComponent(table)}`,
      { records: records.map(fields => ({ fields })) }
    );
    return result.records;
  }

  async listRecords(table: string, maxRecords = 100): Promise<AirtableRecord[]> {
    const result = await this.request<{ records: AirtableRecord[] }>(
      'GET', `/${encodeURIComponent(table)}?maxRecords=${maxRecords}`
    );
    return result.records;
  }

  async upsertRecord(table: string, fieldsToMergeOn: string[], fields: Record<string, unknown>): Promise<AirtableRecord> {
    const result = await this.request<{ records: AirtableRecord[] }>(
      'PATCH', `/${encodeURIComponent(table)}`,
      { records: [{ fields }], performUpsert: { fieldsToMergeOn } }
    );
    return result.records[0]!;
  }

  // ── KTV Push Functions ────────────────────────────────────

  /**
   * Push all 14 agent statuses to Airtable "Agent Status" table
   * Table schema: Agent Name | Role | Team | Layer | Status | Tasks Completed | Last Activity
   */
  async pushAgentStatus(agents: {
    name: string; role: string; team: string; layer: string;
    status: string; tasksCompleted: number; lastActivity: Date;
  }[]): Promise<AirtableRecord[]> {
    const records = agents.map(a => ({
      'Agent Name': a.name,
      'Role': a.role,
      'Team': a.team,
      'Layer': a.layer,
      'Status': a.status,
      'Tasks Completed': a.tasksCompleted,
      'Last Activity': a.lastActivity.toISOString(),
    }));
    return this.createRecords('Agent Status', records);
  }

  /**
   * Push KPI snapshot to "KPI Dashboard" table
   */
  async pushKpiSnapshot(kpis: {
    team: string; name: string; value: string | number;
    unit: string; target: string; status: string;
  }[]): Promise<void> {
    for (const kpi of kpis) {
      await this.upsertRecord('KPI Dashboard', ['Team', 'KPI Name'], {
        'Team': kpi.team,
        'KPI Name': kpi.name,
        'Current Value': String(kpi.value),
        'Unit': kpi.unit,
        'Target': kpi.target,
        'Status': kpi.status,
        'Updated At': new Date().toISOString(),
      });
    }
  }

  /**
   * Push mission log entry to "Mission Log" table
   */
  async pushMissionLog(mission: {
    ref: string; client: string; serviceLine: string; sqm: number;
    stage: string; safetyCleared: boolean; pilot?: string; droneId?: string;
  }): Promise<AirtableRecord> {
    return this.createRecord('Mission Log', {
      'Mission Ref': mission.ref,
      'Client': mission.client,
      'Service Line': mission.serviceLine,
      'Sqm': mission.sqm,
      'Stage': mission.stage,
      'Safety Cleared': mission.safetyCleared,
      'Pilot': mission.pilot ?? '',
      'Drone ID': mission.droneId ?? '',
      'Created At': new Date().toISOString(),
    });
  }

  /**
   * Push CRM lead to "Lead Pipeline" table
   */
  async pushLead(lead: {
    company: string; contact: string; email: string; serviceLine: string;
    estimatedValueThb: number; stage: string; channel: 'IFS' | 'Direct KTV'; score: string;
  }): Promise<AirtableRecord> {
    return this.createRecord('Lead Pipeline', {
      'Company': lead.company,
      'Contact': lead.contact,
      'Email': lead.email,
      'Service Line': lead.serviceLine,
      'Est. Value (THB)': lead.estimatedValueThb,
      'Stage': lead.stage,
      'Channel': lead.channel,
      'Score': lead.score,
      'Created At': new Date().toISOString(),
    });
  }
}

// ── Factory ───────────────────────────────────────────────────

export function createAirtableClient(): AirtableClient | null {
  const key = process.env['AIRTABLE_API_KEY'] ?? process.env['AIRTABLE_ACCESS_TOKEN'];
  const baseId = process.env['AIRTABLE_BASE_ID'];
  if (!key || !baseId) {
    console.warn('[Airtable] AIRTABLE_API_KEY and AIRTABLE_BASE_ID required — Airtable push disabled');
    return null;
  }
  return new AirtableClient({ apiKey: key, baseId });
}
