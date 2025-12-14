import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { ArrowLeft, Calendar, User, Hotel, MapPin, Mail, Phone, FileText, Plus, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import type { AddActionItemRequest } from '@/types';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const bookingId = parseInt(id || '0');

  const [showAddAction, setShowAddAction] = useState(false);
  const [actionType, setActionType] = useState('note_added');
  const [actionDescription, setActionDescription] = useState('');

  // Fetch booking details
  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => apiService.getBookingDetails(bookingId),
    enabled: !!bookingId,
  });

  // Add action item mutation
  const addActionMutation = useMutation({
    mutationFn: (request: AddActionItemRequest) => apiService.addActionItem(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      toast.success('Action item added successfully');
      setActionDescription('');
      setActionType('note_added');
      setShowAddAction(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add action item');
    },
  });

  // Delete action item mutation
  const deleteActionMutation = useMutation({
    mutationFn: (actionId: string) => apiService.deleteActionItem(actionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      toast.success('Action item deleted');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete action item');
    },
  });

  const handleAddAction = () => {
    if (!actionDescription.trim()) {
      toast.error('Please enter a description');
      return;
    }

    addActionMutation.mutate({
      booking_id: bookingId,
      action_type: actionType,
      description: actionDescription,
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      email_sent: 'bg-blue-100 text-blue-800',
      reminder_sent: 'bg-purple-100 text-purple-800',
      hcn_received: 'bg-green-100 text-green-800',
      issue_marked: 'bg-red-100 text-red-800',
      note_added: 'bg-gray-100 text-gray-800',
      status_changed: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load booking details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
        <p className="text-gray-600 mt-1">Booking #{booking.booking_id} - {booking.file_no}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest & Hotel Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Guest & Hotel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Guest Name</p>
                  <p className="font-medium">{booking.guest_name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Hotel className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Hotel</p>
                  <p className="font-medium">{booking.hotel_name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{booking.city}, {booking.country}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Check-in / Check-out</p>
                  <p className="font-medium">{formatDate(booking.check_in)} - {formatDate(booking.check_out)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Room Type</p>
                  <p className="font-medium">{booking.room_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rooms / Pax</p>
                  <p className="font-medium">{booking.num_rooms} room(s), {booking.num_pax} pax</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier & Agent Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Supplier & Agent</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Supplier</p>
                <p className="font-medium">{booking.supplier_name || 'N/A'}</p>
                <p className="text-sm text-gray-500">Ref: {booking.supplier_ref || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agent</p>
                <p className="font-medium">{booking.agent_name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{booking.agent_email}</p>
              </div>
            </div>

            {booking.supplier_hcn && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">Supplier HCN</p>
                <p className="font-medium text-green-600">{booking.supplier_hcn}</p>
              </div>
            )}
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Action Items</h2>
              <button
                onClick={() => setShowAddAction(!showAddAction)}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Action
              </button>
            </div>

            {showAddAction && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="note_added">Note Added</option>
                    <option value="email_sent">Email Sent</option>
                    <option value="reminder_sent">Reminder Sent</option>
                    <option value="hcn_received">HCN Received</option>
                    <option value="issue_marked">Issue Marked</option>
                    <option value="status_changed">Status Changed</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={actionDescription}
                    onChange={(e) => setActionDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter action description..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAction}
                    disabled={addActionMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    {addActionMutation.isPending ? 'Adding...' : 'Add'}
                  </button>
                  <button
                    onClick={() => setShowAddAction(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {booking.action_items && booking.action_items.length > 0 ? (
                booking.action_items.map((action) => (
                  <div key={action.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getActionTypeColor(action.action_type)}`}>
                          {action.action_type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">by {action.performed_by}</span>
                      </div>
                      <p className="text-sm text-gray-900">{action.description}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDateTime(action.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteActionMutation.mutate(action.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-600"
                      title="Delete action"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No action items yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Booking Status</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                  booking.status?.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status || 'N/A'}
                </span>
              </div>
              {booking.issue && (
                <div>
                  <p className="text-sm text-gray-600">Issue</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    booking.issue === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.issue}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Booking Date</p>
                <p className="font-medium">{formatDate(booking.booking_date)}</p>
              </div>
            </div>
          </div>

          {/* Email Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Email Status</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email Sent</p>
                <p className="text-sm font-medium">{booking.email_sent || 'Not sent'}</p>
                {booking.email_sent_time && (
                  <p className="text-xs text-gray-500">{formatDateTime(booking.email_sent_time)}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Reminder Sent</p>
                <p className="text-sm font-medium">{booking.reminder_sent || 'Not sent'}</p>
                {booking.reminder_time && (
                  <p className="text-xs text-gray-500">{formatDateTime(booking.reminder_time)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
