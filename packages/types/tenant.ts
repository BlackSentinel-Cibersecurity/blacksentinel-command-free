// ============================================================================
// BlackSentinel Command - Tenant Types
// Multi-tenant type definitions for enterprise deployment
// ============================================================================

export type TenantTier = 'starter' | 'professional' | 'enterprise' | 'government';

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'expired' | 'pending';

export type TenantIsolation = 'shared' | 'dedicated' | 'isolated';

export type BillingCycle = 'monthly' | 'annual' | 'custom';

export type DeploymentMode = 'cloud' | 'on-premise' | 'hybrid' | 'air-gapped';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  tier: TenantTier;
  isolation: TenantIsolation;
  
  // Configuration
  config: TenantConfig;
  
  // Limits
  limits: TenantLimits;
  
  // Billing
  billing: TenantBilling;
  
  // Branding
  branding: TenantBranding;
  
  // Security
  security: TenantSecurity;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface TenantConfig {
  // Features
  features: TenantFeatures;
  
  // Integrations
  integrations: TenantIntegrations;
  
  // Retention
  dataRetentionDays: number;
  logRetentionDays: number;
  
  // Limits
  maxUsers: number;
  maxAssets: number;
  maxAlertsPerDay: number;
  maxApiCallsPerMinute: number;
}

export interface TenantFeatures {
  // Core
  soc: boolean;
  incidentResponse: boolean;
  threatIntelligence: boolean;
  vulnerabilityManagement: boolean;
  
  // Advanced
  aiCommand: boolean;
  automation: boolean;
  digitalTwin: boolean;
  graphAnalytics: boolean;
  
  // Compliance
  complianceFrameworks: string[];
  auditLogging: boolean;
  sessionRecording: boolean;
  
  // Analytics
  advancedAnalytics: boolean;
  customDashboards: boolean;
  exportReports: boolean;
  
  // API
  apiAccess: boolean;
  webhooks: boolean;
  customIntegrations: boolean;
  
  // Support
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
  onSiteTraining: boolean;
}

export interface TenantIntegrations {
  siem: string[];
  edr: string[];
  firewalls: string[];
  identity: string[];
  cloud: string[];
  ticketing: string[];
}

export interface TenantLimits {
  // Users
  maxUsers: number;
  currentUsers: number;
  
  // Assets
  maxAssets: number;
  currentAssets: number;
  
  // Storage
  maxStorageGB: number;
  currentStorageGB: number;
  
  // API
  apiRateLimit: number;
  apiCallsUsed: number;
  
  // Alerts
  maxAlertsPerDay: number;
  alertsToday: number;
  
  // Retention
  dataRetentionDays: number;
}

export interface TenantBilling {
  // Plan
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  
  // Pricing
  basePrice: number;
  pricePerUser: number;
  pricePerAsset: number;
  totalMonthly: number;
  
  // Usage
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  
  // Payment
  paymentMethod?: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  
  // Credits
  credits: number;
  
  // Invoice
  invoiceEmail: string;
  taxId?: string;
}

export interface TenantBranding {
  // Logo
  logoUrl?: string;
  faviconUrl?: string;
  
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Custom CSS
  customCss?: string;
  
  // Domain
  customDomain?: string;
  subdomain: string;
  
  // Name
  displayName: string;
  companyName: string;
  
  // Legal
  legalEntity?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}

export interface TenantSecurity {
  // Authentication
  authMethod: 'password' | 'sso' | 'saml' | 'oidc' | 'mfa';
  mfaRequired: boolean;
  
  // Session
  sessionTimeout: number;
  maxConcurrentSessions: number;
  
  // IP
  ipWhitelist?: string[];
  ipBlacklist?: string[];
  
  // Data
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
  
  // Audit
  auditLogRetentionDays: number;
  sessionRecording: boolean;
  
  // Compliance
  complianceFrameworks: string[];
  dataResidency?: string;
}

// ============================================================================
// Pricing Tiers
// ============================================================================

export interface PricingTier {
  id: TenantTier;
  name: string;
  description: string;
  
