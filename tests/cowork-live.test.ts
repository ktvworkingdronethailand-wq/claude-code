/**
 * KTV Working Drone Thailand — CoWork Agent + OutputPusher Live Integration Test
 *
 * Exercises all CoWork teams, sessions, routines, company agents,
 * and pushes results through the OutputPusher to live channels
 * (GDrive + Supabase + Email — or local fallback).
 */

import { CoworkOrchestrator, COWORK_TEAMS, COWORK_COMMANDS, WEEKLY_ROUTINES, getAllRoutineTasks, WeeklyReportTracker } from '../src/workflows/cowork.js';
import { ROUTINE_PROMPTS, getRoutinePrompt, getRoutinePromptsByDay, getTaskPrompt } from '../src/workflows/routine-prompts.js';
import { COMPANY_AGENTS, getAllCompanyWeeklyTasks, getCompanyAgentsBySector, getGDriveFolderStructure, printCompanyAgentRoster } from '../src/agents/company-agents.js';
import { OutputPusher, createOutputPusher } from '../src/operations/output-pusher.js';
import type { TaskOutput, OutputCategory } from '../src/operations/output-pusher.js';

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

// ── 1. CoWork Team Audit ────────────────────────────────────

function testTeamIntegrity(): void {
  console.log('\n--- CoWork Team Integrity ---');
  const teams = Object.values(COWORK_TEAMS);

  assert(teams.length === 6, '6 CoWork teams defined');

  const allStrategy = new Set<string>();
  const allOps = new Set<string>();
  for (const team of teams) {
    assert(team.lead.length > 0, `${team.name} has a lead agent`);
    assert(team.kpis.length >= 3, `${team.name} has 3+ KPIs`);
    assert(team.strategyAgents.length >= 1, `${team.name} has strategy agents`);
    assert(team.operationsAgents.length >= 1, `${team.name} has ops agents`);
    team.strategyAgents.forEach(a => allStrategy.add(a));
    team.operationsAgents.forEach(a => allOps.add(a));
  }

  assert(allStrategy.size === 7, '7 unique strategy agents across teams');
  assert(allOps.size === 7, '7 unique operations agents across teams');
}

// ── 2. CoWork Commands ──────────────────────────────────────

function testCommands(): void {
  console.log('\n--- CoWork Commands ---');
  assert(COWORK_COMMANDS.length === 5, '5 CoWork commands defined');

  for (const cmd of COWORK_COMMANDS) {
    assert(cmd.sequence.length >= 5, `${cmd.name}: ${cmd.sequence.length} steps`);
    assert(cmd.teams.length >= 2, `${cmd.name}: spans ${cmd.teams.length} teams`);

    // Verify all steps have outputKeys
    const outputKeys = cmd.sequence.map(s => s.outputKey);
    const uniqueKeys = new Set(outputKeys);
    assert(uniqueKeys.size === outputKeys.length, `${cmd.name}: unique outputKeys per step`);
  }
}

// ── 3. CoWork Sessions ──────────────────────────────────────

function testSessions(): void {
  console.log('\n--- CoWork Sessions ---');
  const orch = new CoworkOrchestrator();

  // Create session for each command
  for (const cmd of COWORK_COMMANDS) {
    const session = orch.createSession(cmd.id);
    assert(session.id.startsWith('CW-'), `Session created: ${cmd.id}`);
    assert(session.status === 'initializing', `Session starts as initializing`);
    assert(session.teamsActivated.length === cmd.teams.length, `Correct teams activated`);
  }

  // Verify stats
  const stats = orch.getStats();
  assert(stats.totalTeams === 6, 'Stats: 6 teams');
  assert(stats.totalAgents === 14, 'Stats: 14 total agents');
  assert(stats.commands === 5, 'Stats: 5 commands');

  // Session history
  const history = orch.getSessionHistory();
  assert(history.length === 5, '5 sessions in history');

  // Invalid command
  try {
    orch.createSession('nonexistent');
    assert(false, 'Should throw for invalid command');
  } catch {
    assert(true, 'Throws for invalid command');
  }
}

// ── 4. Weekly Routines ──────────────────────────────────────

function testRoutines(): void {
  console.log('\n--- Weekly Routines ---');
  const allTasks = getAllRoutineTasks();

  assert(WEEKLY_ROUTINES.length === 20, '20 weekly routines');
  assert(allTasks.length === 107, '107 total tasks');

  // Every day covered
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  for (const day of days) {
    const dayRoutines = WEEKLY_ROUTINES.filter(r => r.day === day);
    assert(dayRoutines.length >= 1, `${day}: ${dayRoutines.length} routines`);
  }

  // Every routine has tasks
  for (const routine of WEEKLY_ROUTINES) {
    assert(routine.tasks.length >= 3, `${routine.name}: ${routine.tasks.length} tasks`);
    assert(routine.teams.length >= 1, `${routine.name}: ${routine.teams.length} teams`);
  }
}

// ── 5. Routine Prompts Cross-Check ──────────────────────────

