'use client';

import React, { useEffect } from 'react';
import { Navbar } from '../../components/navbar';
import { ClassificationBanner } from '../../components/classification-banner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ApiService } from '../../lib/api.service';
import { setUser } from '../../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { Avatar } from '../../components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  // Memoize the ApiService instance so it doesn't change on every render
  const apiService = React.useMemo(() => new ApiService(), []);

  // Fetch user data from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await apiService.me();
        dispatch(setUser(me.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [dispatch, apiService]);
  const activeSession = useSelector((state: RootState) => state.auth.session);
  // Get user data from Redux store
  const user = useSelector((state: RootState) => {
    console.log(state.user.user);
    return state.user.user;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="confidential" />
      <Navbar isLoggedIn={true} isAdmin={true} />
      
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
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#ff6b00] items-center justify-center">
                    <Avatar name={user?.name ?? 'Default User'} size="3xl" className='object-cover -translate-x-0.5' />
                  </div>
                  <h2 className="text-xl font-semibold text-[#f5f5f5]">{user?.name ?? 'Default User'}</h2>
                  <p className="text-sm text-[#a3a3a3]">{user?.email ?? 'default@agency.gov'}</p>
                  <div className="mt-2 px-2 py-1 bg-[#ff6b00]/20 text-[#ff6b00] text-xs font-medium rounded">
                    {user?.role?.toUpperCase() ?? 'OPERATOR'}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-[#a3a3a3] mb-1">Security Badge</h3>
                    <p className="text-sm font-medium">
                      {user.clearanceLevel === 'level3' ? 'Level 3' : 
                       user.clearanceLevel === 'level2' ? 'Level 2' : 
                       user.clearanceLevel === 'level1' ? 'Level 1' : 
                       user.clearanceLevel}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-[#a3a3a3] mb-1">Member Since</h3>
                    <p className="text-sm font-medium">{new Date(user.createdAt as string ?? '').toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-[#a3a3a3] mb-1">Last Active</h3>
                    <p className="text-sm font-medium">{new Date(user.lastActive as string ?? '').toLocaleString()}</p>
                  </div>
                  
                  <div className="pt-3 mt-3 border-t border-[#1a1a1a]">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full text-sm"
                      onClick={() => router.push('/settings')}
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
                    <p className="text-2xl font-semibold text-[#f5f5f5]">{user.missionsParticipated?.length ?? 0}</p>
                    <p className="text-xs text-[#a3a3a3] mt-1">Total participated</p>
                  </CardContent>
                </Card>
                
                <Card variant="bordered" className="bg-[#121212]">
                  <CardContent className="p-4">
                    <h3 className="text-[#a3a3a3] text-sm mb-1">Log Entries</h3>
                    <p className="text-2xl font-semibold text-[#f5f5f5]">{user.logEntries?.length ?? 0}</p>
                    <p className="text-xs text-[#a3a3a3] mt-1">System records</p>
                  </CardContent>
                </Card>
                
                <Card variant="bordered" className="bg-[#121212]">
                  <CardContent className="p-4">
                    <h3 className="text-[#a3a3a3] text-sm mb-1">Commendations</h3>
                    <p className="text-2xl font-semibold text-[#f5f5f5]">{user.commendations?.length ?? 0}</p>
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
                  {user.logEntries?.slice(Math.max(0, user.logEntries.length - 5), user.logEntries.length)
                    .reverse()
                    .map((logEntry) => (
                    <div className="divide-y divide-[#1a1a1a]" key={logEntry._id}>
                      <ActivityItem 
                        action={logEntry.description as string ?? ''} 
                        timestamp={new Date(logEntry.createdAt as string ?? '').toLocaleString()} 
                        location={logEntry.location as string ?? ''}
                        type={logEntry.type as 'information' | 'incident' | 'observation' | 'other' ?? 'information'}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Active Sessions */}
              <Card variant="bordered">
                <CardHeader className="py-4 px-6 border-b border-[#1a1a1a]">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[#1a1a1a]">
                    {user.activeSessions?.map((session) => (
                      <SessionItem 
                        key={session._id}
                        device={session.device ?? ''} 
                        browser={session.browser ?? ''} 
                        ip={session.ipAddress === "::1" ? "localhost" : session.ipAddress ?? ''} 
                        location={session.location ?? ''} 
                        lastActive={new Date(session.lastActive as string ?? '').toLocaleString()} 
                        isCurrentDevice={session.sessionId === activeSession}
                      />
                    ))}
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
function ActivityItem({ action, timestamp, location, type }: { 
  action: string; 
  timestamp: string;
  location: string;
  type: 'information' | 'incident' | 'observation' | 'other';
}) {
  // Define styling based on log type
  const getLogTypeStyles = () => {
    switch (type) {
      case 'information':
        return {
          borderColor: '#3b82f6', // blue
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-400',
          label: 'INFO'
        };
      case 'incident':
        return {
          borderColor: '#ef4444', // red
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-400',
          label: 'INCIDENT'
        };
      case 'observation':
        return {
          borderColor: '#eab308', // yellow
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-400',
          label: 'OBSERVATION'
        };
      case 'other':
        return {
          borderColor: '#a855f7', // purple
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-400',
          label: 'OTHER'
        };
    }
  };

  const styles = getLogTypeStyles();

  return (
    <div className="py-3 px-6 hover:bg-[#0a0a0a] transition-colors" style={{ borderLeft: `3px solid ${styles.borderColor}` }}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-1.5 py-0.5 text-[0.65rem] ${styles.bgColor} ${styles.textColor} rounded font-medium`}>
              {styles.label}
            </span>
            <p className="text-sm font-medium text-[#f5f5f5]">{action}</p>
          </div>
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