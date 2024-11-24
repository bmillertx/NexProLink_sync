const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Initialize Firebase with config
const firebaseConfig = {
  apiKey: "AIzaSyDm90o1mH2KJ3Kj_Sa_nWGyM_QLTKpBvRw",
  authDomain: "video-booking-app-26c0e.firebaseapp.com",
  projectId: "video-booking-app-26c0e",
  storageBucket: "video-booking-app-26c0e.appspot.com",
  messagingSenderId: "63025205224",
  appId: "1:63025205224:web:6808effae3c1e33eb41e5d"
};

// Admin credentials
const ADMIN_EMAIL = 'admin@nexprolink.com';
const ADMIN_PASSWORD = 'Admin@123';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function initializeFirestore() {
  try {
    console.log('Authenticating as admin...');
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Successfully authenticated as admin');

    console.log('Initializing Firestore database...');

    // Create admin user
    const adminUser = {
      uid: auth.currentUser.uid, // Use the actual UID from authentication
      email: ADMIN_EMAIL,
      displayName: 'NexProLink Admin',
      role: 'admin',
      userType: 'admin',
      emailVerified: true,
      isVerified: true,
      status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating admin user...');
    await setDoc(doc(db, 'users', adminUser.uid), adminUser);

    // Create settings collection
    const settings = {
      id: 'app_settings',
      maintenance_mode: false,
      registration_enabled: true,
      expert_verification_required: true,
      minimum_consultation_duration: 30,
      maximum_consultation_duration: 120,
      platform_fee_percentage: 10,
      updatedAt: new Date()
    };

    console.log('Creating app settings...');
    await setDoc(doc(db, 'settings', 'app_settings'), settings);

    // Create categories collection
    const categories = [
      {
        id: 'business-strategy',
        name: 'Business Strategy',
        description: 'Strategic business planning and development',
        isActive: true,
        order: 1
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Marketing strategy and implementation',
        isActive: true,
        order: 2
      },
      {
        id: 'finance',
        name: 'Finance',
        description: 'Financial planning and management',
        isActive: true,
        order: 3
      },
      {
        id: 'technology',
        name: 'Technology',
        description: 'Technology consulting and solutions',
        isActive: true,
        order: 4
      }
    ];

    console.log('Creating categories...');
    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), category);
    }

    // Create email templates collection
    const emailTemplates = {
      id: 'default_templates',
      welcome_client: {
        subject: 'Welcome to NexProLink',
        body: 'Welcome to NexProLink! We\'re excited to have you join our platform.'
      },
      welcome_expert: {
        subject: 'Welcome to NexProLink Expert Network',
        body: 'Thank you for joining NexProLink as an expert. Your application is being reviewed.'
      },
      expert_approved: {
        subject: 'Your NexProLink Expert Account is Approved',
        body: 'Congratulations! Your expert account has been approved.'
      },
      consultation_scheduled: {
        subject: 'New Consultation Scheduled',
        body: 'A new consultation has been scheduled.'
      }
    };

    console.log('Creating email templates...');
    await setDoc(doc(db, 'email_templates', 'default_templates'), emailTemplates);

    console.log('Firestore initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    process.exit(1);
  }
}

initializeFirestore();
