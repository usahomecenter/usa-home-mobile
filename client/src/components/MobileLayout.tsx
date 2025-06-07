import React, { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import '../styles/mobile.css';
import { isMobileApp } from '../mobile.config';

interface MobileLayoutProps {
  children: React.ReactNode;
}

/**
 * MobileLayout - A wrapper component that provides mobile-specific adaptations
 * Handles safe areas, platform-specific styles, and other mobile adaptations
 */
export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [platform, setPlatform] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(!isMobileApp());

  useEffect(() => {
    // Skip the platform detection if not running in a mobile app
    if (!isMobileApp()) {
      return;
    }

    const detectPlatform = async () => {
      try {
        const info = await Device.getInfo();
        setPlatform(info.platform);
        setIsReady(true);
        
        // Set up back button handler for Android
        if (info.platform === 'android') {
          App.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
              App.exitApp();
            } else {
              window.history.back();
            }
          });
        }
        
        // Add platform-specific class to body
        document.body.classList.add(`${info.platform}-platform`);
        
        console.log('Mobile platform detected:', info.platform);
      } catch (error) {
        console.error('Error detecting platform:', error);
        // Fallback to browser rendering if detection fails
        setIsReady(true);
      }
    };

    detectPlatform();

    // Cleanup function
    return () => {
      if (platform === 'android') {
        App.removeAllListeners();
      }
      if (platform) {
        document.body.classList.remove(`${platform}-platform`);
      }
    };
  }, [platform]);

  // While detecting platform, show a minimal loading indicator
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-bg">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Apply platform-specific class
  const platformClass = platform ? `${platform}-platform` : '';

  return (
    <div className={`mobile-app-container ${platformClass}`}>
      {children}
    </div>
  );
};

export default MobileLayout;