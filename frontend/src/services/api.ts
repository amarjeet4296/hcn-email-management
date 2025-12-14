import axios from 'axios';
import type {
  StatusResponse,
  BookingsResponse,
  ProcessRequest,
  ProcessResponse,
  ConfigResponse,
  LoginRequest,
  AuthToken,
  User,
  BookingDetails,
  BookingSummary,
  ActionItem,
  AddActionItemRequest,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for long-running processes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // Server responded with error
      const message = error.response.data?.detail || error.response.statusText;
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message);
    }
  }
);

export const apiService = {
  // Health check
  healthCheck: async () => {
    const { data } = await api.get('/');
    return data;
  },

  // ==================== Authentication ====================

  // Login
  login: async (credentials: LoginRequest): Promise<AuthToken> => {
    const { data } = await api.post<AuthToken>('/api/auth/login', credentials);
    return data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/api/auth/me');
    return data;
  },

  // Logout
  logout: async (): Promise<{ status: string; message: string }> => {
    const { data } = await api.post('/api/auth/logout');
    return data;
  },

  // ==================== Bookings ====================

  // Get status overview
  getStatus: async (): Promise<StatusResponse> => {
    const { data } = await api.get<StatusResponse>('/api/status');
    return data;
  },

  // Get all bookings
  getAllBookings: async (): Promise<BookingsResponse> => {
    const { data } = await api.get<BookingsResponse>('/api/bookings');
    return data;
  },

  // Get bookings summary
  getBookingsSummary: async (): Promise<{ status: string; count: number; bookings: BookingSummary[] }> => {
    const { data } = await api.get('/api/bookings/summary');
    return data;
  },

  // Get booking details
  getBookingDetails: async (bookingId: number): Promise<BookingDetails> => {
    const { data } = await api.get<BookingDetails>(`/api/bookings/${bookingId}`);
    return data;
  },

  // Get pending bookings
  getPendingBookings: async (): Promise<BookingsResponse> => {
    const { data } = await api.get<BookingsResponse>('/api/bookings/pending');
    return data;
  },

  // Get critical bookings
  getCriticalBookings: async (): Promise<BookingsResponse> => {
    const { data } = await api.get<BookingsResponse>('/api/bookings/critical');
    return data;
  },

  // ==================== Action Items ====================

  // Get booking action items
  getBookingActionItems: async (bookingId: number): Promise<ActionItem[]> => {
    const { data } = await api.get<ActionItem[]>(`/api/action-items/booking/${bookingId}`);
    return data;
  },

  // Get recent action items
  getRecentActionItems: async (limit: number = 50): Promise<{ status: string; count: number; actions: ActionItem[] }> => {
    const { data } = await api.get(`/api/action-items/recent?limit=${limit}`);
    return data;
  },

  // Add action item
  addActionItem: async (request: AddActionItemRequest): Promise<ActionItem> => {
    const { data } = await api.post<ActionItem>('/api/action-items/add', request);
    return data;
  },

  // Delete action item
  deleteActionItem: async (actionId: string): Promise<{ status: string; message: string }> => {
    const { data } = await api.delete(`/api/action-items/${actionId}`);
    return data;
  },

  // ==================== Process ====================

  // Process emails
  processEmails: async (request: ProcessRequest): Promise<ProcessResponse> => {
    const { data } = await api.post<ProcessResponse>('/api/process', request);
    return data;
  },

  // ==================== Configuration ====================

  // Get configuration
  getConfig: async (): Promise<ConfigResponse> => {
    const { data } = await api.get<ConfigResponse>('/api/config');
    return data;
  },
};

export default api;
