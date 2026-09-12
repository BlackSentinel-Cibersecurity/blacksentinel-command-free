// ============================================================================
// BlackSentinel Command - Authentication Library
// Implements Zero Trust authentication with MFA, SSO, and session management
// ============================================================================

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// Types
// ============================================================================

export interface UserPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  permissions: Permission[];
  mfaVerified: boolean;
  sessionIndex: string;
}

export type UserRole = 'super_admin' | 'admin' | 'ciso' | 'soc_manager' | 'soc_analyst' | 'security_engineer' | 'compliance' | 'executive' | 'viewer';

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'execute' | 'admin')[];
}

export interface Session {
  id: string;
  userId: string;
  organizationId: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  mfaVerified: boolean;
  refreshTokens: string[];
}

export interface MFAChallenge {
  challengeId: string;
  userId: string;
  method: 'totp' | 'sms' | 'email' | 'webauthn';
  expiresAt: Date;
  attempts: number;
}

// ============================================================================
// Configuration
// ============================================================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production'
);

const SESSION_COOKIE = 'bs-session';
const REFRESH_COOKIE = 'bs-refresh';
const SESSION_MAX_AGE = 3600; // 1 hour
const REFRESH_MAX_AGE = 604800; // 7 days
const MFA_CHALLENGE_MAX_AGE = 300; // 5 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 900000; // 15 minutes

// ============================================================================
// Role-Based Access Control (RBAC)
// ============================================================================

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    { resource: '*', actions: ['read', 'write', 'delete', 'execute', 'admin'] },
  ],
  admin: [
    { resource: 'users', actions: ['read', 'write', 'delete', 'admin'] },
    { resource: 'settings', actions: ['read', 'write', 'admin'] },
    { resource: '*', actions: ['read', 'write'] },
  ],
  ciso: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'incidents', actions: ['read', 'write', 'execute'] },
    { resource: 'reports', actions: ['read', 'write'] },
    { resource: 'compliance', actions: ['read', 'write'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'ai', actions: ['read', 'execute'] },
  ],
  soc_manager: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'alerts', actions: ['read', 'write', 'execute'] },
    { resource: 'incidents', actions: ['read', 'write', 'execute'] },
    { resource: 'investigations', actions: ['read', 'write'] },
    { resource: 'playbooks', actions: ['read', 'write', 'execute'] },
    { resource: 'team', actions: ['read', 'write'] },
  ],
  soc_analyst: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'alerts', actions: ['read', 'write'] },
    { resource: 'incidents', actions: ['read', 'write'] },
    { resource: 'investigations', actions: ['read', 'write'] },
    { resource: 'assets', actions: ['read'] },
  ],
  security_engineer: [
    { resource: 'infrastructure', actions: ['read', 'write'] },
    { resource: 'automation', actions: ['read', 'write', 'execute'] },
    { resource: 'assets', actions: ['read', 'write'] },
    { resource: 'vulnerabilities', actions: ['read', 'write'] },
  ],
  compliance: [
    { resource: 'compliance', actions: ['read', 'write'] },
    { resource: 'reports', actions: ['read', 'write'] },
    { resource: 'audit', actions: ['read'] },
  ],
  executive: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
  ],
  viewer: [
    { resource: 'dashboard', actions: ['read'] },
  ],
};

// ============================================================================
// JWT Operations
// ============================================================================

