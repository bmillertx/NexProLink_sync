import { analytics } from '@/config/firebase';
import { logEvent } from 'firebase/analytics';

export interface ErrorDetails {
  code?: string;
  message: string;
  timestamp: Date;
  userId?: string;
  path?: string;
  metadata?: Record<string, any>;
}

export class ErrorService {
  private static instance: ErrorService;

  private constructor() {}

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  parseError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      // Check if it's a Firebase Auth error
      const firebaseError = error as any;
      if (firebaseError.code) {
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            return 'This email is already registered. Please try signing in instead.';
          case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
          case 'auth/invalid-email':
            return 'Please enter a valid email address.';
          case 'auth/user-not-found':
            return 'No account found with this email. Please check your email or sign up.';
          case 'auth/wrong-password':
            return 'Incorrect password. Please try again or reset your password.';
          case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
          case 'auth/popup-blocked':
            return 'Sign-in popup was blocked. Please enable popups for this site and try again.';
          case 'auth/cancelled-popup-request':
            return 'Only one sign-in popup can be open at a time. Please try again.';
          case 'permission-denied':
            return 'You do not have permission to perform this action.';
          default:
            return firebaseError.message || 'An unexpected error occurred.';
        }
      }
      return error.message;
    }

    if (error?.code) {
      return this.parseError(new Error(error.message || 'An unexpected error occurred'));
    }

    return 'An unexpected error occurred. Please try again.';
  }

  handleError(error: any, context?: { [key: string]: any }): never {
    const errorMessage = this.parseError(error);
    console.error('Error:', { message: errorMessage, context, error });

    // Log to Firebase Analytics
    this.logToAnalytics(errorMessage, context);

    // Throw a new error with the parsed message
    throw new Error(errorMessage);
  }

  formatErrorMessage(error: any): string {
    return this.parseError(error);
  }

  private logToAnalytics(errorMessage: string, context?: { [key: string]: any }): void {
    if (typeof window !== 'undefined' && analytics) {
      logEvent(analytics, 'error', {
        error_message: errorMessage,
        error_timestamp: new Date().toISOString(),
        ...context
      });
    }
  }
}

export const errorService = ErrorService.getInstance();
