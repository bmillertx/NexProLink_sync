import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Footer from './Footer';
import { NetworkStatus } from '../common/NetworkStatus';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!profile) {
      router.push('/auth/signin');
    } else {
      router.push('/dashboard');
    }
  };

  const isAuthPage = router.pathname.startsWith('/auth/');

  const navigationLinks = [
    { name: 'Find Experts', href: '/experts' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Consultations', href: '/consultations' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>NexProLink - Professional Consultation Platform</title>
        <meta name="description" content="Connect with professionals for expert consultations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!isAuthPage && (
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    NexProLink
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:ml-6 md:flex md:space-x-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`${
                        router.pathname === link.href
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400'
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                {user ? (
                  <>
                    <button
                      onClick={handleDashboardClick}
                      className={`text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium ${
                        authLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={authLoading}
                    >
                      {authLoading ? 'Loading...' : 'Dashboard'}
                    </button>
                    <Link
                      href="/profile"
                      className="ml-4 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="ml-4 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="ml-4 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    router.pathname === link.href
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400'
                  } block px-3 py-2 rounded-md text-base font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Footer />
      <NetworkStatus />
    </div>
  );
}
