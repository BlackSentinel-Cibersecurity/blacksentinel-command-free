// ============================================================================
// BlackSentinel Command - Universal Deployment Configuration
// Supports: Docker, Kubernetes, AWS, Azure, GCP, On-Premise, Air-Gapped
// ============================================================================

import { DeploymentConfig, TenantTier, DeploymentMode } from '../types/tenant';

// ============================================================================
// Base Configuration Templates
// ============================================================================

export const DEPLOYMENT_TEMPLATES: Record<DeploymentMode, Partial<DeploymentConfig>> = {
  'docker': {
    mode: 'docker',
    infrastructure: {
      provider: 'on-premise',
      availabilityZones: 1,
      autoScaling: false,
    },
    database: {
      host: 'postgres',
      port: 5432,
      name: 'blacksentinel',
      ssl: false,
      replication: false,
    },
    cache: {
      host: 'redis',
      port: 6379,
      cluster: false,
    },
    search: {
      host: 'elasticsearch',
      port: 9200,
      nodes: 1,
    },
    graph: {
      host: 'neo4j',
      port: 7687,
      cluster: false,
    },
    queue: {
      brokers: ['kafka:9092'],
      ssl: false,
    },
    storage: {
      type: 'local',
    },
    monitoring: {
      prometheus: true,
      grafana: true,
      sentry: false,
    },
  },
  
  'kubernetes': {
    mode: 'kubernetes',
    infrastructure: {
      availabilityZones: 3,
      autoScaling: true,
    },
    database: {
      host: 'blacksentinel-postgres',
      port: 5432,
      name: 'blacksentinel',
      ssl: true,
      replication: true,
    },
    cache: {
      host: 'blacksentinel-redis',
      port: 6379,
      cluster: true,
    },
    search: {
      host: 'blacksentinel-elasticsearch',
      port: 9200,
      nodes: 3,
    },
    graph: {
      host: 'blacksentinel-neo4j',
      port: 7687,
      cluster: true,
    },
    queue: {
      brokers: ['blacksentinel-kafka:9092'],
      ssl: true,
    },
    storage: {
      type: 's3',
    },
    monitoring: {
      prometheus: true,
      grafana: true,
      sentry: true,
    },
  },
  
  'cloud': {
    mode: 'cloud',
    infrastructure: {
      availabilityZones: 3,
      autoScaling: true,
    },
    database: {
      host: '', // Will be set based on provider
      port: 5432,
      name: 'blacksentinel',
      ssl: true,
      replication: true,
    },
    cache: {
      host: '',
      port: 6379,
      cluster: true,
    },
    search: {
      host: '',
      port: 9200,
      nodes: 3,
    },
    graph: {
      host: '',
      port: 7687,
      cluster: true,
    },
    queue: {
      brokers: [],
      ssl: true,
    },
    storage: {
      type: 's3',
    },
    monitoring: {
      prometheus: true,
      grafana: true,
      sentry: true,
    },
  },
  
  'on-premise': {
    mode: 'on-premise',
    infrastructure: {
      provider: 'on-premise',
      availabilityZones: 1,
      autoScaling: false,
    },
    database: {
      host: 'localhost',
      port: 5432,
      name: 'blacksentinel',
      ssl: true,
      replication: false,
    },
    cache: {
      host: 'localhost',
      port: 6379,
      cluster: false,
    },
    search: {
      host: 'localhost',
      port: 9200,
      nodes: 1,
    },
    graph: {
      host: 'localhost',
      port: 7687,
      cluster: false,
    },
    queue: {
      brokers: ['localhost:9092'],
      ssl: false,
    },
    storage: {
      type: 'local',
    },
    monitoring: {
      prometheus: true,
      grafana: true,
      sentry: false,
    },
  },
  
  'hybrid': {
    mode: 'hybrid',
    infrastructure: {
      availabilityZones: 2,
      autoScaling: true,
    },
    database: {
      host: '', // Cloud managed
      port: 5432,
      name: 'blacksentinel',
      ssl: true,
      replication: true,
    },
    cache: {
      host: '', // Cloud managed
      port: 6379,
      cluster: true,
    },
    search: {
      host: '', // Self-hosted
      port: 9200,
      nodes: 2,
    },
    graph: {
      host: '', // Self-hosted
      port: 7687,
      cluster: false,
    },
    queue: {
      brokers: [], // Cloud managed
      ssl: true,
    },
    storage: {
      type: 's3',
    },
    monitoring: {
      prometheus: true,
      grafana: true,
      sentry: true,
    },
  },
  
  'air-gapped': {
    mode: 'air-gapped',
    infrastructure: {
      provider: 'on-premise',
      availabilityZones: 1,
      autoScaling: false,
    },
    database: {
      host: 'localhost',
      port: 5432,
      name: 'blacksentinel',
      ssl: false,
      replication: false,
    },
    cache: {
      host: 'localhost',
      port: 6379,
      cluster: false,
    },
    search: {
      host: 'localhost',
      port: 9200,
      nodes: 1,
    },
    graph: {
      host: 'localhost',
      port: 7687,
      cluster: false,
    },
    queue: {
      brokers: ['localhost:9092'],
      ssl: false,
    },
    storage: {
      type: 'local',
    },
    monitoring: {
      prometheus: false,
      grafana: false,
      sentry: false,
    },
  },
};

