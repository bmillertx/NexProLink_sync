import { useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  specialties: string[];
  priceRange: [number, number];
  availability: string[];
  rating: number;
  experienceLevel: string[];
}

const initialFilters: FilterState = {
  specialties: [],
  priceRange: [0, 500],
  availability: [],
  rating: 0,
  experienceLevel: [],
};

export const ExpertFilters = ({ onFilterChange }: FilterProps) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  const specialties = [
    'System Design',
    'Cloud Architecture',
    'Full Stack Development',
    'Mobile Development',
    'DevOps',
    'Security',
    'AI/ML',
    'Blockchain',
    'Frontend Development',
    'Backend Development',
    'Database Design',
    'UI/UX Design',
  ];

  const availabilityOptions = [
    'Available Now',
    'Available Today',
    'Available This Week',
  ];

  const experienceLevels = [
    'Entry Level (1-3 years)',
    'Intermediate (3-5 years)',
    'Senior (5-8 years)',
    'Expert (8+ years)',
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </button>
      </div>

      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Specialties */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Specialties
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {specialties.map((specialty) => (
              <label key={specialty} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={filters.specialties.includes(specialty)}
                  onChange={(e) => {
                    const newSpecialties = e.target.checked
                      ? [...filters.specialties, specialty]
                      : filters.specialties.filter((s) => s !== specialty);
                    handleFilterChange('specialties', newSpecialties);
                  }}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {specialty}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Hourly Rate
          </h3>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange('priceRange', [0, parseInt(e.target.value)])
              }
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Availability
          </h3>
          <div className="space-y-2">
            {availabilityOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={filters.availability.includes(option)}
                  onChange={(e) => {
                    const newAvailability = e.target.checked
                      ? [...filters.availability, option]
                      : filters.availability.filter((a) => a !== option);
                    handleFilterChange('availability', newAvailability);
                  }}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Minimum Rating
          </h3>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
          >
            <option value="0">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.8">4.8+ Stars</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Experience Level
          </h3>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={filters.experienceLevel.includes(level)}
                  onChange={(e) => {
                    const newLevels = e.target.checked
                      ? [...filters.experienceLevel, level]
                      : filters.experienceLevel.filter((l) => l !== level);
                    handleFilterChange('experienceLevel', newLevels);
                  }}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={() => {
            setFilters(initialFilters);
            onFilterChange(initialFilters);
          }}
          className="w-full px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
