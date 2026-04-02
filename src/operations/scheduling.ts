/**
 * KTV Working Drone Thailand - Scheduling & Dispatch System
 * Resource allocation, calendar management, pilot/drone matching,
 * and recurring service scheduling
 *
 * Connects: Fleet Management + Pilot Operations + Job Lifecycle + Safety
 */

import { DroneCategory, GeoLocation, Job, ServiceLine } from '../types/index.js';
import { SERVICE_CONFIGS } from './service-operations.js';

// ── Schedule Types ─────────────────────────────────────────

export type ScheduleStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'weather-hold';

export interface ScheduleSlot {
  id: string;
  jobId: string;
  date: Date;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  durationMinutes: number;
  status: ScheduleStatus;
  assignedPilotId?: string;
  assignedDroneId?: string;
  backupDroneId?: string;
  location: GeoLocation;
  serviceLine: ServiceLine;
  weatherChecked: boolean;
  preflightDone: boolean;
}

export interface RecurringSchedule {
  id: string;
  clientId: string;
  serviceLine: ServiceLine;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  preferredDay: number;       // 0=Sun, 1=Mon ... 6=Sat
  preferredTimeSlot: 'morning' | 'afternoon';
  location: GeoLocation;
  active: boolean;
  nextScheduledDate: Date;
  totalCompletedSessions: number;
}

export interface ResourceAvailability {
  date: Date;
  availablePilots: number;
  availableDrones: Record<string, number>; // by category
  scheduledSlots: number;
  capacityPercent: number;
}

export interface DispatchDecision {
  jobId: string;
  pilotId: string;
  droneId: string;
  reasoning: string;
  score: number; // 0-100, higher is better match
}

// ── Scheduling Engine ──────────────────────────────────────

export class SchedulingEngine {
  private slots: Map<string, ScheduleSlot> = new Map();
  private recurringSchedules: Map<string, RecurringSchedule> = new Map();
  private dispatchLog: DispatchDecision[] = [];

  // ── Slot Management ──────────────────────────────────────

  createSlot(data: Partial<ScheduleSlot> & { jobId: string; date: Date; serviceLine: ServiceLine; location: GeoLocation }): ScheduleSlot {
    const id = `SLOT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const slot: ScheduleSlot = {
      id,
      jobId: data.jobId,
      date: data.date,
      startTime: data.startTime ?? '08:00',
      endTime: data.endTime ?? '12:00',
      durationMinutes: data.durationMinutes ?? 240,
      status: 'scheduled',
      assignedPilotId: data.assignedPilotId,
      assignedDroneId: data.assignedDroneId,
      location: data.location,
      serviceLine: data.serviceLine,
      weatherChecked: false,
      preflightDone: false,
    };
    this.slots.set(id, slot);
    return slot;
  }

  updateSlotStatus(slotId: string, status: ScheduleStatus): boolean {
    const slot = this.slots.get(slotId);
    if (!slot) return false;
    slot.status = status;
    return true;
  }

  assignResources(slotId: string, pilotId: string, droneId: string): boolean {
    const slot = this.slots.get(slotId);
    if (!slot) return false;
    slot.assignedPilotId = pilotId;
    slot.assignedDroneId = droneId;
    slot.status = 'confirmed';
    return true;
  }

  getSlotsByDate(date: Date): ScheduleSlot[] {
    const dateStr = date.toISOString().split('T')[0];
    return Array.from(this.slots.values()).filter(
      s => s.date.toISOString().split('T')[0] === dateStr,
    );
  }

  getSlotsByStatus(status: ScheduleStatus): ScheduleSlot[] {
    return Array.from(this.slots.values()).filter(s => s.status === status);
  }

  // ── Recurring Schedules ──────────────────────────────────

  createRecurringSchedule(data: Omit<RecurringSchedule, 'id' | 'totalCompletedSessions'>): RecurringSchedule {
    const id = `RSCHED-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const schedule: RecurringSchedule = {
      ...data,
      id,
      totalCompletedSessions: 0,
    };
    this.recurringSchedules.set(id, schedule);
    return schedule;
  }

  getActiveRecurringSchedules(): RecurringSchedule[] {
    return Array.from(this.recurringSchedules.values()).filter(s => s.active);
  }

