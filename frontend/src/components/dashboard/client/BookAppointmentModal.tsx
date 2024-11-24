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
  onSuccess?: () => void;
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
  const [appointmentType, setAppointmentType] = useState<'video' | 'in-person'>(
    expert.videoCallAvailable ? 'video' : 'in-person'
  );
  const [duration, setDuration] = useState<string>('30');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate) {
      const slots = getAvailableTimeSlots(expert, selectedDate, existingAppointments);
      setAvailableTimeSlots(slots);
    }
  }, [selectedDate, expert, existingAppointments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to book an appointment');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    setLoading(true);
    try {
      await createAppointment({
        clientId: user.uid,
        expertId: expert.id,
        expertName: expert.name,
        expertTitle: expert.title,
        date: selectedDate,
        time: selectedTime,
        duration,
        type: appointmentType,
        location: appointmentType === 'video' ? 'Video Call' : expert.location,
        status: 'upcoming',
        notes,
      });

      toast.success('Appointment booked successfully!');
      onSuccess?.();
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
            <div className={`inline-block transform overflow-hidden rounded-lg text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className={`text-lg font-medium leading-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Book Appointment with {expert.name}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="date"
                            className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            Date
                          </label>
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date) => setSelectedDate(date)}
                            minDate={new Date()}
                            className={`mt-1 block w-full rounded-md shadow-sm ${
                              isDarkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-900 border-gray-300'
                            }`}
                            placeholderText="Select date"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="time"
                            className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            Time
                          </label>
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className={`mt-1 block w-full rounded-md shadow-sm ${
                              isDarkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-900 border-gray-300'
                            }`}
                          >
                            <option value="">Select time</option>
                            {availableTimeSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>

                        {expert.videoCallAvailable && expert.inPersonAvailable && (
                          <div>
                            <label
                              htmlFor="type"
                              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            >
                              Appointment Type
                            </label>
                            <select
                              value={appointmentType}
                              onChange={(e) => setAppointmentType(e.target.value as 'video' | 'in-person')}
                              className={`mt-1 block w-full rounded-md shadow-sm ${
                                isDarkMode
                                  ? 'bg-gray-700 text-white border-gray-600'
                                  : 'bg-white text-gray-900 border-gray-300'
                              }`}
                            >
                              <option value="video">Video Call</option>
                              <option value="in-person">In Person</option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label
                            htmlFor="duration"
                            className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            Duration (minutes)
                          </label>
                          <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className={`mt-1 block w-full rounded-md shadow-sm ${
                              isDarkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-900 border-gray-300'
                            }`}
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
                            className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            Notes
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className={`mt-1 block w-full rounded-md shadow-sm ${
                              isDarkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-900 border-gray-300'
                            }`}
                            placeholder="Any additional notes or requirements"
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm ${
                            loading
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {loading ? 'Booking...' : 'Book Appointment'}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className={`mt-3 inline-flex w-full justify-center rounded-md border px-4 py-2 text-base font-medium shadow-sm sm:mt-0 sm:w-auto sm:text-sm ${
                            isDarkMode
                              ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
