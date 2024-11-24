export interface ExpertAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface Expert {
  id: string | number;
  name: string;
  title: string;
  specialization: string;
  imageUrl?: string;
  bio?: string;
  availability: ExpertAvailability[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  languages: string[];
  videoCallAvailable?: boolean;
  inPersonAvailable?: boolean;
  expertise: string[];
  experienceLevel: string;
  description: string;
  location: string;
  timezone: string;
  category: string;
  education?: Education[];
  certifications?: Certification[];
  portfolio?: PortfolioItem[];
  specialties?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  validUntil?: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  link?: string;
  imageUrl?: string;
  technologies: string[];
}
