/**
 * KTV Working Drone Thailand - Safety & Compliance Agent
 * Risk assessment, weather checks, pre-flight checklists, incident reporting
 * Enforces CAAT Thailand regulations and ISO safety standards
 */

import { KtvAgent } from './base-agent.js';
import {
  AgentMessage,
  GeoLocation,
  IncidentReport,
  IncidentSeverity,
  PreFlightChecklist,
  RiskAssessment,
  RiskLevel,
  WeatherCheck,
  WeatherStatus,
} from '../types/index.js';

/** CAAT Thailand regulatory limits */
const CAAT_LIMITS = {
  maxAltitudeMeters: 90,
  airportBufferKm: 9,
  minInsuranceThb: 1_000_000,
  maxWindSpeedMs: 10,
  minVisibilityKm: 3,
  lightningBufferKm: 30,
} as const;

export class SafetyComplianceAgent extends KtvAgent {
  private riskAssessments: Map<string, RiskAssessment> = new Map();
  private checklists: Map<string, PreFlightChecklist> = new Map();
  private incidents: IncidentReport[] = [];

  constructor() {
    super({
      role: 'safety-compliance',
      name: 'KTV Safety & Compliance',
      description: 'Safety management, CAAT compliance, risk assessment for KTV Working Drone Thailand',
      dependencies: [],
      pollIntervalMs: 10_000,
    });
  }

  protected async onStart(): Promise<void> {
    this.log('Safety & Compliance system initialized');
    this.log(`CAAT limits loaded: max altitude ${CAAT_LIMITS.maxAltitudeMeters}m, airport buffer ${CAAT_LIMITS.airportBufferKm}km`);
  }

  protected async onStop(): Promise<void> {
    this.log('Safety & Compliance system shutting down');
  }

  protected async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const { action } = message.payload as { action: string };

