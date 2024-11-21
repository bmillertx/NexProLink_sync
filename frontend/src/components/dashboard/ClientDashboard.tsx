import { useState, useEffect } from 'react';
import { UserProfile } from '@/services/auth';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface ClientDashboardProps {
  profile: UserProfile | null;
}

interface Appointment {
  id: string;
  expertName: string;
  date: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
}

interface Message {
  id: string;
  from: string;
  preview: string;
  timestamp: Date;
  unread: boolean;
}

export default function ClientDashboard({ profile }: ClientDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // In a real app, these would be fetched from your backend
  useEffect(() => {
    // Mock data for demonstration
    setAppointments([
      {
        id: '1',
        expertName: 'Dr. Sarah Chen',
        date: new Date(2024, 1, 15, 14, 30),
        status: 'upcoming',
        type: 'Consultation',
      },
      {
        id: '2',
        expertName: 'Robert Mitchell',
        date: new Date(2024, 1, 10, 10, 0),
        status: 'completed',
        type: 'Financial Planning',
      },
    ]);

    setMessages([
      {
        id: '1',
        from: 'Dr. Sarah Chen',
        preview: 'Looking forward to our session tomorrow!',
        timestamp: new Date(),
        unread: true,
      },
      {
        id: '2',
        from: 'Robert Mitchell',
        preview: 'Here are the documents we discussed...',
        timestamp: new Date(Date.now() - 86400000),
        unread: false,
      },
    ]);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.displayName || 'Client'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your appointments and messages.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Upcoming Appointments
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
                          {appointment.expertName}
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
