export interface Booking {
  SrNo?: number;
  'File Number': string;
  'Guest Name': string;
  'Hotel Name': string;
  'Check-In': string;
  'Check-Out': string;
  'Total Pax': number;
  'Rooms/Nights': string;
  'Booking Date': string;
  'Contact Person Email': string;
  'Contact Person Phone': string;
  Status: string;
  SupplierHCN?: string;
  EmailSent?: string;
  EmailSentTime?: string;
  ReminderSent?: string;
  ReminderTime?: string;
  Issue?: 'Critical' | 'Non Critical' | '';
}

export interface StatusResponse {
  total: number;
  received: number;
  critical: number;
  non_critical: number;
  pending: number;
  emailed: number;
  reminded: number;
}

export interface BookingsResponse {
  status: string;
  count: number;
  bookings: Booking[];
}

export interface ProcessRequest {
  action: 'send_emails' | 'check_inbox' | 'send_reminders' | 'full_process';
}

export interface ProcessResponse {
  status: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface ConfigResponse {
  gmail_address: string;
  reminder_after_hours: number;
  days_to_check: number;
  delay_between_emails: number;
  company_name: string;
  sender_name: string;
}

// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface User {
  username: string;
  email: string | null;
  full_name: string | null;
  disabled: boolean | null;
}

// Action Items types
export interface ActionItem {
  id: string;
  booking_id: number;
  action_type: string;
  description: string;
  performed_by: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AddActionItemRequest {
  booking_id: number;
  action_type: string;
  description: string;
  metadata?: Record<string, any>;
}

// Booking Details types
export interface BookingDetails {
  status: string;
  booking_id: number;
  guest_name: string;
  check_in: string;
  check_out: string;
  hotel_name: string;
  city: string;
  country: string;
  booking_date: string;
  file_no: string;
  room_type: string;
  num_rooms: number;
  num_pax: number;
  supplier_name: string;
  supplier_ref: string;
  supplier_hcn: string;
  agent_name: string;
  agent_email: string;
  issue: string;
  email_sent: string;
  email_sent_time: string;
  reminder_sent: string;
  reminder_time: string;
  action_items: ActionItem[];
  full_details: Record<string, any>;
}

export interface BookingSummary {
  booking_id: number;
  guest_name: string;
  check_in: string;
  check_out: string;
  hotel_name: string;
  city: string;
  status: string;
  issue: string;
  has_hcn: boolean;
}
