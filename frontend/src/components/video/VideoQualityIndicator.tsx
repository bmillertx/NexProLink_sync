import React, { useEffect, useState } from 'react';
import { VideoCallQuality, VideoCallMetrics } from '@/types/video';
import { videoQualityMonitor } from '@/services/video/videoQualityMonitor';
import { 
  SignalIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface VideoQualityIndicatorProps {
  sessionId: string;
  onQualityChange?: (quality: VideoCallQuality) => void;
}

export const VideoQualityIndicator: React.FC<VideoQualityIndicatorProps> = ({
  sessionId,
  onQualityChange
}) => {
  const [quality, setQuality] = useState<VideoCallQuality>('good');
  const [metrics, setMetrics] = useState<VideoCallMetrics | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const currentMetrics = videoQualityMonitor.getAverageMetrics();
      if (currentMetrics) {
        setMetrics(currentMetrics);
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [sessionId]);

  useEffect(() => {
    if (quality && onQualityChange) {
      onQualityChange(quality);
    }
  }, [quality, onQualityChange]);

  const getQualityColor = (quality: VideoCallQuality): string => {
    switch (quality) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-green-400';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-orange-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatBitrate = (bitrate: number): string => {
    if (bitrate >= 1000000) {
      return `${(bitrate / 1000000).toFixed(1)} Mbps`;
    }
    if (bitrate >= 1000) {
      return `${(bitrate / 1000).toFixed(1)} Kbps`;
    }
    return `${bitrate.toFixed(1)} bps`;
  };

  const getQualityIcon = () => {
    if (quality === 'critical') {
      return (
        <ExclamationTriangleIcon
          className={`h-5 w-5 ${getQualityColor(quality)}`}
        />
      );
    }

    return (
      <SignalIcon
        className={`h-5 w-5 ${getQualityColor(quality)}`}
      />
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
        title={`Connection Quality: ${quality}`}
      >
        {getQualityIcon()}
        <span className={`text-sm font-medium ${getQualityColor(quality)}`}>
          {quality.charAt(0).toUpperCase() + quality.slice(1)}
        </span>
      </button>

      {showDetails && metrics && (
        <div className="absolute right-0 mt-2 w-64 rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">Video Bitrate</label>
              <div className="text-sm font-medium">
                {formatBitrate(metrics.videoBitrate)}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Audio Bitrate</label>
              <div className="text-sm font-medium">
                {formatBitrate(metrics.audioBitrate)}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Latency</label>
              <div className="text-sm font-medium">
                {metrics.latency.toFixed(0)}ms
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Packet Loss</label>
              <div className="text-sm font-medium">
                {metrics.packetLoss.toFixed(1)}%
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Frame Rate</label>
              <div className="text-sm font-medium">
                {metrics.frameRate.toFixed(0)} fps
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Resolution</label>
              <div className="text-sm font-medium">
                {metrics.resolution.width}x{metrics.resolution.height}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
