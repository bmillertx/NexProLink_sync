import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  ClockIcon,
  CalendarIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface TimeSlot {
  id: string;
  day: number; // 0-6 for Sunday-Saturday
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

interface BlockedDate {
  id: string;
  date: Date;
  reason?: string;
}

export default function AvailabilityTab() {
  const { isDarkMode } = useTheme();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(
    new Date().getDay()
  );
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState<Omit<TimeSlot, 'id'>>({
    day: selectedDay,
    startTime: '09:00',
    endTime: '17:00',
    isRecurring: true,
  });

  useEffect(() => {
    // In a real app, fetch availability data from your backend
    const mockTimeSlots: TimeSlot[] = [
      {
        id: '1',
        day: 1,
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true,
      },
      {
        id: '2',
        day: 2,
        startTime: '10:00',
        endTime: '18:00',
        isRecurring: true,
      },
      {
        id: '3',
        day: 3,
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true,
      },
      {
        id: '4',
        day: 4,
        startTime: '09:00',
        endTime: '16:00',
        isRecurring: true,
      },
      {
        id: '5',
        day: 5,
        startTime: '10:00',
        endTime: '15:00',
        isRecurring: true,
      },
    ];

    const mockBlockedDates: BlockedDate[] = [
      {
        id: '1',
        date: addDays(new Date(), 5),
        reason: 'Personal appointment',
      },
      {
        id: '2',
        date: addDays(new Date(), 10),
        reason: 'Conference',
      },
    ];

    setTimeSlots(mockTimeSlots);
    setBlockedDates(mockBlockedDates);
  }, []);

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const startOfCurrentWeek = startOfWeek(new Date());

  const handleAddSlot = () => {
    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      ...newSlot,
    };

    setTimeSlots((prev) => [...prev, newTimeSlot]);
    setShowAddSlot(false);
    setNewSlot({
      day: selectedDay,
      startTime: '09:00',
      endTime: '17:00',
      isRecurring: true,
    });
  };

  const handleRemoveSlot = (id: string) => {
    setTimeSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  const handleRemoveBlockedDate = (id: string) => {
    setBlockedDates((prev) => prev.filter((date) => date.id !== id));
  };

  return (
    <div className="p-6">
      {/* Weekly Schedule */}
      <div
        className={`mb-8 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6`}
      >
        <h2
          className={`text-lg font-medium mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Weekly Schedule
        </h2>
        <div className="grid grid-cols-7 gap-4 mb-6">
          {weekDays.map((day, index) => (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={`p-2 text-center rounded-lg ${
                selectedDay === index
                  ? isDarkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="text-sm font-medium">{day.slice(0, 3)}</div>
              <div className="text-xs mt-1">
                {format(addDays(startOfCurrentWeek, index), 'd')}
              </div>
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <div className="space-y-4">
          {timeSlots
            .filter((slot) => slot.day === selectedDay)
            .map((slot) => (
              <div
                key={slot.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <ClockIcon
                    className={`h-5 w-5 mr-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {slot.startTime} - {slot.endTime}
                  </span>
                  {slot.isRecurring && (
                    <span
                      className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        isDarkMode
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      Recurring
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveSlot(slot.id)}
                  className={`p-1 rounded-full hover:bg-gray-200 ${
                    isDarkMode ? 'hover:bg-gray-600' : ''
                  }`}
                >
                  <XMarkIcon className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ))}

          {showAddSlot ? (
            <div
              className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className={`w-full rounded-md ${
                      isDarkMode
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border p-2`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className={`w-full rounded-md ${
                      isDarkMode
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border p-2`}
                  />
                </div>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={newSlot.isRecurring}
                  onChange={(e) =>
                    setNewSlot((prev) => ({
                      ...prev,
                      isRecurring: e.target.checked,
                    }))
                  }
                  className="rounded text-blue-600"
                />
                <label
                  className={`ml-2 text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Recurring weekly
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddSlot(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-gray-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSlot}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Add Slot
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddSlot(true)}
              className={`w-full p-4 rounded-lg border-2 border-dashed ${
                isDarkMode
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
              } flex items-center justify-center`}
            >
              <PlusIcon
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Add Time Slot
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Blocked Dates */}
      <div
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6`}
      >
        <h2
          className={`text-lg font-medium mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Blocked Dates
        </h2>
        <div className="space-y-4">
          {blockedDates.map((blocked) => (
            <div
              key={blocked.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <CalendarIcon
                  className={`h-5 w-5 mr-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <div>
                  <span
                    className={`${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {format(blocked.date, 'MMM d, yyyy')}
                  </span>
                  {blocked.reason && (
                    <p
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {blocked.reason}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveBlockedDate(blocked.id)}
                className={`p-1 rounded-full hover:bg-gray-200 ${
                  isDarkMode ? 'hover:bg-gray-600' : ''
                }`}
              >
                <XMarkIcon className="h-5 w-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
