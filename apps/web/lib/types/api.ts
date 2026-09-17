// ============================================================================
// BlackSentinel Command - API Response Types
// Standardized response types for all API endpoints
// ============================================================================

// ============================================================================
// Base Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string; // Only in development
}

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
  version: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================================
// Specific Response Types
// ============================================================================

export interface LoginResponse {
  success: boolean;
  requiresMFA?: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  session?: {
    expiresAt: string;
  };
}

export interface SessionResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationId: string;
    permissions: string[];
  };
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
    elasticsearch: ServiceHealth;
    kafka: ServiceHealth;
  };
}

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}

// ============================================================================
// Pagination Helpers
// ============================================================================

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): ApiResponse<T[]> {
  const totalPages = Math.ceil(total / pageSize);

  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      version: process.env.APP_VERSION || '1.0.0',
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    },
  };
}

export function createSuccessResponse<T>(
  data: T,
  _statusCode: number = 200
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      version: process.env.APP_VERSION || '1.0.0',
    },
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  _statusCode: number = 400,
  details?: Record<string, unknown>
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      stack: process.env.NODE_ENV === 'development' ? details?.stack as string : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      version: process.env.APP_VERSION || '1.0.0',
    },
  };
}

// ============================================================================
// Error Codes
// ============================================================================

export const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  AUTH_MFA_REQUIRED: 'AUTH_MFA_REQUIRED',
  AUTH_MFA_INVALID: 'AUTH_MFA_INVALID',
  AUTH_ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  VALIDATION_INVALID_INPUT: 'VALIDATION_INVALID_INPUT',
  VALIDATION_MISSING_FIELD: 'VALIDATION_MISSING_FIELD',

  // Resource
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// ============================================================================
// Validation Helpers
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export function createValidationErrorResponse(
  errors: ValidationError[]
): ApiResponse {
  return createErrorResponse(
    ERROR_CODES.VALIDATION_ERROR,
    'Validation failed',
    400,
    { errors }
  );
}

export function validateRequiredFields(
  data: Record<string, unknown>,
  fields: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push({
        field,
        message: `${field} is required`,
        code: 'REQUIRED',
      });
    }
  }

  return errors;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
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

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// Exports
// ============================================================================

export default {
  createPaginatedResponse,
  createSuccessResponse,
  createErrorResponse,
  createValidationErrorResponse,
  validateRequiredFields,
  validateEmail,
  validatePassword,
  ERROR_CODES,
};
