import { useState } from 'react';
import { UserProfile } from '@/services/auth';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import DashboardTabs from './shared/DashboardTabs';
import AppointmentsTab from './client/AppointmentsTab';
import MessagesTab from './client/MessagesTab';
import ProfileTab from './client/ProfileTab';

interface ClientDashboardProps {
  profile: UserProfile | null;
}

export default function ClientDashboard({ profile }: ClientDashboardProps) {
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
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Welcome back{profile?.firstName ? `, ${profile.firstName}` : ''}
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <DashboardTabs tabs={tabs} />
          </div>
        </main>
      </div>
    </div>
  );
}
