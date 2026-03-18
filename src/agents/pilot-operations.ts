/**
 * KTV Working Drone Thailand - Pilot Operations Agent
 * Pilot scheduling, certification tracking, performance scoring
 * Enforces CAAT pilot regulations and flight hour limits
 */

import { KtvAgent } from './base-agent.js';
import {
  AgentMessage,
  GeoLocation,
  Pilot,
  PilotAssignment,
  PilotSchedule,
  PilotStatus,
} from '../types/index.js';

/** CAAT and company flight hour limits */
const PILOT_LIMITS = {
  maxDailyHours: 8,
  maxMonthlyHours: 80,
  trainingWeeks: 6,
} as const;

export class PilotOperationsAgent extends KtvAgent {
  private pilots: Map<string, Pilot> = new Map();
  private schedules: Map<string, PilotSchedule[]> = new Map();

  constructor() {
    super({
      role: 'pilot-operations',
      name: 'KTV Pilot Operations',
      description: 'Pilot scheduling, certification tracking, performance management for KTV Working Drone Thailand',
      dependencies: ['fleet-management', 'safety-compliance'],
      pollIntervalMs: 30_000,
    });
  }

  protected async onStart(): Promise<void> {
    this.log('Pilot Operations system initialized');
  }

  protected async onStop(): Promise<void> {
    this.log('Pilot Operations system shutting down');
  }

  protected async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const { action } = message.payload as { action: string };

