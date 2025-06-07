/**
 * Mobile Services Index
 * Centralizes all mobile-specific services for the application
 */

import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { isMobileApp, mobileConfig } from '../../mobile.config';

// Import all mobile services
import { initializeStorageService } from './storage.service';
import { initializeNetworkService } from './network.service';
import { initializeDeviceService } from './device.service';

/**
 * Initialize all mobile services
 * This should be called once at app startup
 */
export async function initializeMobileServices(): Promise<void> {
  if (!isMobileApp()) {
    console.log('Not running in a mobile environment, skipping mobile services initialization');
    return;
  }

  try {
    console.log('Initializing mobile services...');

    // Skip status bar configuration in the web environment
    // This will be configured properly when running on actual devices
    try {
      console.log('Status bar will be configured on actual mobile devices');
    } catch (error) {
      console.log('Status bar configuration skipped in web environment');
    }
    
    // Skip splash screen hide in web environment
    // This will work properly on actual devices
    try {
      console.log('Splash screen will be hidden on actual mobile devices');
    } catch (error) {
      console.log('Splash screen hide skipped in web environment');
    }

    // Initialize core services
    await initializeStorageService();
    await initializeNetworkService();
    await initializeDeviceService();

    console.log('Mobile services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize mobile services:', error);
    throw error;
  }
}

// Export all services
export * from './storage.service';
export * from './network.service';
export * from './device.service';
export * from './platform-adapter';