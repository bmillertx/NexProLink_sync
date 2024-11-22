import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { authService, UserProfile } from '@/services/firebase/auth.service';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: 'client' | 'consultant', professionalInfo?: UserProfile['professionalInfo']) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userProfile = await authService.getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const userProfile = await authService.signIn(email, password);
    setProfile(userProfile);
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: 'client' | 'consultant',
    professionalInfo?: UserProfile['professionalInfo']
  ) => {
    const userProfile = await authService.signUp(email, password, displayName, role, professionalInfo);
    setProfile(userProfile);
  };

  const signInWithGoogle = async () => {
    const userProfile = await authService.signInWithGoogle();
    setProfile(userProfile);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
