/**
 * Mobile Storage Service
 * Provides persistent storage capabilities using Capacitor's Preferences API
 */

import { Preferences } from '@capacitor/preferences';
import { isMobileApp, mobileConfig } from '../../mobile.config';

// Cache for optimizing repeated reads (reduces native bridge calls)
const memoryCache: Record<string, any> = {};

/**
 * Initialize the storage service
 */
export async function initializeStorageService(): Promise<void> {
  if (!isMobileApp()) {
    console.log('Not running in a mobile environment, using browser storage');
    return;
  }
  
  try {
    // Verify storage access
    await Preferences.keys();
    console.log('Mobile storage service initialized successfully');
  } catch (error) {
    console.error('Failed to initialize mobile storage service:', error);
    throw error;
  }
}

/**
 * Save data to persistent storage
 * 
 * @param key Storage key
 * @param value Value to store (will be JSON serialized)
 */
export async function saveData(key: string, value: any): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    
    if (isMobileApp()) {
      await Preferences.set({
        key,
        value: jsonValue
      });
    } else {
      localStorage.setItem(key, jsonValue);
    }
    
    // Update memory cache
    memoryCache[key] = value;
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
    throw error;
  }
}

/**
 * Get data from persistent storage
 * 
 * @param key Storage key
 * @param defaultValue Value to return if key doesn't exist
 * @returns Parsed data or defaultValue if not found
 */
export async function getData<T>(key: string, defaultValue: T): Promise<T> {
  try {
    // Return from memory cache if available
    if (memoryCache[key] !== undefined) {
      return memoryCache[key] as T;
    }
    
    let jsonValue: string | null = null;
    
    if (isMobileApp()) {
      const result = await Preferences.get({ key });
      jsonValue = result.value;
    } else {
      jsonValue = localStorage.getItem(key);
    }
    
    if (!jsonValue) {
      return defaultValue;
    }
    
    // Parse and cache the value
    const value = JSON.parse(jsonValue) as T;
    memoryCache[key] = value;
    return value;
  } catch (error) {
    console.error(`Error getting data for key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Remove data from persistent storage
 * 
 * @param key Storage key to remove
 */
export async function removeData(key: string): Promise<void> {
  try {
    if (isMobileApp()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
    
    // Remove from memory cache
    delete memoryCache[key];
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
    throw error;
  }
}

/**
 * Clear all stored data (both persistent and cache)
 */
export async function clearAllData(): Promise<void> {
  try {
    if (isMobileApp()) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
    
    // Clear memory cache
    Object.keys(memoryCache).forEach(key => {
      delete memoryCache[key];
    });
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}

/**
 * Save user preferences to persistent storage
 * 
 * @param preferences User preferences object
 */
export async function saveUserPreferences(preferences: Record<string, any>): Promise<void> {
  await saveData(mobileConfig.storageKeys.userPreferences, preferences);
}

/**
 * Get user preferences from persistent storage
 * 
 * @returns User preferences object or empty object if not found
 */
export async function getUserPreferences(): Promise<Record<string, any>> {
  return await getData<Record<string, any>>(mobileConfig.storageKeys.userPreferences, {});
}

/**
 * Save offline data for the app
 * 
 * @param data Offline data to cache
 */
export async function saveOfflineData(data: Record<string, any>): Promise<void> {
  await saveData(mobileConfig.storageKeys.offlineData, data);
}

/**
 * Get cached offline data
 * 
 * @returns Cached offline data or empty object if not found
 */
export async function getOfflineData(): Promise<Record<string, any>> {
  return await getData<Record<string, any>>(mobileConfig.storageKeys.offlineData, {});
}