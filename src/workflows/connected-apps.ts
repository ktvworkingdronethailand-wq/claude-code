/**
 * KTV Working Drone Thailand - Connected Apps Integration
 * Bridges Gmail + Google Calendar into the agent workflow system
 *
 * Connected Apps:
 *   Gmail:    matthew@ktvworkingdronethailand.com
 *   Calendar: primary (Asia/Bangkok)
 *
 * This module defines:
 *   1. Team contacts registry
 *   2. Email template generators for each workflow event
 *   3. Calendar event generators for missions, meetings, and reminders
 *   4. Connected-app workflow definitions that extend existing workflows
 */

import { KtvEventType } from './event-bus.js';
import { WorkflowDefinition } from './engine.js';

// ── Team Contacts ───────────────────────────────────────────

export interface TeamContact {
  name: string;
  email: string;
  role: string;
  teams: string[];
}

export const KTV_TEAM: Record<string, TeamContact> = {
  matthew: {
    name: 'Matthew Peter James',
    email: 'matthew@ktvworkingdronethailand.com',
    role: 'Managing Director',
    teams: ['revenue', 'growth', 'ecosystem'],
  },
  thanvarat: {
    name: 'Thanvarat K. Agnew',
    email: 'thanvaratka@ktvworkingdronethailand.com',
    role: 'Director',
    teams: ['compliance', 'delivery', 'ecosystem'],
  },
  krit: {
    name: 'Krit Jitbanjong',
    email: 'krit.j@ktvworkingdronethailand.com',
    role: 'Technical & Safety Manager',
    teams: ['delivery', 'compliance'],
  },
};

export const TIMEZONE = 'Asia/Bangkok';
export const PRIMARY_CALENDAR = 'primary';

// ── Email Templates ─────────────────────────────────────────

export interface EmailTemplate {
  id: string;
  name: string;
  trigger: KtvEventType;
  to: (ctx: Record<string, unknown>) => string;
  cc?: (ctx: Record<string, unknown>) => string;
  subject: (ctx: Record<string, unknown>) => string;
  body: (ctx: Record<string, unknown>) => string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  // ── Lead Welcome ──────────────────────────────────────────
  {
    id: 'email-lead-welcome',
    name: 'New Lead Welcome Email',
    trigger: 'lead.created',
    to: (ctx) => ctx.contactEmail as string ?? '',
    cc: () => KTV_TEAM.matthew.email,
    subject: (ctx) => `KTV Working Drone Thailand — Thank you, ${ctx.companyName ?? 'valued partner'}`,
    body: (ctx) => `Dear ${ctx.contactName ?? 'Sir/Madam'},

Thank you for your interest in KTV Working Drone Thailand — the world's only certified provider of autonomous drone cleaning and maintenance.

We received your enquiry regarding ${ctx.serviceLine ?? 'our drone-enabled facility management services'} and would like to schedule a brief introductory call to understand your requirements.

Key advantages of our service:
- 80% faster than traditional methods
- 96% lower GHG emissions
- 100% elimination of work-at-height risk
- Smart Green Operations platform for ESG reporting

Our team will be in touch within 24 hours to arrange a convenient time.

Best regards,
Matthew Peter James
Managing Director
KTV Working Drone Thailand Co., Ltd.
Rasa Two, 1818 Petchaburi Rd, Bangkok 10400
https://ktvworkingdrone.com`,
  },

