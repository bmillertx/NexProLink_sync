import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { ExpertCard } from '../components/experts/ExpertCard';
import { ExpertFilters } from '../components/experts/ExpertFilters';
import { TopContributors } from '../components/experts/TopContributors';
import { SpecialtiesGrid } from '../components/experts/SpecialtiesGrid';
import { Expert } from '../types/expert';

// Mock data for experts
const mockExperts: Expert[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Software Architecture Expert',
    rating: 4.9,
    reviews: 128,
    hourlyRate: 150,
    availability: 'Available Now',
    specialties: ['System Design', 'Cloud Architecture', 'Scalability'],
    imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    experienceLevel: 'Expert (8+ years)',
    description: 'Experienced software architect specializing in distributed systems and cloud-native applications.',
    languages: ['English', 'Spanish'],
    location: 'San Francisco, CA',
    timezone: 'PST',
    education: [
      {
        degree: 'Ph.D. in Computer Science',
        institution: 'Stanford University',
        year: 2015,
      },
    ],
    certifications: [
      {
        name: 'AWS Solutions Architect Professional',
        issuer: 'Amazon Web Services',
        year: 2022,
      },
    ],
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Full Stack Development Consultant',
    rating: 4.8,
    reviews: 93,
    hourlyRate: 120,
    availability: 'Available in 1 hour',
    specialties: ['React', 'Node.js', 'AWS', 'TypeScript'],
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    experienceLevel: 'Senior (5-8 years)',
    description: 'Full stack developer with expertise in modern web technologies and cloud infrastructure.',
    languages: ['English', 'Mandarin'],
    location: 'New York, NY',
    timezone: 'EST',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Mobile Development Specialist',
    rating: 4.7,
    reviews: 76,
    hourlyRate: 100,
    availability: 'Available Today',
    specialties: ['iOS', 'Android', 'React Native', 'Flutter'],
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    experienceLevel: 'Senior (5-8 years)',
    description: 'Mobile development expert with experience in both native and cross-platform development.',
    languages: ['English', 'Portuguese'],
    location: 'Miami, FL',
    timezone: 'EST',
  },
  {
    id: 4,
    name: 'James Wilson',
    title: 'DevOps & Cloud Infrastructure Expert',
    rating: 4.9,
    reviews: 112,
    hourlyRate: 140,
    availability: 'Available Now',
    specialties: ['DevOps', 'Kubernetes', 'AWS', 'Azure'],
    imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    experienceLevel: 'Expert (8+ years)',
    description: 'DevOps engineer specializing in cloud infrastructure and automation.',
    languages: ['English'],
    location: 'Seattle, WA',
    timezone: 'PST',
  },
  // Add more mock experts as needed
];

const ExpertsPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialties: [],
    priceRange: [0, 500],
    availability: [],
    rating: 0,
    experienceLevel: [],
  });
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>(mockExperts);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Get top contributors (experts with highest ratings)
  const topContributors = [...mockExperts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      const filtered = mockExperts.filter((expert) => {
        const matchesSearch =
          searchQuery === '' ||
          expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expert.specialties.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesSpecialties =
          selectedSpecialties.length === 0 ||
          expert.specialties.some((s) => selectedSpecialties.includes(s));

        const matchesPrice =
          expert.hourlyRate >= filters.priceRange[0] &&
          expert.hourlyRate <= filters.priceRange[1];

        const matchesAvailability =
          filters.availability.length === 0 ||
          filters.availability.includes(expert.availability);

        const matchesRating = expert.rating >= filters.rating;

        const matchesExperience =
          filters.experienceLevel.length === 0 ||
          filters.experienceLevel.includes(expert.experienceLevel);

        return (
          matchesSearch &&
          matchesSpecialties &&
          matchesPrice &&
          matchesAvailability &&
          matchesRating &&
          matchesExperience
        );
      });

      setFilteredExperts(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, selectedSpecialties]);

  const handleSpecialtyClick = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleContact = (expert: Expert) => {
    // Implement contact functionality
    console.log('Contacting expert:', expert.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Contributors Section */}
      <TopContributors experts={topContributors} />

      {/* Search Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Expert</h1>
          <p className="text-lg mb-8 text-gray-100">
            Connect with top professionals in software development, design, and technology
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Search by expertise, name, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="absolute right-3 top-3 h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {mockExperts.length}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Expert Consultants
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Global Availability
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  100%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Satisfaction Guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SpecialtiesGrid
          onSpecialtyClick={handleSpecialtyClick}
          selectedSpecialties={selectedSpecialties}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ExpertFilters onFilterChange={setFilters} />
          </div>

          {/* Expert Cards */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredExperts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No experts found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredExperts.map((expert) => (
                  <ExpertCard
                    key={expert.id}
                    expert={expert}
                    onContact={handleContact}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <button className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors">
          <CalendarIcon className="h-6 w-6" />
        </button>
        <button className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors">
          <ChatBubbleLeftIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ExpertsPage;
