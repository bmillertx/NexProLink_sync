import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { 
  login, 
  googleSignIn, 
  register, 
  updateUserProfile, 
  getUserProfile,
  resetPassword,
  logout,
  signOut
} from '../auth';
import { auth, db } from '../../config/firebase';

// Mock Firebase Auth and Firestore
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('../../config/firebase', () => ({
  auth: {},
  db: {}
}));

describe('Auth Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      const mockUserCredential = {
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User'
        }
      };

      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(mockUserCredential);
      (doc as jest.Mock).mockReturnValue({});
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'client'
        })
      });

      const result = await login('test@example.com', 'password123');
      
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(result).toEqual(mockUserCredential);
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid email or password';
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(login('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow(errorMessage);
    });
  });

  // Add more test suites for other functions...
});
