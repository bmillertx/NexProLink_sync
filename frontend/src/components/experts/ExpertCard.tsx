import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Expert } from '../../types/expert';

interface ExpertCardProps {
  expert: Expert;
  onContact: (expert: Expert) => void;
}

export const ExpertCard = ({ expert, onContact }: ExpertCardProps) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      const filled = index < Math.floor(rating);
      const Icon = filled ? StarIcon : StarIconOutline;
      return (
        <Icon
          key={index}
          className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
      <div className="flex items-start space-x-4">
        <div className="relative h-24 w-24 flex-shrink-0">
          <Image
            src={expert.imageUrl}
            alt={expert.name}
            className="rounded-lg object-cover"
            fill
          />
          <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium
            ${expert.availability === 'Available Now' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'}`}>
            {expert.availability}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {expert.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {expert.title}
          </p>
          
          <div className="flex items-center space-x-1 mb-2">
            {renderStars(expert.rating)}
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              ({expert.reviews} reviews)
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {expert.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100"
              >
                {specialty}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ${expert.hourlyRate}/hr
            </div>
            <button
              onClick={() => onContact(expert)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contact Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