function testRoutinePrompts(): void {
  console.log('\n--- Routine Prompts ---');

  assert(ROUTINE_PROMPTS.length === 20, '20 routine prompts (matches routines)');

  // Every routine has a matching prompt
  for (const routine of WEEKLY_ROUTINES) {
    const prompt = getRoutinePrompt(routine.id);
    assert(prompt !== undefined, `Prompt exists: ${routine.id}`);

    if (prompt) {
      // Every task in the routine has a task prompt
      for (const task of routine.tasks) {
        const taskPrompt = getTaskPrompt(routine.id, task.id);
        assert(taskPrompt !== undefined, `Task prompt: ${routine.id}/${task.id}`);
      }
    }
  }

  // Day-based query
  const mondayPrompts = getRoutinePromptsByDay('monday');
  assert(mondayPrompts.length === 3, '3 Monday routine prompts');
}

// ── 6. Company Agents ───────────────────────────────────────

function testCompanyAgents(): void {
  console.log('\n--- Company Agents ---');

  assert(COMPANY_AGENTS.length === 13, '13 company agents');

  const weeklyTasks = getAllCompanyWeeklyTasks();
  assert(weeklyTasks.length === 39, '39 company weekly tasks (13×3)');

  // Every company has 3 sub-agents
  for (const agent of COMPANY_AGENTS) {
    assert(agent.subAgents.length === 3, `${agent.company}: 3 sub-agents`);
    assert(agent.weeklyTasks.length === 3, `${agent.company}: 3 weekly tasks`);
    assert(agent.gdriveFolder !== '', `${agent.company}: GDrive folder set`);
    assert(agent.strategy.kpis.length >= 3, `${agent.company}: 3+ strategy KPIs`);
  }

  // Sector coverage
  const realEstate = getCompanyAgentsBySector('real-estate-fm');
  assert(realEstate.length >= 5, '5+ real estate agents');

  const petrol = getCompanyAgentsBySector('petrol-energy');
  assert(petrol.length === 3, '3 petrol/energy agents');

  const banking = getCompanyAgentsBySector('banking-green-finance');
  assert(banking.length === 3, '3 banking agents');

  // GDrive folder structure
  const folders = getGDriveFolderStructure();
  assert(folders.length === 13, '13 company GDrive folder structures');
  assert(folders.every(f => f.files.length === 3), 'Each company has 3 GDrive files');
}

// ── 7. Weekly Report Tracker ────────────────────────────────

function testWeeklyReportTracker(): void {
  console.log('\n--- Weekly Report Tracker ---');
  const tracker = new WeeklyReportTracker();

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Go back to Monday
  weekStart.setHours(0, 0, 0, 0);

  // Record completions for all routines
  for (const routine of WEEKLY_ROUTINES) {
    tracker.recordCompletion(routine.id, routine.day, routine.tasks.length, 0, { status: 'completed' });
  }

  const summary = tracker.generateWeeklySummary(weekStart);
  assert(summary.totalRoutines === 20, 'Tracker: 20 routines recorded');
  assert(summary.totalTasksCompleted === 107, 'Tracker: 107 tasks completed');
  assert(summary.totalTasksFailed === 0, 'Tracker: 0 failures');
  assert(summary.completionRate === 100, 'Tracker: 100% completion rate');
}

// ── 8. OutputPusher Integration ─────────────────────────────

