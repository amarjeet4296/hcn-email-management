# HCN Management System - Frontend

A professional React + TypeScript frontend application for managing Hotel Confirmation Numbers (HCN).

## Features

- **Dashboard**: Real-time overview of booking statuses, HCN requests, and responses
- **Bookings Management**: View all bookings with detailed information
- **Pending Tracking**: Monitor bookings awaiting HCN confirmation
- **Critical Issues**: Track and manage bookings with critical problems
- **Settings**: View system configuration
- **Automated Processing**: Trigger email workflows with a single click

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js

Check your installation:

```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

## Installation

### 1. Install Node.js (if not installed)

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Windows:**
Download and install from [https://nodejs.org/](https://nodejs.org/)

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

### 2. Install Dependencies

Navigate to the frontend directory and install packages:

```bash
cd frontend
npm install
```

This will install all required dependencies from `package.json`.

## Configuration

Create a `.env` file in the frontend directory (optional):

```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different port:

```env
VITE_API_URL=http://localhost:8000
```

## Development

### Start the Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API Proxy**: Automatically proxies `/api` requests to http://localhost:8000

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── StatCard.tsx     # Statistics display card
│   │   ├── BookingTable.tsx # Bookings data table
│   │   ├── ProcessButton.tsx # Email process trigger
│   │   └── Header.tsx       # Navigation header
│   ├── pages/               # Route pages
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── AllBookings.tsx  # All bookings view
│   │   ├── PendingBookings.tsx
│   │   ├── CriticalBookings.tsx
│   │   └── Settings.tsx     # Configuration view
│   ├── services/            # API layer
│   │   └── api.ts          # API client & methods
│   ├── hooks/               # Custom React hooks
│   │   └── useBookings.ts  # Data fetching hooks
│   ├── types/               # TypeScript types
│   │   └── index.ts        # Type definitions
│   ├── utils/               # Utility functions
│   │   └── helpers.ts      # Helper functions
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── tailwind.config.js      # Tailwind config
```

## Usage

### Starting the Full Application

**Terminal 1 - Backend:**
```bash
cd /Users/amarjeet/Downloads/hcn
python backend_api.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open http://localhost:3000 in your browser.

### Main Features

1. **Dashboard**: View real-time statistics and system overview
2. **All Bookings**: Browse all confirmed and vouchered bookings
3. **Pending**: Track bookings awaiting HCN confirmation
4. **Critical**: Manage bookings with critical issues
5. **Settings**: View system configuration
6. **Process Emails**: Click the button to start the automated workflow

### API Integration

The frontend communicates with the backend via these endpoints:

- `GET /api/status` - Get status overview
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/pending` - Get pending bookings
- `GET /api/bookings/critical` - Get critical bookings
- `POST /api/process` - Start email processing
- `GET /api/config` - Get configuration

## Styling

This project uses **Tailwind CSS** for styling with a custom theme:

- Primary color: Blue (`primary-*`)
- Professional design patterns
- Responsive layout (mobile-first)
- Modern shadows and transitions
- Accessible color contrast

### Customizing Colors

Edit [tailwind.config.js](tailwind.config.js) to change the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

## TypeScript

This project is fully typed with TypeScript. Key type definitions are in [src/types/index.ts](src/types/index.ts).

### Adding New Types

```typescript
// src/types/index.ts
export interface MyNewType {
  field: string;
}
```

## State Management

Uses **TanStack Query (React Query)** for server state:

- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

See [src/hooks/useBookings.ts](src/hooks/useBookings.ts) for examples.

## Error Handling

- Network errors: Automatic retry with exponential backoff
- API errors: Display error messages via toast notifications
- Loading states: Skeleton screens and loading indicators
- Empty states: Friendly messages when no data

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of components
- Optimized re-renders with React Query
- Tree-shakeable imports
- Production build optimization with Vite

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

### Backend Connection Issues

Ensure:
1. Backend is running on port 8000
2. CORS is enabled in backend
3. Check browser console for errors

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## Contributing

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Keep components small and focused
4. Add types for all props and functions
5. Use Tailwind for styling (avoid custom CSS)

## License

Proprietary - Within Earth Travel Pvt. Ltd.
