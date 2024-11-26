import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { useAuth } from '@/hooks/useAuth';

interface VideoCallProps {
  channelName: string;
  token: string;
  onCallEnd?: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ channelName, token, onCallEnd }) => {
  const { user } = useAuth();
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const agoraClient = useRef<IAgoraRTCClient>(AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8'
  }));

  useEffect(() => {
    const initCall = async () => {
      if (!channelName || !token) return;

      try {
        // Join the channel
        await agoraClient.current.join(
          process.env.NEXT_PUBLIC_AGORA_APP_ID!,
          channelName,
          token,
          user?.uid || null
        );

        // Create and publish local tracks
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        
        await agoraClient.current.publish([audioTrack, videoTrack]);
      } catch (error) {
        console.error('Error joining video call:', error);
      }
    };

    initCall();

    // Cleanup function
    return () => {
      localAudioTrack?.close();
      localVideoTrack?.close();
      agoraClient.current.leave();
    };
  }, [channelName, token, user]);

  // Handle remote user events
  useEffect(() => {
    const client = agoraClient.current;

    const handleUserJoined = async (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(prev => [...prev, user]);
    };

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, []);

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    localAudioTrack?.close();
    localVideoTrack?.close();
    await agoraClient.current.leave();
    onCallEnd?.();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        {/* Local Video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          {localVideoTrack && (
            <div className="w-full h-full" ref={node => node && localVideoTrack.play(node)} />
          )}
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            You
          </div>
        </div>

        {/* Remote Videos */}
        {remoteUsers.map(user => (
          <div key={user.uid} className="relative bg-gray-800 rounded-lg overflow-hidden">
            <div
              className="w-full h-full"
              ref={node => node && user.videoTrack?.play(node)}
            />
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              Participant
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center space-x-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'}`}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600'}`}
        >
          {isVideoOff ? 'Start Video' : 'Stop Video'}
        </button>
        <button
          onClick={endCall}
          className="p-3 rounded-full bg-red-500"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
