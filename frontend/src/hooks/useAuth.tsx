import { createContext, useContext, useEffect, useState } from 'react';
import { User, signOut, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
        setIsExpert(userProfile?.userType === 'expert' || false);
      } else {
        setProfile(null);
        setIsExpert(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isExpert,
    signIn: login,
    signUp: register,
    signInWithGoogle,
    signOut: () => signOut(auth),
    resetPassword: sendPasswordReset,
    updateProfile: async () => {
      if (!user) return;
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
      setIsExpert(userProfile?.userType === 'expert' || false);
    },
    resendVerificationEmail: async (email: string) => {
      if (!user) throw new Error('No user found');
      await sendEmailVerification(user);
    }
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

export default useAuth;
