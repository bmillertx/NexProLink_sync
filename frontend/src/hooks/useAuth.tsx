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
    if (typeof window === 'undefined' || !auth) {
      setLoading(false);
      return;
    }

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
            return;
          }

          setUser(user);
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
            setIsExpert(userProfile.userType === 'expert');
          } else {
            console.error('User exists in Auth but not in Firestore');
            setProfile(null);
            setIsExpert(false);
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

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isExpert,
    signIn: login,
    signUp: register,
    signInWithGoogle,
    signOut: async () => {
      if (!auth) throw new Error('Auth not initialized');
      await auth.signOut();
    },
    resetPassword: sendPasswordReset,
    updateProfile,
    resendVerificationEmail: async (email: string) => {
      if (!auth) throw new Error('Auth not initialized');
      if (!auth.currentUser) throw new Error('No user signed in');
      await sendEmailVerification(auth.currentUser);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
