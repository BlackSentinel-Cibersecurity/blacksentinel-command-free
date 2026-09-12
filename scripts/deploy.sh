#!/bin/bash
# ============================================================================
# BlackSentinel Command - Universal Deployment Script
# Supports: Docker, Kubernetes, AWS, Azure, GCP, On-Premise
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# Configuration
# ============================================================================

APP_NAME="blacksentinel-command"
VERSION="1.0.0"
NAMESPACE="blacksentinel"

# ============================================================================
# Functions
# ============================================================================

print_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║           BLACKSENTINEL COMMAND - DEPLOYMENT SCRIPT          ║"
    echo "║                                                              ║"
    echo "║           Unified Cybersecurity Command Center               ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${YELLOW}Docker Compose not found. Using 'docker compose' instead.${NC}"
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    echo -e "${GREEN}Prerequisites check passed.${NC}"
}

# ============================================================================
# Docker Deployment
# ============================================================================

deploy_docker() {
    local tier=${1:-"starter"}
    local mode=${2:-"development"}
    
    echo -e "${YELLOW}Deploying with Docker (Tier: $tier, Mode: $mode)...${NC}"
    
    # Create environment file
    cat > .env << EOF
# BlackSentinel Command - Environment Configuration
NODE_ENV=$mode
APP_VERSION=$VERSION
TIER=$tier

# Database
DATABASE_URL=postgresql://blacksentinel:blacksentinel@postgres:5432/blacksentinel
REDIS_URL=redis://redis:6379
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=blacksentinel
ELASTICSEARCH_URL=http://elasticsearch:9200
KAFKA_BROKERS=kafka:9092

# Security
JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

# Features
FEATURE_AI_ENABLED=true
FEATURE_MARKETPLACE_ENABLED=true
FEATURE_MULTI_TENANT=true
EOF
    
    # Build and start containers
    $COMPOSE_CMD down -v 2>/dev/null || true
    $COMPOSE_CMD up -d --build
    
    echo -e "${GREEN}Docker deployment complete!${NC}"
    echo -e "${GREEN}Application available at: http://localhost:3000${NC}"
}

# ============================================================================
# Kubernetes Deployment
# ============================================================================

deploy_kubernetes() {
    local tier=${1:-"starter"}
    local environment=${2:-"staging"}
    
    echo -e "${YELLOW}Deploying to Kubernetes (Tier: $tier, Env: $environment)...${NC}"
    
    # Create namespace
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply base manifests
    kubectl apply -f k8s/base/ -n $NAMESPACE
    
    # Apply environment-specific overlays
    if [ -d "k8s/overlays/$environment" ]; then
        kubectl apply -f k8s/overlays/$environment/ -n $NAMESPACE
    fi
    
    # Wait for deployment
    kubectl rollout status deployment/$APP_NAME -n $NAMESPACE
    
    echo -e "${GREEN}Kubernetes deployment complete!${NC}"
    kubectl get pods -n $NAMESPACE
}

# ============================================================================
# AWS Deployment
# ============================================================================

deploy_aws() {
    local tier=${1:-"starter"}
    local region=${2:-"us-east-1"}
    
    echo -e "${YELLOW}Deploying to AWS (Tier: $tier, Region: $region)...${NC}"
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    # Check EKS cluster
    if ! aws eks describe-cluster --name $APP_NAME --region $region &> /dev/null; then
        echo -e "${YELLOW}EKS cluster not found. Creating...${NC}"
        # Create EKS cluster (simplified)
        eksctl create cluster \
            --name $APP_NAME \
            --region $region \
            --nodes 3 \
            --node-type t3.medium
    fi
    
    # Update kubeconfig
    aws eks update-kubeconfig --name $APP_NAME --region $region
    
    # Deploy to Kubernetes
    deploy_kubernetes $tier production
}

# ============================================================================
# Azure Deployment
# ============================================================================

deploy_azure() {
    local tier=${1:-"starter"}
    local resource_group=${2:-"blacksentinel-rg"}
    local location=${3:-"eastus"}
    
    echo -e "${YELLOW}Deploying to Azure (Tier: $tier, RG: $resource_group)...${NC}"
    
    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    # Create resource group
    az group create --name $resource_group --location $location
    
    # Create AKS cluster
    az aks create \
        --resource-group $resource_group \
        --name $APP_NAME \
        --node-count 3 \
        --enable-addons monitoring \
        --generate-ssh-keys
    
    # Get credentials
    az aks get-credentials \
        --resource-group $resource_group \
        --name $APP_NAME
    
    # Deploy to Kubernetes
    deploy_kubernetes $tier production
}

