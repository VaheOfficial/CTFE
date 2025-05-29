'use client';

import { useState, useEffect } from 'react';
import { UserManagement } from './user-management';
import { CommandCenter } from './command-center';
import { SystemDiagnostics } from './system-diagnostics';
import { Card, CardContent } from '../ui/card';

type AdminTab = 'users' | 'settings' | 'command' | 'diagnostics';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [clientIP, setClientIP] = useState<string | null>(null);

  // Mock function to get client IP - in reality this would come from the server
  useEffect(() => {
    // Simulate fetching IP after component mounts
    const fetchIP = async () => {
      // Check if we're on localhost (127.0.0.1)
      const isLocalhost = window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname === '';
      
      // For the demo, we'll set the IP to 127.0.0.1 if we're on localhost
      // Otherwise use a different IP that won't have destruct permissions
      const mockIP = isLocalhost ? '127.0.0.1' : window.location.hostname;
      
      setTimeout(() => {
        setClientIP(mockIP);
      }, 500);
    };
    
    fetchIP();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Admin warning message */}
      <div className="bg-[#ff2d55]/10 border border-[#ff2d55]/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#ff2d55] mt-0.5" aria-labelledby="warning-icon">
            <title id="warning-icon">Warning</title>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="font-medium text-[#ff2d55] mb-1">Administrator Access</p>
            <p className="text-sm text-[#e0e0e0]">
              You are accessing privileged system controls. All actions are logged and audited daily.
              {clientIP && <span className="block mt-1 font-mono text-xs">Terminal IP: {clientIP}</span>}
            </p>
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b border-[#1a1a1a] mb-6">
        <button
          type="button"
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'users'
              ? 'text-[#f5f5f5] border-b-2 border-[#ff6b00]'
              : 'text-[#a3a3a3] hover:text-[#e0e0e0]'
          }`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        {clientIP && (
          <>
            <button
              type="button"
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'diagnostics'
                  ? 'text-[#f5f5f5] border-b-2 border-blue-500'
                  : 'text-[#a3a3a3] hover:text-[#e0e0e0]'
              }`}
              onClick={() => setActiveTab('diagnostics')}
            >
              System Diagnostics
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'command'
                  ? 'text-[#f5f5f5] border-b-2 border-[#ff2d55]'
                  : 'text-[#a3a3a3] hover:text-[#e0e0e0]'
              }`}
              onClick={() => setActiveTab('command')}
            >
              Command Center
            </button>
          </>
        )}
      </div>
      
      {/* Tab content */}
      <Card variant="bordered" className="overflow-hidden">
        <CardContent className="p-0">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'diagnostics' && <SystemDiagnostics clientIP={clientIP ?? ''} />}
          {activeTab === 'command' && <CommandCenter clientIP={clientIP ?? ''} />}
        </CardContent>
      </Card>
    </div>
  );
} 