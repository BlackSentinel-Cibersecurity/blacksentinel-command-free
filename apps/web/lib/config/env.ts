// ============================================================================
// BlackSentinel Command - Environment Validation
// Validates all required environment variables at startup
// ============================================================================

interface EnvConfig {
  key: string;
  required: boolean;
  default?: string;
  validator?: (value: string) => boolean;
  description: string;
}

const envSchema: EnvConfig[] = [
  // Application
  {
    key: 'NODE_ENV',
    required: true,
    default: 'development',
    validator: (v) => ['development', 'production', 'test'].includes(v),
    description: 'Application environment',
  },
  {
    key: 'APP_NAME',
    required: true,
    default: 'BlackSentinel Command',
    description: 'Application name',
  },
  {
    key: 'APP_VERSION',
    required: true,
    default: '1.0.0',
    description: 'Application version',
  },

  // Security
  {
    key: 'JWT_SECRET',
    required: true,
    validator: (v) => v.length >= 32,
    description: 'JWT signing secret (min 32 characters)',
  },
  {
    key: 'JWT_REFRESH_SECRET',
    required: true,
    validator: (v) => v.length >= 32,
    description: 'JWT refresh token secret (min 32 characters)',
  },
  {
    key: 'ENCRYPTION_KEY',
    required: true,
    validator: (v) => v.length >= 32,
    description: 'Data encryption key (min 32 characters)',
  },
  {
    key: 'SESSION_SECRET',
    required: true,
    validator: (v) => v.length >= 32,
    description: 'Session encryption secret (min 32 characters)',
  },
  {
    key: 'CSRF_SECRET',
    required: true,
    validator: (v) => v.length >= 32,
    description: 'CSRF protection secret (min 32 characters)',
  },

  // Database
  {
    key: 'DATABASE_URL',
    required: true,
    validator: (v) => v.startsWith('postgresql://'),
    description: 'PostgreSQL connection URL',
  },

  // Redis
  {
    key: 'REDIS_URL',
    required: true,
    validator: (v) => v.startsWith('redis://') || v.startsWith('rediss://'),
    description: 'Redis connection URL',
  },

  // Neo4j
  {
    key: 'NEO4J_URI',
    required: true,
    validator: (v) => v.startsWith('bolt://'),
    description: 'Neo4j connection URI',
  },
  {
    key: 'NEO4J_USER',
    required: true,
    description: 'Neo4j username',
  },
  {
    key: 'NEO4J_PASSWORD',
    required: true,
    description: 'Neo4j password',
  },

  // Elasticsearch
  {
    key: 'ELASTICSEARCH_URL',
    required: true,
    validator: (v) => v.startsWith('http://') || v.startsWith('https://'),
    description: 'Elasticsearch URL',
  },

  // AI
  {
    key: 'OPENAI_API_KEY',
    required: false,
    description: 'OpenAI API key for AI features',
  },

  // CORS
  {
    key: 'CORS_ORIGIN',
    required: true,
    validator: (v) => v.startsWith('http://') || v.startsWith('https://'),
    description: 'Allowed CORS origin',
  },

  // Rate Limiting
  {
    key: 'RATE_LIMIT_WINDOW_MS',
    required: false,
    default: '900000',
    validator: (v) => parseInt(v) > 0,
    description: 'Rate limit window in milliseconds',
  },
  {
    key: 'RATE_LIMIT_MAX_REQUESTS',
    required: false,
    default: '100',
    validator: (v) => parseInt(v) > 0,
    description: 'Max requests per window',
  },
];

// ============================================================================
// Validation Function
// ============================================================================

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  config: Record<string, string>;
}

export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const config: Record<string, string> = {};

  for (const envConfig of envSchema) {
    const value = process.env[envConfig.key];

    // Check if required
    if (envConfig.required && !value) {
      errors.push(`Missing required environment variable: ${envConfig.key} - ${envConfig.description}`);
      continue;
    }

    // Use default if not set
    if (!value && envConfig.default) {
      config[envConfig.key] = envConfig.default;
      warnings.push(`Using default value for ${envConfig.key}: ${envConfig.default}`);
      continue;
    }

    // Validate if validator exists
    if (value && envConfig.validator && !envConfig.validator(value)) {
      errors.push(`Invalid value for environment variable: ${envConfig.key} - ${envConfig.description}`);
      continue;
    }

    // Set config
    if (value) {
      config[envConfig.key] = value;
    }
  }

  // Additional security checks
  if (config.NODE_ENV === 'production') {
    // Check for weak secrets in production
    const weakSecrets = [
      'secret',
      'password',
      'default',
      'changeme',
      '123456',
    ];

    for (const key of ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'ENCRYPTION_KEY']) {
      const value = config[key];
      if (value && weakSecrets.some(weak => value.toLowerCase().includes(weak))) {
        errors.push(`Weak secret detected for ${key}. Please use a cryptographically secure value.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    config,
  };
}

// ============================================================================
// Startup Validation
// ============================================================================

export function validateOnStartup(): void {
  console.log('\nBlackSentinel Command - Environment Validation\n');

  const result = validateEnvironment();

  if (result.warnings.length > 0) {
    console.log('Warnings:');
    result.warnings.forEach((warning) => {
      console.log(`   - ${warning}`);
    });
    console.log('');
  }

  if (!result.valid) {
    console.log('Validation Failed:');
    result.errors.forEach((error) => {
      console.log(`   - ${error}`);
    });
    console.log('\nPlease check your .env file and ensure all required variables are set.\n');
    process.exit(1);
  }

  console.log('Environment validation passed\n');

  // Log configuration summary (without sensitive values)
  console.log('Configuration Summary:');
  console.log(`   - Environment: ${result.config.NODE_ENV}`);
  console.log(`   - Version: ${result.config.APP_VERSION}`);
  console.log(`   - Database: ${result.config.DATABASE_URL ? '[OK] Configured' : '[FAIL] Not configured'}`);
  console.log(`   - Redis: ${result.config.REDIS_URL ? '[OK] Configured' : '[FAIL] Not configured'}`);
  console.log(`   - Neo4j: ${result.config.NEO4J_URI ? '[OK] Configured' : '[FAIL] Not configured'}`);
  console.log(`   - Elasticsearch: ${result.config.ELASTICSEARCH_URL ? '[OK] Configured' : '[FAIL] Not configured'}`);
  console.log(`   - AI Engine: ${result.config.OPENAI_API_KEY ? '[OK] Configured' : '[OPTIONAL]'}`);
  console.log('');
}

// ============================================================================
// Exports
// ============================================================================

export default {
  validateEnvironment,
  validateOnStartup,
};
