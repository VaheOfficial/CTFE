import React from 'react';
import { Navbar } from '../../components/navbar';
import { DashboardHeader } from '../../components/dashboard/dashboard-header';
import { VideoPlayer } from '../../components/dashboard/video-player';
import { WeatherWidget } from '../../components/dashboard/weather-widget';
import { RadioCommunications } from '../../components/dashboard/radio-communications';
import { ChatBox } from '../../components/dashboard/chat-box';
import { ClassificationBanner } from '../../components/classification-banner';

// Example data - in a real app, this would come from an API
const launchpadData = {
  launchpadName: "Vandenberg Space Force Base",
  launchpadLocation: "Vandenberg SFB, CA",
  activeStatus: "active" as const,
  nextLaunchTime: "2024-03-31 14:30 UTC",
  temperature: 28,
  windSpeed: 12,
  humidity: 65
};

const weatherData = {
  temperature: 28,
  humidity: 65,
  windSpeed: 12,
  windDirection: "NE",
  pressure: 1013,
  condition: "clear" as const,
  updatedAt: "10:25 AM"
};

const cameraViews = [
  {
    id: "cam1",
    name: "Launch Pad Overview",
    thumbnail: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=200&h=120&auto=format&fit=crop"
  },
  {
    id: "cam2",
    name: "Rocket Closeup",
    thumbnail: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=200&h=120&auto=format&fit=crop"
  },
  {
    id: "cam3",
    name: "Mission Control",
    thumbnail: "https://images.unsplash.com/photo-1581088567939-0dc049101e72?q=80&w=200&h=120&auto=format&fit=crop"
  },
  {
    id: "cam4",
    name: "Fuel Loading",
    thumbnail: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=200&h=120&auto=format&fit=crop"
  }
];

const radioMessages = [
  {
    id: "1",
    source: "Mission Control",
    timestamp: "10:22:45",
    message: "T-15 minutes and counting. Weather is go for launch.",
    frequency: "259.70"
  },
  {
    id: "2",
    source: "Rocket Systems",
    timestamp: "10:23:12",
    message: "Propellant loading at 95%, all systems nominal.",
    frequency: "145.80"
  },
  {
    id: "3",
    source: "Mission Control",
    timestamp: "10:24:30",
    message: "Begin terminal count procedures, verify all ground systems.",
    frequency: "259.70"
  },
  {
    id: "4",
    source: "Telemetry",
    timestamp: "10:25:05",
    message: "Guidance systems initialized, receiving data on all channels.",
    frequency: "131.42"
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="unclassified" />
      <Navbar isLoggedIn={true} />
      <main className="container mx-auto px-4 py-8">
        <DashboardHeader {...launchpadData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <VideoPlayer sources={cameraViews} />
          </div>
          <div className="space-y-6">
            <WeatherWidget data={weatherData} />
            <ChatBox />
          </div>
        </div>
        
        <div>
          <RadioCommunications messages={radioMessages} isLive={true} />
        </div>
      </main>
      <ClassificationBanner level="confidential" />
    </div>
  );
} 