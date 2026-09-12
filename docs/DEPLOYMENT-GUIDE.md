# BlackSentinel Command - Deployment Guide

## Overview

BlackSentinel Command is a unified cybersecurity command center designed for enterprise deployment. This guide covers all deployment options, from local development to production cloud environments.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Azure Deployment](#azure-deployment)
6. [GCP Deployment](#gcp-deployment)
7. [On-Premise Deployment](#on-premise-deployment)
8. [Air-Gapped Deployment](#air-gapped-deployment)
9. [Multi-Tenant Configuration](#multi-tenant-configuration)
10. [Pricing & Licensing](#pricing--licensing)
11. [Security Configuration](#security-configuration)
12. [Monitoring & Observability](#monitoring--observability)
13. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Docker 24.0+ & Docker Compose v2.20+
- Node.js 20+ (for development)
- kubectl (for Kubernetes deployment)
- AWS CLI / Azure CLI / gcloud CLI (for cloud deployments)

### Local Development

```bash
# Clone the repository
git clone https://github.com/blacksentinel/command.git
cd command

# Start development environment
docker-compose up -d

# Access the application
open http://localhost:3000
```

### Production Deployment

```bash
# Deploy with Docker (Starter tier)
./scripts/deploy.sh docker --tier starter --env production

# Deploy to Kubernetes
./scripts/deploy.sh kubernetes --tier enterprise --env production

# Deploy to AWS
./scripts/deploy.sh aws --tier enterprise --region us-east-1
```

---

## Docker Deployment

### Development Mode

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production Mode

```bash
# Build production image
docker build -t blacksentinel/command:latest .

# Run with production configuration
docker run -d \
  --name blacksentinel \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://... \
  blacksentinel/command:latest
```

### Docker Compose Configuration

The `docker-compose.yml` includes:

- **App**: Next.js application
- **PostgreSQL**: Primary database
- **Redis**: Cache & sessions
- **Neo4j**: Graph database
- **Elasticsearch**: Search engine
- **Kafka**: Message queue
- **Prometheus**: Metrics
- **Grafana**: Dashboards

---

## Kubernetes Deployment

### Base Manifests

Located in `k8s/base/`:

- `deployment.yaml`: Application deployment
- `service.yaml`: Service definition
- `ingress.yaml`: Ingress configuration
- `configmap.yaml`: Environment variables
- `secrets.yaml`: Secrets management
- `hpa.yaml`: Horizontal Pod Autoscaler

### Environment Overlays

- `k8s/overlays/development/`
- `k8s/overlays/staging/`
- `k8s/overlays/production/`

### Deployment Commands

```bash
# Apply base manifests
kubectl apply -k k8s/base/

# Deploy to specific environment
kubectl apply -k k8s/overlays/production/

# Check status
kubectl get pods -n blacksentinel
kubectl rollout status deployment/blacksentinel-command -n blacksentinel
```

### Resource Allocation by Tier

| Tier | CPU | Memory | Replicas |
|------|-----|--------|----------|
| Starter | 2 vCPU | 4 GB | 1 |
| Professional | 4 vCPU | 8 GB | 2 |
| Enterprise | 8 vCPU | 16 GB | 3 |
| Government | 16 vCPU | 32 GB | 5 |

---

## AWS Deployment

### Prerequisites

- AWS CLI configured
- EKS cluster created
- ECR repository created

### Deployment Steps

```bash
# 1. Configure AWS CLI
aws configure

# 2. Create EKS cluster
eksctl create cluster \
  --name blacksentinel \
  --region us-east-1 \
  --nodes 3 \
  --node-type m5.large

# 3. Update kubeconfig
aws eks update-kubeconfig --name blacksentinel --region us-east-1

# 4. Build and push Docker image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker build -t blacksentinel .
docker tag blacksentinel:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/blacksentinel:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/blacksentinel:latest

# 5. Deploy to Kubernetes
kubectl apply -k k8s/overlays/production/
```

### AWS Services Used

- **EKS**: Kubernetes management
- **RDS**: Managed PostgreSQL
- **ElastiCache**: Managed Redis
- **OpenSearch**: Managed Elasticsearch
- **MSK**: Managed Kafka
- **S3**: Object storage
- **CloudWatch**: Monitoring
- **WAF**: Web Application Firewall

---

## Azure Deployment

### Prerequisites

- Azure CLI configured
- AKS cluster created
- Azure Container Registry (ACR)

### Deployment Steps

```bash
# 1. Login to Azure
az login

# 2. Create resource group
az group create --name blacksentinel-rg --location eastus

# 3. Create AKS cluster
az aks create \
  --resource-group blacksentinel-rg \
  --name blacksentinel \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# 4. Get credentials
az aks get-credentials --resource-group blacksentinel-rg --name blacksentinel

# 5. Build and push to ACR
az acr create --resource-group blacksentinel-rg --name blacksentinel --sku Basic
az acr build --registry blacksentinel --image blacksentinel:latest .

# 6. Deploy to Kubernetes
kubectl apply -k k8s/overlays/production/
```

### Azure Services Used

- **AKS**: Kubernetes management
- **Azure Database for PostgreSQL**: Managed database
- **Azure Cache for Redis**: Managed cache
- **Azure Cognitive Search**: Search service
- **Event Hubs**: Message streaming
- **Blob Storage**: Object storage
- **Azure Monitor**: Monitoring
- **Azure WAF**: Web Application Firewall

---

## GCP Deployment

### Prerequisites

- gcloud CLI configured
- GKE cluster created
- Container Registry

### Deployment Steps

```bash
# 1. Set project
gcloud config set project blacksentinel-project

# 2. Create GKE cluster
gcloud container clusters create blacksentinel \
  --zone us-central1-a \
  --num-nodes 3 \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 5

# 3. Get credentials
gcloud container clusters get-credentials blacksentinel --zone us-central1-a

# 4. Build and push to Container Registry
gcloud builds submit --tag gcr.io/blacksentinel-project/blacksentinel:latest

# 5. Deploy to Kubernetes
kubectl apply -k k8s/overlays/production/
```

### GCP Services Used

- **GKE**: Kubernetes management
- **Cloud SQL**: Managed PostgreSQL
- **Memorystore**: Managed Redis
- **Cloud Storage**: Object storage
- **Pub/Sub**: Message streaming
- **Cloud Monitoring**: Monitoring
- **Cloud Armor**: DDoS protection

---

## On-Premise Deployment

### Requirements

- Linux servers (Ubuntu 22.04 LTS recommended)
- Docker & Docker Compose
- Minimum 8 vCPU, 16 GB RAM per node

### Installation

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh

# 2. Install Docker Compose
sudo apt install docker-compose

# 3. Clone repository
git clone https://github.com/blacksentinel/command.git
cd command

# 4. Configure environment
cp .env.example .env
nano .env

# 5. Deploy
./scripts/deploy.sh on-premise --tier enterprise
```

### High Availability Setup

For production, deploy across multiple nodes:

```yaml
# docker-compose-ha.yml
version: '3.8'
services:
  app:
    deploy:
      replicas: 3
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres-primary:5432/db
  postgres:
    image: postgres:16-alpine
    command: postgres -c synchronous_commit=on
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass yourpassword
```

---

## Air-Gapped Deployment

For environments without internet access:

### Preparation (On Internet-Connected Machine)

```bash
# 1. Download all dependencies
npm ci
docker pull postgres:16-alpine
docker pull redis:7-alpine
docker pull neo4j:5.15-community
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.12.0
docker pull confluentinc/cp-kafka:7.5.0

# 2. Save Docker images
docker save -o images.tar \
  blacksentinel/command:latest \
  postgres:16-alpine \
  redis:7-alpine \
  neo4j:5.15-community \
  docker.elastic.co/elasticsearch/elasticsearch:8.12.0 \
  confluentinc/cp-kafka:7.5.0

# 3. Create offline package
tar -czf blacksentinel-offline.tar.gz \
  apps/ packages/ docker-compose.yml Dockerfile \
  images.tar node_modules/
```

### Installation (On Air-Gapped Machine)

```bash
# 1. Transfer package
scp blacksentinel-offline.tar.gz user@airgapped-server:/opt/

# 2. Extract
cd /opt
tar -xzf blacksentinel-offline.tar.gz

# 3. Load Docker images
docker load -i images.tar

# 4. Deploy
docker-compose up -d
```

---

## Multi-Tenant Configuration

### Tenant Isolation Levels

1. **Shared**: Multiple tenants share infrastructure
2. **Dedicated**: Separate compute resources per tenant
3. **Isolated**: Complete network and data isolation

### Configuration

```typescript
// packages/types/tenant.ts
export const tenantConfig = {
  isolation: 'dedicated',
  features: {
    soc: true,
    incidentResponse: true,
    threatIntelligence: true,
    aiCommand: true,
  },
  limits: {
    maxUsers: 100,
    maxAssets: 10000,
    storageGB: 1000,
  },
};
```

---

## Pricing & Licensing

### Pricing Tiers

| Tier | Base Price | Price/User | Max Users | Features |
|------|------------|------------|-----------|----------|
| Starter | $499/mo | $49/user | 10 | Core SOC, Incidents |
| Professional | $1,999/mo | $39/user | 50 | + AI, Automation |
| Enterprise | $9,999/mo | $29/user | 500 | + Digital Twin, Graph |
| Government | $49,999/mo | $99/user | 10,000 | + FedRAMP, NIST |

### Licensing Options

1. **Subscription**: Monthly/Annual billing
2. **Perpetual**: One-time license + maintenance
3. **Trial**: 30-day free trial
4. **NFR**: Not-for-resale for partners
5. **OEM**: White-label for integrators

### Implementation

```typescript
// packages/types/billing.ts
import { calculateBilling, generateLicense } from './billing';

const billing = calculateBilling('enterprise', 100, 5000, 'annual');
console.log(billing.totalAnnual); // $294,000

const license = generateLicense('tenant-123', 'enterprise', 'subscription', new Date());
```

---

## Security Configuration

### Environment Variables

```bash
# Security
JWT_SECRET=your-256-bit-secret
ENCRYPTION_KEY=your-256-bit-encryption-key
SESSION_SECRET=your-session-secret

# Authentication
OIDC_ISSUER_URL=https://your-oidc-provider.com
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret

# CORS
CORS_ORIGIN=https://command.blacksentinel.io
```

### SSL/TLS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name command.blacksentinel.io;

    ssl_certificate /etc/ssl/certs/blacksentinel.crt;
    ssl_certificate_key /etc/ssl/private/blacksentinel.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
}
```

---

## Monitoring & Observability

### Prometheus Configuration

```yaml
# config/prometheus/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'blacksentinel'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/api/metrics'
```

### Grafana Dashboards

Access Grafana at `http://localhost:3001`:

- **System Overview**: CPU, Memory, Disk
- **Application Metrics**: Request rate, Error rate, Latency
- **Business Metrics**: Users, Alerts, Incidents
- **Security Metrics**: Threats, Vulnerabilities, Compliance

### Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Database health
docker exec postgres pg_isready -U blacksentinel

# Redis health
docker exec redis redis-cli ping
```

---

## Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check logs
docker-compose logs app

# Verify environment
docker-compose exec app env

# Check database connection
docker-compose exec app npx prisma db push
```

#### Database Connection Issues

```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U blacksentinel -d blacksentinel

# Reset database
docker-compose exec postgres dropdb blacksentinel
docker-compose exec postgres createdb blacksentinel
```

#### Memory Issues

```bash
# Check container stats
docker stats

# Increase memory limit
# In docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 8G
```

### Logs Location

- **Application**: `docker-compose logs app`
- **PostgreSQL**: `docker-compose logs postgres`
- **Redis**: `docker-compose logs redis`
- **System**: `/var/log/blacksentinel/`

---

## Support

- **Documentation**: https://docs.blacksentinel.io
- **Support Email**: support@blacksentinel.io
- **Emergency**: +1-800-BLACK-911

---

*Last updated: June 2026*
