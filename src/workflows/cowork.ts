/**
 * KTV Working Drone Thailand - CoWork Command
 * Unified coordination layer that bridges Strategy (Mastermind) and Operations agents
 * into automated professional teams for end-to-end ecosystem execution.
 *
 * 14 Agents organized into 6 specialist teams:
 *   Strategy Layer (Mastermind):  Market | Partner | Product | Finance | Deals | Sales | Ops
 *   Operations Layer:             Fleet | Jobs | CRM | Safety | Finance | Pilots | Data
 */

import { AgentRole } from '../types/index.js';
import { KtvEventType } from './event-bus.js';
import { WorkflowDefinition } from './engine.js';

// ── Team Definitions ─────────────────────────────────────────

export type CoworkTeamId =
  | 'growth'
  | 'delivery'
  | 'compliance'
  | 'intelligence'
  | 'ecosystem'
  | 'revenue';

export type StrategyAgent =
  | 'market_intelligence_strategist'
  | 'partner_strategy_architect'
  | 'smart_green_product_orchestrator'
  | 'financial_model_capital_planner'
  | 'deal_design_pitch_engineer'
  | 'sales_playbook_account_selector'
  | 'operations_compliance_mission_planner';

export interface CoworkTeam {
  id: CoworkTeamId;
  name: string;
  mission: string;
  lead: AgentRole | StrategyAgent;
  strategyAgents: StrategyAgent[];
  operationsAgents: AgentRole[];
  automatedWorkflows: string[];
  kpis: string[];
}

export interface CoworkCommand {
  id: string;
  name: string;
  description: string;
  teams: CoworkTeamId[];
  sequence: CoworkStep[];
  parallel: boolean;
}

export interface CoworkStep {
  id: string;
  name: string;
  team: CoworkTeamId;
  strategyTask?: { agent: StrategyAgent; action: string };
  operationsTask?: { agent: AgentRole; action: string };
  outputKey: string;
  dependsOn?: string[];
}

// ── 6 Professional Teams ─────────────────────────────────────

