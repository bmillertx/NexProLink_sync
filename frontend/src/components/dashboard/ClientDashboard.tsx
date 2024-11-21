import { useState } from 'react';
import { UserProfile } from '@/services/auth';
import { useTheme } from '@/context/ThemeContext';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import DashboardTabs from './shared/DashboardTabs';
import AppointmentsTab from './client/AppointmentsTab';
import MessagesTab from './client/MessagesTab';
import ProfileTab from './client/ProfileTab';
import SettingsTab from './client/SettingsTab';

interface ClientDashboardProps {
  profile: UserProfile | null;
}

export default function ClientDashboard({ profile }: ClientDashboardProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  const tabs = [
    {
      name: 'Appointments',
      icon: CalendarIcon,
      content: <AppointmentsTab />,
    },
    {
      name: 'Messages',
      icon: ChatBubbleLeftRightIcon,
      content: <MessagesTab />,
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
        <header className="mb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className={`text-3xl font-bold leading-tight tracking-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome back{profile?.firstName ? `, ${profile.firstName}` : ''}
              </h1>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                } transition-colors duration-200`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </header>
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
