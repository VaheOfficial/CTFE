import { useEffect, useState, useRef } from 'react';

interface CountdownTimerProps {
  launchDate: string;
  onCountdownEnd?: () => void;
}

export function CountdownTimer({ launchDate, onCountdownEnd }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const hasTriggeredRefetchRef = useRef<boolean>(false);

  // Reset refetch state when launch date changes
  useEffect(() => {
    hasTriggeredRefetchRef.current = false;
    
    return () => {
      // Cleanup when component unmounts or launch date changes
      hasTriggeredRefetchRef.current = false;
    };
  }, [launchDate]);

  useEffect(() => {
    if (!launchDate) return;

    // Function to safely trigger the countdown end callback once
    const triggerCountdownEnd = () => {
      if (!hasTriggeredRefetchRef.current && onCountdownEnd) {
        console.log('Triggering countdown end callback');
        hasTriggeredRefetchRef.current = true;
        onCountdownEnd();
      }
    };

    // Function to calculate and format time remaining
    const updateTimeRemaining = () => {
      const launchTime = new Date(launchDate).getTime();
      const currentTime = new Date().getTime();
      const timeUntilLaunch = launchTime - currentTime;
      
      // If launch time has passed
      if (timeUntilLaunch <= 0) {
        setTimeRemaining("T-0");
        triggerCountdownEnd();
        return;
      }
      
      // If within 60 seconds, show countdown with only seconds
      if (timeUntilLaunch <= 60000) {
        if (!isLaunching) {
          setIsLaunching(true);
          setCountdown(Math.ceil(timeUntilLaunch / 1000));
        }
        
        // When in countdown mode, use the countdown state for display - only seconds
        if (countdown !== null) {
          setTimeRemaining(`T-${countdown}`);
        }
        return;
      } else if (isLaunching) {
        // If no longer within 60 seconds, exit countdown mode
        setIsLaunching(false);
        setCountdown(null);
      }
      
      // Regular time remaining format - always show all units
      const totalSeconds = Math.floor(timeUntilLaunch / 1000);
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / (60 * 60)) % 24;
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      
      // Always include all units
      setTimeRemaining(`T-${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    // Initial update
    updateTimeRemaining();
    
    // Create a function that updates the countdown and display
    const updateCountdown = () => {
      setCountdown(prevCount => {
        if (prevCount === null || prevCount <= 1) {
          // When countdown reaches exactly 1, check if we need to trigger the callback
          if (prevCount === 1) {
            setTimeout(() => {
              triggerCountdownEnd();
            }, 1000);
          }
          return 0;
        }
        return prevCount - 1;
      });
    };

    // Update every second for all states to ensure continuous updating
    const secondInterval = setInterval(() => {
      const launchTime = new Date(launchDate).getTime();
      const currentTime = new Date().getTime();
      const timeUntilLaunch = launchTime - currentTime;

      // If we're in the final 60 seconds, update the countdown
      if (timeUntilLaunch <= 60000 && timeUntilLaunch > 0) {
        if (!isLaunching) {
          setIsLaunching(true);
          setCountdown(Math.ceil(timeUntilLaunch / 1000));
        } else {
          updateCountdown();
        }
        
        if (countdown !== null) {
          setTimeRemaining(`T-${countdown}`);
        }
      } else if (timeUntilLaunch <= 0) {
        // If countdown has ended, show T-0
        setTimeRemaining("T-0");
        triggerCountdownEnd();
      } else {
        // Otherwise just update the time normally
        updateTimeRemaining();
      }
    }, 1000);

    return () => {
      clearInterval(secondInterval);
    };
  }, [launchDate, isLaunching, countdown, onCountdownEnd]);

  if (!timeRemaining) return null;

  return (
    <div className="flex flex-col items-center bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#252525] transition-all rounded-lg px-3 py-2.5 w-[160px]">
      <span className="text-xs text-[#a3a3a3]">Countdown</span>
      <span className={`font-medium ${isLaunching ? 'text-[#ff3300] animate-pulse' : 'text-[#f5f5f5]'} w-full text-center overflow-hidden text-ellipsis whitespace-nowrap`}>
        {timeRemaining}
      </span>
    </div>
  );
} 