import Stripe from 'stripe';
import { Stripe as StripeClient, loadStripe } from '@stripe/stripe-js';
import { getApp } from 'firebase/app';
import { getStripePayments } from '@stripe/firestore-stripe-payments';

let stripePromise: Promise<StripeClient | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Initialize Stripe payments
const app = getApp();
export const payments = getStripePayments(app, {
  productsCollection: 'products',
  customersCollection: 'customers',
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
});

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
  typescript: true,
});
