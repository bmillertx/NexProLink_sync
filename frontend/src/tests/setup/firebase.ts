import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import mockFirebase from '../mocks/firebase';

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => mockFirebase.app),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => mockFirebase.app)
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockFirebase.auth),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: jest.fn(() => mockFirebase.googleProvider)
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => mockFirebase.firestore),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date().toISOString())
}));

// Initialize mock Firebase
const app = initializeApp({
  apiKey: 'mock-api-key',
  authDomain: 'mock-auth-domain',
  projectId: 'mock-project-id',
  storageBucket: 'mock-storage-bucket',
  messagingSenderId: 'mock-sender-id',
  appId: 'mock-app-id'
});

export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper to reset all Firebase mocks before each test
export const resetFirebaseMocks = () => {
  mockFirebase.resetAllMocks();
};
