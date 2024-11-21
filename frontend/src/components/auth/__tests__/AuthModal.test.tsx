import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import AuthModal from '../AuthModal';
import { auth } from '@/config/firebase';
import { toast } from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('AuthModal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in form by default', () => {
    render(<AuthModal {...defaultProps} />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('toggles between sign in and sign up forms', async () => {
    render(<AuthModal {...defaultProps} />);
    
    // Initially shows sign in
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    
    // Click to switch to sign up
    await userEvent.click(screen.getByText(/don't have an account\? sign up/i));
    
    // Shows sign up form
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    
    // Click to switch back to sign in
    await userEvent.click(screen.getByText(/already have an account\? sign in/i));
    
    // Shows sign in form again
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  describe('Sign In', () => {
    it('handles successful sign in', async () => {
      const mockSignIn = jest.spyOn(auth, 'signInWithEmailAndPassword')
        .mockResolvedValueOnce({} as any);

      render(<AuthModal {...defaultProps} />);
      
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
        expect(toast.success).toHaveBeenCalledWith('Successfully logged in!');
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('handles sign in errors', async () => {
      const mockError = new Error('Invalid email or password');
      jest.spyOn(auth, 'signInWithEmailAndPassword')
        .mockRejectedValueOnce(mockError);

      render(<AuthModal {...defaultProps} />);
      
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(mockError.message);
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('Sign Up', () => {
    beforeEach(async () => {
      render(<AuthModal {...defaultProps} />);
      await userEvent.click(screen.getByText(/don't have an account\? sign up/i));
    });

    it('handles successful sign up', async () => {
      const mockCreateUser = jest.spyOn(auth, 'createUserWithEmailAndPassword')
        .mockResolvedValueOnce({
          user: { uid: 'test-uid', email: 'test@example.com' }
        } as any);

      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByLabelText(/client/i));
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
        expect(toast.success).toHaveBeenCalledWith('Successfully registered!');
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('validates required fields', async () => {
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByLabelText(/name/i)).toBeInvalid();
      expect(screen.getByLabelText(/email/i)).toBeInvalid();
      expect(screen.getByLabelText(/password/i)).toBeInvalid();
    });

    it('handles sign up errors', async () => {
      const mockError = new Error('Email already in use');
      jest.spyOn(auth, 'createUserWithEmailAndPassword')
        .mockRejectedValueOnce(mockError);

      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByLabelText(/client/i));
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(mockError.message);
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('Google Sign In', () => {
    it('handles successful Google sign in', async () => {
      const mockGoogleSignIn = jest.spyOn(auth, 'signInWithPopup')
        .mockResolvedValueOnce({
          user: { uid: 'google-uid', email: 'google@example.com' }
        } as any);

      render(<AuthModal {...defaultProps} />);
      
      await userEvent.click(screen.getByRole('button', { name: /continue with google/i }));

      await waitFor(() => {
        expect(mockGoogleSignIn).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Successfully signed in with Google!');
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('handles Google sign in errors', async () => {
      const mockError = new Error('Google sign in failed');
      jest.spyOn(auth, 'signInWithPopup')
        .mockRejectedValueOnce(mockError);

      render(<AuthModal {...defaultProps} />);
      
      await userEvent.click(screen.getByRole('button', { name: /continue with google/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(mockError.message);
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });
  });
});