// ============================================================================
// Cloud Provider Configurations
// ============================================================================

export interface CloudProviderConfig {
  name: string;
  services: {
    database: string;
    cache: string;
    search: string;
    storage: string;
    queue: string;
    monitoring: string;
  };
  regions: string[];
}

export const CLOUD_PROVIDERS: Record<string, CloudProviderConfig> = {
  aws: {
    name: 'Amazon Web Services',
    services: {
      database: 'RDS PostgreSQL',
      cache: 'ElastiCache Redis',
      search: 'OpenSearch',
      storage: 'S3',
      queue: 'MSK (Kafka)',
      monitoring: 'CloudWatch',
    },
    regions: [
      'us-east-1',
      'us-east-2',
      'us-west-1',
      'us-west-2',
      'eu-west-1',
      'eu-west-2',
      'eu-central-1',
      'ap-southeast-1',
      'ap-northeast-1',
    ],
  },
  azure: {
    name: 'Microsoft Azure',
    services: {
      database: 'Azure Database for PostgreSQL',
      cache: 'Azure Cache for Redis',
      search: 'Azure Cognitive Search',
      storage: 'Blob Storage',
      queue: 'Event Hubs',
      monitoring: 'Azure Monitor',
    },
    regions: [
      'eastus',
      'eastus2',
      'westus',
      'westus2',
      'northeurope',
      'westeurope',
      'southeastasia',
      'japaneast',
    ],
  },
  gcp: {
    name: 'Google Cloud Platform',
    services: {
      database: 'Cloud SQL',
      cache: 'Memorystore Redis',
      search: 'Elasticsearch on GKE',
      storage: 'Cloud Storage',
      queue: 'Pub/Sub + Kafka',
      monitoring: 'Cloud Monitoring',
    },
    regions: [
      'us-central1',
      'us-east1',
      'us-west1',
      'europe-west1',
      'europe-west2',
      'asia-east1',
      'asia-southeast1',
    ],
  },
};

// ============================================================================
// Tier-Based Resource Allocation
// ============================================================================

export interface ResourceAllocation {
  tier: TenantTier;
  compute: {
    cpu: string;
    memory: string;
    replicas: number;
  };
  storage: {
    database: string;
    cache: string;
    search: string;
    files: string;
  };
  limits: {
    maxConnections: number;
    maxQueriesPerSecond: number;
    maxStorageGB: number;
  };
}

