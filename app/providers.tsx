'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store, persistor } from '../redux/store';
import { Toaster } from '../components/toaster';
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
      <Toaster />
    </ThemeProvider>
  );
} 