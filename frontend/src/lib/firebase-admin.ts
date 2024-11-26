import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();
export const messaging = admin.messaging();

// Helper functions for admin operations
export const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    throw new Error('Unauthorized');
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const setCustomUserClaims = async (uid: string, claims: object) => {
  try {
    await auth.setCustomUserClaims(uid, claims);
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new Error('Failed to set user claims');
  }
};

export const createUser = async (userData: admin.auth.CreateRequest) => {
  try {
    const userRecord = await auth.createUser(userData);
    return userRecord;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (uid: string) => {
  try {
    await auth.deleteUser(uid);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Firestore admin operations
export const createFirestoreDocument = async (
  collection: string,
  docId: string,
  data: any
) => {
  try {
    await db.collection(collection).doc(docId).set(data);
  } catch (error) {
    console.error('Error creating Firestore document:', error);
    throw error;
  }
};

export const updateFirestoreDocument = async (
  collection: string,
  docId: string,
  data: any
) => {
  try {
    await db.collection(collection).doc(docId).update(data);
  } catch (error) {
    console.error('Error updating Firestore document:', error);
    throw error;
  }
};

export const deleteFirestoreDocument = async (
  collection: string,
  docId: string
) => {
  try {
    await db.collection(collection).doc(docId).delete();
  } catch (error) {
    console.error('Error deleting Firestore document:', error);
    throw error;
  }
};
