// ============================================================================
// BlackSentinel Command - Security Utilities
// Implements comprehensive security measures
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import sanitizeHtmlLib from 'sanitize-html';

// ============================================================================
// Input Sanitization
// ============================================================================

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

const SANITIZE_HTML_OPTIONS: sanitizeHtmlLib.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'code', 'pre'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtmlLib.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
};

export function sanitizeHTML(html: string): string {
  if (typeof html !== 'string') return '';
  return sanitizeHtmlLib(html, SANITIZE_HTML_OPTIONS);
}

// ============================================================================
// SQL Injection Prevention
// ============================================================================

export function escapeSQLString(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/'/g, "''");
}

export function validateSQLQuery(query: string): boolean {
  const dangerousPatterns = [
    /;\s*drop\s+/i,
    /;\s*delete\s+/i,
    /;\s*insert\s+/i,
    /;\s*update\s+/i,
    /;\s*alter\s+/i,
    /;\s*create\s+/i,
    /union\s+select/i,
    /into\s+outfile/i,
    /load_file\s*\(/i,
    /benchmark\s*\(/i,
    /sleep\s*\(/i,
    /waitfor\s+delay/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(query));
}

// ============================================================================
// XSS Prevention
// ============================================================================

export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /expression\s*\(/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi,
    /<applet\b[^>]*>/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

// ============================================================================
// CSRF Protection
// ============================================================================

export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

export function validateCSRFToken(_token: string, _sessionToken: string): boolean {
  // In production: Validate against stored token
  // The CSRF token should be derived from the session token
  // using a HMAC function
  return true; // Placeholder
}

// ============================================================================
// Rate Limiting
// ============================================================================

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDurationMs?: number;
  skipSuccessfulRequests?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 900000, // 15 minutes
  maxRequests: 100,
  blockDurationMs: 3600000, // 1 hour
  skipSuccessfulRequests: false,
};

// In production: Use Redis for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number; blocked?: number }>();

export function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): RateLimitResult {
  const fullConfig = { ...defaultConfig, ...config };
  const now = Date.now();
  const windowStart = now - fullConfig.windowMs;

  const record = rateLimitStore.get(identifier);

  if (record) {
    // Check if blocked
    if (record.blocked && record.blocked > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(record.blocked),
        retryAfter: Math.ceil((record.blocked - now) / 1000),
      };
    }

    // Check if window has expired
    if (record.resetAt <= windowStart) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetAt: now + fullConfig.windowMs,
      });
      return {
        allowed: true,
        remaining: fullConfig.maxRequests - 1,
        resetAt: new Date(now + fullConfig.windowMs),
      };
    }

    // Increment count
    record.count++;

    // Check if limit exceeded
    if (record.count > fullConfig.maxRequests) {
      if (fullConfig.blockDurationMs) {
        record.blocked = now + fullConfig.blockDurationMs;
      }
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(record.resetAt),
        retryAfter: Math.ceil((record.resetAt - now) / 1000),
      };
    }

    return {
      allowed: true,
      remaining: fullConfig.maxRequests - record.count,
      resetAt: new Date(record.resetAt),
    };
  }

  // First request
  rateLimitStore.set(identifier, {
    count: 1,
    resetAt: now + fullConfig.windowMs,
  });

  return {
    allowed: true,
    remaining: fullConfig.maxRequests - 1,
    resetAt: new Date(now + fullConfig.windowMs),
  };
}

// ============================================================================
// IP Blocking
// ============================================================================

const blockedIPs = new Set<string>();
const suspiciousIPs = new Map<string, { count: number; lastSeen: number }>();

export function isIPBlocked(ip: string): boolean {
  return blockedIPs.has(ip);
}

export function blockIP(ip: string, _reason: string): void {
  blockedIPs.add(ip);
  // In production: Store in database and Redis
  // Also send alert to security team
}

export function reportSuspiciousActivity(ip: string, activity: string): void {
  const record = suspiciousIPs.get(ip);
  const now = Date.now();

  if (record) {
    record.count++;
    record.lastSeen = now;

    // Block after 10 suspicious activities
    if (record.count >= 10) {
      blockIP(ip, `Suspicious activity: ${activity}`);
    }
  } else {
    suspiciousIPs.set(ip, { count: 1, lastSeen: now });
  }
}

// ============================================================================
// Request Validation
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateRequest(
  request: NextRequest,
  options: {
    methods?: string[];
    contentType?: string;
    maxBodySize?: number;
    requireAuth?: boolean;
  } = {}
): ValidationResult {
  const errors: string[] = [];

  // Validate method
  if (options.methods && !options.methods.includes(request.method)) {
    errors.push(`Method ${request.method} not allowed`);
  }

  // Validate content type
  if (options.contentType) {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes(options.contentType)) {
      errors.push(`Content-Type must be ${options.contentType}`);
    }
  }

  // Validate origin
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://command.blacksentinel.io',
    'https://api.blacksentinel.io',
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    errors.push('Invalid origin');
  }

  // Note: x-forwarded-host / x-host / x-real-ip are not validated here.
  // In this deployment (see config/nginx/nginx.conf), nginx always
  // overwrites x-real-ip and x-forwarded-for before proxying to Next.js,
  // so those two are already trustworthy by the time a request reaches
  // this app. x-forwarded-host / x-host are NOT set by that nginx config,
  // so a value in either could originate from the client unchanged. No
  // route currently reads them (grep confirmed), so there's no live
  // host-header-injection path today - but if a caller starts trusting
  // them (e.g. to build absolute URLs or redirects), validate against an
  // explicit allowlist of expected hostnames rather than the request's
  // own headers.

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Data Encryption
// ============================================================================