export const RESOURCE_ALLOCATIONS: Record<TenantTier, ResourceAllocation> = {
  starter: {
    tier: 'starter',
    compute: {
      cpu: '2 vCPU',
      memory: '4 GB',
      replicas: 1,
    },
    storage: {
      database: '50 GB',
      cache: '2 GB',
      search: '20 GB',
      files: '50 GB',
    },
    limits: {
      maxConnections: 100,
      maxQueriesPerSecond: 50,
      maxStorageGB: 50,
    },
  },
  professional: {
    tier: 'professional',
    compute: {
      cpu: '4 vCPU',
      memory: '8 GB',
      replicas: 2,
    },
    storage: {
      database: '200 GB',
      cache: '8 GB',
      search: '100 GB',
      files: '500 GB',
    },
    limits: {
      maxConnections: 500,
      maxQueriesPerSecond: 200,
      maxStorageGB: 500,
    },
  },
  enterprise: {
    tier: 'enterprise',
    compute: {
      cpu: '8 vCPU',
      memory: '16 GB',
      replicas: 3,
    },
    storage: {
      database: '1 TB',
      cache: '32 GB',
      search: '500 GB',
      files: '5 TB',
    },
    limits: {
      maxConnections: 2000,
      maxQueriesPerSecond: 1000,
      maxStorageGB: 5000,
    },
  },
  government: {
    tier: 'government',
    compute: {
      cpu: '16 vCPU',
      memory: '32 GB',
      replicas: 5,
    },
    storage: {
      database: '5 TB',
      cache: '128 GB',
      search: '2 TB',
      files: '50 TB',
    },
    limits: {
      maxConnections: 10000,
      maxQueriesPerSecond: 5000,
      maxStorageGB: 50000,
    },
  },
};

// ============================================================================
// Docker Compose Configurations by Tier
// ============================================================================

export interface DockerComposeConfig {
  version: string;
  services: Record<string, any>;
  volumes: Record<string, any>;
  networks: Record<string, any>;
}

export function generateDockerCompose(tier: TenantTier, mode: DeploymentMode): DockerComposeConfig {
  const base = DEPLOYMENT_TEMPLATES[mode] || DEPLOYMENT_TEMPLATES['docker'];
  const resources = RESOURCE_ALLOCATIONS[tier];
  
  return {
    version: '3.8',
    services: {
      app: {
        build: {
          context: '.',
          dockerfile: 'Dockerfile',
          target: 'runner',
        },
        ports: ['3000:3000'],
        environment: [
          `NODE_ENV=production`,
          `TIER=${tier}`,
          `DATABASE_URL=postgresql://blacksentinel:blacksentinel@${base.database.host}:${base.database.port}/${base.database.name}`,
          `REDIS_URL=redis://${base.cache.host}:${base.cache.port}`,
          `NEO4J_URI=bolt://${base.graph.host}:${base.graph.port}`,
          `ELASTICSEARCH_URL=http://${base.search.host}:${base.search.port}`,
          `KAFKA_BROKERS=${base.queue.brokers.join(',')}`,
        ],
        deploy: {
          resources: {
            limits: {
              cpus: resources.compute.cpu.replace(' vCPU', ''),
              memory: resources.compute.memory,
            },
          },
        },
        healthcheck: {
          test: ['CMD', 'node', '-e', "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"],
          interval: '30s',
          timeout: '3s',
          retries: 3,
        },
        depends_on: {
          postgres: { condition: 'service_healthy' },
          redis: { condition: 'service_healthy' },
        },
        networks: ['blacksentinel'],
      },
      postgres: {
        image: 'postgres:16-alpine',
        ports: ['5432:5432'],
        environment: [
          'POSTGRES_DB=blacksentinel',
          'POSTGRES_USER=blacksentinel',
          'POSTGRES_PASSWORD=blacksentinel',
        ],
        volumes: ['postgres_data:/var/lib/postgresql/data'],
        deploy: {
          resources: {
            limits: {
              memory: resources.compute.memory,
            },
          },
        },
        healthcheck: {
          test: ['CMD-SHELL', 'pg_isready -U blacksentinel'],
          interval: '10s',
          timeout: '5s',
          retries: 5,
        },
        networks: ['blacksentinel'],
      },
      redis: {
        image: 'redis:7-alpine',
        ports: ['6379:6379'],
        command: 'redis-server --appendonly yes',
        volumes: ['redis_data:/data'],
        healthcheck: {
          test: ['CMD', 'redis-cli', 'ping'],
          interval: '10s',
          timeout: '5s',
          retries: 5,
        },
        networks: ['blacksentinel'],
      },
      elasticsearch: {
        image: 'docker.elastic.co/elasticsearch/elasticsearch:8.12.0',
        ports: ['9200:9200'],
        environment: [
          'discovery.type=single-node',
          'xpack.security.enabled=false',
          'ES_JAVA_OPTS=-Xms512m -Xmx512m',
        ],
        volumes: ['elasticsearch_data:/usr/share/elasticsearch/data'],
        healthcheck: {
          test: ['CMD-SHELL', 'curl -f http://localhost:9200/_cluster/health || exit 1'],
          interval: '30s',
          timeout: '10s',
          retries: 5,
        },
        networks: ['blacksentinel'],
      },
      neo4j: {
        image: 'neo4j:5.15-community',
        ports: ['7474:7474', '7687:7687'],
        environment: [
          'NEO4J_AUTH=neo4j/blacksentinel',
        ],
        volumes: ['neo4j_data:/data'],
        healthcheck: {
          test: ['CMD', 'neo4j', 'status'],
          interval: '10s',
          timeout: '5s',
          retries: 5,
        },
        networks: ['blacksentinel'],
      },
      kafka: {
        image: 'confluentinc/cp-kafka:7.5.0',
        ports: ['9092:9092'],
        environment: [
          'KAFKA_NODE_ID=1',
          'KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT',
          'KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092',
          'KAFKA_PROCESS_ROLES=broker,controller',
          'KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka:29093',
          'KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:29093',
          'KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT',
          'KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER',
          "CLUSTER_ID='MkU3OEVBNTcwNTJENDM2Qk'",
        ],
        networks: ['blacksentinel'],
      },
    },
    volumes: {
      postgres_data: {},
      redis_data: {},
      elasticsearch_data: {},
      neo4j_data: {},
    },
    networks: {
      blacksentinel: {
        driver: 'bridge',
      },
    },
  };
}

