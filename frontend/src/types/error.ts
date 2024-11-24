export interface ErrorBoundaryTestResult {
  type: ErrorType;
  message: string;
  code: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export type ErrorType = 
  | 'NETWORK'
  | 'AUTH'
  | 'VIDEO'
  | 'DATABASE'
  | 'BILLING'
  | 'VALIDATION'
  | 'PERMISSION';

export interface NetworkError {
  type: 'NETWORK';
  subtype: 'OFFLINE' | 'SLOW' | 'TIMEOUT';
  retryCount: number;
  lastAttempt: Date;
}

export interface AuthError {
  type: 'AUTH';
  subtype: 'INVALID_CREDENTIALS' | 'EXPIRED_SESSION' | 'UNAUTHORIZED';
  userId?: string;
  sessionId?: string;
}

export interface VideoError {
  type: 'VIDEO';
  subtype: 'STREAM_INTERRUPTION' | 'AUDIO_FAILURE' | 'QUALITY_DEGRADATION';
  callId: string;
  participantId: string;
  metrics?: {
    videoBitrate?: number;
    audioBitrate?: number;
    packetLoss?: number;
    latency?: number;
  };
}

export interface DatabaseError {
  type: 'DATABASE';
  subtype: 'CONCURRENT_WRITE' | 'VALIDATION' | 'PERMISSION';
  operation: 'READ' | 'WRITE' | 'DELETE';
  collection: string;
  documentId?: string;
}

export interface BillingError {
  type: 'BILLING';
  subtype: 'PAYMENT_FAILED' | 'METERING_ERROR' | 'RATE_ERROR';
  transactionId: string;
  amount?: number;
  currency?: string;
}

export type AppError = 
  | NetworkError 
  | AuthError 
  | VideoError 
  | DatabaseError 
  | BillingError;
