import { useState, useEffect } from 'react';
import { UserProfile } from '@/services/auth';
import { useTheme } from '@/context/ThemeContext';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import DashboardTabs from './shared/DashboardTabs';
import AppointmentsTab from './expert/AppointmentsTab';
import MessagesTab from './expert/MessagesTab';
import ProfileTab from './expert/ProfileTab';
import SettingsTab from './expert/SettingsTab';
import AnalyticsTab from './expert/AnalyticsTab';
import ClientsTab from './expert/ClientsTab';
import AvailabilityTab from './expert/AvailabilityTab';
import PaymentsTab from './expert/PaymentsTab';

interface ExpertDashboardProps {
  profile: UserProfile;
}

interface Stats {
  totalEarnings: number;
  totalClients: number;
  totalHours: number;
  rating: number;
}

export default function ExpertDashboard({ profile }: ExpertDashboardProps) {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState<Stats>({
    totalEarnings: 0,
    totalClients: 0,
    totalHours: 0,
    rating: 0,
  });

  useEffect(() => {
    // In a real app, fetch these stats from your backend
    setStats({
      totalEarnings: 2500,
      totalClients: 15,
      totalHours: 25,
      rating: 4.8,
    });
  }, []);

  const tabs = [
    {
      name: 'Analytics',
      icon: ChartBarIcon,
      content: <AnalyticsTab />,
    },
    {
      name: 'Appointments',
      icon: CalendarIcon,
      content: <AppointmentsTab />,
    },
    {
      name: 'Clients',
      icon: UserGroupIcon,
      content: <ClientsTab />,
    },
    {
      name: 'Messages',
      icon: ChatBubbleLeftRightIcon,
      content: <MessagesTab />,
    },
    {
      name: 'Availability',
      icon: ClockIcon,
      content: <AvailabilityTab />,
    },
    {
      name: 'Payments',
      icon: CurrencyDollarIcon,
      content: <PaymentsTab />,
    },
    {
      name: 'Profile',
      icon: UserCircleIcon,
      content: <ProfileTab profile={profile} />,
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      content: <SettingsTab />,
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="py-10">
        {/* Header */}
        <header className="mb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className={`text-3xl font-bold leading-tight tracking-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Expert Dashboard
            </h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your professional services, clients, and earnings
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="mb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Earnings Card */}
              <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-5`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Total Earnings
                      </dt>
                      <dd className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        ${stats.totalEarnings}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Clients Card */}
              <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-5`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Total Clients
                      </dt>
                      <dd className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {stats.totalClients}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-5`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Hours Completed
                      </dt>
                      <dd className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {stats.totalHours}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Rating Card */}
              <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-5`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <StarIcon className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Average Rating
                      </dt>
                      <dd className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {stats.rating} / 5.0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className={`rounded-lg shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } overflow-hidden`}>
              <DashboardTabs tabs={tabs} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
