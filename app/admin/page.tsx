import React from 'react';
import { Navbar } from '../../components/navbar';
import { AdminPanel } from '../../components/admin/admin-panel';
import { ClassificationBanner } from '../../components/classification-banner';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="top-secret" />
      <Navbar />
      
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