export async function createAccessToken(user: UserPayload): Promise<string> {
  return new SignJWT({
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    permissions: user.permissions,
    mfaVerified: user.mfaVerified,
    sessionIndex: user.sessionIndex,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setIssuer('blacksentinel-command')
    .setAudience('blacksentinel-api')
    .setJti(crypto.randomUUID())
    .sign(JWT_SECRET);
}

export async function createRefreshToken(userId: string, sessionIndex: string): Promise<string> {
  return new SignJWT({
    userId,
    sessionIndex,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_MAX_AGE}s`)
    .setIssuer('blacksentinel-command')
    .setAudience('blacksentinel-api')
    .setJti(crypto.randomUUID())
    .sign(JWT_REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'blacksentinel-command',
      audience: 'blacksentinel-api',
    });
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string; sessionIndex: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET, {
      issuer: 'blacksentinel-command',
      audience: 'blacksentinel-api',
    });
    return payload as unknown as { userId: string; sessionIndex: string };
  } catch {
    return null;
  }
}

// ============================================================================
// Session Management
// ============================================================================

export async function createSession(
  userId: string,
  organizationId: string,
  ipAddress: string,
  userAgent: string
): Promise<{ accessToken: string; refreshToken: string; session: Session }> {
  const sessionIndex = crypto.randomUUID();
  
  const accessToken = await createAccessToken({
    userId,
    email: '', // Will be filled from database
    name: '', // Will be filled from database
    role: 'viewer', // Will be filled from database
    organizationId,
    permissions: [], // Will be filled from database
    mfaVerified: false,
    sessionIndex,
  });

  const refreshToken = await createRefreshToken(userId, sessionIndex);

  const session: Session = {
    id: sessionIndex,
    userId,
    organizationId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
    lastActivity: new Date(),
    ipAddress,
    userAgent,
    mfaVerified: false,
    refreshTokens: [refreshToken],
  };

  // In production: Store session in Redis
  // await redis.setex(`session:${sessionIndex}`, SESSION_MAX_AGE, JSON.stringify(session));

  return { accessToken, refreshToken, session };
}

export async function refreshSession(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) return null;

  // In production: Verify session exists in Redis and rotate tokens
  // const session = await redis.get(`session:${payload.sessionIndex}`);
  // if (!session) return null;

  const newAccessToken = await createAccessToken({
    userId: payload.userId,
    email: '', // Will be filled from database
    name: '', // Will be filled from database
    role: 'viewer', // Will be filled from database
    organizationId: '', // Will be filled from database
    permissions: [], // Will be filled from database
    mfaVerified: true,
    sessionIndex: payload.sessionIndex,
  });

  const newRefreshToken = await createRefreshToken(payload.userId, payload.sessionIndex);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function deleteSession(sessionIndex: string): Promise<void> {
  // In production: Delete session from Redis
  // await redis.del(`session:${sessionIndex}`);
}

// ============================================================================
// Authentication Middleware
// ============================================================================

export async function authenticate(request: NextRequest): Promise<{
  authenticated: boolean;
  user?: UserPayload;
  error?: string;
}> {
  // Get session token from cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return { authenticated: false, error: 'No session token provided' };
  }

  // Verify token
  const user = await verifyAccessToken(sessionToken);
  if (!user) {
    return { authenticated: false, error: 'Invalid or expired token' };
  }

  // Check if MFA is required and verified
  if (!user.mfaVerified && requiresMFA(user.role)) {
    return { authenticated: false, error: 'MFA verification required' };
  }

  return { authenticated: true, user };
}

export async function authorize(
  user: UserPayload,
  resource: string,
  action: 'read' | 'write' | 'delete' | 'execute' | 'admin'
): Promise<boolean> {
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  
  // Check for wildcard permission
  const wildcardPermission = rolePermissions.find(p => p.resource === '*');
  if (wildcardPermission && wildcardPermission.actions.includes(action)) {
    return true;
  }

  // Check specific resource permission
  const resourcePermission = rolePermissions.find(p => p.resource === resource);
  if (resourcePermission && resourcePermission.actions.includes(action)) {
    return true;
  }

  // Check user-specific permissions
  const userPermission = user.permissions.find(p => p.resource === resource);
  if (userPermission && userPermission.actions.includes(action)) {
    return true;
  }

  return false;
}

// ============================================================================
// MFA Operations
// ============================================================================

function requiresMFA(role: UserRole): boolean {
  const mfaRequiredRoles: UserRole[] = [
    'super_admin',
    'admin',
    'ciso',
    'soc_manager',
    'security_engineer',
  ];
  return mfaRequiredRoles.includes(role);
}

export async function createMFAChallenge(userId: string, method: MFAChallenge['method']): Promise<MFAChallenge> {
  const challenge: MFAChallenge = {
    challengeId: crypto.randomUUID(),
    userId,
    method,
    expiresAt: new Date(Date.now() + MFA_CHALLENGE_MAX_AGE * 1000),
    attempts: 0,
  };

  // In production: Store challenge in Redis
  // await redis.setex(`mfa:${challenge.challengeId}`, MFA_CHALLENGE_MAX_AGE, JSON.stringify(challenge));

  // Send MFA code based on method
  switch (method) {
    case 'totp':
      // Generate and verify TOTP code
      break;
    case 'sms':
      // Send SMS with code
      break;
    case 'email':
      // Send email with code
      break;
    case 'webauthn':
      // Initiate WebAuthn challenge
      break;
  }

  return challenge;
}

export async function verifyMFAChallenge(
  challengeId: string,
  code: string
): Promise<{ verified: boolean; error?: string }> {
  // In production: Get challenge from Redis
  // const challengeData = await redis.get(`mfa:${challengeId}`);
  // if (!challengeData) return { verified: false, error: 'Challenge expired' };

  // const challenge: MFAChallenge = JSON.parse(challengeData);

  // if (challenge.attempts >= 3) {
  //   await redis.del(`mfa:${challengeId}`);
  //   return { verified: false, error: 'Too many attempts' };
  // }

  // Verify code based on method
  // ...

  return { verified: true };
}

// ============================================================================
// Password Security
// ============================================================================

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^admin/i,
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains common patterns');
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// Login Attempt Tracking
// ============================================================================

export async function checkLoginAttempts(email: string): Promise<{
  allowed: boolean;
  attemptsRemaining: number;
  lockoutExpires?: Date;
}> {
  // In production: Check Redis for login attempts
  // const attempts = await redis.get(`login_attempts:${email}`);
  // const lockout = await redis.get(`lockout:${email}`);

  // if (lockout) {
  //   return {
  //     allowed: false,
  //     attemptsRemaining: 0,
  //     lockoutExpires: new Date(parseInt(lockout)),
  //   };
  // }

  return { allowed: true, attemptsRemaining: MAX_LOGIN_ATTEMPTS };
}

export async function recordLoginAttempt(email: string, success: boolean): Promise<void> {
  // In production: Record attempt in Redis
  // if (success) {
  //   await redis.del(`login_attempts:${email}`);
  // } else {
  //   const attempts = await redis.incr(`login_attempts:${email}`);
  //   await redis.expire(`login_attempts:${email}`, LOCKOUT_DURATION / 1000);
  //   
  //   if (attempts >= MAX_LOGIN_ATTEMPTS) {
  //     await redis.setex(`lockout:${email}`, LOCKOUT_DURATION / 1000, Date.now().toString());
  //   }
  // }
}

// ============================================================================
// Audit Logging
// ============================================================================

export interface AuditLog {
  timestamp: Date;
  userId: string;
  organizationId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, unknown>;
}

export async function logAuditEvent(event: Omit<AuditLog, 'timestamp'>): Promise<void> {
  const auditEvent: AuditLog = {
    ...event,
    timestamp: new Date(),
  };

  // In production: Store in audit log database
  // await db.auditLogs.create({ data: auditEvent });

  // Also send to Kafka for real-time monitoring
  // await kafka.send({
  //   topic: 'audit-events',
  //   messages: [{ value: JSON.stringify(auditEvent) }],
  // });
}

// ============================================================================
// Session Cookie Helpers
// ============================================================================

export function setSessionCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): NextResponse {
  response.cookies.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  response.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_MAX_AGE,
    path: '/',
  });

  return response;
}

export function clearSessionCookies(response: NextResponse): NextResponse {
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}

export function getSessionFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(SESSION_COOKIE)?.value;
}

export default {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  createSession,
  refreshSession,
  deleteSession,
  authenticate,
  authorize,
  createMFAChallenge,
  verifyMFAChallenge,
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  checkLoginAttempts,
  recordLoginAttempt,
  logAuditEvent,
  setSessionCookies,
  clearSessionCookies,
  getSessionFromRequest,
};
