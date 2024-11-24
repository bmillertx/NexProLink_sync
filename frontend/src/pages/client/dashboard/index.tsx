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
} from '@heroicons/react/24/outline';

interface QuickAction {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    name: 'Find Consultant',
    href: '/client/consultants',
    icon: UserGroupIcon,
    description: 'Browse and connect with expert consultants',
  },
  {
    name: 'Schedule Consultation',
    href: '/client/consultations/schedule',
    icon: CalendarIcon,
    description: 'Book a new consultation session',
  },
  {
    name: 'Join Video Call',
    href: '/client/sessions',
    icon: VideoCameraIcon,
    description: 'Join or manage your video sessions',
  },
  {
    name: 'Messages',
    href: '/client/messages',
    icon: ChatBubbleLeftRightIcon,
    description: 'View and send messages to consultants',
  },
];

export default function ClientDashboard() {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <ProtectedRoute requiredRole="client">
      <DashboardLayout>
        <div className="py-6">
          {/* Welcome Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back, {profile?.displayName}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Here's what's happening with your consultations
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="mt-8">
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

          {/* Upcoming Consultations */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Upcoming Consultations
            </h2>
            {/* We'll implement the consultation list component later */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No upcoming consultations scheduled.{' '}
                <button
                  onClick={() => router.push('/client/consultants')}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
                >
                  Find a consultant
                </button>
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            {/* We'll implement the activity list component later */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No recent activity to display.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
