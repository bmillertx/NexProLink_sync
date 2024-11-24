export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'client' | 'consultant';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Payment Integration Fields
  stripeCustomerId?: string;
  stripeAccountId?: string; // For consultants
  paymentMethods?: {
    default?: string;
    cards?: string[];
  };
  // Consultation Fields
  consultationRate?: number; // For consultants
  availability?: {
    timezone: string;
    schedule?: Record<string, { start: string; end: string }>;
  };
  // Video Service Fields
  videoServiceId?: string;
  videoPreferences?: {
    defaultMicrophoneId?: string;
    defaultCameraId?: string;
    defaultSpeakerId?: string;
  };
  // Professional Info (for consultants)
  professionalInfo?: {
    title?: string;
    specializations?: string[];
    experience?: number;
    education?: Array<{
      degree: string;
      institution: string;
      year: number;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      year: number;
    }>;
  };
}
