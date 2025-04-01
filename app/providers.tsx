'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from '../redux/store';
import { Toaster } from '../components/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Provider store={store}>{children}</Provider>
      <Toaster />
    </ThemeProvider>
  );
} 