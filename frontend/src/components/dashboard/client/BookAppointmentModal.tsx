import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { createAppointment, Appointment } from '@/services/appointments';
import { Expert, getAvailableTimeSlots } from '@/services/experts';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Expert;
  onSuccess: () => void;
  existingAppointments?: Appointment[];
}

export default function BookAppointmentModal({
  isOpen,
  onClose,
  expert,
  onSuccess,
  existingAppointments = [],
}: BookAppointmentModalProps) {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'videoCall' | 'liveEvent'>(
    expert.eventTypes?.[0]?.type || 'videoCall'
  );
  const [selectedEventType, setSelectedEventType] = useState<typeof expert.eventTypes[0] | null>(
    expert.eventTypes?.[0] || null
  );
  const [duration, setDuration] = useState<string>('30');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate) {
      const appointments = existingAppointments
        .filter(apt => apt.expertId === expert.id)
        .map(apt => ({
          startTime: apt.time,
          duration: apt.duration.split(' ')[0], // "30 minutes" -> "30"
        }));

      const slots = getAvailableTimeSlots(expert, selectedDate, appointments);
      setAvailableTimeSlots(slots);
      
      // Reset selected time if it's no longer available
      if (selectedTime && !slots.includes(selectedTime)) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, expert, existingAppointments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !user?.uid) return;

    setLoading(true);
    try {
      await createAppointment({
        clientId: user.uid,
        expertId: expert.id,
        expertName: expert.name,
        expertTitle: expert.title,
        date: selectedDate,
        time: selectedTime,
        duration: `${duration} minutes`,
        type: appointmentType,
        eventDetails: selectedEventType || undefined,
        status: 'upcoming',
        notes,
      });

      toast.success('Appointment booked successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`inline-block transform rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className={`rounded-md ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-400 hover:text-gray-500'
                  } focus:outline-none`}
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className={`text-lg font-medium leading-6 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Book Appointment with {expert.name}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                      <label
                        htmlFor="date"
                        className={`block text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Date
                      </label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={new Date()}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                        } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        placeholderText="Select date"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="time"
                        className={`block text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Time
                      </label>
                      <select
                        id="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                        } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      >
                        <option value="">Select time</option>
                        {availableTimeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {availableTimeSlots.length === 0 && selectedDate && (
                        <p className="mt-1 text-sm text-red-500">
                          No available time slots for this date
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="appointmentType"
                        className={`block text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Session Type
                      </label>
                      <select
                        id="appointmentType"
                        value={appointmentType}
                        onChange={(e) => {
                          const newType = e.target.value as 'videoCall' | 'liveEvent';
                          setAppointmentType(newType);
                          const defaultEvent = expert.eventTypes?.find(et => et.type === newType);
                          setSelectedEventType(defaultEvent || null);
                        }}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                        } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      >
                        {expert.eventTypes?.map((eventType) => (
                          <option key={`${eventType.type}-${eventType.name}`} value={eventType.type}>
                            {eventType.name}
                          </option>
                        )) || (
                          <option value="videoCall">1:1 Video Call</option>
                        )}
                      </select>
                    </div>

                    {selectedEventType?.type === 'liveEvent' && (
                      <div className="space-y-4">
                        <div className={`rounded-md bg-${isDarkMode ? 'gray-700' : 'gray-50'} p-4`}>
                          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            Event Details
                          </h4>
                          <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {selectedEventType.description}
                          </p>
                          {selectedEventType.requirements && selectedEventType.requirements.length > 0 && (
                            <>
                              <h5 className={`mt-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                Requirements:
                              </h5>
                              <ul className={`mt-2 list-disc pl-5 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {selectedEventType.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </>
                          )}
                          {selectedEventType.maxParticipants && (
                            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Limited to {selectedEventType.maxParticipants} participants
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="duration"
                        className={`block text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Duration
                      </label>
                      <select
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                        } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className={`block text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Notes (optional)
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                        } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        placeholder="Add any notes or questions for the expert..."
                      />
                    </div>

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={loading || !selectedDate || !selectedTime}
                        className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                          loading || !selectedDate || !selectedTime
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                        }`}
                      >
                        {loading ? 'Booking...' : 'Book Appointment'}
                      </button>
                      <button
                        type="button"
                        className={`mt-3 inline-flex w-full justify-center rounded-md border ${
                          isDarkMode
                            ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm`}
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
