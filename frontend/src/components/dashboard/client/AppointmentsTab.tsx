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
import { Expert } from '@/types/expert';
import { getExperts } from '@/services/experts';
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
              rating: 4.9,
              totalReviews: 127,
              hourlyRate: 85,
              availability: [
                {
                  dayOfWeek: new Date().getDay(),
                  startTime: '09:00',
                  endTime: '17:00',
                  breakStart: '12:00',
                  breakEnd: '13:00'
                }
              ],
              expertise: ["Investment Planning", "Retirement Planning", "Tax Strategy"],
              imageUrl: "/experts/sarah-chen.jpg",
              experienceLevel: "Senior (10+ years)",
              description: "Experienced financial advisor specializing in investment and retirement planning.",
              languages: ["English", "Mandarin"],
              location: "New York, NY",
              timezone: "EST",
              category: "finance",
              videoCallAvailable: true,
              inPersonAvailable: true
            },
            {
              id: 'expert-2',
              name: 'Michael Rodriguez',
              title: 'Tax Specialist',
              specialization: 'Personal & Business Tax',
              rating: 4.8,
              totalReviews: 98,
              hourlyRate: 95,
              availability: [
                {
                  dayOfWeek: new Date().getDay(),
                  startTime: '10:00',
                  endTime: '18:00',
                  breakStart: '13:00',
                  breakEnd: '14:00'
                }
              ],
              expertise: ["Tax Planning", "Business Tax", "International Tax"],
              imageUrl: "/experts/michael-rodriguez.jpg",
              experienceLevel: "Senior (8+ years)",
              description: "Tax specialist with expertise in personal and business taxation.",
              languages: ["English", "Spanish"],
              location: "Miami, FL",
              timezone: "EST",
              category: "finance",
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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBookAppointment = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedExpert(null);
  };

  const getTodayAppointments = () => {
    if (!selectedDate) return [];
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), selectedDate)
    );
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <AppointmentCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            appointments={appointments}
          />
        </div>

        <div className="w-full md:w-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {selectedDate
                ? `Appointments for ${format(selectedDate, 'MMMM d, yyyy')}`
                : 'Select a date to view appointments'}
            </h3>

            <div className="space-y-4">
              {getTodayAppointments().map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.expertName}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-4 w-4" />
                      <span>{format(new Date(appointment.date), 'h:mm a')}</span>
                    </div>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`text-sm ${getAppointmentStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {selectedDate && getTodayAppointments().length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No appointments scheduled for this date
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && selectedExpert && (
        <BookAppointmentModal
          expert={selectedExpert}
          isOpen={showBookingModal}
          onClose={handleCloseBookingModal}
        />
      )}
    </div>
  );
}