export const COWORK_TEAMS: Record<CoworkTeamId, CoworkTeam> = {

  // ── Team 1: Growth Engine ──────────────────────────────────
  // Finds opportunities, qualifies them, routes to correct channel
  growth: {
    id: 'growth',
    name: 'Growth Engine',
    mission: 'Identify, qualify, and route market opportunities through IFS or Direct KTV channels',
    lead: 'market_intelligence_strategist',
    strategyAgents: [
      'market_intelligence_strategist',
      'partner_strategy_architect',
      'sales_playbook_account_selector',
    ],
    operationsAgents: ['crm-sales', 'job-lifecycle'],
    automatedWorkflows: ['wf-lead-to-client'],
    kpis: [
      'New leads per week',
      'Lead-to-qualified conversion rate',
      'Pipeline value (THB)',
      'IFS vs Direct KTV channel split',
    ],
  },

  // ── Team 2: Service Delivery ───────────────────────────────
  // Executes drone missions end-to-end: planning → flight → data → delivery
  delivery: {
    id: 'delivery',
    name: 'Service Delivery',
    mission: 'Execute drone missions from planning through data delivery with zero safety incidents',
    lead: 'fleet-management',
    strategyAgents: [
      'operations_compliance_mission_planner',
      'smart_green_product_orchestrator',
    ],
    operationsAgents: [
      'fleet-management',
      'job-lifecycle',
      'pilot-operations',
      'safety-compliance',
      'data-processing',
    ],
    automatedWorkflows: [
      'wf-mission-prep',
      'wf-preflight-to-mission',
      'wf-post-mission',
    ],
    kpis: [
      'Missions completed per week',
      'Sqm cleaned/inspected',
      'Safety incidents (target: 0)',
      'On-time delivery rate',
      'Data backup compliance (target: 100%)',
    ],
  },

  // ── Team 3: Compliance & Safety ────────────────────────────
  // Ensures CAAT compliance, safety protocols, and certification currency
  compliance: {
    id: 'compliance',
    name: 'Compliance & Safety',
    mission: 'Maintain zero safety incidents, CAAT compliance, and fleet readiness at all times',
    lead: 'safety-compliance',
    strategyAgents: [
      'operations_compliance_mission_planner',
    ],
    operationsAgents: [
      'safety-compliance',
      'fleet-management',
      'pilot-operations',
    ],
    automatedWorkflows: [
      'wf-incident-response',
      'wf-maintenance-auto',
      'wf-cert-expiry',
    ],
    kpis: [
      'Safety incidents (target: 0)',
      'Pre-flight pass rate (target: >95%)',
      'Fleet availability rate',
      'Pilot certification currency',
      'CAAT compliance status',
    ],
  },

  // ── Team 4: Market Intelligence ────────────────────────────
  // Analyses markets, competitors, and strategic positioning
  intelligence: {
    id: 'intelligence',
    name: 'Market Intelligence',
    mission: 'Provide real-time market analysis, competitor tracking, and strategic recommendations',
    lead: 'market_intelligence_strategist',
    strategyAgents: [
      'market_intelligence_strategist',
      'partner_strategy_architect',
      'smart_green_product_orchestrator',
    ],
    operationsAgents: ['crm-sales', 'data-processing'],
    automatedWorkflows: [],
    kpis: [
      'TAM/SAM/SOM accuracy',
      'Opportunity pipeline scored and ranked',
      'Competitive intelligence freshness',
      'Smart Green adoption rate',
    ],
  },

  // ── Team 5: Ecosystem Builder ──────────────────────────────
  // Designs partnerships, pitches, and platform integrations
  ecosystem: {
    id: 'ecosystem',
    name: 'Ecosystem Builder',
    mission: 'Build and maintain the IFS partnership, Smart Green integrations, and new channel development',
    lead: 'partner_strategy_architect',
    strategyAgents: [
      'partner_strategy_architect',
      'deal_design_pitch_engineer',
      'smart_green_product_orchestrator',
      'sales_playbook_account_selector',
    ],
    operationsAgents: ['crm-sales', 'job-lifecycle'],
    automatedWorkflows: ['wf-lead-to-client'],
    kpis: [
      'IFS equity milestone progress (THB 32M → 64M → 160M)',
      'Smart Green integrated sites',
      'Partner satisfaction score',
      'New partnership proposals delivered',
    ],
  },

  // ── Team 6: Revenue Operations ─────────────────────────────
  // Manages financials, invoicing, collections, and deal economics
  revenue: {
    id: 'revenue',
    name: 'Revenue Operations',
    mission: 'Maximise revenue, maintain healthy margins, and ensure timely collections',
    lead: 'finance-invoicing',
    strategyAgents: [
      'financial_model_capital_planner',
      'deal_design_pitch_engineer',
      'sales_playbook_account_selector',
    ],
    operationsAgents: [
      'finance-invoicing',
      'crm-sales',
      'job-lifecycle',
    ],
    automatedWorkflows: [
      'wf-delivery-to-payment',
      'wf-overdue-collection',
    ],
    kpis: [
      'Gross revenue vs Year 1 target (THB 180.18M)',
      'EBITDA margin (target: >55%)',
      'Invoice collection rate',
      'Days sales outstanding',
      'IRR tracking',
    ],
  },
};

// ── CoWork Commands ──────────────────────────────────────────
// Pre-built orchestration sequences that coordinate multiple teams

