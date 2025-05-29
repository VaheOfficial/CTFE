'use client';

import React from 'react';
import { Navbar } from '../../components/navbar';
import { DashboardHeader } from '../../components/dashboard/dashboard-header';
import { VideoPlayer } from '../../components/dashboard/video-player';
import { WeatherWidget } from '../../components/dashboard/weather-widget';
import { RadioCommunications } from '../../components/dashboard/radio-communications';
import { ClassificationBanner } from '../../components/classification-banner';
import type { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

// Example data - in a real app, this would come from an API
const launchpadData = {
  launchpadName: "Vandenberg Space Force Base",
  launchpadLocation: "Vandenberg SFB, CA",
  activeStatus: "active" as const,
  nextLaunchTime: "2024-03-31 14:30 UTC",
};

export default function Dashboard() {
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthenticated) || false;
  const isAdmin = useSelector((state: RootState) => state.user.user?.role === 'admin') || false;
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="unclassified" />
      <Navbar isLoggedIn={isAuthorized} isAdmin={isAdmin} />
      <main className="container mx-auto px-4 py-8 pb-12">
        <DashboardHeader {...launchpadData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 h-[790px]">
          <div className="lg:col-span-2 h-full">
            <VideoPlayer />
          </div>
          <div className="lg:col-span-1 space-y-6 h-full flex flex-col">
            <WeatherWidget />
            <RadioCommunications isLive={true} />
          </div>
        </div>
      </main>
      <footer className="mt-auto fixed bottom-0 w-full">
        <ClassificationBanner level="unclassified" />
      </footer>
    </div>
  );
} 