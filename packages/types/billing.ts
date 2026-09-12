// ============================================================================
// BlackSentinel Command - Licensing & Billing System
// Handles subscriptions, usage tracking, and invoicing
// ============================================================================

import {
  Tenant,
  TenantTier,
  TenantBilling,
  BillingCycle,
  License,
  LicenseType,
  TenantUsage,
  Invoice,
  InvoiceLineItem,
  PRICING_TIERS,
} from '../types/tenant';

// ============================================================================
// License Generator
// ============================================================================

export function generateLicense(
  tenantId: string,
  tier: TenantTier,
  type: LicenseType,
  startDate: Date,
  endDate?: Date
): License {
  const tierConfig = PRICING_TIERS[tier];
  
  // Generate cryptographic signature (simplified for demo)
  const signature = generateSignature(tenantId, tier, startDate);
  
  return {
    id: `lic_${generateId()}`,
    tenantId,
    type,
    tier,
    startDate,
    endDate,
    trialDays: type === 'trial' ? 30 : undefined,
    features: tierConfig.features,
    maxUsers: tierConfig.limits.maxUsers,
    maxAssets: tierConfig.limits.maxAssets,
    signature,
    publicKey: 'BLANKSENTEL_PUBLIC_KEY',
  };
}

// ============================================================================
// Billing Calculator
// ============================================================================

export interface BillingCalculation {
  basePrice: number;
  userCost: number;
  assetCost: number;
  totalMonthly: number;
  totalAnnual: number;
  savings: number;
}

export function calculateBilling(
  tier: TenantTier,
  userCount: number,
  assetCount: number,
  billingCycle: BillingCycle
): BillingCalculation {
  const tierConfig = PRICING_TIERS[tier];
  
  const basePrice = tierConfig.basePrice;
  const userCost = Math.max(0, userCount - tierConfig.minUsers) * tierConfig.pricePerUser;
  const assetCost = assetCount * tierConfig.pricePerAsset;
  
  const totalMonthly = basePrice + userCost + assetCost;
  const totalAnnual = totalMonthly * 12;
  
  // Annual discount (10%)
  const savings = billingCycle === 'annual' ? totalMonthly * 12 * 0.1 : 0;
  
  return {
    basePrice,
    userCost,
    assetCost,
    totalMonthly,
    totalAnnual,
    savings,
  };
}

// ============================================================================
// Usage Tracker
// ============================================================================

export class UsageTracker {
  private usage: Map<string, TenantUsage> = new Map();
  
  trackUsage(tenantId: string, period: string): TenantUsage {
    const key = `${tenantId}:${period}`;
    
    if (!this.usage.has(key)) {
      this.usage.set(key, {
        tenantId,
        period,
        activeUsers: 0,
        totalUsers: 0,
        monitoredAssets: 0,
        totalAssets: 0,
        alertsGenerated: 0,
        alertsResolved: 0,
        incidentsCreated: 0,
        incidentsResolved: 0,
        apiCalls: 0,
        apiErrors: 0,
        storageUsedGB: 0,
        featuresUsed: [],
        estimatedCost: 0,
      });
    }
    
    return this.usage.get(key)!;
  }
  
  incrementMetric(
    tenantId: string,
    period: string,
    metric: keyof TenantUsage,
    value: number = 1
  ): void {
    const usage = this.trackUsage(tenantId, period);
    const current = usage[metric];
    
    if (typeof current === 'number') {
      (usage as any)[metric] = current + value;
    }
  }
  
  getUsage(tenantId: string, period: string): TenantUsage | undefined {
    return this.usage.get(`${tenantId}:${period}`);
  }
  
  calculateEstimatedCost(
    tenantId: string,
    period: string,
    tier: TenantTier
  ): number {
    const usage = this.trackUsage(tenantId, period);
    const tierConfig = PRICING_TIERS[tier];
    
    const userCost = Math.max(0, usage.activeUsers - tierConfig.minUsers) * tierConfig.pricePerUser;
    const assetCost = usage.monitoredAssets * tierConfig.pricePerAsset;
    
    return tierConfig.basePrice + userCost + assetCost;
  }
}

// ============================================================================
// Invoice Generator
// ============================================================================

export function generateInvoice(
  tenant: Tenant,
  usage: TenantUsage,
  billingPeriod: { start: Date; end: Date }
): Invoice {
  const tierConfig = PRICING_TIERS[tenant.tier];
  const calculation = calculateBilling(
    tenant.tier,
    usage.activeUsers,
    usage.monitoredAssets,
    tenant.billing.billingCycle
  );
  
  const lineItems: InvoiceLineItem[] = [
    {
      description: `${tierConfig.name} Plan - Base Subscription`,
      quantity: 1,
      unitPrice: tierConfig.basePrice,
      total: tierConfig.basePrice,
      type: 'subscription',
    },
  ];
  
  // User overage
  if (usage.activeUsers > tierConfig.minUsers) {
    const userOverage = usage.activeUsers - tierConfig.minUsers;
    lineItems.push({
      description: `Additional Users (${userOverage} x $${tierConfig.pricePerUser}/user)`,
      quantity: userOverage,
      unitPrice: tierConfig.pricePerUser,
      total: userOverage * tierConfig.pricePerUser,
      type: 'usage',
    });
  }
  
  // Asset costs
  if (usage.monitoredAssets > 0) {
    lineItems.push({
      description: `Monitored Assets (${usage.monitoredAssets.toLocaleString()} x $${tierConfig.pricePerAsset}/asset)`,
      quantity: usage.monitoredAssets,
      unitPrice: tierConfig.pricePerAsset,
      total: usage.monitoredAssets * tierConfig.pricePerAsset,
      type: 'usage',
    });
  }
  
  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax (configurable)
  const total = subtotal + tax;
  
  // Apply annual discount if applicable
  let discount = 0;
  if (tenant.billing.billingCycle === 'annual') {
    discount = subtotal * 0.1;
  }
  
  return {
    id: `inv_${generateId()}`,
    tenantId: tenant.id,
    periodStart: billingPeriod.start,
    periodEnd: billingPeriod.end,
    lineItems,
    subtotal,
    tax,
    total: total - discount,
    currency: 'USD',
    status: 'pending',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  };
}

