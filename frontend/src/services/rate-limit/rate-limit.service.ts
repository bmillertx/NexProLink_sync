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

    // Authentication rules
    this.setRule('auth', {
      maxRequests: 5,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'Too many authentication attempts. Please try again later.',
    });

    // General API rules
    this.setRule('api', {
      maxRequests: 50,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'API rate limit exceeded. Please try again later.',
    });

    // Expert profile rules
    this.setRule('expert-profile-update', {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'Too many profile updates. Please try again later.',
    });

    // Consultation booking rules
    this.setRule('consultation-booking', {
      maxRequests: 3,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'Too many booking attempts. Please wait before trying again.',
    });

    // Expert search rules
    this.setRule('expert-search', {
      maxRequests: 20,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'Search rate limit exceeded. Please try again later.',
    });

    // Expert availability update rules
    this.setRule('availability-update', {
      maxRequests: 15,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'Too many availability updates. Please try again later.',
    });

    // Payment operation rules
    this.setRule('payment', {
      maxRequests: 5,
      windowMs: 60 * 1000, // 1 minute
      errorMessage: 'Too many payment attempts. Please try again later.',
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

  /**
   * Check rate limit with custom error handling
   */
  async checkRateLimitWithError(
    key: string,
    ruleKey: string = 'default'
  ): Promise<void> {
    const allowed = await this.checkRateLimit(key, ruleKey);
    if (!allowed) {
      const rule = this.rules.get(ruleKey);
      throw new Error(rule?.errorMessage || 'Rate limit exceeded');
    }
  }

  /**
   * Get remaining requests for a key
   */
  getRemainingRequests(key: string, ruleKey: string = 'default'): number {
    const rule = this.rules.get(ruleKey);
    if (!rule) return 0;

    const now = Date.now();
    const limitKey = `${ruleKey}:${key}`;
    const entry = this.limits.get(limitKey);

    if (!entry || now >= entry.resetTime) {
      return rule.maxRequests;
    }

    return Math.max(0, rule.maxRequests - entry.count);
  }

  /**
   * Get time until reset for a key
   */
  getTimeUntilReset(key: string, ruleKey: string = 'default'): number {
    const limitKey = `${ruleKey}:${key}`;
    const entry = this.limits.get(limitKey);

    if (!entry) return 0;

    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  /**
   * Clear rate limit for a key
   */
  clearLimit(key: string, ruleKey: string = 'default'): void {
    const limitKey = `${ruleKey}:${key}`;
    this.limits.delete(limitKey);
  }
}

export const rateLimitService = RateLimitService.getInstance();
