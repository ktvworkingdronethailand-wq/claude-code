/**
 * KTV Working Drone Thailand - Unified Operations Platform
 *
 * 7 AI Agents:
 *   Fleet | Jobs | CRM | Safety | Finance | Pilots | Data
 *
 * Brain: Event Bus + 10 Workflows + 6 Triggers + Decision Engine
 *
 * Operations:
 *   6 Service Lines | Scheduling & Dispatch | Client Onboarding
 *   Supply Chain | Reporting & KPIs
 *
 * Integrations:
 *   LINE (54M Thai users) | Odoo ERP | AWS S3 | DJI FlightHub
 *
 * JV Partners:
 *   IFS Thailand (FM, up to 50%)
 *   Smart Green Operations (ESG + Digital FM Platform)
 */

export { KtvPlatform } from './operations/ktv-platform.js';
export { KtvOrchestrator } from './agents/orchestrator.js';
export * from './agents/index.js';
export * from './types/index.js';
export * from './workflows/index.js';
export * from './operations/index.js';
export * from './integrations/index.js';
export * from './config/index.js';

import { KtvPlatform } from './operations/ktv-platform.js';

/**
 * Bootstrap the full KTV operations platform
 */
export async function bootstrap(): Promise<KtvPlatform> {
  const platform = new KtvPlatform();
  await platform.start();
  return platform;
}

// Run if executed directly
const isMainModule = typeof process !== 'undefined'
  && process.argv[1]?.endsWith('index.js');

if (isMainModule) {
  bootstrap().catch(err => {
    console.error('Failed to start KTV Operations Platform:', err);
    process.exit(1);
  });
}
