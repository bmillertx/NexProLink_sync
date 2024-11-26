import { stripe } from '@/lib/stripe';
import { STRIPE_CONFIG } from '@/config/stripe-config';

export interface ProductPrice {
  id: string;
  amount: number;
  currency: string;
  interval?: 'day' | 'week' | 'month' | 'year';
  type: 'one_time' | 'recurring';
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  metadata: {
    productType: 'consultation' | 'event' | 'subscription';
    sessionType?: '1-1' | 'group';
    userType?: 'expert' | 'client';
    tier?: 'premium';
  };
  prices: ProductPrice[];
}

class ProductService {
  private async createBaseProducts() {
    const products = [
      {
        name: '1:1 Consultation Session',
        metadata: {
          productType: 'consultation',
          sessionType: '1-1'
        }
      },
      {
        name: 'Event Consultation',
        metadata: {
          productType: 'event',
          sessionType: 'group'
        }
      },
      {
        name: 'Expert Premium Plan',
        metadata: {
          productType: 'subscription',
          userType: 'expert',
          tier: 'premium'
        }
      },
      {
        name: 'Client Premium Access',
        metadata: {
          productType: 'subscription',
          userType: 'client',
          tier: 'premium'
        }
      }
    ];

    for (const product of products) {
      await stripe.products.create({
        name: product.name,
        metadata: {
          ...product.metadata,
          platformFee: '15'
        }
      });
    }
  }

  async createExpertPrice(expertId: string, amount: number): Promise<string> {
    const product = await this.getOrCreateExpertProduct(expertId);
    
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'usd',
      metadata: {
        expertId,
        platformFee: '15'
      }
    });

    return price.id;
  }

  private async getOrCreateExpertProduct(expertId: string): Promise<any> {
    const products = await stripe.products.list({
      metadata: {
        expertId
      }
    });

    if (products.data.length > 0) {
      return products.data[0];
    }

    return stripe.products.create({
      name: 'Expert Consultation',
      metadata: {
        expertId,
        productType: 'consultation',
        sessionType: '1-1',
        platformFee: '15'
      }
    });
  }

  async createEventPrice(
    expertId: string,
    amount: number,
    eventDetails: {
      name: string;
      description?: string;
      maxParticipants?: number;
    }
  ): Promise<string> {
    const product = await stripe.products.create({
      name: eventDetails.name,
      description: eventDetails.description,
      metadata: {
        expertId,
        productType: 'event',
        sessionType: 'group',
        maxParticipants: eventDetails.maxParticipants?.toString(),
        platformFee: '15'
      }
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'usd',
      metadata: {
        expertId,
        platformFee: '15'
      }
    });

    return price.id;
  }

  async getExpertPrices(expertId: string): Promise<ProductPrice[]> {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
      active: true
    });

    return prices.data
      .filter(price => {
        const product = price.product as any;
        return product.metadata.expertId === expertId;
      })
      .map(price => ({
        id: price.id,
        amount: price.unit_amount!,
        currency: price.currency,
        type: price.type
      }));
  }

  async getSubscriptionProducts(): Promise<Product[]> {
    const products = await stripe.products.list({
      active: true,
      metadata: {
        productType: 'subscription'
      }
    });

    const productsWithPrices = await Promise.all(
      products.data.map(async product => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true
        });

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          metadata: product.metadata as Product['metadata'],
          prices: prices.data.map(price => ({
            id: price.id,
            amount: price.unit_amount!,
            currency: price.currency,
            interval: price.recurring?.interval,
            type: price.type
          }))
        };
      })
    );

    return productsWithPrices;
  }

  async calculatePlatformFee(amount: number): Promise<number> {
    return Math.round(amount * 0.15); // 15% platform fee
  }
}

export const productService = new ProductService();
