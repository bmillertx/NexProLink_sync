// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDm90o1mH2KJ3Kj_Sa_nWGyM_QLTKpBvRw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "video-booking-app-26c0e.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "video-booking-app-26c0e",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "video-booking-app-26c0e.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "63025205224",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:63025205224:web:6808effae3c1e33eb41e5d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-205LM2W36S"
};

export default firebaseConfig;
