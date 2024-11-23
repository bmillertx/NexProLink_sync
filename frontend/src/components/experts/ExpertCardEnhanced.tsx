import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, VideoCameraIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { Expert } from '@/types/expert';

interface ExpertCardProps {
  expert: Expert;
  onBook: (expert: Expert) => void;
}

export const ExpertCardEnhanced = ({ expert, onBook }: ExpertCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
  };

  const ratingStars = Array(5).fill(0).map((_, index) => (
    <StarIcon
      key={index}
      className={`h-5 w-5 ${
        index < expert.rating ? 'text-yellow-400' : 'text-gray-300'
      }`}
    />
  ));

  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={expert.image || '/placeholder-expert.jpg'}
          alt={expert.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-semibold">{expert.name}</h3>
          <p className="text-sm opacity-90">{expert.title}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {ratingStars}
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            ({expert.reviewCount} reviews)
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {expert.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {expert.expertise.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <VideoCameraIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Video</span>
            </div>
            <div className="flex items-center gap-1">
              <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Chat</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${expert.hourlyRate}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">/hour</span>
          </div>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center p-6"
            >
              <div className="text-center text-white space-y-4">
                <h4 className="text-xl font-semibold">{expert.name}</h4>
                <p className="text-sm opacity-90">{expert.description}</p>
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
                    onClick={() => onBook(expert)}
                  >
                    <CalendarIcon className="h-5 w-5" />
                    Book Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-white text-gray-900 rounded-lg"
                    onClick={() => window.open(`/experts/${expert.id}`, '_blank')}
                  >
                    View Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
