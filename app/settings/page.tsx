'use client';

import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navbar } from '../../components/navbar';
import { ClassificationBanner } from '../../components/classification-banner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { useRouter } from 'next/navigation';
import { ApiService } from '../../lib/api.service';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import type { RootState } from '../../redux/store';
import { PasswordChangeModal } from '../../components/user/password-change-modal';

export default function SettingsPage() {
  // Initialize router, dispatch, and apiService
  const router = useRouter();
  const dispatch = useDispatch();
  const apiService = React.useMemo(() => new ApiService(), []);

  // State for various settings
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'security'>('account');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form states
  const [accountForm, setAccountForm] = useState({
    name: 'John Doe',
    email: 'john.doe@agency.gov'
  });
  
  // Fetch user data from API if not already in Redux store
  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    if(user) {
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await apiService.me();
        dispatch(setUser(response.data));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, [dispatch, apiService, user]);
  
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state: RootState) => state.user.user?.role === 'admin');
  // Handler for account form changes
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm({ ...accountForm, [name]: value });
  };
  
  // Handler for save button
  const handleSaveSettings = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      // In a real app, we would show a success toast here
    }, 1000);
  };

  // Handler for password change
  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="confidential" />
      <Navbar isLoggedIn={isAuthorized} isAdmin={isAdmin} />
      
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-[#a3a3a3] mt-2">
            Configure your account
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card variant="bordered" className="overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-[#1a1a1a]">
                  <NavButton 
                    active={activeTab === 'account'} 
                    onClick={() => setActiveTab('account')}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-labelledby="account-icon-title">
                        <title id="account-icon-title">Account Settings Icon</title>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    }
                  >
                    Account
                  </NavButton>
                  <NavButton 
                    active={activeTab === 'security'} 
                    onClick={() => setActiveTab('security')}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-labelledby="security-icon-title">
                        <title id="security-icon-title">Security Settings Icon</title>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    }
                  >
                    Security
                  </NavButton>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Settings Content */}
          <div className="lg:col-span-3">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <Card variant="bordered">
                <CardHeader className="pb-3">
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={user?.name ?? 'Default User'}
                        onChange={handleAccountChange}
                        className="mt-1 bg-[#121212] border-[#2a2a2a]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user?.email ?? 'default@agency.gov'}
                        onChange={handleAccountChange}
                        className="mt-1 bg-[#121212] border-[#2a2a2a]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-[#1a1a1a] py-4">
                  <Button 
                    type="button"
                    onClick={handleSaveSettings}
                    className="bg-[#ff6b00] hover:bg-[#ff6b00]/80 text-white"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            )}
                        
            {/* Security Settings */}
            {activeTab === 'security' && (
              <Card variant="bordered">
                <CardHeader className="pb-3">
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage account security options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[#f5f5f5]">Password</h3>
                    <div className="p-4 bg-[#121212] rounded-md border border-[#1a1a1a]">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-[#f5f5f5]">Change Password</p>
                          <p className="text-xs text-[#a3a3a3] mt-1">
                            {user?.lastPasswordChange ? (() => {
                              const timeDiff = new Date().getTime() - new Date(user.lastPasswordChange).getTime();
                              const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                              const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                              const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                              const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                              
                              if (days > 0) return `Last changed ${days} day${days !== 1 ? 's' : ''} ago`;
                              if (hours > 0) return `Last changed ${hours} hour${hours !== 1 ? 's' : ''} ago`;
                              if (minutes > 0) return `Last changed ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
                              return `Last changed ${seconds} second${seconds !== 1 ? 's' : ''} ago`;
                            })() : 'Last changed Never'}
                          </p>
                        </div>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={handleChangePassword}
                          className="text-sm"
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[#f5f5f5]">Active Sessions</h3>
                    <div className="p-4 bg-[#121212] rounded-md border border-[#1a1a1a]">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-[#f5f5f5]">{user?.activeSessions?.length ?? 0} Active Sessions</p>
                          <p className="text-xs text-[#a3a3a3] mt-1">{user?.activeSessions?.map((session) => session.device).join(', ') ?? ''}</p>
                        </div>
                        <Button 
                          type="button"
                          variant="outline"
                          className="text-sm bg-[#ff2d55]/10 text-[#ff2d55] hover:bg-[#ff2d55]/20 border-[#ff2d55]/20"
                        >
                          Logout All
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
function NavButton({ 
  children, 
  active, 
  onClick,
  icon
}: { 
  children: ReactNode; 
  active: boolean; 
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3 p-3 text-sm ${
        active 
          ? 'bg-[#121212] text-[#f5f5f5] font-medium' 
          : 'text-[#a3a3a3] hover:bg-[#0a0a0a] hover:text-[#e0e0e0]'
      }`}
      onClick={onClick}
    >
      <span className={`${active ? 'text-[#ff6b00]' : 'text-[#666666]'}`}>
        {icon}
      </span>
      {children}
    </button>
  );
}

function ToggleItem({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
      <div>
        <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()} className="font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-[#a3a3a3] mt-0.5">
          {description}
        </p>
      </div>
      <Switch
        id={label.replace(/\s+/g, '-').toLowerCase()}
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
} 