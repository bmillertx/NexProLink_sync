import { stripe } from '@/lib/stripe';
import { productService } from './product.service';

export interface PaymentSession {
  id: string;
  url: string;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  sessionId?: string;
}

class PaymentService {
  async createConsultationSession(
    priceId: string,
    clientId: string,
    expertId: string,
    metadata: {
      consultationType: '1-1' | 'group';
      sessionDuration?: number;
      eventId?: string;
    }
  ): Promise<PaymentSession> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/consultations/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/consultations/cancel`,
        customer_email: undefined, // Will be set by Stripe based on clientId
        client_reference_id: clientId,
        payment_intent_data: {
          application_fee_amount: await this.calculateApplicationFee(priceId),
          transfer_data: {
            destination: expertId,
          },
          metadata: {
            clientId,
            expertId,
            consultationType: metadata.consultationType,
            sessionDuration: metadata.sessionDuration?.toString(),
            eventId: metadata.eventId,
          },
        },
      });

      return {
        id: session.id,
        url: session.url!,
      };
    } catch (error: any) {
      console.error('Error creating consultation session:', error);
      throw new Error(error.message);
    }
  }

  async createSubscriptionSession(
    priceId: string,
    userId: string,
    userType: 'expert' | 'client'
  ): Promise<PaymentSession> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`,
        customer_email: undefined, // Will be set by Stripe based on userId
        client_reference_id: userId,
        subscription_data: {
          metadata: {
            userId,
            userType,
          },
          application_fee_percent: 15, // 15% platform fee
        },
      });

      return {
        id: session.id,
        url: session.url!,
      };
    } catch (error: any) {
      console.error('Error creating subscription session:', error);
      throw new Error(error.message);
    }
  }

  async createEventSession(
    priceId: string,
    clientId: string,
    expertId: string,
    eventId: string
  ): Promise<PaymentSession> {
    return this.createConsultationSession(priceId, clientId, expertId, {
      consultationType: 'group',
      eventId,
    });
  }

  private async calculateApplicationFee(priceId: string): Promise<number> {
    const price = await stripe.prices.retrieve(priceId);
    return productService.calculatePlatformFee(price.unit_amount!);
  }

  async getSessionStatus(sessionId: string): Promise<PaymentResult> {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      return {
        success: session.payment_status === 'paid',
        sessionId: session.id,
      };
    } catch (error: any) {
      console.error('Error retrieving session status:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Verify the subscription belongs to the user
      if (subscription.metadata.userId !== userId) {
        throw new Error('Unauthorized subscription cancellation');
      }

      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      return true;
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  async getCustomerPortalSession(customerId: string): Promise<string> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return session.url;
  }
}

export const paymentService = new PaymentService();
