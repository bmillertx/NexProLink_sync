const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyAUWz7jfrt8aNdZ1unL0LT_vVIE4QHOD0k",
  authDomain: "nexprolink-dev.firebaseapp.com",
  projectId: "nexprolink-dev",
  storageBucket: "nexprolink-dev.appspot.com",
  messagingSenderId: "747271305155",
  appId: "1:747271305155:web:d1f5c4b93b9c4f6e2a2b2a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample users to create
const sampleUsers = [
  {
    uid: 'admin1',
    email: 'admin@nexprolink.com',
    displayName: 'NexProLink Admin',
    role: 'admin',
    userType: 'admin',
    emailVerified: true,
    isVerified: true,
    status: 'approved',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uid: 'expert1',
    email: 'expert@example.com',
    displayName: 'John Expert',
    userType: 'expert',
    emailVerified: true,
    isVerified: true,
    status: 'approved',
    professionalTitle: 'Senior Consultant',
    yearsOfExperience: 5,
    bio: 'Experienced consultant with expertise in business strategy',
    hourlyRate: 100,
    credentials: ['MBA', 'PMP'],
    specialties: ['Business Strategy', 'Project Management'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uid: 'client1',
    email: 'client@example.com',
    displayName: 'Alice Client',
    userType: 'client',
    emailVerified: true,
    isVerified: true,
    status: 'approved',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function setupFirestore() {
  try {
    console.log('Setting up Firestore database...');

    // Create users collection with sample documents
    for (const user of sampleUsers) {
      console.log(`Creating user: ${user.email}`);
      await setDoc(doc(db, 'users', user.uid), user);
    }

    // Create experts collection document for the expert user
    const expertUser = sampleUsers.find(user => user.userType === 'expert');
    if (expertUser) {
      console.log(`Creating expert profile for: ${expertUser.email}`);
      await setDoc(doc(db, 'experts', expertUser.uid), expertUser);
    }

    // Create sample consultation
    const sampleConsultation = {
      id: 'consultation1',
      clientId: 'client1',
      expertId: 'expert1',
      status: 'scheduled',
      scheduledAt: new Date(),
      duration: 60,
      fee: 100,
      topic: 'Business Strategy Discussion',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(doc(db, 'consultations', sampleConsultation.id), sampleConsultation);

    // Create sample connection
    const sampleConnection = {
      id: 'connection1',
      clientId: 'client1',
      expertId: 'expert1',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(doc(db, 'connections', sampleConnection.id), sampleConnection);

    console.log('Firestore setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up Firestore:', error);
    process.exit(1);
  }
}

setupFirestore();
