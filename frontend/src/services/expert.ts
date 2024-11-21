import { db } from '../config/firebase';
import { collection, query, where, getDocs, limit, orderBy, startAfter, DocumentData } from 'firebase/firestore';

export interface ExpertProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialties: string[];
  yearsOfExperience: number;
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  availability: {
    nextAvailable: string;
    availableSlots: string[];
  };
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: number;
  }[];
  languages: string[];
  location: {
    city: string;
    country: string;
    timeZone: string;
  };
  bio: string;
  profileImage: string;
  skills: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }[];
  industries: string[];
  featuredProjects: {
    title: string;
    description: string;
    outcome: string;
  }[];
  testimonials: {
    clientName: string;
    comment: string;
    rating: number;
    date: string;
  }[];
  status: 'Available' | 'Busy' | 'Away';
  responseTime: string;
  successRate: number;
  projectsCompleted: number;
}

export interface SearchFilters {
  specialties?: string[];
  minExperience?: number;
  maxHourlyRate?: number;
  minRating?: number;
  languages?: string[];
  availability?: string;
  location?: string;
  skills?: string[];
  industries?: string[];
}

// Mock data generator for development
const generateMockExperts = (): ExpertProfile[] => {
  const specialties = [
    'Software Development', 'Data Science', 'Cloud Architecture',
    'DevOps', 'Cybersecurity', 'Machine Learning', 'Mobile Development',
    'UI/UX Design', 'Blockchain', 'Digital Marketing'
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese'];
  const cities = ['New York', 'London', 'Tokyo', 'San Francisco', 'Berlin', 'Singapore'];
  const industries = [
    'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education',
    'Entertainment', 'Manufacturing', 'Real Estate', 'Energy', 'Transportation'
  ];

  const mockExperts: ExpertProfile[] = [];

  for (let i = 1; i <= 50; i++) {
    const expert: ExpertProfile = {
      id: `expert-${i}`,
      firstName: `Expert${i}`,
      lastName: `Professional${i}`,
      title: `Senior ${specialties[Math.floor(Math.random() * specialties.length)]} Consultant`,
      specialties: Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => 
        specialties[Math.floor(Math.random() * specialties.length)]
      ),
      yearsOfExperience: 3 + Math.floor(Math.random() * 15),
      rating: 3.5 + Math.random() * 1.5,
      totalReviews: 10 + Math.floor(Math.random() * 90),
      hourlyRate: 50 + Math.floor(Math.random() * 200),
      availability: {
        nextAvailable: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        availableSlots: Array.from({ length: 5 }, (_, i) => 
          new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString()
        ),
      },
      education: [
        {
          degree: 'Master of Science',
          institution: 'Tech University',
          year: 2015 + Math.floor(Math.random() * 7),
        },
      ],
      certifications: [
        {
          name: 'Professional Certificate',
          issuer: 'Industry Leader',
          year: 2018 + Math.floor(Math.random() * 4),
        },
      ],
      languages: Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () =>
        languages[Math.floor(Math.random() * languages.length)]
      ),
      location: {
        city: cities[Math.floor(Math.random() * cities.length)],
        country: 'Various Countries',
        timeZone: 'UTC+0',
      },
      bio: `Experienced professional with a passion for delivering high-quality solutions. Specialized in ${
        specialties[Math.floor(Math.random() * specialties.length)]
      } with a track record of successful projects.`,
      profileImage: `/mock/expert-${1 + Math.floor(Math.random() * 8)}.jpg`,
      skills: Array.from({ length: 4 + Math.floor(Math.random() * 4) }, () => ({
        name: specialties[Math.floor(Math.random() * specialties.length)],
        level: ['Intermediate', 'Advanced', 'Expert'][Math.floor(Math.random() * 3)] as any,
      })),
      industries: Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () =>
        industries[Math.floor(Math.random() * industries.length)]
      ),
      featuredProjects: [
        {
          title: 'Major Industry Project',
          description: 'Led a team to deliver innovative solutions',
          outcome: 'Increased efficiency by 40%',
        },
      ],
      testimonials: Array.from({ length: 3 }, (_, i) => ({
        clientName: `Client ${i + 1}`,
        comment: 'Excellent work and professional communication throughout the project.',
        rating: 4 + Math.random(),
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      })),
      status: ['Available', 'Busy', 'Away'][Math.floor(Math.random() * 3)] as any,
      responseTime: ['< 1 hour', '1-2 hours', '2-4 hours'][Math.floor(Math.random() * 3)],
      successRate: 85 + Math.floor(Math.random() * 15),
      projectsCompleted: 20 + Math.floor(Math.random() * 80),
    };
    mockExperts.push(expert);
  }

  return mockExperts;
};