  // ── Mission Briefing ──────────────────────────────────────
  {
    id: 'email-mission-briefing',
    name: 'Mission Briefing to Crew',
    trigger: 'mission.preflight.passed',
    to: () => KTV_TEAM.krit.email,
    cc: () => [KTV_TEAM.thanvarat.email, KTV_TEAM.matthew.email].join(', '),
    subject: (ctx) => `[MISSION BRIEF] ${ctx.jobTitle ?? 'Drone Mission'} — ${ctx.siteName ?? 'Site TBC'}`,
    body: (ctx) => `MISSION BRIEFING
================

Job ID:     ${ctx.jobId ?? 'TBC'}
Site:       ${ctx.siteName ?? 'TBC'}
Service:    ${ctx.serviceLine ?? 'facade-cleaning'}
Date:       ${ctx.missionDate ?? 'TBC'}

CREW ASSIGNMENT
- Pilot(s): ${ctx.pilots ?? 'TBC'}
- Ground Crew: ${ctx.groundCrew ?? 'TBC'}
- Supervisor: ${ctx.supervisor ?? 'TBC'}

DRONE ASSIGNMENT
- Drone: ${ctx.droneId ?? 'TBC'} (${ctx.droneModel ?? 'TBC'})
- Batteries: ${ctx.batteryCount ?? 'TBC'} prepared

PRE-FLIGHT STATUS
- Risk Assessment: ${ctx.riskLevel ?? 'ASSESSED'}
- Weather Check: ${ctx.weatherStatus ?? 'GO'}
- NOTAM: ${ctx.notamFiled ?? 'PENDING'}
- Airspace: ${ctx.airspaceClearance ?? 'CLEARED'}

SAFETY REMINDERS
- Wind limit: <8 m/s
- Visibility: >5 km
- Max altitude: 90 m (CAAT)
- Emergency contacts on-site

All crew must confirm receipt.

KTV Operations Brain — Automated Briefing`,
  },

  // ── Invoice Email ─────────────────────────────────────────
  {
    id: 'email-invoice-send',
    name: 'Invoice to Client',
    trigger: 'finance.invoice.sent',
    to: (ctx) => ctx.clientEmail as string ?? '',
    cc: () => KTV_TEAM.matthew.email,
    subject: (ctx) => `KTV Invoice ${ctx.invoiceNumber ?? ''} — ${ctx.clientName ?? 'Client'}`,
    body: (ctx) => `Dear ${ctx.clientName ?? 'Valued Client'},

Please find attached Invoice ${ctx.invoiceNumber ?? ''} for drone services rendered.

Invoice Summary:
- Service: ${ctx.serviceLine ?? 'Drone FM Services'}
- Area: ${ctx.sqm ?? 'N/A'} sqm
- Amount: THB ${ctx.totalAmount ?? '0'}
- Due Date: ${ctx.dueDate ?? '30 days from date of invoice'}

Payment Details:
- Bank: [As per contract]
- Terms: Net 30

For queries, please contact our finance team.

Best regards,
KTV Working Drone Thailand Co., Ltd.`,
  },

  // ── Safety Incident Alert ─────────────────────────────────
  {
    id: 'email-safety-incident',
    name: 'Safety Incident Alert',
    trigger: 'safety.incident.reported',
    to: () => [KTV_TEAM.thanvarat.email, KTV_TEAM.krit.email, KTV_TEAM.matthew.email].join(', '),
    subject: (ctx) => `[URGENT] Safety Incident — ${ctx.severity ?? 'REPORTED'} — ${ctx.siteName ?? 'Site'}`,
    body: (ctx) => `SAFETY INCIDENT REPORT
======================
SEVERITY: ${ctx.severity ?? 'UNKNOWN'}
TYPE: ${ctx.type ?? 'General'}
SITE: ${ctx.siteName ?? 'TBC'}
TIME: ${ctx.incidentTime ?? new Date().toISOString()}

DESCRIPTION:
${ctx.description ?? 'Details pending.'}

IMMEDIATE ACTIONS TAKEN:
1. All operations at site HALTED
2. Affected drone(s) GROUNDED
3. Crew accounted for and safe
4. Emergency services contacted: ${ctx.emergencyContacted ?? 'Yes/No'}

NEXT STEPS:
- Full investigation within 24 hours
- CAAT notification: ${ctx.caatNotified ?? 'PENDING'}
- Insurance claim: ${ctx.insuranceFiled ?? 'PENDING'}
- Root cause analysis to follow

THIS IS AN AUTOMATED ALERT — IMMEDIATE RESPONSE REQUIRED
KTV Operations Brain — Safety Protocol`,
  },

