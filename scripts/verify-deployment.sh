#!/bin/bash
# ============================================================================
# BlackSentinel Command - Deployment Verification Script
# Verifies all components are running correctly
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# Functions
# ============================================================================

print_banner() {
    echo -e "${BLUE}"
    echo "================================================================"
    echo "           BLACKSENTINEL COMMAND - DEPLOYMENT VERIFICATION"
    echo "================================================================"
    echo -e "${NC}"
}

check_service() {
    local service=$1
    local url=$2
    local expected_status=$3
    
    echo -n "Checking $service... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}[OK]${NC}"
        return 0
    else
        echo -e "${RED}[FAIL] (HTTP $response)${NC}"
        return 1
    fi
}

check_docker_service() {
    local service=$1
    
    echo -n "Checking Docker service: $service... "
    
    if docker-compose ps | grep -q "$service.*Up"; then
        echo -e "${GREEN}[RUNNING]${NC}"
        return 0
    else
        echo -e "${RED}[NOT RUNNING]${NC}"
        return 1
    fi
}

check_kubernetes_service() {
    local service=$1
    local namespace=$2
    
    echo -n "Checking Kubernetes service: $service... "
    
    if kubectl get pods -n "$namespace" -l "app=$service" --no-headers 2>/dev/null | grep -q "Running"; then
        echo -e "${GREEN}[RUNNING]${NC}"
        return 0
    else
        echo -e "${RED}[NOT RUNNING]${NC}"
        return 1
    fi
}

# ============================================================================
# Main Verification
# ============================================================================

print_banner

echo -e "${YELLOW}Starting deployment verification...${NC}"
echo ""

ERRORS=0

# Check Docker services
echo -e "${BLUE}=== Docker Services ===${NC}"
check_docker_service "app" || ((ERRORS++))
check_docker_service "postgres" || ((ERRORS++))
check_docker_service "redis" || ((ERRORS++))
check_docker_service "neo4j" || ((ERRORS++))
check_docker_service "elasticsearch" || ((ERRORS++))
check_docker_service "kafka" || ((ERRORS++))
echo ""

# Check HTTP endpoints
echo -e "${BLUE}=== HTTP Endpoints ===${NC}"
check_service "Application" "http://localhost:3000" "200" || ((ERRORS++))
check_service "Health Check" "http://localhost:3000/api/health" "200" || ((ERRORS++))
check_service "Grafana" "http://localhost:3001" "200" || ((ERRORS++))
check_service "Prometheus" "http://localhost:9090" "200" || ((ERRORS++))
echo ""

# Check database connectivity
echo -e "${BLUE}=== Database Connectivity ===${NC}"
echo -n "Checking PostgreSQL... "
if docker-compose exec -T postgres pg_isready -U blacksentinel 2>/dev/null | grep -q "accepting connections"; then
    echo -e "${GREEN}[CONNECTED]${NC}"
else
    echo -e "${RED}[NOT CONNECTED]${NC}"
    ((ERRORS++))
fi

echo -n "Checking Redis... "
if docker-compose exec -T redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
    echo -e "${GREEN}[CONNECTED]${NC}"
else
    echo -e "${RED}[NOT CONNECTED]${NC}"
    ((ERRORS++))
fi
echo ""

# Check application health
echo -e "${BLUE}=== Application Health ===${NC}"
echo -n "Checking health endpoint... "
health_response=$(curl -s http://localhost:3000/api/health 2>/dev/null)
if echo "$health_response" | grep -q '"status":"healthy"'; then
    echo -e "${GREEN}[HEALTHY]${NC}"
else
    echo -e "${RED}[UNHEALTHY]${NC}"
    ((ERRORS++))
fi
echo ""

# Check ports
echo -e "${BLUE}=== Port Availability ===${NC}"
for port in 3000 5432 6379 7474 7687 9200 9092 9090 3001; do
    echo -n "Port $port... "
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}[IN USE]${NC}"
    else
        echo -e "${YELLOW}[NOT IN USE]${NC}"
    fi
done
echo ""

# Summary
echo -e "${BLUE}=== Verification Summary ===${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}All checks passed! Deployment is healthy.${NC}"
    echo ""
    echo -e "${GREEN}Access your application at: http://localhost:3000${NC}"
    echo -e "${GREEN}Grafana dashboard at: http://localhost:3001${NC}"
    echo -e "${GREEN}Prometheus metrics at: http://localhost:9090${NC}"
else
    echo -e "${RED}Found $ERRORS error(s). Please check the logs.${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "  1. Check container logs: docker-compose logs [service]"
    echo "  2. Verify environment variables in .env"
    echo "  3. Ensure all ports are available"
    echo "  4. Check Docker daemon is running"
fi

exit $ERRORS
