-- ================================================================
-- KTV Working Drone Thailand — Master Dashboard Schema
-- Run this in your Supabase SQL Editor
-- ================================================================

-- ── 1. Agent Status ─────────────────────────────────────────────
-- Live heartbeat from all 14 agents (7 operational + 7 strategy)

CREATE TABLE IF NOT EXISTS agent_status (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_role    TEXT NOT NULL UNIQUE,   -- e.g. 'fleet-management'
  agent_name    TEXT NOT NULL,          -- e.g. 'Fleet Management Agent'
  team          TEXT NOT NULL,          -- CoWork team name
  layer         TEXT NOT NULL CHECK (layer IN ('operational','strategy','cowork')),
  status        TEXT NOT NULL DEFAULT 'offline',
  uptime_ms     BIGINT DEFAULT 0,
  tasks_completed INT DEFAULT 0,
  tasks_pending   INT DEFAULT 0,
  error_count     INT DEFAULT 0,
  last_activity   TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Enable realtime
ALTER TABLE agent_status REPLICA IDENTITY FULL;

-- ── 2. Workflow Events ───────────────────────────────────────────
-- Every workflow execution, trigger, and automation event

CREATE TABLE IF NOT EXISTS workflow_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type     TEXT NOT NULL,           -- KtvEventType e.g. 'job.created'
  workflow_id    TEXT,
  workflow_name  TEXT,
  trigger        TEXT NOT NULL,
  agents_involved TEXT[] DEFAULT '{}',
  outcome        TEXT NOT NULL DEFAULT 'pending' CHECK (outcome IN ('success','failure','pending')),
  duration_ms    INT,
  payload        JSONB,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workflow_events_type ON workflow_events(event_type);
CREATE INDEX idx_workflow_events_created ON workflow_events(created_at DESC);

-- ── 3. Brain Decisions ───────────────────────────────────────────
-- Log every OperationsBrain decision for audit + analysis

CREATE TABLE IF NOT EXISTS brain_decisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger         TEXT NOT NULL,
  reasoning       TEXT NOT NULL,
  actions         TEXT[] DEFAULT '{}',
  outcome         TEXT NOT NULL DEFAULT 'pending' CHECK (outcome IN ('success','failure','pending')),
  agents_involved TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_brain_decisions_created ON brain_decisions(created_at DESC);
CREATE INDEX idx_brain_decisions_outcome ON brain_decisions(outcome);

-- ── 4. KPI Snapshots ─────────────────────────────────────────────
-- Current KPI values per team (upserted, one row per team+kpi)

CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team            TEXT NOT NULL,
  kpi_name        TEXT NOT NULL,
  kpi_value       TEXT NOT NULL,          -- stored as text, cast on read
  kpi_unit        TEXT NOT NULL DEFAULT '',
  target          TEXT,
  status          TEXT NOT NULL DEFAULT 'on-track' CHECK (status IN ('on-track','at-risk','off-track')),
  snapshotted_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (team, kpi_name)
);

-- ── 5. Mission Log ───────────────────────────────────────────────
-- Append-only record of every drone mission

CREATE TABLE IF NOT EXISTS mission_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_ref     TEXT NOT NULL,
  client_name     TEXT NOT NULL,
  service_line    TEXT NOT NULL,
  sqm             INT,
  stage           TEXT NOT NULL,
  safety_cleared  BOOLEAN DEFAULT false,
  pilot           TEXT,
  drone_id        TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mission_log_stage ON mission_log(stage);
CREATE INDEX idx_mission_log_created ON mission_log(created_at DESC);

-- ── 6. Team Activity ─────────────────────────────────────────────
-- Rolling feed of agent actions across all 6 CoWork teams

