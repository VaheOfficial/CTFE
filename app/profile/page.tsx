import React from 'react';
import { Navbar } from '../../components/navbar';
import { ClassificationBanner } from '../../components/classification-banner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

// Mock user data - in a real app, this would come from authentication service
const userData = {
  name: "John Doe",
  email: "john.doe@agency.gov",
  role: "Operator",
  joinDate: "April 12, 2022",
  avatarUrl: "https://ui-avatars.com/api/?name=John+Doe&background=ff6b00&color=fff",
  badge: "Level 3 Clearance",
  stats: {
    missionsParticipated: 14,
    logEntries: 243,
    commendations: 2,
    lastActive: "Today at 10:25 AM"
  }
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="confidential" />
      <Navbar isLoggedIn={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
          <p className="text-[#a3a3a3] mt-2">
            View and manage your account information
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left column - User info */}
          <div className="lg:col-span-1">
            <Card variant="bordered" className="overflow-hidden">
              <CardHeader className="border-b border-[#1a1a1a] pb-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#ff6b00]">
                    <img 
                      src={userData.avatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      className="absolute bottom-0 inset-x-0 bg-[#0a0a0a]/80 text-[#f5f5f5] text-xs py-1 hover:bg-[#0a0a0a] transition-colors"
                    >
                      Change
                    </button>
                  </div>
                  <h2 className="text-xl font-semibold text-[#f5f5f5]">{userData.name}</h2>
                  <p className="text-sm text-[#a3a3a3]">{userData.email}</p>
                  <div className="mt-2 px-2 py-1 bg-[#ff6b00]/20 text-[#ff6b00] text-xs font-medium rounded">
                    {userData.role.toUpperCase()}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-[#a3a3a3] mb-1">Security Badge</h3>
                    <p className="text-sm font-medium">{userData.badge}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-[#a3a3a3] mb-1">Member Since</h3>
                    <p className="text-sm font-medium">{userData.joinDate}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-[#a3a3a3] mb-1">Last Active</h3>
                    <p className="text-sm font-medium">{userData.stats.lastActive}</p>
                  </div>
                  
                  <div className="pt-3 mt-3 border-t border-[#1a1a1a]">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full text-sm"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Activity & Stats */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card variant="bordered" className="bg-[#121212]">
                  <CardContent className="p-4">
                    <h3 className="text-[#a3a3a3] text-sm mb-1">Missions</h3>
                    <p className="text-2xl font-semibold text-[#f5f5f5]">{userData.stats.missionsParticipated}</p>
                    <p className="text-xs text-[#a3a3a3] mt-1">Total participated</p>
                  </CardContent>
                </Card>
                
                <Card variant="bordered" className="bg-[#121212]">
                  <CardContent className="p-4">
                    <h3 className="text-[#a3a3a3] text-sm mb-1">Log Entries</h3>
                    <p className="text-2xl font-semibold text-[#f5f5f5]">{userData.stats.logEntries}</p>
                    <p className="text-xs text-[#a3a3a3] mt-1">System records</p>
                  </CardContent>
                </Card>
                
                <Card variant="bordered" className="bg-[#121212]">
                  <CardContent className="p-4">
                    <h3 className="text-[#a3a3a3] text-sm mb-1">Commendations</h3>
                    <p className="text-2xl font-semibold text-[#f5f5f5]">{userData.stats.commendations}</p>
                    <p className="text-xs text-[#a3a3a3] mt-1">Performance awards</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card variant="bordered">
                <CardHeader className="py-4 px-6 border-b border-[#1a1a1a]">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[#1a1a1a]">
                    <ActivityItem 
                      action="Logged into dashboard" 
                      timestamp="Today at 08:32 AM" 
                      location="Houston Terminal 3"
                    />
                    <ActivityItem 
                      action="Approved launch sequence" 
                      timestamp="Yesterday at 16:45 PM" 
                      location="Mission Control Room"
                    />
                    <ActivityItem 
                      action="Submitted system maintenance report" 
                      timestamp="June 12, 2023 at 14:20 PM" 
                      location="Remote Access"
                    />
                    <ActivityItem 
                      action="Updated communication protocols" 
                      timestamp="June 10, 2023 at 11:05 AM" 
                      location="Main Facility"
                    />
                    <ActivityItem 
                      action="Completed security training" 
                      timestamp="June 05, 2023 at 09:15 AM" 
                      location="Training Center"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Active Sessions */}
              <Card variant="bordered">
                <CardHeader className="py-4 px-6 border-b border-[#1a1a1a]">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[#1a1a1a]">
                    <SessionItem 
                      device="Windows PC" 
                      browser="Chrome 114" 
                      ip="192.168.1.45" 
                      location="Houston, TX" 
                      lastActive="Current session" 
                      isCurrentDevice={true}
                    />
                    <SessionItem 
                      device="iPhone 13" 
                      browser="Safari Mobile" 
                      ip="172.16.254.1" 
                      location="Houston, TX" 
                      lastActive="2 hours ago" 
                      isCurrentDevice={false}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto fixed bottom-0 w-full">
        <ClassificationBanner level="confidential" />
      </footer>
    </div>
  );
}

// Helper components
function ActivityItem({ action, timestamp, location }: { 
  action: string; 
  timestamp: string;
  location: string;
}) {
  return (
    <div className="py-3 px-6 hover:bg-[#0a0a0a] transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-[#f5f5f5]">{action}</p>
          <p className="text-xs text-[#a3a3a3] mt-1">
            {location}
          </p>
        </div>
        <span className="text-xs text-[#a3a3a3]">{timestamp}</span>
      </div>
    </div>
  );
}

function SessionItem({ device, browser, ip, location, lastActive, isCurrentDevice }: { 
  device: string; 
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrentDevice: boolean;
}) {
  return (
    <div className="py-3 px-6 hover:bg-[#0a0a0a] transition-colors">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[#f5f5f5]">{device}</p>
            {isCurrentDevice && (
              <span className="px-1.5 py-0.5 text-[0.65rem] bg-green-500/20 text-green-500 rounded">
                CURRENT
              </span>
            )}
          </div>
          <p className="text-xs text-[#a3a3a3] mt-1">{browser}</p>
          <p className="text-xs text-[#a3a3a3]">
            {ip} • {location}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#a3a3a3]">{lastActive}</span>
          {!isCurrentDevice && (
            <button type="button" className="block text-xs text-[#ff2d55] mt-1 hover:underline">
              Terminate
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 