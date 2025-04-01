'use client';

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
  updatedAt: "10:25 AM",
  altitude: 10000 ,
  windChill: 25
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
    id: "msg-1",
    source: "Mission Control",
    timestamp: "10:42:15",
    message: "Station Alpha, please confirm telemetry readings from sector 7G.",
    frequency: "145.80"
  },
  {
    id: "msg-2",
    source: "Station Alpha",
    timestamp: "10:43:22",
    message: "Mission Control, confirming telemetry readings from sector 7G. All systems nominal.",
    frequency: "145.80"
  },
  {
    id: "msg-3", 
    source: "Science Team",
    timestamp: "10:51:07",
    message: "Temperature anomaly detected in module B. Investigating cause.",
    frequency: "259.70"
  },
  {
    id: "msg-4",
    source: "Engineering",
    timestamp: "11:02:33",
    message: "Module B temperature anomaly traced to faulty sensor. Recalibrating systems.",
    frequency: "259.70"
  },
  {
    id: "msg-5",
    source: "Security",
    timestamp: "11:15:44",
    message: "Perimeter sweep complete. All access points secure.",
    frequency: "437.50"
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="unclassified" />
      <Navbar isLoggedIn={true} isAdmin={true} />
      <main className="container mx-auto px-4 py-8 pb-12">
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
      <footer className="mt-auto fixed bottom-0 w-full">
        <ClassificationBanner level="unclassified" />
      </footer>
    </div>
  );
} 