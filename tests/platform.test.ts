/**
 * KTV Working Drone Thailand - Full Platform Integration Tests
 * Tests end-to-end business scenarios across all systems
 */

import { KtvPlatform } from '../src/operations/ktv-platform.js';
import { ServiceOperationsManager, SERVICE_CONFIGS } from '../src/operations/service-operations.js';
import { SchedulingEngine } from '../src/operations/scheduling.js';
import { ClientOnboardingManager } from '../src/operations/client-onboarding.js';
import { SupplyChainManager } from '../src/operations/supply-chain.js';
import { ReportingEngine } from '../src/operations/reporting.js';
import { LineConnector } from '../src/integrations/line-connector.js';
import { IntegrationHub } from '../src/integrations/external-systems.js';

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

// ── Service Operations Tests ───────────────────────────────

function testServiceOperations(): void {
  console.log('\n--- Service Operations Manager ---');
  const svc = new ServiceOperationsManager();

  // All 6 service lines
  assert(svc.getAllServices().length === 6, '6 service lines configured');

  // Facade cleaning config
  const facade = svc.getServiceConfig('facade-cleaning');
  assert(facade.pricing.standardRate === 45, 'Facade cleaning: 45 THB/sqm');
  assert(facade.agentChain.length === 7, 'Facade uses all 7 agents');
  assert(facade.sla.deliveryDays === 1, 'Facade 1-day delivery SLA');
  assert(facade.dataPipeline === 'photogrammetry', 'Facade uses photogrammetry pipeline');

  // Agricultural config
  const ag = svc.getServiceConfig('agricultural-spraying');
  assert(ag.pricing.unit === 'rai', 'Ag pricing per rai');
  assert(ag.dataPipeline === 'ndvi', 'Ag uses NDVI pipeline');
  assert(ag.requiredDroneCategories.includes('agricultural'), 'Ag requires agricultural drones');

  // Segment matching
  const realEstate = svc.getServicesForSegment('real-estate');
  assert(realEstate.length >= 3, 'Real estate has 3+ service options');

  const farms = svc.getServicesForSegment('small-farm');
  assert(farms.some(s => s.id === 'agricultural-spraying'), 'Small farms get ag spraying');

  // Quoting
  const quote = svc.calculateQuote('facade-cleaning', 5000, 'enterprise');
  assert(quote.basePrice === 225_000, 'Base: 5000sqm x 45 = 225,000');
  assert(quote.discount === 50_625, 'Enterprise discount 22.5%');
  assert(quote.finalPrice === 174_375, 'Enterprise final price correct');

  const stdQuote = svc.calculateQuote('facade-cleaning', 5000, 'standard');
  assert(stdQuote.discount === 0, 'Standard tier: no discount');

  // Equipment requirements
  const equip = svc.getEquipmentRequirements('survey-mapping');
  assert(equip.drones.includes('DJI Matrice 350 RTK'), 'Survey needs M350 RTK');
  assert(equip.payloads.includes('Zenmuse L2'), 'Survey needs LiDAR');
  assert(equip.pipeline === 'photogrammetry', 'Survey uses photogrammetry');

  // Market readiness
  const readiness = svc.getMarketReadinessSummary();
  assert(readiness.totalServices === 6, 'Market readiness: 6 services');
  assert(readiness.targetSegments.length === 7, 'Covers all 7 customer segments');
}

// ── Scheduling & Dispatch Tests ────────────────────────────

