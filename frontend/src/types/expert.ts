export interface Expert {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  availability: string;
  specialties: string[];
  imageUrl: string;
  experienceLevel: string;
  description?: string;
  languages?: string[];
  location?: string;
  timezone?: string;
  education?: Education[];
  certifications?: Certification[];
  portfolio?: PortfolioItem[];
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