  // ── Daily Ops Summary ─────────────────────────────────────
  {
    id: 'email-daily-ops-summary',
    name: 'Daily Operations Summary',
    trigger: 'system.health.recovered',
    to: () => [KTV_TEAM.matthew.email, KTV_TEAM.thanvarat.email].join(', '),
    cc: () => KTV_TEAM.krit.email,
    subject: () => `[KTV Daily Ops] ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: TIMEZONE })}`,
    body: (ctx) => `KTV DAILY OPERATIONS BRIEFING
==============================
Date: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TIMEZONE })}

SAFETY & COMPLIANCE
- Incidents today: ${ctx.incidentCount ?? 0}
- Pre-flight pass rate: ${ctx.preflightPassRate ?? '100%'}
- CAAT compliance: ${ctx.caatStatus ?? 'COMPLIANT'}

FLEET STATUS
- Drones available: ${ctx.dronesAvailable ?? '16'}/16
- In maintenance: ${ctx.dronesInMaintenance ?? '0'}
- Missions today: ${ctx.missionsToday ?? '0'}

OPERATIONS
- Sqm cleaned today: ${ctx.sqmToday ?? '0'}
- Jobs in pipeline: ${ctx.jobsInPipeline ?? '0'}
- Data processing queue: ${ctx.dataQueue ?? '0'} jobs

REVENUE
- MTD revenue: THB ${ctx.mtdRevenue ?? '0'}
- Outstanding invoices: ${ctx.outstandingInvoices ?? '0'}
- Overdue: ${ctx.overdueInvoices ?? '0'}

PIPELINE
- Active leads: ${ctx.activeLeads ?? '0'}
- Qualified: ${ctx.qualifiedLeads ?? '0'}
- Proposals sent: ${ctx.proposalsSent ?? '0'}

—
KTV Operations Brain — Automated Summary
Smart Green Operations | https://www.smartgreenoperations.com`,
  },

  // ── Overdue Invoice Follow-up ─────────────────────────────
  {
    id: 'email-overdue-followup',
    name: 'Overdue Invoice Follow-up',
    trigger: 'finance.invoice.overdue',
    to: (ctx) => ctx.clientEmail as string ?? KTV_TEAM.matthew.email,
    cc: () => KTV_TEAM.matthew.email,
    subject: (ctx) => `Payment Reminder — Invoice ${ctx.invoiceNumber ?? ''} Overdue`,
    body: (ctx) => `Dear ${ctx.clientName ?? 'Valued Client'},

This is a friendly reminder that Invoice ${ctx.invoiceNumber ?? ''} dated ${ctx.invoiceDate ?? 'N/A'} is now overdue.

Outstanding Amount: THB ${ctx.outstandingAmount ?? '0'}
Days Overdue: ${ctx.daysOverdue ?? 'N/A'}

We kindly request settlement at your earliest convenience. If payment has already been made, please disregard this reminder.

For queries or to arrange payment, please contact us.

Best regards,
KTV Working Drone Thailand Co., Ltd.`,
  },

  // ── CAAT Certification Expiry Warning ─────────────────────
  {
    id: 'email-cert-expiry-warning',
    name: 'Certification Expiry Warning',
    trigger: 'pilot.certification.expiring',
    to: () => KTV_TEAM.krit.email,
    cc: () => [KTV_TEAM.thanvarat.email, KTV_TEAM.matthew.email].join(', '),
    subject: (ctx) => `[ACTION REQUIRED] Pilot Certification Expiring — ${ctx.pilotName ?? 'Pilot'}`,
    body: (ctx) => `CERTIFICATION EXPIRY ALERT
===========================

Pilot: ${ctx.pilotName ?? 'TBC'}
Certification: ${ctx.certType ?? 'RPL'}
Expiry Date: ${ctx.expiryDate ?? 'TBC'}
Days Until Expiry: ${ctx.daysUntilExpiry ?? 'TBC'}

REQUIRED ACTION:
1. Schedule renewal with CAAT
2. Arrange refresher training if required
3. Plan pilot coverage during renewal period
4. Update pilot operations calendar

Pilot will be automatically GROUNDED on expiry date.

KTV Operations Brain — Compliance Alert`,
  },
];

// ── Calendar Event Templates ────────────────────────────────

export interface CalendarEventTemplate {
  id: string;
  name: string;
  trigger: KtvEventType;
  summary: (ctx: Record<string, unknown>) => string;
  description: (ctx: Record<string, unknown>) => string;
  location?: (ctx: Record<string, unknown>) => string;
  durationMinutes: number;
  colorId?: string; // 1-11 Google Calendar colors
  attendees: (ctx: Record<string, unknown>) => string[];
}

