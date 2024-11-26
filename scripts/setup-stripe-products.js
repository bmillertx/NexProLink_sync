require('dotenv').config({ path: './frontend/.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createProducts() {
  try {
    // 1. Create Expert Premium Subscription
    const expertPremium = await stripe.products.create({
      name: 'Expert Premium Plan',
      description: 'Premium subscription for experts with unlimited consultations and advanced tools',
      metadata: {
        userType: 'expert',
        tier: 'premium',
        features: JSON.stringify([
          'Unlimited consultations',
          'Advanced tools',
          '85% commission rate',
          'Priority support'
        ])
      }
    });

    await stripe.prices.create({
      product: expertPremium.id,
      unit_amount: 5000, // $50.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        platformFee: '15'
      }
    });

    // 2. Create Client Premium Subscription
    const clientPremium = await stripe.products.create({
      name: 'Client Premium Access',
      description: 'Premium access for clients with enhanced search and priority booking',
      metadata: {
        userType: 'client',
        tier: 'premium',
        features: JSON.stringify([
          'Enhanced search capabilities',
          'Priority booking',
          'Consultation analytics',
          'Premium support'
        ])
      }
    });

    await stripe.prices.create({
      product: clientPremium.id,
      unit_amount: 2000, // $20.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      }
    });

    // 3. Create Expert Basic Plan (One-time setup fee)
    const expertBasic = await stripe.products.create({
      name: 'Expert Basic Plan',
      description: 'One-time setup fee for basic expert profile listing',
      metadata: {
        userType: 'expert',
        tier: 'basic',
        features: JSON.stringify([
          'Basic profile listing',
          '80% commission rate',
          'Standard support'
        ])
      }
    });

    await stripe.prices.create({
      product: expertBasic.id,
      unit_amount: 10000, // $100.00
      currency: 'usd'
    });

    // 4. Create Free Client Basic Plan (No price needed)
    const clientBasic = await stripe.products.create({
      name: 'Client Basic Plan',
      description: 'Free basic access for clients',
      metadata: {
        userType: 'client',
        tier: 'basic',
        features: JSON.stringify([
          'Basic search',
          'Standard booking',
          'Basic features'
        ])
      }
    });

    // 5. Create Consultation Service Product
    const consultation = await stripe.products.create({
      name: '1:1 Consultation Session',
      description: 'Individual consultation session with an expert',
      metadata: {
        productType: 'consultation',
        sessionType: '1-1'
      }
    });

    // 6. Create Event Consultation Product
    const event = await stripe.products.create({
      name: 'Event Consultation',
      description: 'Group consultation session or event',
      metadata: {
        productType: 'event',
        sessionType: 'group'
      }
    });

    console.log('Successfully created all products and prices!');
  } catch (error) {
    console.error('Error creating products:', error);
  }
}

createProducts();
