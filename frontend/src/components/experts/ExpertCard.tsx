import { motion } from 'framer-motion';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { VideoCameraIcon, CalendarIcon, ChatBubbleLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Expert } from '@/types/expert';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface ExpertCardProps {
  expert: Expert;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleAction = async (action: 'book' | 'chat') => {
    if (!isOnline) {
      // Show offline message
      alert('You are currently offline. Please check your internet connection and try again.');
      return;
    }

    setIsLoading(true);
    try {
      // Use client-side routing instead of direct window.location
      await router.push(`/${action}/${expert.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Unable to process your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Expert Image and Status */}
        <div className="relative w-full md:w-48 h-48">
          <Image
            src={expert.imageUrl}
            alt={expert.name}
            width={192}
            height={192}
            className="w-full h-full object-cover"
            priority
            onError={(e) => {
              // Fallback image on error
              (e.target as HTMLImageElement).src = '/images/default-avatar.png';
            }}
          />
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              expert.availability.includes('Now') && isOnline
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isOnline ? expert.availability : 'Offline'}
            </span>
          </div>
        </div>

        {/* Expert Info */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {expert.name}
                </h3>
                <CheckBadgeIcon className="h-5 w-5 text-primary-600" title="Verified Expert" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{expert.title}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                    {expert.rating}
                  </span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  {expert.reviews} reviews
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  {expert.experienceLevel}
                </span>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-4">
                {expert.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Location and Languages */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{expert.location}</span>
                <span>•</span>
                <span>{expert.languages.join(', ')}</span>
              </div>
            </div>

            {/* Price and Availability */}
            <div className="md:text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ${expert.hourlyRate}
                <span className="text-sm font-normal text-gray-500">/hour</span>
              </div>
              <div className="flex items-center justify-end text-sm text-gray-500 mb-4">
                <ClockIcon className="h-4 w-4 mr-1" />
                Next available: {expert.availability}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleAction('book')}
              disabled={isLoading || !isOnline}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white 
                ${isLoading || !isOnline 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              <VideoCameraIcon className="h-5 w-5 mr-2" />
              Book Video Call
              {isLoading && <span className="ml-2">...</span>}
            </button>
            <button
              onClick={() => handleAction('chat')}
              disabled={isLoading || !isOnline}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg
                ${isLoading || !isOnline 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
              Message Expert
              {isLoading && <span className="ml-2">...</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
