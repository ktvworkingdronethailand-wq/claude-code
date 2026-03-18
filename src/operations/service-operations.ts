/**
 * KTV Working Drone Thailand - Service Operations Manager
 * Maps each of the 6 service lines to its required agent chain,
 * pricing rules, SLAs, equipment requirements, and delivery specs.
 *
 * This is the "profession-specific" layer — each service line knows
 * exactly which agents, drones, payloads, and pipelines it needs.
 */

import { AgentRole, DroneCategory, ProcessingPipeline, ServiceLine, CustomerSegment } from '../types/index.js';

// ── Service Line Configuration ─────────────────────────────

export interface ServiceLineConfig {
  id: ServiceLine;
  name: string;
  description: string;
  /** Agents required for this service, in execution order */
  agentChain: AgentRole[];
  /** Drone categories that can fulfill this service */
  requiredDroneCategories: DroneCategory[];
  /** Specific drone models preferred for this service */
  preferredModels: string[];
  /** Payloads needed for this service */
  requiredPayloads: string[];
  /** Data processing pipeline to use */
  dataPipeline: ProcessingPipeline;
  /** Deliverables the client receives */
  deliverables: string[];
  /** Pricing in THB */
  pricing: {
    unit: string;
    minPrice: number;
    maxPrice: number;
    standardRate: number;
  };
  /** SLA commitments */
  sla: {
    quoteResponseHours: number;
    siteAssessmentDays: number;
    deliveryDays: number;
    qualityGuarantee: string;
  };
  /** Target customer segments */
  targetSegments: CustomerSegment[];
  /** Seasonal considerations */
  seasonal: {
    peakMonths: number[];     // 1-12
    monsoonImpact: boolean;
    minOperatingTempC: number;
    maxOperatingTempC: number;
  };
  /** Type ratings pilots need */
  requiredTypeRatings: string[];
  /** Minimum risk assessment level needed to proceed */
  maxAcceptableRiskScore: number;
}

// ── Service Line Definitions ───────────────────────────────

