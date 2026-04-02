/**
 * KTV Working Drone Thailand - Fleet Management Agent
 * Manages drone fleet, batteries, payloads, and maintenance schedules
 */

import { KtvAgent } from './base-agent.js';
import {
  AgentMessage,
  Battery,
  BatteryHealth,
  Drone,
  DroneStatus,
  FleetSummary,
  MaintenanceAlert,
  MaintenanceRecord,
  Payload,
} from '../types/index.js';

export class FleetManagementAgent extends KtvAgent {
  private drones: Map<string, Drone> = new Map();
  private batteries: Map<string, Battery> = new Map();
  private payloads: Map<string, Payload> = new Map();
  private maintenanceLog: MaintenanceRecord[] = [];

  constructor() {
    super({
      role: 'fleet-management',
      name: 'KTV Fleet Manager',
      description: 'Manages drone fleet, batteries, payloads, and maintenance for KTV Working Drone Thailand',
      dependencies: [],
      pollIntervalMs: 30_000,
    });
  }

  protected async onStart(): Promise<void> {
    this.log('Fleet management system initialized');
    this.initializeDefaultFleet();
  }

  protected async onStop(): Promise<void> {
    this.log('Fleet management system shutting down');
  }

  protected async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const { action } = message.payload as { action: string };

    switch (action) {
      case 'get-fleet-summary':
        return this.createResponse(message, { summary: this.getFleetSummary() });

      case 'get-available-drones':
        return this.createResponse(message, {
          drones: this.getAvailableDrones(message.payload.category as string | undefined),
        });

      case 'assign-drone':
        return this.createResponse(message, {
          success: this.assignDrone(message.payload.droneId as string),
        });

      case 'release-drone':
        return this.createResponse(message, {
          success: this.releaseDrone(message.payload.droneId as string),
        });

      case 'log-maintenance':
        return this.createResponse(message, {
          record: this.logMaintenance(message.payload.record as MaintenanceRecord),
        });

      case 'check-battery-health':
        return this.createResponse(message, {
          batteries: this.checkBatteryHealth(),
        });

      case 'get-maintenance-alerts':
        return this.createResponse(message, {
          alerts: this.getMaintenanceAlerts(),
        });

      default:
        return this.createResponse(message, { error: `Unknown action: ${action}` });
    }
  }

  // ── Fleet Operations ─────────────────────────────────────

  getFleetSummary(): FleetSummary {
    const drones = Array.from(this.drones.values());
    return {
      totalDrones: drones.length,
      available: drones.filter(d => d.status === 'available').length,
      inFlight: drones.filter(d => d.status === 'in-flight').length,
      inMaintenance: drones.filter(d => d.status === 'maintenance').length,
      totalFlightHours: drones.reduce((sum, d) => sum + d.flightHours, 0),
      maintenanceAlerts: this.getMaintenanceAlerts(),
    };
  }

  getAvailableDrones(category?: string): Drone[] {
    return Array.from(this.drones.values()).filter(d => {
      const statusMatch = d.status === 'available';
      const categoryMatch = !category || d.category === category;
      return statusMatch && categoryMatch;
    });
  }

  assignDrone(droneId: string): boolean {
    const drone = this.drones.get(droneId);
    if (!drone || drone.status !== 'available') return false;
    drone.status = 'in-flight';
    this.log(`Drone ${drone.model} (${droneId}) assigned to mission`);
    return true;
  }

  releaseDrone(droneId: string): boolean {
    const drone = this.drones.get(droneId);
    if (!drone) return false;
    drone.status = 'available';
    this.log(`Drone ${drone.model} (${droneId}) released from mission`);
    return true;
  }

  setDroneStatus(droneId: string, status: DroneStatus): boolean {
    const drone = this.drones.get(droneId);
    if (!drone) return false;
    drone.status = status;
    return true;
  }

  // ── Battery Management ───────────────────────────────────

  checkBatteryHealth(): { id: string; healthPercent: number; healthStatus: BatteryHealth }[] {
    return Array.from(this.batteries.values()).map(b => ({
      id: b.id,
      healthPercent: b.healthPercent,
      healthStatus: this.classifyBatteryHealth(b.healthPercent),
    }));
  }

  private classifyBatteryHealth(percent: number): BatteryHealth {
    if (percent >= 80) return 'good';
    if (percent >= 70) return 'training-only';
    return 'retired';
  }

  // ── Maintenance ──────────────────────────────────────────

  logMaintenance(record: MaintenanceRecord): MaintenanceRecord {
    this.maintenanceLog.push(record);
    const drone = this.drones.get(record.droneId);
    if (drone) {
      drone.lastMaintenance = record.date;
      drone.nextMaintenanceDue = record.type === '50-hour'
        ? drone.flightHours + 50
        : drone.flightHours + 200;
    }
    this.log(`Maintenance logged for drone ${record.droneId}: ${record.type}`);
    return record;
  }

  getMaintenanceAlerts(): MaintenanceAlert[] {
    const alerts: MaintenanceAlert[] = [];
    for (const drone of this.drones.values()) {
      const hoursUntilService = drone.nextMaintenanceDue - drone.flightHours;
      if (hoursUntilService <= 10) {
        alerts.push({
          droneId: drone.id,
          model: drone.model,
          type: drone.nextMaintenanceDue % 200 === 0 ? '200-hour' : '50-hour',
          hoursRemaining: Math.max(0, hoursUntilService),
          urgency: hoursUntilService <= 2 ? 'high' : hoursUntilService <= 5 ? 'medium' : 'low',
        });
      }
    }
    return alerts;
  }

  // ── Default Fleet Setup ──────────────────────────────────

  private initializeDefaultFleet(): void {
    const now = new Date();
    const fleetDef: Omit<Drone, 'id' | 'serialNumber'>[] = [
      // Agricultural Fleet
      { model: 'DJI Agras T50', category: 'agricultural', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Agras T50', category: 'agricultural', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Agras T50', category: 'agricultural', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Agras T50', category: 'agricultural', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Agras T25', category: 'agricultural', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Agras T25', category: 'agricultural', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      // Survey Fleet
      { model: 'DJI Matrice 350 RTK', category: 'survey', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Matrice 350 RTK', category: 'survey', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Mavic 3 Enterprise RTK', category: 'survey', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Mavic 3 Enterprise RTK', category: 'survey', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      // Inspection Fleet
      { model: 'DJI Matrice 30T', category: 'inspection', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Matrice 30T', category: 'inspection', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Mavic 3 Thermal', category: 'inspection', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      // Media Fleet
      { model: 'DJI Inspire 3', category: 'media', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Mavic 3 Pro Cine', category: 'media', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
      { model: 'DJI Mini 4 Pro', category: 'media', status: 'available', flightHours: 0, purchaseDate: now, lastMaintenance: now, nextMaintenanceDue: 50, location: { latitude: 13.7563, longitude: 100.5018, province: 'Bangkok' } },
    ];

    fleetDef.forEach((def, i) => {
      const id = `DRONE-${String(i + 1).padStart(3, '0')}`;
      this.drones.set(id, { ...def, id, serialNumber: `SN-${id}-${Date.now()}` } as Drone);
    });

    this.log(`Fleet initialized with ${this.drones.size} drones`);
  }
}