const ENCRYPTION_KEY = new TextEncoder().encode(
  process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production'
);

export async function encryptData(data: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey(
    'raw',
    ENCRYPTION_KEY,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(data)
  );

  const encryptedArray = new Uint8Array(encrypted);
  const result = new Uint8Array(iv.length + encryptedArray.length);
  result.set(iv);
  result.set(encryptedArray, iv.length);

  return btoa(String.fromCharCode(...result));
}

export async function decryptData(encryptedData: string): Promise<string> {
  const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const encrypted = data.slice(12);

  const key = await crypto.subtle.importKey(
    'raw',
    ENCRYPTION_KEY,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}

// ============================================================================
// API Key Management
// ============================================================================

export async function generateAPIKey(): Promise<{ key: string; hash: string }> {
  const key = `bs_${crypto.randomUUID().replace(/-/g, '')}`;
  const hash = await hashAPIKey(key);
  return { key, hash };
}

export async function hashAPIKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function validateAPIKey(key: string, hash: string): Promise<boolean> {
  return (await hashAPIKey(key)) === hash;
}

// ============================================================================
// Security Headers
// ============================================================================

export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join('; '),
  };
}

// ============================================================================
// Anomaly Detection
// ============================================================================

interface AnomalyPattern {
  type: string;
  threshold: number;
  windowMs: number;
  action: 'alert' | 'block' | 'report';
}

const anomalyPatterns: AnomalyPattern[] = [
  { type: 'login_attempts', threshold: 10, windowMs: 300000, action: 'block' },
  { type: 'api_requests', threshold: 1000, windowMs: 60000, action: 'alert' },
  { type: 'data_access', threshold: 100, windowMs: 60000, action: 'report' },
  { type: 'failed_auth', threshold: 5, windowMs: 300000, action: 'block' },
];

const anomalyStore = new Map<string, { count: number; firstSeen: number }>();

export function detectAnomaly(
  type: string,
  identifier: string
): { detected: boolean; action?: string } {
  const pattern = anomalyPatterns.find(p => p.type === type);
  if (!pattern) return { detected: false };

  const key = `${type}:${identifier}`;
  const now = Date.now();
  const record = anomalyStore.get(key);

  if (record) {
    // Check if window has expired
    if (now - record.firstSeen > pattern.windowMs) {
      anomalyStore.set(key, { count: 1, firstSeen: now });
      return { detected: false };
    }

    record.count++;

    if (record.count >= pattern.threshold) {
      return { detected: true, action: pattern.action };
    }
  } else {
    anomalyStore.set(key, { count: 1, firstSeen: now });
  }

  return { detected: false };
}

// ============================================================================
// Security Event Logging
// ============================================================================

export interface SecurityEvent {
  timestamp: Date;
  type: 'auth' | 'access' | 'anomaly' | 'attack' | 'data' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  ip: string;
  userAgent: string;
  userId?: string;
  organizationId?: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export async function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
  const _securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date(),
  };

  // In production: Store in security event database
  // Also send to SIEM and alert on critical events

  if (event.severity === 'critical') {
    // Send immediate alert
    // await sendSecurityAlert(_securityEvent);
  }
}

// ============================================================================
// Request Fingerprinting
// ============================================================================

export function generateRequestFingerprint(request: NextRequest): string {
  const components = [
    request.headers.get('user-agent') || '',
    request.headers.get('accept-language') || '',
    request.headers.get('accept-encoding') || '',
    request.ip || '',
  ];

  return components.join('|');
}

// ============================================================================
// Secure Response Helpers
// ============================================================================

export function createSecureResponse(
  data: unknown,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status });

  // Add security headers
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Remove potentially sensitive headers
  response.headers.delete('x-powered-by');
  response.headers.delete('server');

  return response;
}

export function createErrorResponse(
  message: string,
  status: number = 500
): NextResponse {
  // Never expose internal error details in production
  const safeMessage = process.env.NODE_ENV === 'production'
    ? 'An error occurred'
    : message;

  return createSecureResponse({ error: safeMessage }, status);
}

// ============================================================================
// Exports
// ============================================================================

export default {
  sanitizeInput,
  sanitizeHTML,
  escapeSQLString,
  validateSQLQuery,
  detectXSS,
  generateCSRFToken,
  validateCSRFToken,
  checkRateLimit,
  isIPBlocked,
  blockIP,
  reportSuspiciousActivity,
  validateRequest,
  encryptData,
  decryptData,
  generateAPIKey,
  hashAPIKey,
  validateAPIKey,
  getSecurityHeaders,
  detectAnomaly,
  logSecurityEvent,
  generateRequestFingerprint,
  createSecureResponse,
  createErrorResponse,
};
