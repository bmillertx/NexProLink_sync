# NexProLink Stripe Pricing Implementation Guide

## Overview
This guide outlines the implementation of NexProLink's pricing structure using Stripe. The platform takes a 15% fee from all transactions, with experts having the flexibility to set their own rates.

## Product Structure

### 1. Core Products

#### 1.1 1:1 Video Consultations
```typescript
{
  type: 'service',
  name: '1:1 Consultation Session',
  metadata: {
    productType: 'consultation',
    sessionType: '1-1'
  },
  prices: {
    type: 'custom',
    currency: 'usd',
    platformFee: 0.15 // 15%
  }
}
```

#### 1.2 Event-Based Consultations
```typescript
{
  type: 'service',
  name: 'Event Consultation',
  metadata: {
    productType: 'event',
    sessionType: 'group'
  },
  prices: {
    type: 'custom',
    currency: 'usd',
    platformFee: 0.15 // 15%
  }
}
```

### 2. Premium Subscriptions

#### 2.1 Expert Premium Plan
```typescript
{
  type: 'subscription',
  name: 'Expert Premium Plan',
  metadata: {
    userType: 'expert',
    tier: 'premium'
  },
  prices: {
    type: 'fixed',
    amount: 5000, // $50.00
    currency: 'usd',
    interval: 'month',
    platformFee: 0.15
  }
}
```

#### 2.2 Client Premium Access
```typescript
{
  type: 'subscription',
  name: 'Client Premium Access',
  metadata: {
    userType: 'client',
    tier: 'premium'
  },
  prices: {
    type: 'fixed',
    amount: 2000, // $20.00
    currency: 'usd',
    interval: 'month',
    platformFee: 0.15
  }
}
```

## Implementation Steps

### 1. Stripe Product Creation
```javascript
// Create base products
const products = [
  {
    name: '1:1 Consultation Session',
    type: 'service',
    metadata: {
      productType: 'consultation',
      sessionType: '1-1'
    }
  },
  {
    name: 'Event Consultation',
    type: 'service',
    metadata: {
      productType: 'event',
      sessionType: 'group'
    }
  },
  {
    name: 'Expert Premium Plan',
    type: 'subscription',
    metadata: {
      userType: 'expert',
      tier: 'premium'
    }
  },
  {
    name: 'Client Premium Access',
    type: 'subscription',
    metadata: {
      userType: 'client',
      tier: 'premium'
    }
  }
];
```

### 2. Price Configuration
```javascript
// Example price creation for Expert Premium Plan
const price = await stripe.prices.create({
  product: 'prod_expert_premium',
  unit_amount: 5000, // $50.00
  currency: 'usd',
  recurring: {
    interval: 'month'
  },
  metadata: {
    platformFee: '15'
  }
});
```

### 3. Platform Fee Implementation
```typescript
interface TransactionFee {
  baseAmount: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  expertReceives: number;
}

function calculateFees(amount: number): TransactionFee {
  const platformFeePercent = 0.15;
  const platformFeeAmount = Math.round(amount * platformFeePercent);
  
  return {
    baseAmount: amount,
    platformFeePercent: platformFeePercent,
    platformFeeAmount: platformFeeAmount,
    expertReceives: amount - platformFeeAmount
  };
}
```

## Stripe Connect Integration

### 1. Expert Onboarding
```typescript
interface ExpertAccount {
  stripeAccountId: string;
  defaultCurrency: string;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  platformFeePercent: number;
}

async function onboardExpert(userId: string): Promise<ExpertAccount> {
  const account = await stripe.accounts.create({
    type: 'express',
    metadata: { userId },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    }
  });

  return {
    stripeAccountId: account.id,
    defaultCurrency: 'usd',
    payoutSchedule: 'weekly',
    platformFeePercent: 0.15
  };
}
```

### 2. Payment Flow
```typescript
async function processConsultationPayment(
  amount: number,
  expertId: string,
  clientId: string
): Promise<PaymentResult> {
  const fees = calculateFees(amount);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    application_fee_amount: fees.platformFeeAmount,
    transfer_data: {
      destination: expertId
    },
    metadata: {
      clientId,
      expertId,
      consultationType: '1-1'
    }
  });

  return {
    paymentIntentId: paymentIntent.id,
    ...fees
  };
}
```

## Security Considerations

1. **API Keys**:
   - Use restricted API keys
   - Rotate keys regularly
   - Never expose keys in client-side code

2. **Webhooks**:
   - Verify webhook signatures
   - Handle idempotency
   - Implement proper error handling

3. **User Data**:
   - Encrypt sensitive information
   - Follow PCI compliance guidelines
   - Implement proper access controls

## Testing

1. **Test Accounts**:
   ```typescript
   const TEST_ACCOUNTS = {
     success: 'tok_visa',
     decline: 'tok_chargeDeclined',
     insufficientFunds: 'tok_chargeCustomerFail'
   };
   ```

2. **Test Scenarios**:
   - Successful payments
   - Failed payments
   - Subscription creation/cancellation
   - Platform fee calculations
   - Expert payouts

## Monitoring

1. **Metrics to Track**:
   - Transaction success rate
   - Platform fee collection
   - Expert payout status
   - Subscription churn rate

2. **Alerts**:
   - Failed payments
   - Webhook failures
   - Unusual activity
   - System errors

## Support Documentation

1. **For Experts**:
   - How to set prices
   - Payment schedule
   - Platform fee explanation
   - Tax considerations

2. **For Clients**:
   - Payment methods
   - Refund policy
   - Subscription management
   - Premium benefits
