import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { XMarkIcon, CalendarDaysIcon, ClockIcon, VideoCameraIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: string;
    name: string;
    image: string;
    hourlyRate: number;
    availability: {
      schedule: {
        day: string;
        slots: string[];
      }[];
    };
  };
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, expert }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [durationType, setDurationType] = useState('30');
  const [consultationType, setConsultationType] = useState('video');

  const handleBooking = async () => {
    try {
      // TODO: Implement booking logic with API call
      const bookingData = {
        expertId: expert.id,
        date: selectedDate,
        time: selectedTime,
        duration: parseInt(durationType),
        type: consultationType,
      };
      
      // Close modal after successful booking
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <Dialog
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
        >
          <div className="flex justify-between items-start mb-4">
            <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-white">
              Book Consultation with {expert.name}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Consultation Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Consultation Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setConsultationType('video')}
                className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                  consultationType === 'video'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <VideoCameraIcon className="h-6 w-6 text-primary-600" />
                <span>Video Chat</span>
              </button>
              <button
                onClick={() => setConsultationType('text')}
                className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                  consultationType === 'text'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <ChatBubbleLeftIcon className="h-6 w-6 text-primary-600" />
                <span>Text Chat</span>
              </button>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Date
            </label>
            <div className="grid grid-cols-3 gap-2">
              {expert.availability.schedule.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.day)}
                  className={`p-2 text-center border rounded-lg transition-colors ${
                    selectedDate === day.day
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              {selectedDate &&
                expert.availability.schedule
                  .find((day) => day.day === selectedDate)
                  ?.slots.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-center border rounded-lg transition-colors ${
                        selectedTime === time
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration
            </label>
            <select
              value={durationType}
              onChange={(e) => setDurationType(e.target.value)}
              className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="30">30 minutes (${(expert.hourlyRate / 2).toFixed(2)})</option>
              <option value="60">60 minutes (${expert.hourlyRate.toFixed(2)})</option>
              <option value="90">90 minutes (${(expert.hourlyRate * 1.5).toFixed(2)})</option>
            </select>
          </div>

          {/* Total Cost */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Total Cost:</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${((expert.hourlyRate * parseInt(durationType)) / 60).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Book Button */}
          <div className="flex justify-end">
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book Now
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default BookingModal;