// Cache mock data
const mockExperts = generateMockExperts();

export const searchExperts = async (
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<{ experts: ExpertProfile[]; totalExperts: number; hasMore: boolean }> => {
  // In development, use mock data
  if (process.env.NODE_ENV === 'development') {
    let filteredExperts = [...mockExperts];

    // Apply filters
    if (filters.specialties?.length) {
      filteredExperts = filteredExperts.filter(expert =>
        expert.specialties.some(specialty => filters.specialties?.includes(specialty))
      );
    }

    if (filters.minExperience) {
      filteredExperts = filteredExperts.filter(
        expert => expert.yearsOfExperience >= filters.minExperience!
      );
    }

    if (filters.maxHourlyRate) {
      filteredExperts = filteredExperts.filter(
        expert => expert.hourlyRate <= filters.maxHourlyRate!
      );
    }

    if (filters.minRating) {
      filteredExperts = filteredExperts.filter(
        expert => expert.rating >= filters.minRating!
      );
    }

    if (filters.languages?.length) {
      filteredExperts = filteredExperts.filter(expert =>
        expert.languages.some(language => filters.languages?.includes(language))
      );
    }

    if (filters.industries?.length) {
      filteredExperts = filteredExperts.filter(expert =>
        expert.industries.some(industry => filters.industries?.includes(industry))
      );
    }

    // Calculate pagination
    const start = (page - 1) * pageSize;
    const paginatedExperts = filteredExperts.slice(start, start + pageSize);

    return {
      experts: paginatedExperts,
      totalExperts: filteredExperts.length,
      hasMore: start + pageSize < filteredExperts.length,
    };
  }

  // In production, use Firestore
  try {
    const expertsRef = collection(db, 'experts');
    let q = query(expertsRef);

    // Apply filters
    if (filters.specialties?.length) {
      q = query(q, where('specialties', 'array-contains-any', filters.specialties));
    }

    if (filters.minExperience) {
      q = query(q, where('yearsOfExperience', '>=', filters.minExperience));
    }

    if (filters.maxHourlyRate) {
      q = query(q, where('hourlyRate', '<=', filters.maxHourlyRate));
    }

    // Add pagination
    q = query(q, orderBy('rating', 'desc'), limit(pageSize));

    const snapshot = await getDocs(q);
    const experts: ExpertProfile[] = [];
    snapshot.forEach((doc) => {
      experts.push({ id: doc.id, ...doc.data() } as ExpertProfile);
    });

    return {
      experts,
      totalExperts: snapshot.size, // This should be replaced with a proper count
      hasMore: experts.length === pageSize,
    };
  } catch (error) {
    console.error('Error searching experts:', error);
    throw error;
  }
};

export const getExpertById = async (expertId: string): Promise<ExpertProfile | null> => {
  // In development, use mock data
  if (process.env.NODE_ENV === 'development') {
    const expert = mockExperts.find(e => e.id === expertId);
    return expert || null;
  }

  // In production, use Firestore
  try {
    const expertsRef = collection(db, 'experts');
    const q = query(expertsRef, where('id', '==', expertId), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const expertDoc = snapshot.docs[0];
    return { id: expertDoc.id, ...expertDoc.data() } as ExpertProfile;
  } catch (error) {
    console.error('Error getting expert:', error);
    throw error;
  }
};
