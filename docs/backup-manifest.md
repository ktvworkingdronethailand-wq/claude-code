# KTV Working Drone Thailand - Complete System Backup Manifest

Generated: 2026-04-27
Branch: claude/ai-agents-ktv-drone-ZsAc0
Status: 94/94 tests passing, 0 failures

---

## 1. Project Configuration

### package.json
- Name: ktv-working-drone-thailand v1.0.0
- Runtime: TypeScript (ES2022, Node16, strict mode)
- Entry: dist/src/index.js
- Scripts: build (tsc), start, test (3 suites), lint (noEmit)
- Dependencies: ruflo ^3.5.15, @types/node ^25.6.0, typescript ^5.4.0

### tsconfig.json
- Target: ES2022, Module: Node16, Strict: true
- Paths: src/**/*.ts, tests/**/*.ts, scripts/**/*.ts
- Output: ./dist with declaration + sourcemaps

### .mcp.json
- claude-flow: npx ruflo@latest mcp start (V3, hierarchical-mesh, 15 agents, hybrid memory)
- notion: https://mcp.notion.com/mcp

### .claude-flow/config.yaml
- Version: 3.0.0
- Swarm: hierarchical-mesh, maxAgents 15, autoScale, consensus coordination
- Memory: hybrid + HNSW, learning bridge (SONA balanced), memory graph (PageRank 0.85)
- Neural: enabled
- Hooks: enabled + autoExecute

### .claude/settings.json
- 10 hook types: PreToolUse, PostToolUse, UserPromptSubmit, SessionStart, SessionEnd, Stop, PreCompact, SubagentStart, SubagentStop, Notification
- Status line: statusline.cjs
- Permissions: allow claude-flow/ruflo, deny .env reads
- Model: claude-opus-4-6 (routing: claude-haiku-4-5-20251001)
- Agent teams: enabled (auto mode, mailbox, task list, shared memory)
- Learning: coordination, optimization, prediction patterns
- Security: autoScan, scanOnEdit, CVE check, threat model

---

## 2. CLAUDE.md (Project Instructions)

Location: /CLAUDE.md (241 lines)

### Key sections:
- Project Overview: AI agent-powered drone ops, TypeScript + Python, RuFlo V3
- Build & Test: npm run build/start/test/lint
- Architecture: 3-layer system (Agents -> Brain -> Operations)
- 10 external integrations (LINE, Odoo, S3, FlightHub, Notion, GDrive, Asana, Airtable, Supabase, Gamma)
- Behavioral Rules: minimal changes, no unnecessary files, test after changes
- Swarm & Orchestration: hierarchical-mesh, 15 agents, HNSW memory
- Supabase Dashboard: 6 tables, realtime, telemetry API
- Gamma Presentations: 4 pre-built report types, 10-slide pitch deck
- Security: no hardcoded keys, input validation, path sanitization

---

## 3. Operational Agents (src/agents/) - 7 + Orchestrator

| File | Agent | Role | Key Capabilities |
|------|-------|------|------------------|
| base-agent.ts | KtvAgent | Base class | Message handling, health reporting, task tracking |
| orchestrator.ts | KtvOrchestrator | Registry | 7-agent registry, message routing, 60s health checks |
| fleet-management.ts | Fleet Manager | fleet-management | 16 DJI drones, utilization, maintenance alerts |
| job-lifecycle.ts | Job Manager | job-lifecycle | 13-stage jobs, pipeline tracking, cycle times |
| crm-sales.ts | CRM & Sales | crm-sales | Lead scoring, IFS pipeline, NPS, segmentation |
| safety-compliance.ts | Safety & Compliance | safety-compliance | Preflight checklists, risk assessment, CAAT compliance |
| finance-invoicing.ts | Finance & Invoicing | finance-invoicing | Invoices, VAT 7%, royalty 7%, overdue tracking |
| pilot-operations.ts | Pilot Operations | pilot-operations | 10 pilots, certifications, scheduling, performance |
| data-processing.ts | Data Processing | data-processing | 4-copy backup, photogrammetry, QA, delivery |
| index.ts | Exports | - | Re-exports all agents |

---

## 4. Workflows (src/workflows/) - 15 Total

