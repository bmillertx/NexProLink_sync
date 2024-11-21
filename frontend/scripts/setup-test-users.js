const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

const testUsers = [
  {
    email: 'sarah.johnson@nexprolink.test',
    password: 'Test123!@#',
    displayName: 'Dr. Sarah Johnson',
    role: 'expert',
    profile: {
      title: 'Senior Software Architect',
      hourlyRate: 150,
      specialties: ['System Design', 'Cloud Architecture', 'DevOps', 'Microservices'],
      bio: 'With over 15 years of experience in software architecture and system design...',
      experience: {
        years: 15,
        highlights: [
          'Led architecture for a system processing 1M+ transactions daily',
          'Designed cloud-native solutions for multiple Fortune 500 companies',
        ]
      }
    }
  },
  {
    email: 'test.client@nexprolink.test',
    password: 'Client123!@#',
    displayName: 'John Test',
    role: 'client',
    profile: {
      company: 'Tech Corp',
      position: 'CTO'
    }
  }
];

async function setupTestUsers() {
  try {
    for (const user of testUsers) {
      let userRecord;
      
      try {
        // Try to get existing user
        userRecord = await auth.getUserByEmail(user.email);
        console.log(`Updating existing user: ${user.email}`);
        
        // Update user password
        await auth.updateUser(userRecord.uid, {
          password: user.password,
          displayName: user.displayName,
        });
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // Create new user if doesn't exist
          console.log(`Creating new user: ${user.email}`);
          userRecord = await auth.createUser({
            email: user.email,
            password: user.password,
            displayName: user.displayName,
          });
        } else {
          throw error;
        }
      }

      // Add custom claims for role
      await auth.setCustomUserClaims(userRecord.uid, { role: user.role });

      // Update or create user profile in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        profile: user.profile,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log(`Successfully set up user: ${user.email}`);
    }

    console.log('Test users setup completed successfully!');
  } catch (error) {
    console.error('Error setting up test users:', error);
  } finally {
    process.exit();
  }
}

setupTestUsers();
