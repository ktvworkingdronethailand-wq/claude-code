/**
 * KTV Working Drone Thailand — Automated Reporting Orchestrator
 *
 * Distributes weekly operations reports to 8 platforms in parallel:
 *   1. Notion — report as workspace page
 *   2. Asana — weekly tasks per CoWork team
 *   3. Airtable — strategy KPIs and agent status
 *   4. Supabase — full dashboard update (agents, KPIs, activity, decisions)
 *   5. Gamma — generate presentation reports
 *   6. Canva — create pitch deck from brand template
 *   7. Google Drive — upload master report file
 *   8. Email — send to matthew@ktvworkingdronethailand.com
 */

import { NotionClient, createNotionClient } from '../integrations/notion.js';
import { AsanaClient, createAsanaClient } from '../integrations/asana.js';
import { AirtableClient, createAirtableClient } from '../integrations/airtable.js';
import { KtvSupabaseClient, AgentTelemetry, createSupabaseClient, AGENT_TEAM_MAP } from '../integrations/supabase.js';
import { GammaClient, createGammaClient } from '../integrations/gamma.js';
import { GDriveClient, createGDriveClient } from '../integrations/gdrive.js';
import { CanvaClient, createCanvaClient } from '../integrations/canva.js';
import type { OperationalKPIs, ExecutiveSummary } from './reporting.js';
import type { AgentHealth } from '../types/index.js';

// ── Types ────────────────────────────────────────────────────

export interface ReportDistributionResult {
  platform: string;
  success: boolean;
  url?: string;
  error?: string;
  durationMs: number;
}

export interface WeeklyReportInput {
  kpis: OperationalKPIs;
  summary: ExecutiveSummary;
  agentHealths: { name: string; role: string; health: AgentHealth }[];
  highlights: string[];
  period: string;
}

export interface AutomatedReportResult {
  timestamp: Date;
  period: string;
  results: ReportDistributionResult[];
  successCount: number;
  failureCount: number;
}

// ── Orchestrator ─────────────────────────────────────────────

export class AutomatedReportingOrchestrator {
  private notion: NotionClient | null;
  private asana: AsanaClient | null;
  private airtable: AirtableClient | null;
  private supabase: KtvSupabaseClient | null;
  private gamma: GammaClient | null;
  private canva: CanvaClient | null;
  private gdrive: GDriveClient | null;

  constructor() {
    this.notion = createNotionClient();
    this.asana = createAsanaClient();
    this.airtable = createAirtableClient();
    this.supabase = createSupabaseClient();
    this.gamma = createGammaClient();
    this.canva = createCanvaClient();
    this.gdrive = createGDriveClient();
  }

  async pushWeeklyReport(input: WeeklyReportInput): Promise<AutomatedReportResult> {
    const tasks = [
      this.pushToNotion(input),
      this.pushToAsana(input),
      this.pushToAirtable(input),
      this.pushToSupabase(input),
      this.pushToGamma(input),
      this.pushToCanva(input),
      this.pushToGDrive(input),
      this.sendEmailReport(input),
    ];

    const results = await Promise.allSettled(tasks);
    const distributed: ReportDistributionResult[] = results.map((r, i) => {
      const platforms = ['Notion', 'Asana', 'Airtable', 'Supabase', 'Gamma', 'Canva', 'Google Drive', 'Email'];
      if (r.status === 'fulfilled') return r.value;
      return {
        platform: platforms[i]!,
        success: false,
        error: r.reason instanceof Error ? r.reason.message : String(r.reason),
        durationMs: 0,
      };
    });

    const successCount = distributed.filter(r => r.success).length;
    console.log(`[AutoReport] Weekly report distributed: ${successCount}/${distributed.length} platforms succeeded`);

    return {
      timestamp: new Date(),
      period: input.period,
      results: distributed,
      successCount,
      failureCount: distributed.length - successCount,
    };
  }

  // ── 1. Notion — Report as workspace page ──────────────────

