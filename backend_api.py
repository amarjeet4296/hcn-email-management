"""
HCN Email Management System - Backend API
FastAPI backend for React frontend
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import timedelta
import uvicorn
from sending_update import HCNEmailManager
import asyncio
from concurrent.futures import ThreadPoolExecutor
import threading
import pandas as pd
from auth import (
    authenticate_user, create_access_token, decode_token,
    Token, User, ACCESS_TOKEN_EXPIRE_MINUTES, get_user
)
from action_items import ActionItemsManager, ActionItem

app = FastAPI(title="HCN Email Management API")

# CORS middleware to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global manager instance
manager = HCNEmailManager()
executor = ThreadPoolExecutor(max_workers=1)
processing_lock = threading.Lock()

# Security
security = HTTPBearer()

# ==================== Request Models ====================

class LoginRequest(BaseModel):
    username: str
    password: str

class AddActionItemRequest(BaseModel):
    booking_id: int
    action_type: str
    description: str
    metadata: Optional[Dict[str, Any]] = None

class ProcessRequest(BaseModel):
    action: str  # "send_emails", "check_inbox", "send_reminders", "full_process"

# ==================== Response Models ====================

class StatusResponse(BaseModel):
    total: int
    received: int
    critical: int
    non_critical: int
    pending: int
    emailed: int
    reminded: int

class ProcessResponse(BaseModel):
    status: str
    message: str
    data: Optional[Dict[str, Any]] = None

# ==================== Auth Helpers ====================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    token_data = decode_token(token)

    if token_data is None or token_data.username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user(token_data.username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        disabled=user.disabled
    )

# ==================== API Endpoints ====================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "HCN Email Management API is running"}

# ==================== Authentication Endpoints ====================

@app.post("/api/auth/login", response_model=Token)
async def login(login_data: LoginRequest):
    """Login endpoint - returns JWT token"""
    user = authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")

@app.get("/api/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@app.post("/api/auth/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout endpoint (client should discard token)"""
    return {"status": "success", "message": "Logged out successfully"}

# ==================== Action Items Endpoints ====================

@app.get("/api/action-items/booking/{booking_id}", response_model=List[ActionItem])
async def get_booking_action_items(booking_id: int, current_user: User = Depends(get_current_user)):
    """Get all action items for a specific booking"""
    actions = ActionItemsManager.get_booking_actions(booking_id)
    return actions

@app.get("/api/action-items/recent")
async def get_recent_action_items(limit: int = 50, current_user: User = Depends(get_current_user)):
    """Get recent action items across all bookings"""
    actions = ActionItemsManager.get_recent_actions(limit)
    return {"status": "success", "count": len(actions), "actions": actions}

@app.post("/api/action-items/add", response_model=ActionItem)
async def add_action_item(
    request: AddActionItemRequest,
    current_user: User = Depends(get_current_user)
):
    """Add a new action item for a booking"""
    action = ActionItemsManager.add_action_item(
        booking_id=request.booking_id,
        action_type=request.action_type,
        description=request.description,
        performed_by=current_user.username,
        metadata=request.metadata
    )
    return action

@app.delete("/api/action-items/{action_id}")
async def delete_action_item(action_id: str, current_user: User = Depends(get_current_user)):
    """Delete an action item"""
    success = ActionItemsManager.delete_action_item(action_id)
    if not success:
        raise HTTPException(status_code=404, detail="Action item not found")
    return {"status": "success", "message": "Action item deleted"}

# ==================== Booking Endpoints ====================

