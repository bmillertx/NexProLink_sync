import { FirebaseApp } from 'firebase/app';
import { 
  Auth, 
  User, 
  UserCredential, 
  GoogleAuthProvider,
  NextOrObserver,
  Unsubscribe,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  Firestore, 
  DocumentData, 
  DocumentReference,
  CollectionReference,
  DocumentSnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';

// Mock User
export const mockUser: Partial<User> = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: Date.now().toString(),
    lastSignInTime: Date.now().toString()
  },
  providerData: [],
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn()
};

// Mock UserCredential
export const mockUserCredential: Partial<UserCredential> = {
  user: mockUser as User,
  providerId: null,
  operationType: 'signIn'
};

// Mock Auth
export const mockAuth = {
  currentUser: mockUser as User,
  signInWithEmailAndPassword: jest.fn().mockResolvedValue(mockUserCredential),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue(mockUserCredential),
  signInWithPopup: jest.fn().mockResolvedValue(mockUserCredential),
  signOut: jest.fn().mockResolvedValue(undefined),
  onAuthStateChanged: jest.fn((observer: NextOrObserver<User>): Unsubscribe => {
    if (typeof observer === 'function') {
      observer(mockUser as User);
    } else {
      observer.next?.(mockUser as User);
    }
    return jest.fn();
  })
} as unknown as Auth;

// Mock document snapshot data
const mockDocData = {
  uid: mockUser.uid,
  email: mockUser.email,
  displayName: mockUser.displayName,
  emailVerified: mockUser.emailVerified
};

// Mock document reference
const mockDocRef: Partial<DocumentReference> = {
  id: 'test-doc',
  path: 'test/path',
  parent: null,
  collection: jest.fn(),
  withConverter: jest.fn()
};

// Mock document snapshot
const mockDocSnapshot: Partial<QueryDocumentSnapshot> = {
  exists: jest.fn(() => true),
  data: jest.fn(() => mockDocData),
  id: 'test-doc',
  ref: mockDocRef as DocumentReference,
  metadata: { hasPendingWrites: false, fromCache: false }
};

// Mock collection reference
const mockCollectionRef: Partial<CollectionReference> = {
  id: 'test-collection',
  path: 'test/collection',
  parent: null,
  withConverter: jest.fn(),
  doc: jest.fn()
};

// Mock Firestore functions
const mockFirestoreFunctions = {
  collection: jest.fn().mockReturnValue(mockCollectionRef),
  doc: jest.fn().mockReturnValue(mockDocRef),
  getDoc: jest.fn().mockResolvedValue(mockDocSnapshot),
  setDoc: jest.fn().mockResolvedValue(undefined),
  updateDoc: jest.fn().mockResolvedValue(undefined),
  deleteDoc: jest.fn().mockResolvedValue(undefined)
};

// Mock Firestore
export const mockFirestore = {
  ...mockFirestoreFunctions,
  type: 'firestore',
  app: undefined,
  toJSON: jest.fn()
} as unknown as Firestore;

// Mock Firebase App
export const mockFirebaseApp: Partial<FirebaseApp> = {
  name: 'mock-app',
  options: {
    apiKey: 'mock-api-key',
    authDomain: 'mock-auth-domain',
    projectId: 'mock-project-id',
    storageBucket: 'mock-storage-bucket',
    messagingSenderId: 'mock-sender-id',
    appId: 'mock-app-id'
  },
  automaticDataCollectionEnabled: false
};

// Mock Google Provider
export const mockGoogleProvider = new GoogleAuthProvider();

// Helper function to reset all mocks
export const resetAllMocks = () => {
  // Reset Auth mocks
  Object.values(mockAuth).forEach(method => {
    if (typeof method === 'function' && typeof (method as jest.Mock).mockReset === 'function') {
      (method as jest.Mock).mockReset();
    }
  });

  // Reset Firestore function mocks
  Object.values(mockFirestoreFunctions).forEach(method => {
    if (typeof method === 'function' && typeof (method as jest.Mock).mockReset === 'function') {
      (method as jest.Mock).mockReset();
    }
  });

  // Reset document snapshot mocks
  if (typeof (mockDocSnapshot.exists as jest.Mock)?.mockReset === 'function') {
    (mockDocSnapshot.exists as jest.Mock).mockReset();
    (mockDocSnapshot.exists as jest.Mock).mockReturnValue(true);
  }
  
  if (typeof (mockDocSnapshot.data as jest.Mock)?.mockReset === 'function') {
    (mockDocSnapshot.data as jest.Mock).mockReset();
    (mockDocSnapshot.data as jest.Mock).mockReturnValue(mockDocData);
  }

  // Reset default mock implementations
  mockFirestoreFunctions.collection.mockReturnValue(mockCollectionRef);
  mockFirestoreFunctions.doc.mockReturnValue(mockDocRef);
  mockFirestoreFunctions.getDoc.mockResolvedValue(mockDocSnapshot);
  mockFirestoreFunctions.setDoc.mockResolvedValue(undefined);
  mockFirestoreFunctions.updateDoc.mockResolvedValue(undefined);
  mockFirestoreFunctions.deleteDoc.mockResolvedValue(undefined);
};

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  collection: mockFirestoreFunctions.collection,
  doc: mockFirestoreFunctions.doc,
  getDoc: mockFirestoreFunctions.getDoc,
  setDoc: mockFirestoreFunctions.setDoc,
  updateDoc: mockFirestoreFunctions.updateDoc,
  deleteDoc: mockFirestoreFunctions.deleteDoc
}));

// Default export for easy importing
export default {
  auth: mockAuth,
  firestore: mockFirestore,
  app: mockFirebaseApp,
  googleProvider: mockGoogleProvider,
  resetAllMocks
};
