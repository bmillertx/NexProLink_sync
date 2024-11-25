import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/config/firebase';
import { UserProfile } from '@/types/user';

class AuthService {
  async login(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await this.getUserProfile(userCredential.user.uid);
      if (!userProfile) {
        throw new Error('User profile not found');
      }
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(
    email: string, 
    password: string, 
    displayName: string, 
    role: 'client' | 'consultant'
  ): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await sendEmailVerification(user);
      
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role,
        emailVerified: false,
        status: 'active',
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        availability: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      return userProfile;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async googleSignIn(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      let userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        userProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email!.split('@')[0],
          role: 'client',
          emailVerified: user.emailVerified,
          status: 'active',
          createdAt: serverTimestamp() as any,
          updatedAt: serverTimestamp() as any,
          availability: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        };
        
        await setDoc(doc(db, 'users', user.uid), userProfile);
      }
      
      return userProfile;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data() as UserProfile : null;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async resendVerificationEmail(): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      console.error('Verification email error:', error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
