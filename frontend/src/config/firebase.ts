import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize persistence and analytics only in browser environment
if (typeof window !== 'undefined') {
  // Attempt to enable persistence with proper error handling
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser doesn\'t support persistence');
      } else if (err.message?.includes('ERR_BLOCKED_BY_CLIENT') || err.code === 'permission-denied') {
        console.warn('Firebase access blocked or insufficient permissions, falling back to local mode');
      }
    });

  // Initialize analytics only if supported and not blocked
  isSupported()
    .then(supported => {
      if (supported) {
        try {
          getAnalytics(app);
        } catch (error) {
          console.warn('Analytics initialization failed, continuing without analytics');
        }
      }
    })
    .catch(() => {
      console.warn('Analytics not supported or blocked');
    });
}

// Debug Firebase configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Config:', {
    apiKey: firebaseConfig.apiKey?.slice(0, 5) + '...',
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}

export { app };
