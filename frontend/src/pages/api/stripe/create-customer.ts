import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, role } = req.body;

    // Verify the request is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    await auth.verifyIdToken(token);

    // Create or retrieve Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        firebaseUID: userId,
        role
      }
    });

    // Store customer ID in Firestore
    await db.collection('customers').doc(userId).set({
      stripeCustomerId: customer.id,
      email,
      role
    });

    // Set custom claims based on role
    await auth.setCustomUserClaims(userId, {
      stripeCustomerId: customer.id,
      role
    });

    return res.status(200).json({ customerId: customer.id });
  } catch (error: any) {
    console.error('Error creating Stripe customer:', error);
    return res.status(500).json({ error: error.message });
  }
}
