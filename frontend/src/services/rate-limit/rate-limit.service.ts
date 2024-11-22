import { errorService } from '../error/error.service';

interface RateLimitRule {
  maxRequests: number;
  windowMs: number;
  errorMessage?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimitService {
  private static instance: RateLimitService;
  private limits: Map<string, RateLimitEntry>;
  private rules: Map<string, RateLimitRule>;

  private constructor() {
    this.limits = new Map();
    this.rules = new Map();

    // Set default rules
    this.setRule('default', {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'Too many requests. Please try again later.',
    });

    this.setRule('auth', {
      maxRequests: 5,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'Too many authentication attempts. Please try again later.',
    });

    this.setRule('api', {
      maxRequests: 50,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'API rate limit exceeded. Please try again later.',
    });
  }

  static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  /**
   * Set a rate limit rule
   */
  setRule(key: string, rule: RateLimitRule): void {
    this.rules.set(key, rule);
  }

  /**
   * Check if an operation should be rate limited
   */
  async checkRateLimit(
    key: string,
    ruleKey: string = 'default'
  ): Promise<boolean> {
    const rule = this.rules.get(ruleKey);
    if (!rule) {
      console.warn(`Rate limit rule '${ruleKey}' not found, using default`);
      return true;
    }

    const now = Date.now();
    const limitKey = `${ruleKey}:${key}`;
    const entry = this.limits.get(limitKey);

    if (!entry || now >= entry.resetTime) {
      // First request or window expired
      this.limits.set(limitKey, {
        count: 1,
        resetTime: now + rule.windowMs,
      });
      return true;
    }

    if (entry.count >= rule.maxRequests) {
      // Rate limit exceeded
      const error = new Error(
        rule.errorMessage || 'Rate limit exceeded'
      );
      errorService.handleError(error, {
        type: 'rate_limit',
        rule: ruleKey,
        key: key,
      });
      return false;
    }

    // Increment counter
    entry.count++;
    return true;
  }

  /**
   * Wrap an async function with rate limiting
   */
  async withRateLimit<T>(
    key: string,
    ruleKey: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const canProceed = await this.checkRateLimit(key, ruleKey);
    if (!canProceed) {
      const rule = this.rules.get(ruleKey);
      throw new Error(
        rule?.errorMessage || 'Rate limit exceeded'
      );
    }
    return fn();
  }

  /**
   * Reset rate limit for a specific key
   */
  resetLimit(key: string, ruleKey: string = 'default'): void {
    const limitKey = `${ruleKey}:${key}`;
    this.limits.delete(limitKey);
  }

  /**
   * Get current rate limit status
   */
  getLimitStatus(
    key: string,
    ruleKey: string = 'default'
  ): { remaining: number; resetTime: number } | null {
    const rule = this.rules.get(ruleKey);
    if (!rule) return null;

    const limitKey = `${ruleKey}:${key}`;
    const entry = this.limits.get(limitKey);
    if (!entry) {
      return {
        remaining: rule.maxRequests,
        resetTime: Date.now() + rule.windowMs,
      };
    }

    return {
      remaining: Math.max(0, rule.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }

  /**
   * Clear all rate limits
   */
  clearAllLimits(): void {
    this.limits.clear();
  }
}

export const rateLimitService = RateLimitService.getInstance();
