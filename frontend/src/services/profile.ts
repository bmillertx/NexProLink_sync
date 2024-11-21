import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  bio: string;
  location: string;
  experience: string;
  education: string;
  certifications: string[];
  languages: string[];
  website: string;
  linkedin: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    appointments: boolean;
    messages: boolean;
  };
  updatedAt: string;
}

export const updateUserProfile = async (userId: string, profileData: Partial<ProfileData>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};
