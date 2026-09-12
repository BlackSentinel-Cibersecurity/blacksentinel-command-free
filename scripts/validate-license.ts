#!/usr/bin/env node

// ============================================================================
// BlackSentinel Command - License Validator
// Validates licenses for authenticity and expiration
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

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  license: LicenseData | null;
}

// ============================================================================
// License Validator
// ============================================================================

class LicenseValidator {
  private publicKey: string;

  constructor() {
    const publicKeyPath = path.join(__dirname, '../keys/public.pem');
    
    if (!fs.existsSync(publicKeyPath)) {
      throw new Error('Public key not found. Run generate-license.ts first.');
    }
    
    this.publicKey = fs.readFileSync(publicKeyPath, 'utf-8');
  }

  validateLicenseFile(licensePath: string): ValidationResult {
    const result: ValidationResult = {
      valid: false,
      errors: [],
      warnings: [],
      license: null,
    };

    // Check if file exists
    if (!fs.existsSync(licensePath)) {
      result.errors.push(`License file not found: ${licensePath}`);
      return result;
    }

    // Read and parse license
    let licenseFile: any;
    try {
      const content = fs.readFileSync(licensePath, 'utf-8');
      licenseFile = JSON.parse(content);
    } catch (error) {
      result.errors.push('Invalid license file format');
      return result;
    }

    // Validate structure
    if (!licenseFile.license) {
      result.errors.push('Invalid license structure: missing license data');
      return result;
    }

    const license = licenseFile.license as LicenseData;
    result.license = license;

    // Validate required fields
    const requiredFields = ['id', 'tenantId', 'tier', 'type', 'features', 'maxUsers', 'maxAssets', 'validFrom', 'signature'];
    for (const field of requiredFields) {
      if (!license[field as keyof LicenseData]) {
        result.errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate tier
    const validTiers = ['starter', 'professional', 'enterprise', 'government'];
    if (!validTiers.includes(license.tier)) {
      result.errors.push(`Invalid tier: ${license.tier}`);
    }

    // Validate type
    const validTypes = ['subscription', 'perpetual', 'trial', 'nfr', 'oem'];
    if (!validTypes.includes(license.type)) {
      result.errors.push(`Invalid license type: ${license.type}`);
    }

    // Validate signature
    if (!this.verifySignature(license)) {
      result.errors.push('Invalid license signature');
    }

    // Check expiration
    if (license.validUntil) {
      const validUntil = new Date(license.validUntil);
      const now = new Date();
      
      if (validUntil < now) {
        result.errors.push('License has expired');
      } else if (validUntil < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) {
        result.warnings.push('License expires in less than 30 days');
      }
    }

    // Check limits
    if (license.maxUsers <= 0) {
      result.errors.push('Invalid max users limit');
    }

    if (license.maxAssets <= 0) {
      result.errors.push('Invalid max assets limit');
    }

    // Check features
    if (license.features.length === 0) {
      result.warnings.push('No features enabled');
    }

    result.valid = result.errors.length === 0;
    return result;
  }

  private verifySignature(license: LicenseData): boolean {
    try {
      // Create a copy without signature for verification
      const dataToVerify = { ...license };
      delete dataToVerify.signature;

      const verify = crypto.createVerify('SHA256');
      verify.update(JSON.stringify(dataToVerify));
      verify.end();

      return verify.verify(this.publicKey, license.signature, 'hex');
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  getLicenseInfo(licensePath: string): LicenseData | null {
    try {
      const content = fs.readFileSync(licensePath, 'utf-8');
      const licenseFile = JSON.parse(content);
      return licenseFile.license;
    } catch (error) {
      return null;
    }
  }

  checkFeature(licensePath: string, feature: string): boolean {
    const license = this.getLicenseInfo(licensePath);
    if (!license) return false;
    return license.features.includes(feature);
  }

  checkLimits(licensePath: string, users: number, assets: number): { valid: boolean; errors: string[] } {
    const license = this.getLicenseInfo(licensePath);
    if (!license) {
      return { valid: false, errors: ['License not found'] };
    }

    const errors: string[] = [];

    if (users > license.maxUsers) {
      errors.push(`User limit exceeded: ${users} > ${license.maxUsers}`);
    }

    if (assets > license.maxAssets) {
      errors.push(`Asset limit exceeded: ${assets.toLocaleString()} > ${license.maxAssets.toLocaleString()}`);
    }

    return { valid: errors.length === 0, errors };
  }
}

// ============================================================================
// Main Function
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  validate-license.ts <license-path>        - Validate license file');
    console.log('  validate-license.ts <license-path> <feature> - Check feature access');
    console.log('  validate-license.ts <license-path> <users> <assets> - Check limits');
    process.exit(1);
  }

  const licensePath = args[0];

  try {
    const validator = new LicenseValidator();

    if (args.length === 1) {
      // Validate license
      const result = validator.validateLicenseFile(licensePath);
      
      console.log('\n=== License Validation ===');
      console.log(`Valid: ${result.valid ? '[OK]' : '[FAIL]'}`);
      
      if (result.license) {
        console.log(`ID: ${result.license.id}`);
        console.log(`Tenant: ${result.license.tenantId}`);
        console.log(`Tier: ${result.license.tier}`);
        console.log(`Type: ${result.license.type}`);
        console.log(`Valid From: ${result.license.validFrom}`);
        console.log(`Valid Until: ${result.license.validUntil || 'Never'}`);
        console.log(`Max Users: ${result.license.maxUsers}`);
        console.log(`Max Assets: ${result.license.maxAssets.toLocaleString()}`);
        console.log(`Features: ${result.license.features.length}`);
      }
      
      if (result.errors.length > 0) {
        console.log('\nErrors:');
        result.errors.forEach(error => console.log(`  [ERROR] ${error}`));
      }
      
      if (result.warnings.length > 0) {
        console.log('\nWarnings:');
        result.warnings.forEach(warning => console.log(`  [WARN] ${warning}`));
      }
    } else if (args.length === 2) {
      // Check feature
      const feature = args[1];
      const hasFeature = validator.checkFeature(licensePath, feature);
      
      console.log(`\nFeature '${feature}': ${hasFeature ? '[ALLOWED]' : '[NOT ALLOWED]'}`);
    } else if (args.length === 3) {
      // Check limits
      const users = parseInt(args[1], 10);
      const assets = parseInt(args[2], 10);
      
      const result = validator.checkLimits(licensePath, users, assets);
      
      console.log('\n=== Limit Check ===');
      console.log(`Valid: ${result.valid ? '[OK]' : '[FAIL]'}`);
      
      if (result.errors.length > 0) {
        console.log('Errors:');
        result.errors.forEach(error => console.log(`  [ERROR] ${error}`));
      }
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { LicenseValidator, ValidationResult };
