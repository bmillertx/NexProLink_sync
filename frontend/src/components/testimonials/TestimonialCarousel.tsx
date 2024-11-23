import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Business Strategy Consultant",
    company: "Growth Strategies Inc.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote: "NexProLink has transformed how I connect with clients. The platform's professional interface and seamless consultation tools have helped me grow my business significantly.",
    rating: 5
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Telemedicine Specialist",
    company: "HealthFirst Clinic",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote: "As a healthcare professional, I needed a secure and reliable platform for virtual consultations. NexProLink exceeded my expectations with its HIPAA-compliant video calls.",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Corporate Legal Advisor",
    company: "Rodriguez & Partners",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    quote: "The platform's efficiency and professionalism have made it my go-to choice for client consultations. The scheduling and payment systems are seamless.",
    rating: 5
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative">
      <div className="relative h-[400px] overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full"
          >
            <div className="h-full flex flex-col justify-center items-center px-4 md:px-8">
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  fill
                  sizes="(max-width: 96px) 100vw, 96px"
                  className="rounded-full object-cover"
                  priority={currentIndex === 0}
                />
              </div>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>

              <blockquote className="text-center mb-4">
                <p className="text-base text-gray-700 dark:text-gray-300 italic">
                  "{testimonials[currentIndex].quote}"
                </p>
              </blockquote>

              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonials[currentIndex].role}
                </div>
                <div className="text-sm text-primary-600 dark:text-primary-400">
                  {testimonials[currentIndex].company}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg transition-all duration-200"
          onClick={() => paginate(-1)}
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg transition-all duration-200"
          onClick={() => paginate(1)}
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </button>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-primary-600 w-4'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}