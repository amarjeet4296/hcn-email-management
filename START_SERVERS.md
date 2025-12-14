# HCN Email Management System - Full Stack Setup

This system consists of:
1. **Python Backend** (FastAPI) - Port 8000
2. **React Frontend** (Vite) - Port 3000

## Quick Start Guide

### Step 1: Install Node.js (One-time setup)

**Option A - Download from website:**
1. Go to https://nodejs.org/
2. Download the LTS version for macOS
3. Install the .pkg file
4. Restart your terminal

**Option B - Using Homebrew:**
```bash
# Fix Homebrew permissions first
sudo chown -R amarjeet /opt/homebrew

# Install Node.js
brew install node
```

Verify installation:
```bash
node --version
npm --version
```

### Step 2: Install Python Dependencies

```bash
cd /Users/amarjeet/Downloads/hcn
pip3 install -r requirements.txt
```

### Step 3: Install Frontend Dependencies

```bash
cd /Users/amarjeet/Downloads/hcn/hcn-email-frontend
npm install
```

### Step 4: Start the Backend Server

Open Terminal 1:
```bash
cd /Users/amarjeet/Downloads/hcn
python3 backend_api.py
```

Backend will run on: http://localhost:8000
API Documentation: http://localhost:8000/docs

### Step 5: Start the Frontend Server

Open Terminal 2:
```bash
cd /Users/amarjeet/Downloads/hcn/hcn-email-frontend
npm run dev
```

Frontend will run on: http://localhost:3000

### Step 6: Access the Application

Open your browser and go to: http://localhost:3000

## Features

### Dashboard
- View total bookings, HCN received, critical issues, and pending status
- Real-time statistics cards
- Filter bookings by status (All, Pending, Critical, Received)
- Detailed booking table with all information

### Run Process Button
Click "Run Process" to:
1. Send initial HCN request emails to new bookings
2. Check Gmail inbox for replies
3. Analyze replies using OpenAI (categorize as Received/Critical/Non-Critical)
4. Send reminder emails for bookings without HCN after 2 hours
5. Update Excel file with results

### Booking Statuses
- **Received** (Green): HCN confirmation number received
- **Critical** (Red): Cannot provide HCN (no room, rate issue, etc.)
- **Non Critical** (Blue): Other responses, processing
- **Pending** (Yellow): No response yet

## API Endpoints

- `GET /api/status` - Get summary statistics
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/pending` - Get pending bookings only
- `GET /api/bookings/critical` - Get critical issues only
- `POST /api/process` - Run full email process
- `GET /api/config` - Get system configuration

## Configuration

Edit [backend_api.py](backend_api.py:1) or [sending_update.py](sending_update.py:1) to change:
- Gmail credentials
- OpenAI API key
- Excel file path
- Reminder timing (default: 2 hours)
- Email delay between sends

## Troubleshooting

### Backend won't start
- Make sure all Python dependencies are installed: `pip3 install -r requirements.txt`
- Check that port 8000 is not already in use
- Verify Excel file exists at the configured path

### Frontend won't start
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check that port 3000 is not already in use

### Can't connect to API
- Make sure backend is running on port 8000
- Check CORS settings in [backend_api.py](backend_api.py:1)
- Verify the API base URL in [src/services/api.js](hcn-email-frontend/src/services/api.js:1)

### Process fails
- Verify Gmail credentials are correct
- Check OpenAI API key is valid
- Ensure Excel file is not open in another application
- Check internet connection for Gmail/OpenAI access

## File Structure

```
hcn/
├── backend_api.py              # FastAPI backend server
├── sending_update.py           # Core email management logic
├── requirements.txt            # Python dependencies
├── HCN1.xlsx                   # Excel database
└── hcn-email-frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   │   └── Dashboard.jsx   # Main dashboard component
    │   ├── services/
    │   │   └── api.js          # API client
    │   ├── App.jsx             # Root component
    │   └── main.jsx            # Entry point
    ├── package.json            # Node dependencies
    └── vite.config.js          # Vite configuration
```

## Technologies Used

### Backend
- FastAPI - Modern Python web framework
- Uvicorn - ASGI server
- Pandas - Excel data manipulation
- OpenAI - Email analysis and categorization
- SMTP/IMAP - Email sending and receiving

### Frontend
- React 18 - UI library
- Vite - Build tool and dev server
- Tailwind CSS - Styling
- Axios - HTTP client
- Lucide React - Icons
