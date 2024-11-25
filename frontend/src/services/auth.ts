import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  User,
  getAuth,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { errorService } from '@/services/error/error.service';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  userType: 'client' | 'expert';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  professionalTitle?: string;
  yearsOfExperience?: number;
  bio?: string;
  hourlyRate?: number;
  credentials?: string[];
  specialties?: string[];
  isVerified?: boolean;
}

export interface ExpertRegistrationData {
  professionalTitle: string;
  yearsOfExperience: number;
  bio: string;
  hourlyRate: number;
  credentials: string[];
  specialties: string[];
}

export const createUserProfile = async (
  uid: string, 
  email: string, 
  displayName: string, 
  userType: 'client' | 'expert',
  expertData?: ExpertRegistrationData
): Promise<UserProfile> => {
  try {
    // Create base user profile
    const userProfile: UserProfile = {
      uid,
      email: email || '',
      displayName,
      userType,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save base profile to users collection
    await setDoc(doc(db, 'users', uid), userProfile);

    // If expert, create additional expert profile
    if (userType === 'expert' && expertData) {
      const expertProfile = {
        ...userProfile,
        professionalTitle: expertData.professionalTitle,
        yearsOfExperience: expertData.yearsOfExperience,
        bio: expertData.bio,
        hourlyRate: expertData.hourlyRate,
        credentials: expertData.credentials,
        specialties: expertData.specialties,
        isVerified: false,
      };
      await setDoc(doc(db, 'experts', uid), expertProfile);
      return expertProfile;
    }

    return userProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw errorService.handleError(error, {
      context: 'profile-creation',
      userType,
    });
  }
};

export const register = async (
  email: string,
  password: string,
  displayName: string,
  userType: 'client' | 'expert'
): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    await updateProfile(user, { displayName });
    await sendEmailVerification(user);

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      userType,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, profile);

    return profile;
  } catch (error) {
    console.error('Registration error:', error);
    throw errorService.handleError(error, {
      context: 'registration',
      email,
      userType,
    });
  }
};

export const login = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    if (!user.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email before signing in.');
    }

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found.');
    }

    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error('Login error:', error);
    throw errorService.handleError(error, {
      context: 'login',
      email,
    });
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data() as UserProfile;
    
    // If user is an expert, merge with expert profile
    if (userData.userType === 'expert') {
      const expertDoc = await getDoc(doc(db, 'experts', uid));
      if (expertDoc.exists()) {
        return {
          ...userData,
          ...expertDoc.data(),
        };
      }
    }
    
    return userData;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw errorService.handleError(error, {
      context: 'profile-retrieval',
      uid,
    });
  }
};

export const googleSignIn = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw errorService.handleError(error, {
      context: 'password-reset',
      email,
    });
  }
};

export const logout = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
    throw errorService.handleError(error, {
      context: 'logout',
    });
  }
};

export const verifyAndCreateUserProfile = async (uid: string, email: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      // Create default profile if it doesn't exist
      await createUserProfile(uid, email, email.split('@')[0], 'client');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Profile verification error:', error);
    throw errorService.handleError(error, {
      context: 'profile-verification',
      uid,
      email,
    });
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    if (updates.userType === 'expert') {
      const expertRef = doc(db, 'experts', uid);
      await setDoc(expertRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    throw errorService.handleError(error, {
      context: 'profile-update',
      uid,
    });
  }
};

export const authService = {
  login,
  register,
  logout,
  googleSignIn,
  resetPassword,
  getUserProfile,
  createUserProfile,
  verifyAndCreateUserProfile,
  updateUserProfile,
};
