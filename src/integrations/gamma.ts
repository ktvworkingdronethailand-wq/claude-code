/**
 * KTV Working Drone Thailand — Gamma Integration
 *
 * Creates pitch decks, reports, and presentations via the Gamma API.
 * Reads existing decks and generates new ones from KTV content.
 *
 * Setup:
 *   1. Get an API key from https://gamma.app/settings/api
 *   2. Set GAMMA_API_KEY env var
 *   3. Optionally set GAMMA_WORKSPACE_ID for team workspace
 */

// ── Types ─────────────────────────────────────────────────────

export interface GammaConfig {
  apiKey: string;
  workspaceId?: string;
}

export type GammaDocType = 'presentation' | 'document' | 'webpage';

export interface GammaDoc {
  id: string;
  title: string;
  type: GammaDocType;
  url: string;
  createdAt: string;
  updatedAt: string;
  cardCount: number;
}

export interface GammaCard {
  id: string;
  title: string;
  content: string;
  index: number;
}

export interface GammaGenerateInput {
  title: string;
  type: GammaDocType;
  topic: string;
  cards?: { title: string; content: string }[];
  outline?: string;
  tone?: 'professional' | 'casual' | 'formal' | 'persuasive';
  style?: 'minimal' | 'modern' | 'corporate' | 'bold';
  cardCount?: number;
}

export interface GammaGenerateResult {
  id: string;
  url: string;
  title: string;
  type: GammaDocType;
  cardCount: number;
}

// ── Client ────────────────────────────────────────────────────

export class GammaClient {
  private base = 'https://api.gamma.app/v1';
  private headers: Record<string, string>;

