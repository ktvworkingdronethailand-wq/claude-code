/**
 * KTV Working Drone Thailand - Supply Chain Manager
 * Spare parts inventory, reorder triggers, vendor management,
 * and chemical procurement tracking
 *
 * Connects: Fleet Management + Safety + Finance
 */

// ── Types ──────────────────────────────────────────────────

export type PartCategory = 'propeller' | 'battery' | 'motor' | 'esc' | 'gimbal' | 'landing-gear' | 'spray-nozzle' | 'filter' | 'cable' | 'other';
export type VendorStatus = 'approved' | 'probation' | 'suspended' | 'new';
export type PurchaseOrderStatus = 'draft' | 'submitted' | 'confirmed' | 'shipped' | 'received' | 'cancelled';

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  category: PartCategory;
  compatibleModels: string[];
  currentStock: number;
  minimumStock: number;
  reorderPoint: number; // 30% of minimum stock
  unitCostThb: number;
  leadTimeDays: number;
  vendorId: string;
  location: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  categories: PartCategory[];
  status: VendorStatus;
  performanceScore: number; // 0-100
  lastReviewDate: Date;
  paymentTermsDays: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  items: { partId: string; quantity: number; unitCost: number; totalCost: number }[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  createdAt: Date;
  expectedDelivery?: Date;
  receivedAt?: Date;
}

export interface ChemicalStock {
  id: string;
  name: string;
  type: 'herbicide' | 'pesticide' | 'fertilizer' | 'cleaning-agent';
  currentLiters: number;
  minimumLiters: number;
  msdsAvailable: boolean;
  storageLocation: string;
  expiryDate: Date;
  vendorId: string;
}

export interface ReorderAlert {
  partId: string;
  partName: string;
  currentStock: number;
  minimumStock: number;
  suggestedOrder: number;
  estimatedCost: number;
  urgency: 'low' | 'medium' | 'critical';
}

// ── Supply Chain Manager ───────────────────────────────────

export class SupplyChainManager {
  private parts: Map<string, SparePart> = new Map();
  private vendors: Map<string, Vendor> = new Map();
  private orders: Map<string, PurchaseOrder> = new Map();
  private chemicals: Map<string, ChemicalStock> = new Map();

  constructor() {
    this.initializeDefaultInventory();
  }

  // ── Inventory Management ─────────────────────────────────

  addPart(data: Omit<SparePart, 'id' | 'reorderPoint'>): SparePart {
    const id = `PART-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const part: SparePart = {
      ...data,
      id,
      reorderPoint: Math.ceil(data.minimumStock * 0.3),
    };
    this.parts.set(id, part);
    return part;
  }

  updateStock(partId: string, quantityChange: number): boolean {
    const part = this.parts.get(partId);
    if (!part) return false;
    part.currentStock += quantityChange;
    if (part.currentStock < 0) part.currentStock = 0;
    return true;
  }

  getReorderAlerts(): ReorderAlert[] {
    const alerts: ReorderAlert[] = [];
    for (const part of this.parts.values()) {
      if (part.currentStock <= part.reorderPoint) {
        const suggestedOrder = part.minimumStock * 2 - part.currentStock;
        alerts.push({
          partId: part.id,
          partName: part.name,
          currentStock: part.currentStock,
          minimumStock: part.minimumStock,
          suggestedOrder,
          estimatedCost: suggestedOrder * part.unitCostThb,
          urgency: part.currentStock === 0 ? 'critical'
            : part.currentStock <= part.reorderPoint / 2 ? 'medium'
            : 'low',
        });
      }
    }
    return alerts.sort((a, b) => {
      const urgencyOrder = { critical: 0, medium: 1, low: 2 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
  }

  // ── Vendor Management ────────────────────────────────────

  addVendor(data: Omit<Vendor, 'id'>): Vendor {
    const id = `VENDOR-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const vendor: Vendor = { ...data, id };
    this.vendors.set(id, vendor);
    return vendor;
  }

  getApprovedVendors(category?: PartCategory): Vendor[] {
    return Array.from(this.vendors.values()).filter(v => {
      if (v.status !== 'approved') return false;
      if (category && !v.categories.includes(category)) return false;
      return true;
    });
  }

  updateVendorScore(vendorId: string, score: number): boolean {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return false;
    vendor.performanceScore = Math.max(0, Math.min(100, score));
    vendor.lastReviewDate = new Date();
    if (vendor.performanceScore < 50) vendor.status = 'probation';
    return true;
  }

  // ── Purchase Orders ──────────────────────────────────────

  createPurchaseOrder(vendorId: string, items: { partId: string; quantity: number }[]): PurchaseOrder | null {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return null;

    const id = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const lineItems = items.map(item => {
      const part = this.parts.get(item.partId);
      const unitCost = part?.unitCostThb ?? 0;
      return {
        partId: item.partId,
        quantity: item.quantity,
        unitCost,
        totalCost: unitCost * item.quantity,
      };
    });

    const order: PurchaseOrder = {
      id,
      vendorId,
      items: lineItems,
      totalAmount: lineItems.reduce((sum, i) => sum + i.totalCost, 0),
      status: 'draft',
      createdAt: new Date(),
    };

    this.orders.set(id, order);
    return order;
  }

