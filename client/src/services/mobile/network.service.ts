/**
 * Mobile Network Service
 * Handles network connectivity and state for mobile apps
 */

import { Network } from '@capacitor/network';
import { isMobileApp, mobileConfig } from '../../mobile.config';

// Current network status
let isConnected = true;
let connectionType: string = 'unknown';

// Network change listeners
const networkChangeListeners: ((connected: boolean) => void)[] = [];

/**
 * Initialize the network service
 */
export async function initializeNetworkService(): Promise<void> {
  if (!isMobileApp()) {
    console.log('Not running in a mobile environment, using browser network APIs');
    
    // Use browser online/offline events as fallback
    window.addEventListener('online', () => {
      isConnected = true;
      notifyListeners();
    });
    
    window.addEventListener('offline', () => {
      isConnected = false;
      notifyListeners();
    });
    
    return;
  }
  
  try {
    // Get initial network status
    const status = await Network.getStatus();
    isConnected = status.connected;
    connectionType = status.connectionType;
    
    // Listen for network status changes
    Network.addListener('networkStatusChange', status => {
      isConnected = status.connected;
      connectionType = status.connectionType;
      notifyListeners();
      
      console.log('Network status changed:', 
        status.connected ? 'Connected' : 'Disconnected', 
        'Type:', status.connectionType);
    });
    
    console.log('Mobile network service initialized successfully');
    console.log('Current network status:', isConnected ? 'Connected' : 'Disconnected', 'Type:', connectionType);
  } catch (error) {
    console.error('Failed to initialize mobile network service:', error);
    throw error;
  }
}

/**
 * Check if the device is currently connected to the network
 * @returns Whether the device is connected
 */
export async function checkNetworkConnection(): Promise<boolean> {
  if (isMobileApp()) {
    try {
      const status = await Network.getStatus();
      isConnected = status.connected;
      connectionType = status.connectionType;
      return status.connected;
    } catch (error) {
      console.error('Error checking network connection:', error);
      return navigator.onLine;
    }
  } else {
    return navigator.onLine;
  }
}

/**
 * Get the current connection type
 * @returns The connection type (wifi, cellular, none, or unknown)
 */
export async function getConnectionType(): Promise<string> {
  if (isMobileApp()) {
    try {
      const status = await Network.getStatus();
      connectionType = status.connectionType;
      return status.connectionType;
    } catch (error) {
      console.error('Error getting connection type:', error);
      return 'unknown';
    }
  } else {
    return navigator.onLine ? 'wifi' : 'none';
  }
}

/**
 * Register a listener for network status changes
 * @param listener Callback function that receives connection status
 * @returns Function to remove the listener
 */
export function addNetworkChangeListener(listener: (connected: boolean) => void): () => void {
  networkChangeListeners.push(listener);
  
  // Immediately notify with current status
  listener(isConnected);
  
  // Return a function to remove this listener
  return () => {
    const index = networkChangeListeners.indexOf(listener);
    if (index !== -1) {
      networkChangeListeners.splice(index, 1);
    }
  };
}

/**
 * Notify all listeners about network status changes
 */
function notifyListeners(): void {
  networkChangeListeners.forEach(listener => {
    try {
      listener(isConnected);
    } catch (error) {
      console.error('Error in network change listener:', error);
    }
  });
}