function testScheduling(): void {
  console.log('\n--- Scheduling & Dispatch ---');
  const sched = new SchedulingEngine();

  // Create slot
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const slot = sched.createSlot({
    jobId: 'JOB-SCHED-001',
    date: tomorrow,
    serviceLine: 'facade-cleaning',
    location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' },
    startTime: '08:00',
    endTime: '16:00',
    durationMinutes: 480,
  });

  assert(slot.id.startsWith('SLOT-'), 'Schedule slot created');
  assert(slot.status === 'scheduled', 'Slot status: scheduled');

  // Assign resources
  assert(sched.assignResources(slot.id, 'PILOT-001', 'DRONE-001'), 'Resources assigned');
  const updated = sched.getSlotsByStatus('confirmed');
  assert(updated.length === 1, 'Slot confirmed after assignment');

  // Recurring schedule
  const recurring = sched.createRecurringSchedule({
    clientId: 'CLIENT-REC-001',
    serviceLine: 'facade-cleaning',
    frequency: 'quarterly',
    preferredDay: 1, // Monday
    preferredTimeSlot: 'morning',
    location: { latitude: 13.7563, longitude: 100.5018 },
    active: true,
    nextScheduledDate: new Date(),
  });

  assert(recurring.id.startsWith('RSCHED-'), 'Recurring schedule created');
  assert(recurring.frequency === 'quarterly', 'Quarterly frequency');

  // Smart dispatch scoring
  const score = sched.scoreDispatch(
    ['DJI Matrice 30T', 'DJI Mavic 3 Thermal'],
    6, // hours remaining
    'inspection',
    45, // drone flight hours
    'building-inspection',
    240, // 4 hour job
  );
  assert(score.score > 70, 'Good dispatch match scores high');
  assert(score.reasoning.includes('type rating'), 'Reasoning includes type rating');

  // Poor match
  const poorScore = sched.scoreDispatch(
    ['DJI Agras T50'],
    1, // low hours
    'agricultural',
    200,
    'building-inspection', // wrong service for ag drone
    240,
  );
  assert(poorScore.score < score.score, 'Poor match scores lower');

  // Summary
  const summary = sched.getSchedulingSummary();
  assert(summary.totalSlots >= 1, 'Scheduling summary has slots');
  assert(summary.recurringActive === 1, '1 recurring schedule active');
}

// ── Client Onboarding Tests ────────────────────────────────

function testClientOnboarding(): void {
  console.log('\n--- Client Onboarding ---');
  const onb = new ClientOnboardingManager();

  // Real estate onboarding (has segment-specific items)
  const checklist = onb.createChecklist('CLIENT-ONB-001', 'real-estate', 'Sales Manager');
  assert(checklist.items.length > 8, 'Real estate has extra checklist items');
  assert(checklist.completionPercent === 0, 'Starts at 0%');

  // Has segment-specific items
  const hasAirspace = checklist.items.some(i => i.name.includes('Airspace'));
  assert(hasAirspace, 'Real estate checklist has airspace check');

  const hasBuildingAccess = checklist.items.some(i => i.name.includes('Building access'));
  assert(hasBuildingAccess, 'Real estate checklist has building access');

  // Complete items
  const firstItem = checklist.items[0];
  assert(onb.completeItem(checklist.id, firstItem.id, 'Sales Manager'), 'Item completed');

  const updated = onb.getChecklist(checklist.id)!;
  assert(updated.completionPercent > 0, 'Completion percent increased');

  // Government onboarding
  const govChecklist = onb.createChecklist('CLIENT-ONB-002', 'government', 'BD Manager');
  const hasProcurement = govChecklist.items.some(i => i.name.includes('Procurement'));
  assert(hasProcurement, 'Government checklist has procurement compliance');

  const hasSecurity = govChecklist.items.some(i => i.name.includes('Security'));
  assert(hasSecurity, 'Government checklist has security clearance');

  // Agriculture onboarding
  const farmChecklist = onb.createChecklist('CLIENT-ONB-003', 'small-farm', 'Field Manager');
  const hasChemicals = farmChecklist.items.some(i => i.name.includes('Chemical'));
  assert(hasChemicals, 'Farm checklist has chemical handling');

  // Summary
  const summary = onb.getSummary();
  assert(summary.total === 3, '3 onboardings created');
  assert(summary.inProgress === 3, '3 in progress');
}

// ── Supply Chain Tests ─────────────────────────────────────

function testSupplyChain(): void {
  console.log('\n--- Supply Chain ---');
  const sc = new SupplyChainManager();

  // Default inventory loaded
  const summary = sc.getInventorySummary();
  assert(summary.totalParts >= 8, '8+ spare parts in default inventory');
  assert(summary.totalValue > 0, 'Inventory has monetary value');

  // Vendor management
  const vendor = sc.addVendor({
    name: 'DJI Thailand Authorized Dealer',
    contactName: 'Somchai',
    phone: '+66-2-123-4567',
    email: 'sales@dji-thailand.co.th',
    categories: ['propeller', 'battery', 'motor'],
    status: 'approved',
    performanceScore: 92,
    lastReviewDate: new Date(),
    paymentTermsDays: 30,
  });

  assert(vendor.id.startsWith('VENDOR-'), 'Vendor created');
  assert(sc.getApprovedVendors().length >= 1, 'Approved vendors available');
  assert(sc.getApprovedVendors('propeller').length >= 1, 'Propeller vendor available');

  // Purchase order
  const parts = Array.from({ length: 1 }, () => {
    const inv = sc.getInventorySummary();
    return inv; // just to verify
  });

  // Reorder alerts
  const alerts = sc.getReorderAlerts();
  // May or may not have alerts depending on default stock levels
  assert(Array.isArray(alerts), 'Reorder alerts returns array');

  // Chemical management
  const chem = sc.addChemical({
    name: 'Glyphosate 48%',
    type: 'herbicide',
    currentLiters: 200,
    minimumLiters: 100,
    msdsAvailable: true,
    storageLocation: 'Chemical Store A',
    expiryDate: new Date(Date.now() + 365 * 86_400_000),
    vendorId: vendor.id,
  });
  assert(chem.id.startsWith('CHEM-'), 'Chemical added');
  assert(sc.getExpiredChemicals().length === 0, 'No expired chemicals');
}

