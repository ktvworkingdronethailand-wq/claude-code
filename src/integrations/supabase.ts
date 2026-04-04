/**
 * KTV Working Drone Thailand — Supabase Integration
 *
 * Real-time sync layer between all 14 agents, 6 CoWork teams,
 * workflows, and the master operations dashboard.
 *
 * Tables: agent_status | workflow_events | brain_decisions |
 *         kpi_snapshots | mission_log | team_activity
 */

import { AgentHealth, AgentRole } from '../types/index.js';
import type { BrainDecision } from '../workflows/brain.js';

// ── Supabase Config ────────────────────────────────────────

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

// ── Row Types (match SQL schema) ───────────────────────────

export interface AgentStatusRow {
  id?: string;
  agent_role: AgentRole | string;
  agent_name: string;
  team: string;
  layer: 'operational' | 'strategy' | 'cowork';
  status: string;
  uptime_ms: number;
  tasks_completed: number;
  tasks_pending: number;
  error_count: number;
  last_activity: string;
  updated_at?: string;
}

export interface WorkflowEventRow {
  id?: string;
  event_type: string;
  workflow_id?: string;
  workflow_name?: string;
  trigger: string;
  agents_involved: string[];
  outcome: 'success' | 'failure' | 'pending';
  duration_ms?: number;
  payload?: Record<string, unknown>;
  created_at?: string;
}

export interface BrainDecisionRow {
  id?: string;
  trigger: string;
  reasoning: string;
  actions: string[];
  outcome: 'success' | 'failure' | 'pending';
  agents_involved: string[];
  created_at?: string;
}

export interface KpiSnapshotRow {
  id?: string;
  team: string;
  kpi_name: string;
  kpi_value: number | string;
  kpi_unit: string;
  target?: number | string;
  status: 'on-track' | 'at-risk' | 'off-track';
  snapshotted_at?: string;
}

export interface MissionLogRow {
  id?: string;
  mission_ref: string;
  client_name: string;
  service_line: string;
  sqm?: number;
  stage: string;
  safety_cleared: boolean;
  pilot?: string;
  drone_id?: string;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
}

export interface TeamActivityRow {
  id?: string;
  team: string;
  agent_role: string;
  action: string;
  detail?: string;
  created_at?: string;
}

// ── Supabase Client (lightweight, no SDK dep) ──────────────

export class KtvSupabaseClient {
  private url: string;
  private headers: Record<string, string>;

  constructor(config: SupabaseConfig) {
    this.url = config.url.replace(/\/$/, '');
    this.headers = {
      'Content-Type': 'application/json',
      'apikey': config.anonKey,
      'Authorization': `Bearer ${config.serviceRoleKey ?? config.anonKey}`,
      'Prefer': 'return=representation',
    };
  }

  // ── REST helpers ─────────────────────────────────────────

  private async post(table: string, body: Record<string, unknown>): Promise<void> {
    const res = await fetch(`${this.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase POST /${table} failed (${res.status}): ${text}`);
    }
  }

  private async upsert(table: string, body: Record<string, unknown>, onConflict: string): Promise<void> {
    const res = await fetch(`${this.url}/rest/v1/${table}?on_conflict=${onConflict}`, {
      method: 'POST',
      headers: { ...this.headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase UPSERT /${table} failed (${res.status}): ${text}`);
    }
  }

  async get<T>(table: string, params?: string): Promise<T[]> {
    const qs = params ? `?${params}` : '';
    const res = await fetch(`${this.url}/rest/v1/${table}${qs}`, {
      method: 'GET',
      headers: this.headers,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase GET /${table} failed (${res.status}): ${text}`);
    }
    return res.json() as Promise<T[]>;
  }

  // ── Public API ────────────────────────────────────────────

  async upsertAgentStatus(row: AgentStatusRow): Promise<void> {
    await this.upsert('agent_status', { ...row, updated_at: new Date().toISOString() }, 'agent_role');
  }

  async insertWorkflowEvent(row: WorkflowEventRow): Promise<void> {
    await this.post('workflow_events', { ...row, created_at: new Date().toISOString() });
  }

  async insertBrainDecision(row: BrainDecisionRow): Promise<void> {
    await this.post('brain_decisions', { ...row, created_at: new Date().toISOString() });
  }

  async upsertKpi(row: KpiSnapshotRow): Promise<void> {
    await this.upsert('kpi_snapshots', { ...row, snapshotted_at: new Date().toISOString() }, 'team,kpi_name');
  }

  async insertMissionLog(row: MissionLogRow): Promise<void> {
    await this.post('mission_log', { ...row, created_at: new Date().toISOString() });
  }

  async insertTeamActivity(row: TeamActivityRow): Promise<void> {
    await this.post('team_activity', { ...row, created_at: new Date().toISOString() });
  }

  async getDashboardSnapshot(): Promise<{
    agents: AgentStatusRow[];
    recentDecisions: BrainDecisionRow[];
    kpis: KpiSnapshotRow[];
    recentActivity: TeamActivityRow[];
  }> {
    const [agents, recentDecisions, kpis, recentActivity] = await Promise.all([
      this.get<AgentStatusRow>('agent_status', 'order=agent_name.asc'),
      this.get<BrainDecisionRow>('brain_decisions', 'order=created_at.desc&limit=10'),
      this.get<KpiSnapshotRow>('kpi_snapshots', 'order=team.asc,kpi_name.asc'),
      this.get<TeamActivityRow>('team_activity', 'order=created_at.desc&limit=20'),
    ]);
    return { agents, recentDecisions, kpis, recentActivity };
  }
}

