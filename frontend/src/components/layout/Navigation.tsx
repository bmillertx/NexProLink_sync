import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  ArrowRightOnRectangleIcon as LoginIcon, 
  ArrowLeftOnRectangleIcon as LogoutIcon, 
  Bars3Icon as MenuIcon, 
  UserPlusIcon as UserAddIcon, 
  XMarkIcon as XIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, userProfile, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show verification banner if email is not verified
  const showVerificationBanner = user && !user.emailVerified;

  const getNavigationItems = () => {
    if (!userProfile) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Find Experts', href: '/experts' },
        { name: 'How It Works', href: '/#how-it-works' },
      ];
    }

    switch (userProfile.userType) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Pending Experts', href: '/admin/experts/pending' },
          { name: 'Approved Experts', href: '/admin/experts/approved' },
          { name: 'Clients', href: '/admin/clients' },
          { name: 'Analytics', href: '/admin/analytics' }
        ];
      case 'expert':
        return [
          { name: 'Dashboard', href: '/expert/dashboard' },
          { name: 'Profile', href: '/expert/profile' },
          { name: 'Availability', href: '/expert/availability' },
          { name: 'Bookings', href: '/expert/bookings' },
          { name: 'Earnings', href: '/expert/earnings' }
        ];
      case 'client':
        return [
          { name: 'Dashboard', href: '/client/dashboard' },
          { name: 'My Bookings', href: '/client/bookings' },
          { name: 'Find Experts', href: '/client/experts' },
          { name: 'Payment Methods', href: '/client/payments' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {showVerificationBanner && (
        <div className={`border-b ${isDarkMode ? 'bg-yellow-900 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="max-w-7xl mx-auto py-2 px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <span className={`flex p-2 rounded-lg ${isDarkMode ? 'bg-yellow-800' : 'bg-yellow-100'}`}>
                  <svg className={`h-6 w-6 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                <p className={`ml-3 font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'} truncate`}>
                  <span className="hidden md:inline">Please verify your email address to access all features.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  NexProLink
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      router.pathname === item.href
                        ? `${isDarkMode ? 'border-blue-500 text-white' : 'border-blue-500 text-gray-900'}`
                        : `${isDarkMode ? 'border-transparent text-gray-300 hover:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-md ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {isDarkMode ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </button>

              {/* Authentication buttons */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className={`ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                      isDarkMode
                        ? 'text-white bg-gray-800 hover:bg-gray-700'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <LogoutIcon className="h-5 w-5 mr-2" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                        isDarkMode
                          ? 'text-white bg-gray-800 hover:bg-gray-700'
                          : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <LoginIcon className="h-5 w-5 mr-2" />
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <UserAddIcon className="h-5 w-5 mr-2" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <XIcon className="block h-6 w-6" />
                ) : (
                  <MenuIcon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className={`pt-2 pb-3 space-y-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  router.pathname === item.href
                    ? `${isDarkMode ? 'border-blue-500 bg-gray-800 text-white' : 'border-blue-500 bg-blue-50 text-blue-700'}`
                    : `${isDarkMode ? 'border-transparent text-gray-300 hover:bg-gray-700 hover:text-white' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
                }`}
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <>
                <Link
                  href="/auth/signin"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isDarkMode
                      ? 'border-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isDarkMode
                      ? 'border-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
