import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '../auth/AuthModal';

interface Professional {
  id: string;
  name: string;
  role: string;
  specialty: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  nextAvailable: string;
  imageUrl: string;
  isOnline: boolean;
  isVerified: boolean;
}

const professionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Psychiatrist',
    specialty: 'Anxiety & Depression',
    rating: 4.9,
    reviews: 128,
    hourlyRate: 150,
    nextAvailable: 'Today, 3:00 PM',
    imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    isOnline: true,
    isVerified: true,
  },
  {
    id: '2',
    name: 'Michael Roberts',
    role: 'Financial Advisor',
    specialty: 'Investment Planning',
    rating: 4.8,
    reviews: 95,
    hourlyRate: 120,
    nextAvailable: 'Tomorrow, 10:00 AM',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    isOnline: true,
    isVerified: true,
  },
  // Add more professionals as needed
];

export default function OnlineContributors() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      // TODO: Implement booking logic
      console.log('Implement booking logic');
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Online Contributors
          </h2>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Connect with our verified professionals ready to help you right now
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {professionals.map((professional, index) => (
            <motion.div
              key={professional.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={professional.imageUrl}
                  alt={professional.name}
                  className="w-full h-48 object-cover"
                />
                {professional.isOnline && (
                  <div className="absolute top-4 right-4">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {professional.name}
                  </h3>
                  {professional.isVerified && (
                    <CheckBadgeIcon className="h-6 w-6 text-primary-500" />
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {professional.role} • {professional.specialty}
                </p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-gray-600 dark:text-gray-300">
                      {professional.rating}
                    </span>
                  </div>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {professional.reviews} reviews
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${professional.hourlyRate}
                    </span>
                    /hour
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Next: {professional.nextAvailable}
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView="login"
      />
    </section>
  );
}
