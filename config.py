"""
Configuration management for HCN Email Management System
Loads settings from environment variables (.env file)
"""

import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# ========================= CREDENTIALS =========================

# Gmail Configuration
GMAIL_ADDRESS = os.getenv('GMAIL_ADDRESS', '')
GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD', '')

# OpenAI API Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

# ========================= DATABASE CONFIGURATION =========================

# Excel Database
EXCEL_FILE_PATH = os.getenv('EXCEL_FILE_PATH', 'HCN1.xlsx')
SHEET_NAME = os.getenv('SHEET_NAME', 'HotelReport (1)')

# ========================= EMAIL SETTINGS =========================

# Send reminder after X hours if no HCN received
REMINDER_AFTER_HOURS = int(os.getenv('REMINDER_AFTER_HOURS', '2'))

# Check emails from last X days
DAYS_TO_CHECK = int(os.getenv('DAYS_TO_CHECK', '7'))

# Delay between sending emails (seconds)
DELAY_BETWEEN_EMAILS = int(os.getenv('DELAY_BETWEEN_EMAILS', '2'))

# ========================= COMPANY DETAILS =========================

COMPANY_NAME = os.getenv('COMPANY_NAME', 'Within Earth Travel Pvt. Ltd.')
SENDER_NAME = os.getenv('SENDER_NAME', 'Reservations Team')

# ========================= SECURITY SETTINGS =========================

# JWT Secret Key for authentication
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-this-in-production')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '1440'))

# ========================= SERVER CONFIGURATION =========================

# Backend API
BACKEND_PORT = int(os.getenv('BACKEND_PORT', '8000'))
BACKEND_HOST = os.getenv('BACKEND_HOST', '0.0.0.0')

# Frontend
FRONTEND_PORT = int(os.getenv('FRONTEND_PORT', '3000'))

# ========================= VALIDATION =========================

def validate_config():
    """Validate that all required configuration is present"""
    errors = []

    if not GMAIL_ADDRESS or GMAIL_ADDRESS == 'your_email@gmail.com':
        errors.append("GMAIL_ADDRESS is not configured in .env file")

    if not GMAIL_APP_PASSWORD or GMAIL_APP_PASSWORD == 'xxxx xxxx xxxx xxxx':
        errors.append("GMAIL_APP_PASSWORD is not configured in .env file")

    if not OPENAI_API_KEY or OPENAI_API_KEY.startswith('sk-your-'):
        errors.append("OPENAI_API_KEY is not configured in .env file")

    if not os.path.exists(EXCEL_FILE_PATH):
        errors.append(f"Excel file not found: {EXCEL_FILE_PATH}")

    if SECRET_KEY == 'your-secret-key-change-this-in-production' or SECRET_KEY == 'your-secret-key-change-this-in-production-use-random-string':
        errors.append("SECRET_KEY should be changed to a secure random string for production")

    return errors

def print_config_status():
    """Print configuration status for debugging"""
    print("\n" + "="*60)
    print("CONFIGURATION STATUS")
    print("="*60)

    errors = validate_config()

    if errors:
        print("\n❌ Configuration Issues:")
        for error in errors:
            print(f"   - {error}")
        print("\n💡 Please update the .env file with correct values")
        return False
    else:
        print("\n✅ All required configuration is present")
        print(f"\n📧 Gmail: {GMAIL_ADDRESS}")
        print(f"📁 Excel File: {EXCEL_FILE_PATH}")
        print(f"🏢 Company: {COMPANY_NAME}")
        print(f"⏰ Reminder After: {REMINDER_AFTER_HOURS} hours")
        print(f"�� Check Emails: Last {DAYS_TO_CHECK} days")
        print(f"🌐 Backend: http://{BACKEND_HOST}:{BACKEND_PORT}")
        print("="*60)
        return True

# Run validation when imported
if __name__ == "__main__":
    print_config_status()
