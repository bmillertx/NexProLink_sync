import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDm90o1mH2KJ3Kj_Sa_nWGyM_QLTKpBvRw",
  authDomain: "video-booking-app-26c0e.firebaseapp.com",
  projectId: "video-booking-app-26c0e",
  storageBucket: "video-booking-app-26c0e.firebasestorage.app",
  messagingSenderId: "63025205224",
  appId: "1:63025205224:web:6808effae3c1e33eb41e5d",
  measurementId: "G-205LM2W36S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
