/**
 * KTV Working Drone Thailand — Automated Reporting Orchestrator
 *
 * Distributes weekly operations reports to 8 platforms in parallel.
 * Each push function generates its platform-specific output as local files
 * under docs/reports/{platform}/ — ready for connector sync.
 *
 *   1. Notion — workspace page (markdown)
 *   2. Asana — team tasks (markdown + JSON)
 *   3. Airtable — KPI snapshot (JSON)
 *   4. Supabase — dashboard data (JSON)
 *   5. Gamma — presentation slides (markdown)
 *   6. Canva — pitch deck content (markdown)
 *   7. Google Drive — master report (markdown)
 *   8. Email — HTML report file
 */

import * as fs from 'fs';
import * as path from 'path';
import { AGENT_TEAM_MAP } from '../integrations/supabase.js';
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

// ── Helpers ──────────────────────────────────────────────────

function reportsDir(...segments: string[]): string {
  const dir = path.join(process.cwd(), 'docs', 'reports', ...segments);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function writeReport(platform: string, filename: string, content: string): string {
  const dir = reportsDir(platform);
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, content, 'utf8');
  return filepath;
}

function dateSuffix(): string {
  return new Date().toISOString().split('T')[0]!;
}

export function formatRevenueTHB(gross: number): string {
  return `THB ${(gross / 1_000_000).toFixed(2)}M`;
}

export function pct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function activeAgentCount(healths: WeeklyReportInput['agentHealths']): number {
  return healths.filter(a => a.health.status === 'active').length;
}

type KpiStatus = 'on-track' | 'at-risk' | 'off-track';

function kpiStatus(value: number, threshold: number, offTrackThreshold?: number): KpiStatus {
  if (offTrackThreshold !== undefined && value < offTrackThreshold) return 'off-track';
  return value >= threshold ? 'on-track' : 'at-risk';
}

function buildKpiRows(input: WeeklyReportInput): { team: string; name: string; value: string; target: string; status: KpiStatus }[] {
  return [
    { team: 'Service Delivery', name: 'Fleet Utilization', value: pct(input.kpis.fleet.utilization), target: '80%', status: kpiStatus(input.kpis.fleet.utilization, 70) },
    { team: 'Service Delivery', name: 'Fleet Availability', value: pct(input.kpis.fleet.availability), target: '90%', status: kpiStatus(input.kpis.fleet.availability, 80) },
    { team: 'Compliance & Safety', name: 'Preflight Pass Rate', value: pct(input.kpis.safety.preflightPassRate, 0), target: '95%', status: kpiStatus(input.kpis.safety.preflightPassRate, 95) },
    { team: 'Compliance & Safety', name: 'Days Without Incident', value: String(input.kpis.safety.daysWithoutIncident), target: '365', status: 'on-track' },
    { team: 'Revenue Operations', name: 'Gross Revenue', value: formatRevenueTHB(input.kpis.revenue.grossRevenue), target: 'THB 180.18M', status: kpiStatus(input.kpis.revenue.ebitdaMargin, 40) },
    { team: 'Revenue Operations', name: 'EBITDA Margin', value: pct(input.kpis.revenue.ebitdaMargin), target: '77.7%', status: kpiStatus(input.kpis.revenue.ebitdaMargin, 60) },
    { team: 'Growth Engine', name: 'Total Leads', value: String(input.kpis.crm.totalLeads), target: '50', status: kpiStatus(input.kpis.crm.totalLeads, 30) },
    { team: 'Growth Engine', name: 'Conversion Rate', value: pct(input.kpis.crm.conversionRate), target: '25%', status: kpiStatus(input.kpis.crm.conversionRate, 20) },
    { team: 'Ecosystem Builder', name: 'GHG Reduction', value: '96%', target: '90%', status: 'on-track' },
    { team: 'Ecosystem Builder', name: 'Carbon Credits (T-VER)', value: 'Active', target: 'Generating', status: 'on-track' },
  ];
}

// ── Orchestrator ─────────────────────────────────────────────

export class AutomatedReportingOrchestrator {

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
    const online = activeAgentCount(input.agentHealths);

    const lines: string[] = [
      `# Weekly Ops Report — ${input.period}`,
      '',
      `> ${input.summary.headline}`,
      '',
      '## Executive Summary',
      '',
      input.summary.headline,
      '',
    ];

    if (input.summary.alerts.length > 0) {
      lines.push('### Alerts', '');
      for (const a of input.summary.alerts) lines.push(`- **Alert:** ${a}`);
      lines.push('');
    }

