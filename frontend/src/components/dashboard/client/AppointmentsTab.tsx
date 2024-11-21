import { useState } from 'react';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
  VideoCameraIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';

interface Appointment {
  id: string;
  expert: string;
  expertTitle: string;
  date: Date;
  time: string;
  duration: string;
  type: 'video' | 'in-person';
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  avatar?: string;
}

export default function AppointmentsTab() {
  const { isDarkMode } = useTheme();
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      expert: 'Dr. Sarah Chen',
      expertTitle: 'Financial Advisor',
      date: new Date(2024, 1, 20),
      time: '10:00 AM',
      duration: '1 hour',
      type: 'video',
      location: 'Zoom Meeting',
      status: 'upcoming',
      notes: 'Quarterly portfolio review and investment strategy discussion. Please prepare any questions about your current investments and future goals.',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      expert: 'Robert Mitchell',
      expertTitle: 'Tax Consultant',
      date: new Date(2024, 1, 22),
      time: '2:30 PM',
      duration: '45 minutes',
      type: 'in-person',
      location: '123 Business Ave, Suite 200, New York, NY',
      status: 'upcoming',
      notes: 'Tax planning session for the upcoming year. Bring relevant financial documents and any questions about tax optimization strategies.',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Upcoming Appointments
        </h2>
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              } border rounded-lg p-6 transition-shadow hover:shadow-md`}
            >
              {/* Header */}
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  {appointment.avatar ? (
                    <img
                      src={appointment.avatar}
                      alt={appointment.expert}
                      className="h-12 w-12 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <UserCircleIcon className="h-12 w-12 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                      {appointment.expert}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {appointment.expertTitle}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <CalendarIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {format(appointment.date, 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <ClockIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {appointment.time} ({appointment.duration})
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  {appointment.type === 'video' ? (
                    <VideoCameraIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`} />
                  ) : (
                    <MapPinIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`} />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {appointment.type === 'video' ? 'Meeting Link' : 'Location'}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} break-words`}>
                      {appointment.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="mt-4">
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Notes</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} whitespace-pre-wrap break-words`}>
                    {appointment.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {appointment.type === 'video' ? 'Join Meeting' : 'Get Directions'}
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
