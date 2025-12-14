"""
Booking Confirmation Email Sender - HCN_list.xlsx
Sends confirmation emails for bookings missing CFMNO or SupplierHCN
"""

import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import time
import os

# ========================= CONFIGURATION =========================
# Gmail credentials - UPDATE THESE
GMAIL_ADDRESS = "withinearthtest@gmail.com"  # Your Gmail address
GMAIL_APP_PASSWORD = "owkxkadujrqdlsxv"  # Gmail App Password (16 characters)

# Excel file path
EXCEL_FILE_PATH = "HCN1.xlsx"

# Sheet name in the Excel file
SHEET_NAME = "HotelReport (1)"

# Email settings
DELAY_BETWEEN_EMAILS = 2  # Seconds between emails to avoid rate limiting

# Your company signature
COMPANY_NAME = "Within Earth Pvt. Ltd."
SENDER_NAME = "Reservations Team"
# =================================================================


def read_bookings(file_path, sheet_name):
    """Read bookings from Excel file"""
    df = pd.read_excel(file_path, sheet_name=sheet_name, header=1)
    print(f"Total bookings loaded: {len(df)}")
    return df


def filter_bookings(df):
    """Filter bookings that need confirmation emails"""
    # Filter for Confirmed or Vouchered status (case insensitive)
    df['Status_lower'] = df['Status'].str.lower().str.strip()
    status_filter = df['Status_lower'].isin(['confirmed', 'vouchered'])
    filtered_df = df[status_filter].copy()
    print(f"Bookings with 'Confirmed' or 'Vouchered' status: {len(filtered_df)}")
    
    # Filter for missing CFMNO or SupplierHCN
    def needs_confirmation(row):
        cfmno_missing = pd.isna(row['CFMNO']) or str(row['CFMNO']).strip() == ''
        hcn_missing = pd.isna(row['SupplierHCN']) or str(row['SupplierHCN']).strip() == ''
        return cfmno_missing or hcn_missing
    
    needs_email = filtered_df.apply(needs_confirmation, axis=1)
    result_df = filtered_df[needs_email].copy()
    print(f"Bookings needing confirmation (missing CFMNO or SupplierHCN): {len(result_df)}")
    
    return result_df


def get_recipient_email(row):
    """Get the email to send to from Agent Email column"""
    agent_email = row.get('Agent Email', '')
    
    if pd.notna(agent_email) and str(agent_email).strip() and '@' in str(agent_email):
        return str(agent_email).strip()
    return None


def create_email_content(row):
    """Create email subject and body for confirmation request"""
    guest_name = row.get('GuestName', 'Guest')
    hotel_name = row.get('HotelName', 'Hotel')
    from_date = row.get('FromDate', '')
    to_date = row.get('ToDate', '')
    room_type = row.get('RoomType', '')
    no_of_rooms = row.get('NoOFRooms', 1)
    no_of_pax = row.get('NoOfPax', '')
    file_no = row.get('FileNo', '')
    supplier_ref = row.get('SupplierRef', '')
    supplier_name = row.get('SupplierName', '')
    city_name = row.get('CityName', '')
    country_name = row.get('CountryName', '')
    
    # Format dates
    if pd.notna(from_date):
        if isinstance(from_date, datetime):
            from_date = from_date.strftime('%d-%b-%Y')
    if pd.notna(to_date):
        if isinstance(to_date, datetime):
            to_date = to_date.strftime('%d-%b-%Y')
    
    subject = f"HCN Request - {guest_name} | {hotel_name} | {from_date} to {to_date}"
    
    body = f"""Dear Team,

Greetings!

We kindly request the Hotel Confirmation Number (HCN) for the following booking:

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Guest Name       : {guest_name}
Hotel Name       : {hotel_name}
Location         : {city_name}, {country_name}
Check-in Date    : {from_date}
Check-out Date   : {to_date}
Room Type        : {room_type}
No. of Rooms     : {no_of_rooms}
No. of Guests    : {no_of_pax}
Supplier         : {supplier_name}
Our Reference    : {file_no}
Supplier Ref     : {supplier_ref if pd.notna(supplier_ref) and str(supplier_ref).strip() else 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please confirm this booking by replying with:
1. Hotel Confirmation Number (HCN)
2. Any special remarks or instructions

Thank you for your prompt assistance.

Best Regards,
{SENDER_NAME}
{COMPANY_NAME}

---
This is an automated confirmation request.
"""
    return subject, body


def send_email(recipient_email, subject, body, gmail_address, gmail_password):
    """Send email via Gmail SMTP"""
    try:
        msg = MIMEMultipart()
        msg['From'] = gmail_address
        msg['To'] = recipient_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(gmail_address, gmail_password)
            server.send_message(msg)
        
        return True, "Email sent successfully"
    except smtplib.SMTPAuthenticationError:
        return False, "Authentication failed. Check Gmail address and App Password."
    except smtplib.SMTPException as e:
        return False, f"SMTP error: {str(e)}"
    except Exception as e:
        return False, f"Error: {str(e)}"


