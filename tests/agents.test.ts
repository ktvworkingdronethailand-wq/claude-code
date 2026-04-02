/**
 * KTV Working Drone Thailand - Agent Tests
 */

import { FleetManagementAgent } from '../src/agents/fleet-management.js';
import { JobLifecycleAgent } from '../src/agents/job-lifecycle.js';
import { CrmSalesAgent } from '../src/agents/crm-sales.js';
import { SafetyComplianceAgent } from '../src/agents/safety-compliance.js';
import { FinanceInvoicingAgent } from '../src/agents/finance-invoicing.js';
import { PilotOperationsAgent } from '../src/agents/pilot-operations.js';
import { DataProcessingAgent } from '../src/agents/data-processing.js';
import { KtvOrchestrator } from '../src/agents/orchestrator.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string): void {
  if (condition) {
    console.log(`  PASS: ${name}`);
    passed++;
  } else {
    console.error(`  FAIL: ${name}`);
    failed++;
  }
}

async function testFleetManagement(): Promise<void> {
  console.log('\n--- Fleet Management Agent ---');
  const agent = new FleetManagementAgent();
  await agent.start();

  const summary = agent.getFleetSummary();
  assert(summary.totalDrones === 16, 'Fleet has 16 drones');
  assert(summary.available === 16, 'All drones available at startup');
  assert(summary.inFlight === 0, 'No drones in flight at startup');

  const agDrones = agent.getAvailableDrones('agricultural');
  assert(agDrones.length === 6, '6 agricultural drones available');

  const surveyDrones = agent.getAvailableDrones('survey');
  assert(surveyDrones.length === 4, '4 survey drones available');

  const mediaDrones = agent.getAvailableDrones('media');
  assert(mediaDrones.length === 3, '3 media drones available');

  // Test assign/release
  const droneId = agDrones[0].id;
  assert(agent.assignDrone(droneId), 'Drone assigned');
  assert(agent.getFleetSummary().inFlight === 1, '1 drone in flight');
  assert(agent.releaseDrone(droneId), 'Drone released');
  assert(agent.getFleetSummary().inFlight === 0, 'No drones in flight after release');

  // Battery health
  const batteries = agent.checkBatteryHealth();
  assert(Array.isArray(batteries), 'Battery health returns array');

  await agent.stop();
}

async function testJobLifecycle(): Promise<void> {
  console.log('\n--- Job Lifecycle Agent ---');
  const agent = new JobLifecycleAgent();
  await agent.start();

  const job = agent.createJob({
    title: 'Icon Siam Facade Cleaning',
    serviceLine: 'facade-cleaning',
    clientId: 'CLIENT-001',
    estimatedDuration: 480,
    quotedPrice: 250_000,
  });

  assert(job.id.startsWith('JOB-'), 'Job ID generated');
  assert(job.stage === 'lead-capture', 'Job starts at lead-capture');
  assert(job.serviceLine === 'facade-cleaning', 'Service line correct');

  // Advance through stages
  assert(agent.advanceStage(job.id, 'system', 'Qualified'), 'Advanced to qualification');
  const updated = agent.getJobsByStage('qualification');
  assert(updated.length === 1, 'Job found in qualification stage');

  // Pipeline summary
  const summary = agent.getPipelineSummary();
  assert(summary['qualification'] === 1, 'Pipeline shows 1 in qualification');
  assert(summary['lead-capture'] === 0, 'Pipeline shows 0 in lead-capture');

  await agent.stop();
}

async function testCrmSales(): Promise<void> {
  console.log('\n--- CRM & Sales Agent ---');
  const agent = new CrmSalesAgent();
  await agent.start();

  const lead = agent.createLead({
    companyName: 'Thai Property Group',
    contactName: 'Somchai',
    segment: 'real-estate',
    source: 'line',
    estimatedValue: 500_000,
  });

  assert(lead.id.startsWith('LEAD-'), 'Lead ID generated');
  assert(lead.stage === 'new', 'Lead starts as new');

  // Advance lead
  assert(agent.advanceLead(lead.id, 'won'), 'Lead advanced to won');

  // Convert to client
  const client = agent.convertLeadToClient(lead.id, 'professional');
  assert(client !== null, 'Lead converted to client');
  assert(client!.pricingTier === 'professional', 'Client has professional tier');

  // Pricing
  const finalPrice = agent.applyTierPricing(100_000, client!.id);
  assert(finalPrice === 87_500, 'Professional discount applied (12.5%)');

  // Pipeline
  const pipeline = agent.getPipelineSummary();
  assert(typeof pipeline.new === 'object', 'Pipeline summary has stages');

  await agent.stop();
}