CREATE TABLE IF NOT EXISTS team_activity (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team        TEXT NOT NULL,
  agent_role  TEXT NOT NULL,
  action      TEXT NOT NULL,
  detail      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_team_activity_team ON team_activity(team);
CREATE INDEX idx_team_activity_created ON team_activity(created_at DESC);

-- ── 7. Enable Realtime ───────────────────────────────────────────
-- In Supabase: Database → Replication → enable for these tables

-- ALTER TABLE agent_status    REPLICA IDENTITY FULL;
-- ALTER TABLE workflow_events REPLICA IDENTITY FULL;
-- ALTER TABLE brain_decisions REPLICA IDENTITY FULL;
-- ALTER TABLE kpi_snapshots   REPLICA IDENTITY FULL;
-- ALTER TABLE team_activity   REPLICA IDENTITY FULL;

-- ── 8. Seed initial agent registry ──────────────────────────────

INSERT INTO agent_status (agent_role, agent_name, team, layer, status) VALUES
  ('fleet-management',   'Fleet Management Agent',       'Service Delivery',    'operational', 'offline'),
  ('job-lifecycle',      'Job Lifecycle Agent',          'Service Delivery',    'operational', 'offline'),
  ('crm-sales',          'CRM & Sales Agent',            'Growth Engine',       'operational', 'offline'),
  ('safety-compliance',  'Safety Compliance Agent',      'Compliance & Safety', 'operational', 'offline'),
  ('finance-invoicing',  'Finance & Invoicing Agent',    'Revenue Operations',  'operational', 'offline'),
  ('pilot-operations',   'Pilot Operations Agent',       'Compliance & Safety', 'operational', 'offline'),
  ('data-processing',    'Data Processing Agent',        'Service Delivery',    'operational', 'offline'),
  ('market_intelligence_strategist',       'Market Intelligence Strategist',       'Market Intelligence', 'strategy', 'offline'),
  ('partner_strategy_architect',           'Partner Strategy Architect',           'Ecosystem Builder',   'strategy', 'offline'),
  ('smart_green_product_orchestrator',     'Smart Green Product Orchestrator',     'Ecosystem Builder',   'strategy', 'offline'),
  ('financial_model_capital_planner',      'Financial Model Capital Planner',      'Revenue Operations',  'strategy', 'offline'),
  ('deal_design_pitch_engineer',           'Deal Design Pitch Engineer',           'Revenue Operations',  'strategy', 'offline'),
  ('sales_playbook_account_selector',      'Sales Playbook Account Selector',      'Growth Engine',       'strategy', 'offline'),
  ('operations_compliance_mission_planner','Operations Compliance Mission Planner','Compliance & Safety', 'strategy', 'offline')
ON CONFLICT (agent_role) DO NOTHING;

-- ── 9. Seed initial KPIs ─────────────────────────────────────────

INSERT INTO kpi_snapshots (team, kpi_name, kpi_value, kpi_unit, target, status) VALUES
  ('Growth Engine',       'leads_per_week',       '0',   'leads',      '5',             'on-track'),
  ('Growth Engine',       'conversion_rate',      '0',   '%',          '30',            'on-track'),
  ('Growth Engine',       'pipeline_value_thb',   '0',   'THB',        '10000000',      'on-track'),
  ('Service Delivery',    'missions_per_week',    '0',   'missions',   '10',            'on-track'),
  ('Service Delivery',    'sqm_this_week',        '0',   'sqm',        '200000',        'on-track'),
  ('Service Delivery',    'safety_incidents',     '0',   'incidents',  '0',             'on-track'),
  ('Service Delivery',    'on_time_rate',         '100', '%',          '95',            'on-track'),
  ('Compliance & Safety', 'preflight_pass_rate',  '0',   '%',          '95',            'on-track'),
  ('Compliance & Safety', 'fleet_availability',   '0',   '%',          '85',            'on-track'),
  ('Market Intelligence', 'opportunities_scored', '0',   'opps',       '20',            'on-track'),
  ('Ecosystem Builder',   'ifs_milestone_thb',    '0',   'THB',        '32000000',      'on-track'),
  ('Ecosystem Builder',   'smart_green_sites',    '0',   'sites',      '3',             'on-track'),
  ('Revenue Operations',  'gross_revenue_thb',    '0',   'THB',        '180180000',     'on-track'),
  ('Revenue Operations',  'ebitda_margin_pct',    '0',   '%',          '55',            'on-track'),
  ('Revenue Operations',  'collection_rate',      '0',   '%',          '95',            'on-track'),
  ('Revenue Operations',  'dso_days',             '0',   'days',       '30',            'on-track')
ON CONFLICT (team, kpi_name) DO NOTHING;