export const CALENDAR_TEMPLATES: CalendarEventTemplate[] = [
  // ── Mission Calendar Event ────────────────────────────────
  {
    id: 'cal-mission-scheduled',
    name: 'Drone Mission',
    trigger: 'mission.preflight.passed',
    summary: (ctx) => `[MISSION] ${ctx.siteName ?? 'Site'} — ${ctx.serviceLine ?? 'Drone Ops'}`,
    description: (ctx) => `KTV Drone Mission
Job: ${ctx.jobId ?? 'TBC'}
Service: ${ctx.serviceLine ?? 'facade-cleaning'}
Area: ${ctx.sqm ?? 'TBC'} sqm
Drone: ${ctx.droneId ?? 'TBC'}
Risk Level: ${ctx.riskLevel ?? 'Assessed'}

Pre-flight: PASSED
NOTAM: Filed

Safety: Zero work-at-height target
Emergency: Call Krit +66-xxx-xxx-xxxx`,
    location: (ctx) => ctx.siteAddress as string ?? 'Bangkok, Thailand',
    durationMinutes: 480, // full day mission
    colorId: '7', // Peacock (blue-green) for missions
    attendees: () => [KTV_TEAM.krit.email],
  },

  // ── Client Meeting ────────────────────────────────────────
  {
    id: 'cal-client-meeting',
    name: 'Client Meeting',
    trigger: 'lead.qualified',
    summary: (ctx) => `[CLIENT] ${ctx.companyName ?? 'Prospect'} — Introduction Meeting`,
    description: (ctx) => `KTV Client Introduction
Company: ${ctx.companyName ?? 'TBC'}
Contact: ${ctx.contactName ?? 'TBC'}
Sector: ${ctx.sector ?? 'TBC'}
Estimated Sqm: ${ctx.estimatedSqm ?? 'TBC'}
Channel: ${ctx.channel ?? 'IFS/Direct'}

Agenda:
1. Company introduction & certifications
2. Service line discussion
3. Smart Green Operations demo
4. Site assessment scheduling
5. Next steps`,
    durationMinutes: 60,
    colorId: '5', // Banana (yellow) for sales
    attendees: (ctx) => [
      KTV_TEAM.matthew.email,
      ...(ctx.contactEmail ? [ctx.contactEmail as string] : []),
    ],
  },

  // ── Site Assessment ───────────────────────────────────────
  {
    id: 'cal-site-assessment',
    name: 'Site Assessment Visit',
    trigger: 'job.created',
    summary: (ctx) => `[SITE VISIT] ${ctx.siteName ?? 'Site'} — Drone Assessment`,
    description: (ctx) => `KTV Site Assessment
Client: ${ctx.clientName ?? 'TBC'}
Site: ${ctx.siteName ?? 'TBC'}
Service: ${ctx.serviceLine ?? 'TBC'}

Assessment Checklist:
- Building height & facade area measurement
- Airspace assessment (CAAT compliance)
- Landing/takeoff zones
- Weather exposure assessment
- BMS/CMMS integration points
- Safety perimeter planning
- Photography for proposal`,
    location: (ctx) => ctx.siteAddress as string ?? 'Bangkok, Thailand',
    durationMinutes: 180, // 3 hours for site visit
    colorId: '10', // Basil (green) for field work
    attendees: () => [KTV_TEAM.krit.email, KTV_TEAM.matthew.email],
  },

  // ── Daily Standup ─────────────────────────────────────────
  {
    id: 'cal-daily-standup',
    name: 'KTV Daily Standup',
    trigger: 'system.health.recovered',
    summary: () => 'KTV Daily Standup — Operations Review',
    description: () => `KTV Daily Operations Standup

Agenda:
1. Safety & compliance status (Krit)
2. Fleet & mission status (Krit)
3. Revenue & pipeline update (Matthew)
4. Blockers & priorities
5. Action items

This is an automated recurring event.
KTV Operations Brain`,
    durationMinutes: 30,
    colorId: '9', // Blueberry (blue) for internal
    attendees: () => [
      KTV_TEAM.matthew.email,
      KTV_TEAM.thanvarat.email,
      KTV_TEAM.krit.email,
    ],
  },

  // ── Maintenance Window ────────────────────────────────────
  {
    id: 'cal-maintenance-window',
    name: 'Drone Maintenance Window',
    trigger: 'fleet.maintenance.due',
    summary: (ctx) => `[MAINTENANCE] Drone ${ctx.droneId ?? 'Fleet'} — Scheduled Service`,
    description: (ctx) => `Drone Maintenance
Drone: ${ctx.droneId ?? 'TBC'}
Type: ${ctx.maintenanceType ?? 'Scheduled'}
Alerts: ${ctx.alertCount ?? 0}

Checklist:
- Airframe inspection
- Motor & propeller check
- Battery health test
- Sensor calibration
- Firmware update
- Flight test post-maintenance

Drone will be GROUNDED until maintenance is complete.`,
    durationMinutes: 240, // 4 hours
    colorId: '8', // Graphite for maintenance
    attendees: () => [KTV_TEAM.krit.email],
  },

  // ── Cert Renewal Deadline ─────────────────────────────────
  {
    id: 'cal-cert-renewal',
    name: 'Certification Renewal Deadline',
    trigger: 'pilot.certification.expiring',
    summary: (ctx) => `[DEADLINE] ${ctx.pilotName ?? 'Pilot'} — ${ctx.certType ?? 'RPL'} Renewal`,
    description: (ctx) => `Certification Renewal Required
Pilot: ${ctx.pilotName ?? 'TBC'}
Cert: ${ctx.certType ?? 'RPL'}
Expiry: ${ctx.expiryDate ?? 'TBC'}

ACTION: Schedule CAAT renewal before this date.
Pilot will be automatically grounded on expiry.`,
    durationMinutes: 60,
    colorId: '11', // Tomato (red) for deadlines
    attendees: () => [KTV_TEAM.krit.email, KTV_TEAM.thanvarat.email],
  },
];

