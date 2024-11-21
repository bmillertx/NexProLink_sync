import { NextPage } from 'next';
import { useState } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Mock data for experts
const mockExperts = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Software Architecture Expert',
    rating: 4.9,
    reviews: 128,
    hourlyRate: 100,
    availability: 'Available Now',
    specialties: ['System Design', 'Cloud Architecture', 'Scalability'],
    imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Full Stack Development Consultant',
    rating: 4.8,
    reviews: 93,
    hourlyRate: 85,
    availability: 'Available in 1 hour',
    specialties: ['React', 'Node.js', 'AWS'],
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  // Add more mock experts here
];

const ExpertsPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const specialties = [
    'System Design',
    'Cloud Architecture',
    'Full Stack Development',
    'Mobile Development',
    'DevOps',
    'Security',
    'AI/ML',
    'Blockchain',
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Find Your Expert</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Search by expertise, name, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg bg-white text-primary-600 hover:bg-gray-50">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Specialties
              </h2>
              <div className="space-y-2">
                {specialties.map((specialty) => (
                  <label key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSpecialties([...selectedSpecialties, specialty]);
                        } else {
                          setSelectedSpecialties(
                            selectedSpecialties.filter((s) => s !== specialty)
                          );
                        }
                      }}
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {specialty}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Experts List */}
          <div className="lg:col-span-3">
            <div className="grid gap-6">
              {mockExperts.map((expert) => (
                <div
                  key={expert.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-start">
                    <img
                      src={expert.imageUrl}
                      alt={expert.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="ml-4 flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {expert.name}
                        </h3>
                        <span className="text-primary-600 font-semibold">
                          ${expert.hourlyRate}/hr
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {expert.title}
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(expert.rating) ? (
                                <StarIconSolid className="h-5 w-5 text-yellow-400" />
                              ) : (
                                <StarIcon className="h-5 w-5 text-yellow-400" />
                              )}
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {expert.rating} ({expert.reviews} reviews)
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {expert.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-sm text-green-600 font-medium">
                      {expert.availability}
                    </span>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Book Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertsPage;