  constructor(private config: GammaConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.apiKey}`,
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
      throw new Error(`Gamma ${method} ${path} → ${res.status}: ${json['message'] ?? JSON.stringify(json)}`);
    }
    return json as T;
  }

  // ── Read Existing Decks ───────────────────────────────────

  /** List all presentations/documents in the workspace */
  async listDocs(type?: GammaDocType, limit = 50): Promise<GammaDoc[]> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (type) params.set('type', type);
    if (this.config.workspaceId) params.set('workspace_id', this.config.workspaceId);
    const data = await this.request<{ docs: GammaDoc[] }>('GET', `/docs?${params}`);
    return data.docs;
  }

  /** Get a single document by ID */
  async getDoc(docId: string): Promise<GammaDoc> {
    return this.request<GammaDoc>('GET', `/docs/${docId}`);
  }

  /** Get all cards/slides from a document */
  async getCards(docId: string): Promise<GammaCard[]> {
    const data = await this.request<{ cards: GammaCard[] }>('GET', `/docs/${docId}/cards`);
    return data.cards;
  }

  /** Search documents by title/content */
  async searchDocs(query: string, type?: GammaDocType): Promise<GammaDoc[]> {
    const params = new URLSearchParams({ q: query });
    if (type) params.set('type', type);
    if (this.config.workspaceId) params.set('workspace_id', this.config.workspaceId);
    const data = await this.request<{ docs: GammaDoc[] }>('GET', `/docs/search?${params}`);
    return data.docs;
  }

  // ── Create New Decks / Reports ────────────────────────────

  /** Generate a new presentation, document, or webpage from a topic/outline */
  async generate(input: GammaGenerateInput): Promise<GammaGenerateResult> {
    const payload: Record<string, unknown> = {
      title: input.title,
      type: input.type,
      topic: input.topic,
      tone: input.tone ?? 'professional',
      style: input.style ?? 'corporate',
    };
    if (input.cards) payload['cards'] = input.cards;
    if (input.outline) payload['outline'] = input.outline;
    if (input.cardCount) payload['card_count'] = input.cardCount;
    if (this.config.workspaceId) payload['workspace_id'] = this.config.workspaceId;

    return this.request<GammaGenerateResult>('POST', '/generate', payload);
  }

  /** Create a presentation from explicit slide content */
  async createPresentation(title: string, slides: { title: string; content: string }[]): Promise<GammaGenerateResult> {
    return this.generate({
      title,
      type: 'presentation',
      topic: title,
      cards: slides,
      tone: 'professional',
      style: 'corporate',
    });
  }

  /** Create a document/report from structured content */
  async createReport(title: string, sections: { title: string; content: string }[]): Promise<GammaGenerateResult> {
    return this.generate({
      title,
      type: 'document',
      topic: title,
      cards: sections,
      tone: 'formal',
      style: 'corporate',
    });
  }

  /** Generate a deck from a text outline (Gamma AI builds the slides) */
  async generateFromOutline(title: string, outline: string, type: GammaDocType = 'presentation'): Promise<GammaGenerateResult> {
    return this.generate({ title, type, topic: title, outline, tone: 'professional', style: 'corporate' });
  }

  /** Duplicate an existing deck as a starting point */
  async duplicateDoc(docId: string, newTitle: string): Promise<GammaGenerateResult> {
    return this.request<GammaGenerateResult>('POST', `/docs/${docId}/duplicate`, { title: newTitle });
  }

  /** Delete a document */
  async deleteDoc(docId: string): Promise<void> {
    await this.request('DELETE', `/docs/${docId}`);
  }

  // ── KTV Push Functions ────────────────────────────────────

  /**
   * Generate the One Bangkok pitch deck from the existing outline.
   * 10-slide investor deck covering challenge, solution, CARE framework,
   * IFS integration, safety, cost savings, ESG, partnership, and next steps.
   */
  async pushOneBangkokPitchDeck(): Promise<GammaGenerateResult> {
    return this.createPresentation('One Bangkok Deserves One Solution — KTV Drone Services', [
      {
        title: 'One Bangkok Deserves One Solution',
        content: 'Drone-Enabled Facade Intelligence for Southeast Asia\'s Most Ambitious Development\nKTV Working Drone + IFS Thailand + PCS Ground FM',
      },
      {
        title: 'The Challenge',
        content: '104,000 sqm. Multiple Towers. One Unacceptable Status Quo.\n\n- Traditional methods: rope access, gondola, scaffolding\n- 40%+ of Thai building maintenance fatalities from work-at-height\n- 4-6 month cleaning cycles using conventional methods\n- Zero ESG data from traditional cleaning\n- Premium tenants expect immaculate presentation',
      },
      {
        title: 'The KTV Solution',
        content: '16 Drones. 10 Certified Pilots. Zero Workers at Height.\n\n- Norwegian-backed drone services company (KTV Group, est. 1992, 66 franchises)\n- Purpose-built fleet for facade cleaning + thermal inspection\n- Smart Green ESG telemetry platform\n- Operational today — not a prototype\n- Tested on Icon of the Seas (400m, world\'s largest cruise ship)',
      },
      {
        title: 'KTV CARE Framework',
        content: 'Clean. Assess. Report. Ensure.\n\nC = Drone facade & solar cleaning — pressure-calibrated, zero scaffolding\nA = Thermal imaging, structural inspection, defect mapping — 48MP RGB + radiometric thermal\nR = Smart Green ESG dashboards — GRI, GRESB, LEED, WELL compatible\nE = IFS-integrated scheduling & predictive maintenance\n\nOne integrated cycle, not four separate services.',
      },
      {
        title: 'IFS Integration',
        content: 'Every Flight Generates Data. Every Data Point Becomes Action.\n\nKTV Drone Fleet → Smart Green → IFS Cloud → PCS Ground Teams\n\n- Automated work order generation from inspection findings\n- Historical trending builds asset health profiles\n- BMS/CMMS closed-loop integration\n- Single dashboard for all drone-delivered services',
      },
      {
        title: 'Safety — Zero Is the Only Acceptable Number',
        content: 'Workers at height: Traditional 8-20/day → KTV 0\nFall risk hours: Traditional 400+/cycle → KTV 0\nEquipment failure risk: Traditional Present → KTV N/A (redundant systems)\nInsurance category: Traditional High-risk → KTV Standard\n\n100% elimination of work-at-height incidents.\nAuto return-to-home. 16-drone fleet = instant replacement.',
      },
      {
        title: 'Cost Comparison — 60-70% Savings',
        content: 'Gondola/BMU: 80-150 THB/sqm, 2-3x/year, High risk\nRope access: 60-100 THB/sqm, 3-4x/year, Very high risk\nKTV Drone: 30 THB/sqm, 6x/year, Minimal risk\n\nAnnual savings: THB 25-55M vs traditional methods\nACV: THB 23.97M | EBITDA: 77.7% | Payback: 3.6 months',
      },
      {
        title: 'Smart Green ESG Dashboard',
        content: 'The Data Moat That Grows More Valuable Every Quarter.\n\n- Facade condition heat maps\n- Thermal anomaly tracking\n- Solar panel efficiency monitoring\n- Carbon offset reporting (96% GHG reduction vs rope access)\n- GRESB Data Solutions Partner accredited\n- Compatible: GRI, GRESB, LEED, WELL, TREES, SET disclosure',
      },
      {
        title: 'Partnership Model',
        content: 'Three Companies. One Seamless Solution. Zero Gaps.\n\nKTV — Above ground (drones + data + ESG)\nIFS — Digital backbone (FM software + integration)\nPCS — On the ground (physical maintenance + tenant coordination)\n\nOne invoice. One SLA. One escalation path.\nKTV 50% control · IFS Thailand JV · Smart Green ESG platform',
      },
      {
        title: 'Exclusive Offer & Next Steps',
        content: 'First Mover Gets the Moat.\n\nPhase 1: Paid Pilot — 90 days — Single tower, full CARE cycle\nPhase 2: Evaluation — 30 days — Results review + contract negotiation\nPhase 3: Phased Rollout — 6 months — Tower-by-tower deployment\nPhase 4: Full Operations — Ongoing — Complete CARE coverage\n\nAsk: Approve 90-day paid pilot on one tower.',
      },
    ]);
  }

  /**
   * Generate the investor financial report from verified KTV data.
   */
  async pushInvestorReport(): Promise<GammaGenerateResult> {
    return this.createReport('KTV Working Drone Thailand — Investor Financial Report', [
      {
        title: 'Executive Summary',
        content: 'KTV Working Drone Thailand Co., Ltd.\nParent: KTV Group (est. 1992, Norway, 66 franchises)\n\nInitial Investment: USD 1,455,000 (THB 51,652,500)\n3-Year Revenue: USD 30,448,732 (THB 1,081,080,000)\n3-Year Net Income: USD 19,900,010 (THB 706,561,973)\nROI: 1,350% | IRR: 257% | Payback: 6.3 months\n\nThailand drone market: USD 192.8M (2024) → USD 470M (2033), 10.41% CAGR',
      },
      {
        title: 'Revenue Model',
        content: 'Base Case Pricing: 45 THB/sqm\n6 Service Lines:\n1. Facade Cleaning (Primary) — 45-70 THB/sqm, 87-92% EBITDA\n2. Building Inspection — thermal/visual surveys\n3. Agricultural Spraying — crop treatment\n4. Aerial Survey & Mapping — LiDAR/photogrammetry\n5. Media Production — commercial aerial photography/video\n6. Training Academy — CAAT-certified pilot training\n\nOne Bangkok ACV: THB 23.97M | EBITDA: 77.7% | Break-even safety: 4.8x',
      },
      {
        title: 'Market Opportunity',
        content: 'Bangkok Priority Market:\n- 400+ buildings over 90m height\n- Tropical climate = recurring quarterly cleaning demand\n- Primary: condominiums, office towers, hotels, shopping malls\n- Secondary: industrial facilities, government buildings, temples\n\nCompetitive Advantages:\n- First certified autonomous cleaning drone in Thailand\n- 400m proven height (Icon of the Seas)\n- ISO 9001, 14001, 45001 certified\n- Full franchise support from KTV Group',
      },
      {
        title: 'Fleet & Operations',
        content: 'Fleet: 16 DJI Drones\n- DJI Agras T50 — agricultural spraying (~THB 850K)\n- DJI Matrice 350 RTK — survey & mapping (~THB 650K)\n- DJI M30T — inspection & thermal (~THB 550K)\n- DJI Inspire 3 — media production (~THB 350K)\n- KTV Facade Drone — autonomous cleaning (via franchise)\n\n14 Crew per mission day | 10 Certified Pilots\n8.33% monsoon capacity reduction (4 months)',
      },
      {
        title: 'Financial Projections',
        content: 'Year 1 Revenue Target: THB 180.18M\nIFS JV Milestone: THB 32M → THB 64M → THB 160M\n\nFinancial Guardrails (All PASS):\n- Payback < 18 months ✓\n- EBITDA > 40% ✓\n- Price floor: 27 THB/sqm ✓\n- Min order: 20K sqm ✓\n- NPV positive @10% ✓\n- Drone hours < 2000/yr ✓\n\n7% royalty on gross revenue to KTV Group\n20% corporate tax on EBIT\n7% VAT',
      },
      {
        title: 'ESG & Sustainability',
        content: 'World\'s First ESG-Verified Drone Cleaning Service\n\n- GRESB Data Solutions Partner accredited (2026)\n- 96% GHG reduction vs rope access (verified per mission)\n- 100% elimination of work-at-height incidents\n- 0.3 L/sqm water — 50%+ less than conventional\n- Smart Green Operations: telemetry → immutable ledger → GRESB indicators\n\nFrameworks: GRESB, TREES, LEED O+M, EDGE, BCA Green Mark, ISO 14001, WELL',
      },
      {
        title: 'Regulatory Compliance',
        content: 'CAAT Thailand Requirements:\n- Drone registration for aircraft >250g ✓\n- Maximum altitude: 90m (waiver process for higher) ✓\n- Airport buffer zone: 9km minimum ✓\n- UAOC (Unmanned Aircraft Operating Certificate) ✓\n- Pilot licensing for commercial operations ✓\n- Insurance: minimum THB 1M third-party liability ✓\n\nOne Bangkok Status: CONDITIONAL GO\nCritical: 90m altitude waiver required (Suvarnabhumi 9km clearance)',
      },
    ]);
  }

  /**
   * Generate ESG performance report for client-facing presentations.
   */
  async pushEsgReport(): Promise<GammaGenerateResult> {
    return this.createPresentation('KTV Smart Green — ESG Performance Report', [
      {
        title: 'ESG Performance Overview',
        content: 'KTV Working Drone Thailand × Smart Green Operations\nGRESB Data Solutions Partner | 2026\n\nWorld\'s first ESG-verified autonomous drone cleaning service\nTelemetry signed at source → immutable ledger → independent assurance',
      },
      {
        title: 'Environmental Impact — Verified Metrics',
        content: '96% GHG reduction vs rope access (verified per mission)\n0.3 L/sqm water consumption — 50%+ less than conventional\n0.05 L/sqm chemical use with eco-product line\nPM2.5 baselining for indoor air quality credit\nFacade condition scoring for asset preservation',
      },
      {
        title: 'GRESB Indicator Mapping',
        content: 'PE1 (Energy) → drone-vs-rope kWh telemetry per sqm\nPE2 (GHG) → 96% emissions reduction quantified per mission\nPE3 (Water) → 0.3 L/sqm precision spraying telemetry\nPE4 (Waste) → chemical use 0.05 L/sqm with eco-product line\nPE5 (H&S) → 100% elimination of work-at-height incidents\nDA2 (Env Impact) → PM2.5 monitoring + facade condition scoring',
      },
      {
        title: 'Green Building Framework Alignment',
        content: 'TREES — Water + Energy + IEQ + Innovation credits\nLEED O+M — indoor air, exterior maintenance, IPM credits\nEDGE — post-occupancy water + energy verification\nBCA Green Mark — operational stewardship credits\nWELL — Air feature + Mind feature (cleaning safety)\nISO 14001 — auditable ops data for environmental management',
      },
      {
        title: 'Assurance & Verification Chain',
        content: '1. Drone telemetry captured at the device (signed at source)\n2. Smart Green Operations writes to immutable ledger\n3. ESG metrics derived per GRESB indicator methodology\n4. Independent assurance: Bureau Veritas / DNV / SGS Thailand\n5. Annual GRESB Real Estate Assessment submission support\n6. Mapped to TREES, LEED O+M, EDGE, BCA Green Mark, ISO 14001',
      },
      {
        title: 'Disclosure Artifacts & Deliverables',
        content: '- Per-mission ESG evidence certificate (signed PDF)\n- Monthly Smart Green ESG dashboard export\n- Quarterly KTV CARE inspection + ESG performance report\n- Annual GRESB Real Estate Assessment support pack\n- Annual SET One Report (56-1) ESG appendix\n- Sustainability-linked loan covenant evidence pack\n- Carbon avoidance ledger (T-VER ready)\n- Tenant ESG communication kit (Thai + English)',
      },
    ]);
  }

  /**
   * Generate a weekly operations status deck for management review.
   */
  async pushWeeklyStatusDeck(data: {
    agentsOnline: number;
    totalAgents: number;
    missionsCompleted: number;
    revenue: string;
    incidents: number;
    highlights: string[];
  }): Promise<GammaGenerateResult> {
    return this.createPresentation(`KTV Weekly Operations — ${new Date().toLocaleDateString('en-GB')}`, [
      {
        title: 'Weekly Status Summary',
        content: `Agents Online: ${data.agentsOnline}/${data.totalAgents}\nMissions Completed: ${data.missionsCompleted}\nRevenue: ${data.revenue}\nSafety Incidents: ${data.incidents}\n\nReport Date: ${new Date().toLocaleDateString('en-GB')}`,
      },
      {
        title: 'Key Highlights',
        content: data.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n'),
      },
      {
        title: 'Agent Network Status',
        content: 'Operational Layer (7 Agents):\nFleet Management | Job Lifecycle | CRM & Sales\nSafety Compliance | Finance & Invoicing | Pilot Operations | Data Processing\n\nStrategy Layer (7 Mastermind Agents):\nMarket Intelligence | Partner Strategy | Smart Green Product\nFinancial Model | Deal Design | Sales Playbook | Ops & Compliance\n\nESG Director: GRESB Advisory active',
      },
      {
        title: 'CoWork Team Performance',
        content: 'Growth Engine — leads/week target: 5\nService Delivery — missions/week target: 10\nCompliance & Safety — incidents target: 0\nMarket Intelligence — opportunities scored target: 20\nEcosystem Builder — IFS milestone tracking\nRevenue Operations — Year 1 target: THB 180.18M',
      },
    ]);
  }
}

// ── Factory ───────────────────────────────────────────────────

export function createGammaClient(): GammaClient | null {
  const key = process.env['GAMMA_API_KEY'];
  if (!key) {
    console.warn('[Gamma] GAMMA_API_KEY not set — Gamma presentation push disabled');
    return null;
  }
  return new GammaClient({ apiKey: key, workspaceId: process.env['GAMMA_WORKSPACE_ID'] });
}
