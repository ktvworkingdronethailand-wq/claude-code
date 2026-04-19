/**
 * KTV Working Drone Thailand — Canva Integration
 *
 * Creates pitch decks and presentations via the Canva Connect API.
 * Supports design creation, brand template autofill, and PPTX export.
 *
 * Setup:
 *   1. Register app at https://www.canva.dev
 *   2. Set CANVA_ACCESS_TOKEN (OAuth2 bearer token)
 *   3. Optionally set CANVA_BRAND_TEMPLATE_ID for autofill workflows
 */

// ── Types ─────────────────────────────────────────────────────

export interface CanvaConfig {
  accessToken: string;
  brandTemplateId?: string;
}

export interface CanvaDesign {
  id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
  thumbnail?: { url: string };
}

export interface CanvaExportJob {
  id: string;
  status: 'in_progress' | 'completed' | 'failed';
  urls?: string[];
}

export interface CanvaAutofillJob {
  id: string;
  status: 'in_progress' | 'completed' | 'failed';
  result?: { design: CanvaDesign };
}

export type CanvaDesignType = 'presentation' | 'doc' | 'whiteboard';
export type CanvaExportFormat = 'pdf' | 'jpg' | 'png' | 'pptx' | 'gif' | 'mp4';

// ── Client ────────────────────────────────────────────────────

export class CanvaClient {
  private base = 'https://api.canva.com/rest/v1';
  private headers: Record<string, string>;

