'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ApiService } from '@/lib/api.service';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import partialCloudy from '../../public/partialy-cloudy.svg';
import overcast from '../../public/overcast.svg';
import type { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { setTemperaturePreference, setWeatherData } from '@/redux/weatherSlice';

interface WeatherData {
  temperatureC: number;
  temperatureF: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'overcast' | 'partialy cloudy';
  altitude: number;
  windChill: number;
  updatedAt: string;
}

export function WeatherWidget() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [weatherData, setWeatherDataLocal] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const apiService = new ApiService();
      const result = await apiService.getWeatherData();
      if(result) {
        dispatch(setWeatherData(result));
        setWeatherDataLocal(result);
      }
    }
    
    // Fetch immediately on component mount
    fetchWeatherData();
    
    let timeoutId: NodeJS.Timeout;
    
    // Function to schedule the next update at the start of a minute
    const scheduleNextUpdate = () => {
      const now = new Date();
      const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 3000;
      
      timeoutId = setTimeout(() => {
        fetchWeatherData();
        scheduleNextUpdate();
      }, delay);
    };
    
    scheduleNextUpdate();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dispatch]);

  function temperaturePreference() {
    if(user?.temperaturePreference === 'c') {
      dispatch(setTemperaturePreference('c'));
      return weatherData?.temperatureC;
    } else {
      dispatch(setTemperaturePreference('f'));
      return weatherData?.temperatureF;
    }
  }

  async function setTemperaturePreferenceLocal(preference: string) {
    const apiService = new ApiService();
    const result = await apiService.setTemperaturePreference(preference);
    if(result) {
      dispatch(setUser({ ...user, temperaturePreference: preference }));
    }
  }

  const getWeatherIcon = (condition: string): ReactNode => {
    switch (condition) {
      case 'sunny':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#ff6b00]" aria-labelledby="weather-clear-title">
            <title id="weather-clear-title">Clear sky</title>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        );
      case 'partialy cloudy':
        return (
          <Image src={partialCloudy} alt="partialy cloudy" width={48} height={48} />
        );
      case 'overcast':
        return (
          <Image src={overcast} alt="overcast" width={38} height={38} />
        );      
      case 'clear':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#ff6b00]" aria-labelledby="weather-clear-title">
            <title id="weather-clear-title">Clear sky</title>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        );
      case 'cloudy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#a3a3a3]" aria-labelledby="weather-cloudy-title">
            <title id="weather-cloudy-title">Cloudy</title>
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
          </svg>
        );
      case 'rain':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#00e5c7]" aria-labelledby="weather-rain-title">
            <title id="weather-rain-title">Rain</title>
            <path d="M16 13v8" />
            <path d="M8 13v8" />
            <path d="M12 15v8" />
            <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" />
          </svg>
        );
      case 'storm':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#ff6b00]" aria-labelledby="weather-storm-title">
            <title id="weather-storm-title">Storm</title>
            <path d="M19 16.9A5 5 0 0018 7h-1.26a8 8 0 10-11.62 9" />
            <polyline points="13 11 9 17 15 17 11 23" />
          </svg>
        );
      case 'snow':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#e0e0e0]" aria-labelledby="weather-snow-title">
            <title id="weather-snow-title">Snow</title>
            <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
            <line x1="8" y1="16" x2="8.01" y2="16" />
            <line x1="8" y1="20" x2="8.01" y2="20" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
            <line x1="12" y1="22" x2="12.01" y2="22" />
            <line x1="16" y1="16" x2="16.01" y2="16" />
            <line x1="16" y1="20" x2="16.01" y2="20" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#a3a3a3]" aria-labelledby="weather-default-title">
            <title id="weather-default-title">Weather</title>
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
          </svg>
        );
    }
  };

  const getWindDirectionArrow = (direction: string): ReactNode => {
    const directionMap: Record<string, number> = {
      'N': 0,
      'NE': 45,
      'E': 90,
      'SE': 135,
      'S': 180,
      'SW': 225,
      'W': 270,
      'NW': 315,
    };

    const rotation = directionMap[direction] || 0;

    return (
      <div className="relative flex items-center justify-center w-6 h-6 bg-[#0a0a0a] rounded-full border border-[#1a1a1a]">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-4 h-4 text-[#a3a3a3]"
          style={{ transform: `rotate(${rotation}deg)` }}
          aria-labelledby="wind-direction-title"
        >
          <title id="wind-direction-title">Wind direction: {direction}</title>
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </div>
    );
  };

  return (
    <Card variant="bordered" className="overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 px-5 border-b border-[#1a1a1a]">
        <CardTitle className="text-sm font-medium text-[#f5f5f5]">Weather Conditions</CardTitle>
        <div className="text-xs text-[#666666] font-mono">
          {new Date(weatherData?.updatedAt || 0).toLocaleString()}
        </div>
      </CardHeader>
      <CardContent className="px-5 py-4">
        <div className="flex flex-col space-y-5">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weatherData?.condition.trim().toLowerCase() || '')}
            <div className="flex flex-row w-full justify-between space-x-2">
              <div className="flex flex-col items-start space-x-2">
                <div className="text-2xl font-medium text-[#f5f5f5]">
                  {temperaturePreference()}°{user?.temperaturePreference === 'c' ? 'C' : 'F'}
                </div>
                <div className="capitalize text-xs text-[#a3a3a3] mt-0.5">
                  {weatherData?.condition}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <button type="button" className={`text-xs border rounded-md px-2 py-1 hover:border-gray-500 transition-all ${user?.temperaturePreference === 'c' ? 'bg-[#2a2a2a] text-white border-[#3a3a3a]' : 'text-[#a3a3a3] border-gray-600'}`} onClick={() => setTemperaturePreferenceLocal('c')}>°C</button>
                <button type="button" className={`text-xs border rounded-md px-2 py-1 hover:border-gray-500 transition-all ${user?.temperaturePreference === 'f' ? 'bg-[#2a2a2a] text-white border-[#3a3a3a]' : 'text-[#a3a3a3] border-gray-600'}`} onClick={() => setTemperaturePreferenceLocal('f')}>°F</button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex justify-between p-6 bg-[#0a0a0a] rounded-md border border-[#1a1a1a] hover:border-[#252525] transition-all">
              <span className="text-xs text-[#a3a3a3]">Humidity</span>
              <span className="text-xs font-medium text-[#f5f5f5]">{weatherData?.humidity}%</span>
            </div>
            
            <div className="flex justify-between p-6 bg-[#0a0a0a] rounded-md border border-[#1a1a1a] hover:border-[#252525] transition-all">
              <span className="text-xs text-[#a3a3a3]">Pressure</span>
              <span className="text-xs font-medium text-[#f5f5f5]">{weatherData?.pressure} hPa</span>
            </div>
            
            <div className="flex justify-between p-6 bg-[#0a0a0a] rounded-md border border-[#1a1a1a] hover:border-[#252525] transition-all">
              <span className="text-xs text-[#a3a3a3]">Wind Speed</span>
              <span className="text-xs font-medium text-[#f5f5f5]">{weatherData?.windSpeed} km/h</span>
            </div>
            
            <div className="flex justify-between items-center p-6 bg-[#0a0a0a] rounded-md border border-[#1a1a1a] hover:border-[#252525] transition-all">
              <span className="text-xs text-[#a3a3a3]">Wind Direction</span>
              <div className="flex items-center">
                <span className="text-xs font-medium text-[#f5f5f5] mr-1.5">{weatherData?.windDirection ? weatherData.windDirection.slice(-2) : 'N/A'}</span>
                {getWindDirectionArrow(weatherData?.windDirection ? weatherData.windDirection.slice(-2) : '')}
              </div>
            </div>

            <div className="flex justify-between p-6 bg-[#0a0a0a] rounded-md border border-[#1a1a1a] hover:border-[#252525] transition-all">
              <span className="text-xs text-[#a3a3a3]">Last Updated</span>
              <span className="text-xs font-medium text-[#f5f5f5]">{new Date(weatherData?.updatedAt || 0).toLocaleString().split(',')[1].split(':')[0]}:{new Date(weatherData?.updatedAt || 0).toLocaleString().split(',')[1].split(':')[1]}</span>
            </div>

            <div className="flex justify-between p-6 bg-[#0a0a0a] rounded-md border border-[#1a1a1a] hover:border-[#252525] transition-all">
              <span className="text-xs text-[#a3a3a3]">Wind Chill</span>
              <span className="text-xs font-medium text-[#f5f5f5]">{user?.temperaturePreference === 'c' ? `${weatherData?.windChill || 0} °C` : `${((weatherData?.windChill || 0) * 9/5 + 32).toFixed(1)} °F`}</span>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
} 