  generateSlotsFromRecurring(daysAhead = 30): ScheduleSlot[] {
    const generated: ScheduleSlot[] = [];
    const today = new Date();

    for (const schedule of this.getActiveRecurringSchedules()) {
      let nextDate = new Date(schedule.nextScheduledDate);

      while (nextDate <= new Date(today.getTime() + daysAhead * 86_400_000)) {
        const slot = this.createSlot({
          jobId: `REC-${schedule.id}-${nextDate.toISOString().split('T')[0]}`,
          date: new Date(nextDate),
          serviceLine: schedule.serviceLine,
          location: schedule.location,
          startTime: schedule.preferredTimeSlot === 'morning' ? '08:00' : '13:00',
          endTime: schedule.preferredTimeSlot === 'morning' ? '12:00' : '17:00',
        });
        generated.push(slot);

        // Advance to next occurrence
        const intervalDays: Record<string, number> = {
          weekly: 7, biweekly: 14, monthly: 30, quarterly: 90,
        };
        nextDate = new Date(nextDate.getTime() + (intervalDays[schedule.frequency] ?? 30) * 86_400_000);
      }
    }

    return generated;
  }

  // ── Smart Dispatch ───────────────────────────────────────

  /**
   * Score a pilot/drone combination for a job
   * Higher score = better match
   */
  scoreDispatch(
    pilotTypeRatings: string[],
    pilotHoursRemaining: number,
    droneCategory: DroneCategory,
    droneFlightHours: number,
    serviceLine: ServiceLine,
    estimatedDuration: number,
  ): DispatchDecision {
    const config = SERVICE_CONFIGS[serviceLine];
    let score = 50; // base score
    const reasons: string[] = [];

    // Type rating match
    const hasRating = config.requiredTypeRatings.some(r => pilotTypeRatings.includes(r));
    if (hasRating) {
      score += 20;
      reasons.push('Pilot has required type rating');
    } else {
      score -= 30;
      reasons.push('Pilot missing type rating');
    }

    // Drone category match
    if (config.requiredDroneCategories.includes(droneCategory)) {
      score += 15;
      reasons.push('Drone category matches service');
    } else {
      score -= 20;
      reasons.push('Drone category mismatch');
    }

    // Flight hours capacity
    const hoursNeeded = estimatedDuration / 60;
    if (pilotHoursRemaining >= hoursNeeded) {
      score += 10;
      reasons.push('Pilot has sufficient flight hours');
    } else {
      score -= 40;
      reasons.push('Pilot insufficient flight hours');
    }

    // Drone freshness (lower hours = better)
    if (droneFlightHours < 100) {
      score += 5;
      reasons.push('Drone has low flight hours');
    }

    return {
      jobId: '',
      pilotId: '',
      droneId: '',
      reasoning: reasons.join('; '),
      score: Math.max(0, Math.min(100, score)),
    };
  }

  // ── Capacity Planning ────────────────────────────────────

  getDailyCapacity(date: Date, totalPilots: number, totalDrones: number): ResourceAvailability {
    const scheduled = this.getSlotsByDate(date);
    const usedPilots = new Set(scheduled.map(s => s.assignedPilotId).filter(Boolean));
    const maxSlots = Math.min(totalPilots, totalDrones) * 2; // 2 slots per resource per day

    return {
      date,
      availablePilots: totalPilots - usedPilots.size,
      availableDrones: {}, // would be populated by fleet agent
      scheduledSlots: scheduled.length,
      capacityPercent: maxSlots > 0 ? (scheduled.length / maxSlots) * 100 : 0,
    };
  }

  getWeeklyOverview(startDate: Date, totalPilots: number, totalDrones: number): ResourceAvailability[] {
    const overview: ResourceAvailability[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate.getTime() + i * 86_400_000);
      overview.push(this.getDailyCapacity(date, totalPilots, totalDrones));
    }
    return overview;
  }

  // ── Summary ──────────────────────────────────────────────

  getSchedulingSummary(): {
    totalSlots: number;
    byStatus: Record<string, number>;
    recurringActive: number;
    upcomingToday: number;
  } {
    const slots = Array.from(this.slots.values());
    const byStatus: Record<string, number> = {};
    for (const slot of slots) {
      byStatus[slot.status] = (byStatus[slot.status] ?? 0) + 1;
    }
    const today = new Date().toISOString().split('T')[0];
    const upcomingToday = slots.filter(
      s => s.date.toISOString().split('T')[0] === today && s.status !== 'completed',
    ).length;

    return {
      totalSlots: slots.length,
      byStatus,
      recurringActive: this.getActiveRecurringSchedules().length,
      upcomingToday,
    };
  }
}