  // Pricing
  basePrice: number;
  pricePerUser: number;
  pricePerAsset: number;
  minUsers: number;
  maxUsers: number;
  
  // Features included
  features: TenantFeatures;
  
  // Limits
  limits: Omit<TenantLimits, 'currentUsers' | 'currentAssets' | 'currentStorageGB' | 'apiCallsUsed' | 'alertsToday'>;
  
  // Support
  supportLevel: 'basic' | 'standard' | 'premium' | 'enterprise';
  slaUptime: number;
}

export const PRICING_TIERS: Record<TenantTier, PricingTier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'For small security teams (1-10 users)',
    basePrice: 499,
    pricePerUser: 49,
    pricePerAsset: 0.10,
    minUsers: 1,
    maxUsers: 10,
    features: {
      soc: true,
      incidentResponse: true,
      threatIntelligence: true,
      vulnerabilityManagement: true,
      aiCommand: false,
      automation: false,
      digitalTwin: false,
      graphAnalytics: false,
      complianceFrameworks: ['soc2'],
      auditLogging: true,
      sessionRecording: false,
      advancedAnalytics: false,
      customDashboards: false,
      exportReports: true,
      apiAccess: true,
      webhooks: false,
      customIntegrations: false,
      prioritySupport: false,
      dedicatedAccountManager: false,
      onSiteTraining: false,
    },
    limits: {
      maxUsers: 10,
      maxAssets: 500,
      maxStorageGB: 50,
      apiRateLimit: 100,
      maxAlertsPerDay: 1000,
      dataRetentionDays: 90,
    },
    supportLevel: 'basic',
    slaUptime: 99.5,
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'For growing security teams (11-50 users)',
    basePrice: 1999,
    pricePerUser: 39,
    pricePerAsset: 0.08,
    minUsers: 11,
    maxUsers: 50,
    features: {
      soc: true,
      incidentResponse: true,
      threatIntelligence: true,
      vulnerabilityManagement: true,
      aiCommand: true,
      automation: true,
      digitalTwin: false,
      graphAnalytics: true,
      complianceFrameworks: ['soc2', 'iso27001', 'gdpr'],
      auditLogging: true,
      sessionRecording: true,
      advancedAnalytics: true,
      customDashboards: true,
      exportReports: true,
      apiAccess: true,
      webhooks: true,
      customIntegrations: false,
      prioritySupport: true,
      dedicatedAccountManager: false,
      onSiteTraining: false,
    },
    limits: {
      maxUsers: 50,
      maxAssets: 5000,
      maxStorageGB: 500,
      apiRateLimit: 500,
      maxAlertsPerDay: 10000,
      dataRetentionDays: 180,
    },
    supportLevel: 'standard',
    slaUptime: 99.9,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large security organizations (51-500 users)',
    basePrice: 9999,
    pricePerUser: 29,
    pricePerAsset: 0.05,
    minUsers: 51,
    maxUsers: 500,
    features: {
      soc: true,
      incidentResponse: true,
      threatIntelligence: true,
      vulnerabilityManagement: true,
      aiCommand: true,
      automation: true,
      digitalTwin: true,
      graphAnalytics: true,
      complianceFrameworks: ['soc2', 'iso27001', 'gdpr', 'hipaa', 'pci-dss', 'fedramp'],
      auditLogging: true,
      sessionRecording: true,
      advancedAnalytics: true,
      customDashboards: true,
      exportReports: true,
      apiAccess: true,
      webhooks: true,
      customIntegrations: true,
      prioritySupport: true,
      dedicatedAccountManager: true,
      onSiteTraining: true,
    },
    limits: {
      maxUsers: 500,
      maxAssets: 50000,
      maxStorageGB: 5000,
      apiRateLimit: 2000,
      maxAlertsPerDay: 100000,
      dataRetentionDays: 365,
    },
    supportLevel: 'premium',
    slaUptime: 99.99,
  },
  government: {
    id: 'government',
    name: 'Government & Defense',
    description: 'For government agencies and defense contractors',
    basePrice: 49999,
    pricePerUser: 99,
    pricePerAsset: 0.02,
    minUsers: 100,
    maxUsers: 10000,
    features: {
      soc: true,
      incidentResponse: true,
      threatIntelligence: true,
      vulnerabilityManagement: true,
      aiCommand: true,
      automation: true,
      digitalTwin: true,
      graphAnalytics: true,
      complianceFrameworks: ['soc2', 'iso27001', 'gdpr', 'hipaa', 'pci-dss', 'fedramp', 'nist', 'cmmc'],
      auditLogging: true,
      sessionRecording: true,
      advancedAnalytics: true,
      customDashboards: true,
      exportReports: true,
      apiAccess: true,
      webhooks: true,
      customIntegrations: true,
      prioritySupport: true,
      dedicatedAccountManager: true,
      onSiteTraining: true,
    },
    limits: {
      maxUsers: 10000,
      maxAssets: 500000,
      maxStorageGB: 50000,
      apiRateLimit: 10000,
      maxAlertsPerDay: 1000000,
      dataRetentionDays: 2555, // 7 years
    },
    supportLevel: 'enterprise',
    slaUptime: 99.999,
  },
};

