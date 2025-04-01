'use client';

import React from 'react';
import { Navbar } from '../../components/navbar';
import { AdminPanel } from '../../components/admin/admin-panel';
import { ClassificationBanner } from '../../components/classification-banner';
import { withAdminAuth } from '../../lib/auth-middleware';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

function AdminPage() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state: RootState) => state.user.user?.role === 'admin');

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="top-secret" />
      <Navbar isLoggedIn={isAuthenticated} isAdmin={isAdmin} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Administration Panel</h1>
          <p className="text-[#a3a3a3] mt-2">
            Secure system management and control interface
          </p>
        </div>
        
        <AdminPanel />
      </main>
      
      <footer className="mt-auto fixed bottom-0 w-full">
        <ClassificationBanner level="top-secret" />
      </footer>
    </div>
  );
}

// Apply admin authentication middleware
export default withAdminAuth(AdminPage); 