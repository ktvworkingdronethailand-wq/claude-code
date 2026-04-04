/**
 * KTV Working Drone Thailand — Google Drive Integration
 *
 * Uploads battle plan docs, agent reports, pitch deck, and
 * financial models to Google Drive via the REST API.
 *
 * Setup:
 *   Set GDRIVE_ACCESS_TOKEN (OAuth2) or use a service account.
 *   Optionally set GDRIVE_ROOT_FOLDER_ID for the KTV workspace folder.
 */

export interface GDriveConfig {
  accessToken: string;
  rootFolderId?: string;
}

export interface GDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  createdTime?: string;
}

// ── Client ────────────────────────────────────────────────────

export class GDriveClient {
  private apiBase = 'https://www.googleapis.com/drive/v3';
  private uploadBase = 'https://www.googleapis.com/upload/drive/v3';
  private headers: Record<string, string>;

  constructor(private config: GDriveConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(method: string, url: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
    const res = await fetch(url, {
      method,
      headers: { ...this.headers, ...extraHeaders },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GDrive ${method} → ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  }

  async createFolder(name: string, parentId?: string): Promise<GDriveFile> {
    return this.request('POST', `${this.apiBase}/files`, {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : [],
    });
  }

  async uploadTextFile(name: string, content: string, mimeType = 'text/plain', parentId?: string): Promise<GDriveFile> {
    // Multipart upload
    const metadata = { name, mimeType: 'application/vnd.google-apps.document', parents: parentId ? [parentId] : [] };
    const boundary = 'ktv_boundary_' + Date.now();
    const body = `--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n${content}\r\n--${boundary}--`;

    const res = await fetch(`${this.uploadBase}/files?uploadType=multipart`, {
      method: 'POST',
      headers: {
        'Authorization': this.headers['Authorization']!,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    });
    if (!res.ok) throw new Error(`GDrive upload failed: ${res.status} ${await res.text()}`);
    return res.json() as Promise<GDriveFile>;
  }

  async listFiles(folderId: string): Promise<GDriveFile[]> {
    const result = await this.request<{ files: GDriveFile[] }>(
      'GET', `${this.apiBase}/files?q=${encodeURIComponent(`'${folderId}' in parents`)}&fields=files(id,name,mimeType,webViewLink)`
    );
    return result.files;
  }

  async sharePublic(fileId: string): Promise<void> {
    await this.request('POST', `${this.apiBase}/files/${fileId}/permissions`, {
      role: 'reader', type: 'anyone',
    });
  }

  // ── KTV Push Functions ────────────────────────────────────

  /**
   * Create the full KTV folder structure in Google Drive and upload docs
   */
  async pushKtvWorkspaceFolders(rootFolderId?: string): Promise<{ folders: GDriveFile[]; files: GDriveFile[] }> {
    const parent = rootFolderId ?? this.config.rootFolderId;

    // Create top-level KTV folder
    const ktvFolder = await this.createFolder('🚁 KTV Working Drone Thailand', parent);

    // Create sub-folders
    const subFolders = await Promise.all([
      this.createFolder('01 — Battle Plan & Strategy', ktvFolder.id),
      this.createFolder('02 — Financial Model', ktvFolder.id),
      this.createFolder('03 — Pitch Deck', ktvFolder.id),
      this.createFolder('04 — Market Intelligence', ktvFolder.id),
      this.createFolder('05 — Compliance & CAAT', ktvFolder.id),
      this.createFolder('06 — Smart Green ESG', ktvFolder.id),
      this.createFolder('07 — Agent Reports', ktvFolder.id),
    ]);

    const [battleFolder, financeFolder, pitchFolder, mktFolder, caatFolder, sgFolder, agentFolder] = subFolders;

    // Upload key documents
    const files: GDriveFile[] = [];

    files.push(await this.uploadTextFile(
      'Executive Summary — One Bangkok',
      `KTV Working Drone Thailand — One Bangkok Initiative\n\nACV: THB 23.97M | EBITDA: 77.7% | Payback: 3.6 months\nIRR: ~330% | NPV: THB 62.1M | Break-even safety: 4.8x\n\nKey Deal: KTV + IFS Thailand + PCS Ground FM\nChannel: IFS FM (facade, inspection) | Direct KTV (agri, media)\nTimeline: 7-8 months to full deployment\n\nAll 6 Financial Guardrails: PASS`,
      'text/plain', battleFolder!.id
    ));

    files.push(await this.uploadTextFile(
      'Deal Economics — THB 23.97M ACV',
      `Revenue: THB 23,970,000\nCosts: THB 7,180,000 (30%)\nEBITDA: THB 18,660,000 (77.7%)\nNPV @10%: THB 62.1M\nIRR: ~330%\nPayback: 3.6 months\n\nService Mix: Facade Cleaning | Inspection | Data Processing\nFleet: 16 DJI Drones | Pilots: 14 crew/mission day\nInsurance required: THB 50M+`,
      'text/plain', financeFolder!.id
    ));

    files.push(await this.uploadTextFile(
      'CAAT Feasibility — Conditional GO',
      `Status: CONDITIONAL GO\nCritical: 90m altitude waiver required\nDrone hours: 950/cycle\nCrew: 14/mission day\nInsurance: THB 50M+\nNOTAM: Required for each mission\nAirport buffer: 9km (Suvarnabhumi clearance needed)`,
      'text/plain', caatFolder!.id
    ));

    files.push(await this.uploadTextFile(
      'Smart Green ESG Integration',
      `Enterprise Tier: THB 350K/month\nBMS/CMMS integration: closed-loop work orders\nGRESB reporting: automated ESG data capture\nData moat: drone telemetry → ESG platform → client lock-in\n6-month deployment timeline\nSmartGreenOperations.com`,
      'text/plain', sgFolder!.id
    ));

    files.push(await this.uploadTextFile(
      'Agent Network Status',
      `14 Agents Active:\n\nOperational Layer (7):\n  Fleet Management | Job Lifecycle | CRM & Sales\n  Safety Compliance | Finance & Invoicing | Pilot Operations | Data Processing\n\nStrategy Layer (7 Mastermind):\n  Market Intelligence | Partner Strategy | Smart Green Product\n  Financial Model | Deal Design | Sales Playbook | Ops & Compliance\n\nCoWork Teams: 6 | Workflows: 21 | Triggers: 6 | Automations: 9`,
      'text/plain', agentFolder!.id
    ));

    return { folders: [ktvFolder, ...subFolders], files };
  }
}

// ── Factory ───────────────────────────────────────────────────

export function createGDriveClient(): GDriveClient | null {
  const token = process.env['GDRIVE_ACCESS_TOKEN'];
  if (!token) {
    console.warn('[GDrive] GDRIVE_ACCESS_TOKEN not set — Google Drive push disabled');
    return null;
  }
  return new GDriveClient({ accessToken: token, rootFolderId: process.env['GDRIVE_ROOT_FOLDER_ID'] });
}
