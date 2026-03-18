/**
 * KTV Working Drone Thailand - Workflow & Brain Tests
 */

import { KtvOrchestrator } from '../src/agents/orchestrator.js';
import { EventBus, createKtvEvent } from '../src/workflows/event-bus.js';
import { WorkflowEngine, AgentExecutor } from '../src/workflows/engine.js';
import { TriggerManager, createDefaultTriggers } from '../src/workflows/triggers.js';
import { OperationsBrain } from '../src/workflows/brain.js';
import { ALL_WORKFLOWS } from '../src/workflows/definitions.js';
import { AgentRole } from '../src/types/index.js';

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

// ── Event Bus Tests ────────────────────────────────────────

async function testEventBus(): Promise<void> {
  console.log('\n--- Event Bus ---');
  const bus = new EventBus();
  let received = 0;

  bus.subscribe({
    id: 'test-sub-1',
    eventType: 'lead.created',
    handler: async () => { received++; },
    description: 'Test subscriber',
  });

  bus.subscribe({
    id: 'test-sub-2',
    eventType: ['lead.created', 'lead.won'],
    handler: async () => { received++; },
    description: 'Multi-event subscriber',
  });

  // Emit lead.created — should fire both subscribers
  await bus.emit(createKtvEvent('lead.created', 'crm-sales', { leadId: 'LEAD-001' }));
  assert(received === 2, 'Both subscribers fired on lead.created');

  // Emit lead.won — should fire only the second subscriber
  await bus.emit(createKtvEvent('lead.won', 'crm-sales', { leadId: 'LEAD-001' }));
  assert(received === 3, 'Multi-event subscriber fired on lead.won');

  // Event log
  const log = bus.getEventLog();
  assert(log.length === 2, 'Event log has 2 entries');

  // Filtered log
  const filtered = bus.getEventLog({ type: 'lead.won' });
  assert(filtered.length === 1, 'Filtered log returns 1 event');

  // Unsubscribe
  bus.unsubscribe('test-sub-1');
  received = 0;
  await bus.emit(createKtvEvent('lead.created', 'crm-sales', { leadId: 'LEAD-002' }));
  assert(received === 1, 'Only remaining subscriber fires after unsubscribe');

  // Subscription count
  assert(bus.getSubscriptionCount() >= 1, 'Subscription count tracks correctly');

  bus.clear();
  assert(bus.getEventLog().length === 0, 'Event bus cleared');
}

// ── Workflow Engine Tests ──────────────────────────────────

async function testWorkflowEngine(): Promise<void> {
  console.log('\n--- Workflow Engine ---');
  const bus = new EventBus();
  const callLog: string[] = [];

  const executor: AgentExecutor = async (agent, action, payload) => {
    callLog.push(`${agent}:${action}`);
    return { success: true, agent, action };
  };

  const engine = new WorkflowEngine(bus, executor);

  // Register a test workflow
  engine.register({
    id: 'test-wf',
    name: 'Test Workflow',
    description: 'Tests workflow execution',
    trigger: 'lead.created',
    steps: [
      {
        id: 'step-1',
        name: 'CRM qualify',
        agent: 'crm-sales',
        action: 'advance-lead',
        inputMap: (ctx) => ({ leadId: ctx.variables.leadId }),
      },
      {
        id: 'step-2',
        name: 'Create job',
        agent: 'job-lifecycle',
        action: 'create-job',
        inputMap: (ctx) => ({ title: 'Test job' }),
        outputKey: 'jobResult',
      },
      {
        id: 'step-3',
        name: 'Conditional step',
        agent: 'fleet-management',
        action: 'get-fleet-summary',
        inputMap: () => ({}),
        condition: (ctx) => ctx.variables.skipFleet !== true,
      },
    ],
  });

  assert(engine.getDefinitions().length === 1, 'Workflow registered');

  // Execute via direct trigger
  const triggerEvent = createKtvEvent('lead.created', 'crm-sales', { leadId: 'LEAD-001' });
  const instance = await engine.execute('test-wf', triggerEvent);

  assert(instance.status === 'completed', 'Workflow completed');
  assert(instance.stepsCompleted.length === 3, 'All 3 steps completed');
  assert(callLog.includes('crm-sales:advance-lead'), 'CRM agent called');
  assert(callLog.includes('job-lifecycle:create-job'), 'Job agent called');
  assert(callLog.includes('fleet-management:get-fleet-summary'), 'Fleet agent called');

  // Test conditional skip
  const skipEvent = createKtvEvent('lead.created', 'crm-sales', { leadId: 'LEAD-002', skipFleet: true });
  const instance2 = await engine.execute('test-wf', skipEvent);
  assert(instance2.stepsSkipped.length === 1, 'Conditional step skipped');
  assert(instance2.stepsCompleted.length === 2, '2 steps completed when 1 skipped');

  // Stats
  const stats = engine.getStats();
  assert(stats.totalExecutions === 2, '2 total executions');
  assert(stats.completed === 2, '2 completed');
  assert(stats.failed === 0, '0 failed');
}

