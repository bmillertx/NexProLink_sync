import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
            <Link href="/become-contributor" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors">
              Become a Contributor
            </Link>
            <Link href="/login" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              Sign Up
            </Link>
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
              <Link href="/find-professional" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500">
                Find a Professional
              </Link>
              <Link href="/become-contributor" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500">
                Become a Contributor
              </Link>
              <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500">
                Login
              </Link>
              <Link href="/signup" className="block px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
                Sign Up
              </Link>
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
