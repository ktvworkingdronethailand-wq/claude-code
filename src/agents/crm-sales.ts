/**
 * KTV Working Drone Thailand - CRM & Sales Agent
 * Manages leads, clients, customer segments, and NPS tracking
 */

import { KtvAgent } from './base-agent.js';
import {
  AgentMessage,
  Client,
  CustomerSegment,
  Lead,
  LeadStage,
  PricingTier,
} from '../types/index.js';

/** Discount by pricing tier */
const TIER_DISCOUNTS: Record<PricingTier, number> = {
  standard: 0,
  professional: 0.125, // 10-15% avg
  enterprise: 0.225, // 20-25% avg
};

export class CrmSalesAgent extends KtvAgent {
  private leads: Map<string, Lead> = new Map();
  private clients: Map<string, Client> = new Map();

  constructor() {
    super({
      role: 'crm-sales',
      name: 'KTV CRM & Sales',
      description: 'Lead pipeline, client management, NPS tracking for KTV Working Drone Thailand',
      dependencies: ['job-lifecycle', 'finance-invoicing'],
      pollIntervalMs: 60_000,
    });
  }

  protected async onStart(): Promise<void> {
    this.log('CRM & Sales system initialized');
  }

  protected async onStop(): Promise<void> {
    this.log('CRM & Sales system shutting down');
  }

  protected async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const { action } = message.payload as { action: string };

    switch (action) {
      case 'create-lead':
        return this.createResponse(message, {
          lead: this.createLead(message.payload as Partial<Lead>),
        });

      case 'advance-lead':
        return this.createResponse(message, {
          success: this.advanceLead(
            message.payload.leadId as string,
            message.payload.stage as LeadStage,
          ),
        });

      case 'convert-lead':
        return this.createResponse(message, {
          client: this.convertLeadToClient(
            message.payload.leadId as string,
            message.payload.tier as PricingTier,
          ),
        });

      case 'get-pipeline':
        return this.createResponse(message, {
          pipeline: this.getPipelineSummary(),
        });

      case 'record-nps':
        return this.createResponse(message, {
          success: this.recordNps(
            message.payload.clientId as string,
            message.payload.score as number,
          ),
        });

      case 'get-segment-report':
        return this.createResponse(message, {
          report: this.getSegmentReport(),
        });

      case 'apply-pricing':
        return this.createResponse(message, {
          finalPrice: this.applyTierPricing(
            message.payload.basePrice as number,
            message.payload.clientId as string,
          ),
        });

      default:
        return this.createResponse(message, { error: `Unknown action: ${action}` });
    }
  }

  // ── Lead Management ──────────────────────────────────────

  createLead(data: Partial<Lead>): Lead {
    const id = `LEAD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date();
    const lead: Lead = {
      id,
      companyName: data.companyName ?? '',
      contactName: data.contactName ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      lineId: data.lineId,
      segment: data.segment ?? 'small-farm',
      stage: 'new',
      source: data.source ?? 'website',
      estimatedValue: data.estimatedValue ?? 0,
      notes: data.notes ?? '',
      createdAt: now,
      lastContactedAt: now,
    };

    this.leads.set(id, lead);
    this.log(`Lead created: ${id} - ${lead.companyName} (${lead.segment})`);
    return lead;
  }

  advanceLead(leadId: string, toStage: LeadStage): boolean {
    const lead = this.leads.get(leadId);
    if (!lead) return false;
    lead.stage = toStage;
    lead.lastContactedAt = new Date();
    this.log(`Lead ${leadId}: advanced to ${toStage}`);
    return true;
  }

  convertLeadToClient(leadId: string, tier: PricingTier = 'standard'): Client | null {
    const lead = this.leads.get(leadId);
    if (!lead || lead.stage !== 'won') return null;

    const clientId = `CLIENT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const client: Client = {
      id: clientId,
      companyName: lead.companyName,
      contactName: lead.contactName,
      email: lead.email,
      phone: lead.phone,
      lineId: lead.lineId,
      segment: lead.segment,
      pricingTier: tier,
      totalRevenue: 0,
      jobCount: 0,
      isRecurring: false,
      onboardedAt: new Date(),
    };

    this.clients.set(clientId, client);
    this.leads.delete(leadId);
    this.log(`Lead ${leadId} converted to client ${clientId}`);

    // Notify job lifecycle to create onboarding tasks
    this.createEvent('job-lifecycle', {
      event: 'new-client-onboarded',
      clientId,
      segment: client.segment,
    });

    return client;
  }

  // ── Pipeline & Reporting ─────────────────────────────────

  getPipelineSummary(): Record<LeadStage, { count: number; totalValue: number }> {
    const stages: LeadStage[] = ['new', 'contacted', 'qualified', 'proposal-sent', 'negotiation', 'won', 'lost'];
    const summary = {} as Record<LeadStage, { count: number; totalValue: number }>;

    for (const stage of stages) {
      const stageLeads = Array.from(this.leads.values()).filter(l => l.stage === stage);
      summary[stage] = {
        count: stageLeads.length,
        totalValue: stageLeads.reduce((sum, l) => sum + l.estimatedValue, 0),
      };
    }
    return summary;
  }

  getSegmentReport(): Record<CustomerSegment, { leads: number; clients: number; revenue: number }> {
    const segments: CustomerSegment[] = [
      'small-farm', 'large-agribusiness', 'construction',
      'real-estate', 'government', 'tourism', 'insurance',
    ];

    const report = {} as Record<CustomerSegment, { leads: number; clients: number; revenue: number }>;

    for (const seg of segments) {
      report[seg] = {
        leads: Array.from(this.leads.values()).filter(l => l.segment === seg).length,
        clients: Array.from(this.clients.values()).filter(c => c.segment === seg).length,
        revenue: Array.from(this.clients.values())
          .filter(c => c.segment === seg)
          .reduce((sum, c) => sum + c.totalRevenue, 0),
      };
    }
    return report;
  }

  // ── NPS ──────────────────────────────────────────────────

  recordNps(clientId: string, score: number): boolean {
    const client = this.clients.get(clientId);
    if (!client || score < 0 || score > 10) return false;
    client.npsScore = score;
    this.log(`NPS recorded for ${clientId}: ${score}`);
    return true;
  }

  getAverageNps(): number {
    const scored = Array.from(this.clients.values()).filter(c => c.npsScore !== undefined);
    if (scored.length === 0) return 0;
    return scored.reduce((sum, c) => sum + (c.npsScore ?? 0), 0) / scored.length;
  }

  // ── Pricing ──────────────────────────────────────────────

  applyTierPricing(basePrice: number, clientId: string): number {
    const client = this.clients.get(clientId);
    if (!client) return basePrice;
    const discount = TIER_DISCOUNTS[client.pricingTier];
    return Math.round(basePrice * (1 - discount));
  }
}
