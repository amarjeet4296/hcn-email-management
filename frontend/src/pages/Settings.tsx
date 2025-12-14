import { Settings as SettingsIcon, Mail, Clock, Calendar, Building2 } from 'lucide-react';
import { useConfig } from '@/hooks/useBookings';

export default function Settings() {
  const { data: config, isLoading, error } = useConfig();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error loading settings</h3>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-primary-600" />
          Settings
        </h2>
        <p className="mt-2 text-gray-600">System configuration and settings</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : config ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary-600" />
              Email Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gmail Address
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {config.gmail_address}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sender Name
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {config.sender_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Delay
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {config.delay_between_emails} seconds between emails
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-600" />
              Timing Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reminder After
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {config.reminder_after_hours} hours
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Send reminder if no response received
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Days to Check
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  Last {config.days_to_check} days
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Check emails from the last N days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-primary-600" />
              Company Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {config.company_name}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 lg:col-span-2">
            <div className="flex">
              <SettingsIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Configuration Note</h3>
                <p className="mt-1 text-sm text-blue-700">
                  These settings are configured in the backend. To modify them, please edit the
                  configuration in <code className="bg-blue-100 px-1 rounded">sending_update.py</code>
                  and restart the backend server.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
