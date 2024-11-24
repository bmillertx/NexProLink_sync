import { analytics } from '@/config/firebase';
import { logEvent } from 'firebase/analytics';
import { getPerformance, trace, PerformanceTrace } from 'firebase/performance';

interface PerformanceMetric {
  name: string;
  duration: number;
  metadata?: Record<string, any>;
}

class PerformanceService {
  private static instance: PerformanceService;
  private traces: Map<string, PerformanceTrace>;
  private isInitialized: boolean;

  private constructor() {
    this.traces = new Map();
    this.isInitialized = false;
    
    if (typeof window !== 'undefined') {
      try {
        // Initialize Firebase Performance Monitoring
        getPerformance();
        this.isInitialized = true;
      } catch (error) {
        console.warn('Performance monitoring initialization failed:', error);
      }
    }
  }

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  /**
   * Start measuring a performance trace
   */
  startTrace(traceName: string): void {
    if (!this.isInitialized) return;

    try {
      const newTrace = trace(traceName);
      newTrace.start();
      this.traces.set(traceName, newTrace);
    } catch (error) {
      console.warn(`Failed to start trace ${traceName}:`, error);
    }
  }

  /**
   * Stop measuring a performance trace and log results
   */
  stopTrace(traceName: string, metadata?: Record<string, any>): void {
    if (!this.isInitialized) return;

    try {
      const currentTrace = this.traces.get(traceName);
      if (currentTrace) {
        currentTrace.stop();
        const duration = currentTrace.getDuration();
        
        if (typeof duration === 'number') {
          this.logPerformanceMetric({
            name: traceName,
            duration,
            metadata
          });
        }
        
        this.traces.delete(traceName);
      }
    } catch (error) {
      console.warn(`Failed to stop trace ${traceName}:`, error);
    }
  }

  /**
   * Log a performance metric to Firebase Analytics
   */
  private logPerformanceMetric(metric: PerformanceMetric): void {
    if (!this.isInitialized || !analytics) return;

    try {
      logEvent(analytics, 'performance_metric', {
        metric_name: metric.name,
        duration_ms: metric.duration,
        timestamp: new Date().toISOString(),
        ...metric.metadata
      });
    } catch (error) {
      console.warn('Failed to log performance metric:', error);
    }
  }

  /**
   * Monitor a function's execution time
   */
  async monitorFunction<T>(
    functionName: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startTrace(functionName);
    
    try {
      const result = await fn();
      return result;
    } finally {
      this.stopTrace(functionName, metadata);
    }
  }

  /**
   * Monitor component render time
   */
  monitorComponentRender(
    componentName: string,
    metadata?: Record<string, any>
  ): { start: () => void; stop: () => void } {
    return {
      start: () => this.startTrace(`render_${componentName}`),
      stop: () => this.stopTrace(`render_${componentName}`, metadata)
    };
  }

  /**
   * Monitor API call performance
   */
  async monitorApiCall<T>(
    endpoint: string,
    apiCall: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const traceName = `api_${endpoint}`;
    this.startTrace(traceName);

    try {
      const startTime = performance.now();
      const result = await apiCall();
      const duration = performance.now() - startTime;

      this.logPerformanceMetric({
        name: traceName,
        duration,
        metadata: {
          ...metadata,
          endpoint,
          success: true,
          timestamp: new Date().toISOString()
        }
      });

      return result;
    } catch (error) {
      const duration = performance.now() - performance.now();
      
      this.logPerformanceMetric({
        name: traceName,
        duration,
        metadata: {
          ...metadata,
          endpoint,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      });

      throw error;
    } finally {
      this.stopTrace(traceName);
    }
  }

  /**
   * Monitor resource loading performance
   */
  monitorResourceLoad(
    resourceType: 'image' | 'script' | 'stylesheet' | 'font',
    url: string
  ): void {
    if (!this.isInitialized || typeof window === 'undefined') return;

    const traceName = `resource_load_${resourceType}`;
    const startTime = performance.now();

    // Create a performance observer
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry instanceof PerformanceResourceTiming && entry.name === url) {
          this.logPerformanceMetric({
            name: traceName,
            duration: entry.duration,
            metadata: {
              url,
              resourceType,
              size: entry.transferSize,
              protocol: entry.nextHopProtocol,
              timing: {
                dns: entry.domainLookupEnd - entry.domainLookupStart,
                tcp: entry.connectEnd - entry.connectStart,
                ttfb: entry.responseStart - entry.requestStart,
                download: entry.responseEnd - entry.responseStart
              }
            }
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // Cleanup after 30 seconds
    setTimeout(() => observer.disconnect(), 30000);
  }

  /**
   * Monitor user interactions
   */
  monitorInteraction(
    interactionType: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.isInitialized || !analytics) return;

    try {
      logEvent(analytics, 'user_interaction', {
        interaction_type: interactionType,
        timestamp: new Date().toISOString(),
        ...metadata
      });
    } catch (error) {
      console.warn('Failed to log user interaction:', error);
    }
  }

  /**
   * Monitor Firebase operation performance
   */
  async monitorFirebaseOperation<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const traceName = `firebase_${operation}`;
    return this.monitorFunction(traceName, fn, {
      operation,
      type: 'firebase'
    });
  }
}

export const performanceService = PerformanceService.getInstance();
