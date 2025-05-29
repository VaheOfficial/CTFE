import type { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect, useState, useCallback } from 'react';
import { ApiService } from '@/lib/api.service';
import { CountdownTimer } from './countdown-timer';

interface LaunchData {
  id: string;
  name: string;
  date: string;
  status: string;
}

interface DashboardHeaderProps {
  launchpadName: string;
  launchpadLocation: string;
  activeStatus: 'active' | 'inactive' | 'maintenance' | 'launch-ready';
}

export function DashboardHeader({
  launchpadName,
  launchpadLocation,
  activeStatus,
}: DashboardHeaderProps) {
  const [nextLaunch, setNextLaunch] = useState<LaunchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLaunches = useCallback(async () => {
    try {
      setLoading(true);
      const apiService = new ApiService();
      const launchData = await apiService.getLaunches();
      let closestLaunch = null;
      const now = new Date();
      
      for (const launch of launchData.data) {
        // Find the closest upcoming launch by date
        const launchDate = new Date(launch.date);
        
        if (launchDate > now) {
          if (!closestLaunch || launchDate < new Date(closestLaunch.date)) {
            closestLaunch = launch;
          }
        }
      }
      
      setNextLaunch(closestLaunch);
    } catch (error) {
      console.error('Error fetching launches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  // Function to handle countdown end and refetch launches
  const handleCountdownEnd = useCallback(() => {
    console.log('Countdown ended, refetching launches...');
    fetchLaunches();
  }, [fetchLaunches]);

  // Format the launch date if available
  const formattedLaunchDate = nextLaunch?.date ? new Date(nextLaunch.date).toLocaleString() : null;

  const temperaturePreference = useSelector((state: RootState) => state.weather.temperaturePreference);
  const temperatureC = useSelector((state: RootState) => state.weather.temperatureC);
  const temperatureF = useSelector((state: RootState) => state.weather.temperatureF);
  const windSpeed = useSelector((state: RootState) => state.weather.windSpeed);
  const humidity = useSelector((state: RootState) => state.weather.humidity);
  // Derive the temperature based on preference
  const temperature = temperaturePreference === 'c' ? temperatureC : temperatureF;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-[#00e5c7]/10 text-[#00e5c7] border border-[#00e5c7]/30';
      case 'inactive':
        return 'bg-[#a3a3a3]/10 text-[#a3a3a3] border border-[#a3a3a3]/30';
      case 'maintenance':
        return 'bg-[#ffcc00]/10 text-[#ffcc00] border border-[#ffcc00]/30';
      case 'launch-ready':
        return 'bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/30';
      default:
        return 'bg-[#a3a3a3]/10 text-[#a3a3a3] border border-[#a3a3a3]/30';
    }
  };

  const statusText = {
    'active': 'Active',
    'inactive': 'Inactive',
    'maintenance': 'Under Maintenance',
    'launch-ready': 'Launch Ready',
  };
  
  const getStatusIcon = (status: string): ReactNode => {
    switch (status) {
      case 'active':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mr-1" aria-labelledby="active-status-icon">
            <title id="active-status-icon">Active status indicator</title>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case 'inactive':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mr-1" aria-labelledby="inactive-status-icon">
            <title id="inactive-status-icon">Inactive status indicator</title>
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        );
      case 'maintenance':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mr-1" aria-labelledby="maintenance-status-icon">
            <title id="maintenance-status-icon">Maintenance status indicator</title>
            <circle cx="12" cy="12" r="7" />
            <polyline points="12 9 12 12 13.5 13.5" />
            <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
          </svg>
        );
      case 'launch-ready':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mr-1" aria-labelledby="launch-ready-status-icon">
            <title id="launch-ready-status-icon">Launch ready status indicator</title>
            <polygon points="12 2 19 21 12 17 5 21 12 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Card variant="bordered" className="mb-6 overflow-hidden">
      <CardContent className="px-7 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#f5f5f5] mb-2 tracking-tight">
              {launchpadName}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[#a3a3a3]">{launchpadLocation}</span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center ${getStatusColor(activeStatus)}`}>
                {getStatusIcon(activeStatus)}
                {statusText[activeStatus]}
              </span>
            </div>
          </div>

          <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col items-center bg-[#ff6b00]/5 backdrop-blur-sm border border-[#ff6b00]/20 rounded-lg px-4 py-3 min-w-[200px]">
              <span className="text-sm text-[#a3a3a3]">Next Launch</span>
              {loading ? (
                <span className="font-medium text-[#a3a3a3]">Loading...</span>
              ) : nextLaunch ? (
                <span className="font-medium text-[#ff6b00] text-center overflow-hidden text-ellipsis whitespace-nowrap">{formattedLaunchDate}</span>
              ) : (
                <span className="font-medium text-[#a3a3a3]">No launches scheduled</span>
              )}
            </div>
            
              <div className={`grid ${nextLaunch?.date ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
              {nextLaunch?.date && (
                <CountdownTimer 
                  launchDate={nextLaunch.date} 
                  onCountdownEnd={handleCountdownEnd}
                />
              )}
              
              {temperature !== undefined && (
                <div className="flex flex-col items-center bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#252525] transition-all rounded-lg px-3 py-2.5 w-[160px]">
                  <span className="text-xs text-[#a3a3a3]">Temp</span>
                  <span className="font-medium text-[#f5f5f5] text-center w-full">{temperature}°{temperaturePreference === 'c' ? 'C' : 'F'}</span>
                </div>
              )}
              
              {windSpeed !== undefined && (
                <div className="flex flex-col items-center bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#252525] transition-all rounded-lg px-3 py-2.5 w-[160px]">
                  <span className="text-xs text-[#a3a3a3]">Wind</span>
                  <span className="font-medium text-[#f5f5f5] text-center w-full">{windSpeed} km/h</span>
                </div>
              )}
              
              {humidity !== undefined && (
                <div className="flex flex-col items-center bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#252525] transition-all rounded-lg px-3 py-2.5 w-[160px]">
                  <span className="text-xs text-[#a3a3a3]">Humidity</span>
                  <span className="font-medium text-[#f5f5f5] text-center w-full">{humidity}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 