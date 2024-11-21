import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  login,
  googleSignIn,
  register,
  resetPassword,
  logout,
  getUserProfile,
  type UserProfile
} from '../auth';
import { auth, db } from '../../tests/setup/firebase';
import { mockUser, mockGoogleProvider, resetAllMocks } from '../../tests/mocks/firebase';

// Setup test environment
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

describe('Auth Service', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('register', () => {
    it('successfully registers a new user', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });
      (doc as jest.Mock).mockReturnValue({});
      (setDoc as jest.Mock).mockResolvedValueOnce({});
      (updateProfile as jest.Mock).mockResolvedValueOnce({});

      await register(
        'test@example.com',
        'password123',
        'Test User',
        'client'
      );

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(setDoc).toHaveBeenCalled();
    });

    it('handles registration errors', async () => {
      const error = { code: 'auth/email-already-in-use' };
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        register('test@example.com', 'password123', 'Test User', 'client')
      ).rejects.toThrow('Email is already registered');
    });

    it('throws error for weak password', async () => {
      await expect(
        register('test@example.com', '123', 'Test User', 'client')
      ).rejects.toThrow('Password must be at least 6 characters');
    });

    it('throws error for invalid email format', async () => {
      await expect(
        register('invalid-email', 'password123', 'Test User', 'client')
      ).rejects.toThrow('Invalid email format');
    });
  });

  describe('login', () => {
    it('successfully logs in a user', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser
      });

      await login('test@example.com', 'password123');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
    });

    it('handles login errors', async () => {
      const error = { code: 'auth/wrong-password' };
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        login('test@example.com', 'wrongpass')
      ).rejects.toThrow('Invalid email or password');
    });

    it('handles too many login attempts', async () => {
      const error = { code: 'auth/too-many-requests' };
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        login('test@example.com', 'password123')
      ).rejects.toThrow('Too many login attempts. Please try again later');
    });
  });

  describe('googleSignIn', () => {
    it('successfully signs in with Google', async () => {
      (signInWithPopup as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });
      (doc as jest.Mock).mockReturnValue({});
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false
      });
      (setDoc as jest.Mock).mockResolvedValueOnce({});

      await googleSignIn();

      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(setDoc).toHaveBeenCalled();
    });

    it('handles existing Google user', async () => {
      (signInWithPopup as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });
      (doc as jest.Mock).mockReturnValue({});
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          userType: 'client',
        }),
      });

      await googleSignIn();

      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(setDoc).not.toHaveBeenCalled();
    });

    it('handles popup blocked error', async () => {
      const error = { code: 'auth/popup-blocked' };
      (signInWithPopup as jest.Mock).mockRejectedValueOnce(error);

      await expect(googleSignIn())
        .rejects.toThrow('Popup was blocked by the browser');
    });
  });

  describe('logout', () => {
    it('successfully logs out a user', async () => {
      await logout();
      expect(signOut).toHaveBeenCalled();
    });

    it('handles logout errors', async () => {
      (signOut as jest.Mock).mockRejectedValueOnce(new Error());
      await expect(logout()).rejects.toThrow('Failed to log out');
    });
  });

  describe('resetPassword', () => {
    it('successfully sends password reset email', async () => {
      (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce({});

      await resetPassword('test@example.com');

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, 'test@example.com');
    });

    it('handles missing email error', async () => {
      await expect(resetPassword(''))
        .rejects.toThrow('Email is required');
    });

    it('handles user not found error', async () => {
      const error = { code: 'auth/user-not-found' };
      (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(error);

      await expect(resetPassword('nonexistent@example.com'))
        .rejects.toThrow('No account found with this email');
    });
  });

  describe('getUserProfile', () => {
    const mockProfile: UserProfile = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      userType: 'client',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    it('successfully retrieves user profile', async () => {
      (doc as jest.Mock).mockReturnValue({});
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => mockProfile
      });

      const profile = await getUserProfile('test-uid');
      expect(profile).toEqual(mockProfile);
    });

    it('returns null for non-existent profile', async () => {
      (doc as jest.Mock).mockReturnValue({});
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false
      });

      const profile = await getUserProfile('nonexistent-uid');
      expect(profile).toBeNull();
    });
  });
});
