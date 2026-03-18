/**
 * KTV Working Drone Thailand - Reporting & Analytics System
 * KPI dashboards, financial reports, operational metrics
 * Aggregates data from all 7 agents into actionable business intelligence
 *
 * Connects: ALL agents through the Operations Brain
 */

import { AgentHealth, FleetSummary, ServiceLine } from '../types/index.js';

// ── Report Types ───────────────────────────────────────────

export interface OperationalKPIs {
  timestamp: Date;
  period: string;
  fleet: {
    utilization: number;          // % drones in use vs available
    availability: number;         // % drones not in maintenance
    avgFlightHoursPerDrone: number;
    maintenanceAlerts: number;
  };
  pilots: {
    utilization: number;          // % pilots on mission vs available
    avgHoursPerPilot: number;
    certificationCompliance: number; // % with valid certs
    performanceAvg: number;
  };
  jobs: {
    activeJobs: number;
    completedThisPeriod: number;
    avgCycleTimeDays: number;
    stageBottleneck: string;
  };
  safety: {
    incidentRate: number;        // per 100 flight hours
    preflightPassRate: number;
    riskAssessmentsCompleted: number;
    daysWithoutIncident: number;
  };
  data: {
    jobsInQueue: number;
    avgProcessingTimeDays: number;
    qaPassRate: number;
    backupCompliance: number;
  };
  revenue: {
    grossRevenue: number;
    netIncome: number;
    ebitdaMargin: number;
    invoicesPaid: number;
    invoicesOverdue: number;
    avgDaysToPayment: number;
  };
  crm: {
    totalLeads: number;
    conversionRate: number;
    activeClients: number;
    npsScore: number;
    recurringClients: number;
  };
}

export interface ServiceLineReport {
  serviceLine: ServiceLine;
  name: string;
  jobsCompleted: number;
  revenue: number;
  avgJobValue: number;
  clientCount: number;
  utilizationRate: number;
  profitMargin: number;
}

export interface ExecutiveSummary {
  generatedAt: Date;
  period: string;
  headline: string;
  kpis: OperationalKPIs;
  serviceBreakdown: ServiceLineReport[];
  alerts: string[];
  recommendations: string[];
}

export interface GrowthTracker {
  year: number;
  targetRevenue: number;
  actualRevenue: number;
  targetClients: number;
  actualClients: number;
  revenueAchievement: number;   // %
  clientAchievement: number;    // %
  monthlyRunRate: number;
  projectedYearEnd: number;
}

// ── Reporting Engine ───────────────────────────────────────

export class ReportingEngine {
  private kpiHistory: OperationalKPIs[] = [];

  /**
   * Generate operational KPIs from agent data
   */
  generateKPIs(
    agentHealth: AgentHealth[],
    fleetSummary: FleetSummary,
    safetyStats: { totalAssessments: number; checklistPassRate: number; totalIncidents: number },
    processingStats: { totalJobs: number; qaPassRate: number; backupComplianceRate: number; byStatus: Record<string, number> },
    financialSummary: { grossRevenue: number; netIncome: number; ebitdaMargin: number },
    crmStats: { totalLeads: number; totalClients: number; npsAvg: number; conversionRate: number },
    pilotCount: number,
    period: string,
  ): OperationalKPIs {
    const kpis: OperationalKPIs = {
      timestamp: new Date(),
      period,
      fleet: {
        utilization: fleetSummary.totalDrones > 0
          ? (fleetSummary.inFlight / fleetSummary.totalDrones) * 100 : 0,
        availability: fleetSummary.totalDrones > 0
          ? ((fleetSummary.totalDrones - fleetSummary.inMaintenance) / fleetSummary.totalDrones) * 100 : 100,
        avgFlightHoursPerDrone: fleetSummary.totalDrones > 0
          ? fleetSummary.totalFlightHours / fleetSummary.totalDrones : 0,
        maintenanceAlerts: fleetSummary.maintenanceAlerts.length,
      },
      pilots: {
        utilization: 0, // would be calculated from pilot agent
        avgHoursPerPilot: 0,
        certificationCompliance: 100,
        performanceAvg: 0,
      },
      jobs: {
        activeJobs: agentHealth.find(a => a.role === 'job-lifecycle')?.tasksPending ?? 0,
        completedThisPeriod: agentHealth.find(a => a.role === 'job-lifecycle')?.tasksCompleted ?? 0,
        avgCycleTimeDays: 0,
        stageBottleneck: 'none',
      },
      safety: {
        incidentRate: fleetSummary.totalFlightHours > 0
          ? (safetyStats.totalIncidents / fleetSummary.totalFlightHours) * 100 : 0,
        preflightPassRate: safetyStats.checklistPassRate * 100,
        riskAssessmentsCompleted: safetyStats.totalAssessments,
        daysWithoutIncident: safetyStats.totalIncidents === 0 ? 365 : 0,
      },
      data: {
        jobsInQueue: processingStats.byStatus['queued'] ?? 0,
        avgProcessingTimeDays: 0,
        qaPassRate: processingStats.qaPassRate * 100,
        backupCompliance: processingStats.backupComplianceRate * 100,
      },
      revenue: {
        grossRevenue: financialSummary.grossRevenue,
        netIncome: financialSummary.netIncome,
        ebitdaMargin: financialSummary.ebitdaMargin * 100,
        invoicesPaid: 0,
        invoicesOverdue: 0,
        avgDaysToPayment: 0,
      },
      crm: {
        totalLeads: crmStats.totalLeads,
        conversionRate: crmStats.conversionRate,
        activeClients: crmStats.totalClients,
        npsScore: crmStats.npsAvg,
        recurringClients: 0,
      },
    };

    this.kpiHistory.push(kpis);
    return kpis;
  }

