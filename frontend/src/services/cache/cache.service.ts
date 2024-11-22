import { performanceService } from '../monitoring/performance.service';

interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
}

interface CacheItem<T> {
  value: T;
  timestamp: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private defaultOptions: CacheOptions = {
    ttl: 5 * 60 * 1000, // 5 minutes default TTL
    maxSize: 1000, // Default max cache size
  };

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, options: Partial<CacheOptions> = {}): void {
    const { ttl, maxSize } = { ...this.defaultOptions, ...options };

    // Check cache size limit
    if (maxSize && this.cache.size >= maxSize) {
      const oldestKey = this.findOldestKey();
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;

    // Check if item has expired
    if (this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Get or set cache value with a factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: Partial<CacheOptions> = {}
  ): Promise<T> {
    const cachedValue = this.get<T>(key);
    if (cachedValue !== null) return cachedValue;

    return performanceService.monitorFunction(
      `cache_miss_${key}`,
      async () => {
        const value = await factory();
        this.set(key, value, options);
        return value;
      }
    );
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove a specific key from the cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(this.cache.get(key)!);
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if a cache item has expired
   */
  private isExpired(item: CacheItem<any>): boolean {
    const { ttl } = this.defaultOptions;
    return Date.now() - item.timestamp > ttl;
  }

  /**
   * Find the oldest key in the cache
   */
  private findOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }
}

export const cacheService = CacheService.getInstance();