### Core Workflows (10) - definitions.ts
| ID | Name | Trigger | Steps |
|----|------|---------|-------|
| wf-lead-to-client | Lead Qualification & Onboarding | lead.created | 2 |
| wf-mission-prep | Mission Preparation Pipeline | job.stage.changed | 5 |
| wf-preflight-to-mission | Pre-Flight to Mission Launch | job.stage.changed | 2 |
| wf-post-mission | Post-Mission Data Pipeline | mission.completed | 8 |
| wf-delivery-to-payment | Delivery to Payment Collection | data.qa.passed | 3 |
| wf-maintenance-auto | Auto-Maintenance Scheduling | fleet.maintenance.due | 2 |
| wf-incident-response | Incident Emergency Response | safety.incident.reported | 3 |
| wf-overdue-collection | Overdue Invoice Collection | finance.invoice.overdue | 2 |
| wf-cert-expiry | Certification Expiry Handler | pilot.certification.expiring | 2 |
| wf-daily-ops | Daily Operations Health Check | system.health.recovered | 7 |

### Connected App Workflows (5) - connected-apps.ts
| ID | Name | Trigger | Steps |
|----|------|---------|-------|
| wf-connected-lead-onboard | Lead Welcome & Meeting Setup | lead.created | 2 |
| wf-connected-mission-brief | Mission Briefing & Calendar | mission.preflight.passed | 2 |
| wf-connected-invoice-email | Invoice Email to Client | finance.invoice.sent | 1 |
| wf-connected-safety-alert | Safety Incident Emergency Alerts | safety.incident.reported | 1 |
| wf-connected-cert-expiry | Certification Expiry Alerts | pilot.certification.expiring | 2 |

### Workflow Infrastructure
| File | Purpose |
|------|---------|
| engine.ts | WorkflowEngine: register, execute, retry, step conditions |
| event-bus.ts | EventBus: pub/sub, 46 event types, event log (10k max) |
| brain.ts | OperationsBrain: central coordinator, decision log, reactive listeners |
| triggers.ts | TriggerManager: 6 interval-based automated triggers |
| connected-apps.ts | Gmail + Calendar templates, 9 automations, team contacts |
| cowork.ts | CoworkOrchestrator: 14 team members, 6 teams |

### Automated Triggers (6) - triggers.ts
| ID | Name | Interval |
|----|------|----------|
| trig-fleet-health | Fleet Health Monitor | 5 min |
| trig-cert-check | Pilot Certification Checker | 30 min |
| trig-overdue-invoices | Overdue Invoice Scanner | 15 min |
| trig-safety-stats | Safety Stats Aggregator | 10 min |
| trig-data-queue | Data Processing Queue Monitor | 5 min |
| trig-crm-pipeline | CRM Pipeline Monitor | 20 min |

### Connected App Automations (9)
| Name | Trigger | Apps |
|------|---------|------|
| Welcome New Leads | lead.created | Gmail + Calendar |
| Mission Crew Briefing | mission.preflight.passed | Gmail + Calendar |
| Site Assessment Scheduling | job.created | Calendar |
| Invoice Delivery | finance.invoice.sent | Gmail |
| Overdue Invoice Follow-up | finance.invoice.overdue | Gmail |
| Safety Incident Alert | safety.incident.reported | Gmail |
| Certification Expiry Alert | pilot.certification.expiring | Gmail + Calendar |
| Maintenance Calendar Block | fleet.maintenance.due | Calendar |
| Daily Ops Email Summary | system.health.recovered | Gmail + Calendar |

---

## 5. Operations Layer (src/operations/)

| File | Class/Purpose |
|------|---------------|
| ktv-platform.ts | KtvPlatform: unified facade, bootstrap, inquiry handling |
| automated-reporting.ts | AutomatedReportingOrchestrator: 8-platform parallel push |
| reporting.ts | ReportingEngine: KPI aggregation, executive summaries |
| service-operations.ts | ServiceOperations: 6 service lines with pricing |
| scheduling.ts | Scheduling: mission calendar, pilot/drone assignment |
| client-onboarding.ts | ClientOnboarding: lead-to-client pipeline |
| supply-chain.ts | SupplyChain: drone parts, battery inventory |