// ── Connected App Workflow Definitions ──────────────────────
// These extend existing workflows with Gmail + Calendar actions

export const CONNECTED_APP_WORKFLOWS: WorkflowDefinition[] = [
  // ── New Lead → Welcome Email + Meeting ────────────────────
  {
    id: 'wf-connected-lead-onboard',
    name: 'Connected: Lead Welcome & Meeting Setup',
    description: 'Drafts welcome email and creates client meeting when a new lead arrives',
    trigger: 'lead.created',
    steps: [
      {
        id: 'draft-welcome-email',
        name: 'Draft welcome email to prospect',
        agent: 'crm-sales',
        action: 'advance-lead',
        inputMap: (ctx) => ({
          leadId: ctx.variables.leadId,
          stage: 'contacted',
          emailTemplate: 'email-lead-welcome',
          emailTo: ctx.variables.contactEmail,
          emailSubject: `KTV Working Drone Thailand — Thank you, ${ctx.variables.companyName ?? 'valued partner'}`,
        }),
        outputKey: 'leadAdvanced',
      },
      {
        id: 'schedule-intro-meeting',
        name: 'Create calendar event for client introduction',
        agent: 'crm-sales',
        action: 'advance-lead',
        inputMap: (ctx) => ({
          leadId: ctx.variables.leadId,
          calendarEvent: 'cal-client-meeting',
          meetingTitle: `[CLIENT] ${ctx.variables.companyName ?? 'Prospect'} — Introduction`,
          attendees: [KTV_TEAM.matthew.email, ctx.variables.contactEmail],
        }),
        outputKey: 'meetingCreated',
      },
    ],
  },

  // ── Mission Ready → Briefing Email + Calendar ─────────────
  {
    id: 'wf-connected-mission-brief',
    name: 'Connected: Mission Briefing & Calendar',
    description: 'Sends crew briefing email and creates mission calendar event when pre-flight passes',
    trigger: 'mission.preflight.passed',
    steps: [
      {
        id: 'send-mission-briefing',
        name: 'Email mission briefing to crew',
        agent: 'safety-compliance',
        action: 'get-safety-stats',
        inputMap: (ctx) => ({
          emailTemplate: 'email-mission-briefing',
          jobId: ctx.variables.jobId,
          siteName: ctx.variables.siteName,
        }),
        outputKey: 'briefingSent',
      },
      {
        id: 'create-mission-calendar',
        name: 'Create mission event on team calendar',
        agent: 'fleet-management',
        action: 'get-fleet-summary',
        inputMap: (ctx) => ({
          calendarEvent: 'cal-mission-scheduled',
          jobId: ctx.variables.jobId,
          siteName: ctx.variables.siteName,
          serviceLine: ctx.variables.serviceLine,
        }),
        outputKey: 'calendarCreated',
      },
    ],
  },

  // ── Invoice Sent → Client Email ───────────────────────────
  {
    id: 'wf-connected-invoice-email',
    name: 'Connected: Invoice Email to Client',
    description: 'Drafts and queues invoice email when an invoice is sent',
    trigger: 'finance.invoice.sent',
    steps: [
      {
        id: 'draft-invoice-email',
        name: 'Draft invoice email to client',
        agent: 'finance-invoicing',
        action: 'get-financial-summary',
        inputMap: (ctx) => ({
          emailTemplate: 'email-invoice-send',
          invoiceId: ctx.variables.invoiceId,
          clientEmail: ctx.variables.clientEmail,
        }),
        outputKey: 'invoiceEmailDrafted',
      },
    ],
  },

  // ── Safety Incident → Emergency Alerts ────────────────────
  {
    id: 'wf-connected-safety-alert',
    name: 'Connected: Safety Incident Emergency Alerts',
    description: 'Emails all leadership and creates emergency calendar block when incident occurs',
    trigger: 'safety.incident.reported',
    steps: [
      {
        id: 'email-safety-alert',
        name: 'Send emergency email to all leadership',
        agent: 'safety-compliance',
        action: 'get-safety-stats',
        inputMap: (ctx) => ({
          emailTemplate: 'email-safety-incident',
          severity: ctx.variables.severity,
          description: ctx.variables.description,
          siteName: ctx.variables.siteName,
        }),
        outputKey: 'alertSent',
      },
    ],
  },

  // ── Cert Expiring → Email + Calendar Deadline ─────────────
  {
    id: 'wf-connected-cert-expiry',
    name: 'Connected: Certification Expiry Alerts',
    description: 'Emails technical manager and creates calendar deadline for cert renewal',
    trigger: 'pilot.certification.expiring',
    steps: [
      {
        id: 'email-cert-warning',
        name: 'Email certification expiry warning',
        agent: 'pilot-operations',
        action: 'check-certifications',
        inputMap: (ctx) => ({
          emailTemplate: 'email-cert-expiry-warning',
          pilotName: ctx.variables.pilotName,
          certType: ctx.variables.certType,
          expiryDate: ctx.variables.expiryDate,
        }),
        outputKey: 'certWarningEmailed',
      },
      {
        id: 'create-cert-deadline',
        name: 'Create calendar deadline for renewal',
        agent: 'pilot-operations',
        action: 'check-certifications',
        inputMap: (ctx) => ({
          calendarEvent: 'cal-cert-renewal',
          pilotName: ctx.variables.pilotName,
          certType: ctx.variables.certType,
          expiryDate: ctx.variables.expiryDate,
        }),
        outputKey: 'certDeadlineCreated',
      },
    ],
  },
];