export const COWORK_COMMANDS: CoworkCommand[] = [
  {
    id: 'cowork-full-cycle',
    name: 'Full Business Cycle',
    description: 'End-to-end: market analysis → lead qualification → mission → delivery → payment',
    teams: ['intelligence', 'growth', 'delivery', 'revenue'],
    parallel: false,
    sequence: [
      {
        id: 'analyse-market',
        name: 'Market opportunity scan',
        team: 'intelligence',
        strategyTask: { agent: 'market_intelligence_strategist', action: 'scan-opportunities' },
        outputKey: 'marketScan',
      },
      {
        id: 'route-opportunities',
        name: 'Route to IFS or Direct KTV',
        team: 'growth',
        strategyTask: { agent: 'partner_strategy_architect', action: 'route-opportunity' },
        outputKey: 'routing',
        dependsOn: ['analyse-market'],
      },
      {
        id: 'qualify-and-pipeline',
        name: 'Qualify leads and build pipeline',
        team: 'growth',
        strategyTask: { agent: 'sales_playbook_account_selector', action: 'prioritise-accounts' },
        operationsTask: { agent: 'crm-sales', action: 'advance-lead' },
        outputKey: 'pipeline',
        dependsOn: ['route-opportunities'],
      },
      {
        id: 'financial-check',
        name: 'Deal economics and guardrail validation',
        team: 'revenue',
        strategyTask: { agent: 'financial_model_capital_planner', action: 'check-deal-economics' },
        outputKey: 'dealEconomics',
        dependsOn: ['qualify-and-pipeline'],
      },
      {
        id: 'mission-planning',
        name: 'Plan drone mission and assess feasibility',
        team: 'delivery',
        strategyTask: { agent: 'operations_compliance_mission_planner', action: 'assess-feasibility' },
        operationsTask: { agent: 'fleet-management', action: 'get-available-drones' },
        outputKey: 'missionPlan',
        dependsOn: ['financial-check'],
      },
      {
        id: 'execute-and-deliver',
        name: 'Execute mission and process data',
        team: 'delivery',
        operationsTask: { agent: 'job-lifecycle', action: 'advance-stage' },
        outputKey: 'delivery',
        dependsOn: ['mission-planning'],
      },
      {
        id: 'invoice-and-collect',
        name: 'Invoice and collection',
        team: 'revenue',
        operationsTask: { agent: 'finance-invoicing', action: 'create-invoice' },
        outputKey: 'invoice',
        dependsOn: ['execute-and-deliver'],
      },
    ],
  },

  {
    id: 'cowork-new-partner',
    name: 'New Partner Onboarding',
    description: 'Evaluate, pitch, and onboard a new partnership opportunity',
    teams: ['intelligence', 'ecosystem', 'revenue'],
    parallel: false,
    sequence: [
      {
        id: 'market-context',
        name: 'Market context for partner segment',
        team: 'intelligence',
        strategyTask: { agent: 'market_intelligence_strategist', action: 'segment-analysis' },
        outputKey: 'marketContext',
      },
      {
        id: 'partner-routing',
        name: 'Determine channel and JV implications',
        team: 'ecosystem',
        strategyTask: { agent: 'partner_strategy_architect', action: 'evaluate-partnership' },
        outputKey: 'partnerEval',
        dependsOn: ['market-context'],
      },
      {
        id: 'deal-economics',
        name: 'Model financial impact and milestones',
        team: 'revenue',
        strategyTask: { agent: 'financial_model_capital_planner', action: 'model-partnership' },
        outputKey: 'financials',
        dependsOn: ['partner-routing'],
      },
      {
        id: 'create-pitch',
        name: 'Generate pitch materials',
        team: 'ecosystem',
        strategyTask: { agent: 'deal_design_pitch_engineer', action: 'create-deck' },
        outputKey: 'pitchMaterials',
        dependsOn: ['deal-economics'],
      },
      {
        id: 'sales-playbook',
        name: 'Build sector-specific sales playbook',
        team: 'ecosystem',
        strategyTask: { agent: 'sales_playbook_account_selector', action: 'create-playbook' },
        outputKey: 'playbook',
        dependsOn: ['create-pitch'],
      },
    ],
  },

  {
    id: 'cowork-daily-ops',
    name: 'Daily Operations Briefing',
    description: 'Morning briefing: all teams report status, KPIs, and blockers',
    teams: ['compliance', 'delivery', 'revenue', 'growth'],
    parallel: true,
    sequence: [
      {
        id: 'safety-brief',
        name: 'Safety & compliance status',
        team: 'compliance',
        operationsTask: { agent: 'safety-compliance', action: 'get-safety-stats' },
        outputKey: 'safety',
      },
      {
        id: 'fleet-brief',
        name: 'Fleet readiness report',
        team: 'delivery',
        operationsTask: { agent: 'fleet-management', action: 'get-fleet-summary' },
        outputKey: 'fleet',
      },
      {
        id: 'pilot-brief',
        name: 'Pilot availability report',
        team: 'delivery',
        operationsTask: { agent: 'pilot-operations', action: 'get-available-pilots' },
        outputKey: 'pilots',
      },
      {
        id: 'finance-brief',
        name: 'Revenue and collections snapshot',
        team: 'revenue',
        operationsTask: { agent: 'finance-invoicing', action: 'get-financial-summary' },
        outputKey: 'finance',
      },
      {
        id: 'pipeline-brief',
        name: 'Sales pipeline status',
        team: 'growth',
        operationsTask: { agent: 'crm-sales', action: 'get-pipeline' },
        outputKey: 'pipeline',
      },
      {
        id: 'data-brief',
        name: 'Data processing queue',
        team: 'delivery',
        operationsTask: { agent: 'data-processing', action: 'get-processing-stats' },
        outputKey: 'dataQueue',
      },
    ],
  },

  {
    id: 'cowork-scale-up',
    name: 'Scale-Up Planning',
    description: 'Plan capacity expansion: market → fleet → pilots → finance → partnerships',
    teams: ['intelligence', 'delivery', 'compliance', 'revenue', 'ecosystem'],
    parallel: false,
    sequence: [
      {
        id: 'demand-forecast',
        name: 'Forecast demand by segment and region',
        team: 'intelligence',
        strategyTask: { agent: 'market_intelligence_strategist', action: 'forecast-demand' },
        outputKey: 'demandForecast',
      },
      {
        id: 'capacity-gap',
        name: 'Identify fleet and pilot capacity gaps',
        team: 'delivery',
        strategyTask: { agent: 'operations_compliance_mission_planner', action: 'capacity-analysis' },
        operationsTask: { agent: 'fleet-management', action: 'get-fleet-summary' },
        outputKey: 'capacityGap',
        dependsOn: ['demand-forecast'],
      },
      {
        id: 'hiring-plan',
        name: 'Pilot hiring and certification plan',
        team: 'compliance',
        operationsTask: { agent: 'pilot-operations', action: 'get-available-pilots' },
        outputKey: 'hiringPlan',
        dependsOn: ['capacity-gap'],
      },
      {
        id: 'capex-model',
        name: 'Capital expenditure and ROI model',
        team: 'revenue',
        strategyTask: { agent: 'financial_model_capital_planner', action: 'model-expansion' },
        outputKey: 'capexModel',
        dependsOn: ['capacity-gap'],
      },
      {
        id: 'partner-expansion',
        name: 'Partner capacity and territory expansion',
        team: 'ecosystem',
        strategyTask: { agent: 'partner_strategy_architect', action: 'plan-expansion' },
        outputKey: 'partnerExpansion',
        dependsOn: ['capex-model'],
      },
    ],
  },

  {
    id: 'cowork-smart-green',
    name: 'Smart Green Rollout',
    description: 'Deploy Smart Green Operations platform to a new site or portfolio',
    teams: ['ecosystem', 'delivery', 'compliance', 'intelligence'],
    parallel: false,
    sequence: [
      {
        id: 'site-assessment',
        name: 'Assess site for Smart Green integration',
        team: 'ecosystem',
        strategyTask: { agent: 'smart_green_product_orchestrator', action: 'assess-site' },
        outputKey: 'siteAssessment',
      },
      {
        id: 'integration-design',
        name: 'Design BMS/CMMS integration flow',
        team: 'ecosystem',
        strategyTask: { agent: 'smart_green_product_orchestrator', action: 'design-integration' },
        outputKey: 'integrationDesign',
        dependsOn: ['site-assessment'],
      },
      {
        id: 'ops-feasibility',
        name: 'Drone operations feasibility for site',
        team: 'compliance',
        strategyTask: { agent: 'operations_compliance_mission_planner', action: 'assess-feasibility' },
        outputKey: 'opsFeasibility',
        dependsOn: ['site-assessment'],
      },
      {
        id: 'telemetry-config',
        name: 'Configure ESG telemetry capture',
        team: 'delivery',
        strategyTask: { agent: 'smart_green_product_orchestrator', action: 'configure-telemetry' },
        outputKey: 'telemetryConfig',
        dependsOn: ['integration-design'],
      },
      {
        id: 'esg-baseline',
        name: 'Establish ESG baseline metrics',
        team: 'intelligence',
        strategyTask: { agent: 'smart_green_product_orchestrator', action: 'establish-baseline' },
        outputKey: 'esgBaseline',
        dependsOn: ['telemetry-config'],
      },
    ],
  },
];