### 8 Report Distribution Platforms
| Platform | Output Directory |
|----------|-----------------|
| Notion | docs/reports/notion/ |
| Asana | docs/reports/asana/ |
| Airtable | docs/reports/airtable/ |
| Supabase | docs/reports/supabase/ |
| Gamma | docs/reports/gamma/ |
| Canva | docs/reports/canva/ |
| Google Drive | docs/reports/gdrive/ |
| Email | docs/reports/email/ |

---

## 6. Integrations (src/integrations/)

| File | Platform | Purpose |
|------|----------|---------|
| line-connector.ts | LINE | Thai customer messaging |
| external-systems.ts | Odoo + S3 + FlightHub | ERP, storage, fleet telemetry |
| notion.ts | Notion | Workspace pages, agent snapshots |
| gdrive.ts | Google Drive | Document storage, folder structure |
| asana.ts | Asana | Task management for 6 CoWork teams |
| airtable.ts | Airtable | KPI snapshots, structured records |
| supabase.ts | Supabase | Real-time dashboard, telemetry |
| gamma.ts | Gamma | AI-generated presentations |
| canva.ts | Canva | Pitch deck design |

---

## 7. Configuration (src/config/)

| File | Contents |
|------|----------|
| ktv-operations.ts | Company info, 6 service lines + pricing, CAAT regs (90m altitude, 9km airport), 16 DJI drones, financial rules (7% VAT, 7% royalty, 20% corp tax) |
| jv-partners.ts | IFS Thailand JV, Smart Green ESG, financial projections |
| thai-climate-act.ts | Climate Change Act, ETS, T-VER credits, IoT sensors, IFS Green FM strategy |

---

## 8. Type System (src/types/index.ts)

Key domains: AgentRole, AgentMessage, Drone, Fleet, Job (13 stages), Lead, Client, RiskAssessment, WeatherCheck, Invoice, Pilot, DataJob, AgentHealth, OperationalKPIs, ExecutiveSummary

---

## 9. Claude Code Agent Templates (98 files in .claude/agents/)

### analysis/ (3 agents)
- analyze-code-quality.md, code-analyzer.md, code-review/analyze-code-quality.md

### architecture/ (2)
- arch-system-design.md, system-design/arch-system-design.md

### consensus/ (7)
- byzantine-coordinator.md, crdt-synchronizer.md, gossip-coordinator.md
- performance-benchmarker.md, quorum-manager.md, raft-manager.md, security-manager.md

### core/ (5)
- coder.md, planner.md, researcher.md, reviewer.md, tester.md

### custom/ (1)
- test-long-runner.md

### data/ (2)
- data-ml-model.md, ml/data-ml-model.md

### development/ (2)
- dev-backend-api.md, backend/dev-backend-api.md

### devops/ (2)
- ops-cicd-github.md, ci-cd/ops-cicd-github.md

### documentation/ (2)
- docs-api-openapi.md, api-docs/docs-api-openapi.md

### flow-nexus/ (9)
- app-store.md, authentication.md, challenges.md, neural-network.md
- payments.md, sandbox.md, swarm.md, user-tools.md, workflow.md

### github/ (12)
- code-review-swarm.md, github-modes.md, issue-tracker.md
- multi-repo-swarm.md, pr-manager.md, project-board-sync.md
- release-manager.md, release-swarm.md, repo-architect.md
- swarm-issue.md, swarm-pr.md, sync-coordinator.md, workflow-automation.md

### goal/ (2)
- agent.md, goal-planner.md

### optimization/ (5)
- benchmark-suite.md, load-balancer.md, performance-monitor.md
- resource-allocator.md, topology-optimizer.md

### payments/ (1)
- agentic-payments.md

### sona/ (1)
- sona-learning-optimizer.md

### sparc/ (4)
- architecture.md, pseudocode.md, refinement.md, specification.md

### specialized/ (2)
- spec-mobile-react-native.md, mobile/spec-mobile-react-native.md

### sublinear/ (5)
- consensus-coordinator.md, matrix-optimizer.md, pagerank-analyzer.md
- performance-optimizer.md, trading-predictor.md

### swarm/ (3)
- adaptive-coordinator.md, hierarchical-coordinator.md, mesh-coordinator.md

