/**
 * KTV Working Drone Thailand — Asana Integration
 *
 * Pushes CoWork team tasks, agent deliverables, and weekly
 * work items into Asana projects via the REST API.
 *
 * Setup:
 *   Set ASANA_ACCESS_TOKEN and optionally ASANA_WORKSPACE_GID
 */

export interface AsanaConfig {
  accessToken: string;
  workspaceGid?: string;
}

export interface AsanaProject {
  gid: string;
  name: string;
  permalink_url: string;
}

export interface AsanaTask {
  gid: string;
  name: string;
  permalink_url: string;
  due_on?: string;
  assignee?: string;
}

// ── Client ────────────────────────────────────────────────────

export class AsanaClient {
  private base = 'https://app.asana.com/api/1.0';
  private headers: Record<string, string>;

  constructor(private config: AsanaConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json() as { data: T; errors?: { message: string }[] };
    if (!res.ok || json.errors) {
      throw new Error(`Asana ${method} ${path} → ${res.status}: ${json.errors?.[0]?.message ?? JSON.stringify(json)}`);
    }
    return json.data;
  }

  async getWorkspaces(): Promise<{ gid: string; name: string }[]> {
    return this.request('GET', '/workspaces?opt_fields=gid,name');
  }

  async createProject(workspaceGid: string, name: string, color: string, notes: string): Promise<AsanaProject> {
    return this.request('POST', '/projects', {
      data: { workspace: workspaceGid, name, color, notes, default_view: 'list' },
    });
  }

  async createTask(projectGid: string, name: string, notes: string, dueOn?: string, assigneeEmail?: string): Promise<AsanaTask> {
    return this.request('POST', '/tasks', {
      data: {
        projects: [projectGid],
        name,
        notes,
        due_on: dueOn,
        assignee: assigneeEmail,
      },
    });
  }

  async addTaskComment(taskGid: string, text: string): Promise<void> {
    await this.request('POST', `/tasks/${taskGid}/stories`, { data: { text } });
  }

  // ── KTV Push Functions ────────────────────────────────────

  /**
   * Create all 6 CoWork team projects in Asana with weekly tasks
   */
  async pushKtvTeamProjects(workspaceGid: string): Promise<AsanaProject[]> {
    const teams = [
      {
        name: '🔵 KTV — Growth Engine',
        color: 'light-blue',
        notes: 'Market intelligence, lead qualification, IFS/Direct KTV channel routing.\nLead: market_intelligence_strategist · 5 agents',
        tasks: [
          { name: 'Weekly market scan — Bangkok FM TAM/SAM/SOM update', due: 7 },
          { name: 'Score & rank top 10 opportunities in CRM', due: 2 },
          { name: 'IFS channel routing: qualify FM leads this week', due: 3 },
          { name: 'One Bangkok — follow up on site assessment outcome', due: 3 },
          { name: 'Weekly pipeline report to MD (Friday)', due: 5 },
        ],
      },
      {
        name: '🟢 KTV — Service Delivery',
        color: 'light-green',
        notes: 'Drone mission execution, pre-flight to data delivery, zero incidents.\nLead: operations_compliance_mission_planner · 7 agents',
        tasks: [
          { name: 'Pre-flight checks: all missions this week', due: 1 },
          { name: 'Mission KTV-2026-0406-001: One Bangkok Tower B', due: 2 },
          { name: 'Post-mission data processing + client report', due: 3 },
          { name: 'Fleet readiness review: 16 drones', due: 4 },
          { name: 'DJI-M350-003 maintenance: Wed 8 Apr (100hr service)', due: 4 },
        ],
      },
      {
        name: '🟡 KTV — Compliance & Safety',
        color: 'yellow',
        notes: 'CAAT compliance, zero incidents, pilot certifications, fleet availability.\nLead: operations_compliance_mission_planner · 4 agents',
        tasks: [
          { name: 'Pre-flight checklist audit: 100% pass rate', due: 1 },
          { name: 'URGENT: Krit RPL renewal — submit CAAT application by Apr 15', due: 11 },
          { name: 'Weekly safety incident review (target: 0)', due: 5 },
          { name: 'NOTAM filing: all missions this week', due: 1 },
          { name: 'Fleet availability report: target >85%', due: 5 },
        ],
      },
      {
        name: '🟣 KTV — Market Intelligence',
        color: 'light-purple',
        notes: 'Real-time market analysis, competitor tracking, strategic recommendations.\nLead: market_intelligence_strategist · 5 agents',
        tasks: [
          { name: 'Bangkok TAM update: FM drone services 2026', due: 3 },
          { name: 'Competitor scan: drone facade cleaning providers', due: 3 },
          { name: 'One Bangkok market brief: TCC Group strategy', due: 2 },
          { name: 'Smart Green adoption tracker: update site pipeline', due: 4 },
          { name: 'Weekly intel summary to MD (Friday)', due: 5 },
        ],
      },
      {
        name: '🩵 KTV — Ecosystem Builder',
        color: 'aqua',
        notes: 'IFS Thailand JV milestones, Smart Green integrations, new partnerships.\nLead: partner_strategy_architect · 6 agents',
        tasks: [
          { name: 'IFS milestone tracker: progress to THB 32M threshold', due: 2 },
          { name: 'Smart Green: Icon Siam BMS integration scoping', due: 4 },
          { name: 'New partner evaluation: PCS ground FM proposal', due: 5 },
          { name: 'Deal design: One Bangkok pilot term sheet draft', due: 3 },
          { name: 'IFS JV equity trigger review: current status', due: 5 },
        ],
      },
      {
        name: '🩷 KTV — Revenue Operations',
        color: 'hot-pink',
        notes: 'Revenue maximization, margins, invoice collection, IRR tracking.\nLead: financial_model_capital_planner · 6 agents',
        tasks: [
          { name: 'URGENT: Chase KTV-INV-2026-0285 overdue THB 892,500', due: 1 },
          { name: 'Send invoice KTV-INV-2026-0312: THB 1,485,000', due: 1 },
          { name: 'EBITDA check: verify margin >55% on active deals', due: 3 },
          { name: 'Weekly revenue vs Y1 target: THB 180.18M tracking', due: 5 },
          { name: 'Guardrail validation: all deals pass 6 criteria', due: 2 },
        ],
      },
    ];

    const projects: AsanaProject[] = [];
    const today = new Date();

    for (const team of teams) {
      const project = await this.createProject(workspaceGid, team.name, team.color, team.notes);
      projects.push(project);

      for (const task of team.tasks) {
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + task.due);
        const dueDateStr = dueDate.toISOString().split('T')[0];
        await this.createTask(project.gid, task.name, '', dueDateStr);
      }
    }

    return projects;
  }
}

// ── Factory ───────────────────────────────────────────────────

export function createAsanaClient(): AsanaClient | null {
  const token = process.env['ASANA_ACCESS_TOKEN'];
  if (!token) {
    console.warn('[Asana] ASANA_ACCESS_TOKEN not set — Asana push disabled');
    return null;
  }
  return new AsanaClient({ accessToken: token, workspaceGid: process.env['ASANA_WORKSPACE_GID'] });
}