    for (const rec of input.summary.recommendations) {
      lines.push(`- **Rec:** ${rec}`);
    }

    lines.push(
      '', '---', '', '## Key Metrics', '',
      '| Metric | Value |',
      '|--------|-------|',
      `| Agents Online | ${online}/${input.agentHealths.length} |`,
      `| Fleet Utilization | ${pct(input.kpis.fleet.utilization)} |`,
      `| Fleet Availability | ${pct(input.kpis.fleet.availability)} |`,
      `| Safety | ${input.kpis.safety.daysWithoutIncident} days incident-free |`,
      `| Preflight Pass Rate | ${pct(input.kpis.safety.preflightPassRate, 0)} |`,
      `| Revenue | ${formatRevenueTHB(input.kpis.revenue.grossRevenue)} |`,
      `| EBITDA | ${pct(input.kpis.revenue.ebitdaMargin)} |`,
      `| CRM | ${input.kpis.crm.totalLeads} leads, ${pct(input.kpis.crm.conversionRate)} conv |`,
      `| Jobs | ${input.kpis.jobs.activeJobs} active, ${input.kpis.jobs.completedThisPeriod} completed |`,
      `| GHG Reduction | 96% vs rope access |`,
      `| Carbon Credits | T-VER Active |`,
      '',
    );

    if (input.highlights.length > 0) {
      lines.push('## Highlights', '');
      for (const h of input.highlights) lines.push(`- ${h}`);
      lines.push('');
    }

    lines.push('---', '', '_KTV Working Drone Thailand | Automated by Operations Brain_');

    const filepath = writeReport('notion', `weekly-report-${dateSuffix()}.md`, lines.join('\n'));
    console.log(`[AutoReport] Notion page saved: ${filepath}`);

