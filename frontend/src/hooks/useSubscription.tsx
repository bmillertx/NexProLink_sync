import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { subscriptionService, Subscription, ConsultationCredit } from '@/services/subscription/subscription.service';
import { STRIPE_CONFIG } from '@/config/stripe-config';

interface SubscriptionHook {
  subscription: Subscription | null;
  credits: ConsultationCredit | null;
  loading: boolean;
  error: string | null;
  canScheduleConsultation: boolean;
  isSubscriptionActive: boolean;
  currentPlan: typeof STRIPE_CONFIG.SUBSCRIPTION_TIERS[keyof typeof STRIPE_CONFIG.SUBSCRIPTION_TIERS] | null;
  refreshSubscription: () => Promise<void>;
  useCredit: () => Promise<void>;
}

export function useSubscription(): SubscriptionHook {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [credits, setCredits] = useState<ConsultationCredit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = async () => {
    if (!user) {
      setSubscription(null);
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [sub, creds] = await Promise.all([
        subscriptionService.getCurrentSubscription(user.uid),
        subscriptionService.getConsultationCredits(user.uid)
      ]);

      setSubscription(sub);
      setCredits(creds);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [user]);

  const isSubscriptionActive = subscription?.status === 'active';

  const canScheduleConsultation = Boolean(
    isSubscriptionActive &&
    credits?.remaining &&
    credits.remaining > 0 &&
    credits.resetDate > Date.now()
  );

  const currentPlan = subscription?.planId
    ? Object.values(STRIPE_CONFIG.SUBSCRIPTION_TIERS).find(
        plan => plan.id === subscription.planId
      ) || null
    : null;

  const refreshSubscription = async () => {
    await fetchSubscriptionData();
  };

  const useCredit = async () => {
    if (!user) throw new Error('User not authenticated');
    if (!canScheduleConsultation) throw new Error('Cannot schedule consultation');

    try {
      setError(null);
      const updatedCredits = await subscriptionService.useConsultationCredit(user.uid);
      setCredits(updatedCredits);
    } catch (error) {
      console.error('Error using consultation credit:', error);
      setError('Failed to use consultation credit');
      throw error;
    }
  };

  return {
    subscription,
    credits,
    loading,
    error,
    canScheduleConsultation,
    isSubscriptionActive,
    currentPlan,
    refreshSubscription,
    useCredit
  };
}
