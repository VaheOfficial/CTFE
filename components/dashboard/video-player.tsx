'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface VideoSource {
  id: string;
  name: string;
  thumbnail: string;
}

interface VideoPlayerProps {
  sources: VideoSource[];
}

export function VideoPlayer({ sources }: VideoPlayerProps) {
  const [selectedSource, setSelectedSource] = useState<string>(sources[0]?.id || '');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
  };

  return (
    <Card variant="bordered" className={`${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''} overflow-hidden`}>
      <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-[#1a1a1a]">
        <CardTitle className="text-sm font-medium text-[#f5f5f5] flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff6b00] animate-pulse" />
          Live Feed: {sources.find(s => s.id === selectedSource)?.name}
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
          {/* Video placeholder */}
          <div className="flex items-center justify-center h-full w-full bg-[#050505]">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto text-[#333333]" aria-labelledby="video-player-title">
                <title id="video-player-title">Video player</title>
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <p className="mt-3 text-xs text-[#666666] font-mono">CONNECTING TO LIVE FEED</p>
            </div>
          </div>
          
          {/* Cinematic overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
          
          {/* Minimal controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white p-1 rounded-full bg-[#00000080] hover:bg-[#000000bf] h-8 w-8 flex items-center justify-center"
                  aria-label="Play"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-labelledby="play-button-title">
                    <title id="play-button-title">Play</title>
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </Button>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#f5f5f5] text-xs font-mono tracking-wide">LIVE</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00] animate-pulse" />
                </div>
              </div>
              
              <div className="text-xs text-[#999999] font-mono">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Camera thumbnails */}
        <div className="grid grid-cols-4 gap-1.5 p-3 bg-[#050505]">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => handleSourceSelect(source.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleSourceSelect(source.id)}
              className={`group cursor-pointer relative overflow-hidden rounded-md aspect-video ${
                selectedSource === source.id 
                  ? 'ring-2 ring-[#ff6b00]' 
                  : 'ring-1 ring-[#1a1a1a] hover:ring-[#333333]'
              }`}
              type="button"
              aria-label={`Select ${source.name} camera view`}
            >
              <img 
                src={source.thumbnail} 
                alt={source.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  selectedSource === source.id 
                    ? 'brightness-100' 
                    : 'brightness-50 group-hover:brightness-75'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
              <div className="absolute bottom-0 left-0 right-0 p-1.5">
                <span className="text-[10px] text-[#e0e0e0] font-mono">{source.name}</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 