  /**
   * Generate executive summary with alerts and recommendations
   */
  generateExecutiveSummary(kpis: OperationalKPIs, period: string): ExecutiveSummary {
    const alerts: string[] = [];
    const recommendations: string[] = [];

    // Safety alerts
    if (kpis.safety.preflightPassRate < 95) {
      alerts.push(`Pre-flight pass rate below target: ${kpis.safety.preflightPassRate.toFixed(1)}% (target: 95%)`);
      recommendations.push('Review pre-flight training procedures and equipment condition');
    }
    if (kpis.safety.incidentRate > 0.5) {
      alerts.push(`Incident rate elevated: ${kpis.safety.incidentRate.toFixed(2)} per 100 flight hours`);
    }

    // Fleet alerts
    if (kpis.fleet.availability < 80) {
      alerts.push(`Fleet availability below 80%: ${kpis.fleet.availability.toFixed(1)}%`);
      recommendations.push('Schedule staggered maintenance to maintain fleet availability');
    }
    if (kpis.fleet.maintenanceAlerts > 3) {
      alerts.push(`${kpis.fleet.maintenanceAlerts} maintenance alerts pending`);
    }

    // Data quality
    if (kpis.data.backupCompliance < 100) {
      alerts.push(`Backup compliance: ${kpis.data.backupCompliance.toFixed(0)}% (must be 100%)`);
      recommendations.push('Enforce 4-copy backup protocol immediately');
    }
    if (kpis.data.qaPassRate < 90) {
      alerts.push(`QA pass rate: ${kpis.data.qaPassRate.toFixed(1)}% (target: 90%)`);
    }

    // Revenue
    if (kpis.revenue.ebitdaMargin < 80) {
      recommendations.push('Review pricing and operational costs to improve EBITDA margin');
    }

    // CRM
    if (kpis.crm.npsScore > 0 && kpis.crm.npsScore < 50) {
      alerts.push(`NPS score below target: ${kpis.crm.npsScore} (target: 50+)`);
      recommendations.push('Conduct client satisfaction interviews and address common complaints');
    }

    const headline = alerts.length === 0
      ? 'All systems operating within normal parameters'
      : `${alerts.length} alert(s) require attention`;

    return {
      generatedAt: new Date(),
      period,
      headline,
      kpis,
      serviceBreakdown: [],
      alerts,
      recommendations,
    };
  }

  /**
   * Track growth against targets
   */
  generateGrowthTracker(
    year: number,
    actualRevenue: number,
    actualClients: number,
    monthsElapsed: number,
  ): GrowthTracker {
    const targets: Record<number, { revenue: number; clients: number }> = {
      1: { revenue: 180_180_000, clients: 120 },
      2: { revenue: 300_299_985, clients: 400 },
      3: { revenue: 600_600_015, clients: 1200 },
    };

    const target = targets[year] ?? targets[1];
    const monthlyRunRate = monthsElapsed > 0 ? actualRevenue / monthsElapsed : 0;

    return {
      year,
      targetRevenue: target.revenue,
      actualRevenue,
      targetClients: target.clients,
      actualClients,
      revenueAchievement: target.revenue > 0 ? (actualRevenue / target.revenue) * 100 : 0,
      clientAchievement: target.clients > 0 ? (actualClients / target.clients) * 100 : 0,
      monthlyRunRate,
      projectedYearEnd: monthlyRunRate * 12,
    };
  }

  getKPIHistory(limit = 30): OperationalKPIs[] {
    return this.kpiHistory.slice(-limit);
  }
}
