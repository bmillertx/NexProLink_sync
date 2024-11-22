import { useEffect, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import {
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
  VideoCameraIcon,
  MapPinIcon,
  XCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Appointment, getClientAppointments, updateAppointment } from '@/services/appointments';
import { Expert, getExperts } from '@/services/experts';
import toast from 'react-hot-toast';
import AppointmentCalendar from '../shared/AppointmentCalendar';
import BookAppointmentModal from './BookAppointmentModal';

export default function AppointmentsTab() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid) return;
      try {
        const fetchedAppointments = await getClientAppointments(user.uid);
        setAppointments(fetchedAppointments);
        
        // Mock experts data for development
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          setExperts([
            {
              id: 'expert-1',
              name: 'Dr. Sarah Chen',
              title: 'Financial Advisor',
              specialization: 'Investment Planning',
              availability: [
                {
                  dayOfWeek: new Date().getDay(),
                  startTime: '09:00 AM',
                  endTime: '05:00 PM',
                  breakStart: '12:00 PM',
                  breakEnd: '01:00 PM'
                }
              ],
              videoCallAvailable: true,
              inPersonAvailable: true
            },
            {
              id: 'expert-2',
              name: 'Michael Rodriguez',
              title: 'Tax Specialist',
              specialization: 'Personal & Business Tax',
              availability: [
                {
                  dayOfWeek: new Date().getDay(),
                  startTime: '10:00 AM',
                  endTime: '06:00 PM',
                  breakStart: '01:00 PM',
                  breakEnd: '02:00 PM'
                }
              ],
              videoCallAvailable: true,
              inPersonAvailable: false
            }
          ]);
        } else {
          const fetchedExperts = await getExperts();
          setExperts(fetchedExperts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.uid]);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await updateAppointment(appointmentId, { status: 'cancelled' });
      setAppointments(appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const dayAppointments = appointments.filter(apt =>
      isSameDay(new Date(apt.date), date)
    );
    // You can add additional logic here, like showing a modal with day details
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Appointments
        </h2>
        <button
          onClick={() => setShowBookingModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Book New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar View */}
        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <AppointmentCalendar
            appointments={appointments}
            onDayClick={handleDayClick}
          />
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {appointments.length === 0 ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <CalendarIcon className="mx-auto h-12 w-12 mb-4" />
              <p className="text-xl font-semibold mb-2">No appointments scheduled</p>
              <p>When you book appointments with experts, they will appear here.</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`p-6 rounded-lg shadow-md ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } ${
                  appointment.status === 'cancelled'
                    ? isDarkMode
                      ? 'opacity-60'
                      : 'opacity-75'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {appointment.type === 'video' ? (
                      <VideoCameraIcon className="h-6 w-6 text-blue-500" />
                    ) : (
                      <MapPinIcon className="h-6 w-6 text-green-500" />
                    )}
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {appointment.expertName}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {appointment.expertTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {appointment.status === 'upcoming' && (
                      <button
                        onClick={() => appointment.id && handleCancelAppointment(appointment.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Cancel Appointment"
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    )}
                    {appointment.status === 'completed' && (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    )}
                    {appointment.status === 'cancelled' && (
                      <XCircleIcon className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {format(appointment.date, 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {appointment.time} ({appointment.duration})
                    </span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mt-4">
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {appointment.notes}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span className="font-medium">Location: </span>
                    {appointment.location}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            {selectedExpert ? (
              <BookAppointmentModal
                isOpen={showBookingModal}
                onClose={() => {
                  setShowBookingModal(false);
                  setSelectedExpert(null);
                }}
                expert={selectedExpert}
                existingAppointments={appointments}
                onSuccess={() => {
                  if (user?.uid) {
                    getClientAppointments(user.uid).then(setAppointments);
                  }
                  setShowBookingModal(false);
                  setSelectedExpert(null);
                }}
              />
            ) : (
              <div
                className={`relative transform rounded-lg p-8 shadow-xl transition-all sm:w-full sm:max-w-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="mb-6">
                  <h3
                    className={`text-lg font-medium leading-6 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Select an Expert
                  </h3>
                  <p
                    className={`mt-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Choose an expert to book an appointment with
                  </p>
                </div>

                <div className="space-y-4">
                  {experts.map((expert) => (
                    <button
                      key={expert.id}
                      onClick={() => setSelectedExpert(expert)}
                      className={`w-full rounded-lg p-4 text-left transition-colors ${
                        isDarkMode
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {expert.imageUrl ? (
                          <img
                            src={expert.imageUrl}
                            alt={expert.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="h-12 w-12 text-gray-400" />
                        )}
                        <div>
                          <h4
                            className={`font-medium ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {expert.name}
                          </h4>
                          <p
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {expert.title}
                          </p>
                          <p
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {expert.specialization}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