async function testSafetyCompliance(): Promise<void> {
  console.log('\n--- Safety & Compliance Agent ---');
  const agent = new SafetyComplianceAgent();
  await agent.start();

  // Risk assessment
  const risk = agent.assessRisk('JOB-001', 2, 3, ['Height', 'Wind'], ['Safety harness', 'Wind monitoring']);
  assert(risk.riskScore === 6, 'Risk score calculated (2x3=6)');
  assert(risk.riskLevel === 'moderate', 'Risk level is moderate');

  // Weather check - GO
  const goodWeather = agent.checkWeather({
    windSpeedMs: 5,
    visibilityKm: 10,
    precipitation: false,
    lightningWithin30km: false,
  });
  assert(goodWeather.status === 'go', 'Good weather is GO');

  // Weather check - NO GO
  const badWeather = agent.checkWeather({
    windSpeedMs: 15,
    visibilityKm: 1,
    precipitation: true,
    lightningWithin30km: true,
  });
  assert(badWeather.status === 'no-go', 'Bad weather is NO-GO');

  // Pre-flight checklist
  const checklist = agent.submitPreFlightChecklist({
    jobId: 'JOB-001',
    droneId: 'DRONE-001',
    pilotId: 'PILOT-001',
    airframeIntegrity: true,
    batteryState: true,
    payloadMounted: true,
    airspaceClearance: true,
    weatherChecked: true,
    communicationSystems: true,
  });
  assert(checklist.allPassed === true, 'All preflight checks passed');

  // Failed checklist
  const failedChecklist = agent.submitPreFlightChecklist({
    airframeIntegrity: true,
    batteryState: false, // battery fail
  });
  assert(failedChecklist.allPassed === false, 'Failed preflight detected');

  // Incident
  const incident = agent.reportIncident({
    severity: 'serious',
    type: 'flyaway',
    description: 'Drone flyaway during inspection',
  });
  assert(incident.caatNotified === true, 'CAAT notified for serious incident');

  const stats = agent.getSafetyStats();
  assert(stats.totalIncidents === 1, '1 incident recorded');

  await agent.stop();
}

async function testFinanceInvoicing(): Promise<void> {
  console.log('\n--- Finance & Invoicing Agent ---');
  const agent = new FinanceInvoicingAgent();
  await agent.start();

  const invoice = agent.createInvoice('JOB-001', 'CLIENT-001', [
    { description: 'Facade cleaning - 5000 sqm', quantity: 5000, unitPrice: 45, unit: 'sqm', total: 225_000 },
    { description: 'Thermal inspection', quantity: 1, unitPrice: 25_000, unit: 'project', total: 25_000 },
  ]);

  assert(invoice.subtotal === 250_000, 'Subtotal correct');
  assert(invoice.vatPercent === 7, 'VAT rate is 7%');
  assert(invoice.vatAmount === 17_500, 'VAT amount correct');
  assert(invoice.total === 267_500, 'Total with VAT correct');
  assert(invoice.status === 'draft', 'Invoice starts as draft');

  // Update status
  assert(agent.updateInvoiceStatus(invoice.id, 'sent'), 'Invoice sent');
  assert(agent.updateInvoiceStatus(invoice.id, 'paid'), 'Invoice paid');

  // Financial summary
  const summary = agent.getFinancialSummary('2026-Q1');
  assert(summary.grossRevenue === 250_000, 'Gross revenue correct');
  assert(summary.royaltyPayment === 17_500, 'Royalty (7%) correct');
  assert(summary.currency === 'THB', 'Currency is THB');

  await agent.stop();
}