// ── Workflow Engine: Event-Triggered ───────────────────────

async function testWorkflowAutoTrigger(): Promise<void> {
  console.log('\n--- Workflow Auto-Trigger ---');
  const bus = new EventBus();
  let triggered = false;

  const executor: AgentExecutor = async () => {
    triggered = true;
    return { success: true };
  };

  const engine = new WorkflowEngine(bus, executor);

  engine.register({
    id: 'auto-trigger-test',
    name: 'Auto Trigger Test',
    description: 'Tests event-based trigger',
    trigger: 'safety.incident.reported',
    steps: [{
      id: 'respond',
      name: 'Respond to incident',
      agent: 'safety-compliance',
      action: 'get-safety-stats',
      inputMap: () => ({}),
    }],
  });

  // Emit the trigger event — workflow should fire automatically
  await bus.emit(createKtvEvent('safety.incident.reported', 'safety-compliance', {
    type: 'near-miss',
    severity: 'minor',
  }));

  assert(triggered, 'Workflow auto-triggered by event');

  const history = engine.getWorkflowHistory();
  assert(history.length === 1, 'Workflow history has 1 entry');
  assert(history[0].definitionId === 'auto-trigger-test', 'Correct workflow was triggered');
}

// ── Workflow Conditional Trigger ───────────────────────────

async function testConditionalTrigger(): Promise<void> {
  console.log('\n--- Conditional Trigger ---');
  const bus = new EventBus();
  let fireCount = 0;

  const executor: AgentExecutor = async () => {
    fireCount++;
    return { success: true };
  };

  const engine = new WorkflowEngine(bus, executor);

  engine.register({
    id: 'conditional-test',
    name: 'Conditional Trigger Test',
    description: 'Only fires for contract stage',
    trigger: 'job.stage.changed',
    triggerCondition: (event) => event.data.toStage === 'contract',
    steps: [{
      id: 'step1',
      name: 'Process',
      agent: 'job-lifecycle',
      action: 'get-pipeline-summary',
      inputMap: () => ({}),
    }],
  });

  // This should NOT trigger (wrong stage)
  await bus.emit(createKtvEvent('job.stage.changed', 'job-lifecycle', {
    jobId: 'JOB-001',
    toStage: 'qualification',
  }));
  assert(fireCount === 0, 'Workflow did NOT fire for qualification stage');

  // This SHOULD trigger (correct stage)
  await bus.emit(createKtvEvent('job.stage.changed', 'job-lifecycle', {
    jobId: 'JOB-001',
    toStage: 'contract',
  }));
  assert(fireCount === 1, 'Workflow fired for contract stage');
}

// ── Trigger Manager Tests ──────────────────────────────────