    switch (action) {
      case 'register-pilot':
        return this.createResponse(message, {
          pilot: this.registerPilot(message.payload as Partial<Pilot>),
        });

      case 'get-available-pilots':
        return this.createResponse(message, {
          pilots: this.getAvailablePilots(message.payload.typeRating as string | undefined),
        });

      case 'assign-pilot':
        return this.createResponse(message, {
          success: this.assignPilot(
            message.payload.pilotId as string,
            message.payload.assignment as PilotAssignment,
          ),
        });

      case 'check-certifications':
        return this.createResponse(message, {
          alerts: this.checkCertificationExpiry(),
        });

      case 'get-flight-hours':
        return this.createResponse(message, {
          hours: this.getFlightHoursSummary(message.payload.pilotId as string),
        });

      case 'can-fly':
        return this.createResponse(message, {
          canFly: this.canPilotFly(
            message.payload.pilotId as string,
            message.payload.durationHours as number,
          ),
        });

      case 'update-performance':
        return this.createResponse(message, {
          success: this.updatePerformanceScore(
            message.payload.pilotId as string,
            message.payload.score as number,
          ),
        });

      default:
        return this.createResponse(message, { error: `Unknown action: ${action}` });
    }
  }

  // ── Pilot Registration ───────────────────────────────────

  registerPilot(data: Partial<Pilot>): Pilot {
    const id = `PILOT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const pilot: Pilot = {
      id,
      name: data.name ?? '',
      caatLicenseNumber: data.caatLicenseNumber ?? '',
      caatLicenseExpiry: data.caatLicenseExpiry ?? new Date(),
      medicalCertExpiry: data.medicalCertExpiry ?? new Date(),
      typeRatings: data.typeRatings ?? [],
      status: 'available',
      flightHoursTotal: 0,
      flightHoursMonth: 0,
      flightHoursToday: 0,
      maxDailyHours: PILOT_LIMITS.maxDailyHours,
      maxMonthlyHours: PILOT_LIMITS.maxMonthlyHours,
      hiredAt: new Date(),
    };

    this.pilots.set(id, pilot);
    this.log(`Pilot registered: ${pilot.name} (${id})`);
    return pilot;
  }

  // ── Availability & Scheduling ────────────────────────────

  getAvailablePilots(typeRating?: string): Pilot[] {
    return Array.from(this.pilots.values()).filter(p => {
      if (p.status !== 'available') return false;
      if (!this.hasValidCertifications(p)) return false;
      if (typeRating && !p.typeRatings.includes(typeRating)) return false;
      return p.flightHoursToday < p.maxDailyHours && p.flightHoursMonth < p.maxMonthlyHours;
    });
  }

  assignPilot(pilotId: string, assignment: PilotAssignment): boolean {
    const pilot = this.pilots.get(pilotId);
    if (!pilot) return false;

    const durationHours =
      (new Date(assignment.endTime).getTime() - new Date(assignment.startTime).getTime()) / 3_600_000;

    if (!this.canPilotFly(pilotId, durationHours)) {
      this.log(`Cannot assign pilot ${pilotId}: would exceed flight hour limits`);
      return false;
    }

    pilot.status = 'on-mission';
    pilot.flightHoursToday += durationHours;
    pilot.flightHoursMonth += durationHours;
    pilot.flightHoursTotal += durationHours;

    const dateKey = new Date(assignment.startTime).toISOString().split('T')[0];
    const existing = this.schedules.get(pilotId) ?? [];
    const daySchedule = existing.find(s => s.date.toISOString().split('T')[0] === dateKey);

    if (daySchedule) {
      daySchedule.assignments.push(assignment);
      daySchedule.totalHoursScheduled += durationHours;
    } else {
      existing.push({
        pilotId,
        date: new Date(assignment.startTime),
        assignments: [assignment],
        totalHoursScheduled: durationHours,
      });
    }
    this.schedules.set(pilotId, existing);

    this.log(`Pilot ${pilot.name} assigned to job ${assignment.jobId} for ${durationHours.toFixed(1)}h`);
    return true;
  }

  canPilotFly(pilotId: string, durationHours: number): boolean {
    const pilot = this.pilots.get(pilotId);
    if (!pilot) return false;
    if (!this.hasValidCertifications(pilot)) return false;
    if (pilot.flightHoursToday + durationHours > pilot.maxDailyHours) return false;
    if (pilot.flightHoursMonth + durationHours > pilot.maxMonthlyHours) return false;
    return true;
  }

  // ── Certifications ───────────────────────────────────────

  hasValidCertifications(pilot: Pilot): boolean {
    const now = new Date();
    return pilot.caatLicenseExpiry > now && pilot.medicalCertExpiry > now;
  }

  checkCertificationExpiry(): { pilotId: string; name: string; type: string; expiresAt: Date; daysRemaining: number }[] {
    const alerts: { pilotId: string; name: string; type: string; expiresAt: Date; daysRemaining: number }[] = [];
    const now = new Date();
    const warningDays = 30;

    for (const pilot of this.pilots.values()) {
      const caatDays = Math.ceil((pilot.caatLicenseExpiry.getTime() - now.getTime()) / 86_400_000);
      if (caatDays <= warningDays) {
        alerts.push({ pilotId: pilot.id, name: pilot.name, type: 'CAAT License', expiresAt: pilot.caatLicenseExpiry, daysRemaining: caatDays });
      }

      const medDays = Math.ceil((pilot.medicalCertExpiry.getTime() - now.getTime()) / 86_400_000);
      if (medDays <= warningDays) {
        alerts.push({ pilotId: pilot.id, name: pilot.name, type: 'Medical Certificate', expiresAt: pilot.medicalCertExpiry, daysRemaining: medDays });
      }
    }

    return alerts;
  }

  // ── Performance ──────────────────────────────────────────

  getFlightHoursSummary(pilotId: string): { today: number; month: number; total: number; dailyRemaining: number; monthlyRemaining: number } | null {
    const pilot = this.pilots.get(pilotId);
    if (!pilot) return null;
    return {
      today: pilot.flightHoursToday,
      month: pilot.flightHoursMonth,
      total: pilot.flightHoursTotal,
      dailyRemaining: pilot.maxDailyHours - pilot.flightHoursToday,
      monthlyRemaining: pilot.maxMonthlyHours - pilot.flightHoursMonth,
    };
  }

  updatePerformanceScore(pilotId: string, score: number): boolean {
    const pilot = this.pilots.get(pilotId);
    if (!pilot || score < 0 || score > 100) return false;
    pilot.performanceScore = score;
    this.log(`Pilot ${pilot.name} performance score: ${score}`);
    return true;
  }
}
