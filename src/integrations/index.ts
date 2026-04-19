/**
 * KTV Working Drone Thailand - Integration Exports
 */

export { LineConnector } from './line-connector.js';
export type { LineMessage, LineUser, LineNotification } from './line-connector.js';

export { IntegrationHub, OdooConnector, S3Connector, FlightHubConnector } from './external-systems.js';
export { KtvSupabaseClient, AgentTelemetry, createSupabaseClient, AGENT_TEAM_MAP } from './supabase.js';
export type { SupabaseConfig, AgentStatusRow, WorkflowEventRow, BrainDecisionRow, KpiSnapshotRow, MissionLogRow, TeamActivityRow } from './supabase.js';

export { NotionClient, createNotionClient } from './notion.js';
export type { NotionConfig, NotionPage, NotionDatabase } from './notion.js';

export { AsanaClient, createAsanaClient } from './asana.js';
export type { AsanaConfig, AsanaProject, AsanaTask } from './asana.js';

export { AirtableClient, createAirtableClient } from './airtable.js';
export type { AirtableConfig, AirtableRecord } from './airtable.js';

export { GDriveClient, createGDriveClient } from './gdrive.js';
export type { GDriveConfig, GDriveFile } from './gdrive.js';

export { GammaClient, createGammaClient } from './gamma.js';
export type { GammaConfig, GammaDoc, GammaCard, GammaDocType, GammaGenerateInput, GammaGenerateResult } from './gamma.js';

export { CanvaClient, createCanvaClient } from './canva.js';
export type { CanvaConfig, CanvaDesign, CanvaExportJob, CanvaAutofillJob, CanvaDesignType, CanvaExportFormat } from './canva.js';
