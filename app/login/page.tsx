'use client';

import { useState } from 'react';
import { LoginForm } from '../../components/login-form';
import { ClassificationBanner } from '../../components/classification-banner';
import { ConsentScreen } from '../../components/consent-screen';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [hasConsented, setHasConsented] = useState(false);
  const router = useRouter();

  const handleConsent = () => {
    setHasConsented(true);
  };

  const handleDecline = () => {
    // Redirect to the access denied page
    router.push('/access-denied');
  };

  if (!hasConsented) {
    return <ConsentScreen onAccept={handleConsent} onDecline={handleDecline} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="confidential" />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-[#f5f5f5] tracking-tight">
              Mission Control
            </h1>
            <p className="text-sm text-[#a3a3a3] mt-2">
              Internal Launch Monitoring System
            </p>
          </div>
            <LoginForm />
        </div>
      </div>
      <footer className="mt-auto fixed bottom-0 w-full">
        <ClassificationBanner level="confidential" />
      </footer>
    </div>
  );
} 