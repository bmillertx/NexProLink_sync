import { Expert } from '@/types/expert';

export const mockExperts: Expert[] = [
  // Education & Tutoring Experts
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Mathematics Professor & STEM Educator",
    rating: 4.9,
    totalReviews: 127,
    hourlyRate: 85,
    availability: [
      {
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "17:00",
        breakStart: "12:00",
        breakEnd: "13:00"
      }
    ],
    expertise: ["Advanced Mathematics", "Physics", "SAT/ACT Prep", "STEM Education"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=388&q=80",
    experienceLevel: "Senior (10+ years)",
    description: "Experienced mathematics professor specializing in STEM education and test preparation.",
    languages: ["English", "Mandarin"],
    location: "Boston, MA",
    timezone: "EST",
    category: "education",
    specialization: "STEM Education",
    videoCallAvailable: true,
    inPersonAvailable: true
  },
  {
    id: 2,
    name: "Prof. James Wilson",
    title: "Language Arts & Literature Teacher",
    rating: 4.8,
    totalReviews: 145,
    hourlyRate: 120,
    availability: [
      {
        dayOfWeek: 2,
        startTime: "10:00",
        endTime: "18:00",
        breakStart: "13:00",
        breakEnd: "14:00"
      }
    ],
    expertise: ["Portrait Photography", "Event Photography", "Photo Editing", "Photography Instruction"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=388&q=80",
    experienceLevel: "Senior (8+ years)",
    description: "Professional photographer with extensive experience in portrait and event photography.",
    languages: ["English"],
    location: "Los Angeles, CA",
    timezone: "PST",
    category: "creative",
    specialization: "Photography",
    videoCallAvailable: true,
    inPersonAvailable: true
  }
];
