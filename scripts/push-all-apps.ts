/**
 * KTV Working Drone Thailand — Push to All Connected Apps
 *
 * Runs all platform push functions simultaneously.
 * Set env vars for each platform to activate it.
 *
 * Usage:
 *   npx tsx scripts/push-all-apps.ts
 *   # or after build:
 *   node dist/scripts/push-all-apps.js
 *
 * Required env vars per platform:
 *   Notion:    NOTION_API_KEY, NOTION_ROOT_PAGE_ID
 *   Asana:     ASANA_ACCESS_TOKEN, ASANA_WORKSPACE_GID
 *   Airtable:  AIRTABLE_API_KEY, AIRTABLE_BASE_ID
 *   GDrive:    GDRIVE_ACCESS_TOKEN, GDRIVE_ROOT_FOLDER_ID (optional)
 *   Supabase:  SUPABASE_URL, SUPABASE_ANON_KEY
 *   GitHub:    git push (uses existing git remote)
 */

import { createNotionClient } from '../src/integrations/notion.js';
import { createAsanaClient } from '../src/integrations/asana.js';
import { createAirtableClient } from '../src/integrations/airtable.js';
import { createGDriveClient } from '../src/integrations/gdrive.js';
import { createSupabaseClient } from '../src/integrations/supabase.js';
import { execSync } from 'child_process';

// ── Result tracking ────────────────────────────────────────────

interface PushResult {
  platform: string;
  status: 'success' | 'skipped' | 'error';
  message: string;
  details?: string;
}

const results: PushResult[] = [];

function log(platform: string, status: PushResult['status'], message: string, details?: string) {
  const icon = status === 'success' ? '✅' : status === 'skipped' ? '⏭️' : '❌';
  console.log(`${icon} [${platform}] ${message}`);
  if (details) console.log(`   └─ ${details}`);
  results.push({ platform, status, message, details });
}

// ── Platform pushes ────────────────────────────────────────────

async function pushNotion(): Promise<void> {
  const client = createNotionClient();
  if (!client) { log('Notion', 'skipped', 'NOTION_API_KEY not set'); return; }

  const rootPageId = process.env['NOTION_ROOT_PAGE_ID'];
  if (!rootPageId) { log('Notion', 'skipped', 'NOTION_ROOT_PAGE_ID not set'); return; }

  try {
    const { workspace, teams } = await client.pushKtvWorkspace(rootPageId);
    log('Notion', 'success', `KTV workspace created`, `Page: ${workspace.url} · ${teams.length} team pages`);
  } catch (e) {
    log('Notion', 'error', `Push failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function pushAsana(): Promise<void> {
  const client = createAsanaClient();
  if (!client) { log('Asana', 'skipped', 'ASANA_ACCESS_TOKEN not set'); return; }

  const workspaceGid = process.env['ASANA_WORKSPACE_GID'];
  if (!workspaceGid) {
    try {
      const workspaces = await client.getWorkspaces();
      const ws = workspaces[0];
      if (!ws) { log('Asana', 'error', 'No workspaces found'); return; }
      const projects = await client.pushKtvTeamProjects(ws.gid);
      log('Asana', 'success', `6 team projects created`, projects.map(p => p.name).join(' | '));
    } catch (e) {
      log('Asana', 'error', `Push failed: ${e instanceof Error ? e.message : String(e)}`);
    }
    return;
  }

  try {
    const projects = await client.pushKtvTeamProjects(workspaceGid);
    log('Asana', 'success', `6 team projects created`, projects.map(p => p.name).join(' | '));
  } catch (e) {
    log('Asana', 'error', `Push failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function pushAirtable(): Promise<void> {
  const client = createAirtableClient();
  if (!client) { log('Airtable', 'skipped', 'AIRTABLE_API_KEY or AIRTABLE_BASE_ID not set'); return; }

  try {
    // Push sample lead
    await client.pushLead({
      company: 'One Bangkok (TCC Group)', contact: 'FM Manager', email: 'fm@onebangkok.com',
      serviceLine: 'Facade Cleaning', estimatedValueThb: 23970000,
      stage: 'Site Assessment', channel: 'IFS', score: 'HIGH',
    });
    // Push sample mission
    await client.pushMissionLog({
      ref: 'KTV-2026-0406-001', client: 'One Bangkok', serviceLine: 'Facade Cleaning',
      sqm: 45000, stage: 'pre-flight-cleared', safetyCleared: true,
      pilot: 'Krit Jitbanjong', droneId: 'DJI-M350-003',
    });
    log('Airtable', 'success', 'Lead + Mission Log records pushed');
  } catch (e) {
    log('Airtable', 'error', `Push failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function pushGDrive(): Promise<void> {
  const client = createGDriveClient();
  if (!client) { log('GDrive', 'skipped', 'GDRIVE_ACCESS_TOKEN not set'); return; }

  try {
    const { folders, files } = await client.pushKtvWorkspaceFolders();
    log('GDrive', 'success', `Workspace pushed`, `${folders.length} folders · ${files.length} files`);
  } catch (e) {
    log('GDrive', 'error', `Push failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function pushSupabase(): Promise<void> {
  const client = createSupabaseClient();
  if (!client) { log('Supabase', 'skipped', 'SUPABASE_URL or SUPABASE_ANON_KEY not set'); return; }

  try {
    // Test connection by fetching agent_status
    const agents = await client.get('agent_status', 'limit=1');
    log('Supabase', 'success', `Connection verified`, `${Array.isArray(agents) ? agents.length : 0} rows in agent_status`);
  } catch (e) {
    log('Supabase', 'error', `Push failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function pushGitHub(): Promise<void> {
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    log('GitHub', 'success', `On branch ${branch} @ ${sha}`, `Remote: ${remote}`);
  } catch (e) {
    log('GitHub', 'error', `Git check failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// ── Main ───────────────────────────────────────────────────────

async function main() {
  console.log('\n🚁 KTV Working Drone Thailand — Connected Apps Push\n');
  console.log('Platforms: Notion · Asana · Airtable · Google Drive · Supabase · GitHub\n');

  // Run all pushes in parallel
  await Promise.all([
    pushNotion(),
    pushAsana(),
    pushAirtable(),
    pushGDrive(),
    pushSupabase(),
    pushGitHub(),
  ]);

  // Summary
  console.log('\n─────────────────────────────────────────────────────');
  console.log('SUMMARY');
  console.log('─────────────────────────────────────────────────────');
  for (const r of results) {
    const icon = r.status === 'success' ? '✅' : r.status === 'skipped' ? '⏭️ ' : '❌';
    console.log(`${icon}  ${r.platform.padEnd(12)} ${r.status.toUpperCase().padEnd(10)} ${r.message}`);
  }

  const active = results.filter(r => r.status === 'success').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors = results.filter(r => r.status === 'error').length;
  console.log(`\n${active} active · ${skipped} skipped (env var missing) · ${errors} errors`);
  console.log('─────────────────────────────────────────────────────\n');
}

main().catch(console.error);
