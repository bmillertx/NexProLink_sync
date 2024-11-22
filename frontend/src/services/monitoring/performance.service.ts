import { analytics } from '@/config/firebase';
import { logEvent } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';

interface PerformanceMetric {
  name: string;
  duration: number;
  metadata?: Record<string, any>;
}

class PerformanceService {
  private static instance: PerformanceService;
  private traces: Map<string, any>;

  private constructor() {
    this.traces = new Map();
    
    if (typeof window !== 'undefined') {
      // Initialize Firebase Performance Monitoring
      getPerformance();
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
    if (typeof window === 'undefined') return;

    const newTrace = trace(traceName);
    newTrace.start();
    this.traces.set(traceName, newTrace);
  }

  /**
   * Stop measuring a performance trace and log results
   */
  stopTrace(traceName: string, metadata?: Record<string, any>): void {
    if (typeof window === 'undefined') return;

    const currentTrace = this.traces.get(traceName);
    if (currentTrace) {
      currentTrace.stop();
      this.traces.delete(traceName);

      // Log performance metric to analytics
      this.logPerformanceMetric({
        name: traceName,
        duration: currentTrace.getDuration(),
        metadata
      });
    }
  }

  /**
   * Log a performance metric to Firebase Analytics
   */
  private logPerformanceMetric(metric: PerformanceMetric): void {
    if (typeof window !== 'undefined' && analytics) {
      logEvent(analytics, 'performance_metric', {
        metric_name: metric.name,
        duration_ms: metric.duration,
        timestamp: new Date().toISOString(),
        ...metric.metadata
      });
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
  monitorComponentRender(componentName: string): () => void {
    const traceName = `render_${componentName}`;
    this.startTrace(traceName);
    
    return () => {
      this.stopTrace(traceName, {
        component: componentName,
        type: 'render'
      });
    };
  }

  /**
   * Monitor API call performance
   */
  async monitorApiCall<T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const traceName = `api_${endpoint}`;
    return this.monitorFunction(traceName, apiCall, {
      endpoint,
      type: 'api_call'
    });
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