    switch (action) {
      case 'assess-risk':
        return this.createResponse(message, {
          assessment: this.assessRisk(
            message.payload.jobId as string,
            message.payload.likelihood as 1 | 2 | 3 | 4 | 5,
            message.payload.severity as 1 | 2 | 3 | 4 | 5,
            message.payload.hazards as string[],
            message.payload.mitigations as string[],
          ),
        });

      case 'check-weather':
        return this.createResponse(message, {
          weather: this.checkWeather(message.payload as unknown as Partial<WeatherCheck>),
        });

      case 'submit-preflight':
        return this.createResponse(message, {
          checklist: this.submitPreFlightChecklist(message.payload as unknown as Partial<PreFlightChecklist>),
        });

      case 'report-incident':
        return this.createResponse(message, {
          report: this.reportIncident(message.payload as Partial<IncidentReport>),
        });

      case 'get-safety-stats':
        return this.createResponse(message, {
          stats: this.getSafetyStats(),
        });

      case 'get-caat-limits':
        return this.createResponse(message, { limits: CAAT_LIMITS });

      default:
        return this.createResponse(message, { error: `Unknown action: ${action}` });
    }
  }

  // ── Risk Assessment (5x5 Matrix) ─────────────────────────

  assessRisk(
    jobId: string,
    likelihood: 1 | 2 | 3 | 4 | 5,
    severity: 1 | 2 | 3 | 4 | 5,
    hazards: string[],
    mitigations: string[],
  ): RiskAssessment {
    const riskScore = likelihood * severity;
    const riskLevel = this.classifyRisk(riskScore);
    const id = `RA-${Date.now()}`;

    const assessment: RiskAssessment = {
      id,
      jobId,
      likelihood,
      severity,
      riskScore,
      riskLevel,
      hazards,
      mitigations,
      date: new Date(),
    };

    this.riskAssessments.set(id, assessment);
    this.log(`Risk assessment ${id} for job ${jobId}: score ${riskScore} (${riskLevel})`);

    if (riskLevel === 'unacceptable') {
      this.createEvent('job-lifecycle', {
        event: 'job-blocked',
        jobId,
        reason: `Unacceptable risk score: ${riskScore}`,
      });
    }

    return assessment;
  }

  private classifyRisk(score: number): RiskLevel {
    if (score <= 4) return 'acceptable';
    if (score <= 9) return 'moderate';
    if (score <= 15) return 'high';
    return 'unacceptable';
  }

  // ── Weather Decision ─────────────────────────────────────

  checkWeather(data: Partial<WeatherCheck>): WeatherCheck {
    const check: WeatherCheck = {
      location: data.location ?? { latitude: 0, longitude: 0 },
      timestamp: new Date(),
      windSpeedMs: data.windSpeedMs ?? 0,
      visibilityKm: data.visibilityKm ?? 10,
      precipitation: data.precipitation ?? false,
      temperatureC: data.temperatureC ?? 30,
      lightningWithin30km: data.lightningWithin30km ?? false,
      status: 'go',
    };

    // Apply go/no-go criteria
    const reasons: string[] = [];

    if (check.windSpeedMs > CAAT_LIMITS.maxWindSpeedMs) {
      reasons.push(`Wind ${check.windSpeedMs} m/s exceeds limit ${CAAT_LIMITS.maxWindSpeedMs} m/s`);
    }
    if (check.visibilityKm < CAAT_LIMITS.minVisibilityKm) {
      reasons.push(`Visibility ${check.visibilityKm} km below minimum ${CAAT_LIMITS.minVisibilityKm} km`);
    }
    if (check.precipitation) {
      reasons.push('Precipitation detected');
    }
    if (check.lightningWithin30km) {
      reasons.push(`Lightning within ${CAAT_LIMITS.lightningBufferKm} km`);
    }

    if (reasons.length > 0) {
      check.status = 'no-go';
      check.reason = reasons.join('; ');
    } else if (check.windSpeedMs > CAAT_LIMITS.maxWindSpeedMs * 0.8) {
      check.status = 'marginal';
      check.reason = `Wind approaching limit: ${check.windSpeedMs} m/s`;
    }

    this.log(`Weather check: ${check.status}${check.reason ? ` - ${check.reason}` : ''}`);
    return check;
  }

  // ── Pre-Flight Checklist ─────────────────────────────────

  submitPreFlightChecklist(data: Partial<PreFlightChecklist>): PreFlightChecklist {
    const id = `PFC-${Date.now()}`;
    const checklist: PreFlightChecklist = {
      id,
      jobId: data.jobId ?? '',
      droneId: data.droneId ?? '',
      pilotId: data.pilotId ?? '',
      airframeIntegrity: data.airframeIntegrity ?? false,
      batteryState: data.batteryState ?? false,
      payloadMounted: data.payloadMounted ?? false,
      airspaceClearance: data.airspaceClearance ?? false,
      weatherChecked: data.weatherChecked ?? false,
      communicationSystems: data.communicationSystems ?? false,
      allPassed: false,
      completedAt: new Date(),
    };

    checklist.allPassed =
      checklist.airframeIntegrity &&
      checklist.batteryState &&
      checklist.payloadMounted &&
      checklist.airspaceClearance &&
      checklist.weatherChecked &&
      checklist.communicationSystems;

    this.checklists.set(id, checklist);
    this.log(`Pre-flight checklist ${id}: ${checklist.allPassed ? 'PASSED' : 'FAILED'}`);

    if (!checklist.allPassed) {
      this.createEvent('job-lifecycle', {
        event: 'preflight-failed',
        jobId: checklist.jobId,
        checklistId: id,
      });
    }

    return checklist;
  }

  // ── Incident Reporting ───────────────────────────────────

  reportIncident(data: Partial<IncidentReport>): IncidentReport {
    const id = `INC-${Date.now()}`;
    const report: IncidentReport = {
      id,
      jobId: data.jobId,
      droneId: data.droneId,
      pilotId: data.pilotId,
      severity: data.severity ?? 'minor',
      type: data.type ?? 'near-miss',
      description: data.description ?? '',
      immediateActions: data.immediateActions ?? [],
      caatNotified: this.requiresCaatNotification(data.severity ?? 'minor'),
      reportedAt: new Date(),
    };

    this.incidents.push(report);
    this.log(`Incident ${id} reported: ${report.type} (${report.severity})`);

    if (report.caatNotified) {
      this.log(`CAAT notification required for ${report.severity} incident`);
    }

    return report;
  }

  private requiresCaatNotification(severity: IncidentSeverity): boolean {
    return severity === 'serious' || severity === 'critical';
  }

  // ── Stats ────────────────────────────────────────────────

  getSafetyStats(): {
    totalAssessments: number;
    totalChecklists: number;
    checklistPassRate: number;
    totalIncidents: number;
    incidentsBySeverity: Record<string, number>;
  } {
    const checklists = Array.from(this.checklists.values());
    const passed = checklists.filter(c => c.allPassed).length;

    const incidentsBySeverity: Record<string, number> = {};
    for (const inc of this.incidents) {
      incidentsBySeverity[inc.severity] = (incidentsBySeverity[inc.severity] ?? 0) + 1;
    }

    return {
      totalAssessments: this.riskAssessments.size,
      totalChecklists: checklists.length,
      checklistPassRate: checklists.length > 0 ? passed / checklists.length : 1,
      totalIncidents: this.incidents.length,
      incidentsBySeverity,
    };
  }
}
