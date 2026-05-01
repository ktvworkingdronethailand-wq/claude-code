/**
 * KTV Working Drone Thailand — Shell Fuel Station IoT Intelligence Configuration
 *
 * 400 Shell Thailand fuel stations serviced by KTV drone vans.
 * Each van carries a Raspberry Pi sensor hub that captures operational data
 * at every station visit. Cleaning contract = distribution channel; data = product.
 *
 * Data provenance: HMAC-SHA256 → KMS RSA-4096 → S3 Object Lock (7yr GOVERNANCE).
 */

// ── Sensor Hub Hardware ────────────────────────────────────────

export const SENSOR_HUB = {
  edgeGateway: 'Raspberry Pi 4B (8 GB)',
  sensors: [
    {
      type: 'gps',
      model: 'u-blox ZED-F9P (RTK)',
      captures: ['station coordinates', 'route tracking', 'dwell time'],
    },
    {
      type: 'camera',
      model: '4K RGB + FLIR thermal',
      captures: ['before/after imagery', 'equipment thermal profile', 'structural condition'],
    },
    {
      type: 'air-quality',
      model: 'Sensirion SEN5x',
      captures: ['PM2.5', 'PM10', 'VOC', 'NOx', 'temperature', 'humidity'],
    },
    {
      type: 'weather',
      model: 'Davis Vantage Vue',
      captures: ['wind speed/direction', 'rain', 'barometric pressure', 'solar radiation'],
    },
    {
      type: 'power',
      model: 'Shelly Pro 3EM',
      captures: ['energy per circuit (kWh)', 'power factor', 'harmonics'],
    },
    {
      type: 'water',
      model: 'Seametrics iMAG',
      captures: ['flow rate (L/min)', 'total volume per clean'],
    },
    {
      type: 'chemical',
      model: 'Sensorex SAM-1',
      captures: ['pH', 'conductivity', 'chemical concentration'],
    },
    {
      type: 'telemetry',
      model: 'MAVLink protocol',
      captures: ['battery voltage', 'motor RPM', 'vibration', 'flight hours'],
    },
  ],
} as const;

// ── Data Provenance Pipeline ───────────────────────────────────

export const DATA_PROVENANCE = {
  pipeline: [
    { step: 1, action: 'Sensor capture', detail: 'Raw reading with device timestamp and GPS' },
    { step: 2, action: 'Device signing', detail: 'HMAC-SHA256 with per-device key' },
    { step: 3, action: 'Provenance record', detail: 'DataProvenance{hash, deviceId, timestamp, gps}' },
    { step: 4, action: 'Envelope encryption', detail: 'AWS KMS RSA-4096 wraps AES-256-GCM data key' },
    { step: 5, action: 'Immutable storage', detail: 'S3 Object Lock GOVERNANCE mode, 7-year retention' },
  ],
  signing: {
    algorithm: 'HMAC-SHA256',
    keyManagement: 'Per-device key, rotated quarterly',
  },
  encryption: {
    kmsAlgorithm: 'RSA-4096',
    dataKeyAlgorithm: 'AES-256-GCM',
    provider: 'AWS KMS',
  },
  storage: {
    backend: 'AWS S3',
    lockMode: 'GOVERNANCE',
    retentionYears: 7,
    auditTrail: 'Every access logged, hash chain verifiable end-to-end',
  },
} as const;

// ── 7 Value Layers ─────────────────────────────────────────────

export const SHELL_VALUE_LAYERS = [
  {
    id: 1,
    name: 'Predictive Maintenance',
    ktvDelivers: 'Equipment thermal profiles + power anomaly detection → ML failure prediction',
    shellValue: 'Prevent unplanned downtime, reduce maintenance cost 30-40%',
    sensors: ['camera', 'power'],
  },
  {
    id: 2,
    name: 'ESG & Compliance Reporting',
    ktvDelivers: 'Air quality, water, chemical, energy data → GRESB/GRI/CDP-ready reports',
    shellValue: 'Automated sustainability reporting, audit-grade evidence',
    sensors: ['air-quality', 'water', 'chemical', 'power'],
  },
  {
    id: 3,
    name: 'Proof of Service',
    ktvDelivers: 'Timestamped GPS + before/after imagery + sensor readings per visit',
    shellValue: 'Verify SLA compliance, eliminate disputes, insurance evidence',
    sensors: ['gps', 'camera', 'water', 'chemical'],
  },
  {
    id: 4,
    name: 'Asset Management',
    ktvDelivers: 'Structural imaging, thermal profiles, condition scoring',
    shellValue: 'Digital twin baseline, lifecycle cost optimization',
    sensors: ['camera'],
  },
  {
    id: 5,
    name: 'Operational Benchmarking',
    ktvDelivers: 'Cross-station energy, water, chemical consumption analytics',
    shellValue: 'Identify top/bottom performers, standardize best practices',
    sensors: ['power', 'water', 'chemical'],
  },
  {
    id: 6,
    name: 'Safety & Compliance Records',
    ktvDelivers: 'Environmental readings, equipment condition, incident data',
    shellValue: 'Regulatory audit readiness, risk reduction, liability protection',
    sensors: ['air-quality', 'weather', 'camera'],
  },
  {
    id: 7,
    name: 'Carbon Footprint (Scope 3)',
    ktvDelivers: 'Energy, water, chemical, transport data → GHG calculations',
    shellValue: 'Scope 3 supply chain emissions, carbon credit eligibility',
    sensors: ['power', 'water', 'chemical', 'gps'],
  },
] as const;

// ── Pricing Model ──────────────────────────────────────────────

export const SHELL_PRICING = {
  totalStations: 400,
  tiers: [
    {
      name: 'Base',
      pricePerStationMonth: 0,
      includes: ['Cleaning service', 'Proof-of-service photos', 'GPS logs'],
      annualRevenue: 0,
      note: 'Included in cleaning contract',
    },
    {
      name: 'Standard',
      pricePerStationMonth: 20,
      includes: [
        'Base tier',
        'Predictive maintenance alerts',
        'ESG data feeds',
        'Operational benchmarking',
      ],
      annualRevenue: 96_000,
    },
    {
      name: 'Premium',
      pricePerStationMonth: 75,
      includes: [
        'Standard tier',
        'Real-time API access',
        'Digital twin data',
        'Carbon accounting',
        'Custom analytics dashboard',
      ],
      annualRevenue: 360_000,
    },
  ],
  currency: 'USD',
} as const;

// ── Shell Thailand Contract Summary ────────────────────────────

export const SHELL_CONTRACT = {
  client: 'Shell Thailand',
  stationCount: 400,
  country: 'Thailand',
  strategy: 'Cleaning contract as distribution channel; IoT data as recurring revenue product',
  competitiveAdvantage: [
    'Physical access to every station on recurring schedule',
    'Sensor data captured as byproduct of cleaning — zero marginal cost',
    'Data provenance chain makes readings audit-grade and legally defensible',
    'No competitor has combined cleaning + IoT + data intelligence offering',
  ],
  revenueStreams: {
    cleaning: 'Primary contract revenue (per-station cleaning fee)',
    standardData: 'USD 96K/yr (400 stations × $20/mo)',
    premiumData: 'USD 360K/yr (400 stations × $75/mo)',
  },
} as const;
