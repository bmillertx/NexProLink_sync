import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  VideoCameraIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HeartIcon,
  MusicalNoteIcon,
  BeakerIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { ExpertCard } from '../components/experts/ExpertCard';
import { ExpertFilters } from '../components/experts/ExpertFilters';
import { Expert } from '../types/expert';
import { useRouter } from 'next/router';

// Enhanced categories for professionals
const professionalCategories = [
  {
    id: 'education',
    name: 'Education',
    icon: AcademicCapIcon,
    color: 'bg-blue-200 hover:bg-blue-300 text-blue-900',
    examples: ['Teachers', 'Tutors', 'Professors']
  },
  {
    id: 'business',
    name: 'Business',
    icon: BriefcaseIcon,
    color: 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900',
    examples: ['Consultants', 'Coaches', 'Mentors']
  },
  {
    id: 'health',
    name: 'Health',
    icon: HeartIcon,
    color: 'bg-rose-200 hover:bg-rose-300 text-rose-900',
    examples: ['Trainers', 'Nutritionists', 'Therapists']
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: BeakerIcon,
    color: 'bg-indigo-200 hover:bg-indigo-300 text-indigo-900',
    examples: ['Developers', 'Designers', 'Engineers']
  },
  {
    id: 'arts',
    name: 'Arts',
    icon: PaintBrushIcon,
    color: 'bg-purple-200 hover:bg-purple-300 text-purple-900',
    examples: ['Artists', 'Musicians', 'Photographers']
  },
  {
    id: 'music',
    name: 'Music',
    icon: MusicalNoteIcon,
    color: 'bg-amber-200 hover:bg-amber-300 text-amber-900',
    examples: ['Musicians', 'Composers', 'Producers']
  },
  {
    id: 'culinary',
    name: 'Culinary',
    icon: VideoCameraIcon,
    color: 'bg-orange-200 hover:bg-orange-300 text-orange-900',
    examples: ['Chefs', 'Food Stylists', 'Food Bloggers']
  }
];

// Enhanced mock data with diverse experts
const mockExperts: Expert[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Software Architecture Expert',
    rating: 4.9,
    reviews: 128,
    hourlyRate: 150,
    availability: 'Available Now',
    specialties: ['System Design', 'Cloud Architecture', 'Microservices'],
    imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    experienceLevel: 'Expert (8+ years)',
    description: 'Experienced software architect specializing in scalable systems.',
    languages: ['English', 'Spanish'],
    location: 'San Francisco, CA',
    timezone: 'PST',
    category: 'technology'
  },
  {
    id: 2,
    name: 'Chen Wei',
    title: 'Data Science & ML Expert',
    rating: 4.8,
    reviews: 93,
    hourlyRate: 120,
    availability: 'Available in 1 hour',
    specialties: ['Machine Learning', 'Python', 'Deep Learning'],
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    experienceLevel: 'Senior (5-8 years)',
    description: 'Data scientist with focus on practical ML applications.',
    languages: ['English', 'Mandarin'],
    location: 'New York, NY',
    timezone: 'EST',
    category: 'technology'
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    title: 'Business Strategy Consultant',
    rating: 4.7,
    reviews: 76,
    hourlyRate: 200,
    availability: 'Available Today',
    specialties: ['Strategy', 'Growth', 'Operations'],
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    experienceLevel: 'Expert (8+ years)',
    description: 'Strategic advisor for startups and enterprises.',
    languages: ['English', 'Spanish'],
    location: 'Miami, FL',
    timezone: 'EST',
    category: 'business'
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    title: 'Clinical Psychologist',
    rating: 4.9,
    reviews: 112,
    hourlyRate: 180,
    availability: 'Next Week',
    specialties: ['CBT', 'Anxiety', 'Depression'],
    imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    experienceLevel: 'Expert (8+ years)',
    description: 'Licensed psychologist specializing in anxiety and depression.',
    languages: ['English'],
    location: 'Chicago, IL',
    timezone: 'CST',
    category: 'health'
  },
  {
    id: 5,
    name: 'Aisha Patel',
    title: 'UI/UX Design Lead',
    rating: 4.8,
    reviews: 89,
    hourlyRate: 140,
    availability: 'Available Now',
    specialties: ['UI Design', 'User Research', 'Prototyping'],
    imageUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
    experienceLevel: 'Senior (5-8 years)',
    description: 'Design leader focused on user-centered experiences.',
    languages: ['English', 'Hindi'],
    location: 'Seattle, WA',
    timezone: 'PST',
    category: 'technology'
  },
  {
    id: 6,
    name: 'Yuki Tanaka',
    title: 'Music Production Expert',
    rating: 4.7,
    reviews: 64,
    hourlyRate: 90,
    availability: 'Available Now',
    specialties: ['Production', 'Mixing', 'Composition'],
    imageUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
    experienceLevel: 'Senior (5-8 years)',
    description: 'Professional music producer and composer.',
    languages: ['English', 'Japanese'],
    location: 'Los Angeles, CA',
    timezone: 'PST',
    category: 'music'
  },
  {
    id: 7,
    name: 'Chef Mario Romano',
    title: 'Master Chef & Culinary Instructor',
    rating: 4.8,
    reviews: 95,
    hourlyRate: 120,
    availability: 'Available Now',
    specialties: ['Italian Cuisine', 'Pastry', 'Wine Pairing', 'Restaurant Management'],
    imageUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
    experienceLevel: 'Master Chef (20+ years)',
    description: 'Michelin-starred chef specializing in authentic Italian cuisine.',
    languages: ['English', 'Italian'],
    location: 'New York, NY',
    timezone: 'EST',
    category: 'culinary'
  }
];

const ExpertsPage: NextPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    specialties: [],
    priceRange: [0, 1000],
    rating: 0,
    experienceLevel: [],
  });
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>(mockExperts);
  const [isLoading, setIsLoading] = useState(false);

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

        const matchesCategory =
          !selectedCategory || expert.category === selectedCategory;

        const matchesRating = expert.rating >= filters.rating;

        const matchesPrice =
          expert.hourlyRate >= filters.priceRange[0] &&
          expert.hourlyRate <= filters.priceRange[1];

        const matchesExperience =
          filters.experienceLevel.length === 0 ||
          filters.experienceLevel.includes(expert.experienceLevel);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesRating &&
          matchesPrice &&
          matchesExperience
        );
      });

      setFilteredExperts(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, filters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Find Your Perfect Expert
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-gray-100">
              Connect with professionals across various fields for personalized guidance and expertise.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, title, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-lg text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-30">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {professionalCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              className={`${
                category.id === selectedCategory
                  ? 'ring-2 ring-primary-500 shadow-lg ' + category.color
                  : category.color + ' shadow-md'
              } rounded-xl p-4 transition-all duration-200`}
            >
              <category.icon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium text-center">{category.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ExpertFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Expert Cards Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                // Expert cards
                filteredExperts.map((expert) => (
                  <motion.div
                    key={expert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/experts/${expert.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={expert.imageUrl}
                          alt={expert.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {expert.rating} ★
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {expert.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {expert.title}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {expert.specialties.slice(0, 2).map((specialty) => (
                            <span
                              key={specialty}
                              className="inline-block px-2 py-1 text-xs bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-100 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-primary-600 dark:text-primary-400">
                            ${expert.hourlyRate}/hr
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {expert.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700"
      >
        <ChatBubbleLeftIcon className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

export default ExpertsPage;
