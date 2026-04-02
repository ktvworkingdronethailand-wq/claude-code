/**
 * KTV Working Drone Thailand - Operations Configuration
 * Central configuration for the drone operations platform
 */

/** Company information */
export const COMPANY = {
  name: 'KTV Working Drone Thailand Co., Ltd.',
  parentCompany: 'KTV Group',
  parentFounder: 'Kennet Nilsen',
  parentFounded: 1992,
  parentCountry: 'Norway',
  franchiseCountries: 66,
  hqCity: 'Bangkok',
  hqCountry: 'Thailand',
} as const;

/** Service lines with pricing in THB */
export const SERVICE_LINES = {
  'facade-cleaning': {
    name: 'Facade Cleaning',
    pricingUnit: 'sqm',
    basePriceThb: 45,
    premiumPriceThb: 70,
    ebitdaMargin: 0.876,
  },
  'building-inspection': {
    name: 'Building Inspection',
    pricingUnit: 'project',
    basePriceThb: 15_000,
    premiumPriceThb: 80_000,
    ebitdaMargin: 0.75,
  },
  'agricultural-spraying': {
    name: 'Agricultural Spraying',
    pricingUnit: 'rai',
    basePriceThb: 80,
    premiumPriceThb: 120,
    ebitdaMargin: 0.65,
  },
  'survey-mapping': {
    name: 'Aerial Survey & Mapping',
    pricingUnit: 'project',
    basePriceThb: 15_000,
    premiumPriceThb: 80_000,
    ebitdaMargin: 0.70,
  },
  'media-production': {
    name: 'Media Production',
    pricingUnit: 'project',
    basePriceThb: 15_000,
    premiumPriceThb: 150_000,
    ebitdaMargin: 0.80,
  },
  'training-academy': {
    name: 'CAAT Pilot Training',
    pricingUnit: 'course',
    basePriceThb: 25_000,
    premiumPriceThb: 100_000,
    ebitdaMargin: 0.85,
  },
} as const;

/** CAAT Thailand regulatory requirements */
export const CAAT_REGULATIONS = {
  maxAltitudeMeters: 90,
  airportBufferKm: 9,
  minInsuranceThb: 1_000_000,
  registrationRequiredAboveGrams: 250,
  pilotLicenseRequired: true,
  uaocRequired: true, // Unmanned Aircraft Operating Certificate
} as const;

/** Financial rules */
export const FINANCIAL_CONFIG = {
  vatPercent: 7,
  royaltyPercent: 7,       // To KTV Group
  corporateTaxPercent: 20,  // Thai corporate tax
  monsoonCapacityReduction: 0.0833, // 8.33% over 4 months
  baseCurrencyCode: 'THB' as const,
  paymentTermsDays: 30,
  investmentThb: 51_652_500,
  investmentUsd: 1_455_000,
} as const;

/** Fleet configuration */
export const FLEET_CONFIG = {
  agricultural: {
    primary: { model: 'DJI Agras T50', startupQty: 4, scaledQty: 12 },
    secondary: { model: 'DJI Agras T25', startupQty: 2, scaledQty: 4 },
  },
  survey: {
    primary: { model: 'DJI Matrice 350 RTK', startupQty: 2, scaledQty: 5 },
    secondary: { model: 'DJI Mavic 3 Enterprise RTK', startupQty: 2, scaledQty: 4 },
  },
  inspection: {
    primary: { model: 'DJI Matrice 30T', startupQty: 2, scaledQty: 4 },
    secondary: { model: 'DJI Mavic 3 Thermal', startupQty: 1, scaledQty: 2 },
  },
  media: {
    premium: { model: 'DJI Inspire 3', qty: 1 },
    versatile: { model: 'DJI Mavic 3 Pro Cine', qty: 1 },
    lightweight: { model: 'DJI Mini 4 Pro', qty: 1 },
  },
} as const;

/** Growth targets */
export const GROWTH_TARGETS = {
  year1: { revenueThb: 180_180_000, clients: 120, phase: 'Local market establishment' },
  year2: { revenueThb: 300_299_985, clients: 400, phase: 'Regional expansion' },
  year3: { revenueThb: 600_600_015, clients: 1200, phase: 'National coverage' },
} as const;

/** Bangkok target market */
export const TARGET_MARKET = {
  buildingsOver90m: 400,
  cleaningCyclesPerYear: 4, // quarterly due to tropical climate
  primarySegments: ['condominiums', 'office-towers', 'hotels', 'shopping-malls'],
  secondarySegments: ['industrial', 'government', 'temples'],
} as const;