// ── CoWork Orchestrator ──────────────────────────────────────

export interface CoworkSession {
  id: string;
  commandId: string;
  status: 'initializing' | 'running' | 'completed' | 'failed';
  teamsActivated: CoworkTeamId[];
  stepsCompleted: string[];
  stepResults: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export class CoworkOrchestrator {
  private sessions: Map<string, CoworkSession> = new Map();

  getTeam(teamId: CoworkTeamId): CoworkTeam {
    return COWORK_TEAMS[teamId];
  }

  getCommand(commandId: string): CoworkCommand | undefined {
    return COWORK_COMMANDS.find(c => c.id === commandId);
  }

  getAllTeams(): CoworkTeam[] {
    return Object.values(COWORK_TEAMS);
  }

  getAllCommands(): CoworkCommand[] {
    return COWORK_COMMANDS;
  }

  /** Start a cowork session */
  createSession(commandId: string): CoworkSession {
    const command = this.getCommand(commandId);
    if (!command) {
      throw new Error(`CoWork command not found: ${commandId}`);
    }

    const session: CoworkSession = {
      id: `CW-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      commandId,
      status: 'initializing',
      teamsActivated: [...command.teams],
      stepsCompleted: [],
      stepResults: {},
      startedAt: new Date(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): CoworkSession | undefined {
    return this.sessions.get(sessionId);
  }

  getActiveSessions(): CoworkSession[] {
    return Array.from(this.sessions.values())
      .filter(s => s.status === 'running' || s.status === 'initializing');
  }

  getSessionHistory(limit = 50): CoworkSession[] {
    return Array.from(this.sessions.values())
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }

  /** Generate the team roster display */
  printTeamRoster(): string {
    const lines: string[] = [];
    lines.push('╔════════════════════════════════════════════════════════════════════╗');
    lines.push('║              KTV COWORK — Unified Agent Teams                     ║');
    lines.push('║              14 Agents | 6 Teams | 5 Commands                     ║');
    lines.push('╠════════════════════════════════════════════════════════════════════╣');

    for (const team of Object.values(COWORK_TEAMS)) {
      lines.push(`║                                                                    ║`);
      lines.push(`║  ┌─ ${team.name.toUpperCase().padEnd(60)}┐  ║`);
      lines.push(`║  │  Mission: ${team.mission.slice(0, 52).padEnd(52)}│  ║`);
      lines.push(`║  │  Lead: ${String(team.lead).padEnd(55)}│  ║`);
      lines.push(`║  │                                                              │  ║`);
      lines.push(`║  │  Strategy Agents:                                            │  ║`);
      for (const sa of team.strategyAgents) {
        lines.push(`║  │    • ${sa.padEnd(57)}│  ║`);
      }
      lines.push(`║  │  Operations Agents:                                          │  ║`);
      for (const oa of team.operationsAgents) {
        lines.push(`║  │    • ${oa.padEnd(57)}│  ║`);
      }
      lines.push(`║  │                                                              │  ║`);
      lines.push(`║  │  KPIs:                                                       │  ║`);
      for (const kpi of team.kpis) {
        lines.push(`║  │    → ${kpi.slice(0, 57).padEnd(57)}│  ║`);
      }
      lines.push(`║  └──────────────────────────────────────────────────────────────┘  ║`);
    }

    lines.push('╠════════════════════════════════════════════════════════════════════╣');
    lines.push('║  Available Commands:                                               ║');
    for (const cmd of COWORK_COMMANDS) {
      lines.push(`║    /cowork ${cmd.id.replace('cowork-', '').padEnd(16)} ${cmd.name.slice(0, 38).padEnd(38)} ║`);
    }
    lines.push('╚════════════════════════════════════════════════════════════════════╝');

    return lines.join('\n');
  }

  /** Summary stats */
  getStats(): {
    totalTeams: number;
    totalAgents: number;
    strategyAgents: number;
    operationsAgents: number;
    commands: number;
    activeSessions: number;
    completedSessions: number;
  } {
    const allStrategy = new Set<string>();
    const allOps = new Set<string>();
    for (const team of Object.values(COWORK_TEAMS)) {
      team.strategyAgents.forEach(a => allStrategy.add(a));
      team.operationsAgents.forEach(a => allOps.add(a));
    }

    const sessions = Array.from(this.sessions.values());
    return {
      totalTeams: Object.keys(COWORK_TEAMS).length,
      totalAgents: allStrategy.size + allOps.size,
      strategyAgents: allStrategy.size,
      operationsAgents: allOps.size,
      commands: COWORK_COMMANDS.length,
      activeSessions: sessions.filter(s => s.status === 'running').length,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
    };
  }
}

// ── Workflow Definitions for CoWork Commands ──────────────────
// These bridge CoWork commands into the existing WorkflowEngine

export const COWORK_WORKFLOW_DAILY_BRIEFING: WorkflowDefinition = {
  id: 'wf-cowork-daily-briefing',
  name: 'CoWork Daily Briefing',
  description: 'Automated morning briefing across all 6 teams',
  trigger: 'system.health.recovered',
  steps: [
    {
      id: 'cw-safety',
      name: '[Compliance] Safety status',
      agent: 'safety-compliance',
      action: 'get-safety-stats',
      inputMap: () => ({}),
      outputKey: 'safety',
    },
    {
      id: 'cw-fleet',
      name: '[Delivery] Fleet readiness',
      agent: 'fleet-management',
      action: 'get-fleet-summary',
      inputMap: () => ({}),
      outputKey: 'fleet',
    },
    {
      id: 'cw-pilots',
      name: '[Delivery] Pilot availability',
      agent: 'pilot-operations',
      action: 'get-available-pilots',
      inputMap: () => ({}),
      outputKey: 'pilots',
    },
    {
      id: 'cw-jobs',
      name: '[Delivery] Job pipeline',
      agent: 'job-lifecycle',
      action: 'get-pipeline-summary',
      inputMap: () => ({}),
      outputKey: 'jobs',
    },
    {
      id: 'cw-finance',
      name: '[Revenue] Financial snapshot',
      agent: 'finance-invoicing',
      action: 'get-financial-summary',
      inputMap: () => ({ period: new Date().toISOString().split('T')[0] }),
      outputKey: 'finance',
    },
    {
      id: 'cw-crm',
      name: '[Growth] CRM pipeline',
      agent: 'crm-sales',
      action: 'get-pipeline',
      inputMap: () => ({}),
      outputKey: 'crm',
    },
    {
      id: 'cw-data',
      name: '[Delivery] Data processing queue',
      agent: 'data-processing',
      action: 'get-processing-stats',
      inputMap: () => ({}),
      outputKey: 'dataQueue',
    },
  ],
};

export const COWORK_WORKFLOWS: WorkflowDefinition[] = [
  COWORK_WORKFLOW_DAILY_BRIEFING,
];