async function testPilotOperations(): Promise<void> {
  console.log('\n--- Pilot Operations Agent ---');
  const agent = new PilotOperationsAgent();
  await agent.start();

  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  const pilot = agent.registerPilot({
    name: 'Somchai Srisuk',
    caatLicenseNumber: 'CAAT-TH-2026-001',
    caatLicenseExpiry: futureDate,
    medicalCertExpiry: futureDate,
    typeRatings: ['DJI Agras T50', 'DJI Matrice 350 RTK'],
  });

  assert(pilot.id.startsWith('PILOT-'), 'Pilot ID generated');
  assert(pilot.maxDailyHours === 8, 'Max daily hours is 8');
  assert(pilot.maxMonthlyHours === 80, 'Max monthly hours is 80');

  // Available pilots
  const available = agent.getAvailablePilots();
  assert(available.length === 1, '1 pilot available');

  const ratedPilots = agent.getAvailablePilots('DJI Agras T50');
  assert(ratedPilots.length === 1, 'Pilot has Agras T50 rating');

  // Can fly check
  assert(agent.canPilotFly(pilot.id, 4), 'Pilot can fly 4 hours');
  assert(agent.canPilotFly(pilot.id, 9) === false, 'Pilot cannot fly 9 hours (exceeds daily limit)');

  // Flight hours
  const hours = agent.getFlightHoursSummary(pilot.id);
  assert(hours !== null, 'Flight hours returned');
  assert(hours!.dailyRemaining === 8, '8 daily hours remaining');

  // Certification check
  const alerts = agent.checkCertificationExpiry();
  assert(alerts.length === 0, 'No certification alerts for valid pilot');

  await agent.stop();
}

async function testDataProcessing(): Promise<void> {
  console.log('\n--- Data Processing Agent ---');
  const agent = new DataProcessingAgent();
  await agent.start();

  const dataJob = agent.createDataJob('JOB-001', 'photogrammetry', 25.5);
  assert(dataJob.id.startsWith('DJOB-'), 'Data job ID generated');
  assert(dataJob.status === 'queued', 'Job starts as queued');
  assert(dataJob.pipeline === 'photogrammetry', 'Pipeline correct');

  // Advance processing
  assert(agent.advanceProcessing(dataJob.id, 'ingesting'), 'Advanced to ingesting');
  assert(agent.advanceProcessing(dataJob.id, 'processing'), 'Advanced to processing');

  // Backup protocol
  assert(agent.registerBackup(dataJob.id, 'sd-card'), 'SD card backup registered');
  assert(agent.registerBackup(dataJob.id, 'field-laptop'), 'Laptop backup registered');
  assert(agent.registerBackup(dataJob.id, 'nas'), 'NAS backup registered');

  const compliance = agent.checkBackupCompliance(dataJob.id);
  assert(compliance.compliant === false, 'Not compliant without cloud backup');
  assert(compliance.missing.length === 1, '1 backup missing');

  assert(agent.registerBackup(dataJob.id, 'cloud-s3'), 'S3 backup registered');
  const fullCompliance = agent.checkBackupCompliance(dataJob.id);
  assert(fullCompliance.compliant === true, 'Fully compliant with 4 copies');

  // QA
  const qaResult = agent.submitQaReview(dataJob.id, true, 'QA-001');
  assert(qaResult.passed === true, 'QA passed');

  // Delivery
  const delivery = agent.createDelivery(dataJob.id, 'CLIENT-001', ['orthomosaic.tif', 'report.pdf']);
  assert(delivery !== null, 'Delivery created');
  assert(delivery!.deliverables.length === 2, '2 deliverables');

  // Stats
  const stats = agent.getProcessingStats();
  assert(stats.totalJobs === 1, '1 data job');
  assert(stats.qaPassRate === 1, 'QA pass rate 100%');
  assert(stats.backupComplianceRate === 1, 'Backup compliance 100%');

  await agent.stop();
}

async function testOrchestrator(): Promise<void> {
  console.log('\n--- Orchestrator ---');
  const orchestrator = new KtvOrchestrator();
  await orchestrator.start();

  const health = orchestrator.getSystemHealth();
  assert(health.agents.length === 7, '7 agents registered');
  assert(health.systemStatus === 'healthy', 'System is healthy');

  // Access specific agent
  const fleet = orchestrator.getAgent<FleetManagementAgent>('fleet-management');
  assert(fleet !== undefined, 'Fleet agent accessible');
  assert(fleet!.getFleetSummary().totalDrones === 16, 'Fleet operational via orchestrator');

  // Dashboard
  const dashboard = await orchestrator.getDashboard();
  assert(dashboard.system !== undefined, 'Dashboard has system info');
  assert(dashboard.fleet !== undefined, 'Dashboard has fleet info');
  assert(dashboard.agents !== undefined, 'Dashboard has agent list');

  await orchestrator.stop();
}

// ── Run All Tests ──────────────────────────────────────────

async function main(): Promise<void> {
  console.log('KTV Working Drone Thailand - Agent Test Suite');
  console.log('='.repeat(50));

  await testFleetManagement();
  await testJobLifecycle();
  await testCrmSales();
  await testSafetyCompliance();
  await testFinanceInvoicing();
  await testPilotOperations();
  await testDataProcessing();
  await testOrchestrator();

  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
