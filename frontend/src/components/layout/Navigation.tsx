import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getNavigationItems = () => {
    if (!userProfile) return [];

    switch (userProfile.userType) {
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Dashboard' },
          { href: '/admin/experts/pending', label: 'Pending Experts' },
          { href: '/admin/experts/approved', label: 'Approved Experts' },
          { href: '/admin/clients', label: 'Clients' },
          { href: '/admin/analytics', label: 'Analytics' }
        ];
      case 'expert':
        return [
          { href: '/expert/dashboard', label: 'Dashboard' },
          { href: '/expert/profile', label: 'Profile' },
          { href: '/expert/availability', label: 'Availability' },
          { href: '/expert/bookings', label: 'Bookings' },
          { href: '/expert/earnings', label: 'Earnings' }
        ];
      case 'client':
        return [
          { href: '/client/dashboard', label: 'Dashboard' },
          { href: '/client/bookings', label: 'My Bookings' },
          { href: '/client/experts', label: 'Find Experts' },
          { href: '/client/payments', label: 'Payment Methods' }
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  NexProLink
                </span>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-6">
              {!user && (
                <>
                  <Link
                    href="/experts"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    Find Experts
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    How It Works
                  </Link>
                </>
              )}

              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500">
                    <UserCircleIcon className="h-6 w-6" />
                    <span>{userProfile?.displayName || user.email}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {getNavigationItems().map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-6 w-6 text-gray-400" />
                ) : (
                  <MoonIcon className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navigation;
