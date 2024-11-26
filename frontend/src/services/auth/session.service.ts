import { auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import Cookies from 'js-cookie';

class SessionService {
  private readonly SESSION_COOKIE_NAME = 'session';
  private readonly SESSION_DURATION = 60 * 60 * 24 * 5 * 1000; // 5 days

  async createSession(idToken: string): Promise<void> {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const { sessionCookie } = await response.json();
      
      // Set session cookie
      Cookies.set(this.SESSION_COOKIE_NAME, sessionCookie, {
        expires: new Date(Date.now() + this.SESSION_DURATION),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async refreshSession(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user signed in');
      }

      const idToken = await currentUser.getIdToken();
      await this.createSession(idToken);
    } catch (error) {
      console.error('Error refreshing session:', error);
      throw error;
    }
  }

  async validateSession(): Promise<boolean> {
    try {
      const sessionCookie = Cookies.get(this.SESSION_COOKIE_NAME);
      if (!sessionCookie) return false;

      const response = await fetch('/api/auth/validate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionCookie }),
      });

      if (!response.ok) {
        this.clearSession();
        return false;
      }

      const { customToken } = await response.json();
      if (customToken) {
        await signInWithCustomToken(auth, customToken);
      }

      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      this.clearSession();
      return false;
    }
  }

  clearSession(): void {
    Cookies.remove(this.SESSION_COOKIE_NAME);
  }
}

export const sessionService = new SessionService();