// ── Automation Registry ─────────────────────────────────────
// Maps workflow events to connected app actions

export interface ConnectedAutomation {
  id: string;
  name: string;
  trigger: KtvEventType;
  emailTemplateId?: string;
  calendarTemplateId?: string;
  description: string;
  team: string;
}

export const CONNECTED_AUTOMATIONS: ConnectedAutomation[] = [
  {
    id: 'auto-lead-welcome',
    name: 'Welcome New Leads',
    trigger: 'lead.created',
    emailTemplateId: 'email-lead-welcome',
    calendarTemplateId: 'cal-client-meeting',
    description: 'Draft welcome email + schedule intro meeting when new lead arrives',
    team: 'growth',
  },
  {
    id: 'auto-mission-briefing',
    name: 'Mission Crew Briefing',
    trigger: 'mission.preflight.passed',
    emailTemplateId: 'email-mission-briefing',
    calendarTemplateId: 'cal-mission-scheduled',
    description: 'Email crew briefing + create mission calendar event',
    team: 'delivery',
  },
  {
    id: 'auto-site-assessment',
    name: 'Site Assessment Scheduling',
    trigger: 'job.created',
    calendarTemplateId: 'cal-site-assessment',
    description: 'Create site visit calendar event when new job is created',
    team: 'delivery',
  },
  {
    id: 'auto-invoice-email',
    name: 'Invoice Delivery',
    trigger: 'finance.invoice.sent',
    emailTemplateId: 'email-invoice-send',
    description: 'Draft invoice email to client when invoice is sent',
    team: 'revenue',
  },
  {
    id: 'auto-overdue-followup',
    name: 'Overdue Invoice Follow-up',
    trigger: 'finance.invoice.overdue',
    emailTemplateId: 'email-overdue-followup',
    description: 'Send payment reminder when invoice becomes overdue',
    team: 'revenue',
  },
  {
    id: 'auto-safety-incident',
    name: 'Safety Incident Alert',
    trigger: 'safety.incident.reported',
    emailTemplateId: 'email-safety-incident',
    description: 'Emergency email to all leadership on safety incident',
    team: 'compliance',
  },
  {
    id: 'auto-cert-expiry',
    name: 'Certification Expiry Alert',
    trigger: 'pilot.certification.expiring',
    emailTemplateId: 'email-cert-expiry-warning',
    calendarTemplateId: 'cal-cert-renewal',
    description: 'Email warning + calendar deadline for cert renewal',
    team: 'compliance',
  },
  {
    id: 'auto-maintenance-window',
    name: 'Maintenance Calendar Block',
    trigger: 'fleet.maintenance.due',
    calendarTemplateId: 'cal-maintenance-window',
    description: 'Block calendar for drone maintenance window',
    team: 'delivery',
  },
  {
    id: 'auto-daily-ops-email',
    name: 'Daily Ops Email Summary',
    trigger: 'system.health.recovered',
    emailTemplateId: 'email-daily-ops-summary',
    calendarTemplateId: 'cal-daily-standup',
    description: 'Morning email summary + recurring standup event',
    team: 'all',
  },
];