export const SERVICE_CONFIGS: Record<ServiceLine, ServiceLineConfig> = {

  'facade-cleaning': {
    id: 'facade-cleaning',
    name: 'Autonomous Facade Cleaning',
    description: 'Autonomous drone-based exterior building cleaning using KTV patented technology. Tested up to 400m on Icon of the Seas.',
    agentChain: ['crm-sales', 'job-lifecycle', 'safety-compliance', 'fleet-management', 'pilot-operations', 'data-processing', 'finance-invoicing'],
    requiredDroneCategories: ['facade-cleaning', 'inspection'],
    preferredModels: ['KTV Cleaning Drone', 'DJI Matrice 30T'],
    requiredPayloads: ['Cleaning Module', 'FLIR Vue TZ20-R'],
    dataPipeline: 'photogrammetry',
    deliverables: ['before-after-report.pdf', 'inspection-photos.zip', 'cleaning-certificate.pdf'],
    pricing: {
      unit: 'sqm',
      minPrice: 45,
      maxPrice: 70,
      standardRate: 45,
    },
    sla: {
      quoteResponseHours: 24,
      siteAssessmentDays: 3,
      deliveryDays: 1,
      qualityGuarantee: 'Re-clean within 7 days if not satisfactory',
    },
    targetSegments: ['real-estate', 'construction', 'government', 'tourism'],
    seasonal: {
      peakMonths: [1, 2, 3, 11, 12], // dry season
      monsoonImpact: true,
      minOperatingTempC: 15,
      maxOperatingTempC: 45,
    },
    requiredTypeRatings: ['KTV Cleaning Drone', 'DJI Matrice 30T'],
    maxAcceptableRiskScore: 9,
  },

  'building-inspection': {
    id: 'building-inspection',
    name: 'Building & Infrastructure Inspection',
    description: 'Thermal and visual drone inspection of buildings, power lines, solar panels, and industrial infrastructure.',
    agentChain: ['crm-sales', 'job-lifecycle', 'safety-compliance', 'fleet-management', 'pilot-operations', 'data-processing', 'finance-invoicing'],
    requiredDroneCategories: ['inspection'],
    preferredModels: ['DJI Matrice 30T', 'DJI Mavic 3 Thermal'],
    requiredPayloads: ['FLIR Vue TZ20-R'],
    dataPipeline: 'thermal',
    deliverables: ['thermal-report.pdf', 'thermal-images.zip', 'defect-map.pdf', 'recommendations.pdf'],
    pricing: {
      unit: 'project',
      minPrice: 15_000,
      maxPrice: 80_000,
      standardRate: 35_000,
    },
    sla: {
      quoteResponseHours: 24,
      siteAssessmentDays: 5,
      deliveryDays: 7,
      qualityGuarantee: 'Free re-inspection if defects missed',
    },
    targetSegments: ['real-estate', 'construction', 'government', 'insurance'],
    seasonal: {
      peakMonths: [1, 2, 3, 4, 10, 11, 12],
      monsoonImpact: true,
      minOperatingTempC: 10,
      maxOperatingTempC: 45,
    },
    requiredTypeRatings: ['DJI Matrice 30T', 'DJI Mavic 3 Thermal'],
    maxAcceptableRiskScore: 12,
  },

  'agricultural-spraying': {
    id: 'agricultural-spraying',
    name: 'Precision Agricultural Spraying',
    description: 'Crop spraying, fertilizer application, and NDVI-guided precision agriculture.',
    agentChain: ['crm-sales', 'job-lifecycle', 'safety-compliance', 'fleet-management', 'pilot-operations', 'data-processing', 'finance-invoicing'],
    requiredDroneCategories: ['agricultural'],
    preferredModels: ['DJI Agras T50', 'DJI Agras T25'],
    requiredPayloads: ['Sprayer Module', 'Mavic 3 Multispectral'],
    dataPipeline: 'ndvi',
    deliverables: ['spray-report.pdf', 'ndvi-map.tif', 'coverage-log.csv', 'prescription-map.pdf'],
    pricing: {
      unit: 'rai',
      minPrice: 80,
      maxPrice: 120,
      standardRate: 100,
    },
    sla: {
      quoteResponseHours: 12,
      siteAssessmentDays: 2,
      deliveryDays: 3,
      qualityGuarantee: 'Re-spray if coverage below 95%',
    },
    targetSegments: ['small-farm', 'large-agribusiness'],
    seasonal: {
      peakMonths: [5, 6, 7, 8, 9, 10], // growing season
      monsoonImpact: true,
      minOperatingTempC: 20,
      maxOperatingTempC: 42,
    },
    requiredTypeRatings: ['DJI Agras T50', 'DJI Agras T25'],
    maxAcceptableRiskScore: 9,
  },

  'survey-mapping': {
    id: 'survey-mapping',
    name: 'Aerial Survey & Mapping',
    description: 'Photogrammetry, LiDAR scanning, orthomosaic generation, 3D modeling, and volumetric analysis.',
    agentChain: ['crm-sales', 'job-lifecycle', 'safety-compliance', 'fleet-management', 'pilot-operations', 'data-processing', 'finance-invoicing'],
    requiredDroneCategories: ['survey'],
    preferredModels: ['DJI Matrice 350 RTK', 'DJI Mavic 3 Enterprise RTK'],
    requiredPayloads: ['Zenmuse P1', 'Zenmuse L2'],
    dataPipeline: 'photogrammetry',
    deliverables: ['orthomosaic.tif', 'dsm.tif', 'point-cloud.las', '3d-model.obj', 'survey-report.pdf'],
    pricing: {
      unit: 'project',
      minPrice: 15_000,
      maxPrice: 80_000,
      standardRate: 40_000,
    },
    sla: {
      quoteResponseHours: 24,
      siteAssessmentDays: 5,
      deliveryDays: 10,
      qualityGuarantee: 'RTK accuracy within 2cm horizontal, 5cm vertical',
    },
    targetSegments: ['construction', 'government', 'large-agribusiness'],
    seasonal: {
      peakMonths: [1, 2, 3, 11, 12],
      monsoonImpact: true,
      minOperatingTempC: 10,
      maxOperatingTempC: 45,
    },
    requiredTypeRatings: ['DJI Matrice 350 RTK', 'DJI Mavic 3 Enterprise RTK'],
    maxAcceptableRiskScore: 9,
  },

  'media-production': {
    id: 'media-production',
    name: 'Aerial Media Production',
    description: 'Professional aerial photography, videography, real estate marketing, event coverage, and cinematic production.',
    agentChain: ['crm-sales', 'job-lifecycle', 'safety-compliance', 'fleet-management', 'pilot-operations', 'data-processing', 'finance-invoicing'],
    requiredDroneCategories: ['media'],
    preferredModels: ['DJI Inspire 3', 'DJI Mavic 3 Pro Cine', 'DJI Mini 4 Pro'],
    requiredPayloads: ['Zenmuse X9-8K Air'],
    dataPipeline: 'video',
    deliverables: ['edited-video.mp4', 'raw-footage.zip', 'photos-edited.zip', 'social-media-cuts.zip'],
    pricing: {
      unit: 'project',
      minPrice: 15_000,
      maxPrice: 150_000,
      standardRate: 45_000,
    },
    sla: {
      quoteResponseHours: 12,
      siteAssessmentDays: 3,
      deliveryDays: 7,
      qualityGuarantee: '1 round of revisions included',
    },
    targetSegments: ['real-estate', 'tourism', 'construction'],
    seasonal: {
      peakMonths: [1, 2, 3, 11, 12],
      monsoonImpact: true,
      minOperatingTempC: 15,
      maxOperatingTempC: 42,
    },
    requiredTypeRatings: ['DJI Inspire 3', 'DJI Mavic 3 Pro Cine'],
    maxAcceptableRiskScore: 6,
  },

  'training-academy': {
    id: 'training-academy',
    name: 'CAAT Pilot Training Academy',
    description: 'CAAT-certified drone pilot training program covering ground school, simulator, supervised flight, and emergency procedures.',
    agentChain: ['crm-sales', 'job-lifecycle', 'pilot-operations', 'safety-compliance', 'finance-invoicing'],
    requiredDroneCategories: ['media', 'survey'],
    preferredModels: ['DJI Mini 4 Pro', 'DJI Mavic 3 Enterprise RTK'],
    requiredPayloads: [],
    dataPipeline: 'video',
    deliverables: ['certificate.pdf', 'training-log.pdf', 'flight-hours-record.pdf'],
    pricing: {
      unit: 'course',
      minPrice: 25_000,
      maxPrice: 100_000,
      standardRate: 55_000,
    },
    sla: {
      quoteResponseHours: 48,
      siteAssessmentDays: 0,
      deliveryDays: 42, // 6 weeks
      qualityGuarantee: 'CAAT exam pass guarantee or free retake',
    },
    targetSegments: ['government', 'construction', 'large-agribusiness'],
    seasonal: {
      peakMonths: [1, 2, 3, 4, 5, 10, 11, 12],
      monsoonImpact: false,
      minOperatingTempC: 15,
      maxOperatingTempC: 42,
    },
    requiredTypeRatings: [],
    maxAcceptableRiskScore: 4,
  },
};

