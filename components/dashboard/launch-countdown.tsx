import { useEffect, useState } from 'react';

interface LaunchCountdownProps {
  launchDate: string;
}

export function LaunchCountdown({ launchDate }: LaunchCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  useEffect(() => {
    if (!launchDate) return;

    // Function to calculate and format time remaining
    const updateTimeRemaining = () => {
      const launchTime = new Date(launchDate).getTime();
      const currentTime = new Date().getTime();
      const timeUntilLaunch = launchTime - currentTime;
      
      if (timeUntilLaunch <= 0) {
        setTimeRemaining("Launched");
        return;
      }
      
      // If within 60 seconds, show countdown
      if (timeUntilLaunch <= 60000) {
        if (!isLaunching) {
          setIsLaunching(true);
          setCountdown(Math.ceil(timeUntilLaunch / 1000));
        }
        
        // When in countdown mode, use the countdown state for display
        if (countdown !== null) {
          // Calculate other units for display with seconds from countdown
          const days = Math.floor(timeUntilLaunch / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeUntilLaunch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeUntilLaunch % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`T-${days}d ${hours}h ${minutes}m ${countdown}s`);
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
    
    // Update every minute for regular display
    const minuteInterval = setInterval(updateTimeRemaining, 60000);
    
    // Update every second when in countdown mode
    let secondInterval: NodeJS.Timeout;
    if (isLaunching && countdown !== null) {
      secondInterval = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount === null || prevCount <= 1) {
            clearInterval(secondInterval);
            return 0;
          }
          return prevCount - 1;
        });
        
        // Update the full time remaining display with each second
        updateTimeRemaining();
      }, 1000);
    }

    return () => {
      clearInterval(minuteInterval);
      if (secondInterval) clearInterval(secondInterval);
    };
  }, [launchDate, isLaunching, countdown]);

  if (!timeRemaining) return null;

  return (
    <span className={`font-medium ${isLaunching ? 'text-[#ff3300] animate-pulse' : 'text-[#ff6b00]'}`}>
      {timeRemaining}
    </span>
  );
} 