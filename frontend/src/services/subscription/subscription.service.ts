import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { STRIPE_CONFIG } from '@/config/stripe-config';

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  planId: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ConsultationCredit {
  total: number;
  used: number;
  remaining: number;
  resetDate: number;
}

class SubscriptionService {
  private async getSubscriptionDoc(userId: string) {
    return doc(db, 'subscriptions', userId);
  }

  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    try {
      const subDoc = await getDoc(await this.getSubscriptionDoc(userId));
      return subDoc.exists() ? subDoc.data() as Subscription : null;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw new Error('Failed to fetch subscription');
    }
  }

  async updateSubscription(userId: string, subscription: Partial<Subscription>) {
    try {
      const subDoc = await this.getSubscriptionDoc(userId);
      await updateDoc(subDoc, {
        ...subscription,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  async getConsultationCredits(userId: string): Promise<ConsultationCredit> {
    try {
      const creditsDoc = await getDoc(doc(db, 'consultationCredits', userId));
      if (!creditsDoc.exists()) {
        // Initialize credits if they don't exist
        const subscription = await this.getCurrentSubscription(userId);
        if (!subscription) throw new Error('No active subscription found');

        const credits = this.getDefaultCredits(subscription.planId);
        await this.initializeCredits(userId, credits);
        return credits;
      }
      return creditsDoc.data() as ConsultationCredit;
    } catch (error) {
      console.error('Error fetching consultation credits:', error);
      throw new Error('Failed to fetch consultation credits');
    }
  }

  private getDefaultCredits(planId: string): ConsultationCredit {
    const now = Date.now();
    const resetDate = new Date();
    resetDate.setMonth(resetDate.getMonth() + 1);
    resetDate.setDate(1);
    resetDate.setHours(0, 0, 0, 0);

    let total = 0;
    switch (planId) {
      case STRIPE_CONFIG.SUBSCRIPTION_TIERS.BASIC.id:
        total = 5;
        break;
      case STRIPE_CONFIG.SUBSCRIPTION_TIERS.PROFESSIONAL.id:
        total = 20;
        break;
      case STRIPE_CONFIG.SUBSCRIPTION_TIERS.ENTERPRISE.id:
        total = 999999; // Unlimited
        break;
      default:
        total = 0;
    }

    return {
      total,
      used: 0,
      remaining: total,
      resetDate: resetDate.getTime()
    };
  }

  private async initializeCredits(userId: string, credits: ConsultationCredit) {
    try {
      await setDoc(doc(db, 'consultationCredits', userId), credits);
    } catch (error) {
      console.error('Error initializing consultation credits:', error);
      throw new Error('Failed to initialize consultation credits');
    }
  }

  async useConsultationCredit(userId: string): Promise<ConsultationCredit> {
    try {
      const credits = await this.getConsultationCredits(userId);
      if (credits.remaining <= 0) {
        throw new Error('No consultation credits remaining');
      }

      const updatedCredits: ConsultationCredit = {
        ...credits,
        used: credits.used + 1,
        remaining: credits.remaining - 1
      };

      await updateDoc(doc(db, 'consultationCredits', userId), updatedCredits);
      return updatedCredits;
    } catch (error) {
      console.error('Error using consultation credit:', error);
      throw new Error('Failed to use consultation credit');
    }
  }

  async resetCredits(userId: string): Promise<ConsultationCredit> {
    try {
      const subscription = await this.getCurrentSubscription(userId);
      if (!subscription) throw new Error('No active subscription found');

      const credits = this.getDefaultCredits(subscription.planId);
      await this.initializeCredits(userId, credits);
      return credits;
    } catch (error) {
      console.error('Error resetting consultation credits:', error);
      throw new Error('Failed to reset consultation credits');
    }
  }

  // Webhook handlers
  async handleSubscriptionUpdated(
    userId: string,
    stripeSubscription: any
  ): Promise<void> {
    try {
      const subscription: Subscription = {
        id: stripeSubscription.id,
        status: stripeSubscription.status,
        planId: stripeSubscription.items.data[0].price.id,
        currentPeriodEnd: stripeSubscription.current_period_end * 1000,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        createdAt: stripeSubscription.created * 1000,
        updatedAt: Date.now()
      };

      await setDoc(await this.getSubscriptionDoc(userId), subscription);

      // Reset credits if subscription is reactivated
      if (subscription.status === 'active') {
        await this.resetCredits(userId);
      }
    } catch (error) {
      console.error('Error handling subscription update:', error);
      throw new Error('Failed to handle subscription update');
    }
  }

  async handleSubscriptionDeleted(userId: string): Promise<void> {
    try {
      await updateDoc(await this.getSubscriptionDoc(userId), {
        status: 'canceled',
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error handling subscription deletion:', error);
      throw new Error('Failed to handle subscription deletion');
    }
  }
}

export const subscriptionService = new SubscriptionService();
