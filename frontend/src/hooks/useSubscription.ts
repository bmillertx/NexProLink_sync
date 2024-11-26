import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { paymentsClient, SubscriptionStatus } from '@/services/stripe/payments-client';

export interface SubscriptionState {
  status: SubscriptionStatus;
  role: string | null;
  loading: boolean;
  error: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    status: {
      isActive: false,
      isTrialing: false,
      isCanceled: false,
      willCancel: false,
    },
    role: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      if (!user) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
        }));
        return;
      }

      try {
        const [status, role] = await Promise.all([
          paymentsClient.getSubscriptionStatus(user.uid),
          paymentsClient.getUserRole(user.uid),
        ]);

        setState({
          status,
          role,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error('Error fetching subscription status:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to load subscription status',
        }));
      }
    }

    fetchSubscriptionStatus();
  }, [user]);

  const hasAccess = state.status.isActive || state.status.isTrialing;
  const isExpert = state.role === 'expert';
  const isPremium = state.role === 'premium';

  return {
    ...state,
    hasAccess,
    isExpert,
    isPremium,
    createCheckoutSession: paymentsClient.createCheckoutSession,
    createCustomerPortalSession: paymentsClient.createCustomerPortalSession,
  };
}
