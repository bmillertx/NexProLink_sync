import { useState } from 'react';
import { UserProfile } from '@/services/auth';
import { useTheme } from '@/context/ThemeContext';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
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
  const { isDarkMode } = useTheme();

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
            <h1 className={`text-3xl font-bold leading-tight tracking-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back{profile?.firstName ? `, ${profile.firstName}` : ''}
            </h1>
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