// ── Agent Telemetry Reporter ───────────────────────────────

/**
 * Wraps the Supabase client to provide easy telemetry push
 * from any agent or the OperationsBrain.
 */
export class AgentTelemetry {
  constructor(private readonly client: KtvSupabaseClient) {}

  /** Call from KtvOrchestrator health-check loop */
  async reportAgentHealth(health: AgentHealth, agentName: string, team: string, layer: AgentStatusRow['layer']): Promise<void> {
    await this.client.upsertAgentStatus({
      agent_role: health.role,
      agent_name: agentName,
      team,
      layer,
      status: health.status,
      uptime_ms: health.uptime,
      tasks_completed: health.tasksCompleted,
      tasks_pending: health.tasksPending,
      error_count: health.errorCount,
      last_activity: health.lastActivity.toISOString(),
    });
  }

  /** Call from OperationsBrain.logDecision() */
  async reportDecision(decision: BrainDecision): Promise<void> {
    await this.client.insertBrainDecision({
      id: decision.id,
      trigger: decision.trigger,
      reasoning: decision.reasoning,
      actions: decision.actions,
      outcome: decision.outcome,
      agents_involved: decision.agentsInvolved,
      created_at: decision.timestamp.toISOString(),
    });
  }

  /** Publish a team activity event */
  async reportActivity(team: string, agentRole: string, action: string, detail?: string): Promise<void> {
    await this.client.insertTeamActivity({ team, agent_role: agentRole, action, detail });
  }

  /** Push a KPI reading */
  async reportKpi(team: string, name: string, value: number | string, unit: string, target?: number | string, status: KpiSnapshotRow['status'] = 'on-track'): Promise<void> {
    await this.client.upsertKpi({ team, kpi_name: name, kpi_value: value, kpi_unit: unit, target, status });
  }
}

// ── Factory ────────────────────────────────────────────────

export function createSupabaseClient(): KtvSupabaseClient | null {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_ANON_KEY'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !key) {
    console.warn('[Supabase] SUPABASE_URL or SUPABASE_ANON_KEY not set — telemetry disabled');
    return null;
  }

  return new KtvSupabaseClient({ url, anonKey: key, serviceRoleKey: serviceKey });
}

export const AGENT_TEAM_MAP: Record<string, { team: string; layer: AgentStatusRow['layer'] }> = {
  'fleet-management':   { team: 'Service Delivery',    layer: 'operational' },
  'job-lifecycle':      { team: 'Service Delivery',    layer: 'operational' },
  'crm-sales':          { team: 'Growth Engine',       layer: 'operational' },
  'safety-compliance':  { team: 'Compliance & Safety', layer: 'operational' },
  'finance-invoicing':  { team: 'Revenue Operations',  layer: 'operational' },
  'pilot-operations':   { team: 'Compliance & Safety', layer: 'operational' },
  'data-processing':    { team: 'Service Delivery',    layer: 'operational' },
  // Strategy (Mastermind)
  'market_intelligence_strategist':    { team: 'Market Intelligence', layer: 'strategy' },
  'partner_strategy_architect':        { team: 'Ecosystem Builder',   layer: 'strategy' },
  'smart_green_product_orchestrator':  { team: 'Ecosystem Builder',   layer: 'strategy' },
  'financial_model_capital_planner':   { team: 'Revenue Operations',  layer: 'strategy' },
  'deal_design_pitch_engineer':        { team: 'Revenue Operations',  layer: 'strategy' },
  'sales_playbook_account_selector':   { team: 'Growth Engine',       layer: 'strategy' },
  'operations_compliance_mission_planner': { team: 'Compliance & Safety', layer: 'strategy' },
};
