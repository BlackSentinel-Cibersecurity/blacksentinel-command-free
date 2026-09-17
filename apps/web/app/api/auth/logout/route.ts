import { NextRequest } from 'next/server';
import { deleteSession, clearSessionCookies, logAuditEvent, getSessionFromRequest, verifyAccessToken } from '@/lib/auth';
import { createSecureResponse, createErrorResponse } from '@/lib/security';

// ============================================================================
// Logout API
// POST /api/auth/logout
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const sessionToken = getSessionFromRequest(request);

    if (sessionToken) {
      const user = await verifyAccessToken(sessionToken);

      if (user) {
        // Delete session from storage
        await deleteSession(user.sessionIndex);

        // Log audit event
        await logAuditEvent({
          userId: user.userId,
          organizationId: user.organizationId,
          action: 'LOGOUT',
          resource: 'auth',
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || '',
          success: true,
        });
      }
    }

    // Create response and clear cookies
    const response = createSecureResponse({
      success: true,
      message: 'Logged out successfully',
    });

    return clearSessionCookies(response);
  } catch (error) {
    console.error('Logout error:', error);
    return createErrorResponse('An error occurred during logout', 500);
  }
}

// ============================================================================
// GET /api/auth/logout - Handle GET requests (e.g., from links)
// ============================================================================

export async function GET(request: NextRequest) {
  return POST(request);
}
