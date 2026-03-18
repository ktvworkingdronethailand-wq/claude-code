/**
 * KTV Working Drone Thailand - Client Onboarding System
 * Automated onboarding checklists per customer segment.
 * Ensures every new client goes through the right setup process.
 *
 * Connects: CRM & Sales + Job Lifecycle + Finance + Safety
 */

import { Client, CustomerSegment, PricingTier, ServiceLine } from '../types/index.js';

// ── Onboarding Types ───────────────────────────────────────

export type ChecklistItemStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';

export interface OnboardingChecklist {
  id: string;
  clientId: string;
  segment: CustomerSegment;
  items: ChecklistItem[];
  startedAt: Date;
  completedAt?: Date;
  completionPercent: number;
  assignedTo: string;
}

export interface ChecklistItem {
  id: string;
  category: 'legal' | 'technical' | 'commercial' | 'operational' | 'safety';
  name: string;
  description: string;
  required: boolean;
  status: ChecklistItemStatus;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
}

// ── Segment-Specific Templates ─────────────────────────────

const BASE_ITEMS: Omit<ChecklistItem, 'id'>[] = [
  { category: 'legal', name: 'Service agreement signed', description: 'Execute master service agreement with terms and SLAs', required: true, status: 'pending' },
  { category: 'legal', name: 'Insurance verification', description: 'Verify KTV liability insurance covers client premises', required: true, status: 'pending' },
  { category: 'commercial', name: 'Billing details confirmed', description: 'Company name, tax ID, billing address, payment terms', required: true, status: 'pending' },
  { category: 'commercial', name: 'Pricing tier agreed', description: 'Confirm Standard/Professional/Enterprise pricing tier', required: true, status: 'pending' },
  { category: 'operational', name: 'Primary contact designated', description: 'Name, phone, email, LINE ID of primary contact person', required: true, status: 'pending' },
  { category: 'operational', name: 'Emergency contacts exchanged', description: 'Both parties exchange emergency contact information', required: true, status: 'pending' },
  { category: 'technical', name: 'Client portal account created', description: 'Create secure login for deliverable access and tracking', required: true, status: 'pending' },
  { category: 'operational', name: 'Service schedule agreed', description: 'Confirm initial service dates and recurring schedule', required: true, status: 'pending' },
];

const SEGMENT_EXTRAS: Partial<Record<CustomerSegment, Omit<ChecklistItem, 'id'>[]>> = {
  'real-estate': [
    { category: 'operational', name: 'Building access protocol', description: 'Roof access, elevator arrangements, tenant notification procedures', required: true, status: 'pending' },
    { category: 'safety', name: 'Building management approval', description: 'Written approval from building management for drone operations', required: true, status: 'pending' },
    { category: 'safety', name: 'Airspace check', description: 'Verify building is not in restricted airspace near airports', required: true, status: 'pending' },
  ],
  'construction': [
    { category: 'safety', name: 'Construction site safety briefing', description: 'Complete site safety induction and hazard awareness', required: true, status: 'pending' },
    { category: 'operational', name: 'Survey control points', description: 'Establish or receive GCP coordinates for survey accuracy', required: true, status: 'pending' },
    { category: 'technical', name: 'Coordinate system alignment', description: 'Agree on datum, projection, and coordinate system', required: true, status: 'pending' },
  ],
  'small-farm': [
    { category: 'operational', name: 'Field boundaries mapped', description: 'GPS boundaries of all fields to be serviced', required: true, status: 'pending' },
    { category: 'safety', name: 'Chemical handling protocol', description: 'Agree on chemical storage, mixing, and disposal procedures', required: true, status: 'pending' },
    { category: 'legal', name: 'Chemical application license', description: 'Verify required licenses for agricultural chemical application', required: true, status: 'pending' },
  ],
  'large-agribusiness': [
    { category: 'operational', name: 'Field boundaries mapped', description: 'GPS boundaries of all fields to be serviced', required: true, status: 'pending' },
    { category: 'safety', name: 'Chemical handling protocol', description: 'Agree on chemical storage, mixing, and disposal procedures', required: true, status: 'pending' },
    { category: 'legal', name: 'Chemical application license', description: 'Verify required licenses for agricultural chemical application', required: true, status: 'pending' },
    { category: 'commercial', name: 'Cooperative pricing structure', description: 'Agree on bulk/cooperative discount terms', required: false, status: 'pending' },
    { category: 'technical', name: 'ERP integration', description: 'Connect to client farm management system if applicable', required: false, status: 'pending' },
  ],
  'government': [
    { category: 'legal', name: 'Procurement compliance', description: 'Ensure compliance with government procurement regulations', required: true, status: 'pending' },
    { category: 'legal', name: 'Security clearance', description: 'Obtain security clearance for sensitive government sites', required: true, status: 'pending' },
    { category: 'operational', name: 'CAAT special permit', description: 'File for special operations permit if in restricted zones', required: true, status: 'pending' },
  ],
  'insurance': [
    { category: 'legal', name: 'Claims documentation SOP', description: 'Agree on documentation standards for insurance claims', required: true, status: 'pending' },
    { category: 'technical', name: 'Report template approval', description: 'Client approves report format and contents', required: true, status: 'pending' },
    { category: 'operational', name: 'Rapid response SLA', description: 'Agree on response time for emergency damage assessment', required: true, status: 'pending' },
  ],
  'tourism': [
    { category: 'operational', name: 'Guest notification plan', description: 'Plan for notifying resort guests during drone operations', required: true, status: 'pending' },
    { category: 'safety', name: 'No-fly zones mapped', description: 'Map pool areas, beaches, and guest zones as no-fly', required: true, status: 'pending' },
  ],
};