// ── Reporting & Analytics Tests ────────────────────────────

function testReporting(): void {
  console.log('\n--- Reporting & Analytics ---');
  const rep = new ReportingEngine();

  // Generate KPIs
  const kpis = rep.generateKPIs(
    [], // agent health
    { totalDrones: 16, available: 14, inFlight: 2, inMaintenance: 0, totalFlightHours: 120, maintenanceAlerts: [] },
    { totalAssessments: 25, checklistPassRate: 0.96, totalIncidents: 1 },
    { totalJobs: 15, qaPassRate: 0.93, backupComplianceRate: 1.0, byStatus: { complete: 12, processing: 3 } },
    { grossRevenue: 2_500_000, netIncome: 1_800_000, ebitdaMargin: 0.876 },
    { totalLeads: 45, totalClients: 28, npsAvg: 72, conversionRate: 0.35 },
    6,
    '2026-Q1',
  );

  assert(kpis.fleet.utilization === 12.5, 'Fleet utilization: 2/16 = 12.5%');
  assert(kpis.fleet.availability === 100, 'Fleet availability: 100%');
  assert(kpis.safety.preflightPassRate === 96, 'Preflight pass rate: 96%');
  assert(kpis.data.backupCompliance === 100, 'Backup compliance: 100%');
  assert(kpis.revenue.grossRevenue === 2_500_000, 'Revenue tracked');
  assert(kpis.crm.npsScore === 72, 'NPS score tracked');

  // Executive summary
  const exec = rep.generateExecutiveSummary(kpis, '2026-Q1');
  assert(exec.headline !== '', 'Executive summary has headline');
  assert(exec.kpis === kpis, 'Executive summary contains KPIs');

  // Growth tracker
  const growth = rep.generateGrowthTracker(1, 45_000_000, 30, 3);
  assert(growth.revenueAchievement > 0, 'Revenue achievement tracked');
  assert(growth.monthlyRunRate === 15_000_000, 'Monthly run rate: 15M THB');
  assert(growth.projectedYearEnd === 180_000_000, 'Projected year end: 180M THB');
}

// ── LINE Integration Tests ─────────────────────────────────

function testLineIntegration(): void {
  console.log('\n--- LINE Integration ---');
  const line = new LineConnector();

  // Register user
  const user = line.registerUser({
    userId: 'U-LINE-001',
    displayName: 'Somchai',
    language: 'th',
  });
  assert(user.userId === 'U-LINE-001', 'LINE user registered');
  assert(user.language === 'th', 'Thai language set');

  // Link to client
  assert(line.linkUserToClient('U-LINE-001', 'CLIENT-001'), 'User linked to client');

  // Messaging
  const inbound = line.receiveMessage('U-LINE-001', 'สอบถามราคาล้างตึก');
  assert(inbound.direction === 'inbound', 'Inbound message recorded');

  const outbound = line.sendMessage('U-LINE-001', 'ขอบคุณครับ เราจะติดต่อกลับ');
  assert(outbound.direction === 'outbound', 'Outbound message sent');

  // Notifications
  const jobNotif = line.sendJobUpdate('U-LINE-001', 'JOB-001', 'quotation');
  assert(jobNotif.type === 'job-update', 'Job update notification sent');
  assert(jobNotif.message.includes('ใบเสนอราคา'), 'Thai message for quotation');

  const deliveryNotif = line.sendDeliveryNotification('U-LINE-001', '/portal/download/123');
  assert(deliveryNotif.type === 'delivery', 'Delivery notification sent');

  const nps = line.sendNpsSurvey('U-LINE-001');
  assert(nps.type === 'nps-survey', 'NPS survey sent');
  assert(nps.message.includes('0-10'), 'NPS has rating scale');

  // English user
  line.registerUser({ userId: 'U-LINE-002', displayName: 'John', language: 'en' });
  const enNotif = line.sendJobUpdate('U-LINE-002', 'JOB-002', 'delivery');
  assert(enNotif.message.includes('ready for download'), 'English delivery message');

  // Stats
  const stats = line.getStats();
  assert(stats.totalUsers === 2, '2 LINE users');
  assert(stats.linkedClients === 1, '1 linked client');
  assert(stats.totalMessages === 2, '2 messages');
  assert(stats.totalNotifications >= 4, '4+ notifications');
}