@app.get("/api/status", response_model=StatusResponse)
async def get_status():
    """Get current status overview"""
    try:
        stats = manager.get_summary_stats()
        return StatusResponse(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bookings")
async def get_bookings():
    """Get all bookings data"""
    try:
        df = manager.read_excel()
        df['Status_lower'] = df['Status'].str.lower().str.strip()
        relevant = df[df['Status_lower'].isin(['confirmed', 'vouchered'])]

        # Convert to dict and handle NaN values
        bookings = relevant.fillna('').to_dict('records')

        # Convert datetime objects to strings
        for booking in bookings:
            for key, value in booking.items():
                if hasattr(value, 'strftime'):
                    booking[key] = value.strftime('%Y-%m-%d')

        return {
            "status": "success",
            "count": len(bookings),
            "bookings": bookings
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bookings/pending")
async def get_pending_bookings():
    """Get bookings pending HCN"""
    try:
        df = manager.read_excel()
        df['Status_lower'] = df['Status'].str.lower().str.strip()
        relevant = df[df['Status_lower'].isin(['confirmed', 'vouchered'])]
        pending = relevant[relevant['Issue'].isna()]

        bookings = pending.fillna('').to_dict('records')

        for booking in bookings:
            for key, value in booking.items():
                if hasattr(value, 'strftime'):
                    booking[key] = value.strftime('%Y-%m-%d')

        return {
            "status": "success",
            "count": len(bookings),
            "bookings": bookings
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bookings/critical")
async def get_critical_bookings():
    """Get bookings with critical issues"""
    try:
        df = manager.read_excel()
        df['Status_lower'] = df['Status'].str.lower().str.strip()
        relevant = df[df['Status_lower'].isin(['confirmed', 'vouchered'])]
        critical = relevant[relevant['Issue'] == 'Critical']

        bookings = critical.fillna('').to_dict('records')

        for booking in bookings:
            for key, value in booking.items():
                if hasattr(value, 'strftime'):
                    booking[key] = value.strftime('%Y-%m-%d')

        return {
            "status": "success",
            "count": len(bookings),
            "bookings": bookings
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bookings/summary")
async def get_bookings_summary():
    """
    Get summary of all bookings with key details: guest name, dates, hotel, status
    """
    try:
        df = manager.read_excel()
        df['Status_lower'] = df['Status'].str.lower().str.strip()
        relevant = df[df['Status_lower'].isin(['confirmed', 'vouchered'])]

        # Create summary list
        summaries = []
        for _, row in relevant.iterrows():
            summary = {
                "booking_id": int(row['SrNo']) if pd.notna(row['SrNo']) else None,
                "guest_name": str(row['GuestName']) if pd.notna(row['GuestName']) else '',
                "check_in": row['FromDate'].strftime('%Y-%m-%d') if pd.notna(row['FromDate']) else '',
                "check_out": row['ToDate'].strftime('%Y-%m-%d') if pd.notna(row['ToDate']) else '',
                "hotel_name": str(row['HotelName']) if pd.notna(row['HotelName']) else '',
                "city": str(row['CityName']) if pd.notna(row['CityName']) else '',
                "status": str(row['Status']) if pd.notna(row['Status']) else '',
                "issue": str(row['Issue']) if pd.notna(row['Issue']) else '',
                "has_hcn": bool(pd.notna(row['SupplierHCN']) and str(row['SupplierHCN']).strip())
            }
            summaries.append(summary)

        return {
            "status": "success",
            "count": len(summaries),
            "bookings": summaries
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bookings/{booking_id}")
async def get_booking_details(booking_id: int):
    """
    Get detailed information for a specific booking
    Returns: guest name, check-in/check-out dates, hotel info, and all other booking details
    """
    try:
        df = manager.read_excel()

        # Find booking by SrNo (serial number)
        booking = df[df['SrNo'] == booking_id]

        if booking.empty:
            raise HTTPException(status_code=404, detail=f"Booking with ID {booking_id} not found")

        # Convert to dict
        booking_data = booking.fillna('').to_dict('records')[0]

        # Convert datetime objects to strings
        for key, value in booking_data.items():
            if hasattr(value, 'strftime'):
                booking_data[key] = value.strftime('%Y-%m-%d')

        # Get action items for this booking
        action_items = ActionItemsManager.get_booking_actions(booking_id)

        # Extract key information for easier access
        details = {
            "status": "success",
            "booking_id": booking_id,
            "guest_name": booking_data.get('GuestName', ''),
            "check_in": booking_data.get('FromDate', ''),
            "check_out": booking_data.get('ToDate', ''),
            "hotel_name": booking_data.get('HotelName', ''),
            "city": booking_data.get('CityName', ''),
            "country": booking_data.get('CountryName', ''),
            "booking_date": booking_data.get('BookingDate', ''),
            "file_no": booking_data.get('FileNo', ''),
            "room_type": booking_data.get('RoomType', ''),
            "num_rooms": booking_data.get('NoOFRooms', 0),
            "num_pax": booking_data.get('NoOfPax', 0),
            "status": booking_data.get('Status', ''),
            "supplier_name": booking_data.get('SupplierName', ''),
            "supplier_ref": booking_data.get('SupplierRef', ''),
            "supplier_hcn": booking_data.get('SupplierHCN', ''),
            "agent_name": booking_data.get('AgentName', ''),
            "agent_email": booking_data.get('Agent Email', ''),
            "issue": booking_data.get('Issue', ''),
            "email_sent": booking_data.get('EmailSent', ''),
            "email_sent_time": booking_data.get('EmailSentTime', ''),
            "reminder_sent": booking_data.get('ReminderSent', ''),
            "reminder_time": booking_data.get('ReminderTime', ''),
            "action_items": [item.dict() for item in action_items],  # Include action items
            "full_details": booking_data  # Complete booking data
        }

        return details
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process", response_model=ProcessResponse)
async def process_emails(request: ProcessRequest):
    """
    Process emails based on action:
    - full_process: Run complete process (send → check → remind)
    - send_emails: Send initial emails only
    - check_inbox: Check inbox and analyze only
    - send_reminders: Send reminders only
    """

    # Check if already processing
    if not processing_lock.acquire(blocking=False):
        raise HTTPException(status_code=409, detail="Process already running")

    try:
        # Run in thread pool to avoid blocking
        loop = asyncio.get_event_loop()

        if request.action == "full_process":
            await loop.run_in_executor(executor, manager.process_all)
            return ProcessResponse(
                status="success",
                message="Full process completed successfully"
            )
        else:
            raise HTTPException(status_code=400, detail=f"Unknown action: {request.action}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        processing_lock.release()

@app.get("/api/config")
async def get_config():
    """Get current configuration"""
    from sending_update import (
        GMAIL_ADDRESS, REMINDER_AFTER_HOURS,
        DAYS_TO_CHECK, DELAY_BETWEEN_EMAILS,
        COMPANY_NAME, SENDER_NAME
    )

    return {
        "gmail_address": GMAIL_ADDRESS,
        "reminder_after_hours": REMINDER_AFTER_HOURS,
        "days_to_check": DAYS_TO_CHECK,
        "delay_between_emails": DELAY_BETWEEN_EMAILS,
        "company_name": COMPANY_NAME,
        "sender_name": SENDER_NAME
    }

# ==================== Main ====================

if __name__ == "__main__":
    print("="*60)
    print("HCN EMAIL MANAGEMENT - Backend API Server")
    print("="*60)
    print("\nStarting server on http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("\nPress CTRL+C to stop\n")

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
