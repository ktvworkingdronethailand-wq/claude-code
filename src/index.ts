/**
 * KTV Working Drone Thailand - Operations System
 * Entry point for the AI agent-powered drone operations platform
 *
 * Agents:
 *   1. Fleet Management    - Drone fleet, batteries, payloads, maintenance
 *   2. Job Lifecycle       - 13-stage job pipeline from lead to follow-up
 *   3. CRM & Sales         - Lead pipeline, client management, NPS
 *   4. Safety & Compliance - CAAT regulations, risk assessment, checklists
 *   5. Finance & Invoicing - Billing, revenue tracking, tax/royalty
 *   6. Pilot Operations    - Scheduling, certifications, flight hours
 *   7. Data Processing     - Pipelines, 4-copy backup, QA, delivery
 */

export { KtvOrchestrator } from './agents/orchestrator.js';
export * from './agents/index.js';
export * from './types/index.js';

import { KtvOrchestrator } from './agents/orchestrator.js';

/**
 * Bootstrap the KTV operations system
 */
export async function bootstrap(): Promise<KtvOrchestrator> {
  const orchestrator = new KtvOrchestrator();
  await orchestrator.start();
  return orchestrator;
}

// Run if executed directly
const isMainModule = typeof process !== 'undefined'
  && process.argv[1]?.endsWith('index.js');

if (isMainModule) {
  bootstrap().catch(err => {
    console.error('Failed to start KTV Operations System:', err);
    process.exit(1);
  });
}
