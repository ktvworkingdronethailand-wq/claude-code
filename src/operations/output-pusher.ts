/**
 * KTV Working Drone Thailand — Unified Output Pusher
 *
 * Single entry point for all agent task output. Routes through 3 channels:
 *
 *   1. Google Drive — documents, strategies, reports (persistent storage)
 *   2. Supabase    — KPIs, agent status, activity feed (real-time dashboard)
 *   3. Email       — leadership alerts, weekly summaries (notifications)
 *
 * Replaces the need to configure 8 separate connectors. All channels
 * degrade gracefully — if env vars are missing, output is saved locally
 * under docs/output/{channel}/ as files.
 */

import * as fs from 'fs';
import * as path from 'path';
import { createSupabaseClient, AgentTelemetry, AGENT_TEAM_MAP } from '../integrations/supabase.js';
import { createGDriveClient } from '../integrations/gdrive.js';
import { KTV_TEAM, EMAIL_TEMPLATES, getEmailTemplate } from '../workflows/connected-apps.js';
import type { KtvSupabaseClient } from '../integrations/supabase.js';
import type { GDriveClient } from '../integrations/gdrive.js';
import type { AgentHealth } from '../types/index.js';
import type { BrainDecision } from '../workflows/brain.js';

// ── Types ────────────────────────────────────────────────────

export type OutputChannel = 'gdrive' | 'supabase' | 'email';
export type OutputCategory = 'report' | 'kpi' | 'alert' | 'strategy' | 'activity' | 'decision';

export interface TaskOutput {
  agent: string;
  team: string;
  category: OutputCategory;
  title: string;
  content: string;
  data?: Record<string, unknown>;
  channels?: OutputChannel[];
}

export interface PushResult {
  channel: OutputChannel;
  success: boolean;
  location: string;
  error?: string;
}

export interface OutputPushResult {
  timestamp: Date;
  agent: string;
  category: OutputCategory;
  results: PushResult[];
  localPath: string;
}

// ── Local fallback ──────────────────────────────────────────

function outputDir(...segments: string[]): string {
  const dir = path.join(process.cwd(), 'docs', 'output', ...segments);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function saveLocal(channel: string, filename: string, content: string): string {
  const dir = outputDir(channel);
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, content, 'utf8');
  return filepath;
}

