import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================================
// Security Headers Configuration
// ============================================================================

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none',
  },
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
];

// ============================================================================
// Content Security Policy
// ============================================================================

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.blacksentinel.io wss://ws.blacksentinel.io",
  "media-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "script-src-attr 'none'",
  "upgrade-insecure-requests",
].join('; ');

// ============================================================================
// Middleware Function
// ============================================================================

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });

  // Add CSP header
  response.headers.set('Content-Security-Policy', cspDirectives);

  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);

  // Add timestamp
  response.headers.set('X-Timestamp', new Date().toISOString());

  // Rate limiting check (simplified - in production use Redis)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const path = request.nextUrl.pathname;

  // Block suspicious paths
  const blockedPaths = [
    '/wp-admin',
    '/wp-login',
    '/.env',
    '/.git',
    '/phpmyadmin',
    '/admin/config',
  ];

  if (blockedPaths.some(blocked => path.includes(blocked))) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Block common attack patterns
  const attackPatterns = [
    /\.\.\//,
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /drop\s+table/i,
  ];

  const url = request.url;
  if (attackPatterns.some(pattern => pattern.test(url))) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // Free edition: /ai, /automation, /marketplace, and /analytics are
  // paid-plan only and are not included in this repository's source at
  // all (not just gated behind a flag) — see blacksentinel.io.

  // CORS handling for API routes
  if (path.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://command.blacksentinel.io',
      'https://api.blacksentinel.io',
    ];

    if (origin && !allowedOrigins.includes(origin)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
  }

  // Add security headers to response
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Strict Transport Security
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
