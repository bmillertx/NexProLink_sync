const { doc, setDoc, serverTimestamp } = require('firebase/firestore');
const { db } = require('../config/firebase');

/**
 * Interface for Admin Profile
 */
interface AdminProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin';
  userType: 'admin';
  emailVerified: boolean;
  isVerified: true;
  status: 'approved';
  createdAt: any;
  updatedAt: any;
}

/**
 * Creates an admin profile for the given user
 * @param {User} user - The user to create the admin profile for
 * @param {string} displayName - The display name of the user
 */
async function createAdminProfile(user, displayName) {
  const adminProfile: AdminProfile = {
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

module.exports = { createAdminProfile };