### templates/ (9)
- automation-smart-agent.md, base-template-generator.md
- coordinator-swarm-init.md, github-pr-manager.md
- implementer-sparc-coder.md, memory-coordinator.md
- orchestrator-task.md, performance-analyzer.md, sparc-coordinator.md

### testing/ (2)
- production-validator.md, tdd-london-swarm.md

### v3/ (16)
- adr-architect.md, aidefence-guardian.md, claims-authorizer.md
- collective-intelligence-coordinator.md, ddd-domain-expert.md
- injection-analyst.md, memory-specialist.md, performance-engineer.md
- pii-detector.md, reasoningbank-learner.md, security-architect-aidefence.md
- security-architect.md, security-auditor.md, sparc-orchestrator.md
- swarm-memory-manager.md, v3-integration-architect.md

---

## 10. Claude Code Skills (31 skills in .claude/skills/)

| Skill | Purpose |
|-------|---------|
| agentdb-advanced | Advanced AgentDB patterns |
| agentdb-learning | AI learning patterns |
| agentdb-memory-patterns | Persistent memory |
| agentdb-optimization | AgentDB performance |
| agentdb-vector-search | Semantic vector search |
| browser | Web browser automation |
| cowork | KTV CoWork orchestration |
| github-code-review | GitHub code review |
| github-multi-repo | Multi-repo coordination |
| github-project-management | GitHub project management |
| github-release-management | GitHub releases |
| github-workflow-automation | GitHub Actions workflows |
| hooks-automation | Hook coordination |
| pair-programming | AI pair programming |
| reasoningbank-agentdb | ReasoningBank + AgentDB |
| reasoningbank-intelligence | Adaptive learning |
| skill-builder | Create new skills |
| sparc-methodology | SPARC development methodology |
| stream-chain | Stream-JSON chaining |
| swarm-advanced | Advanced swarm patterns |
| swarm-orchestration | Multi-agent orchestration |
| v3-cli-modernization | CLI modernization |
| v3-core-implementation | Core module implementation |
| v3-ddd-architecture | Domain-Driven Design |
| v3-integration-deep | Deep agentic-flow integration |
| v3-mcp-optimization | MCP server optimization |
| v3-memory-unification | Memory system unification |
| v3-performance-optimization | Performance optimization |
| v3-security-overhaul | Security architecture |
| v3-swarm-coordination | 15-agent swarm coordination |
| verification-quality | Truth source verification |

---

## 11. Hook Helpers (40 files in .claude/helpers/)

| File | Purpose |
|------|---------|
| hook-handler.cjs | Main hook dispatcher (pre-bash, pre-edit, post-edit, route, session, compact) |
| intelligence.cjs | Pattern matching, task routing, learning |
| auto-memory-hook.mjs | Cross-session memory import/sync |
| statusline.cjs | VS Code status line display |
| router.js | Task routing logic |
| session.js | Session management |
| memory.js | Memory operations |
| metrics-db.mjs | Metrics database |
| learning-service.mjs | Learning service |
| github-safe.js | Safe GitHub operations |
| pre-commit | Git pre-commit hook |
| post-commit | Git post-commit hook |
| adr-compliance.sh | ADR compliance checks |
| auto-commit.sh | Auto-commit automation |
| checkpoint-manager.sh | Checkpoint management |
| daemon-manager.sh | Background daemon control |
| ddd-tracker.sh | DDD bounded context tracking |
| github-setup.sh | GitHub setup automation |
| guidance-hook.sh | Guidance hook |
| guidance-hooks.sh | Multiple guidance hooks |
| health-monitor.sh | Health monitoring |
| learning-hooks.sh | Learning hook integration |
| learning-optimizer.sh | Learning optimization |
| pattern-consolidator.sh | Pattern consolidation |
| perf-worker.sh | Performance worker |
| quick-start.sh | Quick start script |
| security-scanner.sh | Security scanning |
| setup-mcp.sh | MCP server setup |
| standard-checkpoint-hooks.sh | Standard checkpoint hooks |
| statusline-hook.sh | Status line hook |
| statusline.js | Status line (JS version) |
| swarm-comms.sh | Swarm communication |
| swarm-hooks.sh | Swarm event hooks |
| swarm-monitor.sh | Swarm monitoring |
| sync-v3-metrics.sh | V3 metrics sync |
| update-v3-progress.sh | V3 progress tracking |
| v3-quick-status.sh | V3 quick status check |
| v3.sh | V3 utilities |
| validate-v3-config.sh | V3 config validation |
| worker-manager.sh | Background worker management |

