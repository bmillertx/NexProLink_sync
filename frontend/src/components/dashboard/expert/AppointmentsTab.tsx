import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface Appointment {
  id: string;
  clientName: string;
  date: Date;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
  payment: number;
  notes?: string;
}

export default function AppointmentsTab() {
  const { isDarkMode } = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    // In a real app, fetch appointments from your backend
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        clientName: 'John Doe',
        date: new Date(2024, 1, 15, 14, 30),
        duration: 60,
        status: 'upcoming',
        type: 'Initial Consultation',
        payment: 150,
        notes: 'First time client, focus on career transition',
      },
      {
        id: '2',
        clientName: 'Jane Smith',
        date: new Date(2024, 1, 10, 10, 0),
        duration: 45,
        status: 'completed',
        type: 'Follow-up Session',
        payment: 100,
        notes: 'Review progress on action items',
      },
      {
        id: '3',
        clientName: 'Mike Johnson',
        date: new Date(2024, 1, 12, 15, 0),
        duration: 30,
        status: 'cancelled',
        type: 'Quick Check-in',
        payment: 50,
        notes: 'Cancelled due to scheduling conflict',
      },
    ];

    setAppointments(mockAppointments);
  }, []);

  const filteredAppointments = appointments.filter(
    (apt) => filter === 'all' || apt.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="p-6">
      {/* Filter Buttons */}
      <div className="mb-6 flex space-x-4">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === status
                ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`
                : `${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`rounded-lg p-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            } shadow-sm border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <UserIcon
                    className={`h-5 w-5 mr-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <h3
                    className={`text-lg font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {appointment.clientName}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CalendarIcon
                      className={`h-5 w-5 mr-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {format(appointment.date, 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon
                      className={`h-5 w-5 mr-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {appointment.duration} minutes
                    </span>
                  </div>
                </div>
                {appointment.notes && (
                  <p
                    className={`mt-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {appointment.notes}
                  </p>
                )}
              </div>
              <div className="ml-4 flex flex-col items-end">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(appointment.status)}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>
                <span
                  className={`mt-2 text-lg font-medium ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}
                >
                  ${appointment.payment}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