// ── Display Functions ───────────────────────────────────────

export function printConnectedAppsStatus(): string {
  const lines: string[] = [];
  lines.push('');
  lines.push('╔════════════════════════════════════════════════════════════════════╗');
  lines.push('║          KTV CONNECTED APPS — Automations Registry               ║');
  lines.push('╠════════════════════════════════════════════════════════════════════╣');
  lines.push('║                                                                    ║');
  lines.push('║  CONNECTED APPS                                                   ║');
  lines.push(`║    Gmail:    matthew@ktvworkingdronethailand.com                   ║`);
  lines.push(`║    Calendar: primary (${TIMEZONE})                                 ║`);
  lines.push('║                                                                    ║');
  lines.push('║  TEAM CONTACTS                                                    ║');

  for (const [, contact] of Object.entries(KTV_TEAM)) {
    lines.push(`║    ${contact.name.padEnd(28)} ${contact.role.padEnd(28)}║`);
    lines.push(`║      ${contact.email.padEnd(54)}║`);
  }

  lines.push('║                                                                    ║');
  lines.push('╠════════════════════════════════════════════════════════════════════╣');
  lines.push('║  AUTOMATIONS (9 active)                                            ║');
  lines.push('║                                                                    ║');

  for (const auto of CONNECTED_AUTOMATIONS) {
    const apps: string[] = [];
    if (auto.emailTemplateId) apps.push('Gmail');
    if (auto.calendarTemplateId) apps.push('Calendar');
    const appStr = apps.join(' + ');

    lines.push(`║  ${auto.name}`);
    lines.push(`║    Trigger: ${auto.trigger}`);
    lines.push(`║    Apps: ${appStr} | Team: ${auto.team}`);
    lines.push(`║    ${auto.description}`);
    lines.push('║');
  }

  lines.push('╠════════════════════════════════════════════════════════════════════╣');
  lines.push(`║  Email Templates: ${EMAIL_TEMPLATES.length.toString().padEnd(4)} | Calendar Templates: ${CALENDAR_TEMPLATES.length.toString().padEnd(4)}              ║`);
  lines.push(`║  Connected Workflows: ${CONNECTED_APP_WORKFLOWS.length.toString().padEnd(4)}                                          ║`);
  lines.push('╚════════════════════════════════════════════════════════════════════╝');

  return lines.join('\n');
}

export function getAutomationsByTeam(team: string): ConnectedAutomation[] {
  if (team === 'all') return CONNECTED_AUTOMATIONS;
  return CONNECTED_AUTOMATIONS.filter(a => a.team === team || a.team === 'all');
}

export function getEmailTemplate(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find(t => t.id === id);
}

export function getCalendarTemplate(id: string): CalendarEventTemplate | undefined {
  return CALENDAR_TEMPLATES.find(t => t.id === id);
}
