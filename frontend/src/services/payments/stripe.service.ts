import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '@/config/stripe-config';

class StripeService {
  private stripe: Promise<Stripe | null>;

  constructor() {
    this.stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }

  async createCheckoutSession(params: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const session = await response.json();

      if (!session || !session.id) {
        throw new Error('Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await this.stripe;
      if (!stripe) throw new Error('Stripe failed to initialize');

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Payment session creation failed:', error);
      throw error;
    }
  }

  async createConsultationPayment(params: {
    consultationId: string;
    amount: number;
    consultantId: string;
    duration: number;
  }) {
    try {
      const { amount, consultationId, consultantId, duration } = params;
      
      // Calculate platform fee
      const platformFee = amount * (STRIPE_CONFIG.PLATFORM_FEE_PERCENTAGE / 100);
      
      const response = await fetch('/api/create-consultation-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          platformFee,
          consultationId,
          consultantId,
          duration,
          currency: STRIPE_CONFIG.DEFAULT_CURRENCY,
        }),
      });

      const session = await response.json();
      
      if (!session || !session.id) {
        throw new Error('Failed to create payment session');
      }

      // Redirect to Stripe Checkout
      const stripe = await this.stripe;
      if (!stripe) throw new Error('Stripe failed to initialize');

      return stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      console.error('Consultation payment creation failed:', error);
      throw error;
    }
  }

  async createCustomerPortalSession(customerId: string) {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      const session = await response.json();
      
      if (!session || !session.url) {
        throw new Error('Failed to create customer portal session');
      }

      // Redirect to customer portal
      window.location.href = session.url;
    } catch (error) {
      console.error('Customer portal session creation failed:', error);
      throw error;
    }
  }

  calculateConsultationFees(baseAmount: number) {
    const platformFee = baseAmount * (STRIPE_CONFIG.PLATFORM_FEE_PERCENTAGE / 100);
    const stripeFee = (baseAmount * (STRIPE_CONFIG.STRIPE_FEE_PERCENTAGE / 100)) + STRIPE_CONFIG.STRIPE_FIXED_FEE;
    
    return {
      baseAmount,
      platformFee,
      stripeFee,
      totalAmount: baseAmount + stripeFee,
      consultantPayout: baseAmount - platformFee - stripeFee,
    };
  }
}

export const stripeService = new StripeService();
