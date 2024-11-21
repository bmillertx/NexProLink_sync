import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Expert } from '../../types/expert';

interface TopContributorsProps {
  experts: Expert[];
}

export const TopContributors = ({ experts }: TopContributorsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 30);

    return () => clearInterval(intervalId);
  }, []);

  // Duplicate the experts array to create a seamless loop
  const displayExperts = [...experts, ...experts];

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Top Contributors</h2>
          <p className="text-gray-300">Learn from the best in their fields</p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden whitespace-nowrap py-4 scroll-smooth"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        >
          {displayExperts.map((expert, index) => (
            <div
              key={`${expert.id}-${index}`}
              className="inline-flex flex-col items-center min-w-[200px] transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src={expert.imageUrl}
                  alt={expert.name}
                  fill
                  className="rounded-full object-cover border-4 border-primary-500"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                  {expert.rating} ★
                </div>
              </div>
              <h3 className="text-white font-semibold text-lg whitespace-normal text-center max-w-[180px]">
                {expert.name}
              </h3>
              <p className="text-gray-400 text-sm whitespace-normal text-center max-w-[180px]">
                {expert.title}
              </p>
              <div className="flex flex-wrap justify-center gap-1 mt-2 max-w-[180px]">
                {expert.specialties.slice(0, 2).map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-block px-2 py-1 text-xs bg-primary-900 text-primary-100 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-primary-300 text-sm">
                ${expert.hourlyRate}/hr
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
