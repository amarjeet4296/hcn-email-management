import { Link } from 'react-router-dom';
import { Booking } from '@/types';
import { formatDate, getStatusColor, getIssueColor, truncateText } from '@/utils/helpers';
import { Mail, Phone, Calendar, Users, Building2, Eye } from 'lucide-react';

interface BookingTableProps {
  bookings: Booking[];
  isLoading?: boolean;
}

export default function BookingTable({ bookings, isLoading }: BookingTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-500">There are no bookings matching the current filter.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HCN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {booking['File Number']}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Building2 className="w-3 h-3 mr-1" />
                      {truncateText(booking['Hotel Name'], 30)}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center mt-1">
                      <Users className="w-3 h-3 mr-1" />
                      {booking['Rooms/Nights']} | {booking['Total Pax']} pax
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking['Guest Name']}
                  </div>
                  <div className="text-xs text-gray-500">
                    Booked: {formatDate(booking['Booking Date'])}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium">{formatDate(booking['Check-In'])}</div>
                      <div className="text-xs text-gray-500">to {formatDate(booking['Check-Out'])}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm space-y-1">
                    {booking['Contact Person Email'] && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-3 h-3 mr-1" />
                        <span className="text-xs truncate max-w-[200px]">
                          {booking['Contact Person Email']}
                        </span>
                      </div>
                    )}
                    {booking['Contact Person Phone'] && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        <span className="text-xs">{booking['Contact Person Phone']}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.Status)}`}>
                      {booking.Status}
                    </span>
                    {booking.Issue && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getIssueColor(booking.Issue)}`}>
                        {booking.Issue}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.SupplierHCN ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {booking.SupplierHCN}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/bookings/${booking['SrNo'] || index + 1}`}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
