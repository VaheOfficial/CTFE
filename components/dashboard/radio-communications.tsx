'use client';

import { useState, type ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface Message {
  id: string;
  source: string;
  timestamp: string;
  message: string;
  frequency: string;
}

interface RadioCommunicationsProps {
  messages: Message[];
  isLive?: boolean;
}

export function RadioCommunications({ messages, isLive = true }: RadioCommunicationsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [activeFrequency, setActiveFrequency] = useState("145.80");

  const frequencies = [
    { value: "145.80", label: "145.80 MHz" },
    { value: "437.50", label: "437.50 MHz" },
    { value: "259.70", label: "259.70 MHz" },
    { value: "131.42", label: "131.42 MHz" },
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number.parseInt(e.target.value, 10));
  };

  return (
    <Card variant="bordered" className="overflow-hidden">
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
                className={`text-white rounded-full w-8 h-8 flex items-center justify-center ${isPlaying ? 'bg-[#00e5c7] hover:bg-[#00cbb1]' : 'bg-[#1a1a1a] hover:bg-[#252525]'}`}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
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
                <div className="text-xs text-[#666666]">FREQ</div>
                <div className="text-sm text-[#f5f5f5]">{activeFrequency} MHz</div>
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
          
          {/* Frequency selector */}
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {frequencies.map((freq) => (
              <button
                key={freq.value}
                type="button"
                onClick={() => setActiveFrequency(freq.value)}
                className={`text-left px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  activeFrequency === freq.value 
                    ? 'bg-[#00e5c7]/10 text-[#00e5c7] border border-[#00e5c7]/30' 
                    : 'bg-[#0a0a0a] text-[#a3a3a3] border border-[#1a1a1a] hover:bg-[#111111] hover:border-[#252525]'
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
          
          {/* Audio visualization */}
          <div className="mt-4 h-8 bg-[#0a0a0a] rounded overflow-hidden border border-[#1a1a1a]">
            <div className="h-full flex items-end">
              {Array.from({ length: 32 }).map((_, i) => {
                const barHeight = isPlaying ? Math.floor(Math.random() * 100) : 5;
                const barId = `audio-bar-${i}-${barHeight}`;
                return (
                  <div 
                    key={barId}
                    className={`w-full mx-px ${isPlaying ? 'bg-[#00e5c7]' : 'bg-[#333333]'}`}
                    style={{ 
                      height: `${barHeight}%`,
                      opacity: isPlaying ? 1 : 0.4
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Communication log */}
        <div className="p-3 bg-[#0a0a0a]">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className="bg-[#050505] p-3 rounded-md text-xs border border-[#1a1a1a] hover:border-[#252525] transition-all"
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#e0e0e0]">{msg.source}</span>
                  <span className="font-mono text-[#666666]">{msg.timestamp}</span>
                </div>
                <p className="text-[#f5f5f5] leading-relaxed">{msg.message}</p>
                <div className="mt-1.5 text-xs text-[#666666] font-mono">
                  {msg.frequency} MHz
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 