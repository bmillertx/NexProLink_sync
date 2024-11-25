import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDm90o1mH2KJ3Kj_Sa_nWGyM_QLTKpBvRw",
  authDomain: "video-booking-app-26c0e.firebaseapp.com",
  projectId: "video-booking-app-26c0e",
  storageBucket: "video-booking-app-26c0e.appspot.com",
  messagingSenderId: "63025205224",
  appId: "1:63025205224:web:6808effae3c1e33eb41e5d",
  measurementId: "G-205LM2W36S"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db, {
    synchronizeTabs: true
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    } else {
      console.error('Error enabling persistence:', err);
    }
  });
}

export { auth, db };
