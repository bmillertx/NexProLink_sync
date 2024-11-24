import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const email = 'admin@nexprolink.com';
const password = 'Admin@123';
const displayName = 'NexProLink Admin';

async function createAdminProfile(user, displayName) {
  const adminProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName,
    role: 'admin',
    userType: 'admin',
    emailVerified: user.emailVerified,
    isVerified: true,
    status: 'approved',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Create admin user document
  await setDoc(doc(db, 'users', user.uid), adminProfile);
}

async function createAdmin() {
  try {
    console.log('Creating admin account...');
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    console.log('Setting up admin profile...');
    await createAdminProfile(user, displayName);
    
    console.log('Sending verification email...');
    await sendEmailVerification(user);
    
    console.log('\nAdmin account created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nPlease check your email to verify the account.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

createAdmin();
