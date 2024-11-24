import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  VideoCameraIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const clientMenuItems = [
    { name: 'Overview', href: '/client/dashboard', icon: ChartBarIcon },
    { name: 'Find Consultants', href: '/client/consultants', icon: UserGroupIcon },
    { name: 'My Consultations', href: '/client/consultations', icon: CalendarIcon },
    { name: 'Video Sessions', href: '/client/sessions', icon: VideoCameraIcon },
    { name: 'Messages', href: '/client/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Billing', href: '/client/billing', icon: CreditCardIcon },
    { name: 'Settings', href: '/client/settings', icon: CogIcon },
  ];

  const consultantMenuItems = [
    { name: 'Overview', href: '/consultant/dashboard', icon: ChartBarIcon },
    { name: 'Schedule', href: '/consultant/schedule', icon: CalendarIcon },
    { name: 'My Clients', href: '/consultant/clients', icon: UserGroupIcon },
    { name: 'Video Sessions', href: '/consultant/sessions', icon: VideoCameraIcon },
    { name: 'Messages', href: '/consultant/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Services', href: '/consultant/services', icon: BriefcaseIcon },
    { name: 'Earnings', href: '/consultant/earnings', icon: CreditCardIcon },
    { name: 'Settings', href: '/consultant/settings', icon: CogIcon },
  ];

  const menuItems = profile?.role === 'consultant' ? consultantMenuItems : clientMenuItems;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-semibold text-gray-800 dark:text-white">
                    NexProLink
                  </span>
                </Link>
              </div>
              <div className="mt-5 flex-grow flex flex-col">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {menuItems.map((item) => {
                    const isActive = router.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        <item.icon
                          className={`mr-3 flex-shrink-0 h-6 w-6 ${
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-300'
                              : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || '')}`}
                      alt={profile?.displayName || 'User avatar'}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {profile?.displayName}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                      {profile?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
