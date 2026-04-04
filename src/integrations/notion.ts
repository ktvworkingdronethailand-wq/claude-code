/**
 * KTV Working Drone Thailand — Notion Integration
 *
 * Pushes agent status, KPIs, team pages, and One Bangkok deal docs
 * into a Notion workspace via the official REST API.
 *
 * Setup:
 *   1. Create integration at https://www.notion.so/my-integrations
 *   2. Share pages/databases with the integration bot
 *   3. Set NOTION_API_KEY env var
 *   4. Optionally set NOTION_ROOT_PAGE_ID (parent page for KTV workspace)
 */

// ── Types ─────────────────────────────────────────────────────

export interface NotionConfig {
  apiKey: string;
  rootPageId?: string;
  version?: string;
}

export interface NotionPage {
  id: string;
  url: string;
  title: string;
  createdTime: string;
  lastEditedTime: string;
}

export interface NotionDatabase {
  id: string;
  url: string;
  title: string;
}

// ── Rich text helpers ─────────────────────────────────────────

function rt(text: string, bold = false, color?: string) {
  return {
    type: 'text',
    text: { content: text },
    annotations: { bold, color: color ?? 'default' },
  };
}

function heading(level: 1 | 2 | 3, text: string) {
  return {
    type: `heading_${level}`,
    [`heading_${level}`]: { rich_text: [rt(text)] },
  };
}

function para(text: string) {
  return { type: 'paragraph', paragraph: { rich_text: [rt(text)] } };
}

function bullet(text: string) {
  return { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [rt(text)] } };
}

function divider() {
  return { type: 'divider', divider: {} };
}

function callout(text: string, emoji: string) {
  return {
    type: 'callout',
    callout: { rich_text: [rt(text)], icon: { type: 'emoji', emoji } },
  };
}

// ── Client ────────────────────────────────────────────────────

export class NotionClient {
  private base = 'https://api.notion.com/v1';
  private headers: Record<string, string>;

