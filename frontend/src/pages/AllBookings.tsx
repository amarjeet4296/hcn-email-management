import { FileText } from 'lucide-react';
import BookingTable from '@/components/BookingTable';
import { useAllBookings } from '@/hooks/useBookings';

export default function AllBookings() {
  const { data, isLoading, error } = useAllBookings();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error loading bookings</h3>
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
            <FileText className="w-8 h-8 mr-3 text-primary-600" />
            All Bookings
          </h2>
          <p className="mt-2 text-gray-600">
            {data ? `Showing ${data.count} bookings` : 'Loading bookings...'}
          </p>
        </div>
      </div>

      <BookingTable bookings={data?.bookings || []} isLoading={isLoading} />
    </div>
  );
}