---

## 12. Documentation (docs/)

### Business Documents
| File | Content |
|------|---------|
| 00-KTV-BUSINESS-BREAKDOWN-INDEX.md | Master index |
| 01-market-research.md | Thai drone market analysis |
| 02-business-plan.md | Full business plan |
| 03-operational-workflows.md | Operational workflow documentation |
| 04-technology-systems.md | Technology stack |
| 05-marketing-strategy.md | Marketing strategy |
| 06-legal-financials.md | Legal and financial structure |
| 07-INVESTOR-FINANCIALS-VERIFIED.md | Verified investor financials |
| 08-STRATEGIC-INVESTMENT-SKYLLER.md | Skyller strategic investment |
| 09-NDA-KTV-IFS-FACILITY-SERVICES.md | KTV-IFS NDA |

### Agent Skills Documentation (docs/agents/)
- crm-sales.md, data-processing.md, finance-invoicing.md
- fleet-management.md, job-lifecycle.md, pilot-operations.md, safety-compliance.md

### One Bangkok Initiative (docs/one-bangkok/)
- battle-plan/00-executive-summary.md
- market-intelligence/01-market-intelligence-brief.md
- partnership/02-partnership-structure.md
- financial-model/03-deal-economics.md
- pitch-deck/04-pitch-deck-outline.md
- compliance/05-caat-feasibility.md
- smart-green/06-smart-green-integration.md
- sales-playbook/07-sales-playbook.md
- templates/: airtable-schema.md, asana-tasks.md, google-drive-structure.md, notion-structure.md

### Generated Reports (docs/reports/)
- weekly-2026-04-20.md, weekly-2026-04-26.md
- notion/, asana/, airtable/, supabase/, gamma/, canva/, gdrive/, email/

### Dashboard
- docs/dashboard/ktv-master-dashboard.html (Supabase real-time dashboard)

---

## 13. Test Suites (tests/)

| File | Tests | Coverage |
|------|-------|----------|
| agents.test.ts | 7 agents, orchestrator, message routing, health checks | All 7 agents |
| workflows.test.ts | 15 workflows, brain, triggers, event bus, connected apps | Full workflow layer |
| platform.test.ts | KtvPlatform, end-to-end inquiry, operations, integrations | Full platform |
| **Total** | **94 tests, 0 failures** | |

---

## 14. Scripts

| File | Purpose |
|------|---------|
| scripts/demo-full-report.ts | Full proof-of-execution demo (8 proofs) |
| scripts/supabase/001_ktv_dashboard_schema.sql | Supabase schema setup |

---

## 15. Python Mastermind (src/mastermind/)

7 expert strategy agents: Market, Partner, SmartGreen, Financial, Deal, Sales, Operations
- Entry: main.py -> orchestrator.py
- Support: memory.py, tools.py, prompts.py
- Tests: tests/mastermind.test.py

---

## 16. Key Business Metrics

| Metric | Value |
|--------|-------|
| Target ACV | THB 23.97M |
| EBITDA Margin | 77.7% |
| Payback Period | 3.6 months |
| Investment | USD 1.455M |
| ROI | 1350% |
| IRR | 257% |
| Fleet Size | 16 DJI enterprise drones |
| Certified Pilots | 10 |
| Service Lines | 6 |
| GHG Reduction | 96% vs rope access |
| Cost Savings | 60-70% (30 vs 80-150 THB/sqm) |

---

## Restore Instructions

1. Clone the repository
2. `npm install`
3. `npm run build`
4. `npm test` (expect 94/94 pass)
5. Copy `.env.example` to `.env` and add API keys for integrations
6. `npm run start` to launch the platform
7. Open `docs/dashboard/ktv-master-dashboard.html` for the Supabase dashboard
8. Run `node dist/scripts/demo-full-report.js` for full system proof

All configuration is in version control. The only external dependencies are API keys stored in `.env` (never committed).
