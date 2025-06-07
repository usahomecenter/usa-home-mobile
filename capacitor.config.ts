import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'center.usahome.app',
  appName: 'USA Home',
 webDir: 'dist/public',
  // No longer needed in newer Capacitor versions 
  // bundledWebRuntime: false,
  // App version information is set in native projects
  // Production configuration for iOS App Store deployment
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    url: 'https://usa-home-app.replit.app', // Will be updated with actual deployment URL
    cleartext: false, // Don't allow HTTP traffic in production
    allowNavigation: ['*.replit.app', '*.usahome.com']
  },
  android: {
    buildOptions: {
      keystorePath: 'usahome.keystore',
      keystoreAlias: 'usahome',
      releaseType: 'AAB', // Android App Bundle for Google Play
    },
    backgroundColor: '#FFFFFF',
    // Android specific configurations
    allowMixedContent: false, // Disallow HTTP content on HTTPS sites
    captureInput: true, // Capture keyboard input
    appendUserAgent: 'USAHomeApp/1.1.0',
    initialFocus: true, // Set focus to web view on start
    // Google Play specific
overrideUserAgent: '',
    // Deep links configuration to be added in Android Studio directly
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'USAHome',
    backgroundColor: '#ffffff',
    limitsNavigationsToAppBoundDomains: true,
    // iOS specific configurations
    preferredContentMode: 'mobile',
    appendUserAgent: 'USAHomeApp/1.1.0',
    // App Store specific additional configurations should be set directly in Xcode
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#3880ff',
      androidSpinnerStyle: 'large',
      androidSplashResourceName: 'splash',
      splashFullScreen: true,
      splashImmersive: true
    },
    // Device plugin configuration
    Device: {
      // Optional configurations if needed
    },
    // Network plugin configuration
    Network: {
      // Optional configurations if needed
    },
    // App plugin configuration
    App: {
      webFallback: {
        enabled: true,
        forwardUrl: 'https://usahome.com/'
      }
    }
  }
};

export default config;