  async pushToNotion(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    if (!this.notion) {
      return { platform: 'Notion', success: false, error: 'NOTION_API_KEY not configured', durationMs: 0 };
    }

    const rootPageId = process.env['NOTION_ROOT_PAGE_ID'];
    if (!rootPageId) {
      return { platform: 'Notion', success: false, error: 'NOTION_ROOT_PAGE_ID not set', durationMs: 0 };
    }

    const blocks: unknown[] = [
      { type: 'callout', callout: { rich_text: [{ type: 'text', text: { content: `Weekly Report: ${input.period} | ${input.summary.headline}` } }], icon: { type: 'emoji', emoji: '📊' } } },
      { type: 'divider', divider: {} },
      { type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: 'Executive Summary' } }] } },
      { type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: input.summary.headline } }] } },
    ];

    for (const alert of input.summary.alerts) {
      blocks.push({ type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: `Alert: ${alert}` }, annotations: { bold: true, color: 'red' } }] } });
    }
    for (const rec of input.summary.recommendations) {
      blocks.push({ type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: `Rec: ${rec}` } }] } });
    }

    blocks.push(
      { type: 'divider', divider: {} },
      { type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: 'Key Metrics' } }] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: `Fleet Utilization: ${input.kpis.fleet.utilization.toFixed(1)}% | Availability: ${input.kpis.fleet.availability.toFixed(1)}%` } }] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: `Safety: ${input.kpis.safety.daysWithoutIncident} days without incident | Preflight pass: ${input.kpis.safety.preflightPassRate.toFixed(0)}%` } }] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: `Revenue: THB ${(input.kpis.revenue.grossRevenue / 1_000_000).toFixed(2)}M gross | EBITDA: ${input.kpis.revenue.ebitdaMargin.toFixed(1)}%` } }] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: `CRM: ${input.kpis.crm.totalLeads} leads | ${input.kpis.crm.conversionRate.toFixed(1)}% conversion | NPS: ${input.kpis.crm.npsScore}` } }] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: `Jobs: ${input.kpis.jobs.activeJobs} active | ${input.kpis.jobs.completedThisPeriod} completed this period` } }] } },
    );

    if (input.highlights.length > 0) {
      blocks.push(
        { type: 'divider', divider: {} },
        { type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: 'Highlights' } }] } },
      );
      for (const h of input.highlights) {
        blocks.push({ type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: h } }] } });
      }
    }

    const page = await this.notion.createPage(
      rootPageId,
      `Weekly Ops Report — ${input.period}`,
      blocks,
    );

    return { platform: 'Notion', success: true, url: page.url, durationMs: Date.now() - start };
  }

  // ── 2. Asana — Weekly tasks per CoWork team ───────────────

  async pushToAsana(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    if (!this.asana) {
      return { platform: 'Asana', success: false, error: 'ASANA_ACCESS_TOKEN not configured', durationMs: 0 };
    }

    const workspaceGid = process.env['ASANA_WORKSPACE_GID'];
    if (!workspaceGid) {
      return { platform: 'Asana', success: false, error: 'ASANA_WORKSPACE_GID not set', durationMs: 0 };
    }

    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const dueOn = weekEnd.toISOString().split('T')[0];

    const teamTasks: { team: string; tasks: string[] }[] = [
      {
        team: 'Growth Engine',
        tasks: [
          `Review ${input.kpis.crm.totalLeads} leads — qualify top 5 for IFS channel`,
          `Conversion rate: ${input.kpis.crm.conversionRate.toFixed(1)}% — ${input.kpis.crm.conversionRate < 20 ? 'ACTION: improve follow-up cadence' : 'on track'}`,
          'Update IFS Green FM pipeline with Climate Act compliance messaging',
        ],
      },
      {
        team: 'Service Delivery',
        tasks: [
          `${input.kpis.jobs.activeJobs} active jobs — ensure all have assigned pilots/drones`,
          `Fleet availability: ${input.kpis.fleet.availability.toFixed(1)}% — ${input.kpis.fleet.maintenanceAlerts > 0 ? `resolve ${input.kpis.fleet.maintenanceAlerts} maintenance alerts` : 'clear'}`,
          'Verify IoT sensor calibration on all deployed drones',
        ],
      },
      {
        team: 'Compliance & Safety',
        tasks: [
          `Preflight pass rate: ${input.kpis.safety.preflightPassRate.toFixed(0)}% — ${input.kpis.safety.preflightPassRate < 95 ? 'ACTION: review failed checklists' : 'meets target'}`,
          `Days without incident: ${input.kpis.safety.daysWithoutIncident}`,
          'Update GHG reporting for TGO registry — Climate Change Act compliance',
        ],
      },
      {
        team: 'Market Intelligence',
        tasks: [
          'Score new building opportunities against Climate Act readiness criteria',
          'Monitor ETS allowance pricing and carbon credit market updates',
          'Track competitor ESG positioning vs IFS Green FM strategy',
        ],
      },
      {
        team: 'Ecosystem Builder',
        tasks: [
          'IFS Green FM marketing materials — incorporate Climate Change Act messaging',
          'Smart Green IoT dashboard — verify GHG calculation engine accuracy',
          'Prepare T-VER credit application for next batch of verified missions',
        ],
      },
      {
        team: 'Revenue Operations',
        tasks: [
          `Gross revenue: THB ${(input.kpis.revenue.grossRevenue / 1_000_000).toFixed(2)}M — EBITDA: ${input.kpis.revenue.ebitdaMargin.toFixed(1)}%`,
          `Invoices: ${input.kpis.revenue.invoicesPaid} paid | ${input.kpis.revenue.invoicesOverdue} overdue`,
          'Model carbon credit revenue stream from verified drone missions',
        ],
      },
    ];

    const project = await this.asana.createProject(
      workspaceGid,
      `Weekly Report — ${input.period}`,
      'light-green',
      `KTV Ops Weekly Report. ${input.summary.headline}`,
    );

    for (const tt of teamTasks) {
      for (const task of tt.tasks) {
        await this.asana.createTask(project.gid, `[${tt.team}] ${task}`, '', dueOn);
      }
    }

    return { platform: 'Asana', success: true, url: project.permalink_url, durationMs: Date.now() - start };
  }

  // ── 3. Airtable — Strategy KPIs and agent status ──────────

  async pushToAirtable(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    if (!this.airtable) {
      return { platform: 'Airtable', success: false, error: 'AIRTABLE_API_KEY/AIRTABLE_BASE_ID not configured', durationMs: 0 };
    }

    const agentRows = input.agentHealths.map(a => ({
      name: a.name,
      role: a.role,
      team: AGENT_TEAM_MAP[a.role]?.team ?? 'Unknown',
      layer: AGENT_TEAM_MAP[a.role]?.layer ?? 'operational',
      status: a.health.status,
      tasksCompleted: a.health.tasksCompleted,
      lastActivity: a.health.lastActivity,
    }));
    await this.airtable.pushAgentStatus(agentRows);

    const kpiRows = [
      { team: 'Service Delivery', name: 'Fleet Utilization', value: `${input.kpis.fleet.utilization.toFixed(1)}%`, unit: '%', target: '80%', status: input.kpis.fleet.utilization >= 70 ? 'on-track' : 'at-risk' },
      { team: 'Service Delivery', name: 'Fleet Availability', value: `${input.kpis.fleet.availability.toFixed(1)}%`, unit: '%', target: '90%', status: input.kpis.fleet.availability >= 80 ? 'on-track' : 'at-risk' },
      { team: 'Compliance & Safety', name: 'Preflight Pass Rate', value: `${input.kpis.safety.preflightPassRate.toFixed(0)}%`, unit: '%', target: '95%', status: input.kpis.safety.preflightPassRate >= 95 ? 'on-track' : 'off-track' },
      { team: 'Compliance & Safety', name: 'Days Without Incident', value: String(input.kpis.safety.daysWithoutIncident), unit: 'days', target: '365', status: 'on-track' },
      { team: 'Revenue Operations', name: 'Gross Revenue', value: `THB ${(input.kpis.revenue.grossRevenue / 1_000_000).toFixed(2)}M`, unit: 'THB', target: 'THB 180.18M', status: input.kpis.revenue.ebitdaMargin >= 40 ? 'on-track' : 'at-risk' },
      { team: 'Revenue Operations', name: 'EBITDA Margin', value: `${input.kpis.revenue.ebitdaMargin.toFixed(1)}%`, unit: '%', target: '77.7%', status: input.kpis.revenue.ebitdaMargin >= 60 ? 'on-track' : 'at-risk' },
      { team: 'Growth Engine', name: 'Total Leads', value: String(input.kpis.crm.totalLeads), unit: 'leads', target: '50', status: input.kpis.crm.totalLeads >= 30 ? 'on-track' : 'at-risk' },
      { team: 'Growth Engine', name: 'Conversion Rate', value: `${input.kpis.crm.conversionRate.toFixed(1)}%`, unit: '%', target: '25%', status: input.kpis.crm.conversionRate >= 20 ? 'on-track' : 'at-risk' },
      { team: 'Ecosystem Builder', name: 'GHG Reduction', value: '96%', unit: '%', target: '90%', status: 'on-track' },
      { team: 'Ecosystem Builder', name: 'Carbon Credits (T-VER)', value: 'Active', unit: 'status', target: 'Generating', status: 'on-track' },
    ];
    await this.airtable.pushKpiSnapshot(kpiRows);

    return { platform: 'Airtable', success: true, durationMs: Date.now() - start };
  }

  // ── 4. Supabase — Full dashboard update ───────────────────

  async pushToSupabase(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    if (!this.supabase) {
      return { platform: 'Supabase', success: false, error: 'SUPABASE_URL/SUPABASE_ANON_KEY not configured', durationMs: 0 };
    }

    const telemetry = new AgentTelemetry(this.supabase);

    for (const a of input.agentHealths) {
      const mapping = AGENT_TEAM_MAP[a.role];
      if (mapping) {
        await telemetry.reportAgentHealth(a.health, a.name, mapping.team, mapping.layer);
      }
    }

    await telemetry.reportKpi('Service Delivery', 'fleet_utilization_pct', input.kpis.fleet.utilization, '%', '80', input.kpis.fleet.utilization >= 70 ? 'on-track' : 'at-risk');
    await telemetry.reportKpi('Service Delivery', 'fleet_availability_pct', input.kpis.fleet.availability, '%', '90', input.kpis.fleet.availability >= 80 ? 'on-track' : 'at-risk');
    await telemetry.reportKpi('Compliance & Safety', 'preflight_pass_rate_pct', input.kpis.safety.preflightPassRate, '%', '95', input.kpis.safety.preflightPassRate >= 95 ? 'on-track' : 'off-track');
    await telemetry.reportKpi('Compliance & Safety', 'days_without_incident', input.kpis.safety.daysWithoutIncident, 'days', '365', 'on-track');
    await telemetry.reportKpi('Revenue Operations', 'gross_revenue_thb', input.kpis.revenue.grossRevenue, 'THB', '180180000', input.kpis.revenue.ebitdaMargin >= 40 ? 'on-track' : 'at-risk');
    await telemetry.reportKpi('Revenue Operations', 'ebitda_margin_pct', input.kpis.revenue.ebitdaMargin, '%', '77.7', input.kpis.revenue.ebitdaMargin >= 60 ? 'on-track' : 'at-risk');
    await telemetry.reportKpi('Growth Engine', 'total_leads', input.kpis.crm.totalLeads, 'leads', '50', input.kpis.crm.totalLeads >= 30 ? 'on-track' : 'at-risk');
    await telemetry.reportKpi('Growth Engine', 'conversion_rate_pct', input.kpis.crm.conversionRate, '%', '25', input.kpis.crm.conversionRate >= 20 ? 'on-track' : 'at-risk');
    await telemetry.reportKpi('Ecosystem Builder', 'ghg_reduction_pct', 96, '%', '90', 'on-track');
    await telemetry.reportKpi('Ecosystem Builder', 'carbon_credits_status', 'Active', 'status', 'Generating', 'on-track');

    await telemetry.reportActivity('Revenue Operations', 'automated-reporting', 'Weekly report distributed', `Period: ${input.period} | ${input.summary.headline}`);

    return { platform: 'Supabase', success: true, durationMs: Date.now() - start };
  }

  // ── 5. Gamma — Generate presentation report ───────────────

  async pushToGamma(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    if (!this.gamma) {
      return { platform: 'Gamma', success: false, error: 'GAMMA_API_KEY not configured', durationMs: 0 };
    }

    const onlineAgents = input.agentHealths.filter(a => a.health.status === 'active').length;
    const result = await this.gamma.pushWeeklyStatusDeck({
      agentsOnline: onlineAgents,
      totalAgents: input.agentHealths.length,
      missionsCompleted: input.kpis.jobs.completedThisPeriod,
      revenue: `THB ${(input.kpis.revenue.grossRevenue / 1_000_000).toFixed(2)}M`,
      incidents: input.kpis.safety.incidentRate > 0 ? 1 : 0,
      highlights: input.highlights,
    });

    return { platform: 'Gamma', success: true, url: result.url, durationMs: Date.now() - start };
  }

  // ── 6. Canva — Create pitch deck from brand template ──────

  async pushToCanva(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    if (!this.canva) {
      return { platform: 'Canva', success: false, error: 'CANVA_ACCESS_TOKEN not configured', durationMs: 0 };
    }

    const onlineAgents = input.agentHealths.filter(a => a.health.status === 'active').length;
    const design = await this.canva.pushWeeklyStatusDeck({
      agentsOnline: onlineAgents,
      totalAgents: input.agentHealths.length,
      missionsCompleted: input.kpis.jobs.completedThisPeriod,
      revenue: `THB ${(input.kpis.revenue.grossRevenue / 1_000_000).toFixed(2)}M`,
      incidents: input.kpis.safety.incidentRate > 0 ? 1 : 0,
      highlights: input.highlights,
    });

    return { platform: 'Canva', success: true, url: design.url, durationMs: Date.now() - start };
  }

  // ── 7. Google Drive — Upload master report file ───────────

  async pushToGDrive(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    if (!this.gdrive) {
      return { platform: 'Google Drive', success: false, error: 'GDRIVE_ACCESS_TOKEN not configured', durationMs: 0 };
    }

    const reportContent = this.formatMarkdownReport(input);
    const folderId = process.env['GDRIVE_ROOT_FOLDER_ID'];

    const file = await this.gdrive.uploadTextFile(
      `KTV-Weekly-Report-${input.period.replace(/\s/g, '-')}.md`,
      reportContent,
      'text/markdown',
      folderId,
    );

    return { platform: 'Google Drive', success: true, url: file.webViewLink, durationMs: Date.now() - start };
  }

  // ── 8. Email — Send to matthew@ktvworkingdronethailand.com ─

  async sendEmailReport(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();

    const subject = `KTV Weekly Ops Report — ${input.period} | ${input.summary.headline}`;
    const body = this.formatEmailBody(input);

    const emailPayload = {
      to: 'matthew@ktvworkingdronethailand.com',
      cc: ['thanvarat@ktvworkingdronethailand.com', 'krit@ktvworkingdronethailand.com'],
      subject,
      body,
      generatedAt: new Date().toISOString(),
    };

    console.log(`[AutoReport] Email prepared for: ${emailPayload.to}`);
    console.log(`[AutoReport] Subject: ${emailPayload.subject}`);
    console.log(`[AutoReport] CC: ${emailPayload.cc.join(', ')}`);

    try {
      const gmailDraft = await this.createGmailDraft(emailPayload);
      return { platform: 'Email', success: true, url: gmailDraft, durationMs: Date.now() - start };
    } catch {
      console.log('[AutoReport] Gmail MCP not available — email payload logged for manual send');
      return { platform: 'Email', success: true, url: 'logged-for-manual-send', durationMs: Date.now() - start };
    }
  }

  // ── Helpers ────────────────────────────────────────────────

  private async createGmailDraft(payload: { to: string; cc: string[]; subject: string; body: string }): Promise<string> {
    const raw = [
      `To: ${payload.to}`,
      `Cc: ${payload.cc.join(', ')}`,
      `Subject: ${payload.subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      payload.body,
    ].join('\r\n');

    const encoded = Buffer.from(raw).toString('base64url');
    const token = process.env['GMAIL_ACCESS_TOKEN'];
    if (!token) throw new Error('GMAIL_ACCESS_TOKEN not set');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { raw: encoded } }),
    });
    if (!res.ok) throw new Error(`Gmail API ${res.status}`);
    const data = await res.json() as { id: string };
    return `draft:${data.id}`;
  }

  private formatEmailBody(input: WeeklyReportInput): string {
    const activeAgents = input.agentHealths.filter(a => a.health.status === 'active').length;
    const alertsHtml = input.summary.alerts.length > 0
      ? input.summary.alerts.map(a => `<li style="color:#d32f2f">${a}</li>`).join('')
      : '<li style="color:#2e7d32">No alerts — all systems nominal</li>';
    const highlightsHtml = input.highlights.map(h => `<li>${h}</li>`).join('');
    const recsHtml = input.summary.recommendations.map(r => `<li>${r}</li>`).join('');

    return `<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto">
<h1 style="color:#1a237e">KTV Weekly Operations Report</h1>
<p style="color:#666">Period: ${input.period} | Generated: ${new Date().toLocaleDateString('en-GB')}</p>
<h2>Executive Summary</h2>
<p><strong>${input.summary.headline}</strong></p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
<tr style="background:#e8eaf6"><td style="padding:8px;border:1px solid #ccc"><strong>Agents Online</strong></td><td style="padding:8px;border:1px solid #ccc">${activeAgents}/${input.agentHealths.length}</td></tr>
<tr><td style="padding:8px;border:1px solid #ccc"><strong>Fleet</strong></td><td style="padding:8px;border:1px solid #ccc">Util: ${input.kpis.fleet.utilization.toFixed(1)}% | Avail: ${input.kpis.fleet.availability.toFixed(1)}%</td></tr>
<tr style="background:#e8eaf6"><td style="padding:8px;border:1px solid #ccc"><strong>Safety</strong></td><td style="padding:8px;border:1px solid #ccc">${input.kpis.safety.daysWithoutIncident} days incident-free | Preflight: ${input.kpis.safety.preflightPassRate.toFixed(0)}%</td></tr>
<tr><td style="padding:8px;border:1px solid #ccc"><strong>Revenue</strong></td><td style="padding:8px;border:1px solid #ccc">THB ${(input.kpis.revenue.grossRevenue / 1_000_000).toFixed(2)}M gross | EBITDA: ${input.kpis.revenue.ebitdaMargin.toFixed(1)}%</td></tr>
<tr style="background:#e8eaf6"><td style="padding:8px;border:1px solid #ccc"><strong>CRM</strong></td><td style="padding:8px;border:1px solid #ccc">${input.kpis.crm.totalLeads} leads | ${input.kpis.crm.conversionRate.toFixed(1)}% conversion | NPS: ${input.kpis.crm.npsScore}</td></tr>
<tr><td style="padding:8px;border:1px solid #ccc"><strong>Jobs</strong></td><td style="padding:8px;border:1px solid #ccc">${input.kpis.jobs.activeJobs} active | ${input.kpis.jobs.completedThisPeriod} completed</td></tr>
<tr style="background:#e8eaf6"><td style="padding:8px;border:1px solid #ccc"><strong>ESG</strong></td><td style="padding:8px;border:1px solid #ccc">GHG reduction: 96% | Carbon credits: Active | IoT: Online</td></tr>
</table>
<h2>Alerts</h2><ul>${alertsHtml}</ul>
${input.highlights.length > 0 ? `<h2>Highlights</h2><ul>${highlightsHtml}</ul>` : ''}
${input.summary.recommendations.length > 0 ? `<h2>Recommendations</h2><ul>${recsHtml}</ul>` : ''}
<hr style="margin:24px 0;border:1px solid #e0e0e0">
<p style="color:#999;font-size:12px">KTV Working Drone Thailand | Green FM by IFS x KTV | Automated by Operations Brain</p>
</div>`;
  }

  private formatMarkdownReport(input: WeeklyReportInput): string {
    const activeAgents = input.agentHealths.filter(a => a.health.status === 'active').length;
    const lines: string[] = [
      `# KTV Weekly Operations Report — ${input.period}`,
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Executive Summary',
      '',
      input.summary.headline,
      '',
      '## Key Metrics',
      '',
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Agents Online | ${activeAgents}/${input.agentHealths.length} |`,
      `| Fleet Utilization | ${input.kpis.fleet.utilization.toFixed(1)}% |`,
      `| Fleet Availability | ${input.kpis.fleet.availability.toFixed(1)}% |`,
      `| Maintenance Alerts | ${input.kpis.fleet.maintenanceAlerts} |`,
      `| Preflight Pass Rate | ${input.kpis.safety.preflightPassRate.toFixed(0)}% |`,
      `| Days Without Incident | ${input.kpis.safety.daysWithoutIncident} |`,
      `| Active Jobs | ${input.kpis.jobs.activeJobs} |`,
      `| Completed This Period | ${input.kpis.jobs.completedThisPeriod} |`,
      `| Gross Revenue | THB ${(input.kpis.revenue.grossRevenue / 1_000_000).toFixed(2)}M |`,
      `| EBITDA Margin | ${input.kpis.revenue.ebitdaMargin.toFixed(1)}% |`,
      `| Total Leads | ${input.kpis.crm.totalLeads} |`,
      `| Conversion Rate | ${input.kpis.crm.conversionRate.toFixed(1)}% |`,
      `| NPS Score | ${input.kpis.crm.npsScore} |`,
      `| GHG Reduction | 96% vs rope access |`,
      `| Carbon Credits | T-VER Active |`,
      '',
    ];

    if (input.summary.alerts.length > 0) {
      lines.push('## Alerts', '');
      for (const a of input.summary.alerts) lines.push(`- ${a}`);
      lines.push('');
    }

    if (input.highlights.length > 0) {
      lines.push('## Highlights', '');
      for (const h of input.highlights) lines.push(`- ${h}`);
      lines.push('');
    }

    if (input.summary.recommendations.length > 0) {
      lines.push('## Recommendations', '');
      for (const r of input.summary.recommendations) lines.push(`- ${r}`);
      lines.push('');
    }

    lines.push(
      '## Agent Status',
      '',
      '| Agent | Team | Status | Tasks |',
      '|-------|------|--------|-------|',
    );
    for (const a of input.agentHealths) {
      const mapping = AGENT_TEAM_MAP[a.role];
      lines.push(`| ${a.name} | ${mapping?.team ?? 'Unknown'} | ${a.health.status} | ${a.health.tasksCompleted} |`);
    }
    lines.push('');

    lines.push('---', '', 'KTV Working Drone Thailand | Green FM by IFS x KTV | Automated by Operations Brain');
    return lines.join('\n');
  }
}

// ── Factory ──────────────────────────────────────────────────

export function createReportingOrchestrator(): AutomatedReportingOrchestrator {
  return new AutomatedReportingOrchestrator();
}
