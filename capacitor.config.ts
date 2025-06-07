import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'center.usahome.app',
  appName: 'USA Home',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  ios: {
    scheme: 'USAHome',
    backgroundColor: '#ffffff'
  },
  android: {
    backgroundColor: '#FFFFFF'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
