import { Hotel, LogOut, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/helpers';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'All Bookings', href: '/bookings' },
  { name: 'Pending', href: '/pending' },
  { name: 'Critical', href: '/critical' },
  { name: 'Settings', href: '/settings' },
];

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Hotel className="w-8 h-8 text-primary-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              HCN Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.full_name || user?.username}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
