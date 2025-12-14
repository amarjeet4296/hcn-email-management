# HCN Management System - Project Overview

## What Has Been Built

A professional full-stack web application for managing Hotel Confirmation Number (HCN) requests and responses.

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Excel (HCN1.xlsx)
- **Email**: Gmail SMTP/IMAP
- **AI**: OpenAI GPT for email analysis
- **Key Libraries**:
  - `pandas` - Data manipulation
  - `openpyxl` - Excel operations
  - `uvicorn` - ASGI server
  - `fastapi` - REST API framework

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **UI Components**: Custom components with Lucide icons
- **Notifications**: React Hot Toast

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (User)                        │
│                 http://localhost:3000                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              React Frontend (TypeScript)                 │
│  - Dashboard      - Bookings      - Pending             │
│  - Critical       - Settings                            │
│  - React Query    - Axios         - Tailwind            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)                    │
│  - REST Endpoints  - CORS Middleware                    │
│  - Email Manager   - OpenAI Integration                 │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  Excel Database  │    │   Gmail Server   │
│   (HCN1.xlsx)    │    │  (SMTP/IMAP)     │
└──────────────────┘    └──────────────────┘
```

## Features Implemented

### Dashboard
- ✅ Real-time booking statistics
- ✅ HCN received/pending counts
- ✅ Critical issue tracking
- ✅ Email sent/reminder counts
- ✅ Completion rate visualization
- ✅ One-click email processing

### Bookings Management
- ✅ View all bookings (confirmed/vouchered)
- ✅ Filter pending HCN bookings
- ✅ Filter critical issue bookings
- ✅ Detailed booking information table
- ✅ Status and issue badges
- ✅ Contact information display

### Settings
- ✅ View system configuration
- ✅ Email settings display
- ✅ Timing configuration
- ✅ Company information

### Email Automation
- ✅ Send initial HCN requests
- ✅ Check inbox for responses
- ✅ AI-powered email categorization
- ✅ Automatic reminder sending
- ✅ Excel database updates

## API Endpoints

### GET Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check |
| `GET /api/status` | Get booking statistics |
| `GET /api/bookings` | Get all bookings |
| `GET /api/bookings/pending` | Get pending HCN bookings |
| `GET /api/bookings/critical` | Get critical bookings |
| `GET /api/config` | Get configuration |

### POST Endpoints
| Endpoint | Description |
|----------|-------------|
| `POST /api/process` | Start email processing |

## Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── StatCard.tsx          # Statistics card component
│   │   ├── BookingTable.tsx      # Bookings data table
│   │   ├── ProcessButton.tsx     # Email process trigger
│   │   └── Header.tsx            # Navigation header
│   ├── pages/
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── AllBookings.tsx       # All bookings page
│   │   ├── PendingBookings.tsx   # Pending HCN page
│   │   ├── CriticalBookings.tsx  # Critical issues page
│   │   └── Settings.tsx          # Settings page
│   ├── services/
│   │   └── api.ts               # API client with all endpoints
│   ├── hooks/
│   │   └── useBookings.ts       # React Query hooks
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   └── helpers.ts           # Utility functions
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
└── tailwind.config.js            # Tailwind config
```

## Design Patterns

### Backend
- **Singleton Pattern**: Single HCNEmailManager instance
- **Thread Pool**: Concurrent email processing
- **Middleware**: CORS for frontend communication
- **Error Handling**: Custom exception handlers
- **Type Safety**: Pydantic models for validation

### Frontend
- **Component Composition**: Reusable UI components
- **Custom Hooks**: Abstracted data fetching logic
- **Server State Management**: React Query for caching
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton screens
- **Error Boundaries**: Graceful error handling

## Data Flow

### Email Processing Workflow

1. User clicks "Start Full Process" button
2. Frontend sends `POST /api/process` with action: "full_process"
3. Backend runs in thread pool:
   - a. Send initial HCN request emails
   - b. Check inbox for responses
   - c. Use OpenAI to categorize responses
   - d. Update Excel with HCN or issue status
   - e. Send reminders if no response after 2 hours
4. Frontend receives success/error response
5. React Query invalidates cache
6. Dashboard auto-refreshes with new data

### Data Fetching

1. Page component mounts
2. Custom hook triggers React Query
3. Query fetches data from backend API
4. Backend reads Excel and processes data
5. Response cached by React Query
6. Component receives data and renders
7. Auto-refetch every 30 seconds (dashboard only)

