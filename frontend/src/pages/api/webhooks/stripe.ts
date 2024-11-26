import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';
import { subscriptionService } from '@/services/subscription/subscription.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.metadata.firebaseUID || null;
  } catch (error) {
    console.error('Error retrieving customer:', error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    const { type, data } = event;

    switch (type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = data.object as Stripe.Subscription;
        const userId = await getUserIdFromCustomer(subscription.customer as string);
        
        if (userId) {
          await subscriptionService.handleSubscriptionUpdated(userId, subscription);
          
          // Update user's custom claims
          const isActive = subscription.status === 'active';
          await db.collection('users').doc(userId).update({
            'customClaims.hasActiveSubscription': isActive,
            'customClaims.subscriptionTier': subscription.items.data[0].price.id,
            updatedAt: new Date().toISOString()
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = data.object as Stripe.Subscription;
        const userId = await getUserIdFromCustomer(subscription.customer as string);
        
        if (userId) {
          await subscriptionService.handleSubscriptionDeleted(userId);
          
          // Remove subscription claims
          await db.collection('users').doc(userId).update({
            'customClaims.hasActiveSubscription': false,
            'customClaims.subscriptionTier': null,
            updatedAt: new Date().toISOString()
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = data.object as Stripe.Invoice;
        const userId = await getUserIdFromCustomer(invoice.customer as string);
        
        if (userId && invoice.subscription) {
          // Reset consultation credits on successful payment
          await subscriptionService.resetCredits(userId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = data.object as Stripe.Invoice;
        const userId = await getUserIdFromCustomer(invoice.customer as string);
        
        if (userId) {
          await db.collection('users').doc(userId).update({
            'customClaims.hasActiveSubscription': false,
            updatedAt: new Date().toISOString()
          });
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
