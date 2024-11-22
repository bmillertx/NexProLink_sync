import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import ExpertProfile from '@/components/experts/ExpertProfile';
import BookingModal from '@/components/booking/BookingModal';
import { useAuth } from '@/context/AuthContext';

// Mock data examples - Replace with actual API call
const mockExperts = {
  'tech-expert': {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Senior Software Architect',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    rating: 4.9,
    hourlyRate: 150,
    specialties: ['System Design', 'Cloud Architecture', 'DevOps', 'Microservices'],
    availability: {
      nextAvailable: 'Tomorrow at 2:00 PM',
      schedule: [
        { day: 'Mon', slots: ['9:00 AM', '2:00 PM', '4:00 PM'] },
        { day: 'Tue', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
        { day: 'Wed', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] },
      ],
    },
    bio: `With over 15 years of experience in software architecture and system design, I specialize in helping teams build scalable, maintainable applications. I've worked with Fortune 500 companies and successful startups, leading the technical direction of multiple high-impact projects.`,
    experience: {
      years: 15,
      highlights: [
        'Led architecture for a system processing 1M+ transactions daily',
        'Designed cloud-native solutions for multiple Fortune 500 companies',
        'Published author on system design and microservices architecture',
        'Regular speaker at international technology conferences',
      ],
    },
    reviews: { total: 128, average: 4.9 },
    verificationStatus: {
      identity: true,
      credentials: true,
      background: true,
    },
    services: [
      {
        type: 'oneOnOne',
        title: '1:1 Architecture Consultation',
        description: 'Personal consultation to discuss your system architecture, scalability challenges, and technical decisions.',
        duration: '60 minutes',
        price: 150,
      },
      {
        type: 'oneOnOne',
        title: 'Code Review Session',
        description: 'Detailed review of your codebase with actionable feedback and best practices.',
        duration: '45 minutes',
        price: 120,
      },
      {
        type: 'course',
        title: 'System Design Masterclass',
        description: 'Comprehensive course covering advanced system design patterns and practices.',
        duration: '8 weeks',
        price: 999,
      }
    ],
    upcomingEvents: [
      {
        id: 'event1',
        title: 'Microservices Architecture Workshop',
        date: 'June 15, 2024',
        time: '10:00 AM PST',
        duration: '3 hours',
        price: 199,
        spotsLeft: 15,
      },
      {
        id: 'event2',
        title: 'Cloud Native Solutions Seminar',
        date: 'June 22, 2024',
        time: '2:00 PM PST',
        duration: '2 hours',
        price: 149,
        spotsLeft: 25,
      }
    ]
  },
  'culinary-expert': {
    id: '7',
    name: 'Chef Mario Romano',
    title: 'Master Chef & Culinary Instructor',
    image: 'https://randomuser.me/api/portraits/men/8.jpg',
    rating: 4.8,
    hourlyRate: 120,
    specialties: ['Italian Cuisine', 'Pastry', 'Wine Pairing', 'Restaurant Management'],
    availability: {
      nextAvailable: 'Today at 7:00 PM',
      schedule: [
        { day: 'Thu', slots: ['10:00 AM', '2:00 PM', '7:00 PM'] },
        { day: 'Fri', slots: ['11:00 AM', '3:00 PM', '6:00 PM'] },
        { day: 'Sat', slots: ['9:00 AM', '1:00 PM', '5:00 PM'] }
      ]
    },
    bio: `With 20 years of culinary expertise, I bring the authentic flavors of Italy to your kitchen. From running Michelin-starred restaurants to teaching at prestigious culinary schools, I'm passionate about sharing the art of fine cooking.`,
    experience: {
      years: 20,
      highlights: [
        'Executive Chef at 2-Michelin Star restaurant in Rome',
        'Culinary Director for international restaurant group',
        'Author of "The Art of Italian Cooking"',
        'Featured on multiple cooking shows and food networks'
      ]
    },
    reviews: { total: 95, average: 4.8 },
    verificationStatus: {
      identity: true,
      credentials: true,
      background: true
    },
    services: [
      {
        type: 'oneOnOne',
        title: 'Private Cooking Session',
        description: 'Personalized cooking class in your kitchen. Learn techniques, recipes, and culinary secrets.',
        duration: '2 hours',
        price: 200
      },
      {
        type: 'event',
        title: 'Group Cooking Class',
        description: 'Interactive cooking class for small groups. Perfect for team building or special occasions.',
        duration: '3 hours',
        price: 150
      },
      {
        type: 'course',
        title: 'Italian Cuisine Mastery',
        description: 'Comprehensive course covering traditional Italian cooking techniques and recipes.',
        duration: '6 weeks',
        price: 799
      }
    ],
    upcomingEvents: [
      {
        id: 'event3',
        title: 'Pasta Making Masterclass',
        date: 'June 18, 2024',
        time: '6:00 PM PST',
        duration: '2.5 hours',
        price: 129,
        spotsLeft: 8
      },
      {
        id: 'event4',
        title: 'Wine & Dine: Italian Summer Feast',
        date: 'June 25, 2024',
        time: '7:00 PM PST',
        duration: '3 hours',
        price: 179,
        spotsLeft: 12
      }
    ]
  }
};

interface ExpertPageProps {
  expert: typeof mockExperts['tech-expert'] | typeof mockExperts['culinary-expert'];
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
  const expertId = context.params?.id as string;
  const expertData = mockExperts[expertId as keyof typeof mockExperts] || mockExperts['tech-expert'];
  
  return {
    props: {
      expert: expertData,
    },
  };
};

export default ExpertPage;
