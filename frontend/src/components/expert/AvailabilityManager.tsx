import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface AvailabilityManagerProps {
  onClose?: () => void;
  onUpdate?: () => void;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DEFAULT_TIME_SLOTS: TimeSlot[] = DAYS_OF_WEEK.map((day) => ({
  day,
  startTime: '09:00',
  endTime: '17:00',
  isAvailable: false,
}));

const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  onClose,
  onUpdate,
}) => {
  const { userProfile } = useAuth();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile?.availability) {
      setTimeSlots(userProfile.availability);
    }
  }, [userProfile]);

  const handleTimeChange = (
    day: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setTimeSlots((prev) =>
      prev.map((slot) =>
        slot.day === day
          ? {
              ...slot,
              [field]: value,
            }
          : slot
      )
    );
  };

  const handleAvailabilityToggle = (day: string) => {
    setTimeSlots((prev) =>
      prev.map((slot) =>
        slot.day === day
          ? {
              ...slot,
              isAvailable: !slot.isAvailable,
            }
          : slot
      )
    );
  };

  const calculateTotalHours = (): number => {
    return timeSlots.reduce((total, slot) => {
      if (!slot.isAvailable) return total;
      
      const start = new Date(`1970-01-01T${slot.startTime}`);
      const end = new Date(`1970-01-01T${slot.endTime}`);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      return total + diff;
    }, 0);
  };

  const validateTimeSlots = (): boolean => {
    return timeSlots.every((slot) => {
      if (!slot.isAvailable) return true;
      
      const start = new Date(`1970-01-01T${slot.startTime}`);
      const end = new Date(`1970-01-01T${slot.endTime}`);
      
      return end > start;
    });
  };

  const handleSave = async () => {
    if (!userProfile?.uid) {
      toast.error('User profile not found');
      return;
    }

    if (!validateTimeSlots()) {
      toast.error('End time must be after start time for all slots');
      return;
    }

    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, {
        availability: timeSlots,
        availabilityHours: calculateTotalHours(),
      });
      
      toast.success('Availability updated successfully');
      onUpdate?.();
      onClose?.();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Manage Availability
      </h2>

      <div className="space-y-6">
        {timeSlots.map((slot) => (
          <div
            key={slot.day}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3 min-w-[150px]">
              <input
                type="checkbox"
                id={`available-${slot.day}`}
                checked={slot.isAvailable}
                onChange={() => handleAvailabilityToggle(slot.day)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`available-${slot.day}`}
                className="text-gray-700 dark:text-gray-200 font-medium"
              >
                {slot.day}
              </label>
            </div>

            <div className="flex flex-1 gap-4 items-center">
              <select
                value={slot.startTime}
                onChange={(e) => handleTimeChange(slot.day, 'startTime', e.target.value)}
                disabled={!slot.isAvailable}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={`start-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              <span className="text-gray-500 dark:text-gray-400">to</span>

              <select
                value={slot.endTime}
                onChange={(e) => handleTimeChange(slot.day, 'endTime', e.target.value)}
                disabled={!slot.isAvailable}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={`end-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">
          Total Available Hours: {calculateTotalHours()} hours/week
        </p>
        <div className="space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;