// ============================================================================
// Subscription Manager
// ============================================================================

export class SubscriptionManager {
  private subscriptions: Map<string, TenantBilling> = new Map();
  
  createSubscription(
    tenantId: string,
    tier: TenantTier,
    billingCycle: BillingCycle
  ): TenantBilling {
    const tierConfig = PRICING_TIERS[tier];
    const now = new Date();
    
    const billing: TenantBilling = {
      planId: tier,
      planName: tierConfig.name,
      billingCycle,
      basePrice: tierConfig.basePrice,
      pricePerUser: tierConfig.pricePerUser,
      pricePerAsset: tierConfig.pricePerAsset,
      totalMonthly: tierConfig.basePrice,
      currentPeriodStart: now,
      currentPeriodEnd: this.getNextPeriodEnd(now, billingCycle),
      credits: 0,
      invoiceEmail: '',
    };
    
    this.subscriptions.set(tenantId, billing);
    return billing;
  }
  
  upgradeSubscription(
    tenantId: string,
    newTier: TenantTier,
    billingCycle: BillingCycle
  ): TenantBilling {
    const existing = this.subscriptions.get(tenantId);
    const newBilling = this.createSubscription(tenantId, newTier, billingCycle);
    
    // Preserve existing data
    if (existing) {
      newBilling.invoiceEmail = existing.invoiceEmail;
      newBilling.credits = existing.credits;
      newBilling.paymentMethod = existing.paymentMethod;
    }
    
    this.subscriptions.set(tenantId, newBilling);
    return newBilling;
  }
  
  calculateProration(
    tenantId: string,
    newTier: TenantTier,
    billingCycle: BillingCycle
  ): number {
    const existing = this.subscriptions.get(tenantId);
    if (!existing) return 0;
    
    const currentTierConfig = PRICING_TIERS[existing.planId as TenantTier];
    const newTierConfig = PRICING_TIERS[newTier];
    
    const now = new Date();
    const periodLength = existing.currentPeriodEnd.getTime() - existing.currentPeriodStart.getTime();
    const elapsed = now.getTime() - existing.currentPeriodStart.getTime();
    const remaining = periodLength - elapsed;
    
    // Calculate daily rates
    const currentDailyRate = currentTierConfig.basePrice / 30;
    const newDailyRate = newTierConfig.basePrice / 30;
    
    // Proration credit
    const credit = currentDailyRate * (remaining / (24 * 60 * 60 * 1000));
    
    // New charge
    const charge = newDailyRate * (remaining / (24 * 60 * 60 * 1000));
    
    return charge - credit;
  }
  
  private getNextPeriodEnd(start: Date, cycle: BillingCycle): Date {
    const end = new Date(start);
    
    switch (cycle) {
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'annual':
        end.setFullYear(end.getFullYear() + 1);
        break;
    }
    
    return end;
  }
}

// ============================================================================
// Payment Processor (Interface)
// ============================================================================

export interface PaymentProcessor {
  createCustomer(tenant: Tenant): Promise<string>;
  createSubscription(customerId: string, planId: string): Promise<string>;
  processPayment(subscriptionId: string, amount: number): Promise<PaymentResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Stripe Implementation (Placeholder)
export class StripeProcessor implements PaymentProcessor {
  async createCustomer(tenant: Tenant): Promise<string> {
    // Stripe API call
    return `cus_${generateId()}`;
  }
  
  async createSubscription(customerId: string, planId: string): Promise<string> {
    // Stripe API call
    return `sub_${generateId()}`;
  }
  
  async processPayment(subscriptionId: string, amount: number): Promise<PaymentResult> {
    // Stripe API call
    return {
      success: true,
      transactionId: `txn_${generateId()}`,
    };
  }
  
  async cancelSubscription(subscriptionId: string): Promise<void> {
    // Stripe API call
  }
}

// ============================================================================
// Webhook Handlers
// ============================================================================

export interface WebhookEvent {
  type: string;
  data: Record<string, any>;
  timestamp: Date;
}

export class WebhookHandler {
  private handlers: Map<string, (event: WebhookEvent) => Promise<void>> = new Map();
  
  registerHandler(eventType: string, handler: (event: WebhookEvent) => Promise<void>): void {
    this.handlers.set(eventType, handler);
  }
  
  async handleEvent(event: WebhookEvent): Promise<void> {
    const handler = this.handlers.get(event.type);
    if (handler) {
      await handler(event);
    }
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateSignature(tenantId: string, tier: TenantTier, date: Date): string {
  // In production, use proper cryptographic signing
  const data = `${tenantId}:${tier}:${date.toISOString()}`;
  return Buffer.from(data).toString('base64');
}

// ============================================================================
// Export Instances
// ============================================================================

export const usageTracker = new UsageTracker();
export const subscriptionManager = new SubscriptionManager();
export const paymentProcessor = new StripeProcessor();
export const webhookHandler = new WebhookHandler();
