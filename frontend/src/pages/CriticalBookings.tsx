import { AlertCircle } from 'lucide-react';
import BookingTable from '@/components/BookingTable';
import { useCriticalBookings } from '@/hooks/useBookings';

export default function CriticalBookings() {
  const { data, isLoading, error } = useCriticalBookings();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error loading critical bookings</h3>
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
            <AlertCircle className="w-8 h-8 mr-3 text-red-600" />
            Critical Issues
          </h2>
          <p className="mt-2 text-gray-600">
            {data ? `${data.count} bookings with critical issues requiring immediate attention` : 'Loading critical bookings...'}
          </p>
        </div>
      </div>

      {data && data.count > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Action Required</h3>
              <p className="mt-1 text-sm text-red-700">
                These bookings have critical issues such as no rooms available or rate discrepancies.
                Please contact the hotels directly to resolve these issues.
              </p>
            </div>
          </div>
        </div>
      )}

      <BookingTable bookings={data?.bookings || []} isLoading={isLoading} />
    </div>
  );
}
