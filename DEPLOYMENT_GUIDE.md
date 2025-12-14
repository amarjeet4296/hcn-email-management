# HCN Email Management System - Complete Deployment Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Configuration](#configuration)
5. [Local Development](#local-development)
6. [Production Deployment](#production-deployment)
7. [Hosting Options](#hosting-options)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)

---

## System Overview

### What This System Does
The HCN (Hotel Confirmation Number) Email Management System automates the process of:
1. Sending HCN request emails to hotels
2. Checking email inbox for replies
3. Using OpenAI to analyze replies and extract HCN numbers
4. Categorizing responses (Received, Critical, Non-Critical)
5. Sending automatic reminders after 2 hours if no HCN received
6. Updating Excel database with results

### Architecture
```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  React Frontend │  HTTP   │  FastAPI Backend │  SMTP   │  Gmail Server   │
│  (Port 3000)    │ ◄─────► │  (Port 8000)     │ ◄─────► │  (Email)        │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                      │                          │
                                      ▼                          ▼
                            ┌──────────────────┐      ┌──────────────────┐
                            │  Excel Database  │      │  OpenAI API      │
                            │  (HCN1.xlsx)     │      │  (Analysis)      │
                            └──────────────────┘      └──────────────────┘
```

---

## Prerequisites

### Required Software

1. **Python 3.8 or higher**
   ```bash
   python3 --version
   ```
   Download from: https://www.python.org/downloads/

2. **Node.js 18 or higher** (for frontend)
   ```bash
   node --version
   ```
   Download from: https://nodejs.org/

3. **pip** (Python package manager - usually comes with Python)
   ```bash
   pip --version
   ```

### Required Accounts & API Keys

1. **Gmail Account with App Password**
   - Enable 2-factor authentication
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Save the 16-character password

2. **OpenAI API Key**
   - Create account: https://platform.openai.com/
   - Generate API key: https://platform.openai.com/api-keys
   - Ensure you have credits available

3. **Excel File**
   - Prepare your HCN1.xlsx file
   - Required sheet: "HotelReport (1)"
   - Required columns: FileNo, GuestName, HotelName, Agent Email, etc.

---

## Initial Setup

### Step 1: Clone or Download the Project

```bash
cd /path/to/your/projects
# If using git:
git clone <repository-url> hcn
cd hcn

# Or simply navigate to your project folder:
cd /Users/amarjeet/Downloads/hcn
```

### Step 2: Install Python Dependencies

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
# OR
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js packages
npm install

# Return to project root
cd ..
```

---

## Configuration

### Step 1: Create Environment File

```bash
# Copy the example file
cp .env.example .env
```

### Step 2: Edit .env File

Open [.env](./.env) in a text editor and fill in your credentials:

```bash
# Use nano, vim, or any text editor
nano .env
```

**Required Configuration:**

```env
# Gmail Configuration
GMAIL_ADDRESS=your_actual_email@gmail.com
GMAIL_APP_PASSWORD=your 16-char app password

# OpenAI API Key
OPENAI_API_KEY=sk-proj-your-actual-api-key

# Excel File
EXCEL_FILE_PATH=HCN1.xlsx
SHEET_NAME=HotelReport (1)

# Company Details
COMPANY_NAME=Your Company Name
SENDER_NAME=Your Team Name

# Security (IMPORTANT for production)
SECRET_KEY=generate-a-secure-random-string-here
```

### Step 3: Generate Secure Secret Key (For Production)

```bash
# Generate a secure random secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Copy the output and paste it as SECRET_KEY in .env
```

### Step 4: Validate Configuration

```bash
# Test configuration
python config.py
```

You should see:
```
✅ All required configuration is present
```

---

## Local Development

### Option 1: Run Both Servers Manually

**Terminal 1 - Backend:**
```bash
cd /Users/amarjeet/Downloads/hcn
source .venv/bin/activate
python backend_api.py
```

**Terminal 2 - Frontend:**
```bash
cd /Users/amarjeet/Downloads/hcn/frontend
npm run dev
```

### Option 2: Use the Startup Script

Create a startup script for easier management:

**macOS/Linux - `start_dev.sh`:**
```bash
#!/bin/bash
echo "Starting HCN Email Management System..."

# Start backend in background
source .venv/bin/activate
python backend_api.py &
BACKEND_PID=$!

# Start frontend in background
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
```

Make it executable:
```bash
chmod +x start_dev.sh
./start_dev.sh
```

### Access the Application

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## Production Deployment

### Option 1: Deploy on a VPS (DigitalOcean, AWS EC2, etc.)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.8+
sudo apt install python3 python3-pip python3-venv -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx (reverse proxy)
sudo apt install nginx -y

# Install Certbot (for SSL)
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Upload Your Code

```bash
# From your local machine
scp -r /Users/amarjeet/Downloads/hcn user@your-server-ip:/var/www/

# Or use git
ssh user@your-server-ip
cd /var/www
git clone <your-repo-url> hcn
cd hcn
```

#### 3. Setup Backend for Production

```bash
cd /var/www/hcn

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure .env
cp .env.example .env
nano .env  # Fill in your credentials

# Test backend
python backend_api.py
```

#### 4. Setup Frontend for Production

```bash
cd /var/www/hcn/frontend

# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in frontend/dist/
```

#### 5. Configure Nginx

Create nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/hcn
```

Add this configuration:

```nginx
# Backend API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/hcn/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:8000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/hcn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Setup SSL Certificate (HTTPS)

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

#### 7. Setup Systemd Service (Auto-start backend)

Create service file:

```bash
sudo nano /etc/systemd/system/hcn-backend.service
```

Add this content:

```ini
[Unit]
Description=HCN Email Management Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hcn
Environment="PATH=/var/www/hcn/.venv/bin"
ExecStart=/var/www/hcn/.venv/bin/uvicorn backend_api:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable hcn-backend
sudo systemctl start hcn-backend
sudo systemctl status hcn-backend
```

---

### Option 2: Deploy with Docker

#### 1. Create Dockerfile for Backend

Create `Dockerfile` in project root:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run backend
CMD ["uvicorn", "backend_api:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 2. Create Dockerfile for Frontend

Create `Dockerfile` in `frontend/`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build app
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./HCN1.xlsx:/app/HCN1.xlsx
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
```

#### 4. Deploy with Docker Compose

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 3: Deploy on Heroku

#### 1. Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Create Heroku Apps

```bash
# Login
heroku login

# Create backend app
heroku create hcn-backend

# Create frontend app (optional)
heroku create hcn-frontend
```

#### 3. Add Procfile for Backend

Create `Procfile` in project root:

```
web: uvicorn backend_api:app --host 0.0.0.0 --port $PORT
```

#### 4. Configure Environment Variables

```bash
# Set environment variables on Heroku
heroku config:set GMAIL_ADDRESS=your@email.com -a hcn-backend
heroku config:set GMAIL_APP_PASSWORD=your-password -a hcn-backend
heroku config:set OPENAI_API_KEY=your-api-key -a hcn-backend
heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))") -a hcn-backend
```

#### 5. Deploy

```bash
# Deploy backend
git push heroku main

# View logs
heroku logs --tail -a hcn-backend
```

---

### Option 4: Deploy on Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables from your [.env](./.env) file
6. Deploy automatically

---

## Hosting Options Comparison

| Option | Cost | Difficulty | Best For |
|--------|------|------------|----------|
| **VPS (DigitalOcean, AWS EC2)** | $5-20/month | Medium | Full control, production |
| **Docker** | Varies | Medium | Consistent deployment |
| **Heroku** | Free-$7/month | Easy | Quick deployment, startups |
| **Railway** | Free-$5/month | Very Easy | Modern hosting, auto-deploy |
| **Vercel (Frontend only)** | Free | Very Easy | Frontend hosting |
| **Render** | Free-$7/month | Easy | Full-stack hosting |

### Recommended: Railway or Render for Beginners

Both offer:
- Free tier
- Automatic deployments from GitHub
- Easy environment variable management
- Built-in SSL certificates

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit [.env](./.env) file to version control
- ✅ Use strong, unique SECRET_KEY for production
- ✅ Rotate API keys regularly
- ✅ Use different credentials for dev/staging/production

### 2. Gmail Security
- ✅ Use App Password, not your actual Gmail password
- ✅ Monitor "Less secure app access" settings
- ✅ Review "Recent security activity" regularly

### 3. API Keys
- ✅ Set spending limits on OpenAI account
- ✅ Monitor API usage
- ✅ Restrict API keys by IP if possible

### 4. Server Security
- ✅ Keep system updated: `sudo apt update && sudo apt upgrade`
- ✅ Configure firewall: `sudo ufw enable`
- ✅ Use SSH keys instead of passwords
- ✅ Enable automatic security updates

### 5. Application Security
- ✅ Use HTTPS (SSL certificate) in production
- ✅ Enable CORS only for trusted domains
- ✅ Implement rate limiting
- ✅ Regular backups of Excel database

---

## Troubleshooting

### Backend Issues

**Issue: ModuleNotFoundError**
```bash
# Ensure virtual environment is activated
source .venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Issue: Port 8000 already in use**
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9

# Or change port in .env
BACKEND_PORT=8001
```

**Issue: Gmail authentication error**
- Verify GMAIL_APP_PASSWORD is correct (16 characters, no spaces)
- Check 2-factor authentication is enabled
- Generate new App Password if needed

**Issue: OpenAI API error**
- Verify API key is valid
- Check account has credits
- Monitor rate limits

### Frontend Issues

**Issue: Cannot connect to backend**
- Ensure backend is running: `curl http://localhost:8000`
- Check CORS settings in [backend_api.py](backend_api.py:27-33)
- Verify API URL in frontend code

**Issue: Build errors**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Excel Issues

**Issue: File not found**
- Verify EXCEL_FILE_PATH in [.env](./.env)
- Ensure file exists: `ls -la HCN1.xlsx`
- Check file permissions: `chmod 644 HCN1.xlsx`

**Issue: Sheet not found**
- Open Excel file and verify sheet name matches SHEET_NAME in [.env](./.env)
- Sheet names are case-sensitive

---

## Monitoring & Maintenance

### 1. Log Monitoring

```bash
# Backend logs
tail -f /var/log/hcn-backend.log

# Or with systemd
sudo journalctl -u hcn-backend -f
```

### 2. Database Backups

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp HCN1.xlsx backups/HCN1_$DATE.xlsx
# Keep only last 30 backups
ls -t backups/HCN1_*.xlsx | tail -n +31 | xargs rm -f
```

### 3. Health Checks

```bash
# Check if backend is running
curl http://localhost:8000/

# Check API status
curl http://localhost:8000/api/status
```

### 4. Performance Monitoring

- Monitor API response times
- Check email send/receive success rates
- Monitor OpenAI API usage and costs
- Track Excel file size

---

## Next Steps

After successful deployment:

1. **Test the System**
   - Send test emails
   - Verify inbox checking works
   - Test OpenAI analysis
   - Check Excel updates

2. **Setup Monitoring**
   - Error tracking (Sentry, Rollbar)
   - Uptime monitoring (UptimeRobot, Pingdom)
   - Log aggregation (Papertrail, Loggly)

3. **Implement Backups**
   - Automated Excel backups
   - Database snapshots
   - Configuration backups

4. **Add Features**
   - User authentication (already implemented)
   - Email templates customization
   - Advanced reporting
   - Webhook notifications

---

## Support & Resources

- **Documentation**: See [FULLSTACK_SETUP.md](FULLSTACK_SETUP.md)
- **Configuration**: See [config.py](config.py:45-76)
- **API Docs**: http://localhost:8000/docs (when running)

For issues:
1. Check logs first
2. Verify configuration with `python config.py`
3. Test individual components
4. Review error messages carefully

---

## Summary of Steps to Deploy

### Quick Checklist

- [ ] Install Python 3.8+ and Node.js 18+
- [ ] Clone/download project
- [ ] Install Python dependencies: `pip install -r requirements.txt`
- [ ] Install frontend dependencies: `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all credentials in `.env`
- [ ] Generate secure SECRET_KEY
- [ ] Validate config: `python config.py`
- [ ] Test locally: Backend + Frontend
- [ ] Choose hosting platform
- [ ] Deploy backend
- [ ] Build and deploy frontend
- [ ] Configure domain and SSL
- [ ] Test production deployment
- [ ] Setup monitoring and backups

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Company**: Within Earth Travel Pvt. Ltd.
