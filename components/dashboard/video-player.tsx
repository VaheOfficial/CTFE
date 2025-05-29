'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ApiService } from '../../lib/api.service';

interface VideoSource {
  id: string;
  name: string;
  thumbnail: string;
}

interface ApiVideoSource {
  name: string;
  link: string;
}

interface ApiPreviewData {
  name: string;
  link: string;
  previewUrl: string;
}

const PLACEHOLDER_VIDEO_THUMBNAIL = `data:image/svg+xml;base64,${btoa(`
  <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="120" fill="#0a0a0a"/>
    <rect x="75" y="40" width="50" height="40" fill="#333333" rx="4"/>
    <polygon points="95,50 95,70 110,60" fill="#666666"/>
    <text x="100" y="90" font-family="monospace" font-size="10" fill="#666666" text-anchor="middle">NO PREVIEW</text>
  </svg>
`)}`;

export function VideoPlayer() {
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Fetch video sources on component mount
  useEffect(() => {
    const fetchVideoSources = async () => {
      try {
        setIsLoading(true);
        const apiService = new ApiService();
        const response = await apiService.getVideoSources();
        
        if (response) {
          const videoSources: VideoSource[] = response.map((source: ApiVideoSource, index: number) => ({
            id: source.name || `source-${index}`,
            name: source.name || `Camera ${index + 1}`,
            thumbnail: PLACEHOLDER_VIDEO_THUMBNAIL,
          }));
          
          setSources(videoSources);
          if (videoSources.length > 0) {
            setSelectedSource(videoSources[0].id);
          }
          
          await fetchPreviews(videoSources);
        } else {
          setError('Failed to load video sources');
        }
      } catch (error) {
        console.error('Failed to fetch video sources:', error);
        setError('Failed to load video sources');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoSources();
  }, []);

  // Fetch preview images for all sources
  const fetchPreviews = async (videoSources: VideoSource[]) => {
    try {
      const apiService = new ApiService();
      const response = await apiService.getVideoPreviews();
      
      if (response) {
        const updatedSources = videoSources.map(source => {
          const preview = response.find((p: ApiPreviewData) => 
            p.name === source.name
          );
          
          let thumbnailUrl = PLACEHOLDER_VIDEO_THUMBNAIL;
          if (preview && preview.previewUrl) {
            thumbnailUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.51:5000'}${preview.previewUrl}`;
          }
          
          return {
            ...source,
            thumbnail: thumbnailUrl,
          };
        });
        setSources(updatedSources);
      }
    } catch (error) {
      console.error('Failed to fetch video previews:', error);
    }
  };

  // Update time display
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
    if (isPlaying) {
      setIsPlaying(false);
      setStreamUrl('');
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    }
  };

  // Simple play/pause handler
  const handlePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    const selectedSourceData = sources.find(s => s.id === selectedSource);
    if (!selectedSourceData) {
      setError('No video source selected');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const apiService = new ApiService();
      const response = await apiService.streamVideo(selectedSourceData.name);
      
      if (response.success && response.data) {
        const videoStreamUrl = response.data.url;
        setStreamUrl(videoStreamUrl);
        
        if (videoRef.current) {
          videoRef.current.src = videoStreamUrl;
          videoRef.current.load();
          
          try {
            await videoRef.current.play();
            setIsPlaying(true);
          } catch (playError) {
            console.error('Play failed:', playError);
            setError('Click play to start video');
          }
        }
      } else {
        setError('Failed to start video stream');
      }
    } catch (error) {
      console.error('Failed to start video stream:', error);
      setError('Failed to start video stream');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 200;
      thumbnailContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading && sources.length === 0) {
    return (
      <Card variant="bordered" className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-[#1a1a1a]">
          <CardTitle className="text-sm font-medium text-[#f5f5f5]">Loading Video Sources...</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative bg-black aspect-video w-full overflow-hidden">
            <div className="flex items-center justify-center h-full w-full bg-[#050505]">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto text-[#333333] animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                <p className="mt-3 text-xs text-[#666666] font-mono">LOADING VIDEO SOURCES</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && sources.length === 0) {
    return (
      <Card variant="bordered" className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-[#1a1a1a]">
          <CardTitle className="text-sm font-medium text-[#f5f5f5]">Video Sources Error</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative bg-black aspect-video w-full overflow-hidden">
            <div className="flex items-center justify-center h-full w-full bg-[#050505]">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto text-[#ff4444]">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <p className="mt-3 text-xs text-[#ff4444] font-mono">{error}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="bordered" className={`${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''} overflow-hidden`}>
      <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-[#1a1a1a]">
        <CardTitle className="text-sm font-medium text-[#f5f5f5] flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff6b00] animate-pulse" />
          Live Feed: {sources.find(s => s.id === selectedSource)?.name || 'No Source Selected'}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="text-[#363535] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] rounded-lg h-8 w-8"
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-black aspect-video w-full overflow-hidden">
          {/* Simple video element */}
          {streamUrl && (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls={false}
              autoPlay
              muted={true}
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadStart={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
              onError={() => {
                setError('Failed to load video stream');
                setIsPlaying(false);
                setIsLoading(false);
              }}
            />
          )}
          
          {/* Video placeholder */}
          {!streamUrl && (
            <div className="flex items-center justify-center h-full w-full bg-[#050505]">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto text-[#333333]">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <p className="mt-3 text-xs text-[#666666] font-mono">
                  {isLoading ? 'CONNECTING TO LIVE FEED' : 'READY TO STREAM'}
                </p>
                {error && (
                  <p className="mt-1 text-xs text-[#ff4444] font-mono">{error}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white p-1 rounded-full bg-black/50 hover:bg-black/70 h-8 w-8 flex items-center justify-center"
                  onClick={handlePlay}
                  disabled={isLoading || !selectedSource}
                >
                  {isLoading ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 animate-spin">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                  ) : isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </Button>
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-xs font-mono">
                    {isPlaying ? 'LIVE' : 'OFFLINE'}
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                </div>
              </div>
              
              <div className="text-xs text-gray-300 font-mono">
                {currentTime}
              </div>
            </div>
          </div>
        </div>
        
        {/* Camera thumbnails */}
        <div className="relative bg-[#050505] p-3">
          {sources.length > 4 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8"
                onClick={() => scrollThumbnails('left')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8"
                onClick={() => scrollThumbnails('right')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Button>
            </>
          )}
          
          <div 
            ref={thumbnailContainerRef}
            className="flex gap-1.5 overflow-x-auto scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => handleSourceSelect(source.id)}
                className={`group cursor-pointer relative overflow-hidden rounded-md aspect-video flex-shrink-0 w-1/4 min-w-0 ${
                  selectedSource === source.id 
                    ? 'ring-2 ring-orange-500' 
                    : 'ring-1 ring-gray-700 hover:ring-gray-500'
                }`}
                style={{
                  width: sources.length <= 4 ? '24%' : '22%',
                  minWidth: sources.length <= 4 ? '24%' : '22%'
                }}
                type="button"
              >
                <Image 
                  src={source.thumbnail} 
                  alt={source.name}
                  width={100}
                  height={60}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    selectedSource === source.id 
                      ? 'brightness-100' 
                      : 'brightness-50 group-hover:brightness-75'
                  }`}
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_VIDEO_THUMBNAIL;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <span className="text-[10px] text-white font-mono">{source.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}