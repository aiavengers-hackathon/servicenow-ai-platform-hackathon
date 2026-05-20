# Deployment Guide - ServiceNow AI Platform

## 📋 Table of Contents

- [Docker Deployment](#docker-deployment)
- [Production Checklist](#production-checklist)
- [Environment Configuration](#environment-configuration)
- [Monitoring](#monitoring)
- [Scaling](#scaling)
- [Backup & Recovery](#backup--recovery)

## Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Git

### Quick Docker Start

```bash
# 1. Clone repository
git clone https://github.com/your-org/servicenow-ai-platform.git
cd servicenow-ai-platform-hackathon

# 2. Create .env file in root directory
cat > .env << 'EOF'
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
EOF

# 3. Build and run
docker-compose up --build

# 4. Access services
# Frontend: http://localhost:80
# Backend:  http://localhost:5000
```

### Docker Services

The `docker-compose.yml` includes:

- **Frontend**: React app on port 80 (Nginx)
- **Backend**: FastAPI on port 5000
- **PostgreSQL**: Database on port 5432
- **Chroma**: Vector database on port 8000

### Docker Compose Structure

```yaml
version: "3.9"

services:
  frontend:      # React + Nginx
  backend:       # FastAPI + Python
  postgres:      # PostgreSQL database
  chromadb:      # Vector database

volumes:
  postgres_data: # Database persistence
  chroma_data:   # Vector DB persistence
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f backend
```

### Common Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild images
docker-compose build

# Build specific service
docker-compose build backend

# Scale service (if configured)
docker-compose up --scale backend=3
```

## Production Checklist

### Security

- [ ] Change default PostgreSQL password
- [ ] Use strong Azure OpenAI API key
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up API authentication
- [ ] Enable rate limiting
- [ ] Use environment secrets (not .env file)
- [ ] Enable audit logging

### Performance

- [ ] Configure database connection pooling
- [ ] Set up Redis caching
- [ ] Configure Nginx reverse proxy
- [ ] Enable gzip compression
- [ ] Optimize Docker images
- [ ] Set resource limits

### Monitoring

- [ ] Set up application monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts
- [ ] Monitor database performance
- [ ] Monitor API response times

### Backup

- [ ] Configure automated database backups
- [ ] Test backup recovery
- [ ] Document backup procedures
- [ ] Set up offsite backups

### Deployment

- [ ] Use configuration management
- [ ] Implement CI/CD pipeline
- [ ] Set up staging environment
- [ ] Document deployment process
- [ ] Plan rollback procedures

## Environment Configuration

### Production .env

```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-production-key
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Application
APP_ENV=production
LOG_LEVEL=WARNING
DEBUG=false

# Database
DATABASE_URL=postgresql://user:strong-password@postgres:5432/servicenow
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=40

# Security
SECRET_KEY=your-secret-key-here
API_KEY_HEADER=X-API-Key
CORS_ORIGINS=https://yourdomain.com

# Features
ENABLE_ANALYTICS=true
ENABLE_AUDIT_LOGGING=true
RATE_LIMIT_ENABLED=true
```

### Using Docker Secrets

For sensitive data, use Docker secrets instead of .env:

```bash
# Create secrets
echo "your-api-key" | docker secret create azure_openai_key -
echo "your-db-password" | docker secret create db_password -

# Reference in compose:
# secrets:
#   azure_openai_key:
#     external: true
```

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Expected response:
# {"status":"healthy","uptime":"1h 23m"}
```

### Docker Health Checks

Add to `docker-compose.yml`:

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Logging

```bash
# View all logs
docker-compose logs --timestamps

# View logs from last hour
docker-compose logs --since 1h

# Follow logs
docker-compose logs -f
```

### Metrics

Monitor these key metrics:

- **API Response Time**: Should be < 2s (p95)
- **Error Rate**: Should be < 0.5%
- **Database Connections**: Should scale with load
- **Memory Usage**: Should remain stable
- **Disk Space**: Monitor PostgreSQL volume

## Scaling

### Horizontal Scaling

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Scale with load balancer (Nginx)
# Configure in frontend/nginx.conf
```

### Database Scaling

For large deployments, consider:
- Read replicas
- Connection pooling (PgBouncer)
- Partitioning
- Archive old data

### Caching

```bash
# Add Redis for caching
docker run -d -p 6379:6379 redis:7
```

## Backup & Recovery

### Automated PostgreSQL Backup

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

docker-compose exec -T postgres pg_dump \
  -U postgres servicenow \
  > $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" \
  -mtime +7 -delete
```

### Restore from Backup

```bash
# Stop services
docker-compose down

# Restore database
docker-compose up -d postgres
sleep 10

# Restore backup
cat backup_20260521_100000.sql | \
  docker-compose exec -T postgres \
  psql -U postgres servicenow

# Restart services
docker-compose up -d
```

### Vector Database Backup

```bash
# Backup Chroma volume
docker run --rm \
  -v chroma_data:/chroma \
  -v $(pwd):/backup \
  alpine tar czf /backup/chroma_backup.tar.gz -C /chroma .

# Restore
docker run --rm \
  -v chroma_data:/chroma \
  -v $(pwd):/backup \
  alpine tar xzf /backup/chroma_backup.tar.gz -C /chroma
```

## Troubleshooting Deployment

### Service Won't Start

```bash
# Check logs
docker-compose logs backend

# Check configuration
docker-compose config

# Validate compose file
docker-compose config --quiet
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres \
  psql -U postgres -d servicenow -c "SELECT 1"

# Check connection string in backend logs
docker-compose logs backend | grep -i connection
```

### Performance Issues

```bash
# Check container stats
docker stats

# Check resource limits
docker inspect container-name

# Increase resources in docker-compose.yml
# services:
#   backend:
#     deploy:
#       resources:
#         limits:
#           cpus: '2'
#           memory: 2G
```

### Permission Issues

```bash
# Fix volume permissions
docker-compose exec postgres \
  chown -R postgres:postgres /var/lib/postgresql/data

# Reset permissions
sudo chown -R $(whoami):$(whoami) ./data
```

## CI/CD Pipeline Example

### GitHub Actions Workflow

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: docker-compose build
      
      - name: Run tests
        run: docker-compose run --rm backend pytest
      
      - name: Push to registry
        run: docker push your-registry/backend:latest
      
      - name: Deploy
        run: |
          ssh user@server "cd app && docker-compose pull && docker-compose up -d"
```

## Production Checklist

Before going live:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Logging aggregation ready
- [ ] Documentation updated
- [ ] Team trained
- [ ] Rollback plan documented
- [ ] Load testing completed

## Support

For deployment help:
- Check logs: `docker-compose logs`
- Review configuration: `docker-compose config`
- Consult documentation: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

**Last Updated**: May 2026  
**Maintainer**: ServiceNow AI Platform Team
