import { NextRequest } from 'next/server';
import { refreshSession, logAuditEvent, getSessionFromRequest } from '@/lib/auth';
import { setSessionCookies, clearSessionCookies } from '@/lib/auth';
import { createSecureResponse, createErrorResponse } from '@/lib/security';

// ============================================================================
// Session Refresh API
// POST /api/auth/refresh
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('bs-refresh')?.value;

    if (!refreshToken) {
      return createErrorResponse('No refresh token provided', 401);
    }

    // Refresh the session
    const tokens = await refreshSession(refreshToken);

    if (!tokens) {
      // Invalid or expired refresh token
      const response = createErrorResponse('Invalid refresh token', 401);
      return clearSessionCookies(response);
    }

    // Log audit event
    const sessionToken = getSessionFromRequest(request);
    if (sessionToken) {
      const { verifyAccessToken } = await import('@/lib/auth');
      const user = await verifyAccessToken(sessionToken);
      if (user) {
        await logAuditEvent({
          userId: user.userId,
          organizationId: user.organizationId,
          action: 'SESSION_REFRESH',
          resource: 'auth',
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || '',
          success: true,
        });
      }
    }

    // Create response with new tokens
    const response = createSecureResponse({
      success: true,
      message: 'Session refreshed successfully',
    });

    return setSessionCookies(response, tokens.accessToken, tokens.refreshToken);
  } catch (error) {
    console.error('Session refresh error:', error);
    return createErrorResponse('An error occurred during session refresh', 500);
  }
}
