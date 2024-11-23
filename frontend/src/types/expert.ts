export interface Expert {
  id: number | string;
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: string;
  expertise: string[];
  image: string;
  experienceLevel: string;
  description: string;
  languages: string[];
  location: string;
  timezone: string;
  category?: string;
  education?: Education[];
  certifications?: Certification[];
  portfolio?: PortfolioItem[];
  specialties?: string[];
  imageUrl?: string;
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
