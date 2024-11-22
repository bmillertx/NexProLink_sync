import { useState } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';
import { Appointment } from '@/services/appointments';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onDayClick?: (date: Date) => void;
}

export default function AppointmentCalendar({
  appointments,
  onDayClick,
}: AppointmentCalendarProps) {
  const { isDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const weeks = eachDayOfInterval({
    start: startOfWeek(currentMonth),
    end: endOfWeek(endOfWeek(currentMonth)),
  });

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((appointment) =>
      isSameDay(new Date(appointment.date), date)
    );
  };

  const getDayClasses = (day: Date) => {
    const dayAppointments = getAppointmentsForDay(day);
    const baseClasses = `relative py-6 px-3 ${
      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
    }`;

    if (!isSameMonth(day, currentMonth)) {
      return `${baseClasses} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`;
    }

    if (isToday(day)) {
      return `${baseClasses} ${
        isDarkMode ? 'bg-blue-900 text-white' : 'bg-blue-50 text-blue-600'
      }`;
    }

    if (dayAppointments.length > 0) {
      return `${baseClasses} ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      } font-semibold`;
    }

    return baseClasses;
  };

  return (
    <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className={`p-2 rounded-md ${
              isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className={`p-2 rounded-md ${
              isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className={`text-sm font-medium text-center py-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}

        {weeks.map((day, dayIdx) => {
          const dayAppointments = getAppointmentsForDay(day);
          return (
            <div
              key={day.toString()}
              className={getDayClasses(day)}
              onClick={() => onDayClick?.(day)}
            >
              <time
                dateTime={format(day, 'yyyy-MM-dd')}
                className={`ml-1 ${
                  !isSameMonth(day, currentMonth)
                    ? isDarkMode
                      ? 'text-gray-500'
                      : 'text-gray-400'
                    : ''
                }`}
              >
                {format(day, 'd')}
              </time>
              {dayAppointments.length > 0 && (
                <div className="absolute bottom-1 right-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
            }`}
          />
          <span className="text-sm">Has appointments</span>
        </div>
      </div>
    </div>
  );
}
