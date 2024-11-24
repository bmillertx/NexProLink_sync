import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { GoogleAuthProvider } from 'firebase/auth';
import { getPerformance } from 'firebase/performance';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: 'G-205LM2W36S', // Updated to match server configuration
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Check if Firebase is initialized correctly
if (!app) {
  console.error('Firebase configuration:', {
    apiKey: firebaseConfig.apiKey ? 'Set' : 'Not set',
    authDomain: firebaseConfig.authDomain ? 'Set' : 'Not set',
    projectId: firebaseConfig.projectId ? 'Set' : 'Not set',
    storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Not set',
    messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Not set',
    appId: firebaseConfig.appId ? 'Set' : 'Not set',
  });
  throw new Error('Firebase failed to initialize. Check your environment variables.');
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize analytics and performance only in browser environment
if (typeof window !== 'undefined') {
  // Initialize analytics only if supported and not blocked
  isSupported()
    .then(supported => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(console.error);

  // Initialize performance monitoring
  try {
    getPerformance(app);
  } catch (error) {
    console.warn('Performance monitoring initialization failed:', error);
  }
}

export default app;