## UI/UX Features

### Professional Design
- Clean, modern interface
- Consistent color scheme (blue primary)
- Professional typography
- Intuitive navigation
- Responsive layout (desktop/tablet/mobile)

### User Experience
- Loading skeletons for better perceived performance
- Toast notifications for actions
- Confirmation dialogs for destructive actions
- Empty states with helpful messages
- Error messages with actionable advice
- Real-time data updates

### Accessibility
- Semantic HTML
- Proper color contrast
- Icon + text labels
- Keyboard navigation support
- Screen reader friendly

## Configuration Files

### Backend
- `requirements.txt` - Python dependencies
- `backend_api.py` - FastAPI server
- `sending_update.py` - Email processing logic

### Frontend
- `package.json` - Node dependencies
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript settings
- `tailwind.config.js` - Style configuration
- `.eslintrc.cjs` - Code quality rules

### Documentation
- `FULLSTACK_SETUP.md` - Complete setup guide
- `QUICK_START_FULLSTACK.md` - Quick reference
- `frontend/README.md` - Frontend documentation
- `PROJECT_OVERVIEW.md` - This file

## Running the Application

### One-Command Start
```bash
./start.sh
```

### Manual Start
```bash
# Terminal 1: Backend
source .venv/bin/activate
python backend_api.py

# Terminal 2: Frontend
cd frontend && npm run dev
```

## Testing the Application

1. Start both servers
2. Open http://localhost:3000
3. View dashboard statistics
4. Browse bookings in different sections
5. Click "Start Full Process" to test email workflow
6. Check Settings page for configuration
7. Verify Excel updates after processing

## Performance Considerations

### Backend
- Thread pool for non-blocking operations
- Efficient Excel reading with pandas
- Connection pooling for email
- Request timeout protection

### Frontend
- Code splitting with React Router
- Lazy loading of components
- React Query caching (5s stale time)
- Optimized re-renders
- Production build minification
- Tree-shaking for smaller bundle

## Security Features

- CORS middleware with specific origins
- Environment variable for sensitive data
- Input validation with Pydantic
- Type safety in TypeScript
- Secure Gmail App Passwords
- No hardcoded credentials (moved to config)

## Production Readiness

### What's Ready
✅ Full TypeScript coverage
✅ Error handling and logging
✅ Loading and empty states
✅ Responsive design
✅ Production build configuration
✅ Environment variable support
✅ API documentation (Swagger)
✅ Comprehensive documentation

### Recommended Improvements
- [ ] User authentication and authorization
- [ ] Database migration (PostgreSQL)
- [ ] Unit and integration tests
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Environment-specific configs
- [ ] Monitoring and analytics
- [ ] Rate limiting
- [ ] Backup and recovery system

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## System Requirements

### Development
- Python 3.8+
- Node.js 18+
- 4GB RAM minimum
- macOS/Linux/Windows

### Production
- Python 3.8+
- Node.js 18+ (for building)
- 2GB RAM minimum
- Linux server recommended

## Code Quality

- TypeScript strict mode enabled
- ESLint configured
- Consistent code style
- Component-based architecture
- Clear separation of concerns
- Comprehensive comments
- Type-safe API layer

## Deployment Checklist

- [ ] Install Node.js on production server
- [ ] Build frontend: `npm run build`
- [ ] Serve frontend with nginx/Apache
- [ ] Run backend with gunicorn/uvicorn
- [ ] Set environment variables
- [ ] Configure reverse proxy
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test email functionality

## Support & Maintenance

### Logs Location
- Backend: Terminal output
- Frontend: Browser console
- Email logs: `email_send_log.xlsx`

### Common Tasks
```bash
# Update dependencies
pip install --upgrade -r requirements.txt
cd frontend && npm update

# Clear cache
rm -rf frontend/node_modules/.vite

# Rebuild frontend
cd frontend && npm run build
```

## Credits

**Company**: Within Earth Travel Pvt. Ltd.
**Technology**: Python FastAPI + React + TypeScript
**Database**: Excel (HCN1.xlsx)
**AI**: OpenAI GPT
**Version**: 1.0.0
**Created**: December 2024

---

For detailed setup instructions, see [FULLSTACK_SETUP.md](FULLSTACK_SETUP.md)
For quick start guide, see [QUICK_START_FULLSTACK.md](QUICK_START_FULLSTACK.md)
