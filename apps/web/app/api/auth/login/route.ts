import { NextRequest } from 'next/server';
import {
  createSession,
  verifyPassword,
  checkLoginAttempts,
  recordLoginAttempt,
  logAuditEvent,
  setSessionCookies,
  hashPassword,
} from '@/lib/auth';
import { sanitizeInput, checkRateLimit, createSecureResponse, createErrorResponse } from '@/lib/security';

// ============================================================================
// Login API
// POST /api/auth/login
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = checkRateLimit(`login:${ip}`, {
      windowMs: 900000, // 15 minutes
      maxRequests: 10, // 10 attempts per 15 minutes
    });

    if (!rateLimitResult.allowed) {
      return createErrorResponse('Too many login attempts. Please try again later.', 429);
    }

    // Parse request body
    const body = await request.json();
    const { email, password, mfaCode } = body;

    // Validate input
    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400);
    }

    // Sanitize input
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // Check login attempts
    const attempts = await checkLoginAttempts(sanitizedEmail);
    if (!attempts.allowed) {
      await logAuditEvent({
        userId: '',
        organizationId: '',
        action: 'LOGIN_BLOCKED',
        resource: 'auth',
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || '',
        success: false,
        details: { reason: 'Too many attempts' },
      });

      return createErrorResponse(
        'Account temporarily locked. Please try again later.',
        429
      );
    }

    // SECURITY FIX: this used to accept ANY email with the published password
    // 'SecureP@ssw0rd!' and grant the CISO role. The free edition has a single
    // operator account, configured in .env (scripts/init-env.sh creates it).
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@blacksentinel.local').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();
    if (!adminPassword || adminPassword.length < 12) {
      return createErrorResponse(
        'Sign-in is not configured. Set ADMIN_PASSWORD (12+ characters) in .env; scripts/init-env.sh creates one.',
        503
      );
    }
    const user =
      sanitizedEmail === adminEmail
        ? {
            id: 'admin',
            email: adminEmail,
            name: 'Administrator',
            passwordHash: await hashPassword(adminPassword),
            role: 'ciso' as const,
            organizationId: 'org-1',
            // TOTP is not implemented in the free edition, so MFA stays off
            // rather than pretending to check a code.
            mfaEnabled: false,
            mfaVerified: false,
          }
        : null;

    if (!user) {
      await recordLoginAttempt(sanitizedEmail, false);
      await logAuditEvent({
        userId: '',
        organizationId: '',
        action: 'LOGIN_FAILED',
        resource: 'auth',
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || '',
        success: false,
        details: { reason: 'Invalid credentials' },
      });

      return createErrorResponse('Invalid email or password', 401);
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      await recordLoginAttempt(sanitizedEmail, false);
      await logAuditEvent({
        userId: user.id,
        organizationId: user.organizationId,
        action: 'LOGIN_FAILED',
        resource: 'auth',
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || '',
        success: false,
        details: { reason: 'Invalid password' },
      });

      return createErrorResponse('Invalid email or password', 401);
    }

    // Check if MFA is required
    if (user.mfaEnabled && !mfaCode) {
      // Return requiring MFA
      return createSecureResponse({
        requiresMFA: true,
        message: 'MFA verification required',
      });
    }

    // Verify MFA if provided
    if (user.mfaEnabled && mfaCode) {
      // TOTP is not implemented in the free edition: fail closed instead of the
      // old placeholder that accepted every code.
      const mfaValid = false;

      if (!mfaValid) {
        await logAuditEvent({
          userId: user.id,
          organizationId: user.organizationId,
          action: 'MFA_FAILED',
          resource: 'auth',
          ipAddress: ip,
          userAgent: request.headers.get('user-agent') || '',
          success: false,
          details: { reason: 'Invalid MFA code' },
        });

        return createErrorResponse('Invalid MFA code', 401);
      }
    }

    // Create session
    const { accessToken, refreshToken, session } = await createSession(
      user.id,
      user.organizationId,
      ip,
      request.headers.get('user-agent') || ''
    );

    // Record successful login
    await recordLoginAttempt(sanitizedEmail, true);
    await logAuditEvent({
      userId: user.id,
      organizationId: user.organizationId,
      action: 'LOGIN_SUCCESS',
      resource: 'auth',
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || '',
      success: true,
      details: { sessionId: session.id },
    });

    // Create response with cookies
    const response = createSecureResponse({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      session: {
        expiresAt: session.expiresAt,
      },
    });

    return setSessionCookies(response, accessToken, refreshToken);
  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('An error occurred during login', 500);
  }
}
