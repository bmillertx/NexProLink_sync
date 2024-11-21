import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';

// Enhanced testimonial data with more details and industry-specific feedback
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Business Strategy Consultant",
    company: "Growth Strategies Inc.",
    location: "New York, NY",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote: "NexProLink has transformed how I connect with clients. The platform's professional interface and seamless consultation tools have helped me grow my business by 40% in just three months.",
    rating: 5,
    expertise: ["Strategic Planning", "Business Development", "Market Analysis"],
    verified: true,
    consultations: 150,
    joinedDate: "2023-01-15"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Telemedicine Specialist",
    company: "HealthFirst Clinic",
    location: "San Francisco, CA",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote: "As a healthcare professional, I needed a secure and reliable platform for virtual consultations. NexProLink exceeded my expectations with its HIPAA-compliant video calls and easy scheduling system.",
    rating: 5,
    expertise: ["Telemedicine", "Internal Medicine", "Digital Health"],
    verified: true,
    consultations: 320,
    joinedDate: "2023-02-20"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Corporate Legal Advisor",
    company: "Rodriguez & Partners",
    location: "Miami, FL",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    quote: "The payment processing and booking system are flawless. I can focus on providing legal advice while NexProLink handles all the administrative tasks.",
    rating: 5,
    expertise: ["Corporate Law", "Contract Review", "Legal Compliance"],
    verified: true,
    consultations: 210,
    joinedDate: "2023-03-10"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Investment Advisor",
    company: "WealthWise Solutions",
    location: "Chicago, IL",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    quote: "My clients love the platform's intuitive interface. The ability to share screens and documents during consultations has made complex financial discussions much more effective.",
    rating: 5,
    expertise: ["Financial Planning", "Investment Strategy", "Retirement Planning"],
    verified: true,
    consultations: 180,
    joinedDate: "2023-04-05"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Executive Career Coach",
    company: "Career Catalyst",
    location: "Boston, MA",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    quote: "NexProLink's analytics tools help me track my performance and client satisfaction. It's been instrumental in optimizing my coaching sessions and growing my client base.",
    rating: 5,
    expertise: ["Career Development", "Leadership Training", "Executive Coaching"],
    verified: true,
    consultations: 250,
    joinedDate: "2023-01-30"
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplay]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-16">
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-900 to-transparent z-10" />
      </div>

      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => {
          setAutoplay(false);
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setAutoplay(true);
          setIsHovered(false);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center px-4"
          >
            <div className="relative w-32 h-32 mb-8">
              {/* Animated glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-xl"
              />
              
              {/* Profile image */}
              <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-white/10">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Verified badge */}
              {testimonials[currentIndex].verified && (
                <div className="absolute -right-2 -bottom-2 bg-primary-500 rounded-full p-2">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="max-w-3xl mb-8">
              <p className="text-xl md:text-2xl text-gray-200 italic leading-relaxed">
                "{testimonials[currentIndex].quote}"
              </p>
            </blockquote>

            {/* Professional details */}
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                {testimonials[currentIndex].name}
              </h3>
              <p className="text-primary-400 mb-1">
                {testimonials[currentIndex].role}
              </p>
              <p className="text-gray-400 mb-4">
                {testimonials[currentIndex].company} • {testimonials[currentIndex].location}
              </p>

              {/* Expertise tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {testimonials[currentIndex].expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-white/10 rounded-full text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div>
                  <span className="text-primary-400">{testimonials[currentIndex].consultations}+</span> Consultations
                </div>
                <div>
                  Member since <span className="text-primary-400">{formatDate(testimonials[currentIndex].joinedDate)}</span>
                </div>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex items-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-500 w-6'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows with hover effect */}
        <motion.button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-20 bg-black/20 hover:bg-black/40 rounded-r-lg"
          animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
          aria-label="Previous testimonial"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        <motion.button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-20 bg-black/20 hover:bg-black/40 rounded-l-lg"
          animate={{ x: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
          aria-label="Next testimonial"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;