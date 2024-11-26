import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStripePayments } from '@stripe/firestore-stripe-payments';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '@/lib/firebase';

const app = getApp();
const auth = getAuth(app);
const functions = getFunctions(app);

// Initialize Stripe payments
const payments = getStripePayments(app, {
  productsCollection: 'products',
  customersCollection: 'customers',
});

export interface SubscriptionStatus {
  isActive: boolean;
  isTrialing: boolean;
  isCanceled: boolean;
  willCancel: boolean;
}

class PaymentsClient {
  async createCheckoutSession(priceId: string) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be logged in');

    const createCheckoutSession = httpsCallable(
      functions,
      'ext-firestore-stripe-payments-createCheckoutSession'
    );

    const { data } = await createCheckoutSession({
      price: priceId,
      success_url: window.location.origin + '/dashboard',
      cancel_url: window.location.origin + '/pricing',
    });

    if ((data as any).url) {
      window.location.assign((data as any).url);
    }
  }

  async createCustomerPortalSession() {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be logged in');

    const createPortalLink = httpsCallable(
      functions,
      'ext-firestore-stripe-payments-createPortalLink'
    );

    const { data } = await createPortalLink({
      returnUrl: window.location.origin + '/dashboard',
    });

    if ((data as any).url) {
      window.location.assign((data as any).url);
    }
  }

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    const subscriptionsRef = db
      .collection('customers')
      .doc(userId)
      .collection('subscriptions');

    const snapshot = await subscriptionsRef
      .where('status', 'in', ['trialing', 'active', 'canceled'])
      .get();

    if (snapshot.empty) {
      return {
        isActive: false,
        isTrialing: false,
        isCanceled: false,
        willCancel: false,
      };
    }

    const subscription = snapshot.docs[0].data();
    return {
      isActive: subscription.status === 'active',
      isTrialing: subscription.status === 'trialing',
      isCanceled: subscription.status === 'canceled',
      willCancel: subscription.cancel_at_period_end || false,
    };
  }

  async getUserRole(userId: string): Promise<string | null> {
    try {
      // Force refresh the token to get the latest custom claims
      await auth.currentUser?.getIdToken(true);
      const decodedToken = await auth.currentUser?.getIdTokenResult();
      return decodedToken?.claims.stripeRole || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }
}

export const paymentsClient = new PaymentsClient();
