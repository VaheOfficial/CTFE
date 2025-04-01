'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import type { GlobalStateItem, StatusSeverity } from '../redux/globalStateSlice';
import { format } from 'date-fns';
import { startGlobalStatePolling, stopGlobalStatePolling } from '../utils/global-state-service';

// Siren animation for critical alerts
const Siren = () => {
  return (
    <div className="animate-spin h-6 w-6 mr-2">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-label="Emergency siren">
        <title>Emergency siren</title>
        <path 
          d="M12 2L14 7H10L12 2Z"
          className="animate-pulse"
          fill="red" 
        />
        <path 
          d="M12 22L10 17H14L12 22Z" 
          className="animate-pulse"
          fill="red" 
        />
        <path 
          d="M2 12L7 10V14L2 12Z" 
          className="animate-pulse"
          fill="red" 
        />
        <path 
          d="M22 12L17 14V10L22 12Z" 
          className="animate-pulse"
          fill="red" 
        />
        <circle cx="12" cy="12" r="4" fill="#FF6B6B" />
      </svg>
    </div>
  );
};

const StatusIcon = ({ severity }: { severity: StatusSeverity }) => {
  switch (severity) {
    case 'critical':
      return (
        <div className="animate-pulse mr-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-labelledby="critical-icon"
          >
            <title id="critical-icon">Critical alert</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div className="mr-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-labelledby="warning-icon"
          >
            <title id="warning-icon">Warning alert</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
    default:
      return (
        <div className="mr-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-labelledby="info-icon"
          >
            <title id="info-icon">Information alert</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
  }
};

const StateItem = ({ item }: { item: GlobalStateItem }) => {
  const textColorClass = {
    normal: 'text-gray-200',
    warning: 'text-yellow-100',
    critical: 'text-white'
  };

  const bgColorClass = {
    normal: 'bg-[#161616]',
    warning: 'bg-yellow-900/50',
    critical: 'bg-red-900/50'
  };

  return (
    <div 
      className={`flex items-center justify-center px-4 py-2 rounded 
        ${bgColorClass[item.severity]} 
        ${item.severity === 'critical' ? 'animate-pulse shadow shadow-red-500/50' : ''}
        transform transition-all duration-300 ease-in-out`}
    >
      {item.severity === 'critical' && <Siren />}
      <StatusIcon severity={item.severity} />
      <span className={`text-sm ${textColorClass[item.severity]} font-medium`}>
        {item.message}
      </span>
      <span className="ml-2 text-xs text-gray-400">
        {format(item.timestamp, 'HH:mm:ss')}
      </span>
      {item.severity === 'critical' && <Siren />}
    </div>
  );
};

export function GlobalStateStrip() {
  const reduxGlobalState = useSelector((state: RootState) => state.globalState.items);
  const [displayItems, setDisplayItems] = useState<GlobalStateItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sort items by severity and deduplicate
  useEffect(() => {
    if (!reduxGlobalState.length) return;
    
    // First, create a map with composite key (severity+message) to eliminate exact duplicates
    // This preserves different messages within the same severity level
    const uniqueItemsMap = new Map<string, GlobalStateItem>();
    
    // Use for...of instead of forEach
    for (const item of reduxGlobalState) {
      // Create a composite key using severity and message
      const key = `${item.severity}:${item.message}`;
      
      // Only keep the most recent instance of each unique severity+message combo
      const existingItem = uniqueItemsMap.get(key);
      if (!existingItem || item.timestamp > existingItem.timestamp) {
        uniqueItemsMap.set(key, item);
      }
    }
    
    // Convert back to array and sort by severity
    const uniqueItems = Array.from(uniqueItemsMap.values());
    const sorted = uniqueItems.toSorted((a, b) => {
      const severityOrder: Record<StatusSeverity, number> = { 
        critical: 0, 
        warning: 1, 
        normal: 2 
      };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    setDisplayItems(sorted);
    setCurrentIndex(0); // Reset to first alert when items change
  }, [reduxGlobalState]);

  // Rotate through alerts with severity-based timing
  useEffect(() => {
    if (displayItems.length === 0) return;
    
    // Set display time based on severity
    const displayDurations = {
      critical: 10000, // 10 seconds
      warning: 7000,   // 7 seconds
      normal: 4000     // 4 seconds
    };
    
    const currentItem = displayItems[currentIndex];
    const currentDuration = displayDurations[currentItem.severity];
    
    // Set timer for current alert - simple index rotation with no transition delay
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayItems.length);
    }, currentDuration);
    
    return () => clearTimeout(timer);
  }, [displayItems, currentIndex]);

  // Start and stop polling for global states
  useEffect(() => {
    startGlobalStatePolling();
    return () => {
      stopGlobalStatePolling();
    };
  }, []);

  if (displayItems.length === 0) {
    return null;
  }

  const currentItem = displayItems[currentIndex];
  const isCritical = currentItem.severity === 'critical';

  return (
    <div 
      className={`py-1.5 px-3 border-b transition-colors duration-300 ${
        isCritical 
          ? 'bg-red-900/20 border-red-800'
          : currentItem.severity === 'warning'
            ? 'bg-[#0f0f0f] border-yellow-900'
            : 'bg-[#0f0f0f] border-[#1a1a1a]'
      }`}
    >
      <div className="flex justify-center items-center min-h-[40px]">
        <StateItem key={`${currentItem.id}-${currentIndex}`} item={currentItem} />
      </div>
      {displayItems.length > 1 && (
        <div className="flex justify-center mt-0.5">
          {displayItems.map((item, index) => (
            <div 
              key={`pagination-dot-${item.id}-${index}`}
              className={`h-1 w-4 mx-0.5 rounded-full ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
