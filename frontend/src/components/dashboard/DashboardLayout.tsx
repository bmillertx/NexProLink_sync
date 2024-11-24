import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const clientMenuItems = [
    { name: 'Overview', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Consultations', href: '/dashboard/consultations', icon: CalendarIcon },
    { name: 'My Network', href: '/dashboard/network', icon: UserGroupIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
  ];

  const expertMenuItems = [
    { name: 'Overview', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Schedule', href: '/dashboard/schedule', icon: CalendarIcon },
    { name: 'My Clients', href: '/dashboard/network', icon: UserGroupIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Services', href: '/dashboard/services', icon: BriefcaseIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
  ];

  const menuItems = profile?.userType === 'expert' ? expertMenuItems : clientMenuItems;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                  {profile?.userType === 'expert' ? 'Expert Portal' : 'Client Portal'}
                </span>
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
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName}`}
                      alt={profile?.displayName}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {profile?.displayName}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {profile?.userType}
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
