# HCN Management System - Full Stack Setup Guide

Complete guide to set up and run the HCN (Hotel Confirmation Number) Management System.

## System Overview

**Backend**: Python FastAPI server
**Frontend**: React + TypeScript with Vite
**Purpose**: Automate hotel confirmation number requests via email

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  React Frontend │  HTTP   │  FastAPI Backend │  SMTP   │  Gmail Server   │
│  (Port 3000)    │ ◄─────► │  (Port 8000)     │ ◄─────► │  (Email)        │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │  Excel Database  │
                            │  (HCN1.xlsx)     │
                            └──────────────────┘
```

## Prerequisites

### Required Software

1. **Python 3.8+**
   ```bash
   python3 --version  # Should be 3.8 or higher
   ```

2. **Node.js 18+** (for frontend)
   ```bash
   node --version  # Should be v18 or higher
   ```

3. **pip** (Python package manager)
   ```bash
   pip --version
   ```

### Install Node.js (if not installed)

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Windows:**
- Download and install from https://nodejs.org/

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

## Quick Start

### 1. Backend Setup

```bash
# Navigate to project root
cd /Users/amarjeet/Downloads/hcn

# Create virtual environment (if not exists)
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
# OR
.venv\Scripts\activate     # Windows

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python backend_api.py
```

The backend will start on **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### 2. Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd /Users/amarjeet/Downloads/hcn/frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:3000**

### 3. Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Detailed Setup

### Backend Configuration

#### Environment Variables

The system uses configuration from [sending_update.py](sending_update.py):

```python
# Gmail credentials
GMAIL_ADDRESS = "withinearthtest@gmail.com"
GMAIL_APP_PASSWORD = "owkx kadu jrqd lsxv"

# OpenAI API Key
OPENAI_API_KEY = "sk-proj-..."

# Excel file path
EXCEL_FILE_PATH = "HCN1.xlsx"
SHEET_NAME = "HotelReport (1)"

# Settings
REMINDER_AFTER_HOURS = 2
DAYS_TO_CHECK = 7
DELAY_BETWEEN_EMAILS = 2

# Company details
COMPANY_NAME = "Within Earh Travel Pvt. Ltd."
SENDER_NAME = "Reservations Team"
```

#### Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/status` | GET | Get booking statistics |
| `/api/bookings` | GET | Get all bookings |
| `/api/bookings/pending` | GET | Get pending HCN bookings |
| `/api/bookings/critical` | GET | Get critical issue bookings |
| `/api/process` | POST | Start email process |
| `/api/config` | GET | Get system configuration |

### Frontend Configuration

#### Environment Variables (Optional)

Create `.env` in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

If not set, defaults to `http://localhost:8000`.

#### Pages

- **Dashboard** (`/`) - Statistics and overview
- **All Bookings** (`/bookings`) - All confirmed/vouchered bookings
- **Pending** (`/pending`) - Bookings awaiting HCN
- **Critical** (`/critical`) - Bookings with critical issues
- **Settings** (`/settings`) - System configuration

## Running in Production

### Backend Production

```bash
# Activate virtual environment
source .venv/bin/activate

# Run with production settings
uvicorn backend_api:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Production

```bash
cd frontend

# Build for production
npm run build

# Preview production build
npm run preview

# Or serve with a static server
npm install -g serve
serve -s dist -p 3000
```

## Development Workflow

### Daily Usage

1. **Start Backend:**
   ```bash
   cd /Users/amarjeet/Downloads/hcn
   source .venv/bin/activate
   python backend_api.py
   ```

2. **Start Frontend (new terminal):**
   ```bash
   cd /Users/amarjeet/Downloads/hcn/frontend
   npm run dev
   ```

3. **Use the Application:**
   - Open http://localhost:3000
   - Click "Start Full Process" to run the email workflow
   - Monitor dashboard for results

### Email Process Flow

When you click "Start Full Process":

1. **Send Initial Emails** - Sends HCN request to hotels
2. **Check Inbox** - Reads email responses using OpenAI
3. **Categorize Responses**:
   - ✅ **Received**: HCN found → Updates Excel
   - ❌ **Critical**: Cannot provide HCN (no room, rate issue)
   - ⚠️ **Non-Critical**: Other response, no HCN yet
4. **Send Reminders** - After 2 hours if no HCN received
5. **Update Excel** - All changes saved to HCN1.xlsx

## Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError`
```bash
# Ensure virtual environment is activated
source .venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Issue**: Port 8000 already in use
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn backend_api:app --port 8001
```

**Issue**: OpenAI API error
- Check OPENAI_API_KEY in sending_update.py
- Verify API key is valid and has credits

**Issue**: Gmail authentication error
- Ensure Gmail App Password is correct
- Check if 2-factor authentication is enabled
- Generate new App Password if needed

### Frontend Issues

**Issue**: `npm: command not found`
```bash
# Install Node.js first (see Prerequisites section)
node --version  # Should show v18+
```

**Issue**: Port 3000 already in use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

**Issue**: Cannot connect to backend
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify VITE_API_URL in .env (if used)

**Issue**: Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Excel Issues

**Issue**: Excel file not found
- Ensure `HCN1.xlsx` exists in the project root
- Check EXCEL_FILE_PATH in sending_update.py

**Issue**: Sheet not found
- Verify SHEET_NAME matches the Excel sheet name
- Check for typos or extra spaces

## File Structure

```
hcn/
├── backend_api.py              # FastAPI backend server
├── sending_update.py           # Email processing logic
├── receive_email.py            # Email inbox checker
├── HCN1.xlsx                   # Excel database
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (optional)
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API client
│   │   ├── hooks/             # React hooks
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helper functions
│   ├── package.json           # Node dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── tsconfig.json          # TypeScript config
│
└── FULLSTACK_SETUP.md         # This file
```

## Security Notes

- Keep `.env` files private
- Never commit API keys to version control
- Use environment variables for sensitive data
- Rotate Gmail App Passwords regularly
- Keep dependencies updated

## Performance Tips

- **Backend**: Use `--workers` flag for production
- **Frontend**: Build and serve static files for production
- **Excel**: Keep file size manageable (< 10MB)
- **Database**: Consider migrating to PostgreSQL for large datasets

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs in terminal
3. Check browser console for frontend errors
4. Verify API documentation at http://localhost:8000/docs

## Next Steps

- [ ] Add user authentication
- [ ] Implement database migration
- [ ] Add email templates customization
- [ ] Create admin dashboard
- [ ] Add automated testing
- [ ] Deploy to cloud platform

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Company**: Within Earth Travel Pvt. Ltd.