// ── Service Operations Manager ─────────────────────────────

export class ServiceOperationsManager {
  private configs: Record<ServiceLine, ServiceLineConfig>;

  constructor() {
    this.configs = SERVICE_CONFIGS;
  }

  /** Get config for a specific service line */
  getServiceConfig(serviceLine: ServiceLine): ServiceLineConfig {
    return this.configs[serviceLine];
  }

  /** Get all service lines */
  getAllServices(): ServiceLineConfig[] {
    return Object.values(this.configs);
  }

  /** Find best service for a customer segment */
  getServicesForSegment(segment: CustomerSegment): ServiceLineConfig[] {
    return this.getAllServices().filter(s => s.targetSegments.includes(segment));
  }

  /** Check if a service can operate this month */
  isInSeason(serviceLine: ServiceLine, month?: number): boolean {
    const config = this.configs[serviceLine];
    const currentMonth = month ?? (new Date().getMonth() + 1);
    return config.seasonal.peakMonths.includes(currentMonth);
  }

  /** Get required equipment for a service */
  getEquipmentRequirements(serviceLine: ServiceLine): {
    drones: string[];
    payloads: string[];
    typeRatings: string[];
    pipeline: ProcessingPipeline;
  } {
    const config = this.configs[serviceLine];
    return {
      drones: config.preferredModels,
      payloads: config.requiredPayloads,
      typeRatings: config.requiredTypeRatings,
      pipeline: config.dataPipeline,
    };
  }

  /** Calculate quote for a service */
  calculateQuote(serviceLine: ServiceLine, quantity: number, tier: 'standard' | 'professional' | 'enterprise'): {
    basePrice: number;
    discount: number;
    finalPrice: number;
    unit: string;
    currency: string;
  } {
    const config = this.configs[serviceLine];
    const basePrice = config.pricing.standardRate * quantity;
    const discountRates = { standard: 0, professional: 0.125, enterprise: 0.225 };
    const discount = Math.round(basePrice * discountRates[tier]);
    return {
      basePrice,
      discount,
      finalPrice: basePrice - discount,
      unit: config.pricing.unit,
      currency: 'THB',
    };
  }

  /** Get SLA for a service */
  getSla(serviceLine: ServiceLine): ServiceLineConfig['sla'] {
    return this.configs[serviceLine].sla;
  }

  /** Get market readiness summary */
  getMarketReadinessSummary(): {
    totalServices: number;
    inSeason: string[];
    outOfSeason: string[];
    revenueRange: { min: number; max: number };
    targetSegments: CustomerSegment[];
  } {
    const month = new Date().getMonth() + 1;
    const inSeason = this.getAllServices().filter(s => s.seasonal.peakMonths.includes(month));
    const outOfSeason = this.getAllServices().filter(s => !s.seasonal.peakMonths.includes(month));
    const allSegments = new Set<CustomerSegment>();
    this.getAllServices().forEach(s => s.targetSegments.forEach(seg => allSegments.add(seg)));

    return {
      totalServices: 6,
      inSeason: inSeason.map(s => s.name),
      outOfSeason: outOfSeason.map(s => s.name),
      revenueRange: {
        min: Math.min(...this.getAllServices().map(s => s.pricing.minPrice)),
        max: Math.max(...this.getAllServices().map(s => s.pricing.maxPrice)),
      },
      targetSegments: Array.from(allSegments),
    };
  }
}
