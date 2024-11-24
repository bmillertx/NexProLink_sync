const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUWz7jfrt8aNdZ1unL0LT_vVIE4QHOD0k",
  authDomain: "nexprolink-dev.firebaseapp.com",
  projectId: "nexprolink-dev",
  storageBucket: "nexprolink-dev.appspot.com",
  messagingSenderId: "747271305155",
  appId: "1:747271305155:web:d1f5c4b93b9c4f6e2a2b2a"
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