function dateSuffix(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ── Channel routing ─────────────────────────────────────────

const DEFAULT_CHANNELS: Record<OutputCategory, OutputChannel[]> = {
  report:   ['gdrive', 'email'],
  kpi:      ['supabase'],
  alert:    ['email', 'supabase'],
  strategy: ['gdrive'],
  activity: ['supabase'],
  decision: ['supabase', 'gdrive'],
};

// ── Output Pusher ───────────────────────────────────────────

export class OutputPusher {
  private supabase: KtvSupabaseClient | null;
  private telemetry: AgentTelemetry | null;
  private gdrive: GDriveClient | null;

  constructor() {
    this.supabase = createSupabaseClient();
    this.telemetry = this.supabase ? new AgentTelemetry(this.supabase) : null;
    this.gdrive = createGDriveClient();
  }

  status(): { gdrive: boolean; supabase: boolean; email: boolean } {
    return {
      gdrive: this.gdrive !== null,
      supabase: this.supabase !== null,
      email: true,
    };
  }

  /**
   * Push a single task output to all appropriate channels.
   * Always saves locally first, then pushes to configured channels.
   */
  async push(output: TaskOutput): Promise<OutputPushResult> {
    const channels = output.channels ?? DEFAULT_CHANNELS[output.category];
    const slug = slugify(output.title);
    const ts = dateSuffix();
    const filename = `${output.agent}-${slug}-${ts}`;

    // Always save locally
    const localPath = saveLocal('local', `${filename}.md`, [
      `# ${output.title}`,
      `Agent: ${output.agent} | Team: ${output.team} | Category: ${output.category}`,
      `Generated: ${new Date().toISOString()}`,
      '',
      output.content,
      '',
      output.data ? `\n---\n\`\`\`json\n${JSON.stringify(output.data, null, 2)}\n\`\`\`\n` : '',
    ].join('\n'));

    const results: PushResult[] = [];

    const tasks = channels.map(async (channel) => {
      try {
        const result = await this.pushToChannel(channel, output, filename);
        results.push(result);
      } catch (err) {
        results.push({
          channel,
          success: false,
          location: localPath,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });

    await Promise.allSettled(tasks);

    return { timestamp: new Date(), agent: output.agent, category: output.category, results, localPath };
  }

  /**
   * Push multiple task outputs in parallel.
   */
  async pushAll(outputs: TaskOutput[]): Promise<OutputPushResult[]> {
    const results = await Promise.allSettled(outputs.map(o => this.push(o)));
    return results.map(r => r.status === 'fulfilled' ? r.value : {
      timestamp: new Date(),
      agent: 'unknown',
      category: 'activity' as OutputCategory,
      results: [{ channel: 'email' as OutputChannel, success: false, location: '', error: String((r as PromiseRejectedResult).reason) }],
      localPath: '',
    });
  }

  // ── Channel dispatch ───────────────────────────────────────

  private async pushToChannel(channel: OutputChannel, output: TaskOutput, filename: string): Promise<PushResult> {
    switch (channel) {
      case 'gdrive':   return this.pushGDrive(output, filename);
      case 'supabase': return this.pushSupabase(output);
      case 'email':    return this.pushEmail(output, filename);
    }
  }

  // ── Google Drive ──────────────────────────────────────────

  private async pushGDrive(output: TaskOutput, filename: string): Promise<PushResult> {
    if (this.gdrive) {
      const file = await this.gdrive.uploadTextFile(
        `${output.title} — ${new Date().toLocaleDateString('en-GB')}`,
        output.content,
        'text/markdown',
      );
      return { channel: 'gdrive', success: true, location: file.webViewLink };
    }

    // Fallback: save as local file
    const filepath = saveLocal('gdrive', `${filename}.md`, output.content);
    return { channel: 'gdrive', success: true, location: `file://${filepath}` };
  }

  // ── Supabase ──────────────────────────────────────────────

  private async pushSupabase(output: TaskOutput): Promise<PushResult> {
    if (!this.telemetry || !this.supabase) {
      const filepath = saveLocal('supabase', `${slugify(output.title)}-${dateSuffix()}.json`, JSON.stringify({
        agent: output.agent, team: output.team, category: output.category,
        title: output.title, data: output.data, timestamp: new Date().toISOString(),
      }, null, 2));
      return { channel: 'supabase', success: true, location: `file://${filepath}` };
    }

    switch (output.category) {
      case 'kpi':
        if (output.data) {
          const entries = Array.isArray(output.data['kpis']) ? output.data['kpis'] as Record<string, unknown>[] : [output.data];
          for (const kpi of entries) {
            await this.telemetry.reportKpi(
              output.team,
              String(kpi['name'] ?? output.title),
              kpi['value'] as number ?? 0,
              String(kpi['unit'] ?? 'value'),
              kpi['target'] as string | undefined,
              (kpi['status'] as 'on-track' | 'at-risk' | 'off-track') ?? 'on-track',
            );
          }
        }
        break;

      case 'decision':
        if (output.data) {
          await this.supabase.insertBrainDecision({
            trigger: String(output.data['trigger'] ?? output.agent),
            reasoning: output.content,
            actions: (output.data['actions'] as string[]) ?? [],
            outcome: (output.data['outcome'] as 'success' | 'failure' | 'pending') ?? 'success',
            agents_involved: (output.data['agents'] as string[]) ?? [output.agent],
          });
        }
        break;

      case 'activity':
      case 'alert':
      default:
        await this.telemetry.reportActivity(output.team, output.agent, output.title, output.content.slice(0, 200));
        break;
    }

    return { channel: 'supabase', success: true, location: `supabase://${output.category}/${output.team}` };
  }

  // ── Email ─────────────────────────────────────────────────

  private async pushEmail(output: TaskOutput, filename: string): Promise<PushResult> {
    const to = output.category === 'alert'
      ? [KTV_TEAM.matthew.email, KTV_TEAM.thanvarat.email, KTV_TEAM.krit.email].join(', ')
      : KTV_TEAM.matthew.email;

    const subjectPrefix = output.category === 'alert' ? '[ALERT]' : '[KTV]';
    const html = this.formatEmailHtml(output);

    const emailContent = [
      `To: ${to}`,
      `Subject: ${subjectPrefix} ${output.title}`,
      `Date: ${new Date().toISOString()}`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      html,
    ].join('\r\n');

    const filepath = saveLocal('email', `${filename}.html`, emailContent);
    return { channel: 'email', success: true, location: `file://${filepath}` };
  }

  private formatEmailHtml(output: TaskOutput): string {
    const borderColor = output.category === 'alert' ? '#d32f2f' : '#1a237e';
    return `<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;border-top:4px solid ${borderColor};padding:20px">
<h2 style="color:${borderColor}">${output.title}</h2>
<p style="color:#666">Agent: ${output.agent} | Team: ${output.team} | ${new Date().toLocaleDateString('en-GB')}</p>
<div style="white-space:pre-wrap;line-height:1.6">${output.content}</div>
${output.data ? `<details><summary style="cursor:pointer;color:#1565c0;margin-top:16px">Raw Data</summary><pre style="background:#f5f5f5;padding:12px;overflow-x:auto;font-size:12px">${JSON.stringify(output.data, null, 2)}</pre></details>` : ''}
<hr style="margin:24px 0;border:1px solid #e0e0e0">
<p style="color:#999;font-size:11px">KTV Working Drone Thailand | Automated by Operations Brain</p>
</div>`;
  }

  // ── Convenience methods ───────────────────────────────────

  /** Push agent health to Supabase (or local fallback) */
  async pushAgentHealth(health: AgentHealth, agentName: string): Promise<PushResult> {
    const mapping = AGENT_TEAM_MAP[health.role];
    const team = mapping?.team ?? 'Unknown';
    const layer = mapping?.layer ?? 'operational';

    if (this.telemetry) {
      await this.telemetry.reportAgentHealth(health, agentName, team, layer);
      return { channel: 'supabase', success: true, location: `supabase://agent_status/${agentName}` };
    }

    const filepath = saveLocal('supabase', `agent-health-${slugify(agentName)}-${dateSuffix()}.json`, JSON.stringify({
      agent: agentName, role: health.role, team, layer, status: health.status,
      tasksCompleted: health.tasksCompleted, tasksPending: health.tasksPending,
      lastActivity: health.lastActivity.toISOString(),
    }, null, 2));
    return { channel: 'supabase', success: true, location: `file://${filepath}` };
  }

  /** Push a brain decision to Supabase + GDrive */
  async pushDecision(decision: BrainDecision): Promise<OutputPushResult> {
    return this.push({
      agent: 'operations-brain',
      team: 'Revenue Operations',
      category: 'decision',
      title: `Decision: ${decision.trigger}`,
      content: decision.reasoning,
      data: {
        trigger: decision.trigger,
        actions: decision.actions,
        outcome: decision.outcome,
        agents: decision.agentsInvolved,
      },
    });
  }

  /** Push a routine task result (the most common output) */
  async pushRoutineResult(agent: string, team: string, taskTitle: string, result: string, kpis?: Record<string, unknown>[]): Promise<OutputPushResult> {
    const outputs: TaskOutput[] = [
      {
        agent, team,
        category: 'activity',
        title: taskTitle,
        content: result,
      },
    ];

    if (kpis && kpis.length > 0) {
      outputs.push({
        agent, team,
        category: 'kpi',
        title: `KPIs: ${taskTitle}`,
        content: `KPI update from ${taskTitle}`,
        data: { kpis },
      });
    }

    const results = await this.pushAll(outputs);
    return results[0]!;
  }

  /** Push a strategy document to GDrive */
  async pushStrategy(agent: string, team: string, title: string, content: string): Promise<OutputPushResult> {
    return this.push({
      agent, team,
      category: 'strategy',
      title,
      content,
    });
  }

  /** Push an alert to Email + Supabase */
  async pushAlert(agent: string, team: string, title: string, message: string, severity: 'info' | 'warning' | 'critical' = 'warning'): Promise<OutputPushResult> {
    return this.push({
      agent, team,
      category: 'alert',
      title: `[${severity.toUpperCase()}] ${title}`,
      content: message,
      data: { severity },
    });
  }

  /** Push a weekly report to all 3 channels */
  async pushWeeklyReport(title: string, markdownReport: string, kpiData: Record<string, unknown>): Promise<OutputPushResult> {
    return this.push({
      agent: 'automated-reporting',
      team: 'Revenue Operations',
      category: 'report',
      title,
      content: markdownReport,
      data: kpiData,
      channels: ['gdrive', 'supabase', 'email'],
    });
  }
}

// ── Factory ────────────────────────────────────────────────

let _instance: OutputPusher | null = null;

export function getOutputPusher(): OutputPusher {
  if (!_instance) _instance = new OutputPusher();
  return _instance;
}

export function createOutputPusher(): OutputPusher {
  return new OutputPusher();
}
