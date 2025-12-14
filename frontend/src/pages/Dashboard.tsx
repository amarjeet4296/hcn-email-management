import {
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  Send,
  RefreshCw,
  FileText
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import ProcessButton from '@/components/ProcessButton';
import { useStatus } from '@/hooks/useBookings';

export default function Dashboard() {
  const { data: status, isLoading, error } = useStatus();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error loading dashboard</h3>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <p className="text-red-600 text-sm mt-2">
            Make sure the backend server is running on http://localhost:8000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Hotel Confirmation Number (HCN) Management System
        </p>
      </div>

      <div className="mb-8">
        <ProcessButton />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : status ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={status.total}
              icon={FileText}
              color="bg-blue-500"
              description="Confirmed & Vouchered"
            />
            <StatCard
              title="HCN Received"
              value={status.received}
              icon={CheckCircle}
              color="bg-green-500"
              description="Successfully obtained"
            />
            <StatCard
              title="Pending HCN"
              value={status.pending}
              icon={Clock}
              color="bg-yellow-500"
              description="Awaiting confirmation"
            />
            <StatCard
              title="Critical Issues"
              value={status.critical}
              icon={AlertCircle}
              color="bg-red-500"
              description="Requires attention"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Non-Critical Issues"
              value={status.non_critical}
              icon={AlertCircle}
              color="bg-orange-500"
              description="Minor issues"
            />
            <StatCard
              title="Emails Sent"
              value={status.emailed}
              icon={Mail}
              color="bg-purple-500"
              description="Initial requests"
            />
            <StatCard
              title="Reminders Sent"
              value={status.reminded}
              icon={Send}
              color="bg-indigo-500"
              description="Follow-up emails"
            />
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">System Overview</h3>
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Completion Rate</p>
                <div className="mt-2 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${status.total > 0 ? (status.received / status.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 font-medium text-gray-900">
                    {status.total > 0
                      ? Math.round((status.received / status.total) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-600">Response Rate</p>
                <div className="mt-2 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          status.emailed > 0
                            ? ((status.received + status.critical + status.non_critical) / status.emailed) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 font-medium text-gray-900">
                    {status.emailed > 0
                      ? Math.round(
                          ((status.received + status.critical + status.non_critical) / status.emailed) * 100
                        )
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
