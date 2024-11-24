import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, VideoCameraIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { ClockIcon, CurrencyDollarIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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
    services?: {
      type: 'oneOnOne' | 'event' | 'course';
      title: string;
      description: string;
      duration: string;
      price: number;
    }[];
    upcomingEvents?: {
      id: string;
      title: string;
      date: string;
      time: string;
      duration: string;
      price: number;
      spotsLeft: number;
    }[];
  };
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ expert }) => {
  const [imageError, setImageError] = useState(false);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Function to handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end -mt-20 mb-4">
          <div className="relative">
            {imageError ? (
              <div className="w-[150px] h-[150px] rounded-lg border-4 border-white dark:border-gray-700 shadow-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {getInitials(expert.name)}
                </span>
              </div>
            ) : (
              <div className="relative w-[150px] h-[150px]">
                <Image
                  src={expert.image || '/placeholder-expert.jpg'}
                  alt={expert.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300"
                  style={{ transform: 'scale(1)' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  onError={handleImageError}
                  priority
                />
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-sm font-semibold">
              ${expert.hourlyRate}/hr
            </div>
          </div>
          
          <div className="md:ml-6 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{expert.name}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{expert.title}</p>
            <div className="flex items-center mt-2">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-gray-600 dark:text-gray-300">
                {expert.reviews.average} ({expert.reviews.total} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex gap-4 mb-6">
          {Object.entries(expert.verificationStatus).map(([key, verified]) => (
            verified && (
              <div key={key} className="flex items-center text-green-600 dark:text-green-400">
                <CheckBadgeIcon className="h-5 w-5 mr-1" />
                <span className="capitalize">{key} Verified</span>
              </div>
            )
          ))}
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {expert.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">About</h2>
          <p className="text-gray-600 dark:text-gray-300">{expert.bio}</p>
        </div>

        {/* Experience Highlights */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Experience</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">{expert.experience.years} years of experience</p>
          <ul className="space-y-2">
            {expert.experience.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Availability */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Availability</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
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

        {/* Services */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expert.services?.map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                <div className="flex items-center mb-2">
                  {service.type === 'oneOnOne' ? (
                    <UserGroupIcon className="h-5 w-5 text-primary-500 mr-2" />
                  ) : service.type === 'course' ? (
                    <CalendarIcon className="h-5 w-5 text-primary-500 mr-2" />
                  ) : (
                    <UserGroupIcon className="h-5 w-5 text-primary-500 mr-2" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">{service.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    {service.duration}
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    ${service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        {expert.upcomingEvents?.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expert.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.spotsLeft} spots remaining</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-primary-600 dark:text-primary-400">${event.price}</span>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExpertProfile;