  constructor(private config: NotionConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': config.version ?? '2022-06-28',
    };
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json() as Record<string, unknown>;
    if (!res.ok) {
      throw new Error(`Notion ${method} ${path} → ${res.status}: ${json['message'] ?? JSON.stringify(json)}`);
    }
    return json as T;
  }

  // ── Pages ──────────────────────────────────────────────────

  async createPage(parentPageId: string, title: string, children: unknown[]): Promise<NotionPage> {
    const data = await this.request<Record<string, unknown>>('POST', '/pages', {
      parent: { type: 'page_id', page_id: parentPageId },
      properties: {
        title: { title: [{ type: 'text', text: { content: title } }] },
      },
      children,
    });
    return {
      id: data['id'] as string,
      url: data['url'] as string,
      title,
      createdTime: (data['created_time'] as string) ?? '',
      lastEditedTime: (data['last_edited_time'] as string) ?? '',
    };
  }

  async updatePageBlocks(pageId: string, children: unknown[]): Promise<void> {
    await this.request('PATCH', `/blocks/${pageId}/children`, { children });
  }

  async searchPages(query: string): Promise<NotionPage[]> {
    const data = await this.request<{ results: Record<string, unknown>[] }>('POST', '/search', {
      query,
      filter: { value: 'page', property: 'object' },
      page_size: 10,
    });
    return data.results.map(p => ({
      id: p['id'] as string,
      url: p['url'] as string,
      title: (((p['properties'] as Record<string, unknown>)?.['title'] as Record<string, unknown>)?.['title'] as { plain_text: string }[])?.[0]?.plain_text ?? '—',
      createdTime: p['created_time'] as string,
      lastEditedTime: p['last_edited_time'] as string,
    }));
  }

  async createDatabase(parentPageId: string, title: string, properties: Record<string, unknown>): Promise<NotionDatabase> {
    const data = await this.request<Record<string, unknown>>('POST', '/databases', {
      parent: { type: 'page_id', page_id: parentPageId },
      title: [{ type: 'text', text: { content: title } }],
      properties,
    });
    return {
      id: data['id'] as string,
      url: data['url'] as string,
      title,
    };
  }

  async addDatabaseRow(databaseId: string, properties: Record<string, unknown>): Promise<string> {
    const data = await this.request<Record<string, unknown>>('POST', '/pages', {
      parent: { type: 'database_id', database_id: databaseId },
      properties,
    });
    return data['id'] as string;
  }

  // ── KTV Push Functions ────────────────────────────────────

  /**
   * Push the full KTV Operations Workspace to Notion
   * Creates: Master Dashboard page + 6 team sub-pages + KPI database
   */
  async pushKtvWorkspace(rootPageId: string): Promise<{ workspace: NotionPage; teams: NotionPage[] }> {
    // 1. Master workspace page
    const workspace = await this.createPage(rootPageId, '🚁 KTV Working Drone Thailand — Operations Hub', [
      callout('14 Agents · 6 Teams · 9 Automations · Supabase telemetry LIVE', '🚁'),
      divider(),
      heading(2, '📊 System Status'),
      para('Operations Brain: ONLINE · 21 workflows · 6 triggers · All guardrails PASS'),
      divider(),
      heading(2, '🏢 One Bangkok Initiative'),
      bullet('ACV: THB 23.97M · EBITDA: 77.7% · Payback: 3.6 months'),
      bullet('IFS Thailand JV · KTV 50% control · Smart Green ESG platform'),
      bullet('Channel: IFS FM (facade, inspection) → Direct KTV (agri, media, survey)'),
      divider(),
      heading(2, '💰 Financial Guardrails — All PASS ✅'),
      bullet('Payback < 18mo · EBITDA > 40% · Price floor: 27 THB/sqm'),
      bullet('Min order: 20K sqm · NPV positive @10% · Drone hours < 2000/yr'),
      divider(),
      heading(2, '🤝 6 CoWork Teams'),
      bullet('Growth Engine · Service Delivery · Compliance & Safety'),
      bullet('Market Intelligence · Ecosystem Builder · Revenue Operations'),
    ]);

    // 2. Team sub-pages
    const teamDefs = [
      { emoji: '🔵', name: 'Growth Engine', mission: 'Find & route opportunities via IFS or Direct KTV', lead: 'market_intelligence_strategist', agents: 5, kpi: 'leads/week target: 5' },
      { emoji: '🟢', name: 'Service Delivery', mission: 'Execute drone missions with zero incidents', lead: 'operations_compliance_mission_planner', agents: 7, kpi: 'missions/week target: 10' },
      { emoji: '🟡', name: 'Compliance & Safety', mission: 'CAAT compliance, fleet readiness, zero incidents', lead: 'operations_compliance_mission_planner', agents: 4, kpi: 'incidents target: 0' },
      { emoji: '🟣', name: 'Market Intelligence', mission: 'Real-time market analysis & competitor tracking', lead: 'market_intelligence_strategist', agents: 5, kpi: 'opportunities scored target: 20' },
      { emoji: '🩵', name: 'Ecosystem Builder', mission: 'IFS partnership, Smart Green integrations', lead: 'partner_strategy_architect', agents: 6, kpi: 'IFS milestone: THB 32M → 64M → 160M' },
      { emoji: '🩷', name: 'Revenue Operations', mission: 'Maximize revenue, healthy margins, timely collections', lead: 'financial_model_capital_planner', agents: 6, kpi: 'Year 1 target: THB 180.18M' },
    ];

    const teams: NotionPage[] = [];
    for (const t of teamDefs) {
      const page = await this.createPage(workspace.id, `${t.emoji} ${t.name}`, [
        callout(t.mission, t.emoji),
        divider(),
        heading(2, '🤖 Team Configuration'),
        bullet(`Lead Agent: ${t.lead}`),
        bullet(`Total Agents: ${t.agents}`),
        bullet(`Primary KPI: ${t.kpi}`),
        divider(),
        heading(2, '📋 Weekly Tasks'),
        bullet('Monday: Pipeline review + priority ranking'),
        bullet('Wednesday: Mid-week KPI check + blocker resolution'),
        bullet('Friday: Weekly deliverables report to MD'),
      ]);
      teams.push(page);
    }

    return { workspace, teams };
  }

  /**
   * Push agent telemetry snapshot as a Notion page
   */
  async pushAgentSnapshot(parentPageId: string, agents: { name: string; team: string; status: string; tasks: number }[]): Promise<NotionPage> {
    const blocks: unknown[] = [
      callout(`Snapshot: ${new Date().toISOString()} · ${agents.filter(a => a.status === 'active').length}/${agents.length} agents online`, '📡'),
      divider(),
      heading(2, '🤖 Agent Status'),
    ];
    for (const a of agents) {
      const icon = a.status === 'active' ? '✅' : a.status === 'error' ? '❌' : '⚫';
      blocks.push(bullet(`${icon} ${a.name} · ${a.team} · ${a.tasks} tasks pending`));
    }
    return this.createPage(parentPageId, `📡 Agent Snapshot — ${new Date().toLocaleDateString()}`, blocks);
  }
}

// ── Factory ───────────────────────────────────────────────────

export function createNotionClient(): NotionClient | null {
  const key = process.env['NOTION_API_KEY'];
  if (!key) {
    console.warn('[Notion] NOTION_API_KEY not set — Notion push disabled');
    return null;
  }
  return new NotionClient({ apiKey: key, rootPageId: process.env['NOTION_ROOT_PAGE_ID'] });
}

// ── MCP Note ─────────────────────────────────────────────────
// The Notion MCP server (mcp__notion__*) requires:
// 1. A valid NOTION_API_KEY in the MCP server env
// 2. Pages explicitly shared with the integration bot in Notion UI
// 3. The MCP host allowlist to include api.notion.com
// Until configured, use this REST client directly via createNotionClient()
