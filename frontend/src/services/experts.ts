import { db } from '@/config/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

export interface ExpertAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface EventSchedule {
  startDate: string;  // ISO date string
  startTime: string;  // 24h format "HH:mm"
  duration: number;   // in minutes
  spotsTotal: number;
  spotsAvailable: number;
}

export interface ExpertEvent {
  id: string;
  type: 'scheduledEvent' | 'flexibleSession';
  name: string;
  description: string;
  price: number;
  requirements?: string[];
  maxParticipants?: number;
  schedules?: EventSchedule[];  // For scheduled events
  duration?: number;            // For flexible sessions (in minutes)
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string;
  imageUrl?: string;
  bio?: string;
  availability: ExpertAvailability[];
  rating?: number;
  totalReviews?: number;
  hourlyRate?: number;
  languages?: string[];
  events: ExpertEvent[];
}

const expertsCollection = 'experts';

// Mock experts for development
const mockExperts: Expert[] = [
  {
    id: 'chef-mario-123',
    name: 'Chef Mario Rossi',
    title: 'Executive Chef & Culinary Instructor',
    specialization: 'Italian Cuisine',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    bio: 'With 20 years of experience in authentic Italian cuisine, Chef Mario brings the heart of Tuscany to your kitchen. Trained in Florence and having led multiple Michelin-starred restaurants, he now shares his passion through interactive cooking classes and personalized culinary consultations.',
    availability: [
      {
        dayOfWeek: 2, // Tuesday
        startTime: '10:00',
        endTime: '18:00'
      },
      {
        dayOfWeek: 4, // Thursday
        startTime: '14:00',
        endTime: '21:00'
      },
      {
        dayOfWeek: 6, // Saturday
        startTime: '09:00',
        endTime: '17:00'
      }
    ],
    rating: 4.9,
    totalReviews: 128,
    hourlyRate: 150,
    languages: ['English', 'Italian'],
    events: [
      {
        id: 'pasta-masterclass-001',
        type: 'scheduledEvent',
        name: 'Handmade Pasta Masterclass: From Scratch to Table',
        description: 'Join Chef Mario for an authentic Italian pasta-making experience! Learn to create three classic pasta shapes from scratch: fettuccine, ravioli, and orecchiette. You will master the perfect pasta dough, learn traditional forming techniques, and discover the secrets to pairing each shape with the right sauce. This interactive session includes live demonstrations, step-by-step guidance, and personalized feedback.',
        price: 89.99,
        maxParticipants: 15,
        schedules: [
          {
            startDate: '2024-02-15',
            startTime: '14:00',
            duration: 180,
            spotsTotal: 15,
            spotsAvailable: 8
          },
          {
            startDate: '2024-02-22',
            startTime: '10:00',
            duration: 180,
            spotsTotal: 15,
            spotsAvailable: 15
          }
        ],
        requirements: [
          '400g (3 cups) \'00\' pasta flour or all-purpose flour',
          '4 large eggs (room temperature)',
          'Wooden cutting board or clean counter space',
          'Rolling pin (or pasta machine if you have one)',
          'Sharp knife',
          'Fork for shaping',
          'Clean kitchen towel',
          'Measuring cups/scales',
          'Large bowl',
          'Bench scraper (optional but recommended)',
          'Storage container for finished pasta'
        ]
      },
      {
        id: 'tuscan-dinner-001',
        type: 'scheduledEvent',
        name: 'Tuscan Sunday Dinner: Complete Menu Workshop',
        description: 'Create a complete authentic Tuscan dinner menu featuring Ribollita (traditional bread soup), homemade pici pasta with wild boar ragu, and classic tiramisu. Perfect for intermediate home cooks looking to expand their Italian cooking repertoire. This comprehensive workshop will guide you through timing and preparation of all courses.',
        price: 129.99,
        maxParticipants: 12,
        schedules: [
          {
            startDate: '2024-02-18',
            startTime: '15:00',
            duration: 240,
            spotsTotal: 12,
            spotsAvailable: 5
          },
          {
            startDate: '2024-02-25',
            startTime: '15:00',
            duration: 240,
            spotsTotal: 12,
            spotsAvailable: 12
          }
        ],
        requirements: [
          'Large heavy-bottomed pot (5qt or larger)',
          'Medium saucepan',
          '2 large mixing bowls',
          'Wooden spoons and spatulas',
          'Sharp knife and cutting board',
          'Fine mesh strainer',
          'Stand mixer or hand mixer',
          '8x8 baking dish for tiramisu',
          'Basic pantry items (olive oil, salt, pepper)',
          'Fresh vegetables (will be specified)',
          'Ground meat (pork and beef)',
          'Mascarpone cheese',
          'Heavy cream',
          'Lady fingers',
          'Strong brewed coffee'
        ]
      },
      {
        id: 'private-cooking-001',
        type: 'flexibleSession',
        name: 'Private Italian Cooking Session',
        description: 'Book a private 1:1 cooking session with Chef Mario. Perfect for perfecting your techniques, learning family recipes, or getting personalized guidance on Italian cuisine. Sessions can be customized to your skill level and specific interests.',
        price: 199.99,
        duration: 120,
        requirements: [
          'Specific ingredients and equipment will be discussed and agreed upon based on your chosen recipes and goals',
          'Good internet connection',
          'Kitchen workspace visible on camera',
          'Basic kitchen equipment (details provided after booking)'
        ]
      }
    ]
  },
  {
    id: 'expert-1',
    name: 'Dr. Sarah Chen',
    title: 'Financial Advisor',
    specialization: 'Investment Planning',
    bio: 'Experienced financial advisor with over 10 years of expertise in investment planning and wealth management.',
    availability: [
      {
        dayOfWeek: 1, // Monday
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        breakStart: '12:00 PM',
        breakEnd: '01:00 PM'
      },
      {
        dayOfWeek: 2, // Tuesday
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        breakStart: '12:00 PM',
        breakEnd: '01:00 PM'
      },
      {
        dayOfWeek: 3, // Wednesday
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        breakStart: '12:00 PM',
        breakEnd: '01:00 PM'
      },
      {
        dayOfWeek: 4, // Thursday
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        breakStart: '12:00 PM',
        breakEnd: '01:00 PM'
      },
      {
        dayOfWeek: 5, // Friday
        startTime: '09:00 AM',
        endTime: '04:00 PM',
        breakStart: '12:00 PM',
        breakEnd: '01:00 PM'
      }
    ],
    rating: 4.8,
    totalReviews: 127,
    hourlyRate: 150,
    languages: ['English', 'Mandarin'],
    location: 'New York, NY',
    videoCallAvailable: true,
    inPersonAvailable: true,
    events: []
  },
  {
    id: 'expert-2',
    name: 'Michael Rodriguez',
    title: 'Tax Specialist',
    specialization: 'Personal & Business Tax',
    bio: 'Certified tax specialist with expertise in both personal and business tax planning.',
    availability: [
      {
        dayOfWeek: 1, // Monday
        startTime: '10:00 AM',
        endTime: '06:00 PM',
        breakStart: '01:00 PM',
        breakEnd: '02:00 PM'
      },
      {
        dayOfWeek: 2, // Tuesday
        startTime: '10:00 AM',
        endTime: '06:00 PM',
        breakStart: '01:00 PM',
        breakEnd: '02:00 PM'
      },
      {
        dayOfWeek: 3, // Wednesday
        startTime: '10:00 AM',
        endTime: '06:00 PM',
        breakStart: '01:00 PM',
        breakEnd: '02:00 PM'
      },
      {
        dayOfWeek: 4, // Thursday
        startTime: '10:00 AM',
        endTime: '06:00 PM',
        breakStart: '01:00 PM',
        breakEnd: '02:00 PM'
      }
    ],
    rating: 4.9,
    totalReviews: 89,
    hourlyRate: 125,
    languages: ['English', 'Spanish'],
    location: 'Remote Only',
    videoCallAvailable: true,
    inPersonAvailable: false,
    events: []
  }
];

