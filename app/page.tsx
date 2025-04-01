'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export default function Home() {
  const isAuthenticated = useSelector((state: RootState) => {
    console.log(state);
    return state.auth.isAuthenticated;
  });
  const router = useRouter();
  console.log(isAuthenticated);
  useEffect(() => {
    // Use client-side navigation instead of redirect for client-side state
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Return a loading state while the redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}
