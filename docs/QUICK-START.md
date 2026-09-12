# BlackSentinel Command - Quick Start Guide

## Get Up and Running in 5 Minutes

---

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- 8 GB RAM minimum (16 GB recommended)
- 20 GB free disk space

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/blacksentinel/command.git
cd command
```

---

## Step 2: Start the Application

```bash
# Start all services
docker-compose up -d
```

Wait 2-3 minutes for all services to start.

---

## Step 3: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

---

## Step 4: Verify Deployment

Run the verification script:

```bash
./scripts/verify-deployment.sh
```

You should see all checks pass with green checkmarks.

---

## Default Credentials

### Application
- **URL:** http://localhost:3000
- **Username:** admin@blacksentinel.io
- **Password:** admin

### Grafana
- **URL:** http://localhost:3001
- **Username:** admin
- **Password:** admin

### Prometheus
- **URL:** http://localhost:9090

---

## Common Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
```

### Restart Services
```bash
docker-compose restart
```

### Check Status
```bash
docker-compose ps
```

---

## Troubleshooting

### Application Won't Start

1. Check if Docker is running:
   ```bash
   docker info
   ```

2. Check port availability:
   ```bash
   lsof -i :3000
   ```

3. View application logs:
   ```bash
   docker-compose logs app
   ```

### Database Connection Issues

1. Check PostgreSQL status:
   ```bash
   docker-compose exec postgres pg_isready -U blacksentinel
   ```

2. Reset database:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Memory Issues

1. Check container resource usage:
   ```bash
   docker stats
   ```

2. Increase Docker memory limit in Docker Desktop settings.

---

## Next Steps

1. **Explore the Dashboard:** Navigate through all modules
2. **Configure Integrations:** Connect your SIEM, EDR, etc.
3. **Create Users:** Set up your team with appropriate roles
4. **Customize Branding:** Apply your organization's colors and logo
5. **Deploy to Production:** Follow the [Deployment Guide](docs/DEPLOYMENT-GUIDE.md)

---

## Documentation

- [Deployment Guide](docs/DEPLOYMENT-GUIDE.md)
- [Pricing & Licensing](docs/PRICING.md)
- [Executive Summary](docs/EXECUTIVE-SUMMARY.md)
- [Full Documentation](https://docs.blacksentinel.io)

---

## Support

- **Email:** support@blacksentinel.io
- **Phone:** +1-800-BLACK-911
- **Documentation:** https://docs.blacksentinel.io

---

*Last updated: June 2026*
