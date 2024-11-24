import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: typeof HomeIcon;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!userProfile) {
    router.push('/auth/login');
    return null;
  }

  const getNavItems = (): NavItem[] => {
    switch (userProfile.userType) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
          { name: 'Experts', href: '/admin/experts', icon: UserGroupIcon },
          { name: 'Clients', href: '/admin/clients', icon: UserIcon },
          { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
          { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
        ];
      case 'expert':
        return [
          { name: 'Dashboard', href: '/expert/dashboard', icon: HomeIcon },
          { name: 'Bookings', href: '/expert/bookings', icon: CalendarIcon },
          { name: 'Earnings', href: '/expert/earnings', icon: CreditCardIcon },
          { name: 'Profile', href: '/expert/profile', icon: UserIcon },
          { name: 'Settings', href: '/expert/settings', icon: Cog6ToothIcon },
        ];
      case 'client':
        return [
          { name: 'Dashboard', href: '/client/dashboard', icon: HomeIcon },
          { name: 'Find Experts', href: '/client/experts', icon: UserGroupIcon },
          { name: 'My Bookings', href: '/client/bookings', icon: CalendarIcon },
          { name: 'Payments', href: '/client/payments', icon: CreditCardIcon },
          { name: 'Profile', href: '/client/profile', icon: UserIcon },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              NexProLink
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary-500' : 'text-gray-400'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userProfile.displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {userProfile.userType}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="py-6 px-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="py-8 px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
