import { createContext, useContext, useEffect, useState } from 'react';
import { User, signOut, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { 
  getUserProfile, 
  createUserProfile,
  login,
  register,
  googleSignIn as signInWithGoogle,
  resetPassword as sendPasswordReset,
  type UserProfile 
} from '@/services/auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isExpert: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, displayName: string, role: 'client' | 'expert') => Promise<UserProfile>;
  signInWithGoogle: () => Promise<UserProfile>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpert, setIsExpert] = useState(false);

  const updateProfile = async () => {
    if (!user) return;
    try {
      const userProfile = await getUserProfile(user.uid);
      if (userProfile) {
        setProfile(userProfile);
        setIsExpert(userProfile.userType === 'expert');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      setProfile(null);
      setIsExpert(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        setLoading(true);
        
        if (user) {
          // Check email verification
          if (!user.emailVerified) {
            // If email is not verified, sign out and clear state
            await auth.signOut();
            setUser(null);
            setProfile(null);
            setIsExpert(false);
            setLoading(false);
            return;
          }
          
          setUser(user);
          const userProfile = await getUserProfile(user.uid);
          if (!userProfile) {
            // If no profile exists, create one
            const defaultProfile = await createUserProfile(
              user.uid,
              user.email || '',
              user.displayName || 'User',
              'client' // Default role
            );
            setProfile(defaultProfile);
            setIsExpert(false);
          } else {
            setProfile(userProfile);
            setIsExpert(userProfile.userType === 'expert');
          }
        } else {
          setUser(null);
          setProfile(null);
          setIsExpert(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setProfile(null);
        setIsExpert(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isExpert,
    signIn: async (email: string, password: string) => {
      const userProfile = await login(email, password);
      setProfile(userProfile);
      setIsExpert(userProfile.userType === 'expert');
      return userProfile;
    },
    signUp: async (email: string, password: string, displayName: string, role: 'client' | 'expert') => {
      const userProfile = await register(email, password, displayName, role);
      // Don't set profile or isExpert here since user needs to verify email first
      return userProfile;
    },
    signInWithGoogle: async () => {
      const userProfile = await signInWithGoogle();
      setProfile(userProfile);
      setIsExpert(userProfile.userType === 'expert');
      return userProfile;
    },
    signOut: async () => {
      try {
        await signOut(auth);
        setUser(null);
        setProfile(null);
        setIsExpert(false);
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    },
    resetPassword: async (email: string) => {
      await sendPasswordReset(email);
    },
    updateProfile,
    resendVerificationEmail: async (email: string) => {
      // Get the user credential first
      const userCredential = await signInWithEmailAndPassword(auth, email, '');
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
      // Sign out immediately after sending verification email
      await auth.signOut();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