// ── Client Onboarding Manager ──────────────────────────────

export class ClientOnboardingManager {
  private checklists: Map<string, OnboardingChecklist> = new Map();

  /**
   * Create a segment-specific onboarding checklist for a new client
   */
  createChecklist(clientId: string, segment: CustomerSegment, assignedTo: string): OnboardingChecklist {
    const id = `ONB-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    let itemCounter = 0;

    const items: ChecklistItem[] = [
      ...BASE_ITEMS.map(item => ({ ...item, id: `${id}-${++itemCounter}` })),
      ...(SEGMENT_EXTRAS[segment] ?? []).map(item => ({ ...item, id: `${id}-${++itemCounter}` })),
    ];

    const checklist: OnboardingChecklist = {
      id,
      clientId,
      segment,
      items,
      startedAt: new Date(),
      completionPercent: 0,
      assignedTo,
    };

    this.checklists.set(id, checklist);
    return checklist;
  }

  /**
   * Complete a checklist item
   */
  completeItem(checklistId: string, itemId: string, completedBy: string, notes?: string): boolean {
    const checklist = this.checklists.get(checklistId);
    if (!checklist) return false;

    const item = checklist.items.find(i => i.id === itemId);
    if (!item) return false;

    item.status = 'completed';
    item.completedAt = new Date();
    item.completedBy = completedBy;
    if (notes) item.notes = notes;

    // Recalculate completion percent
    const completed = checklist.items.filter(i => i.status === 'completed').length;
    checklist.completionPercent = Math.round((completed / checklist.items.length) * 100);

    if (checklist.completionPercent === 100) {
      checklist.completedAt = new Date();
    }

    return true;
  }

  /**
   * Get onboarding status
   */
  getChecklist(checklistId: string): OnboardingChecklist | undefined {
    return this.checklists.get(checklistId);
  }

  /**
   * Get all incomplete onboardings
   */
  getIncomplete(): OnboardingChecklist[] {
    return Array.from(this.checklists.values()).filter(c => !c.completedAt);
  }

  /**
   * Get onboarding summary
   */
  getSummary(): {
    total: number;
    completed: number;
    inProgress: number;
    avgCompletionPercent: number;
    bySegment: Record<string, number>;
  } {
    const all = Array.from(this.checklists.values());
    const completed = all.filter(c => c.completedAt);
    const bySegment: Record<string, number> = {};
    for (const c of all) {
      bySegment[c.segment] = (bySegment[c.segment] ?? 0) + 1;
    }
    return {
      total: all.length,
      completed: completed.length,
      inProgress: all.length - completed.length,
      avgCompletionPercent: all.length > 0
        ? Math.round(all.reduce((sum, c) => sum + c.completionPercent, 0) / all.length)
        : 0,
      bySegment,
    };
  }
}