async function testTriggerManager(): Promise<void> {
  console.log('\n--- Trigger Manager ---');
  const bus = new EventBus();
  let callCount = 0;

  const executor: AgentExecutor = async () => {
    callCount++;
    return { success: true };
  };

  const manager = new TriggerManager(bus, executor);

  manager.register({
    id: 'test-trigger',
    name: 'Test Trigger',
    description: 'Fires every 100ms for testing',
    type: 'interval',
    intervalMs: 100,
    enabled: true,
    action: async () => { callCount++; },
  });

  const status = manager.getStatus();
  assert(status.length === 1, 'Trigger registered');
  assert(status[0].enabled === true, 'Trigger is enabled');

  // Manual fire
  await manager.fire('test-trigger');
  assert(callCount === 1, 'Manual fire works');

  // Default triggers
  const defaults = createDefaultTriggers(bus, executor);
  assert(defaults.length === 6, '6 default triggers created');
  assert(defaults.some(t => t.name === 'Fleet Health Monitor'), 'Fleet monitor trigger exists');
  assert(defaults.some(t => t.name === 'Overdue Invoice Scanner'), 'Invoice scanner trigger exists');
  assert(defaults.some(t => t.name === 'Safety Stats Aggregator'), 'Safety stats trigger exists');
}

// ── Workflow Definitions Tests ─────────────────────────────

async function testWorkflowDefinitions(): Promise<void> {
  console.log('\n--- Workflow Definitions ---');

  assert(ALL_WORKFLOWS.length === 10, '10 workflow definitions');

  const names = ALL_WORKFLOWS.map(w => w.id);
  assert(names.includes('wf-lead-to-client'), 'Lead-to-client workflow defined');
  assert(names.includes('wf-mission-prep'), 'Mission prep workflow defined');
  assert(names.includes('wf-preflight-to-mission'), 'Pre-flight workflow defined');
  assert(names.includes('wf-post-mission'), 'Post-mission workflow defined');
  assert(names.includes('wf-delivery-to-payment'), 'Delivery-to-payment workflow defined');
  assert(names.includes('wf-maintenance-auto'), 'Maintenance workflow defined');
  assert(names.includes('wf-incident-response'), 'Incident response workflow defined');
  assert(names.includes('wf-overdue-collection'), 'Overdue collection workflow defined');
  assert(names.includes('wf-cert-expiry'), 'Cert expiry workflow defined');
  assert(names.includes('wf-daily-ops'), 'Daily ops workflow defined');

  // Verify post-mission has 8 steps (the longest pipeline)
  const postMission = ALL_WORKFLOWS.find(w => w.id === 'wf-post-mission')!;
  assert(postMission.steps.length === 8, 'Post-mission has 8 steps (data pipeline)');

  // Verify daily ops touches all 7 agents
  const dailyOps = ALL_WORKFLOWS.find(w => w.id === 'wf-daily-ops')!;
  const dailyAgents = new Set(dailyOps.steps.map(s => s.agent));
  assert(dailyAgents.size === 7, 'Daily ops workflow touches all 7 agents');
}

// ── Full Brain Integration ─────────────────────────────────

async function testOperationsBrain(): Promise<void> {
  console.log('\n--- Operations Brain (Full Integration) ---');

  const orchestrator = new KtvOrchestrator();
  await orchestrator.start();

  const brain = new OperationsBrain(orchestrator);
  await brain.start();

  // Verify brain status
  const status = brain.getStatus();
  assert(status.running === true, 'Brain is running');
  assert(status.workflows.definitionsRegistered === 10, '10 workflows registered');
  assert(status.triggers.length === 6, '6 triggers registered');
  assert(status.reactiveListeners > 0, 'Reactive listeners active');

  // Emit a lead.created event — should trigger the lead-to-client workflow
  await brain.emit('lead.created', 'crm-sales', {
    leadId: 'LEAD-BRAIN-001',
    companyName: 'Siam Properties',
    serviceLine: 'facade-cleaning',
  });

  const wfStats = brain.getStatus().workflows;
  assert(wfStats.totalExecutions >= 1, 'Workflow executed on lead.created event');

  // Emit a job.stage.changed to contract — should trigger mission prep
  await brain.emit('job.stage.changed', 'job-lifecycle', {
    jobId: 'JOB-BRAIN-001',
    toStage: 'contract',
    droneCategory: 'inspection',
  });

  assert(brain.getStatus().workflows.totalExecutions >= 2, 'Mission prep workflow triggered');

  // Emit safety incident — should trigger incident response
  await brain.emit('safety.incident.reported', 'safety-compliance', {
    type: 'near-miss',
    severity: 'minor',
    description: 'Close proximity to building during inspection',
  });

  assert(brain.getStatus().workflows.totalExecutions >= 3, 'Incident response workflow triggered');

  // Check decisions were logged
  const decisions = brain.getDecisions();
  assert(decisions.length > 0, 'Brain logged decisions');
  assert(decisions.some(d => d.trigger.includes('Incident')), 'Emergency decision logged');

  // Run the daily ops workflow manually
  await brain.runWorkflow('wf-daily-ops', {});
  assert(brain.getStatus().workflows.totalExecutions >= 4, 'Daily ops workflow executed');

  // Full status report
  const finalStatus = brain.getStatus();
  assert(finalStatus.events.total > 0, 'Events recorded');
  assert(finalStatus.decisions > 0, 'Decisions logged');

  // Print brain status
  brain.printBrainStatus();

  await brain.stop();
  await orchestrator.stop();
}

