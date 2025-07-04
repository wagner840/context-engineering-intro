# Deployment Guide - Coolify on Hostinger VPS

## 🚀 Overview

This guide covers deploying the Dashboard Frontend on Hostinger VPS using Coolify for container orchestration and automated deployments.

## 📋 Prerequisites

### VPS Requirements
- **Hostinger VPS** with Ubuntu 20.04+ or Debian 11+
- **Minimum**: 2 CPU cores, 4GB RAM, 40GB storage
- **Recommended**: 4 CPU cores, 8GB RAM, 80GB storage
- **Domain**: Configured and pointing to your VPS IP

### Software Requirements
- Docker and Docker Compose
- Coolify installed and configured
- Git access to the repository
- SSL certificate (handled by Coolify/Traefik)

## 🔧 Coolify Setup

### 1. Install Coolify on VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### 2. Access Coolify Dashboard

1. Open `http://your-vps-ip:8000` in browser
2. Complete initial setup wizard
3. Configure domain and SSL settings
4. Set up Git integration

## 📦 Application Deployment

### 1. Create New Application

1. **Login to Coolify Dashboard**
2. **Create New Project**: "Dashboard Frontend"
3. **Add Application**: Select "Docker Compose" type
4. **Repository**: Connect to your Git repository

### 2. Configure Environment Variables

In Coolify dashboard, set the following environment variables:

```env
# Application
NODE_ENV=production
PORT=3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# WordPress Blog Configurations
EINSOF7_WORDPRESS_URL=https://einsof7.com/wp-json/wp/v2
EINSOF7_WORDPRESS_USERNAME=your_username
EINSOF7_WORDPRESS_PASSWORD=your_app_password

OPETMIL_WORDPRESS_URL=https://opetmil.com/wp-json/wp/v2
OPETMIL_WORDPRESS_USERNAME=your_username
OPETMIL_WORDPRESS_PASSWORD=your_app_password

# n8n Integration
N8N_API_URL=https://your-n8n-instance.com
N8N_API_KEY=your_n8n_api_key

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 3. Domain Configuration

1. **Set Domain**: `dashboard.yourdomain.com`
2. **Enable SSL**: Automatic Let's Encrypt certificate
3. **Configure DNS**: Point domain to VPS IP
4. **Verify Setup**: Check domain resolution

### 4. Deploy Application

```bash
# Coolify will automatically:
# 1. Pull latest code from repository
# 2. Build Docker image using Dockerfile
# 3. Deploy with docker-compose.yml
# 4. Configure Traefik routing and SSL
# 5. Start health checks
```

## 🔍 Monitoring and Health Checks

### Health Check Endpoint

The application includes a health check at `/api/health`:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "dashboard-frontend",
  "version": "1.0.0"
}
```

### Coolify Monitoring

Coolify provides built-in monitoring:
- **Container Status**: Running/stopped states
- **Resource Usage**: CPU, memory, disk
- **Logs**: Real-time application logs
- **Deployments**: History and rollback options

### Application Logs

```bash
# View logs through Coolify dashboard or CLI
docker logs dashboard-frontend

# Follow logs in real-time
docker logs -f dashboard-frontend
```

## 🔄 Continuous Deployment

### Git Integration

1. **Connect Repository**: Link Git repository to Coolify
2. **Auto-Deploy**: Enable automatic deployment on push
3. **Branch Configuration**: Set deployment branch (main/production)
4. **Webhooks**: Automatic deployment triggers

### Deployment Process

```mermaid
graph LR
    A[Git Push] --> B[Coolify Webhook]
    B --> C[Pull Code]
    C --> D[Build Image]
    D --> E[Deploy Container]
    E --> F[Health Check]
    F --> G[Update Routes]
    G --> H[Deployment Complete]
```

### Rollback Strategy

```bash
# Rollback to previous version
coolify rollback dashboard-frontend

# Or through Coolify dashboard:
# 1. Go to Deployments tab
# 2. Select previous successful deployment
# 3. Click "Rollback to this version"
```

## 🔒 Security Configuration

### SSL/TLS Setup

Coolify automatically configures:
- **Let's Encrypt certificates**
- **HTTP to HTTPS redirect**
- **Security headers**
- **HSTS enforcement**

### Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8000/tcp  # Coolify dashboard
```

### Environment Security

- Store sensitive variables in Coolify's encrypted environment store
- Use different credentials for production vs development
- Regularly rotate API keys and passwords
- Enable 2FA on all external services

## 📊 Performance Optimization

### Resource Allocation

```yaml
# In docker-compose.yml or Coolify settings
services:
  dashboard-frontend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Caching Strategy

- **CDN**: Configure Cloudflare or similar
- **Static Assets**: Cached by Traefik
- **API Responses**: React Query caching
- **Database**: Supabase built-in caching

### Database Optimization

```sql
-- Monitor database performance
SELECT * FROM pg_stat_statements;

-- Index optimization
CREATE INDEX CONCURRENTLY idx_keywords_blog_id ON main_keywords(blog_id);
CREATE INDEX CONCURRENTLY idx_posts_status ON content_posts(status);
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
docker logs dashboard-frontend-build

# Common fixes:
# - Verify environment variables
# - Check Node.js version compatibility
# - Ensure all dependencies are available
```

#### 2. Database Connection Issues
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
     "https://your-project.supabase.co/rest/v1/blogs"

# Verify environment variables are set correctly
```

#### 3. WordPress API Errors
```bash
# Test WordPress connection
curl -u "username:app_password" \
     "https://your-blog.com/wp-json/wp/v2/posts?per_page=1"

# Check application passwords are active
```

#### 4. SSL Certificate Issues
```bash
# Force certificate renewal
coolify ssl renew dashboard-frontend

# Check certificate status
openssl s_client -connect your-domain.com:443
```

### Log Analysis

```bash
# Application logs
docker logs dashboard-frontend | grep ERROR

# System logs
journalctl -u docker.service

# Coolify logs
docker logs coolify
```

## 🔄 Backup and Recovery

### Database Backup

```bash
# Supabase automatic backups are enabled
# Additional manual backup:
pg_dump "postgresql://user:pass@host:port/db" > backup.sql
```

### Application Backup

```bash
# Backup configuration
cp -r /opt/coolify/data/projects/dashboard-frontend backup/

# Environment variables backup
coolify env export dashboard-frontend > env-backup.txt
```

### Disaster Recovery

1. **Infrastructure**: Recreate VPS and install Coolify
2. **Application**: Deploy from Git repository
3. **Configuration**: Restore environment variables
4. **Database**: Supabase handles database recovery
5. **DNS**: Update domain pointing if IP changed

## 📈 Scaling Considerations

### Horizontal Scaling

```yaml
# For high traffic, consider multiple instances
services:
  dashboard-frontend:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
```

### Load Balancing

- **Traefik**: Built-in load balancing
- **Database**: Supabase auto-scaling
- **CDN**: Cloudflare for global distribution

### Monitoring

- **Uptime**: Coolify built-in monitoring
- **Performance**: Add APM tools (New Relic, DataDog)
- **Logs**: Centralized logging (ELK stack)

## 📞 Support

### Emergency Contacts
- **VPS Issues**: Hostinger support
- **Application Issues**: Development team
- **Database Issues**: Supabase support

### Monitoring Alerts

Set up alerts for:
- Application downtime
- High resource usage
- Failed deployments
- SSL certificate expiration

---

**Deployment successfully configured for production use with Coolify on Hostinger VPS! 🚀**