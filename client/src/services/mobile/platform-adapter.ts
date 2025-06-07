/**
 * Platform Adapter Service
 * Provides platform-specific functionality and abstractions
 */

import { Browser } from '@capacitor/browser';
import { isMobileApp } from '../../mobile.config';

/**
 * Platform adapter utility functions
 */
export const platformAdapter = {
  /**
   * Open a URL in the appropriate way based on platform
   * Uses in-app browser on mobile, regular window.open on web
   * 
   * @param url The URL to open
   * @param target Optional target for web (_blank, _self, etc.)
   */
  openUrl: async (url: string, target: string = '_blank'): Promise<void> => {
    if (isMobileApp()) {
      await Browser.open({
        url,
        presentationStyle: 'fullscreen',
        toolbarColor: '#FFFFFF'
      });
    } else {
      window.open(url, target);
    }
  },

  /**
   * Share content by copying to clipboard
   * 
   * @param options Content to share
   * @returns Whether the share was successful
   */
  shareContent: async (options: {
    title?: string;
    text?: string;
    url?: string;
    dialogTitle?: string;
  }): Promise<boolean> => {
    // For all platforms, just use clipboard for now
    try {
      const textToCopy = options.url || options.text || '';
      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        alert('Copied to clipboard!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
};

export default platformAdapter;