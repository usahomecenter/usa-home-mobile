/**
 * Mobile configuration settings for USA Home app
 * This file contains runtime detection and configuration for mobile platforms
 */

/**
 * Detect if the app is running as a mobile app via Capacitor
 * @returns boolean indicating if running in a Capacitor container
 */
export function isMobileApp(): boolean {
  // Check if window.Capacitor exists (available in native apps)
  return typeof window !== 'undefined' && !!(window as any).Capacitor;
}

/**
 * Mobile platform settings
 */
export const mobileConfig = {
  // Feature flags
  features: {
    enableOfflineMode: true,
    enablePushNotifications: true,
    useNativeShare: true,
    useNativeCamera: true,
    useNativeGeolocation: true,
    useAppBrowser: true,
  },
  
  // Deep linking configuration
  deepLinking: {
    appUrlScheme: 'usahome://', // Custom URL scheme for the app
    webUrl: 'https://usahome.app',
  },
  
  // Storage keys
  storageKeys: {
    userPreferences: 'usa-home-preferences',
    userSession: 'usa-home-session',
    cacheVersion: 'usa-home-cache-version',
    offlineData: 'usa-home-offline-data',
  },
  
  // Network settings
  network: {
    retryAttempts: 3,
    timeoutSeconds: 30,
    cacheStrategy: 'network-first', // 'network-first', 'cache-first', 'network-only'
  },
  
  // App appearance
  appearance: {
    defaultTheme: 'light', // 'light', 'dark', or 'system'
    statusBarStyle: 'light', // 'light' or 'dark'
    splashFadeOutDuration: 300, // in milliseconds
  }
};

/**
 * Get mobile platform-specific value
 * @param iosValue The value to use on iOS
 * @param androidValue The value to use on Android
 * @param defaultValue The fallback value
 * @returns The platform-specific value or default
 */
export function getPlatformValue<T>(iosValue: T, androidValue: T, defaultValue: T): T {
  if (!isMobileApp()) {
    return defaultValue;
  }
  
  // This will be set by the MobileLayout component after platform detection
  const platformClass = document.body.classList.contains('ios-platform') ? 'ios' :
                       document.body.classList.contains('android-platform') ? 'android' : null;
                       
  if (platformClass === 'ios') {
    return iosValue;
  } else if (platformClass === 'android') {
    return androidValue;
  }
  
  return defaultValue;
}

export default mobileConfig;