export async function getExperts() {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return mockExperts;
    }

    const querySnapshot = await getDocs(collection(db, expertsCollection));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expert[];
  } catch (error) {
    console.error('Error getting experts:', error);
    throw error;
  }
}

export async function getExpertById(expertId: string) {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const expert = mockExperts.find(e => e.id === expertId);
      if (!expert) {
        throw new Error('Expert not found');
      }
      return expert;
    }

    const expertDoc = await getDoc(doc(db, expertsCollection, expertId));
    if (!expertDoc.exists()) {
      throw new Error('Expert not found');
    }
    return {
      id: expertDoc.id,
      ...expertDoc.data()
    } as Expert;
  } catch (error) {
    console.error('Error getting expert:', error);
    throw error;
  }
}

export async function getExpertsBySpecialization(specialization: string) {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return mockExperts.filter(e => e.specialization === specialization);
    }

    const q = query(
      collection(db, expertsCollection),
      where('specialization', '==', specialization)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expert[];
  } catch (error) {
    console.error('Error getting experts by specialization:', error);
    throw error;
  }
}

export function getAvailableTimeSlots(
  expert: Expert,
  date: Date,
  existingAppointments: { startTime: string; duration: string }[]
) {
  const dayOfWeek = date.getDay();
  const dayAvailability = expert.availability.find(a => a.dayOfWeek === dayOfWeek);
  
  if (!dayAvailability) {
    return [];
  }

  const timeSlots: string[] = [];
  let currentTime = dayAvailability.startTime;

  while (currentTime < dayAvailability.endTime) {
    // Check if the time slot conflicts with break time
    if (
      dayAvailability.breakStart &&
      dayAvailability.breakEnd &&
      currentTime >= dayAvailability.breakStart &&
      currentTime < dayAvailability.breakEnd
    ) {
      currentTime = dayAvailability.breakEnd;
      continue;
    }

    // Check if the time slot conflicts with existing appointments
    const hasConflict = existingAppointments.some(appointment => {
      const appointmentEnd = addMinutesToTime(
        appointment.startTime,
        parseInt(appointment.duration)
      );
      return (
        currentTime >= appointment.startTime &&
        currentTime < appointmentEnd
      );
    });

    if (!hasConflict) {
      timeSlots.push(currentTime);
    }

    // Add 30 minutes to current time
    currentTime = addMinutesToTime(currentTime, 30);
  }

  return timeSlots;
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, minutesPart] = time.split(':');
  const [minutesStr, period] = minutesPart.split(' ');
  
  let totalMinutes = parseInt(hours) * 60 + parseInt(minutesStr) + minutes;
  if (period === 'PM' && hours !== '12') {
    totalMinutes += 12 * 60;
  }
  if (period === 'AM' && hours === '12') {
    totalMinutes -= 12 * 60;
  }

  const newHours = Math.floor(totalMinutes / 60) % 12 || 12;
  const newMinutes = totalMinutes % 60;
  const newPeriod = Math.floor(totalMinutes / 60) >= 12 ? 'PM' : 'AM';

  return `${newHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
}