// ── External Systems Tests ─────────────────────────────────

async function testExternalSystems(): Promise<void> {
  console.log('\n--- External Systems Integration ---');
  const hub = new IntegrationHub();

  // Odoo
  const odooResult = await hub.odoo.syncContacts([
    { name: 'Somchai', email: 'somchai@test.com', phone: '081-234-5678', company: 'Thai Corp' },
  ]);
  assert(odooResult.synced === 1, 'Odoo contact synced');

  const invoiceSync = await hub.odoo.syncInvoices([
    { id: 'INV-001', clientName: 'Thai Corp', amount: 250_000, status: 'paid' },
  ]);
  assert(invoiceSync.synced === 1, 'Odoo invoice synced');

  // S3
  const upload = await hub.s3.uploadRawData('JOB-001', 'flight-data.zip', 5_000_000_000);
  assert(upload.url.includes('ktv-thailand-raw-data'), 'S3 raw data uploaded');

  const deliverable = await hub.s3.uploadDeliverable('CLIENT-001', 'JOB-001', 'report.pdf', 50_000_000);
  assert(deliverable.url.includes('portal.ktv-drone.co.th'), 'S3 deliverable has portal URL');

  const s3Stats = hub.s3.getStorageStats();
  assert(s3Stats.totalUploads === 2, '2 S3 uploads');

  // FlightHub
  const plan = await hub.flightHub.uploadFlightPlan('JOB-001', [
    { lat: 13.7563, lng: 100.5018, altM: 50 },
    { lat: 13.7570, lng: 100.5025, altM: 80 },
  ]);
  assert(plan.planId.includes('JOB-001'), 'Flight plan uploaded');

  // System status
  const status = hub.getSystemStatus();
  assert(status.odoo.modules.length === 5, 'Odoo 5 modules configured');
  assert(status.s3.region === 'ap-southeast-1', 'S3 Bangkok region');
  assert(status.flightHub.orgId === 'KTV-THAILAND-001', 'FlightHub org ID set');
}

// ── Full Platform Integration Test ─────────────────────────

async function testFullPlatform(): Promise<void> {
  console.log('\n--- Full Platform Integration ---');
  const platform = new KtvPlatform();
  await platform.start();

  // Platform status
  const status = platform.getStatus();
  assert(status.online === true, 'Platform online');
  assert(status.agents.length === 7, '7 agents active');
  assert(status.brain.workflows === 15, '15 workflows registered (10 core + 5 connected apps)');
  assert(status.operations.services === 6, '6 service lines');

  // End-to-end: New inquiry
  const inquiry = await platform.handleNewInquiry({
    lineUserId: 'U-E2E-001',
    displayName: 'Khun Pranee',
    companyName: 'Siam Tower Management',
    segment: 'real-estate',
    serviceLine: 'facade-cleaning',
    message: 'สอบถามราคาล้างกระจกตึก 50 ชั้น',
  });

  assert(inquiry.leadId !== '', 'Lead created from inquiry');
  assert(inquiry.checklistId !== '', 'Onboarding checklist created');
  assert(inquiry.quote.finalPrice > 0, 'Quote generated');
  assert(inquiry.quote.currency === 'THB', 'Quote in THB');

  // End-to-end: Full job execution
  await platform.executeFullJob({
    jobId: 'JOB-E2E-FULL',
    clientId: 'CLIENT-E2E-001',
    serviceLine: 'facade-cleaning',
    location: { latitude: 13.7563, longitude: 100.5018 },
  });

  // Daily briefing
  const briefing = await platform.getDailyBriefing();
  assert(briefing.headline !== '', 'Daily briefing has headline');
  assert(briefing.kpis !== undefined, 'Daily briefing has KPIs');

  // Print platform status
  platform.printStatus();

  await platform.stop();
}

// ── Run All Tests ──────────────────────────────────────────

async function main(): Promise<void> {
  console.log('KTV Working Drone Thailand - Platform Integration Test Suite');
  console.log('='.repeat(60));

  testServiceOperations();
  testScheduling();
  testClientOnboarding();
  testSupplyChain();
  testReporting();
  testLineIntegration();
  await testExternalSystems();
  await testFullPlatform();

  console.log('\n' + '='.repeat(60));
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