// ── End-to-End: Full Job Lifecycle ─────────────────────────

async function testEndToEndJobLifecycle(): Promise<void> {
  console.log('\n--- End-to-End: Full Job Lifecycle ---');

  const orchestrator = new KtvOrchestrator();
  await orchestrator.start();

  const brain = new OperationsBrain(orchestrator);
  await brain.start();

  // Step 1: New lead arrives via LINE
  console.log('  [E2E] Step 1: Lead arrives...');
  await brain.emit('lead.created', 'crm-sales', {
    leadId: 'LEAD-E2E-001',
    companyName: 'Bangkok Tower Management',
    segment: 'real-estate',
    serviceLine: 'facade-cleaning',
    estimatedValue: 350_000,
  });

  // Step 2: Job gets contracted
  console.log('  [E2E] Step 2: Contract signed...');
  await brain.emit('job.stage.changed', 'job-lifecycle', {
    jobId: 'JOB-E2E-001',
    toStage: 'contract',
    droneCategory: 'inspection',
    requiredTypeRating: 'DJI Matrice 30T',
  });

  // Step 3: Pre-flight ready
  console.log('  [E2E] Step 3: Pre-flight...');
  await brain.emit('job.stage.changed', 'job-lifecycle', {
    jobId: 'JOB-E2E-001',
    toStage: 'pre-flight',
    droneId: 'DRONE-011',
    pilotId: 'PILOT-001',
  });

  // Step 4: Mission completes
  console.log('  [E2E] Step 4: Mission complete...');
  await brain.emit('mission.completed', 'fleet-management', {
    jobId: 'JOB-E2E-001',
    droneId: 'DRONE-011',
    pipeline: 'photogrammetry',
    dataSizeGb: 22,
  });

  // Verify the brain processed all steps
  const finalStatus = brain.getStatus();
  assert(finalStatus.workflows.totalExecutions >= 4, 'All lifecycle workflows executed');
  assert(finalStatus.decisions > 0, 'Brain made decisions throughout lifecycle');
  assert(finalStatus.events.total > 5, 'Multiple events flowed through the system');

  console.log(`  [E2E] Total workflows: ${finalStatus.workflows.totalExecutions}`);
  console.log(`  [E2E] Total decisions: ${finalStatus.decisions}`);
  console.log(`  [E2E] Total events: ${finalStatus.events.total}`);

  await brain.stop();
  await orchestrator.stop();
}

// ── Run All Tests ──────────────────────────────────────────

async function main(): Promise<void> {
  console.log('KTV Working Drone Thailand - Workflow & Brain Test Suite');
  console.log('='.repeat(55));

  await testEventBus();
  await testWorkflowEngine();
  await testWorkflowAutoTrigger();
  await testConditionalTrigger();
  await testTriggerManager();
  await testWorkflowDefinitions();
  await testOperationsBrain();
  await testEndToEndJobLifecycle();

  console.log('\n' + '='.repeat(55));
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