// ============================================================================
// Kubernetes Manifests Generator
// ============================================================================

export interface KubernetesManifest {
  apiVersion: string;
  kind: string;
  metadata: Record<string, any>;
  spec: Record<string, any>;
}

export function generateKubernetesManifests(tier: TenantTier, mode: DeploymentMode): KubernetesManifest[] {
  const resources = RESOURCE_ALLOCATIONS[tier];
  const replicas = resources.compute.replicas;
  
  return [
    // Namespace
    {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: 'blacksentinel',
        labels: {
          'app.kubernetes.io/name': 'blacksentinel',
          'app.kubernetes.io/instance': 'blacksentinel',
          'app.kubernetes.io/version': '1.0.0',
        },
      },
      spec: {},
    },
    // Deployment
    {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: 'blacksentinel-command',
        namespace: 'blacksentinel',
        labels: {
          app: 'blacksentinel-command',
        },
      },
      spec: {
        replicas,
        selector: {
          matchLabels: {
            app: 'blacksentinel-command',
          },
        },
        template: {
          metadata: {
            labels: {
              app: 'blacksentinel-command',
            },
          },
          spec: {
            containers: [
              {
                name: 'blacksentinel',
                image: 'ghcr.io/blacksentinel/command:latest',
                ports: [
                  {
                    containerPort: 3000,
                  },
                ],
                env: [
                  {
                    name: 'NODE_ENV',
                    value: 'production',
                  },
                  {
                    name: 'TIER',
                    value: tier,
                  },
                ],
                resources: {
                  requests: {
                    cpu: resources.compute.cpu.replace(' vCPU', ''),
                    memory: resources.compute.memory,
                  },
                  limits: {
                    cpu: resources.compute.cpu.replace(' vCPU', ''),
                    memory: resources.compute.memory,
                  },
                },
                livenessProbe: {
                  httpGet: {
                    path: '/api/health',
                    port: 3000,
                  },
                  initialDelaySeconds: 30,
                  periodSeconds: 10,
                },
                readinessProbe: {
                  httpGet: {
                    path: '/api/health',
                    port: 3000,
                  },
                  initialDelaySeconds: 5,
                  periodSeconds: 5,
                },
              },
            ],
          },
        },
      },
      spec: {},
    },
    // Service
    {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: 'blacksentinel-command',
        namespace: 'blacksentinel',
      },
      spec: {
        selector: {
          app: 'blacksentinel-command',
        },
        ports: [
          {
            port: 80,
            targetPort: 3000,
          },
        ],
        type: 'ClusterIP',
      },
      spec: {},
    },
    // Ingress
    {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'Ingress',
      metadata: {
        name: 'blacksentinel-command',
        namespace: 'blacksentinel',
        annotations: {
          'kubernetes.io/ingress.class': 'nginx',
          'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
        },
      },
      spec: {
        tls: [
          {
            hosts: ['command.blacksentinel.io'],
            secretName: 'blacksentinel-tls',
          },
        ],
        rules: [
          {
            host: 'command.blacksentinel.io',
            http: {
              paths: [
                {
                  path: '/',
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: 'blacksentinel-command',
                      port: {
                        number: 80,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      spec: {},
    },
  ];
}

// ============================================================================
// Deployment Checklist
// ============================================================================

export interface DeploymentChecklistItem {
  id: string;
  category: string;
  description: string;
  required: boolean;
  tiers: TenantTier[];
}

export const DEPLOYMENT_CHECKLIST: DeploymentChecklistItem[] = [
  // Infrastructure
  {
    id: 'infra-1',
    category: 'Infrastructure',
    description: 'Provision compute resources (VMs/containers)',
    required: true,
    tiers: ['starter', 'professional', 'enterprise', 'government'],
  },
  {
    id: 'infra-2',
    category: 'Infrastructure',
    description: 'Configure networking and firewall rules',
    required: true,
    tiers: ['starter', 'professional', 'enterprise', 'government'],
  },
  {
    id: 'infra-3',
    category: 'Infrastructure',
    description: 'Set up load balancer',
    required: false,
    tiers: ['professional', 'enterprise', 'government'],
  },
  {
    id: 'infra-4',
    category: 'Infrastructure',
    description: 'Configure auto-scaling policies',
    required: false,
    tiers: ['enterprise', 'government'],
  },
  
  // Database
  {
    id: 'db-1',
    category: 'Database',
    description: 'Provision PostgreSQL instance',
    required: true,
    tiers: ['starter', 'professional', 'enterprise', 'government'],
  },
  {
    id: 'db-2',
    category: 'Database',
    description: 'Configure database replication',
    required: false,
    tiers: ['professional', 'enterprise', 'government'],
  },
  {
    id: 'db-3',
    category: 'Database',
    description: 'Set up automated backups',
    required: true,
    tiers: ['starter', 'professional', 'enterprise', 'government'],
  },
  
  // Security
  {
    id: 'sec-1',
    category: 'Security',
    description: 'Configure SSL/TLS certificates',
    required: true,
    tiers: ['starter', 'professional', 'enterprise', 'government'],
  },
  {
    id: 'sec-2',
    category: 'Security',
    description: 'Set up WAF (Web Application Firewall)',
    required: false,
    tiers: ['enterprise', 'government'],
  },
  {
    id: 'sec-3',
    category: 'Security',
    description: 'Configure DDoS protection',
    required: false,
    tiers: ['enterprise', 'government'],
  },
  {
    id: 'sec-4',
    category: 'Security',
    description: 'Enable audit logging',
    required: true,
    tiers: ['professional', 'enterprise', 'government'],
  },
  
  // Monitoring
  {
    id: 'mon-1',
    category: 'Monitoring',
    description: 'Set up Prometheus metrics',
    required: true,
    tiers: ['starter', 'professional', 'enterprise', 'government'],
  },
  {
    id: 'mon-2',
    category: 'Monitoring',
    description: 'Configure Grafana dashboards',
    required: false,
    tiers: ['professional', 'enterprise', 'government'],
  },
  {
    id: 'mon-3',
    category: 'Monitoring',
    description: 'Set up Sentry error tracking',
    required: false,
    tiers: ['enterprise', 'government'],
  },
  
  // Compliance
  {
    id: 'comp-1',
    category: 'Compliance',
    description: 'Document security policies',
    required: true,
    tiers: ['enterprise', 'government'],
  },
  {
    id: 'comp-2',
    category: 'Compliance',
    description: 'Configure data residency',
    required: false,
    tiers: ['government'],
  },
  {
    id: 'comp-3',
    category: 'Compliance',
    description: 'Set up FedRAMP compliance',
    required: false,
    tiers: ['government'],
  },
];
