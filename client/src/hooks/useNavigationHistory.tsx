import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook to track navigation history for proper back button navigation
 * This allows back buttons to always go to the previous page, not hardcoded destinations
 */
export function useNavigationHistory() {
  const [location] = useLocation();
  const [history, setHistory] = useState<string[]>([]);
  
  // Update history when location changes
  useEffect(() => {
    // Only add to history if this is a new location, not just a refresh
    if (history.length === 0 || history[history.length - 1] !== location) {
      console.log(`Adding to navigation history: ${location}`);
      setHistory(prev => [...prev, location]);
    }
  }, [location, history]);
  
  // Function to go back to the previous page
  const goBack = () => {
    // Remove current page from history
    const newHistory = [...history];
    newHistory.pop();
    
    // Get the previous page, or default to home
    const previousPage = newHistory.length > 0 ? newHistory[newHistory.length - 1] : '/';
    console.log(`Going back to: ${previousPage} (from ${location})`);
    
    // Update history and return the page to navigate to
    setHistory(newHistory);
    return previousPage;
  };
  
  return {
    history,
    goBack
  };
}