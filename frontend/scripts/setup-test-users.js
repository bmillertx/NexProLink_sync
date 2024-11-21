const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

// Initialize Firebase Admin with explicit project ID
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'video-booking-app'
});

const auth = admin.auth();
const db = admin.firestore();

const testUsers = [
  {
    email: 'test.expert@nexprolink.com',
    password: 'Expert123!@#',
    displayName: 'Test Expert',
    role: 'expert',
    profile: {
      title: 'Senior Software Architect',
      hourlyRate: 150,
      specialties: ['System Design', 'Cloud Architecture'],
      bio: 'Experienced software architect'
    }
  }
];

async function setupTestUsers() {
  try {
    for (const user of testUsers) {
      console.log(`Setting up user: ${user.email}`);
      
      // Delete existing user if exists
      try {
        const existingUser = await auth.getUserByEmail(user.email);
        console.log(`Deleting existing user: ${user.email}`);
        await auth.deleteUser(existingUser.uid);
      } catch (error) {
        if (error.code !== 'auth/user-not-found') {
          console.error('Error deleting user:', error);
          throw error;
        }
      }

      // Create new user
      console.log(`Creating new user: ${user.email}`);
      const userRecord = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true
      });

      // Set custom claims
      console.log(`Setting custom claims for: ${user.email}`);
      await auth.setCustomUserClaims(userRecord.uid, { role: user.role });

      // Create user profile
      console.log(`Creating profile for: ${user.email}`);
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        profile: user.profile,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Successfully set up user: ${user.email}`);
      console.log('User details:', {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      });
    }

    console.log('Test users setup completed successfully!');
  } catch (error) {
    console.error('Error setting up test users:', error);
    throw error;
  } finally {
    process.exit();
  }
}

setupTestUsers();
