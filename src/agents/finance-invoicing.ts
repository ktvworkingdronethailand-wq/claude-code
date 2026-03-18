/**
 * KTV Working Drone Thailand - Finance & Invoicing Agent
 * Invoice management, revenue tracking, financial reporting
 * Enforces 7% KTV Group royalty and 20% Thai corporate tax
 */

import { KtvAgent } from './base-agent.js';
import {
  AgentMessage,
  FinancialSummary,
  Invoice,
  InvoiceLineItem,
  InvoiceStatus,
} from '../types/index.js';

/** KTV business financial constants */
const FINANCIAL_RULES = {
  vatPercent: 7,           // Thai VAT
  royaltyPercent: 7,       // KTV Group franchise royalty on gross revenue
  corporateTaxPercent: 20, // Thai corporate tax on EBIT
  paymentTermsDays: 30,
  currencyDefault: 'THB' as const,
} as const;

export class FinanceInvoicingAgent extends KtvAgent {
  private invoices: Map<string, Invoice> = new Map();

  constructor() {
    super({
      role: 'finance-invoicing',
      name: 'KTV Finance & Invoicing',
      description: 'Invoicing, revenue tracking, and financial reporting for KTV Working Drone Thailand',
      dependencies: ['job-lifecycle', 'crm-sales'],
      pollIntervalMs: 60_000,
    });
  }

  protected async onStart(): Promise<void> {
    this.log('Finance & Invoicing system initialized');
    this.log(`Financial rules: VAT ${FINANCIAL_RULES.vatPercent}%, Royalty ${FINANCIAL_RULES.royaltyPercent}%, Tax ${FINANCIAL_RULES.corporateTaxPercent}%`);
  }

  protected async onStop(): Promise<void> {
    this.log('Finance & Invoicing system shutting down');
  }

  protected async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const { action } = message.payload as { action: string };

    switch (action) {
      case 'create-invoice':
        return this.createResponse(message, {
          invoice: this.createInvoice(
            message.payload.jobId as string,
            message.payload.clientId as string,
            message.payload.lineItems as InvoiceLineItem[],
          ),
        });

      case 'update-invoice-status':
        return this.createResponse(message, {
          success: this.updateInvoiceStatus(
            message.payload.invoiceId as string,
            message.payload.status as InvoiceStatus,
          ),
        });

      case 'get-invoice':
        return this.createResponse(message, {
          invoice: this.invoices.get(message.payload.invoiceId as string) ?? null,
        });

      case 'get-financial-summary':
        return this.createResponse(message, {
          summary: this.getFinancialSummary(message.payload.period as string),
        });

      case 'get-overdue-invoices':
        return this.createResponse(message, {
          invoices: this.getOverdueInvoices(),
        });

      case 'get-revenue-by-service':
        return this.createResponse(message, {
          revenue: this.getRevenueByService(),
        });

      default:
        return this.createResponse(message, { error: `Unknown action: ${action}` });
    }
  }

  // ── Invoice Management ───────────────────────────────────

  createInvoice(jobId: string, clientId: string, lineItems: InvoiceLineItem[]): Invoice {
    const id = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const vatAmount = Math.round(subtotal * FINANCIAL_RULES.vatPercent / 100);
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + FINANCIAL_RULES.paymentTermsDays);

    const invoice: Invoice = {
      id,
      jobId,
      clientId,
      lineItems,
      subtotal,
      vatPercent: FINANCIAL_RULES.vatPercent,
      vatAmount,
      total: subtotal + vatAmount,
      currency: FINANCIAL_RULES.currencyDefault,
      status: 'draft',
      issuedAt: now,
      dueDate,
    };

    this.invoices.set(id, invoice);
    this.log(`Invoice ${id} created: ${invoice.total} THB for job ${jobId}`);
    return invoice;
  }

  updateInvoiceStatus(invoiceId: string, status: InvoiceStatus): boolean {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) return false;
    invoice.status = status;
    if (status === 'paid') {
      invoice.paidAt = new Date();
    }
    this.log(`Invoice ${invoiceId}: status -> ${status}`);
    return true;
  }

  getOverdueInvoices(): Invoice[] {
    const now = new Date();
    return Array.from(this.invoices.values()).filter(
      inv => inv.status === 'sent' && inv.dueDate < now,
    );
  }

  // ── Financial Reporting ──────────────────────────────────

  getFinancialSummary(period: string): FinancialSummary {
    const paidInvoices = Array.from(this.invoices.values()).filter(
      inv => inv.status === 'paid',
    );

    const grossRevenue = paidInvoices.reduce((sum, inv) => sum + inv.subtotal, 0);
    const operatingCosts = Math.round(grossRevenue * 0.10); // ~10% operating cost estimate
    const royaltyPayment = Math.round(grossRevenue * FINANCIAL_RULES.royaltyPercent / 100);
    const ebitda = grossRevenue - operatingCosts - royaltyPayment;
    const corporateTax = Math.round(ebitda * FINANCIAL_RULES.corporateTaxPercent / 100);
    const netIncome = ebitda - corporateTax;

    return {
      period,
      grossRevenue,
      operatingCosts,
      royaltyPayment,
      ebitda,
      ebitdaMargin: grossRevenue > 0 ? ebitda / grossRevenue : 0,
      corporateTax,
      netIncome,
      netMargin: grossRevenue > 0 ? netIncome / grossRevenue : 0,
      currency: 'THB',
    };
  }

  getRevenueByService(): Record<string, number> {
    // Group paid invoices by their job service line (simplified)
    const revenue: Record<string, number> = {};
    for (const inv of this.invoices.values()) {
      if (inv.status === 'paid') {
        const key = inv.jobId; // In production, would resolve to service line
        revenue[key] = (revenue[key] ?? 0) + inv.subtotal;
      }
    }
    return revenue;
  }
}