def process_bookings(df, gmail_address, gmail_password, delay=2):
    """Process all bookings and send confirmation emails"""
    results = []
    
    for idx, row in df.iterrows():
        sr_no = row.get('SrNo', idx)
        guest_name = row.get('GuestName', 'Unknown')
        hotel_name = row.get('HotelName', 'Unknown')
        
        recipient_email = get_recipient_email(row)
        
        if not recipient_email:
            results.append({
                'SrNo': sr_no,
                'GuestName': guest_name,
                'HotelName': hotel_name,
                'Email': 'N/A',
                'Status': 'SKIPPED',
                'Reason': 'No valid email found'
            })
            print(f"[SKIP] SrNo {sr_no}: No valid email for {guest_name} at {hotel_name}")
            continue
        
        subject, body = create_email_content(row)
        success, message = send_email(recipient_email, subject, body, gmail_address, gmail_password)
        
        results.append({
            'SrNo': sr_no,
            'GuestName': guest_name,
            'HotelName': hotel_name,
            'Email': recipient_email,
            'Status': 'SENT' if success else 'FAILED',
            'Reason': message
        })
        
        status_symbol = "✓" if success else "✗"
        print(f"[{status_symbol}] SrNo {sr_no}: {guest_name} | {hotel_name} -> {recipient_email}")
        
        if success and delay > 0:
            time.sleep(delay)
    
    return results


def save_results(results, output_file="email_send_log.xlsx"):
    """Save sending results to Excel file"""
    results_df = pd.DataFrame(results)
    results_df.to_excel(output_file, index=False)
    print(f"\nResults saved to: {output_file}")
    return output_file


def main():
    print("=" * 60)
    print("BOOKING CONFIRMATION EMAIL SENDER")
    print("=" * 60)
    
    # Validate configuration
    if GMAIL_ADDRESS == "your_email@gmail.com" or GMAIL_APP_PASSWORD == "xxxx xxxx xxxx xxxx":
        print("\n⚠️  ERROR: Please update GMAIL_ADDRESS and GMAIL_APP_PASSWORD in the script!")
        print("\nTo get a Gmail App Password:")
        print("1. Go to https://myaccount.google.com/security")
        print("2. Enable 2-Factor Authentication if not already enabled")
        print("3. Go to 'App passwords' (search for it)")
        print("4. Generate a new app password for 'Mail'")
        print("5. Copy the 16-character password into the script")
        return
    
    if not os.path.exists(EXCEL_FILE_PATH):
        print(f"\n⚠️  ERROR: Excel file not found: {EXCEL_FILE_PATH}")
        print("Please update EXCEL_FILE_PATH in the script or place the file in the same folder.")
        return
    
    # Read and filter bookings
    print(f"\n📂 Reading bookings from: {EXCEL_FILE_PATH}")
    df = read_bookings(EXCEL_FILE_PATH, SHEET_NAME)
    
    print("\n🔍 Filtering bookings...")
    filtered_df = filter_bookings(df)
    
    if len(filtered_df) == 0:
        print("\n✅ No bookings require confirmation emails.")
        return
    
    # Preview bookings
    print("\n📋 Bookings to be emailed:")
    print("-" * 80)
    for idx, row in filtered_df.iterrows():
        email = get_recipient_email(row)
        status = row.get('Status', '')
        print(f"  • SrNo {row.get('SrNo')}: {row.get('GuestName', 'N/A')} | {row.get('HotelName', 'N/A')} | {status}")
        print(f"    Email: {email or 'No email'}")
    print("-" * 80)
    
    # Confirm before sending
    user_input = input(f"\n📧 Send confirmation emails to {len(filtered_df)} recipients? (yes/no): ").strip().lower()
    if user_input != 'yes':
        print("Operation cancelled.")
        return
    
    # Send emails
    print("\n📤 Sending emails...")
    results = process_bookings(filtered_df, GMAIL_ADDRESS, GMAIL_APP_PASSWORD, DELAY_BETWEEN_EMAILS)
    
    # Summary
    sent_count = sum(1 for r in results if r['Status'] == 'SENT')
    failed_count = sum(1 for r in results if r['Status'] == 'FAILED')
    skipped_count = sum(1 for r in results if r['Status'] == 'SKIPPED')
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  ✓ Sent:    {sent_count}")
    print(f"  ✗ Failed:  {failed_count}")
    print(f"  ⊘ Skipped: {skipped_count}")
    print("=" * 60)
    
    # Save log
    save_results(results)
    print("\n✅ Process completed!")


if __name__ == "__main__":
    main()