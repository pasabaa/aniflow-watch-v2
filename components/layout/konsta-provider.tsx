'use client';

import * as React from 'react';
import { App } from 'konsta/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export function KonstaProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Configure native status bar & splash screen on Android
    const initCapacitor = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#0a0a0a' });
        await SplashScreen.hide();
      } catch {
        // Fallback when running outside Capacitor
      }
    };
    initCapacitor();
  }, []);

  return (
    <App
      theme="material"
      dark={true}
      safeAreas={true}
      className="bg-bg text-ink min-h-screen w-full flex flex-col font-sans select-none"
    >
      {children}
    </App>
  );
}