# ============================================================================
# GCP Deployment
# ============================================================================

deploy_gcp() {
    local tier=${1:-"starter"}
    local project=${2:-"blacksentinel-project"}
    local region=${3:-"us-central1"}
    
    echo -e "${YELLOW}Deploying to GCP (Tier: $tier, Project: $project)...${NC}"
    
    # Check gcloud CLI
    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}gcloud CLI is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    # Set project
    gcloud config set project $project
    
    # Create GKE cluster
    gcloud container clusters create $APP_NAME \
        --zone $region \
        --num-nodes 3 \
        --enable-autoscaling \
        --min-nodes 1 \
        --max-nodes 5
    
    # Get credentials
    gcloud container clusters get-credentials $APP_NAME --zone $region
    
    # Deploy to Kubernetes
    deploy_kubernetes $tier production
}

# ============================================================================
# On-Premise Deployment
# ============================================================================

deploy_on_premise() {
    local tier=${1:-"starter"}
    
    echo -e "${YELLOW}Deploying On-Premise (Tier: $tier)...${NC}"
    
    # Check if Docker is available
    check_prerequisites
    
    # Deploy with Docker Compose
    deploy_docker $tier production
    
    echo -e "${GREEN}On-Premise deployment complete!${NC}"
    echo -e "${GREEN}Application available at: http://localhost:3000${NC}"
}

# ============================================================================
# Status Check
# ============================================================================

check_status() {
    echo -e "${YELLOW}Checking deployment status...${NC}"
    
    if command -v kubectl &> /dev/null && kubectl get namespace $NAMESPACE &> /dev/null; then
        echo -e "${GREEN}Kubernetes deployment found:${NC}"
        kubectl get pods -n $NAMESPACE
        kubectl get services -n $NAMESPACE
    elif $COMPOSE_CMD ps &> /dev/null; then
        echo -e "${GREEN}Docker Compose deployment found:${NC}"
        $COMPOSE_CMD ps
    else
        echo -e "${RED}No deployment found.${NC}"
    fi
}

# ============================================================================
# Cleanup
# ============================================================================

cleanup() {
    echo -e "${YELLOW}Cleaning up deployment...${NC}"
    
    if command -v kubectl &> /dev/null && kubectl get namespace $NAMESPACE &> /dev/null; then
        kubectl delete namespace $NAMESPACE
    fi
    
    if $COMPOSE_CMD ps &> /dev/null; then
        $COMPOSE_CMD down -v
    fi
    
    echo -e "${GREEN}Cleanup complete.${NC}"
}

# ============================================================================
# Help
# ============================================================================

show_help() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  docker        Deploy with Docker Compose"
    echo "  kubernetes    Deploy to Kubernetes"
    echo "  aws           Deploy to AWS EKS"
    echo "  azure         Deploy to Azure AKS"
    echo "  gcp           Deploy to GCP GKE"
    echo "  on-premise    Deploy on-premise"
    echo "  status        Check deployment status"
    echo "  cleanup       Remove deployment"
    echo "  help          Show this help message"
    echo ""
    echo "Options:"
    echo "  --tier        Tier: starter, professional, enterprise, government (default: starter)"
    echo "  --env         Environment: development, staging, production (default: development)"
    echo ""
    echo "Examples:"
    echo "  $0 docker --tier starter --env development"
    echo "  $0 kubernetes --tier enterprise --env production"
    echo "  $0 aws --tier professional --region us-west-2"
}

# ============================================================================
# Main Script
# ============================================================================

print_banner

# Parse arguments
COMMAND=""
TIER="starter"
ENVIRONMENT="development"
REGION=""

while [[ $# -gt 0 ]]; do
    case $1 in
        docker|kubernetes|aws|azure|gcp|on-premise|status|cleanup|help)
            COMMAND=$1
            shift
            ;;
        --tier)
            TIER=$2
            shift 2
            ;;
        --env)
            ENVIRONMENT=$2
            shift 2
            ;;
        --region)
            REGION=$2
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Execute command
case $COMMAND in
    docker)
        check_prerequisites
        deploy_docker $TIER $ENVIRONMENT
        ;;
    kubernetes)
        deploy_kubernetes $TIER $ENVIRONMENT
        ;;
    aws)
        deploy_aws $TIER ${REGION:-"us-east-1"}
        ;;
    azure)
        deploy_azure $TIER
        ;;
    gcp)
        deploy_gcp $TIER
        ;;
    on-premise)
        deploy_on_premise $TIER
        ;;
    status)
        check_status
        ;;
    cleanup)
        cleanup
        ;;
    help|*)
        show_help
        ;;
esac