    return { platform: 'Notion', success: true, url: `file://${filepath}`, durationMs: Date.now() - start };
  }

  // ── 2. Asana — Weekly tasks per CoWork team ───────────────

  async pushToAsana(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();

    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const dueOn = weekEnd.toISOString().split('T')[0];

    const teamTasks = buildTeamTasks(input.kpis);

    const mdLines: string[] = [
      `# Asana Weekly Tasks — ${input.period}`,
      `> Project: Weekly Report — ${input.period}`,
      `> Due: ${dueOn}`,
      `> Summary: ${input.summary.headline}`,
      '',
    ];

    const jsonTasks: unknown[] = [];

    for (const tt of teamTasks) {
      mdLines.push(`## ${tt.team}`, '');
      for (const task of tt.tasks) {
        mdLines.push(`- [ ] [${tt.team}] ${task}`);
        jsonTasks.push({ team: tt.team, task, dueOn, status: 'pending' });
      }
      mdLines.push('');
    }

    mdLines.push(`**Total: ${jsonTasks.length} tasks across ${teamTasks.length} teams**`);

    writeReport('asana', `weekly-tasks-${dateSuffix()}.md`, mdLines.join('\n'));
    const filepath = writeReport('asana', `weekly-tasks-${dateSuffix()}.json`, JSON.stringify(jsonTasks, null, 2));
    console.log(`[AutoReport] Asana tasks saved: ${filepath}`);

    return { platform: 'Asana', success: true, url: `file://${filepath}`, durationMs: Date.now() - start };
  }

  // ── 3. Airtable — Strategy KPIs and agent status ──────────

  async pushToAirtable(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();

    const agentRows = input.agentHealths.map(a => ({
      name: a.name,
      role: a.role,
      team: AGENT_TEAM_MAP[a.role]?.team ?? 'Unknown',
      layer: AGENT_TEAM_MAP[a.role]?.layer ?? 'operational',
      status: a.health.status,
      tasksCompleted: a.health.tasksCompleted,
      lastActivity: a.health.lastActivity,
    }));

    const kpiRows = buildKpiRows(input);

    const data = { generatedAt: new Date().toISOString(), period: input.period, agents: agentRows, kpis: kpiRows };
    const filepath = writeReport('airtable', `kpi-snapshot-${dateSuffix()}.json`, JSON.stringify(data, null, 2));
    console.log(`[AutoReport] Airtable KPI snapshot saved: ${filepath}`);

    return { platform: 'Airtable', success: true, url: `file://${filepath}`, durationMs: Date.now() - start };
  }

  // ── 4. Supabase — Full dashboard update ───────────────────

  async pushToSupabase(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();

    const agentStatus = input.agentHealths.map(a => {
      const mapping = AGENT_TEAM_MAP[a.role];
      return {
        agent: a.name,
        role: a.role,
        team: mapping?.team ?? 'Unknown',
        layer: mapping?.layer ?? 'operational',
        status: a.health.status,
        tasksCompleted: a.health.tasksCompleted,
        tasksPending: a.health.tasksPending,
        lastActivity: a.health.lastActivity,
      };
    });

    const kpiSnapshots = buildKpiRows(input).map(row => ({
      team: row.team,
      kpi: row.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      value: row.value,
      unit: row.value.includes('%') ? '%' : row.value.startsWith('THB') ? 'THB' : 'value',
      target: row.target,
      status: row.status,
    }));

    const activity = {
      team: 'Revenue Operations',
      agent: 'automated-reporting',
      action: 'Weekly report distributed',
      detail: `Period: ${input.period} | ${input.summary.headline}`,
      timestamp: new Date().toISOString(),
    };

    const data = { generatedAt: new Date().toISOString(), period: input.period, agentStatus, kpiSnapshots, activity };
    const filepath = writeReport('supabase', `dashboard-${dateSuffix()}.json`, JSON.stringify(data, null, 2));
    console.log(`[AutoReport] Supabase dashboard data saved: ${filepath}`);

    return { platform: 'Supabase', success: true, url: `file://${filepath}`, durationMs: Date.now() - start };
  }

  // ── 5. Gamma — Generate presentation report ───────────────

  async pushToGamma(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    const online = activeAgentCount(input.agentHealths);

    const slides: string[] = [
      `# KTV Weekly Status — ${input.period}`,
      '',
      '---',
      '',
      '## Slide 1: Executive Summary',
      '',
      `**${input.summary.headline}**`,
      '',
      `- Agents Online: ${online}/${input.agentHealths.length}`,
      `- Missions Completed: ${input.kpis.jobs.completedThisPeriod}`,
      `- Revenue: ${formatRevenueTHB(input.kpis.revenue.grossRevenue)}`,
      `- Incidents: ${input.kpis.safety.incidentRate > 0 ? '1' : '0'}`,
      '',
      '---',
      '',
      '## Slide 2: Fleet & Operations',
      '',
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Fleet Utilization | ${pct(input.kpis.fleet.utilization)} |`,
      `| Fleet Availability | ${pct(input.kpis.fleet.availability)} |`,
      `| Active Jobs | ${input.kpis.jobs.activeJobs} |`,
      `| Avg Cycle Time | ${input.kpis.jobs.avgCycleTimeDays} days |`,
      '',
      '---',
      '',
      '## Slide 3: Safety & Compliance',
      '',
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Days Without Incident | ${input.kpis.safety.daysWithoutIncident} |`,
      `| Preflight Pass Rate | ${pct(input.kpis.safety.preflightPassRate, 0)} |`,
      `| Risk Assessments | ${input.kpis.safety.riskAssessmentsCompleted} completed |`,
      `| CAAT Compliance | 100% |`,
      '',
      '---',
      '',
      '## Slide 4: Revenue & Growth',
      '',
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Gross Revenue | ${formatRevenueTHB(input.kpis.revenue.grossRevenue)} |`,
      `| EBITDA Margin | ${pct(input.kpis.revenue.ebitdaMargin)} |`,
      `| Total Leads | ${input.kpis.crm.totalLeads} |`,
      `| Conversion Rate | ${pct(input.kpis.crm.conversionRate)} |`,
      `| NPS Score | ${input.kpis.crm.npsScore} |`,
      '',
      '---',
      '',
      '## Slide 5: ESG & Climate Act',
      '',
      '- GHG Reduction: 96% vs rope access baseline',
      '- Carbon Credits: T-VER pipeline active',
      '- IoT Monitoring: PM2.5, CO2, VOC, energy — all online',
      '- Frameworks: GRESB, TREES, LEED, SET 56-1 mapped',
      '',
      '---',
      '',
      '## Slide 6: Highlights',
      '',
      ...input.highlights.map(h => `- ${h}`),
      '',
      '---',
      '',
      '_KTV Working Drone Thailand | Green FM by IFS x KTV_',
    ];

    const filepath = writeReport('gamma', `weekly-deck-${dateSuffix()}.md`, slides.join('\n'));
    console.log(`[AutoReport] Gamma presentation saved: ${filepath}`);

    return { platform: 'Gamma', success: true, url: `file://${filepath}`, durationMs: Date.now() - start };
  }

  // ── 6. Canva — Create pitch deck from brand template ──────

  async pushToCanva(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    const online = activeAgentCount(input.agentHealths);

    const deck: string[] = [
      `# KTV Pitch Deck — ${input.period}`,
      '',
      '## Cover',
      '',
      '**KTV Working Drone Thailand**',
      'Green FM by IFS x KTV | Thailand\'s First Carbon-Verified FM Provider',
      '',
      '---',
      '',
      '## The Challenge',
      '',
      '- 104,000 sqm of facade at One Bangkok',
      '- 40%+ fatality rate from work-at-height in Thailand',
      '- Traditional methods: slow, dangerous, expensive (80-150 THB/sqm)',
      '',
      '---',
      '',
      '## The KTV Solution',
      '',
      `- ${input.agentHealths.length} AI agents managing operations autonomously`,
      `- ${online}/${input.agentHealths.length} agents online this week`,
      '- 16 DJI enterprise drones, 10 certified pilots',
      '- Zero workers at height, zero fall risk',
      '',
      '---',
      '',
      '## This Week\'s Performance',
      '',
      `| KPI | Value |`,
      `|-----|-------|`,
      `| Missions Completed | ${input.kpis.jobs.completedThisPeriod} |`,
      `| Revenue | ${formatRevenueTHB(input.kpis.revenue.grossRevenue)} |`,
      `| EBITDA | ${pct(input.kpis.revenue.ebitdaMargin)} |`,
      `| Safety Record | ${input.kpis.safety.daysWithoutIncident} days incident-free |`,
      `| Fleet Utilization | ${pct(input.kpis.fleet.utilization)} |`,
      '',
      '---',
      '',
      '## Cost Comparison',
      '',
      '- KTV Drone: 30 THB/sqm',
      '- Rope Access: 80-150 THB/sqm',
      '- **Savings: 60-70%**',
      '',
      '---',
      '',
      '## Smart Green ESG',
      '',
      '- 96% GHG reduction vs traditional methods',
      '- T-VER carbon credits active with TGO',
      '- GRESB, TREES, LEED, WELL, SET compatible',
      '- IoT monitoring: PM2.5, CO2, VOC, energy',
      '',
      '---',
      '',
      '## Partnership Model',
      '',
      '- **KTV** (air) — drone operations, AI agents, data processing',
      '- **IFS** (digital) — Green FM platform, IoT, ESG analytics',
      '- **PCS** (ground) — rope access, physical maintenance',
      '',
      '---',
      '',
      '## Exclusive Offer',
      '',
      '- 90-day paid pilot at One Bangkok',
      '- THB 23.97M ACV, 77.7% EBITDA margin',
      '- 3.6-month payback period',
      '',
      '---',
      '',
      '_KTV Working Drone Thailand | KTV Group (est. 1992, Norway, 66 franchises)_',
    ];

    const filepath = writeReport('canva', `pitch-deck-${dateSuffix()}.md`, deck.join('\n'));
    console.log(`[AutoReport] Canva pitch deck saved: ${filepath}`);

    return { platform: 'Canva', success: true, url: `file://${filepath}`, durationMs: Date.now() - start };
  }

  // ── 7. Google Drive — Upload master report file ───────────

  async pushToGDrive(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    const reportContent = this.formatMarkdownReport(input);
    const filepath = writeReport('gdrive', `KTV-Weekly-Report-${input.period.replace(/\s/g, '-')}.md`, reportContent);
    console.log(`[AutoReport] Google Drive report saved: ${filepath}`);
    return { platform: 'Google Drive', success: true, url: `file://${filepath}`, durationMs: Date.now() - start };
  }

  // ── 8. Email — Send to matthew@ktvworkingdronethailand.com ─

  async sendEmailReport(input: WeeklyReportInput): Promise<ReportDistributionResult> {
    const start = Date.now();
    const subject = `KTV Weekly Ops Report — ${input.period} | ${input.summary.headline}`;
    const body = this.formatEmailBody(input);

    const emailFile = [
      `To: matthew@ktvworkingdronethailand.com`,
      `Cc: thanvarat@ktvworkingdronethailand.com, krit@ktvworkingdronethailand.com`,
      `Subject: ${subject}`,
      `Date: ${new Date().toISOString()}`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      body,
    ].join('\r\n');

    const filepath = writeReport('email', `weekly-report-${dateSuffix()}.html`, emailFile);
    console.log(`[AutoReport] Email report saved: ${filepath}`);

    return { platform: 'Email', success: true, url: `file://${filepath}`, durationMs: Date.now() - start };
  }

  // ── Format Helpers ────────────────────────────────────────

  private formatEmailBody(input: WeeklyReportInput): string {
    const activeAgents = activeAgentCount(input.agentHealths);
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
<tr><td style="padding:8px;border:1px solid #ccc"><strong>Fleet</strong></td><td style="padding:8px;border:1px solid #ccc">Util: ${pct(input.kpis.fleet.utilization)} | Avail: ${pct(input.kpis.fleet.availability)}</td></tr>
<tr style="background:#e8eaf6"><td style="padding:8px;border:1px solid #ccc"><strong>Safety</strong></td><td style="padding:8px;border:1px solid #ccc">${input.kpis.safety.daysWithoutIncident} days incident-free | Preflight: ${pct(input.kpis.safety.preflightPassRate, 0)}</td></tr>
<tr><td style="padding:8px;border:1px solid #ccc"><strong>Revenue</strong></td><td style="padding:8px;border:1px solid #ccc">${formatRevenueTHB(input.kpis.revenue.grossRevenue)} gross | EBITDA: ${pct(input.kpis.revenue.ebitdaMargin)}</td></tr>
<tr style="background:#e8eaf6"><td style="padding:8px;border:1px solid #ccc"><strong>CRM</strong></td><td style="padding:8px;border:1px solid #ccc">${input.kpis.crm.totalLeads} leads | ${pct(input.kpis.crm.conversionRate)} conversion | NPS: ${input.kpis.crm.npsScore}</td></tr>
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
    const online = activeAgentCount(input.agentHealths);
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
      `| Agents Online | ${online}/${input.agentHealths.length} |`,
      `| Fleet Utilization | ${pct(input.kpis.fleet.utilization)} |`,
      `| Fleet Availability | ${pct(input.kpis.fleet.availability)} |`,
      `| Maintenance Alerts | ${input.kpis.fleet.maintenanceAlerts} |`,
      `| Preflight Pass Rate | ${pct(input.kpis.safety.preflightPassRate, 0)} |`,
      `| Days Without Incident | ${input.kpis.safety.daysWithoutIncident} |`,
      `| Active Jobs | ${input.kpis.jobs.activeJobs} |`,
      `| Completed This Period | ${input.kpis.jobs.completedThisPeriod} |`,
      `| Gross Revenue | ${formatRevenueTHB(input.kpis.revenue.grossRevenue)} |`,
      `| EBITDA Margin | ${pct(input.kpis.revenue.ebitdaMargin)} |`,
      `| Total Leads | ${input.kpis.crm.totalLeads} |`,
      `| Conversion Rate | ${pct(input.kpis.crm.conversionRate)} |`,
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

export function buildTeamTasks(kpis: WeeklyReportInput['kpis']): { team: string; tasks: string[] }[] {
  return [
    {
      team: 'Growth Engine',
      tasks: [
        `Review ${kpis.crm.totalLeads} leads — qualify top 5 for IFS channel`,
        `Conversion rate: ${pct(kpis.crm.conversionRate)} — ${kpis.crm.conversionRate < 20 ? 'ACTION: improve follow-up cadence' : 'on track'}`,
        'Update IFS Green FM pipeline with Climate Act compliance messaging',
      ],
    },
    {
      team: 'Service Delivery',
      tasks: [
        `${kpis.jobs.activeJobs} active jobs — ensure all have assigned pilots/drones`,
        `Fleet availability: ${pct(kpis.fleet.availability)} — ${kpis.fleet.maintenanceAlerts > 0 ? `resolve ${kpis.fleet.maintenanceAlerts} maintenance alerts` : 'clear'}`,
        'Verify IoT sensor calibration on all deployed drones',
      ],
    },
    {
      team: 'Compliance & Safety',
      tasks: [
        `Preflight pass rate: ${pct(kpis.safety.preflightPassRate, 0)} — ${kpis.safety.preflightPassRate < 95 ? 'ACTION: review failed checklists' : 'meets target'}`,
        `Days without incident: ${kpis.safety.daysWithoutIncident}`,
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
        `Gross revenue: ${formatRevenueTHB(kpis.revenue.grossRevenue)} — EBITDA: ${pct(kpis.revenue.ebitdaMargin)}`,
        `Invoices: ${kpis.revenue.invoicesPaid} paid | ${kpis.revenue.invoicesOverdue} overdue`,
        'Model carbon credit revenue stream from verified drone missions',
      ],
    },
  ];
}

export function createReportingOrchestrator(): AutomatedReportingOrchestrator {
  return new AutomatedReportingOrchestrator();
}
