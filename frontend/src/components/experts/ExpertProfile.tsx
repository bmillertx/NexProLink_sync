import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, VideoCameraIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { ClockIcon, CurrencyDollarIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface ExpertProfileProps {
  expert: {
    id: string;
    name: string;
    title: string;
    image: string;
    rating: number;
    hourlyRate: number;
    specialties: string[];
    availability: {
      nextAvailable: string;
      schedule: {
        day: string;
        slots: string[];
      }[];
    };
    bio: string;
    experience: {
      years: number;
      highlights: string[];
    };
    reviews: {
      total: number;
      average: number;
    };
    verificationStatus: {
      identity: boolean;
      credentials: boolean;
      background: boolean;
    };
  };
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ expert }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative w-24 h-24">
              <Image
                src={expert.image}
                alt={expert.name}
                layout="fill"
                className="rounded-full"
                objectFit="cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{expert.name}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">{expert.title}</p>
              <div className="flex items-center mt-2">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="ml-1 text-gray-600 dark:text-gray-300">
                  {expert.reviews.average} ({expert.reviews.total} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${expert.hourlyRate}/hr
            </p>
            <button className="mt-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Book Now
            </button>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex items-center space-x-4 mb-6">
          {expert.verificationStatus.identity && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckBadgeIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">Identity Verified</span>
            </div>
          )}
          {expert.verificationStatus.credentials && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckBadgeIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">Credentials Verified</span>
            </div>
          )}
          {expert.verificationStatus.background && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckBadgeIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">Background Checked</span>
            </div>
          )}
        </div>

        {/* Consultation Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <VideoCameraIcon className="h-6 w-6 text-primary-600" />
            <span>Video Chat</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ChatBubbleLeftIcon className="h-6 w-6 text-primary-600" />
            <span>Text Chat</span>
          </button>
        </div>

        {/* Bio Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">About</h3>
          <p className="text-gray-600 dark:text-gray-300">{expert.bio}</p>
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {expert.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Experience</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{expert.experience.years} years of experience</p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            {expert.experience.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Availability</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Next available: {expert.availability.nextAvailable}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {expert.availability.schedule.map((day, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{day.day}</h4>
                <div className="space-y-1">
                  {day.slots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
