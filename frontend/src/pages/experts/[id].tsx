import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import ExpertProfile from '@/components/experts/ExpertProfile';
import BookingModal from '@/components/booking/BookingModal';
import { useAuth } from '@/context/AuthContext';

// Mock data - Replace with actual API call
const mockExpertData = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  title: 'Senior Software Architect',
  image: '/experts/sarah-johnson.jpg',
  rating: 4.9,
  hourlyRate: 150,
  specialties: ['System Design', 'Cloud Architecture', 'DevOps', 'Microservices'],
  availability: {
    nextAvailable: 'Tomorrow at 2:00 PM',
    schedule: [
      {
        day: 'Mon',
        slots: ['9:00 AM', '2:00 PM', '4:00 PM'],
      },
      {
        day: 'Tue',
        slots: ['10:00 AM', '1:00 PM', '3:00 PM'],
      },
      {
        day: 'Wed',
        slots: ['9:00 AM', '11:00 AM', '2:00 PM'],
      },
    ],
  },
  bio: 'With over 15 years of experience in software architecture and system design, I specialize in helping teams build scalable, maintainable applications. I've worked with Fortune 500 companies and successful startups, leading the technical direction of multiple high-impact projects.',
  experience: {
    years: 15,
    highlights: [
      'Led architecture for a system processing 1M+ transactions daily',
      'Designed cloud-native solutions for multiple Fortune 500 companies',
      'Published author on system design and microservices architecture',
      'Regular speaker at international technology conferences',
    ],
  },
  reviews: {
    total: 128,
    average: 4.9,
  },
  verificationStatus: {
    identity: true,
    credentials: true,
    background: true,
  },
};

interface ExpertPageProps {
  expert: typeof mockExpertData;
}

const ExpertPage: React.FC<ExpertPageProps> = ({ expert }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { user } = useAuth();

  const handleBooking = () => {
    if (!user) {
      // TODO: Implement authentication flow
      console.log('User needs to sign in');
      return;
    }
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>{expert.name} - NexProLink</title>
        <meta name="description" content={`Book a consultation with ${expert.name}, ${expert.title}`} />
      </Head>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Experts
            </button>
          </div>

          <ExpertProfile expert={expert} />

          <div className="mt-8 text-center">
            <button
              onClick={handleBooking}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              Book Consultation
            </button>
          </div>
        </div>

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          expert={expert}
        />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // TODO: Fetch expert data from API using context.params.id
  return {
    props: {
      expert: mockExpertData,
    },
  };
};

export default ExpertPage;
