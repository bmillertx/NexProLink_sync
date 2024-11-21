import { useState, useEffect } from 'react';
import { UserProfile } from '@/services/auth';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface ExpertDashboardProps {
  profile: UserProfile | null;
}

interface Appointment {
  id: string;
  clientName: string;
  date: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
  payment: number;
}

interface Message {
  id: string;
  from: string;
  preview: string;
  timestamp: Date;
  unread: boolean;
}

interface Stats {
  totalEarnings: number;
  totalClients: number;
  totalHours: number;
  rating: number;
}

export default function ExpertDashboard({ profile }: ExpertDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalEarnings: 0,
    totalClients: 0,
    totalHours: 0,
    rating: 0,
  });

  // In a real app, these would be fetched from your backend
  useEffect(() => {
    // Mock data for demonstration
    setAppointments([
      {
        id: '1',
        clientName: 'John Doe',
        date: new Date(2024, 1, 15, 14, 30),
        status: 'upcoming',
        type: 'Consultation',
        payment: 150,
      },
      {
        id: '2',
        clientName: 'Jane Smith',
        date: new Date(2024, 1, 10, 10, 0),
        status: 'completed',
        type: 'Follow-up',
        payment: 100,
      },
    ]);

    setMessages([
      {
        id: '1',
        from: 'John Doe',
        preview: 'I have some questions about our upcoming session',
        timestamp: new Date(),
        unread: true,
      },
      {
        id: '2',
        from: 'Jane Smith',
        preview: 'Thank you for the great session!',
        timestamp: new Date(Date.now() - 86400000),
        unread: false,
      },
    ]);

    setStats({
      totalEarnings: 2500,
      totalClients: 15,
      totalHours: 25,
      rating: 4.8,
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.displayName || 'Expert'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your professional activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Earnings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${stats.totalEarnings}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Clients
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalClients}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hours Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalHours}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Rating
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.rating}/5.0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Upcoming Sessions
              </h2>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {appointments
                .filter((apt) => apt.status === 'upcoming')
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.clientName}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {format(appointment.date, 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Messages</h2>
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900">{message.from}</p>
                    <p className="text-sm text-gray-500">{message.preview}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">
                      {format(message.timestamp, 'MMM d, h:mm a')}
                    </span>
                    {message.unread && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
