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

class ErrorService {
  private static instance: ErrorService;

  private constructor() {}

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  /**
   * Handle and log application errors
   */
  handleError(error: Error | unknown, metadata?: Record<string, any>): void {
    const errorDetails = this.parseError(error);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', errorDetails);
    }

    // Log to Firebase Analytics
    this.logToAnalytics(errorDetails, metadata);

    // You can add more error reporting services here (e.g., Sentry, LogRocket)
  }

  /**
   * Parse different types of errors into a standardized format
   */
  private parseError(error: Error | unknown): ErrorDetails {
    if (error instanceof Error) {
      return {
        message: error.message,
        timestamp: new Date(),
        metadata: {
          stack: error.stack,
          name: error.name
        }
      };
    }

    // Handle Firebase Auth errors
    if (typeof error === 'object' && error !== null && 'code' in error) {
      return {
        code: (error as { code: string }).code,
        message: (error as { message: string }).message,
        timestamp: new Date()
      };
    }

    // Handle unknown error types
    return {
      message: String(error),
      timestamp: new Date()
    };
  }

  /**
   * Log error to Firebase Analytics
   */
  private logToAnalytics(errorDetails: ErrorDetails, metadata?: Record<string, any>): void {
    if (typeof window !== 'undefined' && analytics) {
      logEvent(analytics, 'error', {
        error_code: errorDetails.code || 'unknown',
        error_message: errorDetails.message,
        error_timestamp: errorDetails.timestamp.toISOString(),
        ...metadata
      });
    }
  }

  /**
   * Format user-friendly error messages
   */
  formatErrorMessage(error: Error | unknown): string {
    const errorDetails = this.parseError(error);
    
    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Please choose a stronger password.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'permission-denied': 'You don\'t have permission to perform this action.',
      'not-found': 'The requested resource was not found.',
    };

    if (errorDetails.code && errorDetails.code in errorMessages) {
      return errorMessages[errorDetails.code];
    }

    // Return a generic message if no specific mapping exists
    return 'An unexpected error occurred. Please try again later.';
  }
}

export const errorService = ErrorService.getInstance();