async function testOutputPusherIntegration(): Promise<void> {
  console.log('\n--- OutputPusher Integration (live channels) ---');
  const pusher = createOutputPusher();
  const status = pusher.status();

  console.log(`  Channels: GDrive=${status.gdrive ? 'LIVE' : 'LOCAL'} Supabase=${status.supabase ? 'LIVE' : 'LOCAL'} Email=${status.email ? 'READY' : 'OFF'}`);

  // Push routine results for each day's routines
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
  let totalPushes = 0;
  let successfulPushes = 0;

  for (const day of days) {
    const dayRoutines = WEEKLY_ROUTINES.filter(r => r.day === day);
    for (const routine of dayRoutines) {
      const result = await pusher.pushRoutineResult(
        String(routine.tasks[0]?.agent ?? 'system'),
        routine.teams[0] ?? 'Operations',
        `${routine.name} (${day})`,
        `${routine.tasks.length} tasks completed: ${routine.tasks.map(t => t.name).join(', ')}`,
        [{ name: `${routine.name} completion`, value: 100, unit: '%', status: 'on-track' }],
      );
      totalPushes++;
      if (result.results.every(r => r.success)) successfulPushes++;
    }
  }

  assert(totalPushes >= 15, `Pushed ${totalPushes} routine results (Mon-Fri)`);
  assert(successfulPushes === totalPushes, `All ${successfulPushes}/${totalPushes} pushes succeeded`);

  // Push company agent strategy docs
  let companyPushes = 0;
  for (const agent of COMPANY_AGENTS.slice(0, 3)) { // First 3 to keep test fast
    const result = await pusher.pushStrategy(
      agent.leadAgent,
      agent.coworkTeams[0] ?? 'growth',
      `${agent.company} Strategy Update`,
      `Sector: ${agent.sector}\nTarget: ${agent.annualTarget}\nPositioning: ${agent.strategy.positioning}\nValue Prop: ${agent.strategy.valueProposition}\nTimeline: ${agent.strategy.timeline}`,
    );
    if (result.results.every(r => r.success)) companyPushes++;
  }
  assert(companyPushes === 3, `3 company strategy docs pushed`);

  // Push team KPIs
  const kpiOutputs: TaskOutput[] = Object.values(COWORK_TEAMS).map(team => ({
    agent: String(team.lead),
    team: team.name,
    category: 'kpi' as OutputCategory,
    title: `${team.name} Weekly KPIs`,
    content: `Team: ${team.name}\nKPIs: ${team.kpis.join(', ')}`,
    data: {
      kpis: team.kpis.map((name, i) => ({
        name,
        value: 85 + i * 2,
        unit: '%',
        status: 'on-track',
      })),
    },
  }));

  const kpiResults = await pusher.pushAll(kpiOutputs);
  assert(kpiResults.length === 6, '6 team KPI sets pushed');
  assert(kpiResults.every(r => r.results.every(rr => rr.success)), 'All KPI pushes succeeded');

  // Push weekly report to all 3 channels
  const weeklyResult = await pusher.pushWeeklyReport(
    'KTV Weekly Operations Report — Week 25, 2026',
    [
      '# KTV Weekly Operations Report',
      `**Week ending:** ${new Date().toISOString().split('T')[0]}`,
      '',
      '## Summary',
      '- **Agents:** 14 active (7 strategy + 7 operations)',
      '- **Teams:** 6 CoWork teams, all operational',
      '- **Routines:** 20/20 completed (107 tasks)',
      '- **Company Agents:** 13 companies tracked, 39 sub-agents active',
      '',
      '## Key Metrics',
      '| Metric | Value | Target | Status |',
      '|--------|-------|--------|--------|',
      '| Fleet Utilization | 78% | 70% | On Track |',
      '| Safety Incidents | 0 | 0 | On Track |',
      '| EBITDA Margin | 77.7% | 55% | Exceeding |',
      '| Pipeline Value | THB 145M | THB 180M | On Track |',
      '| NPS Score | 72 | 50 | Exceeding |',
      '| Backup Compliance | 100% | 100% | On Track |',
      '',
      '## Company Highlights',
      '- **One Bangkok:** THB 23.97M ACV deal in final stages',
      '- **Shell Thailand:** 400-station IoT pilot approved',
      '- **KBANK:** Green loan ESG data feed demo scheduled',
    ].join('\n'),
    {
      totalRoutines: 20,
      totalTasks: 107,
      completionRate: 100,
      agents: 14,
      teams: 6,
      companies: 13,
    },
  );

  assert(weeklyResult.results.length === 3, 'Weekly report pushed to 3 channels');
  assert(weeklyResult.results.every(r => r.success), 'All 3 weekly report channels succeeded');

  // Push alert
  const alertResult = await pusher.pushAlert(
    'safety-compliance',
    'Compliance & Safety',
    'Pre-Flight Pass Rate Below Target',
    'Pre-flight pass rate dropped to 93% (target: 95%). 2 drones failed compass calibration. Field maintenance dispatched.',
    'warning',
  );
  assert(alertResult.results.length === 2, 'Alert pushed to 2 channels (email + supabase)');
  assert(alertResult.results.every(r => r.success), 'Alert push succeeded');
}

// ── 9. CoWork Orchestrator Roster ───────────────────────────

function testRosters(): void {
  console.log('\n--- Roster Generation ---');
  const orch = new CoworkOrchestrator();

  const teamRoster = orch.printTeamRoster();
  assert(teamRoster.includes('GROWTH ENGINE'), 'Team roster has Growth Engine');
  assert(teamRoster.includes('SERVICE DELIVERY'), 'Team roster has Service Delivery');
  assert(teamRoster.includes('REVENUE OPERATIONS'), 'Team roster has Revenue Operations');

  const companyRoster = printCompanyAgentRoster();
  assert(companyRoster.includes('JLL Thailand'), 'Company roster has JLL');
  assert(companyRoster.includes('Shell Thailand'), 'Company roster has Shell');
  assert(companyRoster.includes('One Bangkok'), 'Company roster has One Bangkok');
}

// ── Run All Tests ───────────────────────────────────────────

async function main(): Promise<void> {
  console.log('KTV Working Drone Thailand — CoWork Agent Audit + Live Push Test');
  console.log('='.repeat(65));

  testTeamIntegrity();
  testCommands();
  testSessions();
  testRoutines();
  testRoutinePrompts();
  testCompanyAgents();
  testWeeklyReportTracker();
  await testOutputPusherIntegration();
  testRosters();

  console.log('\n' + '='.repeat(65));
  console.log(`Results: ${passed} passed, ${failed} failed`);

  // Clean up test output files
  const fs = await import('fs');
  const path = await import('path');
  const outputDir = path.join(process.cwd(), 'docs', 'output');
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