  receivePurchaseOrder(orderId: string): boolean {
    const order = this.orders.get(orderId);
    if (!order) return false;
    order.status = 'received';
    order.receivedAt = new Date();

    // Update stock levels
    for (const item of order.items) {
      this.updateStock(item.partId, item.quantity);
    }
    return true;
  }

  // ── Chemical Management ──────────────────────────────────

  addChemical(data: Omit<ChemicalStock, 'id'>): ChemicalStock {
    const id = `CHEM-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const chem: ChemicalStock = { ...data, id };
    this.chemicals.set(id, chem);
    return chem;
  }

  getExpiredChemicals(): ChemicalStock[] {
    const now = new Date();
    return Array.from(this.chemicals.values()).filter(c => c.expiryDate < now);
  }

  getLowChemicals(): ChemicalStock[] {
    return Array.from(this.chemicals.values()).filter(
      c => c.currentLiters <= c.minimumLiters,
    );
  }

  // ── Summary ──────────────────────────────────────────────

  getInventorySummary(): {
    totalParts: number;
    totalValue: number;
    reorderAlerts: number;
    criticalAlerts: number;
    vendors: number;
    approvedVendors: number;
    pendingOrders: number;
    chemicals: number;
    expiredChemicals: number;
  } {
    const parts = Array.from(this.parts.values());
    const alerts = this.getReorderAlerts();

    return {
      totalParts: parts.length,
      totalValue: parts.reduce((sum, p) => sum + p.currentStock * p.unitCostThb, 0),
      reorderAlerts: alerts.length,
      criticalAlerts: alerts.filter(a => a.urgency === 'critical').length,
      vendors: this.vendors.size,
      approvedVendors: this.getApprovedVendors().length,
      pendingOrders: Array.from(this.orders.values()).filter(o => o.status !== 'received' && o.status !== 'cancelled').length,
      chemicals: this.chemicals.size,
      expiredChemicals: this.getExpiredChemicals().length,
    };
  }

  // ── Default Inventory ────────────────────────────────────

  private initializeDefaultInventory(): void {
    const defaultParts: Omit<SparePart, 'id' | 'reorderPoint'>[] = [
      { name: 'Agras T50 Propeller Set', partNumber: 'AGR-PROP-T50', category: 'propeller', compatibleModels: ['DJI Agras T50'], currentStock: 12, minimumStock: 8, unitCostThb: 2_500, leadTimeDays: 7, vendorId: 'VENDOR-DJI', location: 'Bangkok HQ' },
      { name: 'Agras T25 Propeller Set', partNumber: 'AGR-PROP-T25', category: 'propeller', compatibleModels: ['DJI Agras T25'], currentStock: 8, minimumStock: 6, unitCostThb: 2_000, leadTimeDays: 7, vendorId: 'VENDOR-DJI', location: 'Bangkok HQ' },
      { name: 'Matrice 350 Propeller Pair', partNumber: 'MAT-PROP-350', category: 'propeller', compatibleModels: ['DJI Matrice 350 RTK'], currentStock: 6, minimumStock: 4, unitCostThb: 3_200, leadTimeDays: 10, vendorId: 'VENDOR-DJI', location: 'Bangkok HQ' },
      { name: 'TB65 Intelligent Battery', partNumber: 'BAT-TB65', category: 'battery', compatibleModels: ['DJI Matrice 350 RTK'], currentStock: 4, minimumStock: 4, unitCostThb: 28_000, leadTimeDays: 14, vendorId: 'VENDOR-DJI', location: 'Bangkok HQ' },
      { name: 'Agras T50 Battery', partNumber: 'BAT-AGR-T50', category: 'battery', compatibleModels: ['DJI Agras T50'], currentStock: 8, minimumStock: 6, unitCostThb: 18_000, leadTimeDays: 14, vendorId: 'VENDOR-DJI', location: 'Bangkok HQ' },
      { name: 'Spray Nozzle Assembly', partNumber: 'SPRAY-NOZZLE-01', category: 'spray-nozzle', compatibleModels: ['DJI Agras T50', 'DJI Agras T25'], currentStock: 10, minimumStock: 6, unitCostThb: 1_500, leadTimeDays: 5, vendorId: 'VENDOR-DJI', location: 'Bangkok HQ' },
      { name: 'Landing Gear Set M30T', partNumber: 'LG-M30T', category: 'landing-gear', compatibleModels: ['DJI Matrice 30T'], currentStock: 3, minimumStock: 2, unitCostThb: 4_500, leadTimeDays: 10, vendorId: 'VENDOR-DJI', location: 'Bangkok HQ' },
      { name: 'ND Filter Set Inspire 3', partNumber: 'FILT-INS3', category: 'filter', compatibleModels: ['DJI Inspire 3'], currentStock: 2, minimumStock: 2, unitCostThb: 8_500, leadTimeDays: 14, vendorId: 'VENDOR-DJI', location: 'Bangkok HQ' },
    ];

    for (const partData of defaultParts) {
      this.addPart(partData);
    }
  }
}