// ============================================================================
// Deployment Configurations
// ============================================================================

export interface DeploymentConfig {
  mode: DeploymentMode;
  
  // Infrastructure
  infrastructure: {
    provider?: 'aws' | 'azure' | 'gcp' | 'on-premise';
    region?: string;
    availabilityZones?: number;
    autoScaling?: boolean;
  };
  
  // Database
  database: {
    host: string;
    port: number;
    name: string;
    ssl: boolean;
    replication: boolean;
  };
  
  // Cache
  cache: {
    host: string;
    port: number;
    cluster: boolean;
  };
  
  // Search
  search: {
    host: string;
    port: number;
    nodes: number;
  };
  
  // Graph
  graph: {
    host: string;
    port: number;
    cluster: boolean;
  };
  
  // Message Queue
  queue: {
    brokers: string[];
    ssl: boolean;
  };
  
  // Storage
  storage: {
    type: 's3' | 'azure-blob' | 'gcs' | 'minio' | 'local';
    bucket?: string;
    endpoint?: string;
  };
  
  // Monitoring
  monitoring: {
    prometheus: boolean;
    grafana: boolean;
    sentry: boolean;
    datadog?: boolean;
  };
}

// ============================================================================
// License Types
// ============================================================================

export type LicenseType = 'subscription' | 'perpetual' | 'trial' | 'nfr' | 'oem';

export interface License {
  id: string;
  tenantId: string;
  type: LicenseType;
  tier: TenantTier;
  
  // Validity
  startDate: Date;
  endDate?: Date;
  trialDays?: number;
  
  // Features
  features: TenantFeatures;
  
  // Limits
  maxUsers: number;
  maxAssets: number;
  
  // Installation
  installationId?: string;
  allowedHostnames?: string[];
  allowedIpRanges?: string[];
  
  // Signature
  signature: string;
  publicKey: string;
}

// ============================================================================
// Usage Tracking
// ============================================================================

export interface TenantUsage {
  tenantId: string;
  period: string;
  
  // Users
  activeUsers: number;
  totalUsers: number;
  
  // Assets
  monitoredAssets: number;
  totalAssets: number;
  
  // Alerts
  alertsGenerated: number;
  alertsResolved: number;
  
  // Incidents
  incidentsCreated: number;
  incidentsResolved: number;
  
  // API
  apiCalls: number;
  apiErrors: number;
  
  // Storage
  storageUsedGB: number;
  
  // Features
  featuresUsed: string[];
  
  // Cost
  estimatedCost: number;
}

// ============================================================================
// Invoice
// ============================================================================

export interface Invoice {
  id: string;
  tenantId: string;
  
  // Period
  periodStart: Date;
  periodEnd: Date;
  
  // Line Items
  lineItems: InvoiceLineItem[];
  
  // Totals
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  
  // Status
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  
  // Payment
  paymentMethod?: string;
  paidAt?: Date;
  dueDate: Date;
  
  // PDF
  pdfUrl?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'subscription' | 'usage' | 'overage' | 'credit';
}