  constructor(private config: CanvaConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
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
      throw new Error(`Canva ${method} ${path} → ${res.status}: ${json['message'] ?? JSON.stringify(json)}`);
    }
    return json as T;
  }

  // ── Designs ───────────────────────────────────────────────

  async createDesign(title: string, type: CanvaDesignType = 'presentation'): Promise<CanvaDesign> {
    const data = await this.request<{ design: CanvaDesign }>('POST', '/designs', {
      design_type: { type: 'preset', name: type },
      title,
    });
    return data.design;
  }

  async listDesigns(limit = 50): Promise<CanvaDesign[]> {
    const data = await this.request<{ items: CanvaDesign[] }>('GET', `/designs?ownership=owned&sort_by=modified_descending&count=${limit}`);
    return data.items;
  }

  async getDesign(designId: string): Promise<CanvaDesign> {
    const data = await this.request<{ design: CanvaDesign }>('GET', `/designs/${designId}`);
    return data.design;
  }

  // ── Brand Template Autofill ───────────────────────────────

  async listBrandTemplates(limit = 50): Promise<{ id: string; title: string }[]> {
    const data = await this.request<{ items: { id: string; title: string }[] }>('GET', `/brand-templates?count=${limit}`);
    return data.items;
  }

  async getTemplateDataset(templateId: string): Promise<Record<string, { type: string }>> {
    const data = await this.request<{ dataset: Record<string, { type: string }> }>('GET', `/brand-templates/${templateId}/dataset`);
    return data.dataset;
  }

  async autofillTemplate(templateId: string, title: string, data: Record<string, { type: string; text?: string; asset_id?: string }>): Promise<CanvaAutofillJob> {
    const result = await this.request<{ job: CanvaAutofillJob }>('POST', '/autofills', {
      brand_template_id: templateId,
      title,
      data,
    });
    return result.job;
  }

  async getAutofillJob(jobId: string): Promise<CanvaAutofillJob> {
    const data = await this.request<{ job: CanvaAutofillJob }>('GET', `/autofills/${jobId}`);
    return data.job;
  }

  // ── Export ────────────────────────────────────────────────

  async createExport(designId: string, format: CanvaExportFormat = 'pptx'): Promise<CanvaExportJob> {
    const data = await this.request<{ job: CanvaExportJob }>('POST', '/exports', {
      design_id: designId,
      format: { type: format },
    });
    return data.job;
  }

  async getExportJob(exportId: string): Promise<CanvaExportJob> {
    const data = await this.request<{ job: CanvaExportJob }>('GET', `/exports/${exportId}`);
    return data.job;
  }

  async waitForExport(exportId: string, maxWaitMs = 30_000): Promise<CanvaExportJob> {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      const job = await this.getExportJob(exportId);
      if (job.status !== 'in_progress') return job;
      await new Promise(r => setTimeout(r, 2000));
    }
    throw new Error(`Canva export ${exportId} timed out after ${maxWaitMs}ms`);
  }

  // ── KTV Push Functions ────────────────────────────────────

  async pushOneBangkokPitchDeck(): Promise<CanvaDesign> {
    const templateId = this.config.brandTemplateId;
    if (templateId) {
      const job = await this.autofillTemplate(templateId, 'One Bangkok Deserves One Solution — KTV Drone Services', {
        title: { type: 'text', text: 'One Bangkok Deserves One Solution' },
        subtitle: { type: 'text', text: 'Drone-Enabled Facade Intelligence for Southeast Asia\'s Most Ambitious Development' },
        company: { type: 'text', text: 'KTV Working Drone + IFS Thailand + PCS Ground FM' },
        challenge: { type: 'text', text: '104,000 sqm · 40%+ fatality rate from work-at-height · Zero ESG data from traditional cleaning' },
        solution: { type: 'text', text: '16 Drones · 10 Certified Pilots · Zero Workers at Height · Smart Green ESG Platform' },
        cost_savings: { type: 'text', text: '30 THB/sqm vs 80-150 THB · 60-70% savings · ACV: THB 23.97M · EBITDA: 77.7%' },
        safety: { type: 'text', text: '0 workers at height · 0 fall risk hours · 100% elimination of work-at-height incidents' },
        esg: { type: 'text', text: '96% GHG reduction · GRESB, TREES, LEED, WELL, SET compatible · T-VER carbon credits' },
        partnership: { type: 'text', text: 'KTV (air) + IFS (digital) + PCS (ground) · One invoice · One SLA · One escalation path' },
        next_steps: { type: 'text', text: 'Phase 1: 90-day paid pilot on single tower · Full CARE cycle demonstration' },
      });
      return this.waitForAutofill(job.id);
    }

    return this.createDesign('One Bangkok Deserves One Solution — KTV Drone Services', 'presentation');
  }

  async pushGreenFmPitchDeck(): Promise<CanvaDesign> {
    const templateId = this.config.brandTemplateId;
    if (templateId) {
      const job = await this.autofillTemplate(templateId, 'Green FM by IFS × KTV — Carbon-Verified FM', {
        title: { type: 'text', text: 'Green FM by IFS × KTV' },
        subtitle: { type: 'text', text: 'Thailand\'s First Carbon-Verified Facility Management Service' },
        climate_act: { type: 'text', text: 'Thailand Climate Change Act: ETS cap-and-trade · Mandatory GHG reporting · Carbon tax · CBAM' },
        green_advantage: { type: 'text', text: '96% GHG reduction verified per mission · T-VER carbon credits · IoT environmental monitoring' },
        iot_monitoring: { type: 'text', text: 'PM2.5 · CO2 · VOC · Temperature · Humidity · Water · Chemical · Energy tracking' },
        carbon_credits: { type: 'text', text: 'Every drone mission → GHG calculation → T-VER verification → tradeable carbon credit' },
        compliance: { type: 'text', text: 'Climate Act · GRESB · TREES · LEED · SET 56-1 · T-VER — all covered' },
        vs_traditional: { type: 'text', text: 'Green FM: 30 THB/sqm, carbon credits, automated ESG · Traditional: 80-150 THB/sqm, carbon liability, no data' },
        next_steps: { type: 'text', text: 'Phase 1: Green FM Pilot (90 days) · IoT deployment · First GHG report & T-VER credits' },
      });
      return this.waitForAutofill(job.id);
    }

    return this.createDesign('Green FM by IFS × KTV — Carbon-Verified FM Provider', 'presentation');
  }

  async pushWeeklyStatusDeck(data: {
    agentsOnline: number;
    totalAgents: number;
    missionsCompleted: number;
    revenue: string;
    incidents: number;
    highlights: string[];
  }): Promise<CanvaDesign> {
    const title = `KTV Weekly Operations — ${new Date().toLocaleDateString('en-GB')}`;
    const templateId = this.config.brandTemplateId;

    if (templateId) {
      const job = await this.autofillTemplate(templateId, title, {
        title: { type: 'text', text: 'Weekly Operations Status' },
        date: { type: 'text', text: new Date().toLocaleDateString('en-GB') },
        agents: { type: 'text', text: `${data.agentsOnline}/${data.totalAgents} Agents Online` },
        missions: { type: 'text', text: `${data.missionsCompleted} Missions Completed` },
        revenue: { type: 'text', text: `Revenue: ${data.revenue}` },
        safety: { type: 'text', text: `Safety Incidents: ${data.incidents}` },
        highlights: { type: 'text', text: data.highlights.join('\n') },
      });
      return this.waitForAutofill(job.id);
    }

    return this.createDesign(title, 'presentation');
  }

  private async waitForAutofill(jobId: string, maxWaitMs = 30_000): Promise<CanvaDesign> {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      const job = await this.getAutofillJob(jobId);
      if (job.status === 'completed' && job.result) return job.result.design;
      if (job.status === 'failed') throw new Error(`Canva autofill ${jobId} failed`);
      await new Promise(r => setTimeout(r, 2000));
    }
    throw new Error(`Canva autofill ${jobId} timed out after ${maxWaitMs}ms`);
  }
}

// ── Factory ───────────────────────────────────────────────────

export function createCanvaClient(): CanvaClient | null {
  const token = process.env['CANVA_ACCESS_TOKEN'];
  if (!token) {
    console.warn('[Canva] CANVA_ACCESS_TOKEN not set — Canva presentation push disabled');
    return null;
  }
  return new CanvaClient({ accessToken: token, brandTemplateId: process.env['CANVA_BRAND_TEMPLATE_ID'] });
}
