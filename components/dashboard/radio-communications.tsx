'use client';

import { useEffect, useState, useRef, useMemo, type ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ApiService } from '@/lib/api.service';

interface RadioCommunicationsProps {
  isLive?: boolean;
}

interface RadioChannel {
  id: string;
  name: string;
  url: string;
  frequency: string;
}

export function RadioCommunications({ isLive = true }: RadioCommunicationsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channelExists, setChannelExists] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<RadioChannel | null>(null);
  const [volume, setVolume] = useState(5);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<number[]>(new Array(32).fill(0));
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Static frequency band IDs for stable keys
  const frequencyBandIds = useMemo(() => 
    Array.from({ length: 32 }, (_, i) => `freq-band-${i}`), 
    []
  );

  // Initialize audio element and Web Audio API
  useEffect(() => {
    audioRef.current = new Audio();
    // Set properties for streaming audio
    audioRef.current.preload = 'none';
    audioRef.current.crossOrigin = 'anonymous'; // Required for Web Audio API
    
    // Audio event listeners
    const audio = audioRef.current;
    
    const handlePlay = () => {
      setIsPlaying(true);
      startAudioAnalysis();
    };
    const handlePause = () => {
      setIsPlaying(false);
      stopAudioAnalysis();
    };
    const handleEnded = () => {
      setIsPlaying(false);
      stopAudioAnalysis();
    };
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setAudioError('Failed to load audio stream');
      setIsPlaying(false);
      setIsLoading(false);
      stopAudioAnalysis();
    };
    const handleCanPlay = () => {
      setIsLoading(false);
      setAudioError(null);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      stopAudioAnalysis();
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize Web Audio API
  const initializeAudioAnalysis = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // Configure analyser
      analyserRef.current.fftSize = 128; // 64 frequency bins
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      // Create source from audio element
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      
      // Connect: source -> analyser -> destination
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
    } catch (error) {
      console.error('Failed to initialize audio analysis:', error);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    // Reset audio data to silence
    setAudioData(new Array(32).fill(0));
  };

  const updateAudioData = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Map the frequency data to our 32 bars
    const barCount = 32;
    const barsData: number[] = [];
    
    for (let i = 0; i < barCount; i++) {
      const start = Math.floor(i * (bufferLength / barCount));
      const end = Math.floor((i + 1) * (bufferLength / barCount));
      
      let sum = 0;
      for (let j = start; j < end; j++) {
        sum += dataArray[j];
      }
      
      const average = sum / (end - start);
      const normalizedValue = (average / 255) * 100; // Convert to percentage
      barsData.push(Math.max(normalizedValue, 2)); // Minimum height of 2%
    }
    
    setAudioData(barsData);
    
    // Continue animation
    animationRef.current = requestAnimationFrame(updateAudioData);
  };

  const startAudioAnalysis = () => {
    if (!analyserRef.current) {
      initializeAudioAnalysis();
    }
    
    if (analyserRef.current) {
      updateAudioData();
    }
  };

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!currentChannel) {
        await playRadioChannel();
      } else {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Failed to play audio:', error);
          setAudioError('Failed to play audio');
        }
      }
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number.parseInt(e.target.value, 10));
  };

  useEffect(() => {
    const fetchRadioChannels = async () => {
      try {
        const apiService = new ApiService();
        const response = await apiService.getRadioChannels();
        if (response.success && response.data?.length > 0) {
          setChannelExists(true);
        }
      } catch (error) {
        console.error('Failed to fetch radio channels:', error);
      }
    };
    fetchRadioChannels();
  }, []);

  const playRadioChannel = async () => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    setAudioError(null);
    
    try {
      const apiService = new ApiService();
      const response = await apiService.playRadioChannel();
      if (response.success) {
        // For streaming audio, the response should contain the stream URL
        const streamUrl = response.data?.url || response.data?.stream_url || `${process.env.NEXT_PUBLIC_API_URL}/audio/stream`;
        const channelData = response.data || {};
        
        setCurrentChannel({
          id: 'main',
          name: channelData.name || 'Mission Control',
          url: streamUrl,
          frequency: channelData.frequency || '121.5'
        });
        
        // Set the stream URL and start loading
        audioRef.current.src = streamUrl;
        audioRef.current.load(); // Force reload of the stream
        
        // Try to play immediately - streaming audio should start as soon as enough data is buffered
        try {
          await audioRef.current.play();
        } catch {
          console.log('Auto-play prevented, user will need to click play');
          setIsLoading(false);
        }
        
        setChannelExists(true);
      } else {
        setChannelExists(false);
        setIsPlaying(false);
        setIsLoading(false);
        setAudioError(response.message || 'No radio channel available');
      }
    } catch (error) {
      console.error('Failed to play radio channel:', error);
      setChannelExists(false);
      setIsPlaying(false);
      setIsLoading(false);
      setAudioError('Failed to connect to radio channel');
    }
  };

  const getDisplayText = () => {
    if (audioError) return 'Audio Error';
    if (isLoading) return 'Connecting...';
    if (currentChannel) return currentChannel.name;
    if (channelExists) return 'Mission Control Available';
    return 'Radio Comm Starts T-10 minutes';
  };

  return (
    <Card variant="bordered" className="overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-[#1a1a1a]">
        <CardTitle className="text-sm font-medium text-[#f5f5f5]">Radio Communications</CardTitle>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#00e5c7]' : 'bg-[#333333]'}`} />
          <span className="text-xs text-[#a3a3a3] font-mono">{isLive ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-b border-[#1a1a1a] p-4 bg-[#050505]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-white rounded-full w-8 h-8 flex items-center justify-center ${
                  isPlaying ? 'bg-[#00e5c7] hover:bg-[#00cbb1]' : 
                  isLoading ? 'bg-[#333333]' : 'bg-[#1a1a1a] hover:bg-[#252525]'
                }`}
                onClick={togglePlay}
                disabled={isLoading}
                aria-label={isLoading ? "Loading" : (isPlaying ? "Pause" : "Play")}
              >
                {isLoading ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 animate-spin" aria-hidden="true">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                ) : isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </Button>
              
              <div className="text-white font-mono">
                <div className="text-xs text-[#666666]">STATUS</div>
                <div className="text-sm text-[#f5f5f5]">{getDisplayText()}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-[#666666]" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-[#00e5c7]"
                aria-label="Volume control"
              />
            </div>
          </div>
          
          {/* Real-time audio visualization */}
          <div className="mt-4 h-45 bg-[#0a0a0a] rounded overflow-hidden border border-[#1a1a1a]">
            <div className="h-full flex items-end gap-px">
              {audioData.map((barHeight, i) => (
                <div 
                  key={frequencyBandIds[i]}
                  className={`flex-1 transition-all duration-75 ${isPlaying ? 'bg-[#00e5c7]' : 'bg-[#333333]'}`}
                  style={{ 
                    height: `${Math.max(barHeight, 2)}%`,
                    opacity: isPlaying ? 0.8 + (barHeight / 500) : 0.4
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 