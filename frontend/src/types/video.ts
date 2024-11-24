export interface VideoCallMetrics {
  timestamp: Date;
  videoBitrate: number;
  audioBitrate: number;
  packetLoss: number;
  latency: number;
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
  jitter: number;
}

export interface VideoCallSession {
  id: string;
  appointmentId: string;
  expertId: string;
  clientId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: VideoCallStatus;
  billingStatus: BillingStatus;
  quality: VideoCallQuality;
  metrics: VideoCallMetrics[];
}

export type VideoCallStatus = 
  | 'initializing'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'failed'
  | 'completed';

export type BillingStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'refunded';

export type VideoCallQuality =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'critical';

export interface VideoCallParticipant {
  id: string;
  role: 'expert' | 'client';
  stream?: MediaStream;
  audioEnabled: boolean;
  videoEnabled: boolean;
  connectionQuality: VideoCallQuality;
}

export interface VideoCallConfig {
  iceServers: RTCIceServer[];
  maxBitrate: number;
  minBitrate: number;
  idealFrameRate: number;
  maxFrameRate: number;
  resolution: {
    width: number;
    height: number;
  };
}

export interface QualityThresholds {
  excellent: {
    minBitrate: number;
    maxLatency: number;
    maxPacketLoss: number;
    minFrameRate: number;
  };
  good: {
    minBitrate: number;
    maxLatency: number;
    maxPacketLoss: number;
    minFrameRate: number;
  };
  fair: {
    minBitrate: number;
    maxLatency: number;
    maxPacketLoss: number;
    minFrameRate: number;
  };
  poor: {
    minBitrate: number;
    maxLatency: number;
    maxPacketLoss: number;
    minFrameRate: number;
  };
}
