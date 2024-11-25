import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { 
  SunIcon, 
  MoonIcon, 
  Bars3Icon as MenuIcon, 
  XMarkIcon as XIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-8 w-8 text-gray-500" />
            )}
            <span className="text-gray-700 dark:text-gray-200">
              {user.displayName || 'User'}
            </span>
          </div>
          <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors">
            Dashboard
          </Link>
        </div>
      );
    }

    return (
      <>
        <Link href="/auth/signin" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors">
          Login
        </Link>
        <Link href="/auth/signup" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
          Sign Up
        </Link>
      </>
    );
  };

  return (
    <header className="fixed w-full z-50 glass">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              NexProLink
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/find-professional" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors">
              Find a Professional
            </Link>
            <Link href="/auth/signup?role=consultant" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors">
              Become a Consultant
            </Link>
            {renderAuthButtons()}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-gray-200" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {user && (
                <div className="flex items-center space-x-2 px-3 py-2">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'Profile'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-500" />
                  )}
                  <span className="text-gray-700 dark:text-gray-200">
                    {user.displayName || 'User'}
                  </span>
                </div>
              )}
              <Link href="/find-professional" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500">
                Find a Professional
              </Link>
              <Link href="/auth/signup?role=consultant" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500">
                Become a Consultant
              </Link>
              {user ? (
                <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500">
                  Dashboard
                </Link>
              ) : (
                <Link href="/auth/signin" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500">
                  Login
                </Link>
              )}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500"
              >
                {theme === 'dark' ? (
                  <>
                    <SunIcon className="h-5 w-5 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-5 w-5 mr-2" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
