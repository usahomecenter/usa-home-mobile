/**
 * Mobile Device Service
 * Provides device capabilities and information for mobile apps
 */

import { Device, DeviceInfo, BatteryInfo } from '@capacitor/device';
import { App } from '@capacitor/app';
import { isMobileApp } from '../../mobile.config';

// Cache device info to avoid frequent native calls
let deviceInfoCache: DeviceInfo | null = null;
let batteryInfoCache: BatteryInfo | null = null;

/**
 * Initialize the device service
 */
export async function initializeDeviceService(): Promise<void> {
  if (!isMobileApp()) {
    console.log('Not running in a mobile environment, device services will be limited');
    return;
  }
  
  try {
    // Pre-cache device info
    deviceInfoCache = await Device.getInfo();
    
    // Set up app state change handlers
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive);
      
      if (isActive) {
        // App came to foreground, refresh battery info
        refreshBatteryInfo();
      }
    });
    
    // Set up back button handler (for Android)
    if (deviceInfoCache.platform === 'android') {
      App.addListener('backButton', handleBackButton);
    }
    
    console.log('Mobile device service initialized successfully');
    console.log('Device info:', deviceInfoCache);
    
    // Get initial battery info
    refreshBatteryInfo();
    
  } catch (error) {
    console.error('Failed to initialize mobile device service:', error);
    throw error;
  }
}

/**
 * Get information about the current device
 * @returns Device information or null if unavailable
 */
export async function getDeviceInfo(): Promise<DeviceInfo | null> {
  if (deviceInfoCache) {
    return deviceInfoCache;
  }
  
  if (isMobileApp()) {
    try {
      deviceInfoCache = await Device.getInfo();
      return deviceInfoCache;
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }
  
  return null;
}

/**
 * Get the device's current battery level
 * @returns Battery information or null if unavailable
 */
export async function getBatteryInfo(): Promise<BatteryInfo | null> {
  if (batteryInfoCache) {
    return batteryInfoCache;
  }
  
  return await refreshBatteryInfo();
}

/**
 * Refresh battery information from device
 * @returns Fresh battery information or null if unavailable
 */
async function refreshBatteryInfo(): Promise<BatteryInfo | null> {
  if (isMobileApp()) {
    try {
      batteryInfoCache = await Device.getBatteryInfo();
      return batteryInfoCache;
    } catch (error) {
      console.error('Error getting battery info:', error);
      return null;
    }
  }
  
  return null;
}

/**
 * Get the device's unique ID
 * @returns Device ID or null if unavailable
 */
export async function getDeviceId(): Promise<string | null> {
  if (isMobileApp()) {
    try {
      const info = await Device.getId();
      return info.identifier;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  }
  
  return null;
}

/**
 * Get device language and region
 * @returns Device language and region info or null if unavailable
 */
export async function getDeviceLanguage(): Promise<{ value: string; } | null> {
  if (isMobileApp()) {
    try {
      return await Device.getLanguageCode();
    } catch (error) {
      console.error('Error getting device language:', error);
      return null;
    }
  }
  
  // For web, return from navigator
  return { value: navigator.language };
}

/**
 * Handle back button press on Android
 * This checks if we can go back in history or exit the app
 */
function handleBackButton({ canGoBack }: { canGoBack: boolean }): void {
  if (canGoBack) {
    window.history.back();
  } else {
    App.exitApp();
  }
}