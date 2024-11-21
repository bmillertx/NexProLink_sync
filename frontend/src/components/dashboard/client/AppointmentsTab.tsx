import { useState } from 'react';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/utils/styles';

interface Appointment {
  id: string;
  expertName: string;
  date: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
  duration: number;
  meetingLink?: string;
  notes?: string;
}

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      expertName: 'Dr. Sarah Chen',
      date: new Date(2024, 1, 15, 14, 30),
      status: 'upcoming',
      type: 'Consultation',
      duration: 60,
      meetingLink: 'https://meet.nexprolink.com/dr-chen',
      notes: 'Please prepare any questions you have about your financial goals.',
    },
    {
      id: '2',
      expertName: 'Robert Mitchell',
      date: new Date(2024, 1, 10, 10, 0),
      status: 'completed',
      type: 'Financial Planning',
      duration: 45,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredAppointments = appointments.filter(
    (apt) => filter === 'all' || apt.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-700 bg-blue-100';
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
        <div className="flex space-x-2">
          {['all', 'upcoming', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={classNames(
                'px-3 py-1 rounded-full text-sm font-medium',
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.expertName}
                </h3>
                <p className="text-sm text-gray-500">{appointment.type}</p>
              </div>
              <span
                className={classNames(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(appointment.status)
                )}
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{format(appointment.date, 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>
                  {format(appointment.date, 'h:mm a')} ({appointment.duration} min)
                </span>
              </div>
            </div>

            {appointment.status === 'upcoming' && appointment.meetingLink && (
              <div className="pt-4">
                <a
                  href={appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  Join Meeting
                </a>
              </div>
            )}

            {appointment.notes && (
              <div className="pt-2">
                <p className="text-sm text-gray-600">{appointment.notes}</p>
              </div>
            )}

            {appointment.status === 'upcoming' && (
              <div className="flex space-x-2 pt-4">
                <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Reschedule
                </button>
                <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
