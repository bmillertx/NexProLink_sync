import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  CalendarIcon,
  UserGroupIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface DashboardStat {
  name: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  change?: string;
  trend?: 'up' | 'down';
}

const stats: DashboardStat[] = [
  {
    name: 'Total Earnings',
    value: '$0.00',
    icon: CurrencyDollarIcon,
    change: '+0%',
    trend: 'up',
  },
  {
    name: 'Total Sessions',
    value: '0',
    icon: VideoCameraIcon,
    change: '0',
    trend: 'up',
  },
  {
    name: 'Active Clients',
    value: '0',
    icon: UserGroupIcon,
  },
  {
    name: 'Hours Consulted',
    value: '0h',
    icon: ClockIcon,
  },
];

interface QuickAction {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    name: 'Manage Schedule',
    href: '/consultant/schedule',
    icon: CalendarIcon,
    description: 'Set your availability and manage bookings',
  },
  {
    name: 'View Clients',
    href: '/consultant/clients',
    icon: UserGroupIcon,
    description: 'Manage your client relationships',
  },
  {
    name: 'Join Session',
    href: '/consultant/sessions',
    icon: VideoCameraIcon,
    description: 'Start or join video consultations',
  },
  {
    name: 'Messages',
    href: '/consultant/messages',
    icon: ChatBubbleLeftRightIcon,
    description: 'View and respond to client messages',
  },
];

export default function ConsultantDashboard() {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <ProtectedRoute requiredRole="consultant">
      <DashboardLayout>
        <div className="py-6">
          {/* Welcome Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back, {profile?.displayName}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Here's an overview of your consultation business
            </p>
          </div>

          {/* Stats Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <stat.icon
                            className="h-6 w-6 text-gray-400 dark:text-gray-500"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              {stat.name}
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {stat.value}
                              </div>
                              {stat.change && (
                                <div
                                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                                    stat.trend === 'up'
                                      ? 'text-green-600 dark:text-green-500'
                                      : 'text-red-600 dark:text-red-500'
                                  }`}
                                >
                                  {stat.change}
                                </div>
                              )}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => router.push(action.href)}
                    className="relative rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center space-y-2 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="rounded-lg p-3 bg-indigo-50 dark:bg-indigo-900/50">
                      <action.icon
                        className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {action.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                      {action.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Today's Schedule
            </h2>
            {/* We'll implement the schedule component later */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No consultations scheduled for today.{' '}
                <button
                  onClick={() => router.push('/consultant/schedule')}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
                >
                  Manage your availability
                </button>
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
