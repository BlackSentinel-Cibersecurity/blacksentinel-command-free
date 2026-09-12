#!/usr/bin/env node

// ============================================================================
// BlackSentinel Command - License Generator
// Generates and validates licenses for tenants
// ============================================================================

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Types
// ============================================================================

interface LicenseData {
  id: string;
  tenantId: string;
  tier: string;
  type: string;
  features: string[];
  maxUsers: number;
  maxAssets: number;
  validFrom: string;
  validUntil?: string;
  signature: string;
}

// ============================================================================
// Configuration
// ============================================================================

const LICENSE_VERSION = '1.0.0';
const PRIVATE_KEY_PATH = path.join(__dirname, '../keys/private.pem');
const PUBLIC_KEY_PATH = path.join(__dirname, '../keys/public.pem');

// ============================================================================
// License Generator
// ============================================================================

class LicenseGenerator {
  private privateKey: string;
  private publicKey: string;

  constructor() {
    // In production, load from secure key vault
    this.privateKey = this.loadOrCreateKey(PRIVATE_KEY_PATH);
    this.publicKey = this.loadOrCreateKey(PUBLIC_KEY_PATH);
  }

  private loadOrCreateKey(keyPath: string): string {
    if (fs.existsSync(keyPath)) {
      return fs.readFileSync(keyPath, 'utf-8');
    }

    // Generate new key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // Ensure directory exists
    const dir = path.dirname(keyPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save keys
    if (keyPath.includes('private')) {
      fs.writeFileSync(keyPath, privateKey, { mode: 0o600 });
      return privateKey;
    } else {
      fs.writeFileSync(keyPath, publicKey);
      return publicKey;
    }
  }

  generateLicense(
    tenantId: string,
    tier: string,
    type: string,
    features: string[],
    maxUsers: number,
    maxAssets: number,
    validDays?: number
  ): LicenseData {
    const licenseId = `lic_${crypto.randomBytes(16).toString('hex')}`;
    const validFrom = new Date();
    const validUntil = validDays
      ? new Date(validFrom.getTime() + validDays * 24 * 60 * 60 * 1000)
      : undefined;

    const licenseData: Omit<LicenseData, 'signature'> = {
      id: licenseId,
      tenantId,
      tier,
      type,
      features,
      maxUsers,
      maxAssets,
      validFrom: validFrom.toISOString(),
      validUntil: validUntil?.toISOString(),
    };

    // Sign the license
    const signature = this.signData(JSON.stringify(licenseData));

    return {
      ...licenseData,
      signature,
    };
  }

  private signData(data: string): string {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(this.privateKey, 'hex');
  }

  validateLicense(license: LicenseData): boolean {
    // Check expiration
    if (license.validUntil) {
      const validUntil = new Date(license.validUntil);
      if (validUntil < new Date()) {
        console.error('License has expired');
        return false;
      }
    }

    // Verify signature
    const dataToVerify = { ...license };
    delete dataToVerify.signature;

    const verify = crypto.createVerify('SHA256');
    verify.update(JSON.stringify(dataToVerify));
    verify.end();

    return verify.verify(this.publicKey, license.signature, 'hex');
  }

  exportLicense(license: LicenseData, outputPath: string): void {
    const licenseFile = {
      version: LICENSE_VERSION,
      license,
      metadata: {
        generatedAt: new Date().toISOString(),
        generator: 'BlackSentinel License Manager',
      },
    };

    fs.writeFileSync(outputPath, JSON.stringify(licenseFile, null, 2));
    console.log(`License exported to: ${outputPath}`);
  }

  importLicense(licensePath: string): LicenseData {
    const licenseFile = JSON.parse(fs.readFileSync(licensePath, 'utf-8'));
    return licenseFile.license;
  }
}

// ============================================================================
// Tier Definitions
// ============================================================================

const TIER_FEATURES: Record<string, string[]> = {
  starter: [
    'soc',
    'incident-response',
    'threat-intelligence',
    'vulnerability-management',
    'audit-logging',
    'basic-reports',
  ],
  professional: [
    'soc',
    'incident-response',
    'threat-intelligence',
    'vulnerability-management',
    'ai-command',
    'automation',
    'graph-analytics',
    'advanced-reports',
    'custom-dashboards',
    'api-access',
    'webhooks',
  ],
  enterprise: [
    'soc',
    'incident-response',
    'threat-intelligence',
    'vulnerability-management',
    'ai-command',
    'automation',
    'digital-twin',
    'graph-analytics',
    'advanced-reports',
    'custom-dashboards',
    'api-access',
    'webhooks',
    'custom-integrations',
    'priority-support',
    'dedicated-account-manager',
  ],
  government: [
    'soc',
    'incident-response',
    'threat-intelligence',
    'vulnerability-management',
    'ai-command',
    'automation',
    'digital-twin',
    'graph-analytics',
    'advanced-reports',
    'custom-dashboards',
    'api-access',
    'webhooks',
    'custom-integrations',
    'priority-support',
    'dedicated-account-manager',
    'on-site-training',
    'fedramp-compliance',
    'nist-compliance',
    'cmmc-compliance',
  ],
};

// ============================================================================
// Main Function
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.log('Usage: generate-license.ts <tenantId> <tier> <type> <validDays>');
    console.log('');
    console.log('Arguments:');
    console.log('  tenantId   - Unique tenant identifier');
    console.log('  tier       - License tier (starter|professional|enterprise|government)');
    console.log('  type       - License type (subscription|perpetual|trial|nfr|oem)');
    console.log('  validDays  - Number of days until expiration (0 for perpetual)');
    console.log('');
    console.log('Example:');
    console.log('  ts-node generate-license.ts tenant-123 enterprise subscription 365');
    process.exit(1);
  }

  const [tenantId, tier, type, validDaysStr] = args;
  const validDays = parseInt(validDaysStr, 10);

  // Validate tier
  if (!TIER_FEATURES[tier]) {
    console.error(`Invalid tier: ${tier}`);
    console.error(`Valid tiers: ${Object.keys(TIER_FEATURES).join(', ')}`);
    process.exit(1);
  }

  // Validate type
  const validTypes = ['subscription', 'perpetual', 'trial', 'nfr', 'oem'];
  if (!validTypes.includes(type)) {
    console.error(`Invalid type: ${type}`);
    console.error(`Valid types: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  // Generate license
  const generator = new LicenseGenerator();
  const features = TIER_FEATURES[tier];

  const limits: Record<string, { maxUsers: number; maxAssets: number }> = {
    starter: { maxUsers: 10, maxAssets: 500 },
    professional: { maxUsers: 50, maxAssets: 5000 },
    enterprise: { maxUsers: 500, maxAssets: 50000 },
    government: { maxUsers: 10000, maxAssets: 500000 },
  };

  const license = generator.generateLicense(
    tenantId,
    tier,
    type,
    features,
    limits[tier].maxUsers,
    limits[tier].maxAssets,
    validDays || undefined
  );

  // Export license
  const outputPath = path.join(__dirname, `../licenses/${tenantId}.license.json`);
  generator.exportLicense(license, outputPath);

  // Print summary
  console.log('\n=== License Generated ===');
  console.log(`ID: ${license.id}`);
  console.log(`Tenant: ${license.tenantId}`);
  console.log(`Tier: ${license.tier}`);
  console.log(`Type: ${license.type}`);
  console.log(`Features: ${license.features.length}`);
  console.log(`Max Users: ${license.maxUsers}`);
  console.log(`Max Assets: ${license.maxAssets}`);
  console.log(`Valid From: ${license.validFrom}`);
  console.log(`Valid Until: ${license.validUntil || 'Never'}`);
  console.log(`Signature: ${license.signature.substring(0, 32)}...`);
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { LicenseGenerator, TIER_FEATURES };
