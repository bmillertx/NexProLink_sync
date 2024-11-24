require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Firebase configuration
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

async function createTestUsers() {
  const testUsers = [
    {
      email: 'test.client@nexprolink.com',
      password: 'TestClient123!',
      role: 'client',
      displayName: 'Test Client'
    },
    {
      email: 'test.consultant@nexprolink.com',
      password: 'TestConsultant123!',
      role: 'consultant',
      displayName: 'Test Consultant'
    }
  ];

  for (const testUser of testUsers) {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        testUser.email,
        testUser.password
      );

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: testUser.email,
        displayName: testUser.displayName,
        role: testUser.role,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`Created test ${testUser.role}:`, {
        email: testUser.email,
        password: testUser.password
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`Test ${testUser.role} already exists:`, {
          email: testUser.email,
          password: testUser.password
        });
      } else {
        console.error(`Error creating test ${testUser.role}:`, error);
      }
    }
  }
}

createTestUsers().then(() => {
  console.log('Test users setup complete');
  process.exit(0);
}).catch((error) => {
  console.error('Error setting up test users:', error);
  process.exit(1);
});
