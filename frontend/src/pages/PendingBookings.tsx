import { Clock } from 'lucide-react';
import BookingTable from '@/components/BookingTable';
import { usePendingBookings } from '@/hooks/useBookings';

export default function PendingBookings() {
  const { data, isLoading, error } = usePendingBookings();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error loading pending bookings</h3>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Clock className="w-8 h-8 mr-3 text-yellow-600" />
            Pending HCN
          </h2>
          <p className="mt-2 text-gray-600">
            {data ? `${data.count} bookings awaiting confirmation` : 'Loading pending bookings...'}
          </p>
        </div>
      </div>

      <BookingTable bookings={data?.bookings || []} isLoading={isLoading} />
    </div>
  );
}
