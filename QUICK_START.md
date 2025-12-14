# Quick Start Guide - HCN Email Management System

## What Changed? 🔄

Your HCN system now uses **secure configuration management**:
- ✅ API keys and passwords moved to [.env](./.env) file
- ✅ Configuration loader created in [config.py](config.py)
- ✅ [sending_update.py](sending_update.py) updated to use config
- ✅ Template file [.env.example](./.env.example) for easy setup
- ✅ Comprehensive deployment guide created

## Files Created/Modified

### New Files
1. **[config.py](config.py)** - Configuration loader with validation
2. **[.env.example](./.env.example)** - Template for environment variables
3. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete hosting guide

### Modified Files
1. **[.env](./.env)** - Your actual credentials (already configured with your existing values)
2. **[sending_update.py](sending_update.py)** - Now uses config instead of hardcoded values
3. **[.gitignore](./.gitignore)** - Already protecting sensitive files

## How to Run Locally (Development)

### Step 1: Verify Configuration

```bash
# Activate virtual environment
source .venv/bin/activate

# Test configuration
python config.py
```

You should see: ✅ All required configuration is present

### Step 2: Start Backend

**Terminal 1:**
```bash
cd /Users/amarjeet/Downloads/hcn
source .venv/bin/activate
python backend_api.py
```

Backend will run on: http://localhost:8000
API Docs: http://localhost:8000/docs

### Step 3: Start Frontend

**Terminal 2:**
```bash
cd /Users/amarjeet/Downloads/hcn/frontend
npm run dev
```

Frontend will run on: http://localhost:3000

### Step 4: Access Application

Open browser: http://localhost:3000

## How to Deploy for Production

See the comprehensive guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Quick Deployment Options

#### Option 1: Railway (Easiest) 🚂
1. Go to https://railway.app
2. Sign in with GitHub
3. Deploy from GitHub repo
4. Add environment variables from [.env](./.env)
5. Done! ✨

#### Option 2: Render 🎨
1. Go to https://render.com
2. New Web Service → Connect GitHub
3. Add environment variables
4. Deploy automatically

#### Option 3: Heroku ☁️
```bash
heroku create hcn-backend
heroku config:set GMAIL_ADDRESS=your@email.com
# ... add all env vars from .env
git push heroku main
```

#### Option 4: VPS (Full Control) 🖥️
See detailed instructions in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#option-1-deploy-on-a-vps-digitalocean-aws-ec2-etc)

## Security Notes 🔒

### IMPORTANT: Before Deploying to Production

1. **Generate Secure Secret Key**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   Copy output and update `SECRET_KEY` in [.env](./.env)

2. **Never Commit .env File**
   - [.env](./.env) is already in [.gitignore](./.gitignore)
   - Always use [.env.example](./.env.example) as template
   - Keep your [.env](./.env) file private

3. **Update Credentials for Production**
   - Use different Gmail account for production
   - Use separate OpenAI API key for production
   - Set spending limits on OpenAI account

## Environment Variables Reference

All configuration is in [.env](./.env):

```env
# Credentials
GMAIL_ADDRESS=your_email@gmail.com           # Your Gmail address
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx        # 16-char App Password
OPENAI_API_KEY=sk-proj-...                    # OpenAI API key

# Database
EXCEL_FILE_PATH=HCN1.xlsx                     # Excel file path
SHEET_NAME=HotelReport (1)                    # Sheet name

# Email Settings
REMINDER_AFTER_HOURS=2                        # Hours before reminder
DAYS_TO_CHECK=7                               # Days of email history
DELAY_BETWEEN_EMAILS=2                        # Seconds between emails

# Company
COMPANY_NAME=Your Company Name
SENDER_NAME=Your Team Name

# Security (CHANGE FOR PRODUCTION!)
SECRET_KEY=generate-random-secure-string
```

## Testing the System

### 1. Test Configuration
```bash
python config.py
```

### 2. Test Backend API
```bash
# Start backend
python backend_api.py

# In another terminal, test endpoint
curl http://localhost:8000/
curl http://localhost:8000/api/status
```

### 3. Test Email Functionality
```bash
# Run the script directly
python sending_update.py
```

### 4. Test Full System
1. Start both backend and frontend
2. Open http://localhost:3000
3. Click "Start Full Process"
4. Monitor the dashboard for results

## File Structure

```
hcn/
├── .env                      # Your credentials (KEEP SECURE!)
├── .env.example              # Template for .env
├── config.py                 # Configuration loader
├── sending_update.py         # Email processing logic (updated)
├── backend_api.py            # FastAPI backend
├── hcn_ui.py                 # Terminal UI
├── requirements.txt          # Python dependencies
├── HCN1.xlsx                 # Excel database
│
├── frontend/                 # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
│
├── DEPLOYMENT_GUIDE.md       # Complete deployment guide
├── FULLSTACK_SETUP.md        # Full stack setup guide
├── QUICK_START.md            # This file
└── .gitignore                # Protects sensitive files
```

## Common Commands

```bash
# Activate virtual environment
source .venv/bin/activate

# Install/update Python dependencies
pip install -r requirements.txt

# Install/update frontend dependencies
cd frontend && npm install

# Start backend
python backend_api.py

# Start frontend
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build

# Test configuration
python config.py

# Run email processor directly
python sending_update.py

# Generate secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Next Steps

1. ✅ **Verify Configuration**
   ```bash
   python config.py
   ```

2. ✅ **Test Locally**
   - Start backend and frontend
   - Access http://localhost:3000
   - Test the email process

3. ✅ **Choose Hosting Platform**
   - Railway (easiest)
   - Render (easy)
   - Heroku (popular)
   - VPS (full control)

4. ✅ **Deploy**
   - Follow instructions in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
   - Add environment variables
   - Test production deployment

5. ✅ **Setup Monitoring**
   - Error tracking
   - Uptime monitoring
   - Automated backups

## Troubleshooting

### Configuration errors?
```bash
python config.py  # Shows what's missing
```

### Backend won't start?
```bash
source .venv/bin/activate  # Activate venv
pip install -r requirements.txt  # Reinstall deps
```

### Frontend won't start?
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to backend?
- Check backend is running on port 8000
- Verify CORS settings in [backend_api.py](backend_api.py:27-33)

## Support

- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Configuration**: [config.py](config.py)
- **API Docs**: http://localhost:8000/docs

---

## Summary

✅ **What You Have Now:**
- Secure configuration with [.env](./.env) file
- No more hardcoded credentials
- Easy deployment to any platform
- Complete documentation

✅ **Ready to:**
- Run locally for development
- Deploy to production
- Share code safely (credentials not in code)

✅ **Next Action:**
1. Run `python config.py` to verify setup
2. Start backend and frontend
3. Test the system
4. Deploy to your chosen platform

---

**Need help?** Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions!
