import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
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
    hourlyRate: 200,
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
    hourlyRate: 175,
    nextAvailable: 'Tomorrow, 10:00 AM',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    isOnline: true,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Jessica Martinez',
    role: 'Software Engineer',
    specialty: 'Full Stack Development',
    rating: 4.9,
    reviews: 156,
    hourlyRate: 150,
    nextAvailable: 'Today, 5:00 PM',
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    isOnline: true,
    isVerified: true,
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Business Consultant',
    specialty: 'Startup Strategy',
    rating: 4.7,
    reviews: 83,
    hourlyRate: 190,
    nextAvailable: 'Today, 4:30 PM',
    imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    isOnline: true,
    isVerified: true,
  }
];

export default function OnlineContributors() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleBooking = (professional: Professional) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // TODO: Implement booking flow
    console.log('Booking with:', professional.name);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Online Professionals
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Connect with verified experts in their field. Pay only for the time you need.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {professionals.map((professional) => (
            <div
              key={professional.id}
              className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  className="h-48 w-full object-cover"
                  src={professional.imageUrl}
                  alt={professional.name}
                />
                {professional.isOnline && (
                  <span className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online Now
                  </span>
                )}
              </div>

              <div className="flex-1 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {professional.name}
                    {professional.isVerified && (
                      <CheckBadgeIcon
                        className="inline-block h-5 w-5 text-primary-600 ml-1"
                        title="Verified Expert"
                      />
                    )}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {professional.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {professional.specialty}
                </p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(professional.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    ({professional.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    ${professional.hourlyRate}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      /hour
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Next: {professional.nextAvailable}
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(professional)}
                  className="w-full bg-primary-600 text-white rounded-md py-2 px-4 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
