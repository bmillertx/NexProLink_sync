import { db } from '@/config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type {
  VideoCallMetrics,
  VideoCallQuality,
  VideoCallSession,
  QualityThresholds
} from '@/types/video';

export class VideoQualityMonitor {
  private static instance: VideoQualityMonitor;
  private metricsBuffer: VideoCallMetrics[] = [];
  private readonly bufferSize = 10; // Store last 10 measurements
  private readonly measurementInterval = 1000; // Measure every second
  private measurementTimer?: NodeJS.Timer;
  private currentSession?: VideoCallSession;

  private readonly qualityThresholds: QualityThresholds = {
    excellent: {
      minBitrate: 2000000, // 2 Mbps
      maxLatency: 100,     // 100ms
      maxPacketLoss: 0.5,  // 0.5%
      minFrameRate: 25     // 25 fps
    },
    good: {
      minBitrate: 1000000, // 1 Mbps
      maxLatency: 200,     // 200ms
      maxPacketLoss: 2,    // 2%
      minFrameRate: 20     // 20 fps
    },
    fair: {
      minBitrate: 500000,  // 500 Kbps
      maxLatency: 300,     // 300ms
      maxPacketLoss: 5,    // 5%
      minFrameRate: 15     // 15 fps
    },
    poor: {
      minBitrate: 250000,  // 250 Kbps
      maxLatency: 500,     // 500ms
      maxPacketLoss: 10,   // 10%
      minFrameRate: 10     // 10 fps
    }
  };

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): VideoQualityMonitor {
    if (!VideoQualityMonitor.instance) {
      VideoQualityMonitor.instance = new VideoQualityMonitor();
    }
    return VideoQualityMonitor.instance;
  }

  public startMonitoring(session: VideoCallSession, peerConnection: RTCPeerConnection): void {
    this.currentSession = session;
    this.measurementTimer = setInterval(() => {
      this.measureQuality(peerConnection);
    }, this.measurementInterval);
  }

  public stopMonitoring(): void {
    if (this.measurementTimer) {
      clearInterval(this.measurementTimer);
      this.measurementTimer = undefined;
    }
    this.metricsBuffer = [];
    this.currentSession = undefined;
  }

  private async measureQuality(peerConnection: RTCPeerConnection): Promise<void> {
    try {
      const stats = await peerConnection.getStats();
      const metrics = this.processRTCStats(stats);
      this.updateMetricsBuffer(metrics);
      const quality = this.calculateQuality(metrics);
      await this.updateSessionQuality(quality);
    } catch (error) {
      console.error('Error measuring call quality:', error);
    }
  }

  private processRTCStats(stats: RTCStatsReport): VideoCallMetrics {
    let videoBitrate = 0;
    let audioBitrate = 0;
    let packetLoss = 0;
    let latency = 0;
    let frameRate = 0;
    let width = 0;
    let height = 0;

    stats.forEach(stat => {
      if (stat.type === 'inbound-rtp' && stat.kind === 'video') {
        videoBitrate = stat.bytesReceived * 8 / stat.timestamp;
        frameRate = stat.framesPerSecond || 0;
      }
      if (stat.type === 'inbound-rtp' && stat.kind === 'audio') {
        audioBitrate = stat.bytesReceived * 8 / stat.timestamp;
      }
      if (stat.type === 'track' && stat.kind === 'video') {
        width = stat.frameWidth || 0;
        height = stat.frameHeight || 0;
      }
      if (stat.type === 'remote-inbound-rtp') {
        packetLoss = stat.packetsLost || 0;
        latency = stat.roundTripTime || 0;
      }
    });

    return {
      timestamp: new Date(),
      videoBitrate,
      audioBitrate,
      packetLoss,
      latency,
      resolution: { width, height },
      frameRate,
      jitter: 0 // Calculated from audio stats if needed
    };
  }

  private updateMetricsBuffer(metrics: VideoCallMetrics): void {
    this.metricsBuffer.push(metrics);
    if (this.metricsBuffer.length > this.bufferSize) {
      this.metricsBuffer.shift();
    }
  }

  private calculateQuality(metrics: VideoCallMetrics): VideoCallQuality {
    const { videoBitrate, latency, packetLoss, frameRate } = metrics;
    const { excellent, good, fair, poor } = this.qualityThresholds;

    if (
      videoBitrate >= excellent.minBitrate &&
      latency <= excellent.maxLatency &&
      packetLoss <= excellent.maxPacketLoss &&
      frameRate >= excellent.minFrameRate
    ) {
      return 'excellent';
    }

    if (
      videoBitrate >= good.minBitrate &&
      latency <= good.maxLatency &&
      packetLoss <= good.maxPacketLoss &&
      frameRate >= good.minFrameRate
    ) {
      return 'good';
    }

    if (
      videoBitrate >= fair.minBitrate &&
      latency <= fair.maxLatency &&
      packetLoss <= fair.maxPacketLoss &&
      frameRate >= fair.minFrameRate
    ) {
      return 'fair';
    }

    if (
      videoBitrate >= poor.minBitrate &&
      latency <= poor.maxLatency &&
      packetLoss <= poor.maxPacketLoss &&
      frameRate >= poor.minFrameRate
    ) {
      return 'poor';
    }

    return 'critical';
  }

  private async updateSessionQuality(quality: VideoCallQuality): Promise<void> {
    if (!this.currentSession) return;

    try {
      const sessionRef = doc(db, 'videoSessions', this.currentSession.id);
      await updateDoc(sessionRef, {
        quality,
        metrics: this.metricsBuffer,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating session quality:', error);
    }
  }

  public getAverageMetrics(): VideoCallMetrics | null {
    if (this.metricsBuffer.length === 0) return null;

    const sum = this.metricsBuffer.reduce((acc, metrics) => ({
      videoBitrate: acc.videoBitrate + metrics.videoBitrate,
      audioBitrate: acc.audioBitrate + metrics.audioBitrate,
      packetLoss: acc.packetLoss + metrics.packetLoss,
      latency: acc.latency + metrics.latency,
      frameRate: acc.frameRate + metrics.frameRate,
      jitter: acc.jitter + metrics.jitter,
      resolution: metrics.resolution, // Use the latest resolution
      timestamp: metrics.timestamp // Use the latest timestamp
    }));

    const count = this.metricsBuffer.length;
    return {
      videoBitrate: sum.videoBitrate / count,
      audioBitrate: sum.audioBitrate / count,
      packetLoss: sum.packetLoss / count,
      latency: sum.latency / count,
      frameRate: sum.frameRate / count,
      jitter: sum.jitter / count,
      resolution: sum.resolution,
      timestamp: sum.timestamp
    };
  }
}

export const videoQualityMonitor = VideoQualityMonitor.getInstance();
