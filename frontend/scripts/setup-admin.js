const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupAdmin() {
  try {
    // Delete existing admin user if exists
    try {
      const existingUser = await admin.auth().getUserByEmail('admin@nexprolink.com');
      await admin.auth().deleteUser(existingUser.uid);
      console.log('Deleted existing admin user');
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Create new admin user
    const userRecord = await admin.auth().createUser({
      email: 'admin@nexprolink.com',
      password: 'Admin@123!',
      displayName: 'NexProLink Admin',
      emailVerified: true
    });
    console.log('Created new admin user:', userRecord.uid);
    
    // Update user custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: 'admin'
    });
    console.log('Updated admin custom claims');

    // Update user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: 'NexProLink Admin',
      role: 'admin',
      userType: 'admin',
      emailVerified: true,
      isVerified: true,
      status: 'approved',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Created admin user document');

    // Create settings collection
    await db.collection('settings').doc('app_settings').set({
      maintenance_mode: false,
      registration_enabled: true,
      expert_verification_required: true,
      minimum_consultation_duration: 30,
      maximum_consultation_duration: 120,
      platform_fee_percentage: 10,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Created settings document');

    // Create categories
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

    for (const category of categories) {
      await db.collection('categories').doc(category.id).set(category);
    }
    console.log('Created categories');

    // Create email templates
    await db.collection('email_templates').doc('default_templates').set({
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
    });
    console.log('Created email templates');

    console.log('\nAdmin setup completed successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@nexprolink.com');
    console.log('Password: Admin@123!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
}

setupAdmin();
