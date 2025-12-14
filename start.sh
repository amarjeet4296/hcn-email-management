#!/bin/bash

# HCN Management System - Startup Script
# This script starts both backend and frontend servers

echo "======================================"
echo "HCN Management System"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    echo "macOS: brew install node"
    echo "Ubuntu: sudo apt install nodejs npm"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed!"
    echo "Please install Python 3 from https://www.python.org/"
    exit 1
fi

echo "✓ Node.js $(node --version) detected"
echo "✓ Python $(python3 --version) detected"
echo ""

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating Python virtual environment..."
source .venv/bin/activate

# Install Python dependencies if needed
if [ ! -f ".venv/.dependencies_installed" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    touch .venv/.dependencies_installed
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "======================================"
echo "Starting servers..."
echo "======================================"
echo ""
echo "Backend will run on: http://localhost:8000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
echo "Starting backend server..."
python backend_api.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend in background
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 3

echo ""
echo "======================================"
echo "✓ Both servers are running!"
echo "======================================"
echo ""
echo "Open your browser to: http://localhost:3000"
echo ""
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
