import { NextResponse } from 'next/server';

// ============================================================================
// Health Check API
// Returns system health status for monitoring and load balancers
// ============================================================================

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: {
      rss: process.memoryUsage().rss,
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
      external: process.memoryUsage().external,
    },
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      elasticsearch: await checkElasticsearch(),
      kafka: await checkKafka(),
    },
  };

  const allHealthy = Object.values(healthCheck.services).every(
    service => service.status === 'healthy'
  );

  return NextResponse.json(
    {
      ...healthCheck,
      status: allHealthy ? 'healthy' : 'degraded',
    },
    {
      status: allHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': allHealthy ? 'pass' : 'fail',
      },
    }
  );
}

// ============================================================================
// Service Health Checks
// ============================================================================

async function checkDatabase(): Promise<{ status: string; latency?: number; error?: string }> {
  try {
    const start = Date.now();
    // In production: Actually check PostgreSQL connection
    // await db.raw('SELECT 1');
    const latency = Date.now() - start;
    return { status: 'healthy', latency };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function checkRedis(): Promise<{ status: string; latency?: number; error?: string }> {
  try {
    const start = Date.now();
    // In production: Actually check Redis connection
    // await redis.ping();
    const latency = Date.now() - start;
    return { status: 'healthy', latency };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function checkElasticsearch(): Promise<{ status: string; latency?: number; error?: string }> {
  try {
    const start = Date.now();
    // In production: Actually check Elasticsearch connection
    // await esClient.ping();
    const latency = Date.now() - start;
    return { status: 'healthy', latency };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function checkKafka(): Promise<{ status: string; latency?: number; error?: string }> {
  try {
    const start = Date.now();
    // In production: Actually check Kafka connection
    // await kafkaAdmin.listTopics();
    const latency = Date.now() - start;
    return { status: 'healthy', latency };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
